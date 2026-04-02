import { NextResponse } from "next/server";
import {
  createCollectionRecord,
  filterPayloadByFields,
  getDirectusErrorMessage,
  resolveAssociationCollection,
  uploadDirectusFile,
} from "@/lib/member-directus";

type AssociationLeader = {
  fullName?: string;
  role?: string;
  city?: string;
  phone?: string;
};

type AssociationRegisterPayload = {
  associationName?: string;
  acronym?: string;
  registrationDate?: string;
  registrationPlace?: string;
  category?: string;
  district?: string;
  region?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  objectives?: string;
  hasRegistrationProof?: "" | "yes" | "no";
  leaders?: AssociationLeader[];
};

const toText = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const normalizeLeaders = (leaders: unknown): AssociationLeader[] => {
  if (!Array.isArray(leaders)) return [];

  return leaders
    .map((item) => ({
      fullName:
        item && typeof item === "object"
          ? toText((item as Record<string, unknown>).fullName)
          : "",
      role:
        item && typeof item === "object"
          ? toText((item as Record<string, unknown>).role)
          : "",
      city:
        item && typeof item === "object"
          ? toText((item as Record<string, unknown>).city)
          : "",
      phone:
        item && typeof item === "object"
          ? toText((item as Record<string, unknown>).phone)
          : "",
    }))
    .filter(
      (item) => item.fullName || item.role || item.city || item.phone
    );
};

const buildLeadersText = (leaders: AssociationLeader[]) => {
  if (leaders.length === 0) {
    return "No leadership details provided.";
  }

  return leaders
    .map((leader, index) => {
      const fullName = toText(leader.fullName) || "Not provided";
      const role = toText(leader.role) || "Not provided";
      const city = toText(leader.city) || "Not provided";
      const phone = toText(leader.phone) || "Not provided";

      return [
        `${index + 1}. Full Name: ${fullName}`,
        `   Role: ${role}`,
        `   City: ${city}`,
        `   Phone: ${phone}`,
      ].join("\n");
    })
    .join("\n\n");
};

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const isFormSubmission = contentType.includes("multipart/form-data");

    let body: AssociationRegisterPayload | null = null;
    let certificateFile: File | null = null;

    if (isFormSubmission) {
      const form = await request.formData();

      const leadersRaw = form.get("leaders");
      let leadersFromForm: unknown = [];
      if (typeof leadersRaw === "string") {
        try {
          leadersFromForm = JSON.parse(leadersRaw || "[]");
        } catch {
          leadersFromForm = [];
        }
      }

      body = {
        associationName: toText(form.get("associationName")),
        acronym: toText(form.get("acronym")),
        registrationDate: toText(form.get("registrationDate")),
        registrationPlace: toText(form.get("registrationPlace")),
        category: toText(form.get("category")),
        district: toText(form.get("district")),
        region: toText(form.get("region")),
        address: toText(form.get("address")),
        phone: toText(form.get("phone")),
        email: toText(form.get("email")),
        website: toText(form.get("website")),
        objectives: toText(form.get("objectives")),
        hasRegistrationProof:
          toText(form.get("hasRegistrationProof")) === "yes"
            ? "yes"
            : toText(form.get("hasRegistrationProof")) === "no"
            ? "no"
            : "",
        leaders: Array.isArray(leadersFromForm)
          ? (leadersFromForm as AssociationLeader[])
          : [],
      };

      const certificateInput = form.get("registrationCertificate");
      certificateFile =
        certificateInput instanceof File && certificateInput.size > 0
          ? certificateInput
          : null;
    } else {
      body = (await request.json().catch(() => null)) as
        | AssociationRegisterPayload
        | null;
    }

    const associationName = toText(body?.associationName);
    const phone = toText(body?.phone);
    const email = toText(body?.email).toLowerCase();
    const objectives = toText(body?.objectives);
    const leaders = normalizeLeaders(body?.leaders);
    const leadersText = buildLeadersText(leaders);

    let registrationCertificateId: string | null = null;
    if (certificateFile) {
      registrationCertificateId = await uploadDirectusFile(
        certificateFile,
        `${associationName || "Association"} Registration Certificate`,
        "Uploaded during association registration"
      );
    }

    if (!associationName || !phone || !email || !objectives) {
      return NextResponse.json(
        {
          message:
            "Association name, phone, email and objectives are required.",
        },
        { status: 400 }
      );
    }

    const { collection, fields } = await resolveAssociationCollection();

    if (!collection || !fields) {
      return NextResponse.json(
        {
          message:
            "Association collection is not configured in Directus. Set DIRECTUS_ASSOCIATION_COLLECTION in environment or create one of default collections (association_registrations, associations).",
        },
        { status: 500 }
      );
    }

    const basePayload: Record<string, unknown> = {
      association_name: associationName,
      name: associationName,
      acronym: toText(body?.acronym) || null,
      registration_date: toText(body?.registrationDate) || null,
      registration_place: toText(body?.registrationPlace) || null,
      category: toText(body?.category) || null,
      district: toText(body?.district) || null,
      region: toText(body?.region) || null,
      address: toText(body?.address) || null,
      phone,
      email,
      website: toText(body?.website) || null,
      objectives,
      has_registration_proof:
        toText(body?.hasRegistrationProof) === "yes"
          ? true
          : toText(body?.hasRegistrationProof) === "no"
          ? false
          : null,
      certificate: registrationCertificateId,
      registration_certificate: registrationCertificateId,
      registration_certificate_file: registrationCertificateId,
      registration_proof_file: registrationCertificateId,
      certificate_file: registrationCertificateId,
      leaders: leadersText,
      leadership: leaders,
      leadership_json: leaders.length > 0 ? JSON.stringify(leaders) : null,
      submitted_at: new Date().toISOString(),
      status: "pending",
    };

    const payload = filterPayloadByFields(basePayload, fields);

    if (Object.keys(payload).length === 0) {
      return NextResponse.json(
        {
          message:
            `Directus collection '${collection}' has no matching fields for association payload. Please add fields like association_name, email, phone, objectives.`,
        },
        { status: 500 }
      );
    }

    const { response, result } = await createCollectionRecord(collection, payload);

    if (!response.ok) {
      const message = getDirectusErrorMessage(
        result,
        "Directus rejected association payload."
      );
      return NextResponse.json(
        {
          message: `Association register failed: ${message}`,
          stage: "create_association",
          directusStatus: response.status,
          collection,
          payloadKeys: Object.keys(payload),
        },
        { status: response.status || 400 }
      );
    }

    return NextResponse.json(
      {
        message:
          "Association registration submitted successfully. Status is pending until admin approval.",
        data: result?.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("association-register unexpected error", error);
    return NextResponse.json(
      {
        message: "Unexpected server error while submitting association registration.",
        stage: "server",
      },
      { status: 500 }
    );
  }
}
