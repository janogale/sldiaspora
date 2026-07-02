import { NextResponse } from "next/server";
import {
  BUSINESS_REGISTRATIONS_COLLECTION,
  INDIVIDUAL_REGISTRATIONS_COLLECTION,
  directusFetch,
  getCollectionFields,
  sendDiasporaWeekApprovalEmail,
  updateCollectionRecord,
} from "@/lib/diaspora-week";

// Polling fallback for the Directus "items.update" event flow, which does not
// fire reliably for the diaspora week registration collections on this
// instance. Called on a schedule (e.g. every 2 minutes) instead of by an
// update webhook: scans both collections for anything Published/Approved
// that hasn't been emailed yet, and sends it.
const APPROVED_STATUSES = ["approved", "published", "active"];

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

type RegistrationType = "individual" | "business";

const processCollection = async (registrationType: RegistrationType) => {
  const collection =
    registrationType === "business"
      ? BUSINESS_REGISTRATIONS_COLLECTION
      : INDIVIDUAL_REGISTRATIONS_COLLECTION;

  const statusFilter = APPROVED_STATUSES.map((s) => encodeURIComponent(s)).join(",");
  const response = await directusFetch(
    `/items/${collection}?filter[status][_in]=${statusFilter}&filter[approval_email_sent_at][_null]=true&fields=*&limit=100`
  );

  if (!response.ok) return { collection, sent: 0, failed: 0 };

  const result = (await response.json().catch(() => null)) as {
    data?: Array<Record<string, unknown>>;
  } | null;

  const candidates = result?.data || [];
  const allowedFields = await getCollectionFields(collection);

  let sent = 0;
  let failed = 0;

  for (const registration of candidates) {
    const id = String(registration.id || "").trim();
    const toEmail = String(registration.email || "").trim().toLowerCase();
    const name = String(
      registration.full_name ||
        registration.business_name ||
        registration.contact_person ||
        "Participant"
    );

    if (!id || !toEmail) {
      failed++;
      continue;
    }

    const emailSent = await sendDiasporaWeekApprovalEmail({
      toEmail,
      name,
      registrationType,
      city: String(registration.city || ""),
      country: String(registration.country || ""),
      profession: String(registration.profession || ""),
      businessName: String(registration.business_name || ""),
      contactPerson: String(registration.contact_person || ""),
      industry: String(registration.industry || ""),
      website: String(registration.business_website || ""),
    });

    if (!emailSent) {
      failed++;
      continue;
    }

    const updatePayload: Record<string, unknown> = {
      approval_email_sent_at: new Date().toISOString(),
    };
    const filtered = allowedFields
      ? Object.fromEntries(Object.entries(updatePayload).filter(([k]) => allowedFields.has(k)))
      : updatePayload;

    if (Object.keys(filtered).length > 0) {
      await updateCollectionRecord(collection, id, filtered);
    }

    sent++;
  }

  return { collection, sent, failed };
};

export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const [individual, business] = await Promise.all([
      processCollection("individual"),
      processCollection("business"),
    ]);

    return NextResponse.json({ message: "Scan complete.", results: [individual, business] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    console.error("[send-pending-approvals]", message, error);
    return NextResponse.json(
      { message, stage: "diaspora-week-send-pending-approvals" },
      { status: 500 }
    );
  }
}
