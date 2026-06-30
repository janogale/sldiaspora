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
const emailWrapper = (innerHtml: string) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:${EMAIL_BG};">
<table width="100%" cellpadding="0" cellspacing="0" style="background:${EMAIL_BG};padding:32px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      ${innerHtml}
    </table>
  </td></tr>
</table>
</body>
</html>`;

// Top logo bar shared by both emails
const emailLogoBar = (baseUrl: string) => `
<tr>
  <td style="text-align:center;padding-bottom:16px;">
    <img src="${escapeHtml(baseUrl)}/assets/imgs/logo/logo.png" alt="Somaliland Diaspora" width="48" height="48"
      style="border-radius:12px;background:#ffffff;padding:5px;border:1px solid rgba(255,255,255,0.15);" />
    <div style="margin-top:6px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;
      text-transform:uppercase;color:rgba(255,255,255,0.55);">Somaliland Diaspora Week</div>
  </td>
</tr>`;

// Hero banner row
const emailHeroBanner = (subtitle: string) => `
<tr>
  <td style="background:linear-gradient(135deg,#005a1b 0%,#007a26 50%,#1a5c0a 100%);
    border-radius:18px 18px 0 0;padding:30px 28px;text-align:center;">
    <div style="display:inline-block;background:rgba(255,215,0,0.18);border:1px solid rgba(255,215,0,0.4);
      border-radius:999px;padding:4px 14px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;
      text-transform:uppercase;color:#fde68a;margin-bottom:12px;">${subtitle}</div>
    <div style="font-family:Arial,sans-serif;font-size:28px;font-weight:900;color:#ffffff;
      line-height:1.2;margin-bottom:8px;">Somaliland Diaspora Week 2026</div>
    <div style="font-family:Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.85);">
      August&nbsp;1–6,&nbsp;2026 &nbsp;&middot;&nbsp; Hargeisa &nbsp;&middot;&nbsp; Borama &nbsp;&middot;&nbsp; Burao
    </div>
  </td>
</tr>`;

// White card body wrapper
const emailCardOpen = () =>
  `<tr><td style="background:#ffffff;border-radius:0 0 18px 18px;overflow:hidden;
    box-shadow:0 20px 48px rgba(0,0,0,0.35);">`;
const emailCardClose = () => `</td></tr>`;

// Footer row
const emailFooter = () => `
<tr>
  <td style="padding:20px 0 0;text-align:center;">
    <div style="font-family:Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.45);line-height:1.8;">
      Somaliland Diaspora Week 2026 &middot; Hargeisa, Somaliland<br/>
      Questions? <a href="mailto:info@sldiaspora.org" style="color:rgba(255,255,255,0.65);text-decoration:none;">info@sldiaspora.org</a>
      &nbsp;&middot;&nbsp; <a href="tel:+252638880240" style="color:rgba(255,255,255,0.65);text-decoration:none;">+252 63 8880240</a>
    </div>
  </td>
</tr>`;

// ---------------------------------------------------------------------------
// Email 1 — Registration Received (pending confirmation)
// ---------------------------------------------------------------------------

