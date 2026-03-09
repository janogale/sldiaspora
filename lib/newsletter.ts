import {
  directusFetch,
  getDirectusErrorMessage,
} from "./member-directus";

type DirectusResult<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};

const DEFAULT_NEWSLETTER_COLLECTIONS = [
  "newsletter_subscribers",
  "subscribers",
  "newsletter",
];

const EMAIL_FIELD_CANDIDATES = [
  "email",
  "subscriber_email",
  "email_address",
  "mail",
];

function getCollectionsFromEnv(): string[] {
  const raw = (process.env.DIRECTUS_NEWSLETTER_COLLECTIONS || "").trim();
  if (!raw) return DEFAULT_NEWSLETTER_COLLECTIONS;

  const parsed = raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return parsed.length > 0 ? parsed : DEFAULT_NEWSLETTER_COLLECTIONS;
}

async function discoverCollectionsByNameHint(): Promise<string[]> {
  const response = await directusFetch("/collections");
  if (!response.ok) return [];

  const result = (await response.json().catch(() => null)) as DirectusResult<
    Array<{ collection?: string }>
  > | null;

  return (result?.data || [])
    .map((item) => String(item.collection || "").trim())
    .filter((name) => /newsletter|subscriber|subscription/i.test(name));
}

async function getCollections(): Promise<string[]> {
  const fromEnv = getCollectionsFromEnv();
  const discovered = await discoverCollectionsByNameHint().catch(() => []);

  return Array.from(new Set([...fromEnv, ...discovered, ...DEFAULT_NEWSLETTER_COLLECTIONS]));
}

async function getCollectionFields(collection: string): Promise<Set<string> | null> {
  const response = await directusFetch(`/fields/${encodeURIComponent(collection)}`);

  if (response.status === 404) return null;
  if (!response.ok) return null;

  const result = (await response.json().catch(() => null)) as DirectusResult<
    Array<{ field?: string }>
  > | null;

  const fields = new Set(
    (result?.data || [])
      .map((item) => String(item.field || "").trim())
      .filter(Boolean)
  );

  return fields;
}

function findEmailField(fields: Set<string> | null): string | null {
  if (!fields || fields.size === 0) return "email";

  for (const candidate of EMAIL_FIELD_CANDIDATES) {
    if (fields.has(candidate)) return candidate;
  }

  return null;
}

async function findExistingByEmail(collection: string, emailField: string, email: string) {
  const response = await directusFetch(
    `/items/${encodeURIComponent(
      collection
    )}?filter[${encodeURIComponent(emailField)}][_eq]=${encodeURIComponent(
      email
    )}&limit=1&fields=id,${encodeURIComponent(emailField)},status`
  );

  if (response.status === 404) return null;
  if (!response.ok) return null;

  const result = (await response.json().catch(() => null)) as DirectusResult<
    Array<Record<string, unknown>>
  > | null;

  return (result?.data || [])[0] || null;
}

function buildPayload(fields: Set<string> | null, emailField: string, email: string) {
  const candidate: Record<string, unknown> = {
    [emailField]: email,
    source: "website_footer",
    subscribed_at: new Date().toISOString(),
  };

  if (!fields || fields.size === 0) return candidate;

  return Object.fromEntries(
    Object.entries(candidate).filter(([key]) => fields.has(key))
  );
}

export async function subscribeNewsletter(emailInput: string): Promise<{
  created: boolean;
  alreadySubscribed: boolean;
  collection: string;
}> {
  const email = emailInput.trim().toLowerCase();
  const collections = await getCollections();

  let sawExistingCollection = false;
  let sawEmailField = false;
  let lastErrorMessage = "";

  for (const collection of collections) {
    const fields = await getCollectionFields(collection);
    if (fields === null) continue;

    sawExistingCollection = true;

    const emailField = findEmailField(fields);
    if (!emailField) {
      const fieldNames = fields ? Array.from(fields).join(", ") : "";
      lastErrorMessage = `No email field found in collection '${collection}'. Fields: ${fieldNames}`;

      // Fallback: try common email field names directly in case field metadata is hidden.
      for (const candidateEmailField of EMAIL_FIELD_CANDIDATES) {
        const fallbackPayload: Record<string, unknown> = {
          [candidateEmailField]: email,
          source: "website_footer",
          subscribed_at: new Date().toISOString(),
        };

        const fallbackResponse = await directusFetch(
          `/items/${encodeURIComponent(collection)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(fallbackPayload),
          }
        );

        const fallbackRaw = await fallbackResponse.text().catch(() => "");
        const fallbackResult = (JSON.parse(fallbackRaw || "null") as
          | DirectusResult<Record<string, unknown>>
          | null) || null;

        if (fallbackResponse.ok) {
          return { created: true, alreadySubscribed: false, collection };
        }

        lastErrorMessage = getDirectusErrorMessage(
          fallbackResult,
          fallbackRaw ||
            `Could not subscribe in collection '${collection}' with field '${candidateEmailField}'.`
        );
      }

      continue;
    }
    sawEmailField = true;

    const existing = await findExistingByEmail(collection, emailField, email);
    if (existing) {
      return { created: false, alreadySubscribed: true, collection };
    }

    const payload = buildPayload(fields, emailField, email);

    const response = await directusFetch(`/items/${encodeURIComponent(collection)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const rawText = await response.text().catch(() => "");
    const result = (JSON.parse(rawText || "null") as
      | DirectusResult<Record<string, unknown>>
      | null) || null;

    if (response.ok) {
      return { created: true, alreadySubscribed: false, collection };
    }

    const errorMessage = getDirectusErrorMessage(
      result,
      rawText || `Could not subscribe in collection '${collection}'.`
    );
    lastErrorMessage = errorMessage;

    if (process.env.NODE_ENV !== "production") {
      console.error("[newsletter] subscribe failed", { collection, errorMessage });
    }
  }

  if (!sawExistingCollection) {
    throw new Error(
      "No newsletter collection found. Create one and set DIRECTUS_NEWSLETTER_COLLECTIONS if needed."
    );
  }

  if (!sawEmailField) {
    throw new Error(
      lastErrorMessage ||
        "Newsletter collection found, but no supported email field detected. Use one of: email, subscriber_email, email_address, mail."
    );
  }

  throw new Error(lastErrorMessage || "Newsletter subscription failed.");
}
