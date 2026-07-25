import { NextRequest, NextResponse } from "next/server";
import { SecretService } from "@/services/secret.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key") || undefined;

    const auditLogs = await SecretService.getAuditLogs(key);
    return NextResponse.json({ auditLogs });
  } catch (error: any) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch audit logs" },
      { status: 500 }
    );
  }
}
