import { NextResponse } from "next/server";
import {
  createCollectionRecord,
  filterPayloadByFields,
  getCollectionFields,
  getDirectusErrorMessage,
  getRegistrationByEmail,
  getRegistrationsCollection,
  uploadDirectusFile,
} from "@/lib/diaspora-week";

const toText = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

const toBoolean = (value: FormDataEntryValue | null) =>
  toText(value) === "true" || toText(value) === "1" || toText(value) === "on";

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    const registrationType = toText(form.get("registrationType")) as "individual" | "business";

    if (registrationType !== "individual" && registrationType !== "business") {
      return NextResponse.json(
        { message: "registrationType must be 'individual' or 'business'." },
        { status: 400 }
      );
    }

    const email = toText(form.get("email")).toLowerCase();
    const phone = toText(form.get("phone"));
    const additionalNotes = toText(form.get("additionalNotes"));
    const exhibitorInterest = toBoolean(form.get("exhibitorInterest"));
    const pitchInterest = toBoolean(form.get("pitchInterest"));

    // The individual form collects country + the event city (eventLocation);
    // the business form collects a single combined "City, Country" address.
    let country = toText(form.get("country"));
    let city = toText(form.get("eventLocation")) || toText(form.get("city"));

    if (registrationType === "business" && (!country || !city)) {
      const businessAddress = toText(form.get("businessAddress"));
      const [addressCity, addressCountry] = businessAddress.split(",").map((part) => part.trim());
      city = city || addressCity || businessAddress;
      country = country || addressCountry || businessAddress;
    }

    if (!email || !phone || !country || !city) {
      return NextResponse.json(
        { message: "Email, phone, country and city are required." },
        { status: 400 }
      );
    }

    let basePayload: Record<string, unknown> = {
      registration_type: registrationType,
      email,
      phone,
      country,
      city,
      exhibitor_interest: exhibitorInterest,
      pitch_interest: pitchInterest,
      additional_notes: additionalNotes || null,
      submitted_at: new Date().toISOString(),
      status: "pending",
    };

    let displayName = "";

    if (registrationType === "individual") {
      const fullName = toText(form.get("fullName"));
      const profession = toText(form.get("profession"));
      const areasOfInterest = toText(form.get("areasOfInterest"));
      const idDocumentType = toText(form.get("idDocumentType"));

      if (!fullName) {
        return NextResponse.json(
          { message: "Full name is required for individual registration." },
          { status: 400 }
        );
      }

      displayName = fullName;

      const idDocInput = form.get("idDocFile");
      const idDocFile = idDocInput instanceof File && idDocInput.size > 0 ? idDocInput : null;

      let idDocFileId: string | null = null;
      if (idDocFile) {
        idDocFileId = await uploadDirectusFile(
          idDocFile,
          `${fullName} ${idDocumentType === "licence" ? "Driving Licence" : "Passport"}`,
          "Uploaded during Diaspora Week individual registration"
        );
      }

      basePayload = {
        ...basePayload,
        full_name: fullName,
        profession: profession || null,
        areas_of_interest: areasOfInterest || null,
        passport: idDocumentType === "passport" ? idDocFileId : null,
        driving_license: idDocumentType === "licence" ? idDocFileId : null,
      };
    } else {
      const businessName = toText(form.get("businessName"));
      const contactPerson = toText(form.get("contactPerson"));
      const industry = toText(form.get("industry"));
      const businessWebsite = toText(form.get("businessWebsite"));

      if (!businessName || !contactPerson) {
        return NextResponse.json(
          { message: "Business name and contact person are required for business registration." },
          { status: 400 }
        );
      }

      displayName = businessName;

      const logoInput = form.get("businessLogo");
      const logoFile = logoInput instanceof File && logoInput.size > 0 ? logoInput : null;

      let businessLogoId: string | null = null;
      if (logoFile) {
        businessLogoId = await uploadDirectusFile(
          logoFile,
          `${businessName} Logo`,
          "Uploaded during Diaspora Week business registration"
        );
      }

      basePayload = {
        ...basePayload,
        business_name: businessName,
        contact_person: contactPerson,
        industry: industry || null,
        business_website: businessWebsite || null,
        business_logo: businessLogoId,
      };
    }

    const existing = await getRegistrationByEmail(email, registrationType).catch(() => null);
    if (existing) {
      return NextResponse.json(
        { message: "This email is already registered for Diaspora Week." },
        { status: 409 }
      );
    }

    const collection = getRegistrationsCollection(registrationType);
    const allowedFields = await getCollectionFields(collection).catch(() => null);

    const payload = filterPayloadByFields(basePayload, allowedFields);
    const { response, result } = await createCollectionRecord(collection, payload);

    if (!response.ok) {
      const message = getDirectusErrorMessage(
        result,
        "Directus rejected the registration payload."
      );
      return NextResponse.json(
        { message: `Registration failed: ${message}`, stage: "create_registration" },
        { status: response.status || 400 }
      );
    }

    return NextResponse.json(
      {
        message:
          "Registration submitted successfully. Your status is pending until admin approval.",
        data: result?.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("diaspora-week register unexpected error", error);
    return NextResponse.json(
      { message: "Unexpected server error while submitting registration." },
      { status: 500 }
    );
  }
}
