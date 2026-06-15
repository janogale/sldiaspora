import { NextResponse } from "next/server";
import { getRegistrationByEmail } from "@/lib/diaspora-week";
import {
  diasporaWeekSessionCookie,
  signDiasporaWeekSession,
} from "@/lib/diaspora-week-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as { email?: string } | null;

    const email = body?.email?.trim().toLowerCase() || "";

    if (!email) {
      return NextResponse.json(
        { message: "Email address is required." },
        { status: 400 }
      );
    }

    const registration = await getRegistrationByEmail(email);

    if (!registration) {
      return NextResponse.json(
        { message: "We couldn't find a registration with that email." },
        { status: 404 }
      );
    }

    const status = String(registration.status || "").trim().toLowerCase();

    if (status !== "approved") {
      return NextResponse.json(
        {
          message:
            "Your registration is still pending approval. We'll notify you by email once it's approved.",
          status: status || "pending",
        },
        { status: 403 }
      );
    }

    const registrationId = String(registration.id || "");
    const registrationType = (
      registration.registration_type === "business" ? "business" : "individual"
    ) as "individual" | "business";

    const token = signDiasporaWeekSession({
      registrationId,
      email,
      registrationType,
    });

    const response = NextResponse.json(
      {
        message: "Welcome to the Diaspora Week portal.",
        registration: {
          id: registrationId,
          registrationType,
          name:
            registration.full_name ||
            registration.business_name ||
            registration.contact_person ||
            "Participant",
        },
      },
      { status: 200 }
    );

    response.cookies.set(diasporaWeekSessionCookie.name, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: diasporaWeekSessionCookie.maxAge,
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Unable to sign in right now. Please try again." },
      { status: 500 }
    );
  }
}
