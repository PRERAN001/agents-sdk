import mongoose, { Schema, Document, Model } from "mongoose";

export type DeploymentStatus = "ready" | "building" | "failed" | "canceled";

export interface IDeploymentAuthor {
  name: string;
  avatarUrl: string;
  username: string;
}

export interface IDeployment extends Document {
  project: mongoose.Types.ObjectId | string;
  projectName: string;
  commitHash: string;
  commitMessage: string;
  author: IDeploymentAuthor;
  branch: string;
  status: DeploymentStatus;
  durationSeconds: number;
  url?: string;
  isCurrent: boolean;
  logs: string[];
  createdAt: Date;
  updatedAt: Date;
}

const DeploymentSchema = new Schema<IDeployment>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    commitHash: {
      type: String,
      required: true,
      index: true,
    },
    commitMessage: {
      type: String,
      required: true,
    },
    author: {
      name: { type: String, required: true },
      avatarUrl: { type: String, default: "" },
      username: { type: String, required: true },
    },
    branch: {
      type: String,
      required: true,
      default: "main",
      index: true,
    },
    status: {
      type: String,
      enum: ["ready", "building", "failed", "canceled"],
      default: "building",
      index: true,
    },
    durationSeconds: {
      type: Number,
      default: 0,
    },
    url: {
      type: String,
    },
    isCurrent: {
      type: Boolean,
      default: false,
      index: true,
    },
    logs: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

DeploymentSchema.index({ project: 1, createdAt: -1 });

const Deployment: Model<IDeployment> =
  mongoose.models.Deployment ||
  mongoose.model<IDeployment>("Deployment", DeploymentSchema);

export default Deployment;