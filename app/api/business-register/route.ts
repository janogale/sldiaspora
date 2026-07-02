import { NextResponse } from "next/server";
import { directusFetch } from "@/lib/member-directus";

type DirectusResult<T> = { data?: T };

type BusinessRecord = {
  id: string;
  business_name?: string;
  business_logo?: string | { id?: string } | null;
  status?: string;
  industry?: string;
  [key: string]: unknown;
};

export type ApprovedBusiness = {
  id: string;
  name: string;
  logoUrl: string | null;
  category: string;
};

const resolveLogoUrl = (raw: string | { id?: string } | null | undefined): string | null => {
  if (!raw) return null;
  let uuid: string | null = null;
  if (typeof raw === "string" && raw.trim()) {
    if (raw.startsWith("http")) return raw; // already a full URL
    uuid = raw.trim();
  } else if (typeof raw === "object" && raw.id) {
    uuid = raw.id;
  }
  if (!uuid) return null;
  // Route through the local proxy so the admin token is added server-side
  return `/api/directus-assets/${uuid}`;
};

export async function GET() {
  const collection =
    (process.env.DIRECTUS_BUSINESS_COLLECTION || "").trim() ||
    "diaspora_week_registrations_business";

  const url = `/items/${encodeURIComponent(collection)}?fields=id,business_name,business_logo,status,industry&filter[status][_eq]=approved&limit=500`;

  const res = await directusFetch(url).catch(() => null);

  if (!res || !res.ok) {
    return NextResponse.json({ data: [] }, { headers: { "Cache-Control": "no-store" } });
  }

  const result = (await res.json().catch(() => null)) as DirectusResult<BusinessRecord[]> | null;
  const rows = result?.data ?? [];

  const businesses: ApprovedBusiness[] = rows
    .filter((row) => String(row.status ?? "").toLowerCase().trim() === "approved")
    .map((row) => ({
      id: String(row.id),
      name: String(row.business_name || "").trim(),
      logoUrl: resolveLogoUrl(row.business_logo),
      category: String(row.industry || "Business").trim(),
    }))
    .filter((b) => b.name);

  return NextResponse.json({ data: businesses }, { headers: { "Cache-Control": "no-store" } });
}
