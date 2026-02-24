import { readItem, readItems } from "@directus/sdk";
import directus from "./directus";

type RawArticle = Record<string, unknown> & {
  id: string | number;
  Title?: string;
  content?: string;
  featured_image?: unknown;
  date_created?: string;
  date_updated?: string;
};

export type Article = {
  id: string;
  title: string;
  content: string;
  featuredImage: string | null;
  images: string[];
  dateCreated: string | null;
  dateUpdated: string | null;
};

const imageFieldCandidates = [
  "images",
  "gallery_images",
  "article_images",
  "gallery",
  "photos",
  "media",
];

function toFileId(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value !== "object") return null;

  const obj = value as Record<string, unknown>;

  const directId = obj.directus_files_id;
  if (typeof directId === "string" || typeof directId === "number") {
    return String(directId);
  }
  if (directId && typeof directId === "object") {
    const nested = (directId as Record<string, unknown>).id;
    if (typeof nested === "string" || typeof nested === "number") {
      return String(nested);
    }
  }

  const id = obj.id;
  if (typeof id === "string" || typeof id === "number") {
    return String(id);
  }

  return null;
}

function extractImageIds(article: RawArticle): string[] {
  const collected = new Set<string>();

  for (const fieldName of imageFieldCandidates) {
    const fieldValue = article[fieldName];
    if (!fieldValue) continue;

    if (Array.isArray(fieldValue)) {
      for (const item of fieldValue) {
        const fileId = toFileId(item);
        if (fileId) collected.add(fileId);
      }
    } else {
      const fileId = toFileId(fieldValue);
      if (fileId) collected.add(fileId);
    }
  }

  return [...collected];
}

function normalizeArticle(article: RawArticle): Article {
  const featuredImage = toFileId(article.featured_image);
  const images = extractImageIds(article).filter((imgId) => imgId !== featuredImage);

  return {
    id: String(article.id),
    title: article.Title || "Untitled Article",
    content: article.content || "",
    featuredImage,
    images,
    dateCreated: article.date_created || null,
    dateUpdated: article.date_updated || null,
  };
}

export function getAssetUrl(fileId: string): string {
  return `/api/directus-assets/${encodeURIComponent(fileId)}`;
}

export async function getArticles(): Promise<Article[]> {
  const records = await directus.request(readItems("articles", { fields: ["*"] }));
  return (records as RawArticle[]).map(normalizeArticle);
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const record = await directus.request(readItem("articles", id, { fields: ["*"] }));
    return normalizeArticle(record as RawArticle);
  } catch {
    return null;
  }
}
