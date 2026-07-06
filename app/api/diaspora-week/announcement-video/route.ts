import { NextResponse } from "next/server";
import { getAnnouncementVideoUrl } from "@/lib/announcement-video";

export async function GET() {
  try {
    const url = await getAnnouncementVideoUrl();
    return NextResponse.json({ data: { url } }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Unable to load announcement video from Directus right now." },
      { status: 500 }
    );
  }
}
