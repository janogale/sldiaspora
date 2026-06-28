import { NextResponse } from "next/server";
import {
  generateAccessCode,
  getCollectionFields,
  getRegistrationByEmail,
  getRegistrationById,
  getRegistrationsCollection,
  sendDiasporaWeekApprovalEmail,
  updateCollectionRecord,
} from "@/lib/diaspora-week";

type NotifyPayload = {
  registrationId?: string;
  email?: string;
  status?: string;
  key?: string;
  keys?: Array<string | number>;
  payload?: { id?: string | number; email?: string; status?: string };
  data?: { id?: string | number; email?: string; status?: string };
};

const isAuthorized = (request: Request) => {
  const configuredSecret = process.env.MEMBER_STATUS_WEBHOOK_SECRET || "";
  if (!configuredSecret) return true;

  const providedSecret = request.headers.get("x-member-webhook-secret") || "";
  return providedSecret === configuredSecret;
};

export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as NotifyPayload | null;

    const registrationId = String(
      body?.registrationId || body?.key || body?.keys?.[0] || body?.payload?.id || body?.data?.id || ""
    ).trim();

    const email = String(
      body?.email || body?.payload?.email || body?.data?.email || ""
    ).trim().toLowerCase();

    const requestedStatus = String(
      body?.status || body?.payload?.status || body?.data?.status || ""
    ).trim().toLowerCase();

    let registration: Record<string, unknown> | null = null;

    if (registrationId) {
      registration = await getRegistrationById(registrationId, "individual").catch(() => null);
      if (!registration) {
        registration = await getRegistrationById(registrationId, "business").catch(() => null);
      }
    }

    if (!registration && email) {
      registration = await getRegistrationByEmail(email).catch(() => null);
    }

    if (!registration) {
      return NextResponse.json({ message: "Registration not found." }, { status: 404 });
    }

    const registrationType = registration.registration_type === "business" ? "business" : "individual";

    const status = (requestedStatus || String(registration.status || "")).trim().toLowerCase();

    if (status !== "approved") {
      return NextResponse.json(
        { message: "No email sent because status is not 'approved'.", status },
        { status: 200 }
      );
    }

    const id = String(registration.id || "");
    const toEmail = String(registration.email || "").trim().toLowerCase();
    const name = String(registration.full_name || registration.business_name || registration.contact_person || "Participant");

    if (!id || !toEmail) {
      return NextResponse.json(
        { message: "Registration is missing id or email." },
        { status: 400 }
      );
    }

    const existingCode = String(registration.access_code || "").trim();
    const alreadySent = Boolean(registration.access_code_sent_at);

    if (existingCode && alreadySent) {
      return NextResponse.json(
        { message: "Approval email already sent.", sent: false, reason: "already_sent" },
        { status: 200 }
      );
    }

    const accessCode = existingCode || generateAccessCode();

    const emailSent = await sendDiasporaWeekApprovalEmail({
      toEmail,
      name,
      accessCode,
      registrationType,
      country: String(registration.country || ""),
      city: String(registration.city || ""),
      profession: String(registration.profession || ""),
    });

    if (!emailSent) {
      return NextResponse.json(
        { message: "Could not send approval email.", sent: false, reason: "mail_failed" },
        { status: 502 }
      );
    }

    const collection = getRegistrationsCollection(registrationType);
    const allowedFields = await getCollectionFields(collection);
    const updatePayload: Record<string, unknown> = {
      access_code: accessCode,
      access_code_sent_at: new Date().toISOString(),
    };

    const filtered = allowedFields
      ? Object.fromEntries(Object.entries(updatePayload).filter(([key]) => allowedFields.has(key)))
      : updatePayload;

    if (Object.keys(filtered).length > 0) {
      await updateCollectionRecord(collection, id, filtered);
    }

    return NextResponse.json(
      { message: "Approval email with access code sent.", sent: true },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Unexpected error while sending Diaspora Week approval email.";

    return NextResponse.json({ message, stage: "diaspora-week-activation-notify" }, { status: 500 });
  }
}