export const sendDiasporaWeekRegistrationReceivedEmail = async (options: {
  toEmail: string;
  name: string;
  registrationType: "individual" | "business";
}) => {
  const safeName = escapeHtml(options.name || "there");
  const baseUrl = resolveAppBaseUrl();
  const isBusiness = options.registrationType === "business";
  const typeLabel = isBusiness ? "Business Exhibitor" : "Individual Delegate";
  const typeColor = isBusiness ? "#0055b3" : "#005a1b";
  const typeBg   = isBusiness ? "#daeeff"  : "#d7f5e0";

  const html = emailWrapper(`
    ${emailLogoBar(baseUrl)}
    ${emailHeroBanner("Registration Received")}
    ${emailCardOpen()}

    <!-- greeting -->
    <div style="padding:28px 28px 0;">
      <div style="display:inline-block;background:#d7f5e0;color:#005a1b;
        border-radius:999px;padding:5px 14px;font-family:Arial,sans-serif;font-size:12px;
        font-weight:700;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:16px;">
        &#10003;&nbsp; Registration Received
      </div>
      <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:16px;color:#0c2f37;">
        Dear <strong>${safeName}</strong>,
      </p>
      <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:14px;color:#334155;line-height:1.75;">
        Thank you for registering for <strong>Somaliland Diaspora Week 2026</strong> as a
        <strong>${escapeHtml(typeLabel)}</strong>. We have successfully received your application
        and our team is currently reviewing it.
      </p>
    </div>

    <!-- submitted details box -->
    <div style="margin:0 28px 24px;background:#f4fbf7;border:1.5px solid #d6e4e1;
      border-radius:14px;overflow:hidden;">
      <div style="padding:12px 20px;border-bottom:1px solid #d6e4e1;">
        <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;
          text-transform:uppercase;color:#4b666d;margin-bottom:4px;">Submitted Details</div>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:14px;">
        <tr>
          <td style="padding:10px 20px;color:#4b666d;width:40%;border-bottom:1px solid #eef3f1;">Name</td>
          <td style="padding:10px 20px;color:#0c2f37;font-weight:600;border-bottom:1px solid #eef3f1;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding:10px 20px;color:#4b666d;border-bottom:1px solid #eef3f1;">Registration Type</td>
          <td style="padding:10px 20px;border-bottom:1px solid #eef3f1;">
            <span style="display:inline-block;background:${typeBg};color:${typeColor};
              border-radius:999px;padding:2px 10px;font-size:12px;font-weight:700;">
              ${escapeHtml(typeLabel)}
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 20px;color:#4b666d;border-bottom:1px solid #eef3f1;">Email</td>
          <td style="padding:10px 20px;color:#0c2f37;font-weight:600;border-bottom:1px solid #eef3f1;">${escapeHtml(options.toEmail)}</td>
        </tr>
        <tr>
          <td style="padding:10px 20px;color:#4b666d;">Status</td>
          <td style="padding:10px 20px;">
            <span style="display:inline-block;background:#fff7ed;color:#92400e;
              border-radius:999px;padding:2px 10px;font-size:12px;font-weight:700;">
              &#9679;&nbsp; Pending Review
            </span>
          </td>
        </tr>
      </table>
    </div>

    <!-- what happens next -->
    <div style="margin:0 28px 24px;">
      <div style="font-family:Arial,sans-serif;font-size:13px;font-weight:800;letter-spacing:0.5px;
        text-transform:uppercase;color:#0c2f37;margin-bottom:14px;">What Happens Next</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="36" valign="top" style="padding-right:12px;">
            <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#005a1b,#1f8a3b);
              color:#fff;font-family:Arial,sans-serif;font-size:12px;font-weight:700;
              text-align:center;line-height:28px;">1</div>
          </td>
          <td style="padding-bottom:14px;">
            <div style="font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#0c2f37;">Application Review</div>
            <div style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;line-height:1.6;">
              Our team reviews your details within <strong>2–3 business days</strong>. No action needed from you.
            </div>
          </td>
        </tr>
        <tr>
          <td width="36" valign="top" style="padding-right:12px;">
            <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#005a1b,#1f8a3b);
              color:#fff;font-family:Arial,sans-serif;font-size:12px;font-weight:700;
              text-align:center;line-height:28px;">2</div>
          </td>
          <td style="padding-bottom:14px;">
            <div style="font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#0c2f37;">Approval &amp; Access Code</div>
            <div style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;line-height:1.6;">
              Once approved you'll receive a <strong>unique access code</strong> by email — your digital pass to the event portal.
            </div>
          </td>
        </tr>
        <tr>
          <td width="36" valign="top" style="padding-right:12px;">
            <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#005a1b,#1f8a3b);
              color:#fff;font-family:Arial,sans-serif;font-size:12px;font-weight:700;
              text-align:center;line-height:28px;">3</div>
          </td>
          <td style="padding-bottom:4px;">
            <div style="font-family:Arial,sans-serif;font-size:14px;font-weight:700;color:#0c2f37;">Attend &amp; Connect</div>
            <div style="font-family:Arial,sans-serif;font-size:13px;color:#64748b;line-height:1.6;">
              Join 500+ diaspora members, investors, and entrepreneurs across Hargeisa, Borama &amp; Burao.
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- event highlights strip -->
    <div style="margin:0 28px 28px;background:linear-gradient(135deg,#005a1b 0%,#007a26 100%);
      border-radius:12px;padding:16px 20px;">
      <div style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;
        color:rgba(255,255,255,0.7);margin-bottom:10px;">Event Highlights</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="33%" style="text-align:center;padding:6px 4px;">
            <div style="font-family:Arial,sans-serif;font-size:20px;font-weight:900;color:#fde68a;">5</div>
            <div style="font-family:Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.8);">Day Programme</div>
          </td>
          <td width="33%" style="text-align:center;padding:6px 4px;border-left:1px solid rgba(255,255,255,0.2);border-right:1px solid rgba(255,255,255,0.2);">
            <div style="font-family:Arial,sans-serif;font-size:20px;font-weight:900;color:#fde68a;">3</div>
            <div style="font-family:Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.8);">Cities (Roadshow)</div>
          </td>
          <td width="33%" style="text-align:center;padding:6px 4px;">
            <div style="font-family:Arial,sans-serif;font-size:20px;font-weight:900;color:#fde68a;">500+</div>
            <div style="font-family:Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.8);">Delegates</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- contact note -->
    <div style="padding:0 28px 28px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#64748b;line-height:1.7;">
        Questions? Reach us at
        <a href="mailto:info@sldiaspora.org" style="color:#005a1b;font-weight:700;text-decoration:none;">info@sldiaspora.org</a>
        or call <a href="tel:+252638880240" style="color:#005a1b;font-weight:700;text-decoration:none;">+252 63 8880240</a>.
      </p>
    </div>

    ${emailCardClose()}
    ${emailFooter()}
  `);

  return sendHtmlEmail({
    to: options.toEmail,
    subject: "Somaliland Diaspora Week 2026 — Registration Received ✓",
    html,
  });
};

