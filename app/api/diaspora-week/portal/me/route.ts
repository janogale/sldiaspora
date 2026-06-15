import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDiasporaWeekFullContent, getRegistrationById } from "@/lib/diaspora-week";
import {
  diasporaWeekSessionCookie,
  verifyDiasporaWeekSession,
} from "@/lib/diaspora-week-auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(diasporaWeekSessionCookie.name)?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const session = verifyDiasporaWeekSession(token);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const registration = await getRegistrationById(session.registrationId);

    if (!registration) {
      return NextResponse.json({ message: "Registration not found." }, { status: 404 });
    }

    const status = String(registration.status || "").trim().toLowerCase();
    if (status !== "approved") {
      return NextResponse.json(
        { message: "Your registration is no longer approved." },
        { status: 403 }
      );
    }

    const content = await getDiasporaWeekFullContent();

    return NextResponse.json(
      {
        registration: {
          id: String(registration.id || ""),
          registrationType: registration.registration_type || "individual",
          name:
            registration.full_name ||
            registration.business_name ||
            registration.contact_person ||
            "Participant",
          email: registration.email || "",
          country: registration.country || "",
          city: registration.city || "",
          exhibitorInterest: Boolean(registration.exhibitor_interest),
          pitchInterest: Boolean(registration.pitch_interest),
        },
        content,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ message: "Unable to load portal data." }, { status: 500 });
  }
}
