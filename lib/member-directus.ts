const DIRECTUS_URL = process.env.DIRECTUS_URL || "https://admin.sldiaspora.org";
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

type DirectusResult<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

const sendHtmlEmail = async (options: {
  to: string;
  subject: string;
  html: string;
}) => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpSecure = String(process.env.SMTP_SECURE || "false") === "true";
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const gmailFrom = process.env.GMAIL_FROM ||
    (gmailUser ? `Sldiaspora <${gmailUser}>` : undefined);

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
            auth: {
              user: smtpUser,
              pass: smtpPass,
            },
          }
        : {
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: gmailUser,
              pass: gmailAppPassword,
            },
          };

      const fromAddress = canUseSmtp
        ? smtpFrom
        : gmailFrom || gmailUser;

      const transporter = nodemailer.createTransport(transport);
      await transporter.sendMail({
        from: fromAddress,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      return true;
    } catch (error) {
      console.error("smtp email send failed", error);
    }
  }

  const candidatePaths = ["/utils/send/mail", "/utils/email/send"];
  for (const path of candidatePaths) {
    try {
      const response = await directusFetch(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: options.to,
          subject: options.subject,
          html: options.html,
        }),
      });

      if (response.ok) return true;
    } catch {
      continue;
    }
  }

  return false;
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

