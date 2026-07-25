import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { InstallationService } from "@/services/installation.service";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in." },
        { status: 401 }
      );
    }

    const installations = await InstallationService.getUserInstallations(session.user.id);

    return NextResponse.json({ installations });
  } catch (error: any) {
    console.error("Error fetching GitHub installations:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch installations" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const installationIdStr = searchParams.get("installationId");

    if (!installationIdStr) {
      return NextResponse.json(
        { error: "Missing installationId query parameter" },
        { status: 400 }
      );
    }

    const installationId = parseInt(installationIdStr, 10);
    if (isNaN(installationId)) {
      return NextResponse.json(
        { error: "Invalid installationId parameter" },
        { status: 400 }
      );
    }

    const success = await InstallationService.deleteInstallation(
      installationId,
      session.user.id
    );

    if (!success) {
      return NextResponse.json(
        { error: "Installation not found or unauthorized to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Installation disconnected successfully" });
  } catch (error: any) {
    console.error("Error deleting GitHub installation:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete installation" },
      { status: 500 }
    );
  }
}
