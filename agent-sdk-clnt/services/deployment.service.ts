import { connectDB } from "@/lib/mongodb";
import Deployment, { IDeployment, DeploymentStatus } from "@/models/deployment";
import Project from "@/models/project";

export interface GetDeploymentsOptions {
  userId: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  projectId?: string;
}

export class DeploymentService {
  /**
   * Fetches paginated deployment history records with search, status filter, and project scoping.
   */
  static async getPaginatedDeployments(options: GetDeploymentsOptions) {
    await connectDB();

    const { page = 1, limit = 6, search = "", status = "all", projectId } = options;

    const filter: any = {};

    if (projectId) {
      filter.project = projectId;
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { commitHash: searchRegex },
        { commitMessage: searchRegex },
        { branch: searchRegex },
        { "author.name": searchRegex },
        { "author.username": searchRegex },
      ];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Deployment.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Deployment.countDocuments(filter),
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

  /**
   * Triggers a new redeployment build for a target commit.
   */
  static async redeployDeployment(deploymentId: string): Promise<IDeployment> {
    await connectDB();

    const target = await Deployment.findById(deploymentId);
    if (!target) throw new Error("Deployment not found");

    // Create a fresh deployment record for the redeployment build
    const redeployed = await Deployment.create({
      project: target.project,
      projectName: target.projectName,
      commitHash: target.commitHash,
      commitMessage: `Redeploy: ${target.commitMessage}`,
      author: target.author,
      branch: target.branch,
      status: "building",
      durationSeconds: 0,
      isCurrent: false,
      logs: [`[INFO] Redeployment triggered for commit ${target.commitHash}`],
    });

    // Simulate completion after build
    setTimeout(async () => {
      redeployed.status = "ready";
      redeployed.durationSeconds = 35;
      redeployed.url = `https://${target.projectName}-${target.commitHash}.deploygent.app`;
      await redeployed.save();
    }, 2000);

    return redeployed;
  }

  /**
   * Rolls back production release to a target past successful deployment.
   */
  static async rollbackDeployment(deploymentId: string): Promise<IDeployment> {
    await connectDB();

    const target = await Deployment.findById(deploymentId);
    if (!target) throw new Error("Deployment not found");
    if (target.status !== "ready") {
      throw new Error("Cannot rollback to a deployment that is not in 'ready' status");
    }

    // Reset current active status on all deployments for this project
    await Deployment.updateMany({ project: target.project }, { isCurrent: false });

    target.isCurrent = true;
    await target.save();

    return target;
  }

  /**
   * Deletes a deployment history record.
   */
  static async deleteDeployment(deploymentId: string): Promise<boolean> {
    await connectDB();
    const result = await Deployment.findByIdAndDelete(deploymentId);
    return !!result;
  }
}
