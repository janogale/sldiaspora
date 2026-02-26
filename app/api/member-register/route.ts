import { NextResponse } from "next/server";
import {
  createMemberRecord,
  filterPayloadByFields,
  getDirectusErrorMessage,
  getMemberCollectionFields,
  getMemberByEmail,
  uploadDirectusFile,
} from "@/lib/member-directus";
import { hashMemberPassword } from "@/lib/member-auth";

const toText = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    const fullName = toText(form.get("fullName"));
    const phone = toText(form.get("phone"));
    const email = toText(form.get("email")).toLowerCase();
    const address = toText(form.get("address"));
    const city = toText(form.get("city"));
    const country = toText(form.get("country"));
    const password = toText(form.get("password"));

    const profession = toText(form.get("profession"));
    const countryOfNationality = toText(form.get("countryOfNationality"));
    const areasOfInterest = toText(form.get("areasOfInterest"));
    const shareContactPreference = toText(form.get("shareContactPreference"));

    const nationalIdCode = toText(form.get("nationalIdCode"));
    const secondaryDocumentType = toText(form.get("secondaryDocumentType"));
    const additionalNotes = toText(form.get("additionalNotes"));

    const profilePictureInput = form.get("profilePicture");
    const profilePictureFile =
      profilePictureInput instanceof File && profilePictureInput.size > 0
        ? profilePictureInput
        : null;

    const nationalIdPhotoInput = form.get("nationalIdPhoto");
    const nationalIdPhoto =
      nationalIdPhotoInput instanceof File && nationalIdPhotoInput.size > 0
        ? nationalIdPhotoInput
        : null;

    const secondaryDocumentInput = form.get("secondaryDocument");
    const secondaryDocument =
      secondaryDocumentInput instanceof File && secondaryDocumentInput.size > 0
        ? secondaryDocumentInput
        : null;

    if (
      !fullName ||
      !phone ||
      !email ||
      !address ||
      !city ||
      !country ||
      !password
    ) {
      return NextResponse.json(
        {
          message:
            "Full name, phone, email, address, city, country and password are required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    if (nationalIdPhoto && nationalIdCode) {
      return NextResponse.json(
        { message: "Choose one National ID method: upload photo OR enter code." },
        { status: 400 }
      );
    }

    if (!nationalIdPhoto && !nationalIdCode) {
      return NextResponse.json(
        { message: "Please upload National ID photo or enter shared code." },
        { status: 400 }
      );
    }

    if (!secondaryDocument) {
      return NextResponse.json(
        { message: "Please upload one secondary document: passport or driving licence." },
        { status: 400 }
      );
    }

    if (
      secondaryDocumentType !== "passport" &&
      secondaryDocumentType !== "driving_license"
    ) {
      return NextResponse.json(
        { message: "Select the secondary document category: passport or driving licence." },
        { status: 400 }
      );
    }

    const existingMember = await getMemberByEmail(email).catch(() => null);
    if (existingMember) {
      return NextResponse.json(
        { message: "This email is already registered." },
        { status: 409 }
      );
    }

    const allowedFields = await getMemberCollectionFields();

    if (allowedFields && !allowedFields.has("password_hash")) {
      return NextResponse.json(
        {
          message:
            "Members collection is missing 'password_hash' field. Add it in Directus to enable member login.",
        },
        { status: 500 }
      );
    }

    let profilePictureId: string | null = null;
    let nationalIdFileId: string | null = null;
    let passportFileId: string | null = null;
    let drivingLicenseFileId: string | null = null;

    if (profilePictureFile) {
      profilePictureId = await uploadDirectusFile(
        profilePictureFile,
        `${fullName} Profile Picture`,
        "Uploaded during member registration"
      );
    }

    if (nationalIdPhoto) {
      nationalIdFileId = await uploadDirectusFile(
        nationalIdPhoto,
        `${fullName} National ID`,
        "Uploaded during member registration"
      );
    }

    if (secondaryDocumentType === "passport") {
      passportFileId = await uploadDirectusFile(
        secondaryDocument,
        `${fullName} Passport`,
        "Uploaded during member registration"
      );
    }

    if (secondaryDocumentType === "driving_license") {
      drivingLicenseFileId = await uploadDirectusFile(
        secondaryDocument,
        `${fullName} Driving Licence`,
        "Uploaded during member registration"
      );
    }

    const basePayload: Record<string, unknown> = {
      full_name: fullName,
      phone,
      email,
      address,
      city,
      country,
      profession,
      country_of_nationality: countryOfNationality || null,
      areas_of_interest: areasOfInterest || null,
      profile_picture: profilePictureId,
      national_id_code: nationalIdCode || null,
      national_id_photo: nationalIdFileId,
      passport_file: passportFileId,
      driving_license_file: drivingLicenseFileId,
      secondary_document_type: secondaryDocumentType,
      share_contact_preference: shareContactPreference || "none",
      password_hash: hashMemberPassword(password),
      additional_notes: additionalNotes || null,
      submitted_at: new Date().toISOString(),
      status: "pending",
    };

    const payload = filterPayloadByFields(basePayload, allowedFields);
    const { response, result } = await createMemberRecord(payload);

    if (!response.ok) {
      const message = getDirectusErrorMessage(
        result,
        "Directus rejected the member payload. Please verify members collection fields."
      );
      return NextResponse.json(
        {
          message: `Member create failed: ${message}`,
          stage: "create_member",
          directusStatus: response.status,
          payloadKeys: Object.keys(payload),
        },
        { status: response.status || 400 }
      );
    }

    return NextResponse.json(
      {
        message:
          "Member registration submitted successfully. Status is pending until admin approval.",
        data: result?.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("member-register unexpected error", error);
    return NextResponse.json(
      {
        message: "Unexpected server error while submitting registration.",
        stage: "server",
      },
      { status: 500 }
    );
  }
}
