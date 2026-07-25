import crypto from "crypto";

/**
 * Validates GitHub Webhook HMAC SHA-256 signature against the request body.
 *
 * @param payload Raw string or Buffer of the incoming request body
 * @param signature X-Hub-Signature-256 header from GitHub
 * @returns boolean indicating whether the webhook payload is authentic
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string | null
): boolean {
  const secret = process.env.GITHUB_APP_WEBHOOK_SECRET;

  if (!secret) {
    console.error("Missing GITHUB_APP_WEBHOOK_SECRET environment variable");
    return false;
  }

  if (!signature || !signature.startsWith("sha256=")) {
    return false;
  }

  const signatureHash = signature.replace("sha256=", "");
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const expectedHash = hmac.digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signatureHash, "hex"),
      Buffer.from(expectedHash, "hex")
    );
  } catch (error) {
    return false;
  }
}
