import { connectDB } from "@/lib/mongodb";
import GitHubRepository, { IGitHubRepository } from "@/models/githubRepository";
import GitHubInstallation from "@/models/githubInstallation";
import { GitHubAppService, GitHubRepositoryRemoteData } from "./githubApp.service";

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface BrowseOptions {
  userId: string;
  page?: number;
  limit?: number;
  search?: string;
  installationId?: number;
  language?: string;
  sort?: "pushedAt" | "name" | "stars";
}

export class RepositoryService {
  /**
   * Syncs all accessible repositories for a given GitHub App installation with MongoDB.
   */
  static async syncRepositoriesForInstallation(
    installationId: number
  ): Promise<IGitHubRepository[]> {
    await connectDB();

    const remoteRepos = await GitHubAppService.getInstallationRepositories(installationId);

    const bulkOps = remoteRepos.map((repo: GitHubRepositoryRemoteData) => ({
      updateOne: {
        filter: { githubId: repo.id },
        update: {
          githubId: repo.id,
          installationId,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description || "",
          language: repo.language || "",
          stargazersCount: repo.stargazers_count || 0,
          owner: {
            login: repo.owner.login,
            id: repo.owner.id,
            type: repo.owner.type,
            avatarUrl: repo.owner.avatar_url || "",
          },
          private: repo.private,
          htmlUrl: repo.html_url,
          cloneUrl: repo.clone_url,
          defaultBranch: repo.default_branch,
          pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : undefined,
        },
        upsert: true,
      },
    }));

    if (bulkOps.length > 0) {
      await GitHubRepository.bulkWrite(bulkOps);
    }

    // Remove any DB repositories that are no longer accessible under this installation
    const currentGithubIds = remoteRepos.map((r) => r.id);
    await GitHubRepository.deleteMany({
      installationId,
      githubId: { $nin: currentGithubIds },
    });

    return GitHubRepository.find({ installationId }).sort({ fullName: 1 });
  }

  /**
   * Adds specified repositories when an `installation_repositories.added` webhook is received.
   */
  static async addRepositories(
    installationId: number,
    addedRepos: Array<{ id: number; name: string; full_name: string; private: boolean }>
  ): Promise<void> {
    await connectDB();
    await this.syncRepositoriesForInstallation(installationId);
  }

  /**
   * Removes specified repositories when an `installation_repositories.removed` webhook is received.
   */
  static async removeRepositories(
    installationId: number,
    removedRepoIds: number[]
  ): Promise<void> {
    await connectDB();
    await GitHubRepository.deleteMany({
      installationId,
      githubId: { $in: removedRepoIds },
    });
  }

  /**
   * Fetches all synced repositories accessible to a DeployGent user across all their active installations.
   */
  static async getRepositoriesForUser(userId: string): Promise<IGitHubRepository[]> {
    await connectDB();

    const installations = await GitHubInstallation.find({
      userId,
      status: "active",
    }).select("installationId");

    const installationIds = installations.map((inst) => inst.installationId);

    if (installationIds.length === 0) {
      return [];
    }

    return GitHubRepository.find({
      installationId: { $in: installationIds },
    }).sort({ fullName: 1 });
  }

  /**
   * Fetches repositories for a specific installation ID.
   */
  static async getRepositoriesByInstallationId(
    installationId: number
  ): Promise<IGitHubRepository[]> {
    await connectDB();
    return GitHubRepository.find({ installationId }).sort({ fullName: 1 });
  }

  /**
   * Paginated, searchable, filterable repository browser method for DeployGent dashboard.
   */
  static async getPaginatedRepositoriesForUser(
    options: BrowseOptions
  ): Promise<PaginatedResult<IGitHubRepository>> {
    await connectDB();

    const {
      userId,
      page = 1,
      limit = 12,
      search = "",
      installationId,
      language = "",
      sort = "pushedAt",
    } = options;

    // Determine target installation IDs accessible by this user
    let targetInstallationIds: number[] = [];

    if (installationId) {
      // Verify user owns/accesses this installation
      const userInst = await GitHubInstallation.findOne({
        installationId,
        userId,
        status: "active",
      });
      if (userInst) {
        targetInstallationIds = [installationId];
      }
    } else {
      const userInsts = await GitHubInstallation.find({
        userId,
        status: "active",
      }).select("installationId");
      targetInstallationIds = userInsts.map((inst) => inst.installationId);
    }

    if (targetInstallationIds.length === 0) {
      return {
        data: [],
        pagination: {
          total: 0,
          page,
          limit,
          totalPages: 0,
          hasMore: false,
        },
      };
    }

    // Build MongoDB Filter
    const filter: any = {
      installationId: { $in: targetInstallationIds },
    };

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { fullName: searchRegex },
        { description: searchRegex },
        { "owner.login": searchRegex },
      ];
    }

    if (language.trim()) {
      filter.language = new RegExp(`^${language.trim()}$`, "i");
    }

    // Sort order
    let sortOptions: any = { pushedAt: -1 };
    if (sort === "name") {
      sortOptions = { name: 1 };
    } else if (sort === "stars") {
      sortOptions = { stargazersCount: -1 };
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      GitHubRepository.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit),
      GitHubRepository.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  }
}
