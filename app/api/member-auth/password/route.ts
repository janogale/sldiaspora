import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  hashMemberPassword,
  memberSessionCookie,
  verifyMemberPassword,
  verifyMemberSession,
} from "@/lib/member-auth";
import {
  filterPayloadByFields,
  getMemberById,
  getMemberCollectionFields,
  updateMemberRecord,
} from "@/lib/member-directus";

type Body = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export async function PATCH(request: Request) {
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

    const body = (await request.json().catch(() => null)) as Body | null;
    const currentPassword = String(body?.currentPassword || "").trim();
    const newPassword = String(body?.newPassword || "").trim();
    const confirmPassword = String(body?.confirmPassword || "").trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { message: "Current password, new password and confirm password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "New password must be at least 6 characters." },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { message: "New password and confirmation do not match." },
        { status: 400 }
      );
    }

    const member = await getMemberById(session.memberId);
    if (!member) {
      return NextResponse.json({ message: "Member not found." }, { status: 404 });
    }

    const storedHash = typeof member.password_hash === "string" ? member.password_hash : "";

    if (!verifyMemberPassword(currentPassword, storedHash)) {
      return NextResponse.json(
        { message: "Current password is incorrect." },
        { status: 401 }
      );
    }

    const allowedFields = await getMemberCollectionFields();
    const payload = filterPayloadByFields(
      {
        password_hash: hashMemberPassword(newPassword),
        password_changed_at: new Date().toISOString(),
      },
      allowedFields
    );

    if (!payload.password_hash) {
      return NextResponse.json(
        { message: "Members collection is missing password_hash field." },
        { status: 500 }
      );
    }

    const { response, result } = await updateMemberRecord(session.memberId, payload);

    if (!response.ok) {
      return NextResponse.json(
        { message: result?.errors?.[0]?.message || "Failed to update password." },
        { status: response.status || 400 }
      );
    }

    return NextResponse.json({ message: "Password updated successfully." }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Unable to update password right now." },
      { status: 500 }
    );
  }
}
