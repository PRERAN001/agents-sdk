import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGitHubRepository extends Document {
  githubId: number;
  installationId: number;
  name: string;
  fullName: string;
  description?: string;
  language?: string;
  stargazersCount?: number;
  owner: {
    login: string;
    id: number;
    type: "User" | "Organization";
    avatarUrl: string;
  };
  private: boolean;
  htmlUrl: string;
  cloneUrl: string;
  defaultBranch: string;
  pushedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GitHubRepositorySchema = new Schema<IGitHubRepository>(
  {
    githubId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    installationId: {
      type: Number,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: "",
      index: true,
    },
    stargazersCount: {
      type: Number,
      default: 0,
    },
    owner: {
      login: { type: String, required: true },
      id: { type: Number, required: true },
      type: { type: String, enum: ["User", "Organization"], required: true },
      avatarUrl: { type: String, default: "" },
    },
    private: {
      type: Boolean,
      required: true,
      default: true,
    },
    htmlUrl: {
      type: String,
      required: true,
    },
    cloneUrl: {
      type: String,
      required: true,
    },
    defaultBranch: {
      type: String,
      required: true,
      default: "main",
    },
    pushedAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for rapid search and filter performance
GitHubRepositorySchema.index({ installationId: 1, fullName: 1 });
GitHubRepositorySchema.index(
  { fullName: "text", description: "text" },
  { language_override: "dummy_lang_override" } as any
);

const GitHubRepository: Model<IGitHubRepository> =
  mongoose.models.GitHubRepository ||
  mongoose.model<IGitHubRepository>("GitHubRepository", GitHubRepositorySchema);

export default GitHubRepository;
