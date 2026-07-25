import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ExecutionService } from "@/services/execution.service";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "8", 10);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const task = searchParams.get("task") || "";

    const result = await ExecutionService.getPaginatedExecutions({
      userId: session?.user?.id,
      page,
      limit,
      search,
      status,
      task,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching execution logs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch execution logs" },
      { status: 500 }
    );
  }
}
