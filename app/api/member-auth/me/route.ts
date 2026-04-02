import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { memberSessionCookie, verifyMemberSession } from "@/lib/member-auth";
import { getMemberById, listApprovedMembers } from "@/lib/member-directus";

const toFirstName = (value: unknown) => {
  const fullName = typeof value === "string" ? value.trim() : "";
  if (!fullName) return "Member";

  const [firstName] = fullName.split(/\s+/).filter(Boolean);
  return firstName || "Member";
};

const normalizeAreasOfInterest = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean)
      .join(", ");
  }

  return typeof value === "string" ? value : "";
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(memberSessionCookie.name)?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const session = verifyMemberSession(token);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const member = await getMemberById(session.memberId);

    if (!member) {
      return NextResponse.json({ message: "Member not found." }, { status: 404 });
    }

    const memberStatus = String(member.status || "").trim().toLowerCase();
    const canSeeDirectory = memberStatus === "active" || memberStatus === "published";
    const members = canSeeDirectory ? await listApprovedMembers() : [];

    return NextResponse.json(
      {
        member: {
          id: String(member.id || ""),
          full_name: member.full_name || "",
          email: member.email || "",
          phone: member.phone || "",
          address: member.address || "",
          city: member.city || "",
          country: member.country || "",
          country_of_nationality: member.country_of_nationality || "",
          profession: member.profession || "",
          areas_of_interest: normalizeAreasOfInterest(member.areas_of_interest),
          additional_notes: member.additional_notes || "",
          profile_picture: member.profile_picture || null,
          status: member.status || "",
        },
        members: members.map((item) => ({
          id: String(item.id || ""),
          full_name: toFirstName(item.full_name),
          city: item.city || "",
          country: item.country || "",
          profile_picture: item.profile_picture || null,
        })),
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Unable to load member profile." },
      { status: 500 }
    );
  }
}
