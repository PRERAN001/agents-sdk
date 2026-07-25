import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { RuntimeService } from "@/services/runtime.service";
import { RuntimeFactory } from "@/lib/runtime/RuntimeFactory";

export async function GET(
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
    const runtime = await RuntimeService.getRuntimeByProjectId(projectId);

    if (!runtime) {
      return NextResponse.json(
        { error: "Runtime not found for project" },
        { status: 404 }
      );
    }

    const driver = RuntimeFactory.getProvider(runtime.provider);
    const driverLogs = await driver.getLogs(runtime);
    const combinedLogs = [...(runtime.logs || []), ...driverLogs];

    return NextResponse.json({ logs: combinedLogs });
  } catch (error: any) {
    console.error("Error fetching runtime logs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch logs" },
      { status: 500 }
    );
  }
}
