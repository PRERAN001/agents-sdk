import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ProjectService } from "@/services/project.service";
import { AwsDeploymentService } from "@/services/awsDeployment.service";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const projects = await ProjectService.getProjects(session?.user?.id);
    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { name, githubRepo, githubBranch, repositoryFullName } = body;

    const repoToDeploy = githubRepo || repositoryFullName || "PRERAN001/agents-sdk";

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    // Trigger automated AWS agent deployment pipeline
    const awsResult = await AwsDeploymentService.deployAgentToAws({
      userId: session?.user?.id,
      projectName: name,
      githubRepo: repoToDeploy,
      githubBranch: githubBranch || "main",
    });

    return NextResponse.json({
      success: true,
      project: awsResult.project,
      deploymentId: awsResult.deploymentId,
      runtimeUrl: awsResult.runtimeUrl,
      awsRegion: awsResult.awsRegion,
    });
  } catch (error: any) {
    console.error("Error creating & deploying project on AWS:", error);
    return NextResponse.json(
      { error: error.message || "Failed to deploy project on AWS" },
      { status: 500 }
    );
  }
}
