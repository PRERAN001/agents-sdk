import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { createInstallationState } from "@/lib/github/stateToken";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized: You must be logged in to install the GitHub App." },
        { status: 401 }
      );
    }

    const appSlug = process.env.NEXT_PUBLIC_GITHUB_APP_SLUG || process.env.GITHUB_APP_SLUG;
    if (!appSlug) {
      return NextResponse.json(
        { error: "Server configuration error: NEXT_PUBLIC_GITHUB_APP_SLUG is not defined in .env.local." },
        { status: 500 }
      );
    }

    // Create encrypted HMAC-signed state token containing user ID
    const state = createInstallationState(session.user.id);

    // Redirect to GitHub App installation flow
    const githubInstallUrl = `https://github.com/apps/${appSlug}/installations/new?state=${encodeURIComponent(state)}`;

    return NextResponse.redirect(githubInstallUrl);
  } catch (error: any) {
    console.error("Error in GitHub install route:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initiate GitHub App installation" },
      { status: 500 }
    );
  }
}
