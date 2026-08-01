import { NextResponse } from "next/server";
import {
  createCollectionRecord,
  filterPayloadByFields,
  getDirectusErrorMessage,
  resolveFeedbackCollection,
} from "@/lib/member-directus";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const comment = typeof body?.comment === "string" ? body.comment.trim() : "";

    if (!name || !comment) {
      return NextResponse.json(
        { message: "Name and comment are required." },
        { status: 400 }
      );
    }

    const { collection, fields } = await resolveFeedbackCollection();

    if (!collection) {
      return NextResponse.json(
        {
          message:
            "Feedback collection is not set up in Directus yet. Create a 'feedback' collection with 'name' and 'comment' fields.",
        },
        { status: 500 }
      );
    }

    const basePayload: Record<string, unknown> = {
      name,
      comment,
      submitted_at: new Date().toISOString(),
    };

    const payload = fields ? filterPayloadByFields(basePayload, fields) : basePayload;
    const { response, result } = await createCollectionRecord(collection, payload);

    if (!response.ok) {
      const message = getDirectusErrorMessage(
        result,
        "Directus rejected the feedback submission."
      );
      return NextResponse.json({ message }, { status: response.status || 400 });
    }

    return NextResponse.json(
      { message: "Thank you for your feedback!", data: result?.data },
      { status: 200 }
    );
  } catch (error) {
    console.error("feedback submit unexpected error", error);
    return NextResponse.json(
      { message: "Unexpected server error while submitting feedback." },
      { status: 500 }
    );
  }
}
