import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { memberSessionCookie, verifyMemberSession } from "@/lib/member-auth";
import {
  getMemberById,
  sendConnectionEmail,
} from "@/lib/member-directus";

export async function POST(request: Request) {
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

    const body = (await request.json().catch(() => null)) as
      | {
          targetMemberId?: string;
          shareContact?: "none" | "email" | "phone";
          message?: string;
        }
      | null;

    const targetMemberId = body?.targetMemberId?.trim() || "";
    const shareContact = body?.shareContact || "none";
    const message = body?.message?.trim() || "";

    if (!targetMemberId) {
      return NextResponse.json(
        { message: "Target member is required." },
        { status: 400 }
      );
    }

    const [fromMember, targetMember] = await Promise.all([
      getMemberById(session.memberId),
      getMemberById(targetMemberId),
    ]);

    if (!fromMember || !targetMember) {
      return NextResponse.json(
        { message: "Member not found." },
        { status: 404 }
      );
    }

    const targetEmail =
      typeof targetMember.email === "string" ? targetMember.email.trim() : "";

    if (!targetEmail) {
      return NextResponse.json(
        { message: "Selected member has no email available." },
        { status: 400 }
      );
    }

    await sendConnectionEmail({
      toEmail: targetEmail,
      toName: String(targetMember.full_name || "Member"),
      fromName: String(fromMember.full_name || "Member"),
      fromCity: String(fromMember.city || ""),
      fromCountry: String(fromMember.country || ""),
      shareContact,
      sharedEmail:
        shareContact === "email" ? String(fromMember.email || "") : undefined,
      sharedPhone:
        shareContact === "phone" ? String(fromMember.phone || "") : undefined,
      message,
    });

    return NextResponse.json(
      { message: "Connection request sent successfully." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to send connection request." },
      { status: 500 }
    );
  }
}
