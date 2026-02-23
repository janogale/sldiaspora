import { NextResponse } from "next/server";

const DIRECTUS_URL = process.env.DIRECTUS_URL || "https://admin.sldiaspora.org";
const DIRECTUS_ADMIN_TOKEN = process.env.DIRECTUS_ADMIN_TOKEN;

const toText = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

const getDirectusErrorMessage = (result: unknown, fallback: string) => {
  if (
    result &&
    typeof result === "object" &&
    "errors" in result &&
    Array.isArray((result as { errors?: unknown[] }).errors) &&
    (result as { errors: Array<{ message?: string }> }).errors[0]?.message
  ) {
    return (result as { errors: Array<{ message?: string }> }).errors[0].message || fallback;
  }
  return fallback;
};

const createMemberRecord = async (
  payload: Record<string, unknown>,
  token: string
) => {
  const response = await fetch(`${DIRECTUS_URL}/items/members`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  return response;
};

export async function POST(request: Request) {
  if (!DIRECTUS_ADMIN_TOKEN) {
    return NextResponse.json(
      {
        message:
          "Server is missing DIRECTUS_ADMIN_TOKEN. Add it in your environment first.",
      },
      { status: 500 }
    );
  }

  try {
    const form = await request.formData();

    const fullName = toText(form.get("fullName"));
    const phone = toText(form.get("phone"));
    const address = toText(form.get("address"));
    const profession = toText(form.get("profession"));
    const nationalIdCode = toText(form.get("nationalIdCode"));
    const additionalNotes = toText(form.get("additionalNotes"));

    const nationalIdPhotoInput = form.get("nationalIdPhoto");
    const nationalIdPhoto =
      nationalIdPhotoInput instanceof File && nationalIdPhotoInput.size > 0
        ? nationalIdPhotoInput
        : null;

    if (!fullName || !phone || !address) {
      return NextResponse.json(
        { message: "Full Name, Phone and Address are required." },
        { status: 400 }
      );
    }

    if (!nationalIdPhoto && !nationalIdCode) {
      return NextResponse.json(
        {
          message:
            "Please upload a National ID photo or provide the shared code.",
        },
        { status: 400 }
      );
    }

    let uploadedFileId: string | null = null;

    if (nationalIdPhoto) {
      const uploadForm = new FormData();
      uploadForm.append("file", nationalIdPhoto, nationalIdPhoto.name);
      uploadForm.append("title", `${fullName} National ID`);
      uploadForm.append("description", "Uploaded during member registration");

      const uploadResponse = await fetch(`${DIRECTUS_URL}/files`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${DIRECTUS_ADMIN_TOKEN}`,
        },
        body: uploadForm,
        cache: "no-store",
      });

      const uploadResult = await uploadResponse.json().catch(() => null);

      if (!uploadResponse.ok) {
        const message = getDirectusErrorMessage(
          uploadResult,
          "Could not upload national ID file to Directus."
        );
        return NextResponse.json(
          {
            message: `File upload failed: ${message}`,
            stage: "upload_file",
            directusStatus: uploadResponse.status,
          },
          { status: uploadResponse.status || 400 }
        );
      }

      uploadedFileId = uploadResult?.data?.id ?? null;
    }

    const basePayload: Record<string, unknown> = {
      full_name: fullName,
      phone,
      address,
      profession,
      national_id_code: nationalIdCode || null,
      national_id_photo: uploadedFileId,
      additional_notes: additionalNotes || null,
      submitted_at: new Date().toISOString(),
      status: "pending",
    };

    let createResponse = await createMemberRecord(
      basePayload,
      DIRECTUS_ADMIN_TOKEN
    );

    if (!createResponse.ok) {
      const withoutStatus = { ...basePayload };
      delete withoutStatus.status;
      createResponse = await createMemberRecord(
        withoutStatus,
        DIRECTUS_ADMIN_TOKEN
      );
    }

    const createdResult = await createResponse.json().catch(() => null);

    if (!createResponse.ok) {
      const message = getDirectusErrorMessage(
        createdResult,
        "Directus rejected the member payload. Please verify members collection fields."
      );
      return NextResponse.json(
        {
          message: `Member create failed: ${message}`,
          stage: "create_member",
          directusStatus: createResponse.status,
          payloadKeys: Object.keys(basePayload),
        },
        { status: createResponse.status || 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Member registration submitted and marked pending.",
        data: createdResult?.data,
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
