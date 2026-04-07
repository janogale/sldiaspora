import { readItem, readItems } from "@directus/sdk";
import directus from "./directus";

type RawArticle = Record<string, unknown> & {
  id: string | number;
  Title?: string;
  content?: string;
  featured_image?: unknown;
  article_date?: string;
  date_created?: string;
  date_updated?: string;
};

export type Article = {
  id: string;
  title: string;
  content: string;
  category: string;
  featuredImage: string | null;
  pdfFile: string | null;
  articleDate: string | null;
  images: string[];
  dateCreated: string | null;
  dateUpdated: string | null;
};

const categoryFieldCandidates = [
  "category",
  "Category",
  "article_category",
  "type",
  "section",
];

const normalizeCategoryKey = (value: string) => value.trim().toLowerCase();

const matchesRequestedCategory = (
  articleCategory: string,
  requestedCategory: string
) => {
  const normalizedArticleCategory = normalizeCategoryKey(articleCategory);
  const normalizedRequestedCategory = normalizeCategoryKey(requestedCategory);

  if (!normalizedRequestedCategory) return true;

  if (normalizedArticleCategory === normalizedRequestedCategory) return true;

  if (
    normalizedRequestedCategory === "government" &&
    normalizedArticleCategory.includes("government")
  ) {
    return true;
  }

  if (
    normalizedRequestedCategory === "diaspora" &&
    normalizedArticleCategory.includes("diaspora")
  ) {
    return true;
  }

  return false;
};

function readCategory(article: RawArticle): string {
  for (const fieldName of categoryFieldCandidates) {
    const value = article[fieldName];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "Uncategorized";
}

const imageFieldCandidates = [
  "images",
  "gallery_images",
  "article_images",
  "gallery",
  "photos",
  "media",
];

const pdfFieldCandidates = [
  "pdf",
  "pdf_file",
  "pdf_document",
  "document",
  "attachment",
  "file",
];

const articleDateFieldCandidates = [
  "article_date",
  "articleDate",
  "published_date",
  "publish_date",
  "date",
  "news_date",
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

function extractPdfId(article: RawArticle): string | null {
  for (const fieldName of pdfFieldCandidates) {
    const fieldValue = article[fieldName];
    const fileId = toFileId(fieldValue);
    if (fileId) return fileId;
  }

  return null;
}

function extractArticleDate(article: RawArticle): string | null {
  for (const fieldName of articleDateFieldCandidates) {
    const value = article[fieldName];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function normalizeArticle(article: RawArticle): Article {
  const featuredImage = toFileId(article.featured_image);
  const pdfFile = extractPdfId(article);
  const articleDate = extractArticleDate(article);
  const images = extractImageIds(article).filter((imgId) => imgId !== featuredImage);

  return {
    id: String(article.id),
    title: article.Title || "Untitled Article",
    content: article.content || "",
    category: readCategory(article),
    featuredImage,
    pdfFile,
    articleDate,
    images,
    dateCreated: article.date_created || null,
    dateUpdated: article.date_updated || null,
  };
}

export function getAssetUrl(fileId: string): string {
  return `/api/directus-assets/${encodeURIComponent(fileId)}`;
}

export async function getArticles(category?: string): Promise<Article[]> {
  const normalizedCategory = (category || "").trim();
  const records = await directus.request(
    readItems("articles", {
      fields: ["*"],
      filter: {
        status: {
          _eq: "published",
        },
      },
      sort: ["-id"],
    })
  );
  const normalized = (records as RawArticle[]).map(normalizeArticle);
  const filtered = normalized.filter((article) =>
    matchesRequestedCategory(article.category, normalizedCategory)
  );

  const toTimestamp = (value: string | null): number => {
    if (!value) return Number.NEGATIVE_INFINITY;
    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? Number.NEGATIVE_INFINITY : timestamp;
  };

  return filtered.sort((a, b) => {
    const byArticleDate = toTimestamp(b.articleDate) - toTimestamp(a.articleDate);
    if (byArticleDate !== 0) return byArticleDate;
    return Number(b.id) - Number(a.id);
  });
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const record = await directus.request(readItem("articles", id, { fields: ["*"] }));
    return normalizeArticle(record as RawArticle);
  } catch {
    return null;
  }
}
