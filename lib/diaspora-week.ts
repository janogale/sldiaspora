import crypto from "node:crypto";

const DIRECTUS_URL = process.env.DIRECTUS_URL || "https://admin.sldiaspora.org";
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

export const INDIVIDUAL_REGISTRATIONS_COLLECTION = "diaspora_week_registrations_individual";
export const BUSINESS_REGISTRATIONS_COLLECTION = "diaspora_week_registrations_business";
export const SCHEDULE_COLLECTION = "diaspora_week_schedule";
export const EXHIBITORS_COLLECTION = "diaspora_week_exhibitors";
export const PARTNERS_COLLECTION = "diaspora_week_partners";
export const GALLERY_COLLECTION = "diaspora_week_gallery";

type DirectusResult<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

export const getDirectusAdminToken = () => {
  if (!DIRECTUS_ADMIN_TOKEN) {
    throw new Error("Missing DIRECTUS_ADMIN_TOKEN in environment.");
  }
  return DIRECTUS_ADMIN_TOKEN;
};

export const getDirectusErrorMessage = (result: unknown, fallback: string) => {
  if (
    result &&
    typeof result === "object" &&
    "errors" in result &&
    Array.isArray((result as { errors?: unknown[] }).errors)
  ) {
    const firstMessage = (result as { errors: Array<{ message?: string }> })
      .errors[0]?.message;
    if (firstMessage) return firstMessage;
  }
  return fallback;
};

