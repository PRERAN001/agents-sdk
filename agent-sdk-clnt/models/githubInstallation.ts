import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGitHubAccount {
  id: number;
  login: string;
  type: "User" | "Organization";
  avatarUrl: string;
  htmlUrl: string;
}

export interface IGitHubInstallation extends Document {
  installationId: number;
  account: IGitHubAccount;
  repositorySelection: "all" | "selected";
  permissions: Record<string, string>;
  events: string[];
  userId: mongoose.Types.ObjectId | string;
  status: "active" | "suspended" | "deleted";
  createdAt: Date;
  updatedAt: Date;
}

const GitHubInstallationSchema = new Schema<IGitHubInstallation>(
  {
    installationId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    account: {
      id: { type: Number, required: true },
      login: { type: String, required: true, index: true },
      type: {
        type: String,
        enum: ["User", "Organization"],
        required: true,
      },
      avatarUrl: { type: String, required: true },
      htmlUrl: { type: String, required: true },
    },
    repositorySelection: {
      type: String,
      enum: ["all", "selected"],
      required: true,
      default: "all",
    },
    permissions: {
      type: Schema.Types.Mixed,
      default: {},
    },
    events: {
      type: [String],
      default: [],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent recompilation of model during HMR in development
const GitHubInstallation: Model<IGitHubInstallation> =
  mongoose.models.GitHubInstallation ||
  mongoose.model<IGitHubInstallation>("GitHubInstallation", GitHubInstallationSchema);

export default GitHubInstallation;
