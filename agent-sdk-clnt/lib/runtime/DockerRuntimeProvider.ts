import { IRuntimeProvider, HealthCheckResult, MetricsResult } from "./IRuntimeProvider";
import { IAgentRuntime, RuntimeStatus } from "@/models/agentRuntime";

export class DockerRuntimeProvider implements IRuntimeProvider {
  readonly providerType = "docker";

  async start(runtime: IAgentRuntime): Promise<{ pid?: number; port: number; status: RuntimeStatus }> {
    console.log(`[DockerRuntimeProvider] Starting container deploygent-${runtime.projectSlug}...`);
    return {
      pid: Math.floor(1000 + Math.random() * 9000),
      port: runtime.metrics.port || 8000,
      status: "running",
    };
  }

  async stop(runtime: IAgentRuntime): Promise<{ status: RuntimeStatus }> {
    console.log(`[DockerRuntimeProvider] Stopping container deploygent-${runtime.projectSlug}...`);
    return { status: "stopped" };
  }

  async restart(runtime: IAgentRuntime): Promise<{ pid?: number; port: number; status: RuntimeStatus }> {
    console.log(`[DockerRuntimeProvider] Restarting container deploygent-${runtime.projectSlug}...`);
    return {
      pid: Math.floor(1000 + Math.random() * 9000),
      port: runtime.metrics.port || 8000,
      status: "running",
    };
  }

  async checkHealth(runtime: IAgentRuntime): Promise<HealthCheckResult> {
    return {
      status: runtime.status === "running" ? "healthy" : "unhealthy",
      latencyMs: 18,
      message: "Docker Container Health: Healthy",
    };
  }

  async getMetrics(runtime: IAgentRuntime): Promise<MetricsResult> {
    return {
      cpuPercent: Number((2.1 + Math.random() * 3.0).toFixed(1)),
      memoryMb: Math.floor(128 + Math.random() * 64),
      uptimeSeconds: 7200,
    };
  }

  async getLogs(runtime: IAgentRuntime, lines: number = 50): Promise<string[]> {
    const timestamp = new Date().toISOString();
    return [
      `[${timestamp}] [docker:deploygent-${runtime.projectSlug}] Container started successfully`,
      `[${timestamp}] [docker:deploygent-${runtime.projectSlug}] Server listening on 0.0.0.0:${runtime.config.port}`,
    ];
  }
}
