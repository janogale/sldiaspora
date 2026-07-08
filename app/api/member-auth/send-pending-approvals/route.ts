import { NextResponse } from "next/server";
import { directusFetch, maybeSendActivationWelcomeEmail } from "@/lib/member-directus";

// Polling fallback for the Directus "items.update" event flow, which does not
// fire reliably on this instance (same issue as the diaspora week collections,
// see app/api/diaspora-week/send-pending-approvals/route.ts). Call this on a
// schedule (e.g. every 2 minutes) instead of relying solely on the
// activation-notify webhook: it scans the members collection for anything
// Published/Active that hasn't been emailed yet, and sends it.
const isAuthorized = (request: Request): boolean => {
  const webhookSecret = (process.env.MEMBER_STATUS_WEBHOOK_SECRET || "").trim();
  const directusToken = (process.env.DIRECTUS_ADMIN_TOKEN || "").trim();

  if (!webhookSecret && !directusToken) return true;

  const providedWebhook = (request.headers.get("x-member-webhook-secret") || "").trim();
  if (webhookSecret && providedWebhook === webhookSecret) return true;

  const authorization = (request.headers.get("Authorization") || "").trim();
  if (directusToken && authorization === `Bearer ${directusToken}`) return true;

  return false;
};

export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const response = await directusFetch(
      `/items/members?filter[status][_in]=active,published&fields=*&limit=100`
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Could not fetch members from Directus.", sent: 0, failed: 0 },
        { status: 502 }
      );
    }

    const result = (await response.json().catch(() => null)) as {
      data?: Array<Record<string, unknown>>;
    } | null;

    const candidates = result?.data || [];

    let sent = 0;
    let skipped = 0;
    let failed = 0;

    for (const member of candidates) {
      const outcome = await maybeSendActivationWelcomeEmail(member);
      if (outcome.sent) {
        sent++;
      } else if (outcome.reason === "mail_failed") {
        failed++;
      } else {
        skipped++;
      }
    }

    return NextResponse.json({
      message: "Scan complete.",
      scanned: candidates.length,
      sent,
      skipped,
      failed,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    console.error("[member-send-pending-approvals]", message, error);
    return NextResponse.json(
      { message, stage: "member-send-pending-approvals" },
      { status: 500 }
    );
  }
}
