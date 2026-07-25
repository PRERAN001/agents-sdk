import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { SecretService } from "@/services/secret.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    const rawValue = await SecretService.getUnmaskedSecret(
      id,
      session?.user?.email || "User"
    );

    return NextResponse.json({ success: true, value: rawValue });
  } catch (error: any) {
    console.error("Error unmasking secret:", error);
    return NextResponse.json(
      { error: error.message || "Failed to unmask secret" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    const deleted = await SecretService.deleteSecret(
      id,
      session?.user?.email || "User"
    );

    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    console.error("Error deleting secret:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete secret" },
      { status: 500 }
    );
  }
}