export const directusFetch = async (
  path: string,
  init: RequestInit = {}
): Promise<Response> => {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${getDirectusAdminToken()}`);

  return fetch(`${DIRECTUS_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
};

export const getAssetUrl = (fileId: string) => `/api/directus-assets/${fileId}`;

export const getCollectionFields = async (collection: string) => {
  const response = await directusFetch(`/fields/${encodeURIComponent(collection)}`);

  if (!response.ok) return null;

  const result = (await response.json().catch(() => null)) as DirectusResult<
    Array<{ field: string }>
  > | null;

  const fields = result?.data?.map((item) => item.field).filter(Boolean) || [];
  return new Set(fields);
};

export const filterPayloadByFields = (
  payload: Record<string, unknown>,
  allowedFields: Set<string> | null
) => {
  if (!allowedFields || allowedFields.size === 0) return payload;

  return Object.fromEntries(
    Object.entries(payload).filter(([key]) => allowedFields.has(key))
  );
};

export const uploadDirectusFile = async (
  file: File,
  title: string,
  description: string
) => {
  const uploadForm = new FormData();
  uploadForm.append("file", file, file.name);
  uploadForm.append("title", title);
  uploadForm.append("description", description);

  const response = await directusFetch("/files", {
    method: "POST",
    body: uploadForm,
  });

  const result = (await response.json().catch(() => null)) as DirectusResult<{
    id: string;
  }> | null;

  if (!response.ok) {
    throw new Error(
      getDirectusErrorMessage(result, "Could not upload file to Directus.")
    );
  }

  return result?.data?.id || null;
};

export const createCollectionRecord = async (
  collection: string,
  payload: Record<string, unknown>
) => {
  const response = await directusFetch(
    `/items/${encodeURIComponent(collection)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  const result = (await response.json().catch(() => null)) as DirectusResult<
    Record<string, unknown>
  > | null;

  return { response, result };
};

export const updateCollectionRecord = async (
  collection: string,
  id: string | number,
  payload: Record<string, unknown>
) => {
  const response = await directusFetch(
    `/items/${encodeURIComponent(collection)}/${encodeURIComponent(String(id))}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  const result = (await response.json().catch(() => null)) as DirectusResult<
    Record<string, unknown>
  > | null;

  return { response, result };
};

export type RegistrationType = "individual" | "business";

export const getRegistrationsCollection = (registrationType: RegistrationType) =>
  registrationType === "business"
    ? BUSINESS_REGISTRATIONS_COLLECTION
    : INDIVIDUAL_REGISTRATIONS_COLLECTION;

const fetchRegistrationByEmailFromCollection = async (
  collection: string,
  email: string
) => {
  const response = await directusFetch(
    `/items/${collection}?filter[email][_eq]=${encodeURIComponent(
      email.trim().toLowerCase()
    )}&limit=1&fields=*`
  );

  if (response.status === 404) return null;

  const result = (await response.json().catch(() => null)) as DirectusResult<
    Array<Record<string, unknown>>
  > | null;

  if (!response.ok) {
    throw new Error(
      getDirectusErrorMessage(result, "Could not fetch registration by email.")
    );
  }

  return result?.data?.[0] || null;
};

/**
 * Looks up a registration by email. If `registrationType` is provided, only that
 * collection is searched; otherwise both individual and business collections are
 * checked (individual first).
 */
export const getRegistrationByEmail = async (
  email: string,
  registrationType?: RegistrationType
) => {
  if (registrationType) {
    return fetchRegistrationByEmailFromCollection(
      getRegistrationsCollection(registrationType),
      email
    );
  }

  const fromIndividual = await fetchRegistrationByEmailFromCollection(
    INDIVIDUAL_REGISTRATIONS_COLLECTION,
    email
  );
  if (fromIndividual) return fromIndividual;

  return fetchRegistrationByEmailFromCollection(BUSINESS_REGISTRATIONS_COLLECTION, email);
};

export const getRegistrationById = async (
  id: string | number,
  registrationType: RegistrationType
) => {
  const collection = getRegistrationsCollection(registrationType);

  const response = await directusFetch(
    `/items/${collection}/${encodeURIComponent(String(id))}?fields=*`
  );

  if (response.status === 404) return null;

  const result = (await response.json().catch(() => null)) as DirectusResult<
    Record<string, unknown>
  > | null;

  if (!response.ok) {
    throw new Error(
      getDirectusErrorMessage(result, "Could not fetch registration.")
    );
  }

  return result?.data || null;
};

export const generateAccessCode = () => {
  const bytes = crypto.randomBytes(5);
  return bytes
    .toString("hex")
    .toUpperCase()
    .slice(0, 8)
    .replace(/(.{4})(.{4})/, "$1-$2");
};

// ---------------------------------------------------------------------------
// Email sending (standalone copy so this module has no dependency on the
// member-auth email helpers).
// ---------------------------------------------------------------------------

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const resolveAppBaseUrl = () => {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.APP_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL;

  if (fromEnv && fromEnv.trim()) {
    return fromEnv.replace(/\/$/, "");
  }

  return "http://localhost:3000";
};

export const sendHtmlEmail = async (options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpSecure = String(process.env.SMTP_SECURE || "false") === "true";
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const gmailFrom =
    process.env.GMAIL_FROM || (gmailUser ? `Sldiaspora <${gmailUser}>` : undefined);

  const canUseSmtp = !!smtpHost && !!smtpUser && !!smtpPass && !!smtpFrom;
  const canUseGmail = !!gmailUser && !!gmailAppPassword;

  if (canUseSmtp || canUseGmail) {
    try {
      const nodemailer = await import("nodemailer");

      const transport = canUseSmtp
        ? {
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure,
            auth: { user: smtpUser, pass: smtpPass },
          }
        : {
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: { user: gmailUser, pass: gmailAppPassword },
          };

      const fromAddress = canUseSmtp ? smtpFrom : gmailFrom || gmailUser;

      const transporter = nodemailer.createTransport(transport);
      await transporter.sendMail({
        from: fromAddress,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text:
          options.text ||
          options.html
            .replace(/<style[\s\S]*?<\/style>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim(),
      });

      return true;
    } catch (error) {
      console.error("diaspora-week smtp email send failed", error);
    }
  }

  return false;
};

// ---------------------------------------------------------------------------
// Shared email primitives
// ---------------------------------------------------------------------------

const EMAIL_BG = "#0d2e1f";

const emailWrapper = (innerHtml: string) => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:${EMAIL_BG};">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${EMAIL_BG};padding:28px 16px;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
      ${innerHtml}
    </table>
  </td></tr>
</table>
</body>
</html>`;

// Logo bar — uses the public site URL so the image is always reachable in email clients
const emailLogoBar = () => {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://sldiaspora.org").replace(/\/$/, "");
  return `
<tr>
  <td style="text-align:center;padding-bottom:14px;">
    <img src="${siteUrl}/assets/imgs/logo/logo.png" alt="Somaliland Diaspora Week"
      width="52" height="52"
      style="display:block;margin:0 auto;border-radius:12px;background:#ffffff;
        padding:5px;border:1px solid rgba(255,255,255,0.18);" />
    <div style="margin-top:7px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:2px;
      text-transform:uppercase;color:rgba(255,255,255,0.45);">Somaliland Diaspora Week</div>
  </td>
</tr>`;
};

// Hero banner
const emailHeroBanner = (label: string) => `
<tr>
  <td style="background:linear-gradient(135deg,#005a1b 0%,#007a26 55%,#1a5c0a 100%);
    border-radius:16px 16px 0 0;padding:26px 24px;text-align:center;">
    <div style="display:inline-block;background:rgba(255,215,0,0.18);border:1px solid rgba(255,215,0,0.4);
      border-radius:999px;padding:3px 12px;font-family:Arial,sans-serif;font-size:10px;
      letter-spacing:2px;text-transform:uppercase;color:#fde68a;margin-bottom:10px;">${label}</div>
    <div style="font-family:Arial,sans-serif;font-size:24px;font-weight:900;color:#ffffff;
      line-height:1.2;margin-bottom:6px;">Somaliland Diaspora Week 2026</div>
    <div style="font-family:Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.8);">
      Aug 1–6, 2026 &nbsp;&middot;&nbsp; Hargeisa &nbsp;&middot;&nbsp; Borama &nbsp;&middot;&nbsp; Burao
    </div>
  </td>
</tr>`;

const emailCardOpen  = () => `<tr><td style="background:#ffffff;border-radius:0 0 16px 16px;overflow:hidden;box-shadow:0 16px 40px rgba(0,0,0,0.3);">`;
const emailCardClose = () => `</td></tr>`;

const emailFooter = () => `
<tr>
  <td style="padding:16px 0 0;text-align:center;">
    <div style="font-family:Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.4);line-height:1.8;">
      Somaliland Diaspora Week 2026 &middot; Hargeisa, Somaliland<br/>
      <a href="mailto:info@sldiaspora.org" style="color:rgba(255,255,255,0.6);text-decoration:none;">info@sldiaspora.org</a>
      &nbsp;&middot;&nbsp;
      <a href="tel:+252638880240" style="color:rgba(255,255,255,0.6);text-decoration:none;">+252 63 8880240</a>
    </div>
  </td>
</tr>`;

// Reusable detail row
const dRow = (label: string, value: string, last = false) =>
  `<tr>
    <td style="padding:9px 18px;color:#64748b;width:36%;font-size:13px;${last ? "" : "border-bottom:1px solid #f1f5f9;"}">${label}</td>
    <td style="padding:9px 18px;color:#0c2f37;font-weight:600;font-size:13px;${last ? "" : "border-bottom:1px solid #f1f5f9;"}">${value}</td>
  </tr>`;

// City → venue/hotel/date lookup (used by both emails)
const CITY_VENUE: Record<string, { hotel: string; dates: string; displayCity: string }> = {
  hargeisa: { displayCity: "Hargeisa", hotel: "Serene Seravoir Hotel", dates: "August 1–3, 2026" },
  borama:   { displayCity: "Borama",   hotel: "Safari Hotel",           dates: "August 4, 2026"   },
  boorama:  { displayCity: "Borama",   hotel: "Safari Hotel",           dates: "August 4, 2026"   },
  burao:    { displayCity: "Burao",    hotel: "Plaza Hotel",            dates: "August 5–6, 2026" },
  burco:    { displayCity: "Burao",    hotel: "Plaza Hotel",            dates: "August 5–6, 2026" },
};

const resolveCityVenue = (cityRaw: string) => {
  const key = cityRaw.toLowerCase().trim().split(",")[0].trim();
  return CITY_VENUE[key] ?? { displayCity: escapeHtml(cityRaw) || "Hargeisa", hotel: "Serene Seravoir Hotel", dates: "August 1–6, 2026" };
};

// ---------------------------------------------------------------------------
// Email 1 — Registration Received
// ---------------------------------------------------------------------------

export const sendDiasporaWeekRegistrationReceivedEmail = async (options: {
  toEmail: string;
  name: string;
  registrationType: "individual" | "business";
  city?: string;
}) => {
  const safeName   = escapeHtml(options.name || "there");
  const isBusiness = options.registrationType === "business";
  const typeLabel  = isBusiness ? "Business Exhibitor" : "Individual Delegate";
  const typeColor  = isBusiness ? "#0055b3" : "#005a1b";
  const typeBg     = isBusiness ? "#daeeff"  : "#d7f5e0";
  const venue      = options.city ? resolveCityVenue(options.city) : null;

  const html = emailWrapper(`
    ${emailLogoBar()}
    ${emailHeroBanner("Registration Received")}
    ${emailCardOpen()}

    <div style="padding:22px 22px 8px;">
      <div style="display:inline-block;background:#d7f5e0;color:#005a1b;border-radius:999px;
        padding:4px 12px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;
        letter-spacing:0.5px;text-transform:uppercase;margin-bottom:12px;">&#10003; Received</div>
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:15px;color:#0c2f37;">
        Dear <strong>${safeName}</strong>,
      </p>
      <p style="margin:0 0 18px;font-family:Arial,sans-serif;font-size:13px;color:#475569;line-height:1.7;">
        Thank you for registering for <strong>Somaliland Diaspora Week 2026</strong> as a
        <strong>${escapeHtml(typeLabel)}</strong>. We have received your application and will be in
        touch within <strong>2–3 business days</strong> once it is reviewed.
      </p>
    </div>

    <!-- details -->
    <div style="margin:0 22px 18px;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${dRow("Name",  safeName)}
        ${dRow("Type",  `<span style="background:${typeBg};color:${typeColor};border-radius:999px;padding:2px 9px;font-size:11px;font-weight:700;">${escapeHtml(typeLabel)}</span>`)}
        ${dRow("Email", escapeHtml(options.toEmail), !venue)}
        ${venue ? dRow("Event City", `${escapeHtml(venue.displayCity)} &mdash; ${escapeHtml(venue.hotel)}`) : ""}
        ${venue ? dRow("Date",       escapeHtml(venue.dates), true) : ""}
      </table>
    </div>

    <!-- next steps — compact 3-col -->
    <div style="margin:0 22px 18px;background:#f8fafc;border-radius:12px;padding:14px 16px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="32%" style="text-align:center;padding:4px 6px;vertical-align:top;">
            <div style="font-family:Arial,sans-serif;font-size:18px;">&#128338;</div>
            <div style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#0c2f37;margin-top:3px;">Under Review</div>
            <div style="font-family:Arial,sans-serif;font-size:10px;color:#64748b;margin-top:2px;">2–3 business days</div>
          </td>
          <td width="4%" style="text-align:center;color:#d1d5db;font-size:16px;">›</td>
          <td width="32%" style="text-align:center;padding:4px 6px;vertical-align:top;">
            <div style="font-family:Arial,sans-serif;font-size:18px;">&#128231;</div>
            <div style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#0c2f37;margin-top:3px;">Decision Email</div>
            <div style="font-family:Arial,sans-serif;font-size:10px;color:#64748b;margin-top:2px;">Sent to your inbox</div>
          </td>
          <td width="4%" style="text-align:center;color:#d1d5db;font-size:16px;">›</td>
          <td width="32%" style="text-align:center;padding:4px 6px;vertical-align:top;">
            <div style="font-family:Arial,sans-serif;font-size:18px;">&#127882;</div>
            <div style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#0c2f37;margin-top:3px;">Attend &amp; Connect</div>
            <div style="font-family:Arial,sans-serif;font-size:10px;color:#64748b;margin-top:2px;">Aug 1–6, 2026</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- contact -->
    <div style="padding:0 22px 22px;font-family:Arial,sans-serif;font-size:12px;color:#94a3b8;text-align:center;">
      Questions? &nbsp;
      <a href="mailto:info@sldiaspora.org" style="color:#005a1b;font-weight:700;text-decoration:none;">info@sldiaspora.org</a>
      &nbsp;&middot;&nbsp;
      <a href="tel:+252638880240" style="color:#005a1b;font-weight:700;text-decoration:none;">+252 63 8880240</a>
    </div>

    ${emailCardClose()}
    ${emailFooter()}
  `);

  return sendHtmlEmail({
    to: options.toEmail,
    subject: "Somaliland Diaspora Week 2026 — Registration Received",
    html,
  });
};

// ---------------------------------------------------------------------------
// Email 2 — Approval / Official Invitation
// ---------------------------------------------------------------------------

// Maps the registered city name to venue + event date
export const sendDiasporaWeekApprovalEmail = async (options: {
  toEmail: string;
  name: string;
  registrationType?: "individual" | "business";
  country?: string;
  city?: string;
  profession?: string;
  businessName?: string;
  contactPerson?: string;
  industry?: string;
  website?: string;
}) => {
  const safeName    = escapeHtml(options.name || "Delegate");
  const baseUrl     = resolveAppBaseUrl();
  const portalUrl   = `${baseUrl}/diaspora-week/portal`;
  const siteUrl     = (process.env.NEXT_PUBLIC_SITE_URL || "https://sldiaspora.org").replace(/\/$/, "");

  const isBusiness  = options.registrationType === "business";
  const typeLabel   = isBusiness ? "Business Exhibitor" : "Individual Delegate";
  const venue       = resolveCityVenue(options.city || "hargeisa");

  const extraInfoRows = [
    !isBusiness && options.profession  ? ["Profession",     escapeHtml(options.profession)]  : null,
    isBusiness  && options.industry    ? ["Industry",       escapeHtml(options.industry)]     : null,
    isBusiness  && options.contactPerson ? ["Contact Person", escapeHtml(options.contactPerson)] : null,
    options.country                    ? ["Country",        escapeHtml(options.country)]      : null,
  ].filter(Boolean) as [string, string][];

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0b1f13;">

<!-- outer wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0b1f13;padding:32px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

  <!-- INVITATION CARD -->
  <tr>
    <td style="background:#ffffff;border-radius:20px;overflow:hidden;
      box-shadow:0 24px 60px rgba(0,0,0,0.5);">

      <!-- gold-green hero header -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:linear-gradient(135deg,#004d16 0%,#006b20 40%,#007d26 70%,#005a1b 100%);
            padding:32px 28px 28px;text-align:center;">

            <!-- top label -->
            <div style="display:inline-block;border:1px solid rgba(255,215,0,0.5);
              background:rgba(255,215,0,0.12);border-radius:999px;
              padding:4px 16px;font-family:Arial,sans-serif;font-size:10px;
              letter-spacing:2.5px;text-transform:uppercase;color:#fde68a;margin-bottom:16px;">
              Official Invitation
            </div>

            <!-- main title -->
            <div style="font-family:Arial,sans-serif;font-size:26px;font-weight:900;
              color:#ffffff;line-height:1.2;margin-bottom:6px;letter-spacing:-0.3px;">
              Somaliland Diaspora Week
            </div>
            <div style="font-family:Arial,sans-serif;font-size:16px;font-weight:700;
              color:rgba(255,255,255,0.85);margin-bottom:14px;">2026</div>

            <!-- dates strip -->
            <div style="display:inline-block;background:rgba(255,255,255,0.1);
              border:1px solid rgba(255,255,255,0.2);border-radius:999px;
              padding:6px 18px;font-family:Arial,sans-serif;font-size:12px;
              color:rgba(255,255,255,0.9);letter-spacing:0.3px;">
              Aug 1–6, 2026 &nbsp;&middot;&nbsp; Hargeisa &nbsp;&middot;&nbsp; Borama &nbsp;&middot;&nbsp; Burao
            </div>
          </td>
        </tr>

        <!-- approved ribbon -->
        <tr>
          <td style="background:linear-gradient(90deg,#007a26,#009e30,#007a26);
            padding:10px 28px;text-align:center;">
            <div style="font-family:Arial,sans-serif;font-size:12px;font-weight:800;
              color:#ffffff;letter-spacing:2px;text-transform:uppercase;">
              &#10003; &nbsp; Registration Approved &nbsp; &#10003;
            </div>
          </td>
        </tr>
      </table>

      <!-- white body -->
      <table width="100%" cellpadding="0" cellspacing="0">

        <!-- DELEGATE PASS block -->
        <tr>
          <td style="padding:20px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:linear-gradient(135deg,#f0faf4 0%,#e8f5ee 100%);
                border:1px solid #c3e6ce;border-radius:14px;overflow:hidden;">

              <!-- pass header -->
              <tr>
                <td style="background:linear-gradient(135deg,#005a1b,#007a26);
                  padding:14px 20px;">
                  <div style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;
                    text-transform:uppercase;color:rgba(255,255,255,0.6);margin-bottom:4px;">
                    Delegate Pass
                  </div>
                  <div style="font-family:Arial,sans-serif;font-size:18px;font-weight:900;
                    color:#ffffff;">${safeName}</div>
                  <div style="margin-top:5px;display:inline-block;background:rgba(255,255,255,0.2);
                    border:1px solid rgba(255,255,255,0.35);border-radius:999px;
                    padding:2px 10px;font-family:Arial,sans-serif;font-size:10px;
                    font-weight:700;color:#ffffff;letter-spacing:0.5px;">
                    ${escapeHtml(typeLabel)}
                  </div>
                </td>
              </tr>

              <!-- tear line -->
              <tr><td style="border-top:2px dashed #a8d5b5;"></td></tr>

              <!-- pass info grid -->
              <tr>
                <td style="padding:16px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="50%" style="vertical-align:top;padding-bottom:12px;padding-right:10px;">
                        <div style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:1.5px;
                          text-transform:uppercase;color:#64748b;margin-bottom:3px;">Event City</div>
                        <div style="font-family:Arial,sans-serif;font-size:14px;font-weight:800;
                          color:#004d16;">${escapeHtml(venue.displayCity)}</div>
                      </td>
                      <td width="50%" style="vertical-align:top;padding-bottom:12px;">
                        <div style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:1.5px;
                          text-transform:uppercase;color:#64748b;margin-bottom:3px;">Date</div>
                        <div style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;
                          color:#0c2f37;">${escapeHtml(venue.dates)}</div>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" style="border-top:1px solid #c3e6ce;padding-top:12px;">
                        <div style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:1.5px;
                          text-transform:uppercase;color:#64748b;margin-bottom:3px;">Venue</div>
                        <div style="font-family:Arial,sans-serif;font-size:13px;font-weight:700;
                          color:#0c2f37;">${escapeHtml(venue.hotel)}, ${escapeHtml(venue.displayCity)}</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- YOUR DETAILS section -->
        <tr>
          <td style="padding:0 28px 8px;">
            <div style="font-family:Arial,sans-serif;font-size:9px;font-weight:700;
              letter-spacing:2px;text-transform:uppercase;color:#94a3b8;margin-bottom:10px;">
              Your Details
            </div>
            <table width="100%" cellpadding="0" cellspacing="0"
              style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
              <tr>
                <td style="padding:10px 16px;color:#64748b;font-family:Arial,sans-serif;
                  font-size:12px;width:40%;border-bottom:1px solid #f1f5f9;
                  background:#fafcfb;">Full Name</td>
                <td style="padding:10px 16px;color:#0c2f37;font-family:Arial,sans-serif;
                  font-size:12px;font-weight:700;border-bottom:1px solid #f1f5f9;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;color:#64748b;font-family:Arial,sans-serif;
                  font-size:12px;border-bottom:1px solid #f1f5f9;background:#fafcfb;">Email</td>
                <td style="padding:10px 16px;color:#0c2f37;font-family:Arial,sans-serif;
                  font-size:12px;font-weight:700;border-bottom:1px solid #f1f5f9;
                  word-break:break-all;">${escapeHtml(options.toEmail)}</td>
              </tr>
              ${extraInfoRows.map(([label, value], i) => `
              <tr>
                <td style="padding:10px 16px;color:#64748b;font-family:Arial,sans-serif;
                  font-size:12px;${i < extraInfoRows.length - 1 ? "border-bottom:1px solid #f1f5f9;" : ""}background:#fafcfb;">${label}</td>
                <td style="padding:10px 16px;color:#0c2f37;font-family:Arial,sans-serif;
                  font-size:12px;font-weight:700;${i < extraInfoRows.length - 1 ? "border-bottom:1px solid #f1f5f9;" : ""}">${value}</td>
              </tr>`).join("")}
            </table>
          </td>
        </tr>

        <!-- highlights strip -->
        <tr>
          <td style="padding:20px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#f8fafc;border-radius:12px;">
              <tr>
                <td width="33%" style="text-align:center;padding:14px 8px;vertical-align:top;">
                  <div style="font-family:Arial,sans-serif;font-size:24px;font-weight:900;
                    color:#005a1b;">5</div>
                  <div style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;
                    color:#0c2f37;margin-top:2px;">Day Programme</div>
                  <div style="font-family:Arial,sans-serif;font-size:10px;color:#94a3b8;
                    margin-top:1px;">Ceremony &amp; Gala</div>
                </td>
                <td width="33%" style="text-align:center;padding:14px 8px;vertical-align:top;
                  border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
                  <div style="font-family:Arial,sans-serif;font-size:24px;font-weight:900;
                    color:#005a1b;">3</div>
                  <div style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;
                    color:#0c2f37;margin-top:2px;">Cities</div>
                  <div style="font-family:Arial,sans-serif;font-size:10px;color:#94a3b8;
                    margin-top:1px;">Hargeisa · Borama · Burao</div>
                </td>
                <td width="33%" style="text-align:center;padding:14px 8px;vertical-align:top;">
                  <div style="font-family:Arial,sans-serif;font-size:24px;font-weight:900;
                    color:#005a1b;">500+</div>
                  <div style="font-family:Arial,sans-serif;font-size:11px;font-weight:700;
                    color:#0c2f37;margin-top:2px;">Delegates</div>
                  <div style="font-family:Arial,sans-serif;font-size:10px;color:#94a3b8;
                    margin-top:1px;">Diaspora &amp; Local</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA button -->
        <tr>
          <td style="padding:4px 28px 32px;text-align:center;">
            <a href="${escapeHtml(portalUrl)}"
              style="display:inline-block;background:linear-gradient(135deg,#004d16 0%,#007a26 100%);
                color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:999px;
                font-family:Arial,sans-serif;font-weight:800;font-size:14px;letter-spacing:0.3px;
                box-shadow:0 8px 24px rgba(0,90,27,0.4);">
              Open Event Portal &rarr;
            </a>
            <div style="margin-top:10px;font-family:Arial,sans-serif;font-size:11px;color:#94a3b8;">
              Sign in with your email address &nbsp;&middot;&nbsp;
              <a href="${escapeHtml(portalUrl)}" style="color:#007a26;text-decoration:none;">
                ${escapeHtml(portalUrl)}
              </a>
            </div>
          </td>
        </tr>

      </table>
    </td>
  </tr>

  <!-- footer -->
  <tr>
    <td style="padding:20px 0 0;text-align:center;">
      <div style="font-family:Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.35);
        line-height:1.9;">
        Somaliland Diaspora Week 2026 &middot; Hargeisa, Somaliland<br/>
        <a href="mailto:info@sldiaspora.org"
          style="color:rgba(255,255,255,0.5);text-decoration:none;">info@sldiaspora.org</a>
        &nbsp;&middot;&nbsp;
        <a href="tel:+252638880240"
          style="color:rgba(255,255,255,0.5);text-decoration:none;">+252 63 8880240</a>
      </div>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  return sendHtmlEmail({
    to: options.toEmail,
    subject: "You're Invited — Somaliland Diaspora Week 2026",
    html,
  });
};

// ---------------------------------------------------------------------------
// Public content (schedule outline, exhibitors, partners, gallery)
// ---------------------------------------------------------------------------

const toText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
};

const toFileId = (value: unknown): string | null => {
  if (!value) return null;

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.id === "string" || typeof obj.id === "number") {
      return String(obj.id);
    }
  }

  return null;
};

const toImageUrl = (value: unknown): string | null => {
  const fileId = toFileId(value);
  return fileId ? getAssetUrl(fileId) : null;
};

const fetchCollection = async (
  collection: string,
  query = "fields=*&limit=500&sort=sort,date_created"
): Promise<Record<string, unknown>[] | null> => {
  try {
    const response = await directusFetch(`/items/${encodeURIComponent(collection)}?${query}`);

    if (response.status === 404) return null;
    if (!response.ok) return null;

    const result = (await response.json().catch(() => null)) as DirectusResult<
      Record<string, unknown>[]
    > | null;

    return Array.isArray(result?.data) ? result.data : [];
  } catch {
    return null;
  }
};

export type ScheduleItem = {
  id: string;
  dayNumber: number;
  dayLabel: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  speaker: string;
  location: string;
  sessionType: string;
};

const normalizeScheduleRow = (row: Record<string, unknown>, index: number): ScheduleItem => ({
  id: String(row.id ?? index + 1),
  dayNumber: Number(row.day_number ?? row.day ?? 1) || 1,
  dayLabel: toText(row.day_label) || `Day ${Number(row.day_number ?? row.day ?? 1) || 1}`,
  date: toText(row.date),
  startTime: toText(row.start_time ?? row.time),
  endTime: toText(row.end_time),
  title: toText(row.title) || "Untitled Session",
  description: toText(row.description),
  speaker: toText(row.speaker ?? row.speakers),
  location: toText(row.location ?? row.venue),
  sessionType: toText(row.session_type ?? row.type),
});

export type ExhibitorItem = {
  id: string;
  name: string;
  logo: string | null;
  description: string;
  boothNumber: string;
  category: string;
  website: string;
};

const normalizeExhibitorRow = (row: Record<string, unknown>, index: number): ExhibitorItem => ({
  id: String(row.id ?? index + 1),
  name: toText(row.name ?? row.title) || `Exhibitor ${index + 1}`,
  logo: toImageUrl(row.logo ?? row.image),
  description: toText(row.description),
  boothNumber: toText(row.booth_number ?? row.booth),
  category: toText(row.category),
  website: toText(row.website),
});

export type PartnerItem = {
  id: string;
  name: string;
  logo: string | null;
  website: string;
  partnerType: string;
};

const normalizePartnerRow = (row: Record<string, unknown>, index: number): PartnerItem => ({
  id: String(row.id ?? index + 1),
  name: toText(row.name ?? row.title) || `Partner ${index + 1}`,
  logo: toImageUrl(row.logo ?? row.image),
  website: toText(row.website),
  partnerType: toText(row.partner_type ?? row.type) || "Partner",
});

export type GalleryMediaItem = {
  id: string;
  title: string;
  url: string;
  type: "image" | "video";
};

const normalizeGalleryRows = (rows: Record<string, unknown>[]): GalleryMediaItem[] => {
  const media: GalleryMediaItem[] = [];

  rows.forEach((row, rowIndex) => {
    const title = toText(row.title ?? row.name) || `Diaspora Week ${rowIndex + 1}`;

    const imageFieldCandidates = ["images", "photos", "files", "media", "pictures"];
    const videoFieldCandidates = ["videos", "video_files"];

    imageFieldCandidates.forEach((field) => {
      const value = row[field];
      const entries = Array.isArray(value) ? value : value ? [value] : [];
      entries.forEach((entry, entryIndex) => {
        const url = toImageUrl(entry);
        if (url) {
          media.push({ id: `${row.id ?? rowIndex}-${field}-${entryIndex}`, title, url, type: "image" });
        }
      });
    });

    videoFieldCandidates.forEach((field) => {
      const value = row[field];
      const entries = Array.isArray(value) ? value : value ? [value] : [];
      entries.forEach((entry, entryIndex) => {
        const url = toImageUrl(entry);
        if (url) {
          media.push({ id: `${row.id ?? rowIndex}-${field}-${entryIndex}`, title, url, type: "video" });
        }
      });
    });
  });

  return media;
};

export const getScheduleItems = async (): Promise<ScheduleItem[]> => {
  const rows = await fetchCollection(SCHEDULE_COLLECTION, "fields=*&limit=500&sort=sort,day_number,start_time");
  if (!rows) return [];
  return rows.map(normalizeScheduleRow);
};

export const getExhibitors = async (): Promise<ExhibitorItem[]> => {
  const rows = await fetchCollection(EXHIBITORS_COLLECTION, "fields=*.*&limit=500&sort=sort,name");
  if (!rows) return [];
  return rows.map(normalizeExhibitorRow);
};

export const getPartners = async (): Promise<PartnerItem[]> => {
  const rows = await fetchCollection(PARTNERS_COLLECTION, "fields=*.*&limit=500&sort=sort,name");
  if (!rows) return [];
  return rows.map(normalizePartnerRow);
};

export const getGalleryMedia = async (): Promise<GalleryMediaItem[]> => {
  const rows = await fetchCollection(GALLERY_COLLECTION, "fields=*.*&limit=200&sort=sort,-date_created");
  if (!rows) return [];
  return normalizeGalleryRows(rows);
};

export type DiasporaWeekPublicContent = {
  scheduleOutline: Array<{ dayNumber: number; dayLabel: string; date: string; title: string }>;
  exhibitorsPreview: ExhibitorItem[];
  exhibitorsCount: number;
  partnersPreview: PartnerItem[];
  partnersCount: number;
  galleryPreview: GalleryMediaItem[];
};

export const getDiasporaWeekPublicContent = async (): Promise<DiasporaWeekPublicContent> => {
  const [schedule, exhibitors, partners, gallery] = await Promise.all([
    getScheduleItems(),
    getExhibitors(),
    getPartners(),
    getGalleryMedia(),
  ]);

  return {
    scheduleOutline: schedule.map((item) => ({
      dayNumber: item.dayNumber,
      dayLabel: item.dayLabel,
      date: item.date,
      title: item.title,
    })),
    exhibitorsPreview: exhibitors.slice(0, 6),
    exhibitorsCount: exhibitors.length,
    partnersPreview: partners.slice(0, 8),
    partnersCount: partners.length,
    galleryPreview: gallery.slice(0, 8),
  };
};

export type DiasporaWeekFullContent = {
  schedule: ScheduleItem[];
  exhibitors: ExhibitorItem[];
  partners: PartnerItem[];
  gallery: GalleryMediaItem[];
};

export const getDiasporaWeekFullContent = async (): Promise<DiasporaWeekFullContent> => {
  const [schedule, exhibitors, partners, gallery] = await Promise.all([
    getScheduleItems(),
    getExhibitors(),
    getPartners(),
    getGalleryMedia(),
  ]);

  return { schedule, exhibitors, partners, gallery };
};
