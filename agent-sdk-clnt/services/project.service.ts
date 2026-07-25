import { connectDB } from "@/lib/mongodb";
import Project from "@/models/project";

export interface CreateProjectInput {
  userId?: string;
  name: string;
  description?: string;
  githubRepo?: string;
  githubBranch?: string;
  runtimeUrl?: string;
}

export class ProjectService {
  /**
   * Fetches projects owned by user.
   */
  static async getProjects(userId?: string) {
    await connectDB();
    const filter = userId ? { owner: userId } : {};
    return Project.find(filter).sort({ createdAt: -1 });
  }

  /**
   * Fetches single project by ID or slug.
   */
  static async getProjectById(id: string) {
    await connectDB();
    try {
      return await Project.findById(id);
    } catch {
      return null;
    }
  }

  /**
   * Creates a new project entry with all required fields.
   */
  static async createProject(input: CreateProjectInput) {
    await connectDB();

    const slug = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const project = await Project.create({
      owner: input.userId,
      name: input.name,
      slug,
      description: input.description || "Production AI Agent Workflow",
      githubRepo: input.githubRepo || "github.com/deploygent/agent-template",
      githubBranch: input.githubBranch || "main",
      runtimeUrl: input.runtimeUrl || "http://localhost:8000",
      status: "running",
    });

    return project;
  }
}
