import { NextResponse } from "next/server";
import {
  createMemberRecord,
  directusFetch,
  filterPayloadByFields,
  getDirectusErrorMessage,
  getMemberCollectionFields,
  getMemberByEmail,
  uploadDirectusFile,
  validateSharedCode,
} from "@/lib/member-directus";
import { hashMemberPassword } from "@/lib/member-auth";

const toText = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

const normalizeChoiceKey = (value: unknown) =>
  typeof value === "string"
    ? value.trim().toLowerCase().replace(/\s+/g, " ")
    : "";

const resolveAreasOfInterestPayload = async (selectedAreas: string[]) => {
  if (selectedAreas.length === 0) return null;

  try {
    const response = await directusFetch("/fields/members");
    const result = (await response.json().catch(() => null)) as
      | { data?: Array<Record<string, unknown>> }
      | null;

    const areaField = result?.data?.find((item) => {
      const fieldName = typeof item?.field === "string" ? item.field : "";
      return fieldName === "areas_of_interest" || fieldName === "area_of_interest";
    });

    const mappedSelectedAreas = (() => {
      const meta =
        areaField && typeof areaField.meta === "object"
          ? (areaField.meta as Record<string, unknown>)
          : null;
      const options =
        meta && typeof meta.options === "object"
          ? (meta.options as Record<string, unknown>)
          : null;
      const choices = Array.isArray(options?.choices)
        ? (options.choices as Array<Record<string, unknown>>)
        : [];

      if (choices.length === 0) {
        return selectedAreas;
      }

      const resolved = selectedAreas.map((selected) => {
        const normalizedSelected = normalizeChoiceKey(selected);
        const match = choices.find((choice) => {
          const valueKey = normalizeChoiceKey(choice.value);
          const textKey = normalizeChoiceKey(choice.text);
          return valueKey === normalizedSelected || textKey === normalizedSelected;
        });

        return typeof match?.value === "string" ? match.value : selected;
      });

      return Array.from(new Set(resolved));
    })();

    const schema =
      areaField && typeof areaField.schema === "object"
        ? (areaField.schema as Record<string, unknown>)
        : null;
    const dataType = typeof schema?.data_type === "string" ? schema.data_type : "";

    if (dataType === "json") {
      return mappedSelectedAreas;
    }

    if (dataType === "csv" || dataType === "string" || dataType === "text") {
      return mappedSelectedAreas.join(",");
    }

    return mappedSelectedAreas;
  } catch {
    // Fallback to array payload when field metadata is unavailable.
  }

  return selectedAreas;
};

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    const fullName = toText(form.get("fullName"));
    const phone = toText(form.get("phone"));
    const email = toText(form.get("email")).toLowerCase();
    const city = toText(form.get("city"));
    const country = toText(form.get("country"));
    const password = toText(form.get("password"));

    const profession = toText(form.get("profession"));
    const skills = toText(form.get("skills"));
    const countryOfNationality = toText(form.get("countryOfNationality"));
    const areaValuesFromForm = form
      .getAll("areasOfInterest")
      .filter((value): value is string => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean);

    const fallbackAreasText = toText(form.get("areasOfInterest"));
    const fallbackAreaValues = fallbackAreasText
      ? fallbackAreasText
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean)
      : [];

    const areasOfInterest = Array.from(
      new Set(
        (areaValuesFromForm.length > 0 ? areaValuesFromForm : fallbackAreaValues)
      )
    );
    const resolvedAreasOfInterest = await resolveAreasOfInterestPayload(areasOfInterest);
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

    const passportFileInput = form.get("passportFile");
    const passportFileUpload =
      passportFileInput instanceof File && passportFileInput.size > 0
        ? passportFileInput
        : null;

    const drivingLicenseFileInput = form.get("drivingLicenseFile");
    const drivingLicenseFileUpload =
      drivingLicenseFileInput instanceof File && drivingLicenseFileInput.size > 0
        ? drivingLicenseFileInput
        : null;

    if (!fullName || !phone || !email || !city || !country) {
      return NextResponse.json(
        {
          message: "Full name, phone, email, city and country are required.",
        },
        { status: 400 }
      );
    }

    if (password && password.length < 6) {
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

    if (nationalIdCode) {
      const isValidSharedCode = await validateSharedCode(
        nationalIdCode,
        country,
        city
      );
      if (!isValidSharedCode) {
        return NextResponse.json(
          {
            message:
              "The code is incorrect. Please contact association contact person.",
          },
          { status: 400 }
        );
      }
    }

    const existingMember = await getMemberByEmail(email).catch(() => null);
    if (existingMember) {
      return NextResponse.json(
        { message: "This email is already registered." },
        { status: 409 }
      );
    }

    const allowedFields = await getMemberCollectionFields();

    if (password && allowedFields && !allowedFields.has("password_hash")) {
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

    if (passportFileUpload) {
      passportFileId = await uploadDirectusFile(
        passportFileUpload,
        `${fullName} Passport`,
        "Uploaded during member registration"
      );
    } else if (secondaryDocument && secondaryDocumentType === "passport") {
      passportFileId = await uploadDirectusFile(
        secondaryDocument,
        `${fullName} Passport`,
        "Uploaded during member registration"
      );
    }

    if (drivingLicenseFileUpload) {
      drivingLicenseFileId = await uploadDirectusFile(
        drivingLicenseFileUpload,
        `${fullName} Driving Licence`,
        "Uploaded during member registration"
      );
    } else if (secondaryDocument && secondaryDocumentType === "driving_license") {
      drivingLicenseFileId = await uploadDirectusFile(
        secondaryDocument,
        `${fullName} Driving Licence`,
        "Uploaded during member registration"
      );
    }

    const resolvedSecondaryDocumentType =
      secondaryDocumentType === "passport" || secondaryDocumentType === "driving_license"
        ? secondaryDocumentType
        : passportFileUpload && drivingLicenseFileUpload
        ? "both"
        : passportFileUpload
        ? "passport"
        : drivingLicenseFileUpload
        ? "driving_license"
        : null;

    const basePayload: Record<string, unknown> = {
      full_name: fullName,
      phone,
      email,
      city,
      country,
      profession,
      skills: skills || null,
      country_of_nationality: countryOfNationality || null,
      areas_of_interest: resolvedAreasOfInterest,
      area_of_interest: resolvedAreasOfInterest,
      profile_picture: profilePictureId,
      national_id_code: nationalIdCode || null,
      national_id_photo: nationalIdFileId,
      passport_file: passportFileId,
      driving_license_file: drivingLicenseFileId,
      secondary_document_type: resolvedSecondaryDocumentType,
      share_contact_preference: shareContactPreference || "none",
      password_hash: password ? hashMemberPassword(password) : null,
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
