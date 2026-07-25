import { NextRequest, NextResponse } from "next/server";
import { MarketplaceService } from "@/services/marketplace.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";
    const search = searchParams.get("search") || "";

    const agents = await MarketplaceService.getMarketplaceAgents({ category, search });
    return NextResponse.json({ agents });
  } catch (error: any) {
    console.error("Error fetching marketplace agents:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch marketplace agents" },
      { status: 500 }
    );
  }
}
