import { NextResponse } from "next/server";
import { getInvestmentPageContent } from "@/lib/investment-content";

export async function GET() {
  try {
    const data = await getInvestmentPageContent();
    return NextResponse.json({ data }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Unable to load investment and tourism content right now." },
      { status: 500 }
    );
  }
}
