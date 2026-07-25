import mongoose, { Schema, Document, Model } from "mongoose";

export type ExecutionStatus = "success" | "failed" | "running";

export interface IExecution extends Document {
  user?: mongoose.Types.ObjectId | string;
  project?: mongoose.Types.ObjectId | string;
  executionId: string;
  task: string;
  inputs: Record<string, any>;
  outputs: any;
  runtime: string;
  durationMs: number;
  status: ExecutionStatus;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExecutionSchema = new Schema<IExecution>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      index: true,
    },
    executionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    task: {
      type: String,
      required: true,
      index: true,
    },
    inputs: {
      type: Schema.Types.Mixed,
      default: {},
    },
    outputs: {
      type: Schema.Types.Mixed,
      default: {},
    },
    runtime: {
      type: String,
      default: "Process Runtime (port 8000)",
    },
    durationMs: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["success", "failed", "running"],
      default: "running",
      index: true,
    },
    errorMessage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying user executions sorted by time
ExecutionSchema.index({ user: 1, createdAt: -1 });

const Execution: Model<IExecution> =
  mongoose.models.Execution ||
  mongoose.model<IExecution>("Execution", ExecutionSchema);

export default Execution;