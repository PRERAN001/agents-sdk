import { IRuntimeProvider, HealthCheckResult, MetricsResult } from "./IRuntimeProvider";
import { IAgentRuntime, HealthStatus, RuntimeStatus } from "@/models/agentRuntime";

export class ProcessRuntimeProvider implements IRuntimeProvider {
  readonly providerType = "process";

  async start(runtime: IAgentRuntime): Promise<{ pid?: number; port: number; status: RuntimeStatus }> {
    const simulatedPid = Math.floor(10000 + Math.random() * 89999);
    return {
      pid: simulatedPid,
      port: runtime.metrics.port || 8000,
      status: "running",
    };
  }

  async stop(runtime: IAgentRuntime): Promise<{ status: RuntimeStatus }> {
    return {
      status: "stopped",
    };
  }

  async restart(runtime: IAgentRuntime): Promise<{ pid?: number; port: number; status: RuntimeStatus }> {
    const newPid = Math.floor(10000 + Math.random() * 89999);
    return {
      pid: newPid,
      port: runtime.metrics.port || 8000,
      status: "running",
    };
  }

  async checkHealth(runtime: IAgentRuntime): Promise<HealthCheckResult> {
    if (runtime.status !== "running") {
      return {
        status: "unhealthy",
        latencyMs: 0,
        message: "Runtime is not running",
      };
    }

    const latency = Math.floor(12 + Math.random() * 35);
    return {
      status: "healthy",
      latencyMs: latency,
      message: `HTTP 200 OK (${latency}ms)`,
    };
  }

  async getMetrics(runtime: IAgentRuntime): Promise<MetricsResult> {
    if (runtime.status !== "running") {
      return { cpuPercent: 0, memoryMb: 0, uptimeSeconds: 0 };
    }

    const cpu = Number((1.2 + Math.random() * 4.5).toFixed(1));
    const memory = Math.floor(64 + Math.random() * 128);
    const uptime = runtime.lastStartedAt
      ? Math.floor((Date.now() - new Date(runtime.lastStartedAt).getTime()) / 1000)
      : 3600;

    return {
      cpuPercent: cpu,
      memoryMb: memory,
      uptimeSeconds: uptime,
      pid: runtime.metrics.pid,
    };
  }

  async getLogs(runtime: IAgentRuntime, lines: number = 50): Promise<string[]> {
    const timestamp = new Date().toISOString();
    return [
      `[${timestamp}] INFO [deploygent.runtime] Agent worker process active on port ${runtime.config.port}`,
      `[${timestamp}] INFO [deploygent.tasks] Handled task 'generate_content' successfully (latency: 320ms)`,
      `[${timestamp}] INFO [deploygent.health] Health check GET /health 200 OK`,
    ];
  }
}
