import { directusFetch } from "./member-directus";
import { getAssetUrl } from "./articles";

type RawEvent = Record<string, unknown> & {
  id: string | number;
  title?: string;
  Title?: string;
  name?: string;
  event_title?: string;
  event_name?: string;
  description?: string;
  content?: string;
  details?: string;
  location?: string;
  venue?: string;
  address?: string;
  datetime?: string;
  start_date?: string;
  end_date?: string;
  event_date?: string;
  date?: string;
  time?: string;
  is_active?: boolean | string | number;
  is_approved?: boolean | string | number;
  active?: boolean | string | number;
  approved?: boolean | string | number;
  mainImg?: unknown;
  main_image?: unknown;
  featured_image?: unknown;
  image?: unknown;
  date_created?: string;
  date_updated?: string;
};

export type EventItem = {
  id: string;
  title: string;
  description: string;
  location: string;
  datetime: string;
  mainImg: string;
  sortDate: string | null;
  dateCreated: string | null;
  dateUpdated: string | null;
};

const FALLBACK_IMAGE = "/assets/imgs/visa/visa-offers/visa-offer-img1.png";
type EventCollectionName = "events" | "event" | "diaspora_events";

const EVENT_COLLECTIONS: EventCollectionName[] = [
  "events",
  "event",
  "diaspora_events",
];

function pickFirstString(obj: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

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

function toOptionalBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "enabled"].includes(normalized)) return true;
    if (["false", "0", "no", "disabled"].includes(normalized)) return false;
  }
  return null;
}

function formatDateTime(rawValue: string): string {
  const parsed = new Date(rawValue);
  if (Number.isNaN(parsed.getTime())) return rawValue;

  return parsed.toLocaleString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function normalizeDateTime(raw: RawEvent): string {
  if (typeof raw.datetime === "string" && raw.datetime.trim()) {
    return formatDateTime(raw.datetime.trim());
  }

  if (typeof raw.start_date === "string" && raw.start_date.trim()) {
    return formatDateTime(raw.start_date.trim());
  }

  const dateValue =
    (typeof raw.event_date === "string" && raw.event_date.trim())
      ? raw.event_date.trim()
      : (typeof raw.date === "string" && raw.date.trim())
        ? raw.date.trim()
        : "";

  const timeValue = typeof raw.time === "string" && raw.time.trim() ? raw.time.trim() : "";

  if (dateValue && timeValue) return `${dateValue} ${timeValue}`;
  if (dateValue) return dateValue;
  if (timeValue) return timeValue;

  return "Date to be announced";
}

function normalizeEvent(raw: RawEvent): EventItem {
  const title = pickFirstString(raw, ["title", "Title", "event_title", "event_name", "name"]);
  const description = pickFirstString(raw, ["description", "content", "details"]);
  const location = pickFirstString(raw, ["location", "venue", "address"]);

  const imageFileId =
    toFileId(raw.main_image) ||
    toFileId(raw.featured_image) ||
    toFileId(raw.image) ||
    toFileId(raw.mainImg);

  const sortDate =
    (typeof raw.start_date === "string" && raw.start_date.trim())
      ? raw.start_date.trim()
      : (typeof raw.datetime === "string" && raw.datetime.trim())
        ? raw.datetime.trim()
        : (typeof raw.event_date === "string" && raw.event_date.trim())
          ? raw.event_date.trim()
          : (typeof raw.date === "string" && raw.date.trim())
            ? raw.date.trim()
            : null;

  return {
    id: String(raw.id),
    title: title || "Untitled Event",
    description: description || "No description available yet.",
    location: location || "Location to be announced",
    datetime: normalizeDateTime(raw),
    mainImg: imageFileId ? getAssetUrl(imageFileId) : FALLBACK_IMAGE,
    sortDate,
    dateCreated: typeof raw.date_created === "string" ? raw.date_created : null,
    dateUpdated: typeof raw.date_updated === "string" ? raw.date_updated : null,
  };
}

function sortEvents(input: EventItem[]): EventItem[] {
  return [...input].sort((a, b) => {
    const aTime = new Date(a.sortDate || a.dateCreated || a.dateUpdated || a.datetime).getTime();
    const bTime = new Date(b.sortDate || b.dateCreated || b.dateUpdated || b.datetime).getTime();

    if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
    if (Number.isNaN(aTime)) return 1;
    if (Number.isNaN(bTime)) return -1;

    return bTime - aTime;
  });
}

function shouldDisplayEvent(raw: RawEvent): boolean {
  const isActive = toOptionalBoolean(raw.is_active ?? raw.active);
  const isApproved = toOptionalBoolean(raw.is_approved ?? raw.approved);

  if (isActive === false) return false;
  if (isApproved === false) return false;

  return true;
}

export async function getEvents(): Promise<EventItem[]> {
  for (const collection of EVENT_COLLECTIONS) {
    try {
      const response = await directusFetch(
        `/items/${collection}?fields=*.*&sort=-date_created,-id&limit=500`
      );

      if (response.status === 404) continue;
      if (!response.ok) continue;

      const result = (await response.json().catch(() => null)) as
        | { data?: RawEvent[] }
        | null;

      const rows = Array.isArray(result?.data) ? result!.data : [];
      const normalized = rows.filter(shouldDisplayEvent).map(normalizeEvent);
      return sortEvents(normalized);
    } catch {
      continue;
    }
  }

  return [];
}

export async function getEventById(id: string): Promise<EventItem | null> {
  for (const collection of EVENT_COLLECTIONS) {
    try {
      const response = await directusFetch(
        `/items/${collection}/${encodeURIComponent(id)}?fields=*.*`
      );

      if (response.status === 404) continue;
      if (!response.ok) continue;

      const result = (await response.json().catch(() => null)) as
        | { data?: RawEvent }
        | null;

      if (!result?.data) continue;
      if (!shouldDisplayEvent(result.data)) continue;

      return normalizeEvent(result.data);
    } catch {
      continue;
    }
  }

  return null;
}
