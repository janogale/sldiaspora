import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  memberSessionCookie,
  signMemberConnectionRequest,
  verifyMemberConnectionRequest,
  verifyMemberSession,
} from "@/lib/member-auth";
import {
  getMemberById,
  resolveAppBaseUrl,
  sendConnectionApprovedEmail,
  sendConnectionRequestEmail,
} from "@/lib/member-directus";

const buildResultRedirectUrl = (
  status: "accepted" | "declined" | "invalid" | "error",
  member?: string
) => {
  const baseUrl = resolveAppBaseUrl();
  const redirectUrl = new URL("/member-login", baseUrl);
  redirectUrl.searchParams.set("connection_status", status);
  if (member) {
    redirectUrl.searchParams.set("member", member);
  }
  return redirectUrl;
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get("token")?.trim() || "";
  const decision = requestUrl.searchParams.get("decision")?.trim() || "";

  if (!token || (decision !== "accept" && decision !== "decline")) {
    return NextResponse.redirect(buildResultRedirectUrl("invalid"));
  }

  const connectionRequest = verifyMemberConnectionRequest(token);
  if (!connectionRequest) {
    return NextResponse.redirect(buildResultRedirectUrl("invalid"));
  }

  if (decision === "decline") {
    return NextResponse.redirect(
      buildResultRedirectUrl("declined", connectionRequest.requesterName)
    );
  }

  try {
    const [requesterMember, targetMember] = await Promise.all([
      getMemberById(connectionRequest.requesterId).catch(() => null),
      getMemberById(connectionRequest.targetId).catch(() => null),
    ]);

    const requesterEmail =
      typeof requesterMember?.email === "string" && requesterMember.email.trim()
        ? requesterMember.email.trim()
        : connectionRequest.requesterEmail;
    const requesterName =
      typeof requesterMember?.full_name === "string" && requesterMember.full_name.trim()
        ? requesterMember.full_name.trim()
        : connectionRequest.requesterName;
    const targetEmail =
      typeof targetMember?.email === "string" && targetMember.email.trim()
        ? targetMember.email.trim()
        : connectionRequest.targetEmail;
    const targetName =
      typeof targetMember?.full_name === "string" && targetMember.full_name.trim()
        ? targetMember.full_name.trim()
        : connectionRequest.targetName;
    const targetCity =
      typeof targetMember?.city === "string" ? targetMember.city.trim() : "";
    const targetCountry =
      typeof targetMember?.country === "string"
        ? targetMember.country.trim()
        : "";

    if (!requesterEmail || !targetEmail) {
      return NextResponse.redirect(buildResultRedirectUrl("error"));
    }

    const sent = await sendConnectionApprovedEmail({
      toEmail: requesterEmail,
      toName: requesterName,
      acceptedByName: targetName,
      acceptedByEmail: targetEmail,
      acceptedByCity: targetCity,
      acceptedByCountry: targetCountry,
    });

    if (!sent) {
      return NextResponse.redirect(buildResultRedirectUrl("error"));
    }

    return NextResponse.redirect(
      buildResultRedirectUrl("accepted", requesterName)
    );
  } catch {
    return NextResponse.redirect(buildResultRedirectUrl("error"));
  }
}

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
        }
      | null;

    const targetMemberId = body?.targetMemberId?.trim() || "";

    if (!targetMemberId) {
      return NextResponse.json(
        { message: "Target member is required." },
        { status: 400 }
      );
    }

    if (targetMemberId === session.memberId) {
      return NextResponse.json(
        { message: "You cannot send a connection request to yourself." },
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

    const connectionToken = signMemberConnectionRequest({
      requesterId: String(fromMember.id || session.memberId),
      requesterName: String(fromMember.full_name || "Member"),
      requesterEmail: String(fromMember.email || "").trim(),
      requesterCity: String(fromMember.city || ""),
      requesterCountry: String(fromMember.country || ""),
      targetId: String(targetMember.id || targetMemberId),
      targetName: String(targetMember.full_name || "Member"),
      targetEmail,
      message: "A new member would like to connect with you.",
    });

    const linkBaseUrl = (() => {
      try {
        return resolveAppBaseUrl();
      } catch {
        return request.url;
      }
    })();

    const acceptUrl = new URL("/member-login", linkBaseUrl);
    acceptUrl.searchParams.set("token", connectionToken);
    acceptUrl.searchParams.set("decision", "accept");
    acceptUrl.searchParams.set("connect", "1");

    const declineUrl = new URL("/member-login", linkBaseUrl);
    declineUrl.searchParams.set("token", connectionToken);
    declineUrl.searchParams.set("decision", "decline");
    declineUrl.searchParams.set("connect", "1");

    const sent = await sendConnectionRequestEmail({
      toEmail: targetEmail,
      toName: String(targetMember.full_name || "Member"),
      requesterName: String(fromMember.full_name || "Member"),
      requesterCity: String(fromMember.city || ""),
      requesterCountry: String(fromMember.country || ""),
      acceptUrl: acceptUrl.toString(),
      declineUrl: declineUrl.toString(),
      message: "Please review the request and decide if you would like to connect.",
    });

    if (!sent) {
      return NextResponse.json(
        { message: "Failed to send email notification." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        message:
          "Connection request sent. If the member accepts, you will receive their email and continue the conversation by email.",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to send connection request." },
      { status: 500 }
    );
  }
}
