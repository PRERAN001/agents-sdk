import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/github/verifyWebhook";
import { InstallationService } from "@/services/installation.service";
import { RepositoryService } from "@/services/repository.service";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-hub-signature-256");
    const event = request.headers.get("x-github-event");

    // 1. Verify Webhook HMAC SHA-256 signature
    if (!verifyWebhookSignature(rawBody, signature)) {
      console.warn("Invalid GitHub webhook signature received");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    // 2. Handle relevant GitHub App webhook events
    switch (event) {
      case "installation": {
        const action = payload.action;
        const installationId = payload.installation?.id;

        if (!installationId) break;

        if (action === "deleted") {
          await InstallationService.updateInstallationStatus(installationId, "deleted");
        } else if (action === "suspend") {
          await InstallationService.updateInstallationStatus(installationId, "suspended");
        } else if (action === "unsuspend" || action === "created" || action === "new_permissions_accepted") {
          await InstallationService.updateInstallationStatus(installationId, "active");
        }
        break;
      }

      case "installation_repositories": {
        const action = payload.action;
        const installationId = payload.installation?.id;

        if (!installationId) break;

        if (action === "added" && Array.isArray(payload.repositories_added)) {
          await RepositoryService.addRepositories(
            installationId,
            payload.repositories_added
          );
        } else if (action === "removed" && Array.isArray(payload.repositories_removed)) {
          const removedIds = payload.repositories_removed.map((r: { id: number }) => r.id);
          await RepositoryService.removeRepositories(installationId, removedIds);
        }
        break;
      }

      default:
        // Other events can be safely acknowledged
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Error processing GitHub webhook:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process webhook" },
      { status: 500 }
    );
  }
}
