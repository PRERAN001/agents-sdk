import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { SecretService } from "@/services/secret.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const body = await request.json();
    const { newValue } = body;

    if (!newValue) {
      return NextResponse.json(
        { error: "newValue is required for rotation" },
        { status: 400 }
      );
    }

    const updatedSecret = await SecretService.rotateSecret(
      id,
      newValue,
      session?.user?.email || "User"
    );

    return NextResponse.json({ success: true, secret: updatedSecret });
  } catch (error: any) {
    console.error("Error rotating secret:", error);
    return NextResponse.json(
      { error: error.message || "Failed to rotate secret" },
      { status: 500 }
    );
  }
}
