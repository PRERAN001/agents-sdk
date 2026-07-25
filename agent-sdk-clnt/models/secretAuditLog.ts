import mongoose, { Schema, Document, Model } from "mongoose";

export type AuditAction = "CREATED" | "REVEALED" | "ROTATED" | "UPDATED" | "DELETED";

export interface ISecretAuditLog extends Document {
  secretId?: string;
  secretKey: string;
  action: AuditAction;
  user: string;
  environment: string;
  details?: string;
  createdAt: Date;
}

const SecretAuditLogSchema = new Schema<ISecretAuditLog>(
  {
    secretId: String,
    secretKey: { type: String, required: true, index: true },
    action: {
      type: String,
      enum: ["CREATED", "REVEALED", "ROTATED", "UPDATED", "DELETED"],
      required: true,
    },
    user: { type: String, default: "User" },
    environment: { type: String, default: "production" },
    details: String,
  },
  {
    timestamps: true,
  }
);

const SecretAuditLog: Model<ISecretAuditLog> =
  mongoose.models.SecretAuditLog ||
  mongoose.model<ISecretAuditLog>("SecretAuditLog", SecretAuditLogSchema);

export default SecretAuditLog;
