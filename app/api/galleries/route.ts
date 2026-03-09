import { NextResponse } from "next/server";
import { getGalleries } from "@/lib/galleries";

export async function GET() {
  try {
    const data = await getGalleries();
    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Unable to load galleries from Directus right now." },
      { status: 500 }
    );
  }
}
