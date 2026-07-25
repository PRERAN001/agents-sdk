import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { verifyInstallationState } from "@/lib/github/stateToken";
import { InstallationService } from "@/services/installation.service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const installationIdStr = searchParams.get("installation_id");
  const setupAction = searchParams.get("setup_action");
  const state = searchParams.get("state");

  const baseUrl = request.nextUrl.origin;

  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.redirect(`${baseUrl}/login?error=Unauthorized`);
    }

    if (!installationIdStr) {
      return NextResponse.redirect(
        `${baseUrl}/dashboard/github?error=${encodeURIComponent("Missing installation_id parameter")}`
      );
    }

    // Verify anti-CSRF state token
    if (state) {
      const stateVerification = verifyInstallationState(state, session.user.id);
      if (!stateVerification.valid) {
        console.error("State verification failed:", stateVerification.error);
        return NextResponse.redirect(
          `${baseUrl}/dashboard/github?error=${encodeURIComponent(stateVerification.error || "Invalid state token")}`
        );
      }
    }

    const installationId = parseInt(installationIdStr, 10);
    if (isNaN(installationId)) {
      return NextResponse.redirect(
        `${baseUrl}/dashboard/github?error=${encodeURIComponent("Invalid installation_id format")}`
      );
    }

    // Save/update installation metadata & sync repositories in MongoDB
    await InstallationService.upsertInstallation(installationId, session.user.id);

    return NextResponse.redirect(
      `${baseUrl}/dashboard/github?success=${encodeURIComponent(
        setupAction === "update" ? "Installation updated successfully" : "GitHub App installed successfully"
      )}&installation_id=${installationId}`
    );
  } catch (error: any) {
    console.error("Error processing GitHub App installation callback:", error);
    return NextResponse.redirect(
      `${baseUrl}/dashboard/github?error=${encodeURIComponent(
        error.message || "An error occurred during GitHub App installation"
      )}`
    );
  }
}
