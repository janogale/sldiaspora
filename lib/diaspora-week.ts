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

const emailShell = (title: string, bodyHtml: string) => `
  <div style="font-family: Arial, sans-serif; background: #f4f7f5; padding: 24px; color: #1f2937;">
    <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #d8e6dc; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);">
      <div style="background: linear-gradient(135deg, #fff7ed 0%, #ffffff 100%); padding: 20px 24px; border-bottom: 1px solid #f1e4d2;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${escapeHtml(resolveAppBaseUrl())}/assets/imgs/logo/logo.png" alt="Sldiaspora" width="42" height="42" style="border-radius: 8px; object-fit: contain; background: #ffffff; border: 1px solid #f1e4d2;" />
          <div>
            <div style="font-size: 20px; font-weight: 700; color: #b45309; margin-bottom: 2px;">${escapeHtml(title)}</div>
            <div style="font-size: 13px; color: #64748b;">Somaliland Diaspora Week</div>
          </div>
        </div>
      </div>
      <div style="padding: 22px 24px 24px; line-height: 1.6;">
        ${bodyHtml}
      </div>
    </div>
  </div>
`;

export const sendDiasporaWeekRegistrationReceivedEmail = async (options: {
  toEmail: string;
  name: string;
  registrationType: "individual" | "business";
}) => {
  const safeName = escapeHtml(options.name || "there");
  const typeLabel = options.registrationType === "business" ? "Business" : "Individual";

  const html = emailShell(
    "Registration Received",
    `
      <p style="margin: 0 0 12px;">Hello <strong>${safeName}</strong>,</p>
      <p style="margin: 0 0 12px;">
        Thank you for registering for <strong>Somaliland Diaspora Week</strong> as a
        <strong>${escapeHtml(typeLabel)}</strong> participant.
      </p>
      <p style="margin: 0 0 12px;">
        Your registration is currently <strong>pending review</strong>. Once approved by our team,
        you will receive an email with your unique access code to unlock the full event portal,
        including the 5-day schedule, sessions, exhibitors, partners, and the startup pitching agenda.
      </p>
      <p style="margin: 0; color: #64748b; font-size: 13px;">
        This usually takes 2-3 business days. No action is needed from you right now.
      </p>
    `
  );

  return sendHtmlEmail({
    to: options.toEmail,
    subject: "Somaliland Diaspora Week — Registration Received",
    html,
  });
};

