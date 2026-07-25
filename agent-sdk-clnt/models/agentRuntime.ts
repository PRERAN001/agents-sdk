import mongoose, { Schema, Document, Model } from "mongoose";

export type RuntimeStatus = "running" | "stopped" | "restarting" | "failed";
export type HealthStatus = "healthy" | "unhealthy" | "checking" | "unknown";
export type RuntimeProviderType = "process" | "docker" | "kubernetes";

export interface IAgentRuntime extends Document {
  projectId: mongoose.Types.ObjectId | string;
  projectName: string;
  projectSlug: string;
  runtimeId: string;
  status: RuntimeStatus;
  provider: RuntimeProviderType;
  health: {
    status: HealthStatus;
    lastCheckedAt?: Date;
    consecutiveFailures: number;
    endpoint: string;
  };
  metrics: {
    cpuPercent: number;
    memoryMb: number;
    maxMemoryMb: number;
    uptimeSeconds: number;
    pid?: number;
    port: number;
  };
  config: {
    environment: Record<string, string>;
    port: number;
    command: string;
    containerImage?: string;
  };
  logs: string[];
  restartsCount: number;
  lastStartedAt?: Date;
  lastStoppedAt?: Date;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AgentRuntimeSchema = new Schema<IAgentRuntime>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      unique: true,
      index: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    projectSlug: {
      type: String,
      required: true,
    },
    runtimeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["running", "stopped", "restarting", "failed"],
      default: "stopped",
      index: true,
    },
    provider: {
      type: String,
      enum: ["process", "docker", "kubernetes"],
      default: "process",
      index: true,
    },
    health: {
      status: {
        type: String,
        enum: ["healthy", "unhealthy", "checking", "unknown"],
        default: "unknown",
      },
      lastCheckedAt: { type: Date },
      consecutiveFailures: { type: Number, default: 0 },
      endpoint: { type: String, default: "/health" },
    },
    metrics: {
      cpuPercent: { type: Number, default: 0 },
      memoryMb: { type: Number, default: 0 },
      maxMemoryMb: { type: Number, default: 512 },
      uptimeSeconds: { type: Number, default: 0 },
      pid: { type: Number },
      port: { type: Number, required: true },
    },
    config: {
      environment: { type: Schema.Types.Mixed, default: {} },
      port: { type: Number, required: true, default: 8000 },
      command: { type: String, default: "python -m deploygent serve" },
      containerImage: { type: String },
    },
    logs: {
      type: [String],
      default: [],
    },
    restartsCount: {
      type: Number,
      default: 0,
    },
    lastStartedAt: { type: Date },
    lastStoppedAt: { type: Date },
    errorMessage: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const AgentRuntime: Model<IAgentRuntime> =
  mongoose.models.AgentRuntime ||
  mongoose.model<IAgentRuntime>("AgentRuntime", AgentRuntimeSchema);

export default AgentRuntime;
