import { Octokit } from "@octokit/rest";
import { generateAppJwt } from "./jwt";

/**
 * Interface representing GitHub App installation token response
 */
export interface InstallationAccessToken {
  token: string;
  expires_at: string;
  permissions: Record<string, string>;
  repository_selection: "all" | "selected";
}

/**
 * Returns an Octokit instance authenticated as the GitHub App itself using JWT.
 */
export function getAppOctokit(): Octokit {
  const jwt = generateAppJwt();
  return new Octokit({
    auth: jwt,
    userAgent: "DeployGent-GitHub-App/1.0.0",
  });
}

/**
 * Obtains a short-lived Installation Access Token for a specific GitHub App installation.
 */
export async function getInstallationAccessToken(
  installationId: number
): Promise<InstallationAccessToken> {
  const appOctokit = getAppOctokit();

  const response = await appOctokit.request(
    "POST /app/installations/{installation_id}/access_tokens",
    {
      installation_id: installationId,
    }
  );

  return response.data as InstallationAccessToken;
}

/**
 * Returns an Octokit instance authenticated for a specific installation ID.
 */
export async function getInstallationOctokit(
  installationId: number
): Promise<Octokit> {
  const { token } = await getInstallationAccessToken(installationId);
  return new Octokit({
    auth: token,
    userAgent: "DeployGent-GitHub-App/1.0.0",
  });
}
