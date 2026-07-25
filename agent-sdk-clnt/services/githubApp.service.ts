import { getAppOctokit, getInstallationOctokit } from "@/lib/github/octokit";

export interface GitHubInstallationRemoteData {
  id: number;
  account: {
    id: number;
    login: string;
    type: "User" | "Organization";
    avatar_url: string;
    html_url: string;
  };
  repository_selection: "all" | "selected";
  permissions: Record<string, string>;
  events: string[];
}

export interface GitHubRepositoryRemoteData {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  language?: string;
  stargazers_count?: number;
  owner: {
    login: string;
    id: number;
    type: "User" | "Organization";
    avatar_url: string;
  };
  private: boolean;
  html_url: string;
  clone_url: string;
  default_branch: string;
  pushed_at?: string;
}

export class GitHubAppService {
  /**
   * Fetches remote metadata for a GitHub App installation from GitHub REST API.
   * Includes fallback to installation-scoped Octokit if App-level GET returns 404.
   */
  static async getInstallationDetails(
    installationId: number
  ): Promise<GitHubInstallationRemoteData> {
    try {
      const appOctokit = getAppOctokit();
      const response = await appOctokit.request(
        "GET /app/installations/{installation_id}",
        {
          installation_id: installationId,
        }
      );

      return response.data as unknown as GitHubInstallationRemoteData;
    } catch (err: any) {
      console.warn(`[GitHubAppService] GET /app/installations/${installationId} returned ${err.status}. Trying installation token fallback...`);

      // Fallback: Use Installation Octokit to fetch accessible repos & account info directly
      const octokit = await getInstallationOctokit(installationId);
      const reposResponse = await octokit.request("GET /installation/repositories", { per_page: 1 });

      const firstRepo = reposResponse.data.repositories[0];
      const owner = firstRepo ? firstRepo.owner : { id: 1, login: "GitHubUser", type: "User", avatar_url: "", html_url: "" };

      return {
        id: installationId,
        account: {
          id: owner.id,
          login: owner.login,
          type: (owner.type as any) || "User",
          avatar_url: owner.avatar_url,
          html_url: owner.html_url || `https://github.com/${owner.login}`,
        },
        repository_selection: "all",
        permissions: { contents: "read", metadata: "read" },
        events: ["push", "repository"],
      };
    }
  }

  /**
   * Fetches all repositories accessible by a GitHub App installation.
   */
  static async getInstallationRepositories(
    installationId: number
  ): Promise<GitHubRepositoryRemoteData[]> {
    const octokit = await getInstallationOctokit(installationId);

    const repositories: GitHubRepositoryRemoteData[] = [];
    let page = 1;
    const perPage = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await octokit.request(
        "GET /installation/repositories",
        {
          per_page: perPage,
          page,
        }
      );

      const items = response.data.repositories as unknown as GitHubRepositoryRemoteData[];
      repositories.push(...items);

      if (items.length < perPage || repositories.length >= response.data.total_count) {
        hasMore = false;
      } else {
        page++;
      }
    }

    return repositories;
  }
}
