import { connectDB } from "@/lib/mongodb";
import Secret, { ISecret, SecretEnvironment } from "@/models/secret";
import SecretAuditLog, { AuditAction } from "@/models/secretAuditLog";
import { encryptSecret, decryptSecret, maskSecretValue } from "@/lib/crypto";

export interface CreateSecretInput {
  userId?: string;
  projectId?: string;
  key: string;
  value: string;
  environment?: SecretEnvironment;
  category?: string;
}

export class SecretService {
  /**
   * Validate key format enforcing UPPERCASE_SNAKE_CASE (e.g. OPENAI_API_KEY).
   */
  static validateKeyFormat(key: string): boolean {
    return /^[A-Z][A-Z0-9_]*$/.test(key);
  }

  /**
   * Fetches secret records with masked values.
   */
  static async getSecrets(options: { userId?: string; environment?: string; search?: string }) {
    await connectDB();

    const filter: any = {};
    if (options.environment && options.environment !== "all") {
      filter.environment = options.environment;
    }

    if (options.search?.trim()) {
      filter.key = new RegExp(options.search.trim(), "i");
    }

    const secrets = await Secret.find(filter).sort({ createdAt: -1 });

    return secrets.map((sec) => {
      const decrypted = decryptSecret({
        encryptedValue: sec.encryptedValue,
        iv: sec.iv,
        tag: sec.tag,
      });

      return {
        _id: (sec._id as unknown as string),
        key: sec.key,
        maskedValue: maskSecretValue(decrypted),
        environment: sec.environment,
        category: sec.category,
        lastRotatedAt: sec.lastRotatedAt,
        rotationCount: sec.rotationCount,
        createdAt: sec.createdAt,
        updatedAt: sec.updatedAt,
      };
    });
  }

  /**
   * Decrypts secret value and records REVEALED audit event.
   */
  static async getUnmaskedSecret(id: string, userEmail: string = "User"): Promise<string> {
    await connectDB();
    const secret = await Secret.findById(id);
    if (!secret) throw new Error("Secret not found");

    const raw = decryptSecret({
      encryptedValue: secret.encryptedValue,
      iv: secret.iv,
      tag: secret.tag,
    });

    await SecretAuditLog.create({
      secretId: (secret._id as unknown as string),
      secretKey: secret.key,
      action: "REVEALED",
      user: userEmail,
      environment: secret.environment,
      details: "Secret value decrypted and unmasked",
    });

    return raw;
  }

  /**
   * Creates a new encrypted secret entry.
   */
  static async createSecret(input: CreateSecretInput, userEmail: string = "User") {
    await connectDB();

    if (!this.validateKeyFormat(input.key)) {
      throw new Error(
        "Invalid key format. Environment keys must use UPPERCASE_SNAKE_CASE (e.g. AWS_SECRET_ACCESS_KEY)."
      );
    }

    const encrypted = encryptSecret(input.value);

    const secret = await Secret.create({
      user: input.userId,
      project: input.projectId,
      key: input.key,
      encryptedValue: encrypted.encryptedValue,
      iv: encrypted.iv,
      tag: encrypted.tag,
      environment: input.environment || "production",
      category: input.category || "API Key",
      lastRotatedAt: new Date(),
      rotationCount: 1,
    });

    await SecretAuditLog.create({
      secretId: (secret._id as unknown as string),
      secretKey: secret.key,
      action: "CREATED",
      user: userEmail,
      environment: secret.environment,
      details: `Secret created under category '${secret.category}'`,
    });

    return secret;
  }

  /**
   * Rotates a secret value and updates rotation statistics.
   */
  static async rotateSecret(id: string, newValue: string, userEmail: string = "User") {
    await connectDB();
    const secret = await Secret.findById(id);
    if (!secret) throw new Error("Secret not found");

    const encrypted = encryptSecret(newValue);
    secret.encryptedValue = encrypted.encryptedValue;
    secret.iv = encrypted.iv;
    secret.tag = encrypted.tag;
    secret.lastRotatedAt = new Date();
    secret.rotationCount += 1;
    await secret.save();

    await SecretAuditLog.create({
      secretId: (secret._id as unknown as string),
      secretKey: secret.key,
      action: "ROTATED",
      user: userEmail,
      environment: secret.environment,
      details: `Secret value rotated (rotation #${secret.rotationCount})`,
    });

    return secret;
  }

  /**
   * Deletes a secret entry and logs DELETED audit event.
   */
  static async deleteSecret(id: string, userEmail: string = "User"): Promise<boolean> {
    await connectDB();
    const secret = await Secret.findById(id);
    if (!secret) return false;

    await SecretAuditLog.create({
      secretId: (secret._id as unknown as string),
      secretKey: secret.key,
      action: "DELETED",
      user: userEmail,
      environment: secret.environment,
      details: "Secret permanently deleted",
    });

    await Secret.findByIdAndDelete(id);
    return true;
  }

  /**
   * Fetches audit history records.
   */
  static async getAuditLogs(secretKey?: string) {
    await connectDB();
    const filter: any = {};
    if (secretKey) filter.secretKey = secretKey;

    return SecretAuditLog.find(filter).sort({ createdAt: -1 }).limit(50);
  }
}
