import { directusFetch } from "./member-directus";

type RawService = Record<string, unknown> & {
  id?: string | number;
  title?: string;
  titl?: string;
  name?: string;
  service_title?: string;
  icons?: unknown;
  icon?: unknown;
  description?: string;
  descripton?: string;
  content?: string;
  details?: string;
};

export type ServiceItem = {
  id: string;
  title: string;
  icon: string;
  description: string;
};

const DEFAULT_COLLECTIONS = ["services", "service"] as const;

function pickFirstString(record: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function toStringValue(value: unknown, depth = 0): string {
  if (depth > 3) return "";

  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);

  if (Array.isArray(value)) {
    for (const item of value) {
      const parsed = toStringValue(item, depth + 1);
      if (parsed) return parsed;
    }
    return "";
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const preferred = [
      "name",
      "value",
      "key",
      "icon",
      "label",
      "title",
      "slug",
      "id",
    ];

    for (const candidate of preferred) {
      const parsed = toStringValue(obj[candidate], depth + 1);
      if (parsed) return parsed;
    }

    for (const nestedValue of Object.values(obj)) {
      const parsed = toStringValue(nestedValue, depth + 1);
      if (parsed) return parsed;
    }
  }

  return "";
}

function pickIcon(raw: RawService): string {
  const direct = [raw.icons, raw.icon];
  for (const value of direct) {
    const parsed = toStringValue(value);
    if (parsed) return parsed;
  }
  return "";
}

function normalizeService(raw: RawService, index: number): ServiceItem {
  const title = pickFirstString(raw, ["title", "titl", "name", "service_title"]);
  const description = pickFirstString(raw, [
    "description",
    "descripton",
    "content",
    "details",
  ]);

  return {
    id: String(raw.id ?? index + 1),
    title: title || "Untitled Service",
    icon: pickIcon(raw),
    description: description || "No description available yet.",
  };
}

function getCollectionCandidates(): string[] {
  const fromEnv = process.env.DIRECTUS_SERVICES_COLLECTION?.trim();
  if (!fromEnv) return [...DEFAULT_COLLECTIONS];
  return Array.from(new Set([fromEnv, ...DEFAULT_COLLECTIONS]));
}

export async function getServices(): Promise<ServiceItem[]> {
  const collections = getCollectionCandidates();

  for (const collection of collections) {
    try {
      const response = await directusFetch(
        `/items/${encodeURIComponent(
          collection
        )}?fields=*&sort=-date_created,-id&limit=100`
      );

      if (response.status === 404) continue;
      if (!response.ok) {
        if (process.env.NODE_ENV !== "production") {
          const errorBody = await response.text().catch(() => "");
          console.error(
            `[services] Directus request failed for collection '${collection}' (${response.status})`,
            errorBody
          );
        }
        continue;
      }

      const result = (await response.json().catch(() => null)) as
        | { data?: RawService[] }
        | null;

      const rows = Array.isArray(result?.data) ? result.data : [];
      if (rows.length === 0) continue;

      return rows.map(normalizeService);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(`[services] Unexpected fetch error for '${collection}'`, error);
      }
      continue;
    }
  }

  return [];
}
