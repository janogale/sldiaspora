import { NextResponse } from "next/server";
import {
  createCollectionRecord,
  filterPayloadByFields,
  getCollectionFields,
  getDirectusErrorMessage,
  uploadDirectusFile,
} from "@/lib/diaspora-week";

const COLLECTION = "israel_delegation_registrations";

const AREAS = [
  "Business and economic cooperation",
  "Official and institutional engagement",
  "Diaspora leadership and peer exchange",
  "Tourism and cultural heritage exchange",
];

const toText = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    const fullName = toText(form.get("fullName"));
    const organization = toText(form.get("organization"));
    const phone = toText(form.get("phone"));
    const email = toText(form.get("email")).toLowerCase();
    const departingCity = toText(form.get("departingCity"));
    const additionalComment = toText(form.get("additionalComment"));

    const areasOfInterest = form
      .getAll("areasOfInterest")
      .map((v) => (typeof v === "string" ? v.trim() : ""))
      .filter((v) => AREAS.includes(v));

    if (!fullName || !phone || !email || !departingCity) {
      return NextResponse.json(
        { message: "Full name, phone, email and departing city are required." },
        { status: 400 }
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
    }

    if (areasOfInterest.length === 0) {
      return NextResponse.json(
        { message: "Please choose at least one area of interest." },
        { status: 400 }
      );
    }

    const docInput = form.get("idDocument");
    const docFile = docInput instanceof File && docInput.size > 0 ? docInput : null;

    if (!docFile) {
      return NextResponse.json(
        { message: "Please upload your passport or national ID." },
        { status: 400 }
      );
    }

    if (docFile.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { message: "The uploaded file is too large (max 8 MB)." },
        { status: 400 }
      );
    }

    let idDocumentId: string | null = null;
    try {
      idDocumentId = await uploadDirectusFile(
        docFile,
        `${fullName} — Passport / National ID`,
        "Uploaded during Israel delegation visit (Oct 2026) registration"
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "File upload failed.";
      return NextResponse.json(
        { message: `Could not upload your document: ${message}` },
        { status: 502 }
      );
    }

    const basePayload: Record<string, unknown> = {
      full_name: fullName,
      organization: organization || null,
      phone,
      email,
      departing_city: departingCity,
      areas_of_interest: areasOfInterest.join(", "),
      id_document: idDocumentId,
      additional_comment: additionalComment || null,
      status: "pending",
      submitted_at: new Date().toISOString(),
    };

    const allowedFields = await getCollectionFields(COLLECTION).catch(() => null);
    const payload = filterPayloadByFields(basePayload, allowedFields);

    const { response, result } = await createCollectionRecord(COLLECTION, payload);

    if (!response.ok) {
      const message = getDirectusErrorMessage(result, "Directus rejected the registration.");
      return NextResponse.json(
        { message: `Registration failed: ${message}` },
        { status: response.status || 400 }
      );
    }

    return NextResponse.json(
      { message: "Registration submitted successfully.", data: result?.data },
      { status: 200 }
    );
  } catch (error) {
    console.error("israel-visit register error", error);
    return NextResponse.json(
      { message: "Unexpected server error while submitting your registration." },
      { status: 500 }
    );
  }
}
