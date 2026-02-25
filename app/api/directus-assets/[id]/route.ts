import { NextRequest } from "next/server";

const DIRECTUS_URL = process.env.DIRECTUS_URL || "https://admin.sldiaspora.org";
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!id) {
    return new Response("Missing asset id", { status: 400 });
  }

  const upstreamUrl = new URL(`${DIRECTUS_URL}/assets/${id}`);
  const requestUrl = new URL(request.url);

  requestUrl.searchParams.forEach((value, key) => {
    upstreamUrl.searchParams.set(key, value);
  });

  const headers: HeadersInit = {};
  if (DIRECTUS_ADMIN_TOKEN) {
    headers.Authorization = `Bearer ${DIRECTUS_ADMIN_TOKEN}`;
  }

  const upstream = await fetch(upstreamUrl.toString(), {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!upstream.ok || !upstream.body) {
    return new Response("Asset not available", { status: upstream.status || 404 });
  }

  const responseHeaders = new Headers();
  const contentType = upstream.headers.get("content-type");
  const contentLength = upstream.headers.get("content-length");
  const cacheControl = upstream.headers.get("cache-control");
  const contentDisposition = upstream.headers.get("content-disposition");

  if (contentType) responseHeaders.set("content-type", contentType);
  if (contentLength) responseHeaders.set("content-length", contentLength);
  if (contentDisposition) {
    responseHeaders.set("content-disposition", contentDisposition);
  }
  responseHeaders.set("cache-control", cacheControl || "public, max-age=300");

  return new Response(upstream.body, {
    status: 200,
    headers: responseHeaders,
  });
}