export const getMemberCollectionFields = async () => {
  const response = await directusFetch("/fields/members");

  if (!response.ok) return null;

  const result = (await response.json().catch(() => null)) as DirectusResult<
    Array<{ field: string }>
  > | null;

  const fields = result?.data?.map((item) => item.field).filter(Boolean) || [];
  return new Set(fields);
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

export const createMemberRecord = async (payload: Record<string, unknown>) => {
  const response = await directusFetch("/items/members", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json().catch(() => null)) as DirectusResult<
    Record<string, unknown>
  > | null;

  return { response, result };
};

export const updateMemberRecord = async (
  memberId: string,
  payload: Record<string, unknown>
) => {
  const response = await directusFetch(
    `/items/members/${encodeURIComponent(memberId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const result = (await response.json().catch(() => null)) as DirectusResult<
    Record<string, unknown>
  > | null;

  return { response, result };
};

export const filterPayloadByFields = (
  payload: Record<string, unknown>,
  allowedFields: Set<string> | null
) => {
  if (!allowedFields || allowedFields.size === 0) return payload;

  const filtered = Object.fromEntries(
    Object.entries(payload).filter(([key]) => allowedFields.has(key))
  );

  return filtered;
};

export const getMemberByEmail = async (email: string) => {
  const response = await directusFetch(
    `/items/members?filter[email][_eq]=${encodeURIComponent(
      email
    )}&limit=1&fields=*.*`
  );

  const result = (await response.json().catch(() => null)) as DirectusResult<
    Array<Record<string, unknown>>
  > | null;

  if (!response.ok) {
    throw new Error(
      getDirectusErrorMessage(result, "Could not fetch member by email.")
    );
  }

  return result?.data?.[0] || null;
};

export const getMemberById = async (memberId: string) => {
  const response = await directusFetch(
    `/items/members/${encodeURIComponent(memberId)}?fields=*.*`
  );

  const result = (await response.json().catch(() => null)) as DirectusResult<
    Record<string, unknown>
  > | null;

  if (!response.ok) {
    throw new Error(
      getDirectusErrorMessage(result, "Could not fetch member profile.")
    );
  }

  return result?.data || null;
};

export const listApprovedMembers = async () => {
  const fields = [
    "id",
    "full_name",
    "address",
    "profession",
    "country",
    "city",
    "areas_of_interest",
    "profile_picture",
    "status",
    "email",
    "phone",
  ].join(",");

  const response = await directusFetch(
    `/items/members?filter[status][_in]=active,published&fields=${encodeURIComponent(
      fields
    )}&sort=-date_created&limit=200`
  );

  const result = (await response.json().catch(() => null)) as DirectusResult<
    Array<Record<string, unknown>>
  > | null;

  if (!response.ok) {
    throw new Error(
      getDirectusErrorMessage(result, "Could not fetch approved members.")
    );
  }

  return result?.data || [];
};

export const validateSharedCode = async (code: string) => {
  const normalizedCode = code.trim();
  if (!normalizedCode) return false;

  if (SYSTEM_SAMPLE_SHARED_CODES.some((item) => item.code === normalizedCode)) {
    return true;
  }

  const candidateCollections = [
    "member_shared_codes",
    "shared_codes",
    "verification_codes",
  ];

  let checkedAnyCollection = false;

  for (const collection of candidateCollections) {
    const query = `/items/${collection}?filter[code][_eq]=${encodeURIComponent(
      normalizedCode
    )}&limit=1`;

    const response = await directusFetch(query);

    if (response.status === 404) {
      continue;
    }

    checkedAnyCollection = true;

    if (!response.ok) {
      continue;
    }

    const result = (await response.json().catch(() => null)) as DirectusResult<
      Array<Record<string, unknown>>
    > | null;

    if ((result?.data?.length || 0) > 0) {
      return true;
    }
  }

  if (!checkedAnyCollection) {
    return false;
  }

  return false;
};

export type SharedCodeItem = {
  code: string;
  label: string;
};

const SYSTEM_SAMPLE_SHARED_CODES: SharedCodeItem[] = [
  { code: "SLD-UK-483921", label: "SLD-UK-483921 — UK Somaliland Association · UK · Assigned officer: Amina Noor" },
  { code: "SLD-US-274510", label: "SLD-US-274510 — North America Somaliland Community · USA · Assigned officer: Abdirahman Ali" },
  { code: "SLD-SE-908144", label: "SLD-SE-908144 — Sweden Somaliland Association · Sweden · Assigned officer: Hodan Ismail" },
  { code: "SLD-AE-551203", label: "SLD-AE-551203 — UAE Somaliland Community · UAE · Assigned officer: Mubarik Hassan" },
  { code: "SLD-ET-660732", label: "SLD-ET-660732 — Ethiopia Somaliland Community · Ethiopia · Assigned officer: Fadumo Yusuf" },
  { code: "SLD-CA-119845", label: "SLD-CA-119845 — Canada Somaliland Association · Canada · Assigned officer: Ibrahim Jama" },
];

export const listSharedCodes = async (): Promise<SharedCodeItem[]> => {
  const candidateCollections = [
    "member_shared_codes",
    "shared_codes",
    "verification_codes",
  ];

  const dedup = new Map<string, SharedCodeItem>();

  SYSTEM_SAMPLE_SHARED_CODES.forEach((item) => {
    dedup.set(item.code, item);
  });

  for (const collection of candidateCollections) {
    const query = `/items/${collection}?fields=code,name,title,country,description&limit=1000`;
    const response = await directusFetch(query);

    if (response.status === 404) {
      continue;
    }

    if (!response.ok) {
      continue;
    }

    const result = (await response.json().catch(() => null)) as DirectusResult<
      Array<Record<string, unknown>>
    > | null;

    const rows = result?.data || [];

    rows.forEach((row) => {
      const code = String(row.code || "").trim();
      if (!code) return;

      const name = String(row.name || row.title || "").trim();
      const country = String(row.country || "").trim();
      const description = String(row.description || "").trim();

      const parts = [name, country, description].filter(Boolean);
      const label = parts.length > 0 ? `${code} — ${parts.join(" · ")}` : code;

      if (!dedup.has(code)) {
        dedup.set(code, { code, label });
      }
    });
  }

  return Array.from(dedup.values()).sort((a, b) =>
    a.code.localeCompare(b.code)
  );
};

export const sendConnectionEmail = async (options: {
  toEmail: string;
  toName: string;
  fromName: string;
  fromEmail?: string;
  fromPhone?: string;
  fromAddress?: string;
  fromCity?: string;
  fromCountry?: string;
  shareContact: "none" | "email" | "phone";
  sharedEmail?: string;
  sharedPhone?: string;
  message?: string;
}) => {
  const safeValue = (value?: string) => (value && value.trim() ? value : "Not provided");

  const safeName = safeValue(options.fromName);
  const safeEmail = safeValue(options.fromEmail);
  const safeMessage = options.message?.trim()
    ? escapeHtml(options.message.trim())
    : "No additional message provided.";

  const contactLine =
    options.shareContact === "email" && options.sharedEmail
      ? `Shared email: ${escapeHtml(options.sharedEmail)}`
      : options.shareContact === "phone"
      ? "Phone sharing is enabled on the platform."
      : "No contact details shared yet. Reply through the platform.";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; background: #eef7f1; padding: 20px;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #dce9e2; border-radius: 14px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #edf8f0 0%, #ffffff 100%); border-bottom: 1px solid #e5efe8; padding: 14px 18px; display: flex; align-items: center; gap: 10px;">
        <img src="${escapeHtml(resolveAppBaseUrl())}/assets/imgs/logo/logo.png" alt="Somaliland Diaspora" width="34" height="34" style="border-radius: 6px; background: #ffffff; border: 1px solid #d8e7de;" />
        <div style="font-size: 16px; font-weight: 700; color: #006d21;">Somaliland Diaspora Member Portal</div>
      </div>

      <div style="padding: 20px;">
      <h2 style="color: #006d21; margin: 0 0 12px;">Message from Sldiaspora Member</h2>
      <p style="margin: 0 0 12px;">Hello ${escapeHtml(options.toName || "Member")},</p>
      <p style="margin: 0 0 10px;"><strong>${escapeHtml(safeName)}</strong> sent you a connection request on the Sldiaspora Member Portal.</p>
      <p style="margin: 0 0 14px; color: #334155;">${contactLine}</p>

      <table style="width: 100%; border-collapse: collapse; margin: 12px 0;">
        <tr>
          <td style="padding: 6px 0; font-weight: 600;">Email</td>
          <td style="padding: 6px 0;">${escapeHtml(safeEmail)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: 600;">Address</td>
          <td style="padding: 6px 0;">${escapeHtml(safeValue(options.fromAddress))}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: 600;">Location</td>
          <td style="padding: 6px 0;">${escapeHtml(safeValue(options.fromCity))}${
    options.fromCountry ? `, ${escapeHtml(safeValue(options.fromCountry))}` : ""
  }</td>
        </tr>
      </table>

      <div style="margin-top: 10px; border: 1px solid #dbe7e0; border-radius: 10px; background: #f8fcfa; padding: 12px 14px;">
        <div style="font-weight: 600; margin-bottom: 6px; color: #0f172a;">Message</div>
        <div style="white-space: pre-wrap; color: #334155;">${safeMessage}</div>
      </div>

      <p style="margin-top: 14px; color: #4b5563; font-size: 14px;">
        Sender location: ${escapeHtml(options.fromCity || "N/A")}, ${escapeHtml(options.fromCountry || "N/A")}
      </p>
      </div>
      </div>
    </div>
  `;

  return sendHtmlEmail({
    to: options.toEmail,
    subject: `Sldiaspora Connection Request from ${safeName}`,
    html,
  });
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

const resolveAppBaseUrl = () => {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.APP_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL;

  if (fromEnv && fromEnv.trim()) {
    return fromEnv.replace(/\/$/, "");
  }

  return "http://localhost:3000";
};

export const maybeSendActivationWelcomeEmail = async (
  member: Record<string, unknown>
) => {
  const status = String(member.status || "").trim().toLowerCase();
  const isEligibleStatus = status === "active" || status === "published";
  if (!isEligibleStatus) {
    return { sent: false, reason: "not_eligible_status" as const };
  }

  const memberId = String(member.id || "").trim();
  const toEmail = String(member.email || "").trim().toLowerCase();
  const fullName = String(member.full_name || "Member").trim() || "Member";
  const phone = String(member.phone || "Not provided").trim() || "Not provided";

  if (!memberId || !toEmail) {
    return { sent: false, reason: "missing_member_id_or_email" as const };
  }

  const candidateTrackingFields = [
    "activation_email_sent_at",
    "welcome_email_sent_at",
    "status_notification_sent_at",
  ];

  const allowedFields = await getMemberCollectionFields();
  const trackingField =
    candidateTrackingFields.find((field) => allowedFields?.has(field)) || null;

  if (trackingField) {
    const alreadySent = String(member[trackingField] || "").trim().length > 0;
    if (alreadySent) {
      return { sent: false, reason: "already_sent" as const };
    }
  }

  const loginUrl = `${resolveAppBaseUrl()}/member-login`;
  const logoUrl = `${resolveAppBaseUrl()}/assets/imgs/logo/logo.png`;
  const verificationMessage =
    "Your account has been verified and activated. You can now login to the Member Dashboard.";

  const html = `
    <div style="font-family: Arial, sans-serif; background: #f4f7f5; padding: 24px; color: #1f2937;">
      <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #d8e6dc; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);">
        <div style="background: linear-gradient(135deg, #f0faf4 0%, #ffffff 100%); padding: 20px 24px; border-bottom: 1px solid #e5efe8;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${escapeHtml(logoUrl)}" alt="Sldiaspora" width="42" height="42" style="border-radius: 8px; object-fit: contain; background: #ffffff; border: 1px solid #d9e9df;" />
            <div>
              <div style="font-size: 20px; font-weight: 700; color: #006d21; margin-bottom: 2px;">Welcome to Sldiaspora Member Portal</div>
              <div style="font-size: 13px; color: #64748b;">Official Member Activation Notice</div>
            </div>
          </div>
        </div>

        <div style="padding: 22px 24px 24px; line-height: 1.6;">
          <p style="margin: 0 0 10px;">Hello <strong>${escapeHtml(fullName)}</strong>,</p>
          <p style="margin: 0 0 16px;">${escapeHtml(verificationMessage)}</p>

          <table style="width: 100%; border-collapse: collapse; margin: 0 0 14px; font-size: 15px;">
            <tr>
              <td style="padding: 9px 0; font-weight: 600; color: #0f172a; width: 34%; border-bottom: 1px solid #eef3ef;">Full Name</td>
              <td style="padding: 9px 0; color: #334155; border-bottom: 1px solid #eef3ef;">${escapeHtml(fullName)}</td>
            </tr>
            <tr>
              <td style="padding: 9px 0; font-weight: 600; color: #0f172a; border-bottom: 1px solid #eef3ef;">Email</td>
              <td style="padding: 9px 0; color: #334155; border-bottom: 1px solid #eef3ef;">${escapeHtml(toEmail)}</td>
            </tr>
            <tr>
              <td style="padding: 9px 0; font-weight: 600; color: #0f172a; border-bottom: 1px solid #eef3ef;">Phone</td>
              <td style="padding: 9px 0; color: #334155; border-bottom: 1px solid #eef3ef;">${escapeHtml(phone)}</td>
            </tr>
            <tr>
              <td style="padding: 9px 0; font-weight: 600; color: #0f172a;">Password</td>
              <td style="padding: 9px 0; color: #334155;">•••••••• (hidden for security)</td>
            </tr>
          </table>

          <div style="margin: 6px 0 16px; color: #475569; font-size: 14px;">
            Use the password you created during registration to login.
          </div>

          <a href="${escapeHtml(loginUrl)}" style="display: inline-block; background: #006d21; color: #ffffff; text-decoration: none; padding: 11px 18px; border-radius: 8px; font-weight: 600;">Open Member Login</a>

          <p style="margin: 14px 0 0; color: #64748b; font-size: 13px;">
            If the button does not work, open this link:<br />
            <a href="${escapeHtml(loginUrl)}" style="color: #0369a1; text-decoration: none;">${escapeHtml(loginUrl)}</a>
          </p>
        </div>
      </div>
    </div>
  `;

  const emailSent = await sendHtmlEmail({
    to: toEmail,
    subject: "Welcome to SlDiaspora Member Portal",
    html,
  });

  if (!emailSent) {
    return { sent: false, reason: "mail_failed" as const };
  }

  if (trackingField) {
    const markPayload = filterPayloadByFields(
      { [trackingField]: new Date().toISOString() },
      allowedFields
    );
    if (Object.keys(markPayload).length > 0) {
      await updateMemberRecord(memberId, markPayload);
    }
  }

  return { sent: true as const, reason: "sent" as const };
};
