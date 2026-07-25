import mongoose, { Schema, Document, Model } from "mongoose";

export type SecretEnvironment = "production" | "preview" | "development";

export interface ISecret extends Document {
  project?: mongoose.Types.ObjectId | string;
  user?: mongoose.Types.ObjectId | string;
  key: string;
  encryptedValue: string;
  iv: string;
  tag: string;
  environment: SecretEnvironment;
  category: string;
  lastRotatedAt: Date;
  rotationCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const SecretSchema = new Schema<ISecret>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    key: {
      type: String,
      required: true,
      index: true,
    },
    encryptedValue: {
      type: String,
      required: true,
    },
    iv: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    environment: {
      type: String,
      enum: ["production", "preview", "development"],
      default: "production",
      index: true,
    },
    category: {
      type: String,
      default: "API Key",
    },
    lastRotatedAt: {
      type: Date,
      default: Date.now,
    },
    rotationCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

SecretSchema.index({ user: 1, key: 1, environment: 1 }, { unique: true });

const Secret: Model<ISecret> =
  mongoose.models.Secret || mongoose.model<ISecret>("Secret", SecretSchema);

export default Secret;