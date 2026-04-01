import { NextResponse } from "next/server";
import { verifyMemberConnectionRequest } from "@/lib/member-auth";
import {
  getMemberById,
  resolveAppBaseUrl,
  sendConnectionApprovedEmail,
} from "@/lib/member-directus";

const buildRedirectUrl = (
  status: "accepted" | "declined" | "invalid" | "error",
  member?: string
) => {
  const redirectBaseUrl = (() => {
    try {
      return resolveAppBaseUrl();
    } catch {
      return "http://localhost:3000";
    }
  })();

  const redirectUrl = new URL("/member-connect/respond", redirectBaseUrl);
  redirectUrl.searchParams.set("status", status);

  if (member) {
    redirectUrl.searchParams.set("member", member);
  }

  return redirectUrl;
};

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token")?.trim() || "";
  const decision = new URL(request.url).searchParams.get("decision")?.trim() || "";

  if (!token || (decision !== "accept" && decision !== "decline")) {
    return NextResponse.redirect(buildRedirectUrl("invalid"));
  }

  const connectionRequest = verifyMemberConnectionRequest(token);

  if (!connectionRequest) {
    return NextResponse.redirect(buildRedirectUrl("invalid"));
  }

  if (decision === "decline") {
    return NextResponse.redirect(
      buildRedirectUrl("declined", connectionRequest.requesterName)
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
      typeof targetMember?.country === "string" ? targetMember.country.trim() : "";

    if (!requesterEmail || !targetEmail) {
      return NextResponse.redirect(buildRedirectUrl("error"));
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
      return NextResponse.redirect(buildRedirectUrl("error"));
    }

    return NextResponse.redirect(buildRedirectUrl("accepted", requesterName));
  } catch {
    return NextResponse.redirect(buildRedirectUrl("error"));
  }
}