// ---------------------------------------------------------------------------
// Email 2 — Approval / Official Invitation (with access code)
// ---------------------------------------------------------------------------

export const sendDiasporaWeekApprovalEmail = async (options: {
  toEmail: string;
  name: string;
  accessCode: string;
  registrationType?: "individual" | "business";
  country?: string;
  city?: string;
  profession?: string;
  // business-specific
  businessName?: string;
  contactPerson?: string;
  industry?: string;
  website?: string;
}) => {
  const safeName = escapeHtml(options.name || "there");
  const baseUrl = resolveAppBaseUrl();
  const portalUrl = `${baseUrl}/diaspora-week/portal`;

  const isBusiness = options.registrationType === "business";
  const typeLabel  = isBusiness ? "Business Exhibitor" : "Individual Delegate";
  const typeColor  = isBusiness ? "#0055b3" : "#005a1b";
  const typeBg     = isBusiness ? "#daeeff"  : "#d7f5e0";

  const locationLine = [options.city, options.country]
    .filter((v): v is string => Boolean(v))
    .map(escapeHtml)
    .join(", ");

  // Build optional detail rows
  const detailRows = [
    options.profession && !isBusiness
      ? `<tr>
          <td style="padding:10px 20px;color:#4b666d;width:38%;border-bottom:1px solid #eef3f1;">Profession</td>
          <td style="padding:10px 20px;color:#0c2f37;font-weight:600;border-bottom:1px solid #eef3f1;">${escapeHtml(options.profession)}</td>
        </tr>`
      : "",
    isBusiness && options.contactPerson
      ? `<tr>
          <td style="padding:10px 20px;color:#4b666d;border-bottom:1px solid #eef3f1;">Contact Person</td>
          <td style="padding:10px 20px;color:#0c2f37;font-weight:600;border-bottom:1px solid #eef3f1;">${escapeHtml(options.contactPerson)}</td>
        </tr>`
      : "",
    isBusiness && options.industry
      ? `<tr>
          <td style="padding:10px 20px;color:#4b666d;border-bottom:1px solid #eef3f1;">Industry</td>
          <td style="padding:10px 20px;color:#0c2f37;font-weight:600;border-bottom:1px solid #eef3f1;">${escapeHtml(options.industry)}</td>
        </tr>`
      : "",
    isBusiness && options.website
      ? `<tr>
          <td style="padding:10px 20px;color:#4b666d;border-bottom:1px solid #eef3f1;">Website</td>
          <td style="padding:10px 20px;font-weight:600;border-bottom:1px solid #eef3f1;">
            <a href="${escapeHtml(options.website)}" style="color:#0055b3;text-decoration:none;">${escapeHtml(options.website)}</a>
          </td>
        </tr>`
      : "",
    locationLine
      ? `<tr>
          <td style="padding:10px 20px;color:#4b666d;border-bottom:1px solid #eef3f1;">Location</td>
          <td style="padding:10px 20px;color:#0c2f37;font-weight:600;border-bottom:1px solid #eef3f1;">${locationLine}</td>
        </tr>`
      : "",
  ].join("");

  const businessWelcome = isBusiness
    ? `<p style="margin:0 0 18px;font-family:Arial,sans-serif;font-size:14px;color:#334155;line-height:1.75;">
        Your business will be showcased in the official <strong>Exhibition Zone</strong> across
        Hargeisa, Borama, and Burao. Our team will contact you separately with your booth assignment
        and exhibitor briefing pack. Please arrive <strong>60 minutes before the opening</strong>
        for exhibitor check-in and setup.
      </p>`
    : "";

  const practicalRows = isBusiness
    ? [
        ["Exhibitor Check-in", "60 minutes before the opening ceremony, at your designated venue"],
        ["What to Bring", "This email (printed or digital), company ID, and exhibition materials"],
        ["Booth Setup", "Setup period begins the evening before your city date — details to follow"],
        ["Event Support", "WhatsApp group link will be shared before the event"],
      ]
    : [
        ["Check-in", "30 minutes before the first session at the venue entrance"],
        ["What to Bring", "This email (printed or digital) and a valid photo ID"],
        ["Dress Code", "Smart casual or traditional attire — both warmly welcomed"],
        ["Event Support", "WhatsApp group link will be shared before the event"],
      ];

  const html = emailWrapper(`
    ${emailLogoBar(baseUrl)}
    ${emailHeroBanner("Official Delegate Invitation")}
    ${emailCardOpen()}

    <!-- approval badge + greeting -->
    <div style="padding:28px 28px 0;">
      <div style="display:inline-block;background:#d7f5e0;color:#005a1b;
        border-radius:999px;padding:5px 14px;font-family:Arial,sans-serif;font-size:12px;
        font-weight:700;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:16px;">
        &#10003;&nbsp; Registration Approved
      </div>
      <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:17px;color:#0c2f37;">
        Congratulations, <strong>${safeName}</strong>!
      </p>
      <p style="margin:0 0 14px;font-family:Arial,sans-serif;font-size:14px;color:#334155;line-height:1.75;">
        We are delighted to confirm your place at <strong>Somaliland Diaspora Week 2026</strong>.
        Below you will find your official access code and everything you need to prepare for an
        unforgettable week of connection, investment, and culture.
      </p>
      ${businessWelcome}
    </div>

    <!-- delegate details card -->
    <div style="margin:4px 28px 20px;border:1.5px solid #d6e4e1;border-radius:14px;overflow:hidden;">
      <div style="background:#f4fbf7;padding:13px 20px;border-bottom:1px solid #d6e4e1;">
        <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;
          text-transform:uppercase;color:#4b666d;margin-bottom:4px;">Delegate Details</div>
        <div style="font-family:Arial,sans-serif;font-size:18px;font-weight:700;color:#0c2f37;">${safeName}</div>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:14px;">
        <tr>
          <td style="padding:10px 20px;color:#4b666d;width:38%;border-bottom:1px solid #eef3f1;">Registration Type</td>
          <td style="padding:10px 20px;border-bottom:1px solid #eef3f1;">
            <span style="display:inline-block;background:${typeBg};color:${typeColor};
              border-radius:999px;padding:2px 10px;font-size:12px;font-weight:700;">
              ${escapeHtml(typeLabel)}
            </span>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 20px;color:#4b666d;border-bottom:1px solid #eef3f1;">Email</td>
          <td style="padding:10px 20px;color:#0c2f37;font-weight:600;border-bottom:1px solid #eef3f1;">${escapeHtml(options.toEmail)}</td>
        </tr>
        ${detailRows}
        <tr>
          <td style="padding:10px 20px;color:#4b666d;border-bottom:1px solid #eef3f1;">Event Dates</td>
          <td style="padding:10px 20px;color:#0c2f37;font-weight:600;border-bottom:1px solid #eef3f1;">August 1–6, 2026</td>
        </tr>
        <tr>
          <td style="padding:10px 20px;color:#4b666d;">Cities</td>
          <td style="padding:10px 20px;color:#0c2f37;font-weight:600;">Hargeisa &middot; Borama &middot; Burao</td>
        </tr>
      </table>
    </div>

    <!-- ACCESS CODE — ticket style -->
    <div style="margin:0 28px 24px;background:linear-gradient(135deg,#78350f 0%,#92400e 50%,#78350f 100%);
      border-radius:14px;padding:0;overflow:hidden;">
      <div style="background:rgba(0,0,0,0.12);padding:14px 22px;border-bottom:1px dashed rgba(255,255,255,0.25);">
        <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;
          color:rgba(255,255,255,0.7);">Your Exclusive Access Code</div>
      </div>
      <div style="padding:20px 22px;text-align:center;">
        <div style="display:inline-block;background:#ffffff;border-radius:10px;
          padding:12px 28px;margin-bottom:10px;">
          <span style="font-family:'Courier New',Courier,monospace;font-size:26px;font-weight:900;
            letter-spacing:5px;color:#78350f;">${escapeHtml(options.accessCode)}</span>
        </div>
        <div style="font-family:Arial,sans-serif;font-size:12px;color:rgba(255,255,255,0.8);margin-top:4px;">
          Use this code together with your email address to sign in to the event portal
        </div>
      </div>
    </div>

    <!-- what's included -->
    <div style="margin:0 28px 22px;">
      <div style="font-family:Arial,sans-serif;font-size:13px;font-weight:800;letter-spacing:0.5px;
        text-transform:uppercase;color:#0c2f37;margin-bottom:14px;">What's Included</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="33%" style="text-align:center;padding:12px 8px;background:#f4fbf7;
            border-radius:10px;vertical-align:top;">
            <div style="font-family:Arial,sans-serif;font-size:18px;margin-bottom:6px;">&#128197;</div>
            <div style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#005a1b;">5-Day Programme</div>
            <div style="font-family:Arial,sans-serif;font-size:11px;color:#64748b;margin-top:4px;">
              Opening ceremony, panels &amp; closing gala
            </div>
          </td>
          <td width="4%" />
          <td width="33%" style="text-align:center;padding:12px 8px;background:#f4fbf7;
            border-radius:10px;vertical-align:top;">
            <div style="font-family:Arial,sans-serif;font-size:18px;margin-bottom:6px;">&#127970;</div>
            <div style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#005a1b;">Exhibition Zone</div>
            <div style="font-family:Arial,sans-serif;font-size:11px;color:#64748b;margin-top:4px;">
              Business showcases, networking &amp; pitching
            </div>
          </td>
          <td width="4%" />
          <td width="33%" style="text-align:center;padding:12px 8px;background:#f4fbf7;
            border-radius:10px;vertical-align:top;">
            <div style="font-family:Arial,sans-serif;font-size:18px;margin-bottom:6px;">&#127919;</div>
            <div style="font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#005a1b;">Startup Pitching</div>
            <div style="font-family:Arial,sans-serif;font-size:11px;color:#64748b;margin-top:4px;">
              Live pitch competitions &amp; investor meets
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- practical info -->
    <div style="margin:0 28px 24px;border:1.5px solid #d6e4e1;border-radius:14px;overflow:hidden;">
      <div style="background:#f4fbf7;padding:12px 20px;border-bottom:1px solid #d6e4e1;">
        <div style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:1px;
          text-transform:uppercase;color:#4b666d;">Practical Information</div>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:13px;">
        ${practicalRows
          .map(
            ([label, value], i) => `
        <tr>
          <td style="padding:10px 20px;color:#4b666d;width:38%;font-weight:600;
            ${i < practicalRows.length - 1 ? "border-bottom:1px solid #eef3f1;" : ""}">
            ${escapeHtml(label)}
          </td>
          <td style="padding:10px 20px;color:#334155;line-height:1.6;
            ${i < practicalRows.length - 1 ? "border-bottom:1px solid #eef3f1;" : ""}">
            ${escapeHtml(value)}
          </td>
        </tr>`
          )
          .join("")}
      </table>
    </div>

    <!-- CTA -->
    <div style="padding:0 28px 28px;text-align:center;">
      <a href="${escapeHtml(portalUrl)}"
        style="display:inline-block;background:linear-gradient(135deg,#005a1b 0%,#1f8a3b 100%);
          color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:999px;
          font-family:Arial,sans-serif;font-weight:800;font-size:15px;
          box-shadow:0 8px 24px rgba(0,90,27,0.4);">
        Open Event Portal &rarr;
      </a>
      <p style="margin:14px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#94a3b8;line-height:1.6;">
        Can't click the button? Copy this link:<br />
        <a href="${escapeHtml(portalUrl)}" style="color:#92400e;text-decoration:none;word-break:break-all;">${escapeHtml(portalUrl)}</a>
      </p>
    </div>

    <!-- social -->
    <div style="padding:0 28px 28px;text-align:center;border-top:1px solid #f1f5f9;padding-top:20px;">
      <div style="font-family:Arial,sans-serif;font-size:12px;color:#64748b;margin-bottom:6px;">
        Share your excitement &mdash; use our official hashtag
      </div>
      <div style="font-family:Arial,sans-serif;font-size:16px;font-weight:800;color:#005a1b;">
        #SomalilandDiasporaWeek2026
      </div>
    </div>

    ${emailCardClose()}
    ${emailFooter()}
  `);

  return sendHtmlEmail({
    to: options.toEmail,
    subject: "Your Official Invitation — Somaliland Diaspora Week 2026 (Access Code Inside)",
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
