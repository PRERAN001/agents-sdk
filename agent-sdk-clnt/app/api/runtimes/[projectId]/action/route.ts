import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { RuntimeService } from "@/services/runtime.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in." },
        { status: 401 }
      );
    }

    const { projectId } = await params;
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { error: "Missing 'action' parameter (start, stop, restart, health_check)" },
        { status: 400 }
      );
    }

    let updatedRuntime;

    switch (action) {
      case "start":
        updatedRuntime = await RuntimeService.startRuntime(projectId);
        break;

      case "stop":
        updatedRuntime = await RuntimeService.stopRuntime(projectId);
        break;

      case "restart":
        updatedRuntime = await RuntimeService.restartRuntime(projectId);
        break;

      case "health_check":
        const result = await RuntimeService.checkHealth(projectId);
        updatedRuntime = result.runtime;
        break;

      default:
        return NextResponse.json(
          { error: `Invalid action '${action}'. Supported: start, stop, restart, health_check` },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, runtime: updatedRuntime });
  } catch (error: any) {
    console.error("Error executing runtime action:", error);
    return NextResponse.json(
      { error: error.message || "Failed to execute runtime action" },
      { status: 500 }
    );
  }
}
