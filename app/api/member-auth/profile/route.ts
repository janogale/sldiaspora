import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { memberSessionCookie, verifyMemberSession } from "@/lib/member-auth";
import {
  filterPayloadByFields,
  getMemberById,
  getMemberCollectionFields,
  updateMemberRecord,
  uploadDirectusFile,
} from "@/lib/member-directus";

const normalizeAreasOfInterest = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean)
      .join(", ");
  }

  return typeof value === "string" ? value : "";
};

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(memberSessionCookie.name)?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const session = verifyMemberSession(token);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const form = await request.formData();
    const bio = String(form.get("bio") || "").trim();

    const photoInput = form.get("profilePicture");
    const photoFile = photoInput instanceof File && photoInput.size > 0 ? photoInput : null;

    const currentMember = await getMemberById(session.memberId);
    if (!currentMember) {
      return NextResponse.json({ message: "Member not found." }, { status: 404 });
    }

    let profilePictureId: string | null | undefined = undefined;

    if (photoFile) {
      profilePictureId = await uploadDirectusFile(
        photoFile,
        `${String(currentMember.full_name || "Member")} Profile Picture`,
        "Updated from member dashboard"
      );
    }

    const allowedFields = await getMemberCollectionFields();
    const payloadBase: Record<string, unknown> = {
      additional_notes: bio,
    };

    if (typeof profilePictureId !== "undefined") {
      payloadBase.profile_picture = profilePictureId;
    }

    const payload = filterPayloadByFields(payloadBase, allowedFields);

    if (Object.keys(payload).length === 0) {
      return NextResponse.json(
        { message: "No updatable profile fields found in members collection." },
        { status: 400 }
      );
    }

    const { response, result } = await updateMemberRecord(session.memberId, payload);
    if (!response.ok) {
      return NextResponse.json(
        { message: result?.errors?.[0]?.message || "Failed to update profile." },
        { status: response.status || 400 }
      );
    }

    const updatedMember = await getMemberById(session.memberId);

    return NextResponse.json(
      {
        message: "Profile updated successfully.",
        member: {
          id: String(updatedMember?.id || ""),
          full_name: updatedMember?.full_name || "",
          email: updatedMember?.email || "",
          phone: updatedMember?.phone || "",
          address: updatedMember?.address || "",
          city: updatedMember?.city || "",
          country: updatedMember?.country || "",
          country_of_nationality: updatedMember?.country_of_nationality || "",
          profession: updatedMember?.profession || "",
          areas_of_interest: normalizeAreasOfInterest(updatedMember?.areas_of_interest),
          additional_notes: updatedMember?.additional_notes || "",
          profile_picture: updatedMember?.profile_picture || null,
          status: updatedMember?.status || "",
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Unable to update profile right now." },
      { status: 500 }
    );
  }
}
