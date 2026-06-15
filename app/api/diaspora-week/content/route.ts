import { NextResponse } from "next/server";
import { getDiasporaWeekPublicContent } from "@/lib/diaspora-week";

export async function GET() {
  try {
    const content = await getDiasporaWeekPublicContent();
    return NextResponse.json({ data: content }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Unable to load Diaspora Week content." },
      { status: 500 }
    );
  }
}
