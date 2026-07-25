import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { DeploymentService } from "@/services/deployment.service";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "6", 10);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const projectId = searchParams.get("projectId") || undefined;

    const result = await DeploymentService.getPaginatedDeployments({
      userId: session.user.id,
      page,
      limit,
      search,
      status,
      projectId,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching deployments:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch deployments" },
      { status: 500 }
    );
  }
}
