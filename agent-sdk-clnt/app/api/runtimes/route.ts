import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { RuntimeService } from "@/services/runtime.service";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in." },
        { status: 401 }
      );
    }

    const runtimes = await RuntimeService.getAllRuntimes(session.user.id);
    return NextResponse.json({ runtimes });
  } catch (error: any) {
    console.error("Error fetching runtimes:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch runtimes" },
      { status: 500 }
    );
  }
}
