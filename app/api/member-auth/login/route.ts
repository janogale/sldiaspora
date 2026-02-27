import { NextResponse } from "next/server";
import {
  getMemberByEmail,
  getDirectusErrorMessage,
} from "@/lib/member-directus";
import {
  memberSessionCookie,
  signMemberSession,
  verifyMemberPassword,
} from "@/lib/member-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { email?: string; password?: string }
      | null;

    const email = body?.email?.trim().toLowerCase() || "";
    const password = body?.password?.trim() || "";

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const member = await getMemberByEmail(email);

    if (!member) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const memberStatus = String(member.status || "").trim().toLowerCase();
    const passwordHash =
      typeof member.password_hash === "string" ? member.password_hash : "";

    const validPassword = verifyMemberPassword(password, passwordHash);

    if (!validPassword) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isPending = memberStatus === "pending" || memberStatus === "";
    if (isPending) {
      return NextResponse.json(
        {
          message:
            "Your account is pending approval. You can login after admin approval.",
          status: memberStatus || "pending",
        },
        { status: 403 }
      );
    }

    const memberId = String(member.id || "");
    const token = signMemberSession({
      memberId,
      email,
      status: memberStatus,
    });

    const response = NextResponse.json(
      {
        message: "Login successful.",
        member: {
          id: memberId,
          full_name: member.full_name || "",
          email,
          city: member.city || "",
          country: member.country || "",
          profession: member.profession || "",
          status: memberStatus,
        },
      },
      { status: 200 }
    );

    response.cookies.set(memberSessionCookie.name, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: memberSessionCookie.maxAge,
    });

    return response;
  } catch (error) {
    const fallback = "Unable to login right now. Please try again.";
    const message =
      error instanceof Error && error.message ? error.message : fallback;
    return NextResponse.json(
      {
        message,
        stage: "member-auth-login",
      },
      { status: 500 }
    );
  }
}
