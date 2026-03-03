import { NextResponse } from "next/server";
import {
  getMemberByEmail,
  getMemberById,
  maybeSendActivationWelcomeEmail,
} from "@/lib/member-directus";

type NotifyPayload = {
  memberId?: string;
  email?: string;
  status?: string;
  key?: string;
  keys?: Array<string | number>;
  payload?: {
    id?: string | number;
    email?: string;
    status?: string;
  };
  data?: {
    id?: string | number;
    email?: string;
    status?: string;
  };
};

const isAuthorized = (request: Request) => {
  const configuredSecret = process.env.MEMBER_STATUS_WEBHOOK_SECRET || "";
  if (!configuredSecret) return true;

  const providedSecret = request.headers.get("x-member-webhook-secret") || "";
  return providedSecret === configuredSecret;
};

export async function POST(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as NotifyPayload | null;

    const memberId = String(
      body?.memberId ||
        body?.key ||
        body?.keys?.[0] ||
        body?.payload?.id ||
        body?.data?.id ||
        ""
    )
      .trim();

    const email = String(
      body?.email || body?.payload?.email || body?.data?.email || ""
    )
      .trim()
      .toLowerCase();

    const requestedStatus = String(
      body?.status || body?.payload?.status || body?.data?.status || ""
    )
      .trim()
      .toLowerCase();

    let member: Record<string, unknown> | null = null;

    if (memberId) {
      member = await getMemberById(memberId).catch(() => null);
    }

    if (!member && email) {
      member = await getMemberByEmail(email).catch(() => null);
    }

    if (!member) {
      return NextResponse.json(
        { message: "Member not found." },
        { status: 404 }
      );
    }

    if (requestedStatus && !["active", "published"].includes(requestedStatus)) {
      return NextResponse.json(
        {
          message: "No email sent because status is not active/published.",
          status: requestedStatus,
        },
        { status: 200 }
      );
    }

    const result = await maybeSendActivationWelcomeEmail(member);

    return NextResponse.json(
      {
        message: result.sent
          ? "Activation welcome email sent."
          : "Activation email skipped.",
        ...result,
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Unexpected error while sending activation email.";

    return NextResponse.json(
      { message, stage: "member-activation-notify" },
      { status: 500 }
    );
  }
}
