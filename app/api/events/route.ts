import { NextResponse } from "next/server";
import { getEvents } from "@/lib/events";

export async function GET() {
  try {
    const data = await getEvents();
    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Unable to load events from Directus right now." },
      { status: 500 }
    );
  }
}
