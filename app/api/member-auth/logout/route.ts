import { NextResponse } from "next/server";
import { memberSessionCookie } from "@/lib/member-auth";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out." }, { status: 200 });

  response.cookies.set(memberSessionCookie.name, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
