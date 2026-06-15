import crypto from "node:crypto";

const SESSION_COOKIE_NAME = "dw_portal_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14; // 14 days

const base64UrlEncode = (input: Buffer | string) =>
  Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const base64UrlDecode = (input: string) => {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
};

const getSessionSecret = () => {
  const secret =
    process.env.MEMBER_AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.DIRECTUS_ADMIN_TOKEN;

  if (!secret) {
    throw new Error(
      "Missing MEMBER_AUTH_SECRET (or NEXTAUTH_SECRET) in environment."
    );
  }

  return secret;
};

export type DiasporaWeekSession = {
  registrationId: string;
  email: string;
  registrationType: string;
  exp: number;
};

const signToken = <T extends { exp: number }>(payload: Omit<T, "exp">, ttlSeconds: number) => {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const body = { ...payload, exp } as T;

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedBody = base64UrlEncode(JSON.stringify(body));
  const data = `${encodedHeader}.${encodedBody}`;

  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(data)
    .digest();

  return `${data}.${base64UrlEncode(signature)}`;
};

const verifyToken = <T extends { exp: number }>(token: string): T | null => {
  const [encodedHeader, encodedBody, encodedSignature] = token.split(".");
  if (!encodedHeader || !encodedBody || !encodedSignature) return null;

  const data = `${encodedHeader}.${encodedBody}`;

  const expectedSignature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(data)
    .digest();

  const providedSignature = Buffer.from(
    encodedSignature.replace(/-/g, "+").replace(/_/g, "/"),
    "base64"
  );

  if (
    expectedSignature.length !== providedSignature.length ||
    !crypto.timingSafeEqual(expectedSignature, providedSignature)
  ) {
    return null;
  }

  try {
    const parsedBody = JSON.parse(base64UrlDecode(encodedBody)) as T;
    if (!parsedBody.exp || parsedBody.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return parsedBody;
  } catch {
    return null;
  }
};

export const signDiasporaWeekSession = (payload: Omit<DiasporaWeekSession, "exp">) =>
  signToken<DiasporaWeekSession>(payload, SESSION_TTL_SECONDS);

export const verifyDiasporaWeekSession = (token: string): DiasporaWeekSession | null =>
  verifyToken<DiasporaWeekSession>(token);

export const diasporaWeekSessionCookie = {
  name: SESSION_COOKIE_NAME,
  maxAge: SESSION_TTL_SECONDS,
};
