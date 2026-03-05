import { NextResponse } from "next/server";
import { listSharedCodes } from "@/lib/member-directus";

export async function GET() {
  try {
    const codes = await listSharedCodes();

    return NextResponse.json(
      {
        data: codes,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Unable to load shared code list." },
      { status: 500 }
    );
  }
}
