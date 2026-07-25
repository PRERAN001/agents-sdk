import crypto from "crypto";

// 32-byte secret key for AES-256-GCM encryption
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_SECRET ||
  "deploygent-production-secret-key-32b!"; // 32 characters

const ALGORITHM = "aes-256-gcm";

export interface EncryptedPayload {
  encryptedValue: string;
  iv: string;
  tag: string;
}

/**
 * Encrypts a plaintext string using AES-256-GCM symmetric encryption.
 */
export function encryptSecret(text: string): EncryptedPayload {
  const iv = crypto.randomBytes(12); // 96-bit IV for GCM
  const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const tag = cipher.getAuthTag().toString("hex");

  return {
    encryptedValue: encrypted,
    iv: iv.toString("hex"),
    tag,
  };
}

/**
 * Decrypts an AES-256-GCM encrypted payload back to plaintext.
 */
export function decryptSecret(encryptedPayload: EncryptedPayload): string {
  try {
    const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
    const iv = Buffer.from(encryptedPayload.iv, "hex");
    const tag = Buffer.from(encryptedPayload.tag, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encryptedPayload.encryptedValue, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("AES Decryption failed:", error);
    return "Decryption error";
  }
}

/**
 * Utility to mask secret values for safe UI display (e.g. sk-live_••••••••••••3a8f).
 */
export function maskSecretValue(value: string): string {
  if (!value) return "••••••••••••";
  if (value.length <= 8) return "••••••••" + value.slice(-2);
  
  const prefix = value.slice(0, 4);
  const suffix = value.slice(-4);
  return `${prefix}••••••••••••${suffix}`;
}
