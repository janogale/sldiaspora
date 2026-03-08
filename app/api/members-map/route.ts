import { NextResponse } from "next/server";
import { listApprovedMembers } from "@/lib/member-directus";

export async function GET() {
  try {
    const members = await listApprovedMembers();

    return NextResponse.json(
      {
        data: members.map((member) => ({
          id: String(member.id || ""),
          city: String(member.city || ""),
          country: String(member.country || ""),
          map:
            member.map &&
            typeof member.map === "object" &&
            "coordinates" in (member.map as Record<string, unknown>)
              ? member.map
              : null,
        })),
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Unable to load members map data." },
      { status: 500 }
    );
  }
}