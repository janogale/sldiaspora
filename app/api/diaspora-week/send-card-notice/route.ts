import { NextResponse } from "next/server";
import {
  INDIVIDUAL_REGISTRATIONS_COLLECTION,
  directusFetch,
  sendDiasporaWeekCardNoticeEmail,
} from "@/lib/diaspora-week";

const isAuthorized = (request: Request): boolean => {
  const webhookSecret = (process.env.MEMBER_STATUS_WEBHOOK_SECRET || "").trim();
  const directusToken = (process.env.DIRECTUS_ADMIN_TOKEN || "").trim();
  const cronSecret    = (process.env.CRON_SECRET || "").trim();

  if (!webhookSecret && !directusToken && !cronSecret) return true;

  const providedWebhook = (request.headers.get("x-member-webhook-secret") || "").trim();
  if (webhookSecret && providedWebhook === webhookSecret) return true;

  const authorization = (request.headers.get("Authorization") || "").trim();
  if (directusToken && authorization === `Bearer ${directusToken}`) return true;
  if (cronSecret    && authorization === `Bearer ${cronSecret}`)    return true;

  return false;
};

const runSend = async (request: Request) => {
  if (!isAuthorized(request)) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const url = new URL(request.url);
  const testEmail = url.searchParams.get("test");
  const bulk = url.searchParams.get("bulk") === "true";

  // Single test send — does not touch Directus records.
  if (testEmail) {
    const sent = await sendDiasporaWeekCardNoticeEmail({
      toEmail: testEmail,
      name: url.searchParams.get("name") || "Delegate",
    });
    return NextResponse.json({ message: "Test send complete.", sent, to: testEmail });
  }

  if (!bulk) {
    return NextResponse.json(
      { message: "Pass ?test=email@example.com for a single send, or ?bulk=true for all published individuals." },
      { status: 400 }
    );
  }

  const response = await directusFetch(
    `/items/${INDIVIDUAL_REGISTRATIONS_COLLECTION}?filter[status][_eq]=published&fields=id,full_name,email&limit=-1`
  );

  if (!response.ok) {
    return NextResponse.json({ message: "Failed to fetch published registrations." }, { status: 500 });
  }

  const result = (await response.json().catch(() => null)) as {
    data?: Array<{ id: number; full_name?: string; email?: string }>;
  } | null;

  const records = result?.data || [];

  let sent = 0;
  let failed = 0;

  for (const record of records) {
    const toEmail = String(record.email || "").trim().toLowerCase();
    const name = String(record.full_name || "Delegate");

    if (!toEmail) {
      failed++;
      continue;
    }

    const ok = await sendDiasporaWeekCardNoticeEmail({ toEmail, name });
    if (ok) sent++;
    else failed++;
  }

  return NextResponse.json({ message: "Bulk send complete.", total: records.length, sent, failed });
};

export async function GET(request: Request) {
  try {
    return await runSend(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    console.error("[send-card-notice]", message, error);
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    return await runSend(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    console.error("[send-card-notice]", message, error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
