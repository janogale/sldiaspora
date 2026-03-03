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

      const fromAddress = canUseSmtp ? smtpFrom : gmailUser;

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
  if (!code.trim()) return true;

  const candidateCollections = [
    "member_shared_codes",
    "shared_codes",
    "verification_codes",
  ];

  let checkedAnyCollection = false;

  for (const collection of candidateCollections) {
    const query = `/items/${collection}?filter[code][_eq]=${encodeURIComponent(
      code
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
    return true;
  }

  return false;
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
  const contactLine =
    options.shareContact === "email" && options.sharedEmail
      ? `Shared email: ${options.sharedEmail}`
      : options.shareContact === "phone" && options.sharedPhone
      ? `Shared phone: ${options.sharedPhone}`
      : "No contact details shared yet. Reply through the platform.";

  const safeValue = (value?: string) => (value && value.trim() ? value : "Not provided");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
      <h2 style="color: #006d21; margin-bottom: 12px;">New Connection Request</h2>
      <p>Hello ${options.toName || "Member"},</p>
      <p><strong>${options.fromName}</strong> wants to connect with you on the Somaliland Diaspora platform.</p>
      <p>${contactLine}</p>
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0;">
        <tr>
          <td style="padding: 6px 0; font-weight: 600;">Email</td>
          <td style="padding: 6px 0;">${safeValue(options.fromEmail)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: 600;">Phone</td>
          <td style="padding: 6px 0;">${safeValue(options.fromPhone)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: 600;">Address</td>
          <td style="padding: 6px 0;">${safeValue(options.fromAddress)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: 600;">Location</td>
          <td style="padding: 6px 0;">${safeValue(options.fromCity)}${
    options.fromCountry ? `, ${safeValue(options.fromCountry)}` : ""
  }</td>
        </tr>
      </table>
      ${
        options.message
          ? `<p><strong>Message:</strong><br/>${options.message.replace(/</g, "&lt;")}</p>`
          : ""
      }
      <p style="margin-top: 14px; color: #4b5563; font-size: 14px;">
        Sender location: ${options.fromCity || "N/A"}, ${options.fromCountry || "N/A"}
      </p>
    </div>
  `;

  return sendHtmlEmail({
    to: options.toEmail,
    subject: "Somaliland Diaspora: New connection request",
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
  const verificationMessage =
    "Your account has been verified and activated. You can now login to the Member Dashboard.";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
      <h2 style="color: #006d21; margin-bottom: 12px;">Welcome to Diaspora Member Portal</h2>
      <p>Hello ${escapeHtml(fullName)},</p>
      <p>${escapeHtml(verificationMessage)}</p>
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0;">
        <tr>
          <td style="padding: 6px 0; font-weight: 600;">Full Name</td>
          <td style="padding: 6px 0;">${escapeHtml(fullName)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: 600;">Email</td>
          <td style="padding: 6px 0;">${escapeHtml(toEmail)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; font-weight: 600;">Phone</td>
          <td style="padding: 6px 0;">${escapeHtml(phone)}</td>
        </tr>
      </table>
      <p style="margin: 10px 0 16px;">
        For security, we never email your password. Use the password you created during registration.
      </p>
      <a href="${escapeHtml(loginUrl)}" style="display: inline-block; background: #006d21; color: #ffffff; text-decoration: none; padding: 10px 16px; border-radius: 8px; font-weight: 600;">Open Member Login</a>
      <p style="margin-top: 14px; color: #4b5563; font-size: 14px;">
        If the button does not work, open this link: ${escapeHtml(loginUrl)}
      </p>
    </div>
  `;

  const emailSent = await sendHtmlEmail({
    to: toEmail,
    subject: "Welcome to Diaspora Member Portal",
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
