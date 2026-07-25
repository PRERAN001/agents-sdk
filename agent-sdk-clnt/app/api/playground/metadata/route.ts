import { NextRequest, NextResponse } from "next/server";
import { PlaygroundService } from "@/services/playground.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customUrl = searchParams.get("url");

    const ec2Ip = process.env.AWS_EC2_PUBLIC_IP;
    const targetHost = customUrl || (ec2Ip ? `http://${ec2Ip}:8000` : "http://localhost:8000");

    // 1. Fetch live agent metadata from running FastAPI runtime (agent.describe())
    try {
      const liveRes = await fetch(`${targetHost}/metadata`, {
        cache: "no-store",
        signal: AbortSignal.timeout(2500),
      });

      if (liveRes.ok) {
        const liveMeta = await liveRes.json();
        return NextResponse.json({ metadata: liveMeta, live: true, source: targetHost });
      }
    } catch (e) {
      console.warn(`Could not reach ${targetHost}/metadata, falling back to minimal clean schema`);
    }

    // 2. Return clean minimal SDK metadata fallback
    const metadata = PlaygroundService.getSdkMetadata();
    return NextResponse.json({ metadata, live: false });
  } catch (error: any) {
    console.error("Error in playground metadata API:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch SDK metadata" },
      { status: 500 }
    );
  }
}
