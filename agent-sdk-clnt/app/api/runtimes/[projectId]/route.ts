import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { RuntimeService } from "@/services/runtime.service";

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

    return NextResponse.json({ runtime });
  } catch (error: any) {
    console.error("Error fetching runtime details:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch runtime details" },
      { status: 500 }
    );
  }
}
