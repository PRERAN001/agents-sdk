import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { DeploymentService } from "@/services/deployment.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Missing 'action' parameter (redeploy, rollback, delete)" },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case "redeploy":
        result = await DeploymentService.redeployDeployment(id);
        break;

      case "rollback":
        result = await DeploymentService.rollbackDeployment(id);
        break;

      case "delete":
        const deleted = await DeploymentService.deleteDeployment(id);
        return NextResponse.json({ success: deleted, message: "Deployment deleted" });

      default:
        return NextResponse.json(
          { error: `Invalid action '${action}'. Supported: redeploy, rollback, delete` },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, deployment: result });
  } catch (error: any) {
    console.error("Error executing deployment action:", error);
    return NextResponse.json(
      { error: error.message || "Failed to execute deployment action" },
      { status: 500 }
    );
  }
}
