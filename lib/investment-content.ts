import { getAssetUrl } from "./articles";
import { directusFetch } from "./member-directus";

export type IntroContent = {
  title: string;
  paragraph1: string;
  paragraph2: string;
};

export type InvestmentSectorItem = {
  id: string;
  title: string;
  opportunities: string[];
  image: string;
  website: string;
};

export type TourismPlaceItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  map: string;
};

export type InvestmentPageContent = {
  sectorIntro: IntroContent;
  tourismIntro: IntroContent;
  tourismWebsite: string;
  tourismWebsiteLabel: string;
  sectors: InvestmentSectorItem[];
  places: TourismPlaceItem[];
};

const DEFAULT_SECTOR_INTRO: IntroContent = {
  title: "Priority Sectors for Investment",
  paragraph1:
    "Somaliland is a land of unexploited potential and emerging opportunities. Strategically located in the Horn of Africa, with an 850-kilometer coastline along the Gulf of Aden, it is a natural gateway to African and Middle Eastern markets. Blessed with abundant natural resources, a resilient and youthful population, and a deep-rooted cultural heritage, Somaliland offers a stable and investor-friendly environment.",
  paragraph2:
    "The government is prioritizing key growth sectors: agriculture, livestock, fisheries, technology, trade & logistics, mining, and renewable energy, each supported by a government committed to economic transformation and sustainable development. With competitive business policies, improving infrastructure, and a growing appetite for innovation, Somaliland stands ready to welcome forward-thinking investors and partners. We invite you to explore the opportunities that await in Somaliland, where tradition meets ambition and investment drives impact.",
};

const DEFAULT_TOURISM_INTRO: IntroContent = {
  title: "Tourism",
  paragraph1:
    "Somaliland is a unique destination where rich culture, dramatic landscapes, and entrepreneurial opportunity meet. From ancient rock art sites and bustling markets to long stretches of coastline and mountain ranges, the region is ideal for both travelers and investors seeking authentic experiences and high-impact projects.",
  paragraph2:
    "Must-see destinations include Laas Geel's prehistoric paintings, the historic port town of Berbera, and the Cal Madow mountains. Whether you're exploring cultural heritage, eco-tourism, or locating strategic logistics hubs, Somaliland offers a welcoming environment and growing infrastructure to support sustainable travel and long-term investment.",
};

const DEFAULT_TOURISM_WEBSITE = "https://mott.govsomaliland.org/";
const DEFAULT_TOURISM_WEBSITE_LABEL = "MOTT Website";

const DEFAULT_SECTOR_COLLECTIONS = [
  "investments",
  "investment_sectors",
  "investment_sector",
];

const DEFAULT_TOURISM_COLLECTIONS = [
  "tourism_places",
  "tourism",
  "explore_places",
];

const DEFAULT_PAGE_COLLECTIONS = [
  "investment_page_content",
  "investment_page",
  "investment_content",
];

