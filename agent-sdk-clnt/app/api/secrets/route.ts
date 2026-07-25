import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { SecretService } from "@/services/secret.service";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const environment = searchParams.get("environment") || "all";
    const search = searchParams.get("search") || "";

    const secrets = await SecretService.getSecrets({
      userId: session?.user?.id,
      environment,
      search,
    });

    return NextResponse.json({ secrets });
  } catch (error: any) {
    console.error("Error fetching secrets:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch secrets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { key, value, environment, category } = body;

    if (!key || !value) {
      return NextResponse.json(
        { error: "Key and Value are required parameters" },
        { status: 400 }
      );
    }

    const secret = await SecretService.createSecret(
      {
        userId: session?.user?.id,
        key: key.trim(),
        value,
        environment,
        category,
      },
      session?.user?.email || "User"
    );

    return NextResponse.json({ success: true, secret });
  } catch (error: any) {
    console.error("Error creating secret:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create secret" },
      { status: 400 }
    );
  }
}
