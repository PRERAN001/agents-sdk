import { connectDB } from "@/lib/mongodb";
import GitHubInstallation, { IGitHubInstallation } from "@/models/githubInstallation";
import GitHubRepository from "@/models/githubRepository";
import { GitHubAppService } from "./githubApp.service";
import { RepositoryService } from "./repository.service";

export class InstallationService {
  /**
   * Registers or updates a GitHub App installation in MongoDB for a DeployGent user.
   */
  static async upsertInstallation(
    installationId: number,
    userId: string
  ): Promise<IGitHubInstallation> {
    await connectDB();

    // Fetch fresh remote data from GitHub
    const remoteData = await GitHubAppService.getInstallationDetails(installationId);

    const filter = { installationId };
    const update = {
      installationId,
      account: {
        id: remoteData.account.id,
        login: remoteData.account.login,
        type: remoteData.account.type,
        avatarUrl: remoteData.account.avatar_url,
        htmlUrl: remoteData.account.html_url,
      },
      repositorySelection: remoteData.repository_selection,
      permissions: remoteData.permissions || {},
      events: remoteData.events || [],
      userId,
      status: "active" as const,
    };

    const installation = await GitHubInstallation.findOneAndUpdate(
      filter,
      update,
      { upsert: true, new: true, runValidators: true }
    );

    // Sync accessible repositories immediately
    await RepositoryService.syncRepositoriesForInstallation(installationId);

    return installation;
  }

  /**
   * Retrieves all active GitHub App installations owned by a DeployGent user.
   */
  static async getUserInstallations(userId: string): Promise<IGitHubInstallation[]> {
    await connectDB();
    return GitHubInstallation.find({
      userId,
      status: { $ne: "deleted" },
    }).sort({ createdAt: -1 });
  }

  /**
   * Finds a specific installation by installationId.
   */
  static async getInstallationById(installationId: number): Promise<IGitHubInstallation | null> {
    await connectDB();
    return GitHubInstallation.findOne({ installationId, status: { $ne: "deleted" } });
  }

  /**
   * Updates installation status (active, suspended, or deleted) e.g., when receiving GitHub webhooks.
   */
  static async updateInstallationStatus(
    installationId: number,
    status: "active" | "suspended" | "deleted"
  ): Promise<void> {
    await connectDB();
    await GitHubInstallation.findOneAndUpdate(
      { installationId },
      { status }
    );

    if (status === "deleted") {
      // Remove cached repositories associated with deleted installation
      await GitHubRepository.deleteMany({ installationId });
    }
  }

  /**
   * Disconnects/deletes an installation for a DeployGent user.
   */
  static async deleteInstallation(
    installationId: number,
    userId: string
  ): Promise<boolean> {
    await connectDB();
    const result = await GitHubInstallation.findOneAndUpdate(
      { installationId, userId },
      { status: "deleted" }
    );

    if (result) {
      await GitHubRepository.deleteMany({ installationId });
      return true;
    }

    return false;
  }
}
