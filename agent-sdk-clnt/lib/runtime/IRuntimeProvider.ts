import { IAgentRuntime, HealthStatus, RuntimeStatus } from "@/models/agentRuntime";

export interface HealthCheckResult {
  status: HealthStatus;
  latencyMs: number;
  message?: string;
}

export interface MetricsResult {
  cpuPercent: number;
  memoryMb: number;
  uptimeSeconds: number;
  pid?: number;
}

export interface IRuntimeProvider {
  /**
   * Provider identifier ("process", "docker", "kubernetes")
   */
  readonly providerType: string;

  /**
   * Starts an independent agent runtime.
   */
  start(runtime: IAgentRuntime): Promise<{ pid?: number; port: number; status: RuntimeStatus }>;

  /**
   * Gracefully stops an active agent runtime.
   */
  stop(runtime: IAgentRuntime): Promise<{ status: RuntimeStatus }>;

  /**
   * Restarts an active or failed agent runtime.
   */
  restart(runtime: IAgentRuntime): Promise<{ pid?: number; port: number; status: RuntimeStatus }>;

  /**
   * Pings runtime health check endpoint.
   */
  checkHealth(runtime: IAgentRuntime): Promise<HealthCheckResult>;

  /**
   * Fetches real-time CPU, RAM, and uptime metrics.
   */
  getMetrics(runtime: IAgentRuntime): Promise<MetricsResult>;

  /**
   * Retrieves recent stdout/stderr log lines.
   */
  getLogs(runtime: IAgentRuntime, lines?: number): Promise<string[]>;
}
