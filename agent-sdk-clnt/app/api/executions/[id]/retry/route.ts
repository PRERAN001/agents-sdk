import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ExecutionService } from "@/services/execution.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const newExecution = await ExecutionService.retryExecution(id);
    return NextResponse.json({ success: true, execution: newExecution });
  } catch (error: any) {
    console.error("Error retrying execution:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retry execution" },
      { status: 500 }
    );
  }
}