function toStringValue(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function toFileId(value: unknown): string | null {
  if (!value) return null;

  if (typeof value === "string" || typeof value === "number") {
    const raw = String(value);
    if (/^https?:\/\//i.test(raw) || raw.startsWith("/")) return null;
    return raw;
  }

  if (typeof value !== "object") return null;

  const obj = value as Record<string, unknown>;
  const directId = obj.directus_files_id;
  if (typeof directId === "string" || typeof directId === "number") {
    return String(directId);
  }

  if (directId && typeof directId === "object") {
    const nestedId = (directId as Record<string, unknown>).id;
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

function resolveImage(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    const raw = value.trim();
    if (/^https?:\/\//i.test(raw) || raw.startsWith("/")) return raw;
  }

  const fileId = toFileId(value);
  if (fileId) return getAssetUrl(fileId);

  return fallback;
}

function parseOpportunities(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => toStringValue(item))
      .filter(Boolean);
  }

  const raw = toStringValue(value);
  if (!raw) return [];

  return raw
    .split(/\r?\n|\|/) // newline or pipe-separated values
    .map((item) => item.trim())
    .filter(Boolean);
}

function firstString(record: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = toStringValue(record[key]);
    if (value) return value;
  }
  return "";
}

function listFromEnvOrDefault(envValue: string | undefined, fallback: string[]): string[] {
  const raw = (envValue || "").trim();
  if (!raw) return fallback;

  const parsed = raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return parsed.length > 0 ? parsed : fallback;
}

async function fetchCollectionRows(collection: string): Promise<Record<string, unknown>[] | null> {
  const response = await directusFetch(
    `/items/${encodeURIComponent(collection)}?fields=*.*&sort=sort,-date_created,-id&limit=100`
  );

  if (response.status === 404) return null;
  if (!response.ok) return null;

  const result = (await response.json().catch(() => null)) as
    | { data?: Record<string, unknown>[] }
    | null;

  if (!Array.isArray(result?.data)) return [];
  return result.data;
}

async function fetchFirstAvailableRows(collections: string[]): Promise<Record<string, unknown>[]> {
  for (const collection of collections) {
    try {
      const rows = await fetchCollectionRows(collection);
      if (rows === null) continue;
      return rows;
    } catch {
      continue;
    }
  }
  return [];
}

function normalizeSector(row: Record<string, unknown>, index: number): InvestmentSectorItem {
  const title = firstString(row, ["title", "name", "sector_name"]);
  const website = firstString(row, ["website", "url", "link"]);
  const opportunities =
    parseOpportunities(row.opportunities) || parseOpportunities(row.key_opportunities);

  const imageValue = row.image ?? row.main_image ?? row.cover_image ?? row.photo;

  return {
    id: String(row.id ?? index + 1),
    title: title || "Untitled Sector",
    opportunities,
    image: resolveImage(imageValue, "/assets/imgs/invest/arg.jpg"),
    website: website || "#",
  };
}

function normalizePlace(row: Record<string, unknown>, index: number): TourismPlaceItem {
  const name = firstString(row, ["name", "title", "place_name"]);
  const description = firstString(row, ["description", "content", "details"]);
  const map = firstString(row, ["map", "google_map", "map_link", "location_url"]);

  const imageValue = row.image ?? row.main_image ?? row.cover_image ?? row.photo;

  return {
    id: String(row.id ?? index + 1),
    name: name || "Untitled Place",
    description: description || "Description coming soon.",
    image: resolveImage(imageValue, "/assets/imgs/invest/laas.jpg"),
    map: map || "https://www.google.com/maps/search/?api=1&query=Somaliland",
  };
}

function normalizeIntroFromRow(
  row: Record<string, unknown> | undefined,
  prefix: "sector" | "tourism",
  fallback: IntroContent
): IntroContent {
  if (!row) return fallback;

  const title =
    firstString(row, [`${prefix}_title`, `${prefix}Title`, `${prefix}_heading`]) ||
    fallback.title;

  const paragraph1 =
    firstString(row, [
      `${prefix}_paragraph1`,
      `${prefix}_intro_1`,
      `${prefix}_intro_text_1`,
    ]) || fallback.paragraph1;

  const paragraph2 =
    firstString(row, [
      `${prefix}_paragraph2`,
      `${prefix}_intro_2`,
      `${prefix}_intro_text_2`,
    ]) || fallback.paragraph2;

  return {
    title,
    paragraph1,
    paragraph2,
  };
}

export async function getInvestmentPageContent(): Promise<InvestmentPageContent> {
  const sectorCollections = listFromEnvOrDefault(
    process.env.DIRECTUS_INVESTMENT_SECTORS_COLLECTIONS,
    DEFAULT_SECTOR_COLLECTIONS
  );

  const tourismCollections = listFromEnvOrDefault(
    process.env.DIRECTUS_TOURISM_COLLECTIONS,
    DEFAULT_TOURISM_COLLECTIONS
  );

  const pageCollections = listFromEnvOrDefault(
    process.env.DIRECTUS_INVESTMENT_PAGE_COLLECTIONS,
    DEFAULT_PAGE_COLLECTIONS
  );

  const [sectorRows, tourismRows, pageRows] = await Promise.all([
    fetchFirstAvailableRows(sectorCollections),
    fetchFirstAvailableRows(tourismCollections),
    fetchFirstAvailableRows(pageCollections),
  ]);

  const sectors = sectorRows.map(normalizeSector).filter((item) => item.title);
  const places = tourismRows.map(normalizePlace).filter((item) => item.name);

  const pageRow = pageRows[0];
  const sectorIntro = normalizeIntroFromRow(pageRow, "sector", DEFAULT_SECTOR_INTRO);
  const tourismIntro = normalizeIntroFromRow(pageRow, "tourism", DEFAULT_TOURISM_INTRO);
  const tourismWebsite =
    firstString(pageRow || {}, ["tourism_website", "tourism_ministry_website", "mott_website"]) ||
    DEFAULT_TOURISM_WEBSITE;
  const tourismWebsiteLabel =
    firstString(pageRow || {}, [
      "tourism_website_label",
      "tourism_ministry_label",
      "mott_website_label",
    ]) || DEFAULT_TOURISM_WEBSITE_LABEL;

  return {
    sectorIntro,
    tourismIntro,
    tourismWebsite,
    tourismWebsiteLabel,
    sectors,
    places,
  };
}
