import { NextRequest, NextResponse } from "next/server";
import { MarketplaceService } from "@/services/marketplace.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: slug } = await params;
    const templateFiles = MarketplaceService.getAgentTemplateFiles(slug);

    return NextResponse.json({
      slug,
      files: templateFiles,
      cliCommand: `npx deploygent clone ${slug}`,
    });
  } catch (error: any) {
    console.error("Error downloading template files:", error);
    return NextResponse.json(
      { error: error.message || "Failed to download template files" },
      { status: 500 }
    );
  }
}
