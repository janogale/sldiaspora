import { getAssetUrl } from "./articles";
import { directusFetch } from "./member-directus";

export type GalleryItem = {
  id: string;
  title: string;
  description: string;
  images: string[];
};

const DEFAULT_GALLERY_COLLECTIONS = ["galleries", "gallery_albums", "gallery"];

function toText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function firstText(record: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = toText(record[key]);
    if (value) return value;
  }
  return "";
}

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

function toImageUrl(value: unknown): string | null {
  if (!value) return null;

  if (typeof value === "string") {
    const raw = value.trim();
    if (!raw) return null;
    if (/^https?:\/\//i.test(raw) || raw.startsWith("/")) return raw;
  }

  const fileId = toFileId(value);
  if (fileId) return getAssetUrl(fileId);

  return null;
}

function parseImageList(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => toImageUrl(item))
      .filter((url): url is string => Boolean(url));
  }

  const asUrl = toImageUrl(value);
  return asUrl ? [asUrl] : [];
}

function normalizeGalleryRow(row: Record<string, unknown>, index: number): GalleryItem {
  const title = firstText(row, ["title", "name", "event_name", "tab_name"]);
  const description = firstText(row, ["description", "content", "details"]);

  const imageFieldCandidates = [
    "images",
    "gallery_images",
    "photos",
    "files",
    "media",
    "pictures",
  ];

  const collected = new Set<string>();
  for (const fieldName of imageFieldCandidates) {
    const entries = parseImageList(row[fieldName]);
    for (const entry of entries) collected.add(entry);
  }

  return {
    id: String(row.id ?? index + 1),
    title: title || `Gallery ${index + 1}`,
    description: description || "",
    images: [...collected],
  };
}

function parseCollectionCandidates(): string[] {
  const raw = (process.env.DIRECTUS_GALLERY_COLLECTIONS || "").trim();
  if (!raw) return DEFAULT_GALLERY_COLLECTIONS;

  const parsed = raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return parsed.length ? parsed : DEFAULT_GALLERY_COLLECTIONS;
}

async function fetchCollection(collection: string): Promise<Record<string, unknown>[] | null> {
  const response = await directusFetch(
    `/items/${encodeURIComponent(collection)}?fields=*.*&sort=sort,-date_created,-id&limit=500`
  );

  if (response.status === 404) return null;
  if (!response.ok) return null;

  const result = (await response.json().catch(() => null)) as
    | { data?: Record<string, unknown>[] }
    | null;

  return Array.isArray(result?.data) ? result.data : [];
}

export async function getGalleries(): Promise<GalleryItem[]> {
  const collections = parseCollectionCandidates();

  for (const collection of collections) {
    try {
      const rows = await fetchCollection(collection);
      if (rows === null) continue;

      const mapped = rows.map(normalizeGalleryRow).filter((item) => item.images.length > 0);
      return mapped;
    } catch {
      continue;
    }
  }

  return [];
}
