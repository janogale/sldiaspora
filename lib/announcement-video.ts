import { getAssetUrl } from "./articles";
import { directusFetch } from "./member-directus";

const COLLECTION = "announcement_video";

function toFileId(value: unknown): string | null {
  if (!value) return null;

  if (typeof value === "string" || typeof value === "number") {
    const raw = String(value).trim();
    if (!raw) return null;
    if (/^https?:\/\//i.test(raw) || raw.startsWith("/")) return null;
    return raw;
  }

  if (typeof value !== "object") return null;

  const obj = value as Record<string, unknown>;

  const directFile = obj.directus_files_id;
  if (typeof directFile === "string" || typeof directFile === "number") {
    return String(directFile);
  }
  if (directFile && typeof directFile === "object") {
    const nestedId = (directFile as Record<string, unknown>).id;
    if (typeof nestedId === "string" || typeof nestedId === "number") {
      return String(nestedId);
    }
  }

  const id = obj.id;
  if (typeof id === "string" || typeof id === "number") {
    return String(id);
  }

  return null;
}

function extractRow(result: { data?: unknown } | null): Record<string, unknown> | null {
  const data = result?.data;
  if (!data) return null;
  if (Array.isArray(data)) return (data[0] as Record<string, unknown>) || null;
  return data as Record<string, unknown>;
}

export async function getAnnouncementVideoUrl(): Promise<string | null> {
  try {
    const response = await directusFetch(
      `/items/${COLLECTION}?fields=*.*&limit=1&sort=-id`
    );

    if (!response.ok) return null;

    const result = (await response.json().catch(() => null)) as { data?: unknown } | null;
    const row = extractRow(result);
    if (!row) return null;

    const fileId = toFileId(row.video);
    if (!fileId) return null;

    return getAssetUrl(fileId);
  } catch {
    return null;
  }
}
