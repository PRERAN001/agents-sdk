import { connectDB } from "@/lib/mongodb";
import AgentRuntime, { IAgentRuntime, RuntimeStatus, HealthStatus } from "@/models/agentRuntime";
import Project from "@/models/project";
import { RuntimeFactory } from "@/lib/runtime/RuntimeFactory";

export class RuntimeService {
  /**
   * Initializes default runtimes for projects owned by user if not already existing.
   */
  static async syncRuntimesForUser(userId: string): Promise<IAgentRuntime[]> {
    await connectDB();

    const userProjects = await Project.find({ owner: userId });

    for (const proj of userProjects) {
      const existing = await AgentRuntime.findOne({ projectId: proj._id });
      if (!existing) {
        // Create initial runtime record for project
        const port = 8000 + Math.floor(Math.random() * 900);
        await AgentRuntime.create({
          projectId: proj._id,
          projectName: proj.name,
          projectSlug: proj.slug || proj.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
          runtimeId: `rt-${proj.name.toLowerCase().replace(/[^a-z0-9]/g, "")}-${Math.floor(Math.random() * 1000)}`,
          status: "stopped",
          provider: "process",
          health: {
            status: "unknown",
            consecutiveFailures: 0,
            endpoint: `http://localhost:${port}/health`,
          },
          metrics: {
            cpuPercent: 0,
            memoryMb: 0,
            maxMemoryMb: 512,
            uptimeSeconds: 0,
            port,
          },
          config: {
            environment: { NODE_ENV: "production", PORT: port.toString() },
            port,
            command: "python -m deploygent serve",
          },
          logs: [`System initialized for project ${proj.name}`],
        });
      }
    }

    return AgentRuntime.find().sort({ updatedAt: -1 });
  }

  /**
   * Retrieves all project runtimes owned by the user.
   */
  static async getAllRuntimes(userId: string): Promise<IAgentRuntime[]> {
    await connectDB();
    await this.syncRuntimesForUser(userId);
    return AgentRuntime.find().sort({ updatedAt: -1 });
  }

  /**
   * Fetches single runtime by project ID.
   */
  static async getRuntimeByProjectId(projectId: string): Promise<IAgentRuntime | null> {
    await connectDB();
    return AgentRuntime.findOne({ projectId });
  }

  /**
   * Starts an agent runtime.
   */
  static async startRuntime(projectId: string): Promise<IAgentRuntime> {
    await connectDB();

    const runtime = await AgentRuntime.findOne({ projectId });
    if (!runtime) throw new Error("Runtime not found for project");

    const driver = RuntimeFactory.getProvider(runtime.provider);
    const startResult = await driver.start(runtime);

    const now = new Date();
    runtime.status = startResult.status;
    runtime.lastStartedAt = now;
    runtime.metrics.pid = startResult.pid;
    runtime.health.status = "checking";
    runtime.health.consecutiveFailures = 0;
    runtime.logs.push(`[${now.toISOString()}] Starting runtime process (PID ${startResult.pid || "N/A"})...`);

    // Fetch initial metrics
    const metrics = await driver.getMetrics(runtime);
    runtime.metrics.cpuPercent = metrics.cpuPercent;
    runtime.metrics.memoryMb = metrics.memoryMb;
    runtime.metrics.uptimeSeconds = metrics.uptimeSeconds;

    await runtime.save();
    return runtime;
  }

  /**
   * Gracefully stops an agent runtime.
   */
  static async stopRuntime(projectId: string): Promise<IAgentRuntime> {
    await connectDB();

    const runtime = await AgentRuntime.findOne({ projectId });
    if (!runtime) throw new Error("Runtime not found for project");

    const driver = RuntimeFactory.getProvider(runtime.provider);
    await driver.stop(runtime);

    const now = new Date();
    runtime.status = "stopped";
    runtime.lastStoppedAt = now;
    runtime.metrics.pid = undefined;
    runtime.metrics.cpuPercent = 0;
    runtime.metrics.memoryMb = 0;
    runtime.health.status = "unknown";
    runtime.logs.push(`[${now.toISOString()}] Runtime process stopped gracefully.`);

    await runtime.save();
    return runtime;
  }

  /**
   * Restarts an agent runtime.
   */
  static async restartRuntime(projectId: string): Promise<IAgentRuntime> {
    await connectDB();

    const runtime = await AgentRuntime.findOne({ projectId });
    if (!runtime) throw new Error("Runtime not found for project");

    runtime.status = "restarting";
    runtime.restartsCount = (runtime.restartsCount || 0) + 1;
    await runtime.save();

    const driver = RuntimeFactory.getProvider(runtime.provider);
    const restartResult = await driver.restart(runtime);

    const now = new Date();
    runtime.status = restartResult.status;
    runtime.lastStartedAt = now;
    runtime.metrics.pid = restartResult.pid;
    runtime.health.status = "healthy";
    runtime.health.consecutiveFailures = 0;
    runtime.logs.push(`[${now.toISOString()}] Runtime restarted successfully.`);

    const metrics = await driver.getMetrics(runtime);
    runtime.metrics.cpuPercent = metrics.cpuPercent;
    runtime.metrics.memoryMb = metrics.memoryMb;

    await runtime.save();
    return runtime;
  }

  /**
   * Pings runtime health check endpoint and updates metrics.
   */
  static async checkHealth(projectId: string): Promise<{ runtime: IAgentRuntime; health: HealthStatus }> {
    await connectDB();

    const runtime = await AgentRuntime.findOne({ projectId });
    if (!runtime) throw new Error("Runtime not found for project");

    const driver = RuntimeFactory.getProvider(runtime.provider);
    const healthResult = await driver.checkHealth(runtime);
    const metricsResult = await driver.getMetrics(runtime);

    runtime.health.lastCheckedAt = new Date();
    runtime.health.status = healthResult.status;
    runtime.metrics.cpuPercent = metricsResult.cpuPercent;
    runtime.metrics.memoryMb = metricsResult.memoryMb;
    runtime.metrics.uptimeSeconds = metricsResult.uptimeSeconds;

    if (healthResult.status === "unhealthy") {
      runtime.health.consecutiveFailures += 1;
      if (runtime.health.consecutiveFailures >= 3) {
        runtime.status = "failed";
        runtime.errorMessage = "Consecutive health checks failed (3/3)";
      }
    } else {
      runtime.health.consecutiveFailures = 0;
      if (runtime.status === "failed") {
        runtime.status = "running";
      }
    }

    await runtime.save();
    return { runtime, health: healthResult.status };
  }
}
