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
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const search = searchParams.get("search") || "";
    const language = searchParams.get("language") || "";
    const sort = (searchParams.get("sort") as "pushedAt" | "name" | "stars") || "pushedAt";
    
    const installationIdStr = searchParams.get("installationId");
    const installationId = installationIdStr ? parseInt(installationIdStr, 10) : undefined;

    const result = await RepositoryService.getPaginatedRepositoriesForUser({
      userId: session.user.id,
      page,
      limit,
      search,
      installationId: isNaN(installationId as number) ? undefined : installationId,
      language,
      sort,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error in repository browse route:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}
