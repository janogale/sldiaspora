import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { memberSessionCookie, verifyMemberSession } from "@/lib/member-auth";
import { getMemberById, listApprovedMembers } from "@/lib/member-directus";

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
          areas_of_interest: member.areas_of_interest || "",
          profile_picture: member.profile_picture || null,
          status: member.status || "",
        },
        members: members.map((item) => ({
          id: String(item.id || ""),
          full_name: item.full_name || "",
          profession: item.profession || "",
          city: item.city || "",
          country: item.country || "",
          areas_of_interest: item.areas_of_interest || "",
          profile_picture: item.profile_picture || null,
          contact_email: item.email || "",
          contact_phone: item.phone || "",
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
