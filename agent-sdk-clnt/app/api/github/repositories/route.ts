import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { RepositoryService } from "@/services/repository.service";

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
    const installationIdStr = searchParams.get("installationId");
    const refresh = searchParams.get("refresh") === "true";

    let repositories;

    if (installationIdStr) {
      const installationId = parseInt(installationIdStr, 10);
      if (isNaN(installationId)) {
        return NextResponse.json(
          { error: "Invalid installationId parameter" },
          { status: 400 }
        );
      }

      if (refresh) {
        repositories = await RepositoryService.syncRepositoriesForInstallation(installationId);
      } else {
        repositories = await RepositoryService.getRepositoriesByInstallationId(installationId);
      }
    } else {
      repositories = await RepositoryService.getRepositoriesForUser(session.user.id);
    }

    return NextResponse.json({ repositories });
  } catch (error: any) {
    console.error("Error fetching GitHub repositories:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}
