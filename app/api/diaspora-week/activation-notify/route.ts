import { NextResponse } from "next/server";
import {
  generateAccessCode,
  getCollectionFields,
  getRegistrationByEmail,
  getRegistrationById,
  getRegistrationsCollection,
  sendDiasporaWeekApprovalEmail,
  updateCollectionRecord,
  INDIVIDUAL_REGISTRATIONS_COLLECTION,
  BUSINESS_REGISTRATIONS_COLLECTION,
} from "@/lib/diaspora-week";

type RegistrationType = "individual" | "business";

// Accepts any of:
//   x-member-webhook-secret: <MEMBER_STATUS_WEBHOOK_SECRET>
//   Authorization: Bearer <DIRECTUS_ADMIN_TOKEN>
//   (no auth when neither secret is configured — dev/testing)
const isAuthorized = (request: Request): boolean => {
  const webhookSecret  = (process.env.MEMBER_STATUS_WEBHOOK_SECRET || "").trim();
  const directusToken  = (process.env.DIRECTUS_ADMIN_TOKEN        || "").trim();

  if (!webhookSecret && !directusToken) return true; // nothing configured — open

  const providedWebhook = (request.headers.get("x-member-webhook-secret") || "").trim();
  if (webhookSecret && providedWebhook === webhookSecret) return true;

  const authorization   = (request.headers.get("Authorization") || "").trim();
  if (directusToken && authorization === `Bearer ${directusToken}`) return true;

  return false;
};

// Resolve which Directus collection was targeted from the Directus Flow payload
const resolveRegistrationType = (
  body: Record<string, unknown>
): RegistrationType | null => {
  const collection = String(body?.collection || "").toLowerCase();
  if (collection.includes("business"))    return "business";
  if (collection.includes("individual"))  return "individual";
  return null;
};

export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

    if (!body) {
      return NextResponse.json({ message: "Empty or invalid JSON body." }, { status: 400 });
    }

    // Support Directus Flow payload shape:
    //   { collection, keys: ["id"], payload: { status }, event, ... }
    // AND our own manual shape:
    //   { registrationId, email, status }

    const payload  = (body?.payload  as Record<string, unknown>) ?? {};
    const data     = (body?.data     as Record<string, unknown>) ?? {};
    const keys     = Array.isArray(body?.keys) ? (body.keys as Array<string | number>) : [];

    const registrationId = String(
      body?.registrationId ?? body?.key ?? keys[0] ?? payload?.id ?? data?.id ?? ""
    ).trim();

    const email = String(
      body?.email ?? payload?.email ?? data?.email ?? ""
    ).trim().toLowerCase();

    const requestedStatus = String(
      body?.status ?? payload?.status ?? data?.status ?? ""
    ).trim().toLowerCase();

    // Resolve registration from Directus
    const collectionHint = resolveRegistrationType(body);
    let registration: Record<string, unknown> | null = null;

    if (registrationId) {
      if (collectionHint) {
        registration = await getRegistrationById(registrationId, collectionHint).catch(() => null);
      } else {
        registration = await getRegistrationById(registrationId, "individual").catch(() => null);
        if (!registration) {
          registration = await getRegistrationById(registrationId, "business").catch(() => null);
        }
      }
    }

    if (!registration && email) {
      registration = await getRegistrationByEmail(email).catch(() => null);
    }

    if (!registration) {
      return NextResponse.json(
        { message: "Registration not found.", registrationId, email },
        { status: 404 }
      );
    }

    const registrationType: RegistrationType =
      registration.registration_type === "business" ? "business" : "individual";

    // Use status from payload first; fall back to what's stored in Directus
    const effectiveStatus = (requestedStatus || String(registration.status || "")).trim().toLowerCase();

    if (effectiveStatus !== "approved") {
      return NextResponse.json(
        { message: "No email sent — status is not approved.", effectiveStatus },
        { status: 200 }
      );
    }

    const id      = String(registration.id    || "").trim();
    const toEmail = String(registration.email || "").trim().toLowerCase();
    const name    = String(
      registration.full_name     ||
      registration.business_name ||
      registration.contact_person ||
      "Participant"
    );

    if (!id || !toEmail) {
      return NextResponse.json(
        { message: "Registration is missing id or email." },
        { status: 400 }
      );
    }

    // Avoid sending duplicate emails
    const alreadySent = Boolean(registration.access_code_sent_at);
    const existingCode = String(registration.access_code || "").trim();
    if (existingCode && alreadySent) {
      return NextResponse.json(
        { message: "Approval email already sent.", sent: false },
        { status: 200 }
      );
    }

    const accessCode = existingCode || generateAccessCode();

    const emailSent = await sendDiasporaWeekApprovalEmail({
      toEmail,
      name,
      accessCode,
      registrationType,
      city:          String(registration.city             || ""),
      country:       String(registration.country          || ""),
      profession:    String(registration.profession       || ""),
      businessName:  String(registration.business_name   || ""),
      contactPerson: String(registration.contact_person  || ""),
      industry:      String(registration.industry        || ""),
      website:       String(registration.business_website || ""),
    });

    if (!emailSent) {
      return NextResponse.json(
        { message: "SMTP send failed — check SMTP credentials in .env.local.", sent: false },
        { status: 502 }
      );
    }

    // Save access_code and timestamp back to Directus
    const collection     = getRegistrationsCollection(registrationType);
    const allowedFields  = await getCollectionFields(collection);
    const updatePayload: Record<string, unknown> = {
      access_code:         accessCode,
      access_code_sent_at: new Date().toISOString(),
    };
    const filtered = allowedFields
      ? Object.fromEntries(Object.entries(updatePayload).filter(([k]) => allowedFields.has(k)))
      : updatePayload;

    if (Object.keys(filtered).length > 0) {
      await updateCollectionRecord(collection, id, filtered);
    }

    return NextResponse.json(
      { message: "Approval email sent.", sent: true, toEmail },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    console.error("[activation-notify]", message, error);
    return NextResponse.json(
      { message, stage: "diaspora-week-activation-notify" },
      { status: 500 }
    );
  }
}
