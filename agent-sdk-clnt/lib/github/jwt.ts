import jwt from "jsonwebtoken";

/**
 * Formats the private key string to ensure proper PEM line formatting
 * even if passed via environment variables with escaped newlines or quotes.
 */
function getFormattedPrivateKey(): string {
  let privateKey = process.env.GITHUB_APP_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("Missing GITHUB_APP_PRIVATE_KEY in environment variables");
  }

  privateKey = privateKey.trim();

  // Remove wrapping quotes if present
  if (
    (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
    (privateKey.startsWith("'") && privateKey.endsWith("'"))
  ) {
    privateKey = privateKey.substring(1, privateKey.length - 1);
  }

  // Replace literal '\n' string representations with actual newlines and strip '\r'
  let formatted = privateKey.replace(/\\n/g, "\n").replace(/\r/g, "").trim();

  // Ensure header and footer formatting
  if (
    !formatted.includes("-----BEGIN RSA PRIVATE KEY-----") &&
    !formatted.includes("-----BEGIN PRIVATE KEY-----")
  ) {
    throw new Error("Invalid GITHUB_APP_PRIVATE_KEY format: missing PEM header");
  }

  return formatted;
}

/**
 * Generates an RS256 signed JWT for authenticating as the GitHub App.
 * Valid for 10 minutes per GitHub requirements (issued 60s in past to allow clock skew).
 */
export function generateAppJwt(): string {
  const appId = process.env.GITHUB_APP_ID;
  if (!appId) {
    throw new Error("Missing GITHUB_APP_ID in environment variables");
  }

  const privateKey = getFormattedPrivateKey();
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    iat: now - 60, // Issued 60 seconds ago for clock drift
    exp: now + 600, // Expires in 10 minutes (maximum allowed by GitHub)
    iss: appId,
  };

  return jwt.sign(payload, privateKey, { algorithm: "RS256" });
}
