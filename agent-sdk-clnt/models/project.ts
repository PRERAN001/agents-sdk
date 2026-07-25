import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  owner?: any;
  name: string;
  slug?: string;
  description?: string;
  githubRepo?: string;
  githubBranch?: string;
  runtimeUrl?: string;
  metadata?: any;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: String,
    slug: String,
    description: String,
    githubRepo: String,
    githubBranch: String,
    runtimeUrl: String,
    metadata: Object,
    status: {
      type: String,
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);