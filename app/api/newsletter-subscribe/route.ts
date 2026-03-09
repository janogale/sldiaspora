import { NextResponse } from "next/server";
import { subscribeNewsletter } from "@/lib/newsletter";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as
      | { email?: string }
      | null;

    const email = String(body?.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { message: "Please enter your email address." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const result = await subscribeNewsletter(email);

    if (result.alreadySubscribed) {
      return NextResponse.json(
        { message: "This email is already subscribed." },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Subscribed successfully. You will receive updates soon." },
      { status: 201 }
    );
  } catch (error) {
    const details =
      error instanceof Error && error.message
        ? error.message
        : "Unable to subscribe right now. Please try again shortly.";

    return NextResponse.json(
      {
        message:
          process.env.NODE_ENV !== "production"
            ? details
            : "Unable to subscribe right now. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}
