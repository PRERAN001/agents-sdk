import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const settings = {
      projectName: "deploygent-agent-core",
      slug: "deploygent-agent-core",
      description: "Production autonomous AI agent runner with SSE log streaming.",
      workspaceId: "ws_prod_9901a8f",
      githubRepo: "PRERAN001/agents-sdk",
      githubBranch: "main",
      buildCommand: "pip install -e . && python -m agent build",
      outputDirectory: "./dist",
      runtimeEnv: "Python 3.12 (Process Driver)",
      productionUrl: "https://deploygent-agent-core.deploygent.app",
      customDomain: "agent.deploygent.dev",
      healthEndpoint: "/health",
      apiToken: "dgt_live_9f82a1b4c6e8d0f2a4b6c8d0e2",
      webhookSecret: "whsec_8f92a1b4c6e8d0f2a4b6",
      autoDeployOnPush: true,
    };

    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();

    // Echo back updated settings
    return NextResponse.json({ success: true, settings: body });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