export const sendDiasporaWeekApprovalEmail = async (options: {
  toEmail: string;
  name: string;
  accessCode: string;
  registrationType?: "individual" | "business";
  country?: string;
  city?: string;
  profession?: string;
}) => {
  const safeName = escapeHtml(options.name || "there");
  const baseUrl = resolveAppBaseUrl();
  const portalUrl = `${baseUrl}/diaspora-week/portal`;
  const logoUrl = `${baseUrl}/assets/imgs/logo/logo.png`;

  const typeLabel = options.registrationType === "business" ? "Business Delegate" : "Individual Delegate";
  const locationLine = [options.city, options.country]
    .filter((value): value is string => Boolean(value))
    .map(escapeHtml)
    .join(", ");

  const html = `
  <div style="font-family: Arial, sans-serif; background: #0c2f37; padding: 32px 16px; color: #1f2937;">
    <div style="max-width: 600px; margin: 0 auto;">

      <div style="text-align: center; margin-bottom: 18px;">
        <img src="${escapeHtml(logoUrl)}" alt="Sldiaspora" width="46" height="46" style="border-radius: 10px; background: #ffffff; padding: 4px;" />
      </div>

      <div style="background: linear-gradient(135deg, #005a1b 0%, #006d21 55%, #b45309 100%); border-radius: 18px 18px 0 0; padding: 26px 28px; text-align: center;">
        <div style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.8); margin-bottom: 8px;">Official Invitation</div>
        <div style="font-size: 26px; font-weight: 800; color: #ffffff; margin-bottom: 6px;">Somaliland Diaspora Week 2026</div>
        <div style="font-size: 14px; color: rgba(255,255,255,0.9);">August 1–6, 2026 &middot; Hargeisa &middot; Borama &middot; Burao</div>
      </div>

      <div style="background: #ffffff; border-radius: 0 0 18px 18px; padding: 0; box-shadow: 0 18px 40px rgba(0,0,0,0.25); overflow: hidden;">

        <div style="padding: 28px 28px 8px;">
          <div style="display: inline-block; padding: 5px 12px; border-radius: 999px; background: #edf8f1; color: #005a1b; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 16px;">&#10003; Registration Approved</div>
          <p style="margin: 0 0 14px; font-size: 16px;">Dear <strong>${safeName}</strong>,</p>
          <p style="margin: 0 0 18px; color: #334155; font-size: 14px; line-height: 1.7;">
            We are delighted to confirm your place at <strong>Somaliland Diaspora Week 2026</strong>.
            This invitation card carries your access details — please keep it for check-in and to sign
            in to the event portal.
          </p>
        </div>

        <div style="margin: 0 28px 24px; border: 2px dashed #d6e4e1; border-radius: 14px; padding: 0; overflow: hidden;">
          <div style="background: #f4fbf7; padding: 16px 20px; border-bottom: 2px dashed #d6e4e1;">
            <div style="font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #4b666d; margin-bottom: 4px;">Delegate</div>
            <div style="font-size: 19px; font-weight: 700; color: #0c2f37;">${safeName}</div>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 12px 20px; color: #4b666d; width: 38%; border-bottom: 1px solid #eef3f1;">Delegate Type</td>
              <td style="padding: 12px 20px; color: #0c2f37; font-weight: 600; border-bottom: 1px solid #eef3f1;">${escapeHtml(typeLabel)}</td>
            </tr>
            <tr>
              <td style="padding: 12px 20px; color: #4b666d; border-bottom: 1px solid #eef3f1;">Email</td>
              <td style="padding: 12px 20px; color: #0c2f37; font-weight: 600; border-bottom: 1px solid #eef3f1;">${escapeHtml(options.toEmail)}</td>
            </tr>
            ${
              locationLine
                ? `<tr>
              <td style="padding: 12px 20px; color: #4b666d; border-bottom: 1px solid #eef3f1;">Location</td>
              <td style="padding: 12px 20px; color: #0c2f37; font-weight: 600; border-bottom: 1px solid #eef3f1;">${locationLine}</td>
            </tr>`
                : ""
            }
            ${
              options.profession
                ? `<tr>
              <td style="padding: 12px 20px; color: #4b666d; border-bottom: 1px solid #eef3f1;">Profession</td>
              <td style="padding: 12px 20px; color: #0c2f37; font-weight: 600; border-bottom: 1px solid #eef3f1;">${escapeHtml(options.profession)}</td>
            </tr>`
                : ""
            }
            <tr>
              <td style="padding: 12px 20px; color: #4b666d;">Event Dates</td>
              <td style="padding: 12px 20px; color: #0c2f37; font-weight: 600;">Aug 1–6, 2026</td>
            </tr>
          </table>

          <div style="background: #fff7ed; padding: 18px 20px; text-align: center; border-top: 2px dashed #d6e4e1;">
            <div style="font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: #92400e; margin-bottom: 8px;">Your Access Code</div>
            <span style="display: inline-block; padding: 10px 22px; border-radius: 8px; background: #ffffff; border: 1px solid #f59e0b; font-size: 22px; font-weight: 800; letter-spacing: 4px; color: #b45309;">${escapeHtml(options.accessCode)}</span>
            <div style="font-size: 12px; color: #92400e; margin-top: 8px;">Use this code with your email to sign in to the portal</div>
          </div>
        </div>

        <div style="padding: 0 28px 28px; text-align: center;">
          <a href="${escapeHtml(portalUrl)}" style="display: inline-block; background: #005a1b; color: #ffffff; text-decoration: none; padding: 13px 26px; border-radius: 999px; font-weight: 700; font-size: 14px;">Open Event Portal &rarr;</a>
          <p style="margin: 16px 0 0; color: #64748b; font-size: 12px; line-height: 1.6;">
            Trouble with the button? Use this link:<br />
            <a href="${escapeHtml(portalUrl)}" style="color: #b45309; text-decoration: none;">${escapeHtml(portalUrl)}</a>
          </p>
        </div>
      </div>

      <p style="text-align: center; color: rgba(255,255,255,0.65); font-size: 12px; margin: 18px 0 0;">
        Somaliland Diaspora Week 2026 &middot; Hargeisa &middot; Borama &middot; Burao
      </p>
    </div>
  </div>
  `;

  return sendHtmlEmail({
    to: options.toEmail,
    subject: "Your Invitation — Somaliland Diaspora Week 2026 (Access Code Inside)",
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
