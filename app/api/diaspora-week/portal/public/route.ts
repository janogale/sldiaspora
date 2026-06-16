import { NextResponse } from "next/server";
import { getDiasporaWeekFullContent } from "@/lib/diaspora-week";

export async function GET() {
  try {
    const content = await getDiasporaWeekFullContent();
    return NextResponse.json({ data: content }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Unable to load portal content." }, { status: 500 });
  }
}
