import crypto from "crypto";

interface StateData {
  userId: string;
  timestamp: number;
  nonce: string;
}

function getSecret(): string {
  const secret = process.env.AUTH_SECRET || process.env.GITHUB_APP_CLIENT_SECRET;
  if (!secret) {
    throw new Error("Missing AUTH_SECRET or GITHUB_APP_CLIENT_SECRET for state token signing");
  }
  return secret;
}

/**
 * Creates an encrypted/signed state token encoding the user's ID to prevent CSRF attacks.
 */
export function createInstallationState(userId: string): string {
  const data: StateData = {
    userId,
    timestamp: Date.now(),
    nonce: crypto.randomBytes(16).toString("hex"),
  };

  const jsonString = JSON.stringify(data);
  const base64Data = Buffer.from(jsonString).toString("base64url");
  
  const hmac = crypto.createHmac("sha256", getSecret());
  hmac.update(base64Data);
  const signature = hmac.digest("hex");

  return `${base64Data}.${signature}`;
}

/**
 * Verifies a state token against the current user ID and expiration window (15 minutes).
 */
export function verifyInstallationState(
  state: string,
  expectedUserId: string,
  maxAgeMs: number = 15 * 60 * 1000
): { valid: boolean; error?: string } {
  if (!state || !state.includes(".")) {
    return { valid: false, error: "Invalid state token format" };
  }

  const [base64Data, signature] = state.split(".");

  // Verify HMAC signature
  const hmac = crypto.createHmac("sha256", getSecret());
  hmac.update(base64Data);
  const expectedSignature = hmac.digest("hex");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return { valid: false, error: "State token signature mismatch (CSRF warning)" };
  }

  try {
    const jsonString = Buffer.from(base64Data, "base64url").toString("utf8");
    const data: StateData = JSON.parse(jsonString);

    if (data.userId !== expectedUserId) {
      return { valid: false, error: "State token user mismatch" };
    }

    if (Date.now() - data.timestamp > maxAgeMs) {
      return { valid: false, error: "State token has expired" };
    }

    return { valid: true };
  } catch (err) {
    return { valid: false, error: "Failed to parse state token data" };
  }
}
