"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type IdVerificationMethod = "national_id" | "code" | "";

type RegisterFormState = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  country: string;
  nationalIdCode: string;
  password: string;
  confirmPassword: string;
  additionalNotes: string;
};

type ModalView = "choice" | "register" | "association";

type AssociationLeader = {
  fullName: string;
  role: string;
  city: string;
  phone: string;
};

type AssociationFormState = {
  associationName: string;
  acronym: string;
  registrationDate: string;
  registrationPlace: string;
  category: string;
  otherCategory: string;
  district: string;
  region: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  objectives: string;
  hasRegistrationProof: "" | "yes" | "no";
  leaders: AssociationLeader[];
};

const defaultFormState: RegisterFormState = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  country: "",
  nationalIdCode: "",
  password: "",
  confirmPassword: "",
  additionalNotes: "",
};

const defaultAssociationFormState: AssociationFormState = {
  associationName: "",
  acronym: "",
  registrationDate: "",
  registrationPlace: "",
  category: "",
  otherCategory: "",
  district: "",
  region: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  objectives: "",
  hasRegistrationProof: "",
  leaders: [
    { fullName: "", role: "", city: "", phone: "" },
  ],
};

const DIRECTUS_REGISTER_LINK = "https://admin.sldiaspora.org/admin/register";
const MAX_ASSOCIATION_LEADERS = 10;

const ASSOCIATION_CATEGORY_OPTIONS = [
  "Culture",
  "Religious",
  "Health & Medical",
  "Chamber of Commerce",
  "Business",
  "Youth",
  "Women",
  "Advocacy",
  "Professionals",
  "Research & Academic",
  "Other type",
] as const;

function MemberRegistrationModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [modalView, setModalView] = useState<ModalView>("choice");
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successKind, setSuccessKind] = useState<"member" | "association">("member");
  const [showCodeHelp, setShowCodeHelp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formState, setFormState] = useState<RegisterFormState>(defaultFormState);
  const [associationForm, setAssociationForm] = useState<AssociationFormState>(defaultAssociationFormState);
  const [idMethod, setIdMethod] = useState<IdVerificationMethod>("");

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [nationalIdPhoto, setNationalIdPhoto] = useState<File | null>(null);
  const [passportDocument, setPassportDocument] = useState<File | null>(null);
  const [drivingLicenseDocument, setDrivingLicenseDocument] = useState<File | null>(null);
  const [associationCertificateFile, setAssociationCertificateFile] = useState<File | null>(null);

  const passwordsMatch =
    (!formState.password && !formState.confirmPassword) ||
    (formState.password.length >= 6 && formState.password === formState.confirmPassword);

  const hasRequiredBasics =
    formState.fullName.trim().length > 1 &&
    formState.phone.trim().length > 5 &&
    formState.email.trim().length > 3 &&
    formState.city.trim().length > 1 &&
    formState.country.trim().length > 1;

  const isCodeEntered = formState.nationalIdCode.trim().length > 0;

  const hasValidIdMethod = useMemo(() => {
    if (idMethod === "") return true;
    if (idMethod === "national_id") return !!nationalIdPhoto;
    if (idMethod === "code") return isCodeEntered;
    return false;
  }, [idMethod, isCodeEntered, nationalIdPhoto]);

  const canSubmit = useMemo(() => {
    return hasRequiredBasics && hasValidIdMethod && passwordsMatch;
  }, [hasRequiredBasics, hasValidIdMethod, passwordsMatch]);

  const canSubmitAssociation = useMemo(() => {
    return (
      associationForm.associationName.trim().length > 1 &&
      associationForm.phone.trim().length > 3 &&
      associationForm.email.trim().includes("@") &&
      associationForm.objectives.trim().length > 3
    );
  }, [associationForm]);

  const associationMissingFields = useMemo(() => {
    const missing: string[] = [];
    if (associationForm.associationName.trim().length <= 1) {
      missing.push("Association Name");
    }
    if (associationForm.phone.trim().length <= 3) {
      missing.push("Phone");
    }
    if (!associationForm.email.trim().includes("@")) {
      missing.push("Email");
    }
    if (associationForm.objectives.trim().length <= 3) {
      missing.push("Objectives");
    }
    return missing;
  }, [associationForm]);

  const countryOptions = useMemo(
    () => [
      "Afghanistan",
      "Albania",
      "Algeria",
      "Andorra",
      "Angola",
      "Antigua and Barbuda",
      "Argentina",
      "Armenia",
      "Australia",
      "Austria",
      "Azerbaijan",
      "Bahamas",
      "Bahrain",
      "Bangladesh",
      "Barbados",
      "Belarus",
      "Belgium",
      "Belize",
      "Benin",
      "Bhutan",
      "Bolivia",
      "Bosnia and Herzegovina",
      "Botswana",
      "Brazil",
      "Brunei",
      "Bulgaria",
      "Burkina Faso",
      "Burundi",
      "Cabo Verde",
      "Cambodia",
      "Cameroon",
      "Canada",
      "Central African Republic",
      "Chad",
      "Chile",
      "China",
      "Colombia",
      "Comoros",
      "Congo (Brazzaville)",
      "Congo (Kinshasa)",
      "Costa Rica",
      "Cote d'Ivoire",
      "Croatia",
      "Cuba",
      "Cyprus",
      "Czech Republic",
      "Denmark",
      "Djibouti",
      "Dominica",
      "Dominican Republic",
      "Ecuador",
      "Egypt",
      "El Salvador",
      "Equatorial Guinea",
      "Eritrea",
      "Estonia",
      "Eswatini",
      "Ethiopia",
      "Fiji",
      "Finland",
      "France",
      "Gabon",
      "Gambia",
      "Georgia",
      "Germany",
      "Ghana",
      "Greece",
      "Grenada",
      "Guatemala",
      "Guinea",
      "Guinea-Bissau",
      "Guyana",
      "Haiti",
      "Honduras",
      "Hungary",
      "Iceland",
      "India",
      "Indonesia",
      "Iran",
      "Iraq",
      "Ireland",
      "Israel",
      "Italy",
      "Jamaica",
      "Japan",
      "Jordan",
      "Kazakhstan",
      "Kenya",
      "Kiribati",
      "Kuwait",
      "Kyrgyzstan",
      "Laos",
      "Latvia",
      "Lebanon",
      "Lesotho",
      "Liberia",
      "Libya",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Madagascar",
      "Malawi",
      "Malaysia",
      "Maldives",
      "Mali",
      "Malta",
      "Marshall Islands",
      "Mauritania",
      "Mauritius",
      "Mexico",
      "Micronesia",
      "Moldova",
      "Monaco",
      "Mongolia",
      "Montenegro",
      "Morocco",
      "Mozambique",
      "Myanmar",
      "Namibia",
      "Nauru",
      "Nepal",
      "Netherlands",
      "New Zealand",
      "Nicaragua",
      "Niger",
      "Nigeria",
      "North Korea",
      "North Macedonia",
      "Norway",
      "Oman",
      "Pakistan",
      "Palau",
      "Palestine",
      "Panama",
      "Papua New Guinea",
      "Paraguay",
      "Peru",
      "Philippines",
      "Poland",
      "Portugal",
      "Qatar",
      "Romania",
      "Russia",
      "Rwanda",
      "Saint Kitts and Nevis",
      "Saint Lucia",
      "Saint Vincent and the Grenadines",
      "Samoa",
      "San Marino",
      "Sao Tome and Principe",
      "Saudi Arabia",
      "Senegal",
      "Serbia",
      "Seychelles",
      "Sierra Leone",
      "Singapore",
      "Slovakia",
      "Slovenia",
      "Solomon Islands",
      "South Africa",
      "South Korea",
      "South Sudan",
      "Spain",
      "Sri Lanka",
      "Sudan",
      "Suriname",
      "Sweden",
      "Switzerland",
      "Syria",
      "Taiwan",
      "Tajikistan",
      "Tanzania",
      "Thailand",
      "Timor-Leste",
      "Togo",
      "Tonga",
      "Trinidad and Tobago",
      "Tunisia",
      "Turkey",
      "Turkmenistan",
      "Tuvalu",
      "Uganda",
      "Ukraine",
      "United Arab Emirates",
      "United Kingdom",
      "United States",
      "Uruguay",
      "Uzbekistan",
      "Vanuatu",
      "Vatican City",
      "Venezuela",
      "Vietnam",
      "Yemen",
      "Zambia",
      "Zimbabwe",
    ],
    []
  );

  const openModal = () => {
    setErrorMessage("");
    setModalView("choice");
    setCurrentStep(1);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalView("choice");
    setShowCodeHelp(false);
  };

  const openRegisterFlow = () => {
    setErrorMessage("");
    setModalView("register");
    setCurrentStep(1);
  };

  const openAssociationFlow = () => {
    setErrorMessage("");
    setModalView("association");
  };

  const goToMemberLogin = () => {
    closeModal();
    router.push("/member-login");
  };

  useEffect(() => {
    const onOpenMemberModal = () => openModal();

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target === "_blank") return;

      const href = anchor.getAttribute("href") || "";
      if (href === DIRECTUS_REGISTER_LINK || href === "/register") {
        event.preventDefault();
        openModal();
      }
    };

    const onEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setShowSuccess(false);
        setShowCodeHelp(false);
      }
    };

    window.addEventListener("open-member-register", onOpenMemberModal);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onEsc);

    return () => {
      window.removeEventListener("open-member-register", onOpenMemberModal);
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const handleChange = (key: keyof RegisterFormState, value: string) => {
    setFormState((prev) => {
      return { ...prev, [key]: value };
    });
  };

  const resetForm = () => {
    setFormState(defaultFormState);
    setIdMethod("");
    setCurrentStep(1);
    setProfilePicture(null);
    setNationalIdPhoto(null);
    setPassportDocument(null);
    setDrivingLicenseDocument(null);
    setErrorMessage("");
  };

  const resetAssociationForm = () => {
    setAssociationForm(defaultAssociationFormState);
    setAssociationCertificateFile(null);
  };

  const goNextStep = () => {
    if (currentStep === 1 && !hasRequiredBasics) {
      setErrorMessage("Please complete all required fields in the Information section.");
      return;
    }

    if (currentStep === 2 && idMethod === "code" && !isCodeEntered) {
      setErrorMessage("Please enter your code or switch method.");
      return;
    }

    if (currentStep === 2 && idMethod === "national_id" && !nationalIdPhoto) {
      setErrorMessage("Please upload your National ID photo or switch method.");
      return;
    }

    setErrorMessage("");
    setCurrentStep((prev) => (prev === 3 ? prev : ((prev + 1) as 1 | 2 | 3)));
  };

  const goPrevStep = () => {
    setErrorMessage("");
    setCurrentStep((prev) => (prev === 1 ? prev : ((prev - 1) as 1 | 2 | 3)));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      setErrorMessage(
        "Please complete all required fields before submitting."
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = new FormData();
      payload.append("fullName", formState.fullName.trim());
      payload.append("phone", formState.phone.trim());
      payload.append("email", formState.email.trim());
      payload.append("city", formState.city.trim());
      payload.append("country", formState.country.trim());
      payload.append("password", formState.password);
      payload.append("profession", "");
      payload.append("countryOfNationality", "");
      payload.append("areasOfInterest", "");
      payload.append("shareContactPreference", "none");

      const finalCode = idMethod === "code" ? formState.nationalIdCode.trim() : "";
      payload.append("nationalIdCode", finalCode);
      payload.append("additionalNotes", formState.additionalNotes.trim());

      if (profilePicture) {
        payload.append("profilePicture", profilePicture);
      }

      if (nationalIdPhoto) {
        payload.append("nationalIdPhoto", nationalIdPhoto);
      }

      if (passportDocument) {
        payload.append("passportFile", passportDocument);
      }

      if (drivingLicenseDocument) {
        payload.append("drivingLicenseFile", drivingLicenseDocument);
      }

      const response = await fetch("/api/member-register", {
        method: "POST",
        body: payload,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setErrorMessage(result?.message || "Failed to submit registration.");
        return;
      }

      closeModal();
      setSuccessKind("member");
      setShowSuccess(true);
      resetForm();
    } catch {
      setErrorMessage("Unable to submit right now. Please try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssociationChange = (
    key: Exclude<keyof AssociationFormState, "leaders">,
    value: string
  ) => {
    setAssociationForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAssociationLeaderChange = (
    index: number,
    key: keyof AssociationLeader,
    value: string
  ) => {
    setAssociationForm((prev) => ({
      ...prev,
      leaders: prev.leaders.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const addAssociationLeader = () => {
    setAssociationForm((prev) => {
      if (prev.leaders.length >= MAX_ASSOCIATION_LEADERS) {
        return prev;
      }

      return {
        ...prev,
        leaders: [
          ...prev.leaders,
          { fullName: "", role: "", city: "", phone: "" },
        ],
      };
    });
  };

  const removeAssociationLeader = (index: number) => {
    setAssociationForm((prev) => {
      if (prev.leaders.length <= 1) {
        return prev;
      }

      return {
        ...prev,
        leaders: prev.leaders.filter((_, itemIndex) => itemIndex !== index),
      };
    });
  };

  const handleAssociationSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmitAssociation) {
      setErrorMessage(
        `Please complete required fields before submitting: ${associationMissingFields.join(", ")}.`
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const resolvedCategory =
        associationForm.category === "Other type"
          ? associationForm.otherCategory.trim()
            ? `Other type: ${associationForm.otherCategory.trim()}`
            : "Other type"
          : associationForm.category;

      const payload = new FormData();
      payload.append("associationName", associationForm.associationName.trim());
      payload.append("acronym", associationForm.acronym.trim());
      payload.append("registrationDate", associationForm.registrationDate);
      payload.append("registrationPlace", associationForm.registrationPlace.trim());
      payload.append("category", resolvedCategory);
      payload.append("district", associationForm.district.trim());
      payload.append("region", associationForm.region.trim());
      payload.append("address", associationForm.address.trim());
      payload.append("phone", associationForm.phone.trim());
      payload.append("email", associationForm.email.trim());
      payload.append("website", associationForm.website.trim());
      payload.append("objectives", associationForm.objectives.trim());
      payload.append("hasRegistrationProof", associationForm.hasRegistrationProof);
      payload.append("leaders", JSON.stringify(associationForm.leaders));

      if (associationCertificateFile) {
        payload.append("registrationCertificate", associationCertificateFile);
      }

      const response = await fetch("/api/association-register", {
        method: "POST",
        body: payload,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setErrorMessage(
          result?.message || "Failed to submit association registration."
        );
        return;
      }

      closeModal();
      setSuccessKind("association");
      setShowSuccess(true);
      resetAssociationForm();
    } catch {
      setErrorMessage(
        "Unable to submit association right now. Please try again shortly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelStyle = {
    fontWeight: 600,
    fontSize: "1.05rem",
    color: "#1f2937",
    marginBottom: "8px",
    display: "block",
    letterSpacing: "0.12px",
  } as const;

  const inputStyle = {
    border: "1.5px solid #d4e4da",
    borderRadius: "12px",
    minHeight: "56px",
    boxShadow: "0 4px 12px rgba(10, 48, 24, 0.05)",
    fontSize: "1.05rem",
    paddingLeft: "14px",
    paddingRight: "14px",
    transition: "all 0.2s ease",
  } as const;

  const sectionCardStyle = {
    border: "1px solid #d9e9df",
    borderRadius: "16px",
    padding: "clamp(12px, 2.4vw, 24px)",
    background: "linear-gradient(140deg, #f7fcf9 0%, #f1fbf5 100%)",
  } as const;

  const stepTitleStyle = {
    fontWeight: 700,
    color: "#006d21",
    marginBottom: "14px",
    fontSize: "clamp(1.2rem, 2.4vw, 1.75rem)",
  } as const;

  const modalGradientHeader = {
    padding: "clamp(14px, 2.5vw, 26px)",
    borderBottom: "1px solid #d7e8de",
    background:
      "radial-gradient(circle at 8% 0%, rgba(0,109,33,0.2) 0%, rgba(255,255,255,1) 36%), linear-gradient(125deg, #e9f8ef 0%, #ffffff 60%)",
  } as const;

  const choiceCardBaseStyle = {
    border: "1.5px solid #d4e4da",
    borderRadius: "18px",
    padding: "clamp(14px, 2.2vw, 22px)",
    background: "#ffffff",
    boxShadow: "0 12px 30px rgba(9, 54, 26, 0.08)",
  } as const;

  return (
    <>
      {isOpen && (
        <div
          className="member-register-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            backdropFilter: "blur(2px)",
          }}
          onClick={closeModal}
        >
          <div
            className="member-register-dialog"
            style={{
              width: "100%",
              maxWidth: "980px",
              maxHeight: "92vh",
              overflow: "auto",
              background: "#ffffff",
              borderRadius: "20px",
              border: "1px solid #d4e4da",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={modalGradientHeader} className="member-register-header">
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <div>
                  <h3 className="member-register-title" style={{ margin: "0 0 8px 0", color: "#0f172a", fontWeight: 800, fontSize: "3rem", lineHeight: 1.1 }}>
                    {modalView === "choice"
                      ? "Welcome, Member"
                      : modalView === "register"
                        ? "Become a Member"
                        : "Register Association"}
                  </h3>
                  <p className="member-register-subtitle" style={{ margin: 0, color: "#5a6b76", fontSize: "1.3rem", lineHeight: "1.6" }}>
                    {modalView === "choice"
                      ? "Choose how you want to continue. Sign in, register as an individual member, or register an association."
                      : modalView === "register"
                        ? `Step ${currentStep} of 3. Default status is pending. Login is enabled after admin approval.`
                        : "Complete your association profile and leadership details. Submission integration will be added in the next backend step."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="member-register-close"
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#9ca3af",
                    fontSize: "36px",
                    cursor: "pointer",
                    fontWeight: 300,
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {modalView === "choice" && (
              <div className="member-register-choice" style={{ padding: "28px" }}>
                <div
                  style={{
                    borderRadius: "20px",
                    border: "1px solid #d9e9df",
                    background:
                      "linear-gradient(155deg, rgba(241,250,245,1) 0%, rgba(255,255,255,1) 55%, rgba(238,248,242,1) 100%)",
                    padding: "24px",
                  }}
                >
                  <div className="row g-3 member-form-grid">
                    <div className="col-lg-4">
                      <div className="member-choice-card" style={choiceCardBaseStyle}>
                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "999px",
                            background: "#eefbf2",
                            color: "#006d21",
                            display: "grid",
                            placeItems: "center",
                            fontWeight: 800,
                            marginBottom: "12px",
                          }}
                        >
                          01
                        </div>
                        <h4 style={{ margin: "0 0 8px 0", color: "#0f172a", fontSize: "1.6rem", fontWeight: 800 }}>
                          Sign In
                        </h4>
                        <p style={{ margin: "0 0 16px 0", color: "#475569", fontSize: "1.12rem", lineHeight: 1.6 }}>
                          Already registered and approved? Go directly to member login.
                        </p>
                        <button
                          type="button"
                          onClick={goToMemberLogin}
                          style={{
                            width: "100%",
                            border: "none",
                            background: "linear-gradient(135deg, #006d21 0%, #0a8f3d 100%)",
                            color: "#ffffff",
                            borderRadius: "12px",
                            minHeight: "52px",
                            fontWeight: 700,
                            fontSize: "1.15rem",
                            cursor: "pointer",
                          }}
                        >
                          Open Member Login
                        </button>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="member-choice-card" style={choiceCardBaseStyle}>
                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "999px",
                            background: "#fff5ea",
                            color: "#9a3412",
                            display: "grid",
                            placeItems: "center",
                            fontWeight: 800,
                            marginBottom: "12px",
                          }}
                        >
                          02
                        </div>
                        <h4 style={{ margin: "0 0 8px 0", color: "#0f172a", fontSize: "1.6rem", fontWeight: 800 }}>
                          Become a Member
                        </h4>
                        <p style={{ margin: "0 0 16px 0", color: "#475569", fontSize: "1.12rem", lineHeight: 1.6 }}>
                          New member? Complete your profile and identification in the registration form.
                        </p>
                        <button
                          type="button"
                          onClick={openRegisterFlow}
                          style={{
                            width: "100%",
                            border: "1px solid #006d21",
                            background: "#ffffff",
                            color: "#006d21",
                            borderRadius: "12px",
                            minHeight: "52px",
                            fontWeight: 700,
                            fontSize: "1.15rem",
                            cursor: "pointer",
                          }}
                        >
                          Start Membership Form
                        </button>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="member-choice-card" style={choiceCardBaseStyle}>
                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "999px",
                            background: "#e9f7ff",
                            color: "#0c4a6e",
                            display: "grid",
                            placeItems: "center",
                            fontWeight: 800,
                            marginBottom: "12px",
                          }}
                        >
                          03
                        </div>
                        <h4 style={{ margin: "0 0 8px 0", color: "#0f172a", fontSize: "1.6rem", fontWeight: 800 }}>
                          Register Association
                        </h4>
                        <p style={{ margin: "0 0 16px 0", color: "#475569", fontSize: "1.12rem", lineHeight: 1.6 }}>
                          Register your diaspora association with official profile, contacts, and leadership structure.
                        </p>
                        <button
                          type="button"
                          onClick={openAssociationFlow}
                          style={{
                            width: "100%",
                            border: "1px solid #0c4a6e",
                            background: "#ffffff",
                            color: "#0c4a6e",
                            borderRadius: "12px",
                            minHeight: "52px",
                            fontWeight: 700,
                            fontSize: "1.15rem",
                            cursor: "pointer",
                          }}
                        >
                          Open Association Form
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {modalView === "register" && (
              <form onSubmit={handleSubmit} className="member-register-form" style={{ padding: "28px" }}>
                <div style={{ display: "flex", gap: "12px", marginBottom: "22px", flexWrap: "wrap" }}>
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className="member-step-chip"
                      style={{
                        border: `1.5px solid ${currentStep === step ? "#006d21" : "#d4e4da"}`,
                        background: currentStep === step ? "#ecfdf3" : "#ffffff",
                        color: currentStep === step ? "#065f46" : "#5a6b76",
                        borderRadius: "999px",
                        padding: "10px 16px",
                        fontWeight: 700,
                        fontSize: "1.2rem",
                      }}
                    >
                      {step === 1 && "1. Information"}
                      {step === 2 && "2. Identification"}
                      {step === 3 && "3. Password & Message"}
                    </div>
                  ))}
                </div>

                {currentStep === 1 && (
                <div className="member-section-card" style={sectionCardStyle}>
                  <div style={stepTitleStyle}>First Information Section</div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label style={labelStyle}>Full Name (Required)</label>
                      <input className="form-control" style={inputStyle} value={formState.fullName} onChange={(e) => handleChange("fullName", e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Phone (Required)</label>
                      <input className="form-control" style={inputStyle} value={formState.phone} onChange={(e) => handleChange("phone", e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Email (Required)</label>
                      <input type="email" className="form-control" style={inputStyle} value={formState.email} onChange={(e) => handleChange("email", e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>City (Required)</label>
                      <input className="form-control" style={inputStyle} value={formState.city} onChange={(e) => handleChange("city", e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Country (Required)</label>
                      <select
                        className="form-control"
                        style={inputStyle}
                        value={formState.country}
                        onChange={(e) => handleChange("country", e.target.value)}
                        required
                      >
                        <option value="">Select a country</option>
                        {countryOptions.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12">
                      <label style={labelStyle}>Profile Picture (Optional)</label>
                      <input type="file" accept="image/*" className="form-control" style={inputStyle} onChange={(e) => setProfilePicture(e.target.files?.[0] || null)} />
                    </div>
                  </div>
                </div>
                )}

                {currentStep === 2 && (
                <div className="member-section-card" style={sectionCardStyle}>
                  <div style={stepTitleStyle}>Second Identification Section</div>

                  <label style={{ ...labelStyle, marginBottom: "12px" }}>Somaliland National ID or Code (Optional)</label>
                  <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", marginBottom: "16px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.2rem", color: "#1f2937" }}>
                      <input
                        type="radio"
                        name="idMethod"
                        checked={idMethod === "national_id"}
                        onChange={() => {
                          setIdMethod("national_id");
                          handleChange("nationalIdCode", "");
                        }}
                      />
                      Upload Somaliland National ID
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.2rem", color: "#1f2937" }}>
                      <input
                        type="radio"
                        name="idMethod"
                        checked={idMethod === "code"}
                        onChange={() => {
                          setIdMethod("code");
                          setNationalIdPhoto(null);
                          handleChange("nationalIdCode", "");
                        }}
                      />
                      Enter Code
                    </label>
                  </div>

                  <div className="row g-3 member-form-grid" style={{ marginBottom: "14px" }}>
                    <div className="col-md-6">
                      <label style={labelStyle}>Somaliland National ID Upload (Optional)</label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="form-control"
                        style={inputStyle}
                        disabled={idMethod !== "national_id"}
                        onChange={(e) => setNationalIdPhoto(e.target.files?.[0] || null)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: "8px" }}>
                        Enter Code (Optional)
                        <button
                          type="button"
                          onClick={() => setShowCodeHelp(true)}
                          style={{
                            border: "none",
                            background: "transparent",
                            color: "#006d21",
                            textDecoration: "underline",
                            cursor: "pointer",
                            fontWeight: 700,
                            fontSize: "1.02rem",
                            padding: 0,
                            marginLeft: "auto",
                          }}
                          aria-label="Read about verification code"
                          title="Read about verification code"
                        >
                          Read About Code
                        </button>
                      </label>
                      <input
                        className="form-control"
                        style={inputStyle}
                        value={formState.nationalIdCode}
                        disabled={idMethod !== "code"}
                        onChange={(e) => handleChange("nationalIdCode", e.target.value)}
                        placeholder="Enter your official code"
                      />
                    </div>
                  </div>

                  <label style={{ ...labelStyle, marginBottom: "12px" }}>
                    International Documents (Optional)
                  </label>

                  <div className="row g-3 member-form-grid">
                    <div className="col-md-6">
                      <label style={labelStyle}>Passport Upload (Optional)</label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="form-control"
                        style={inputStyle}
                        onChange={(e) => {
                          setPassportDocument(e.target.files?.[0] || null);
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Driving Licence Upload (Optional)</label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="form-control"
                        style={inputStyle}
                        onChange={(e) => {
                          setDrivingLicenseDocument(e.target.files?.[0] || null);
                        }}
                      />
                    </div>
                  </div>
                </div>
                )}

                {currentStep === 3 && (
                <div className="member-section-card" style={sectionCardStyle}>
                  <div style={stepTitleStyle}> Password & Bio</div>
                  <div className="row g-3 member-form-grid">
                    <div className="col-md-6">
                      <label style={labelStyle}>Password (System Login, Optional)</label>
                      <input type="password" className="form-control" style={inputStyle} value={formState.password} onChange={(e) => handleChange("password", e.target.value)} minLength={6} />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Confirm Password (Optional)</label>
                      <input type="password" className="form-control" style={inputStyle} value={formState.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} minLength={6} />
                      {formState.confirmPassword && !passwordsMatch && (
                        <small style={{ color: "#b91c1c", fontSize: "1.1rem" }}>Passwords do not match.</small>
                      )}
                    </div>
                    <div className="col-12">
                      <label style={labelStyle}>Write a short BIO (Optional)</label>
                      <textarea
                        className="form-control"
                        style={{ ...inputStyle, minHeight: "132px", paddingTop: "12px", paddingBottom: "12px" }}
                        rows={4}
                        value={formState.additionalNotes}
                        onChange={(e) => handleChange("additionalNotes", e.target.value)}
                        placeholder="Write a short bio..."
                      />
                    </div>
                  </div>
                </div>
                )}

                {errorMessage && (
                <div className="member-form-error" style={{ marginTop: "16px", borderRadius: "12px", border: "1px solid #f5d5d5", background: "#fef2f2", color: "#991b1b", padding: "12px 14px", fontSize: "1.2rem" }}>
                  ⚠️ {errorMessage}
                </div>
                )}

                <div className="member-form-actions" style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
                  <button type="button" onClick={closeModal} style={{ border: "1.5px solid #d4e4da", background: "#ffffff", color: "#1f2937", borderRadius: "12px", padding: "12px 20px", fontWeight: 600, cursor: "pointer", fontSize: "1.2rem" }}>
                    Cancel
                  </button>

                  <div style={{ display: "flex", gap: "10px" }}>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={goPrevStep}
                        style={{
                          border: "1.5px solid #d4e4da",
                          background: "#ffffff",
                          color: "#1f2937",
                          borderRadius: "12px",
                          padding: "12px 20px",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontSize: "1.2rem",
                        }}
                      >
                        Back
                      </button>
                    )}

                    {currentStep < 3 && (
                      <button
                        type="button"
                        onClick={goNextStep}
                        style={{
                          border: "none",
                          background: "#006d21",
                          color: "#ffffff",
                          borderRadius: "12px",
                          padding: "12px 22px",
                          fontWeight: 700,
                          cursor: "pointer",
                          fontSize: "1.2rem",
                        }}
                      >
                        Continue
                      </button>
                    )}

                    {currentStep === 3 && (
                      <button type="submit" disabled={isSubmitting || !canSubmit} style={{ border: "none", background: isSubmitting || !canSubmit ? "#a8c9b5" : "#006d21", color: "#ffffff", borderRadius: "12px", padding: "12px 22px", fontWeight: 700, cursor: isSubmitting || !canSubmit ? "not-allowed" : "pointer", fontSize: "1.2rem" }}>
                        {isSubmitting ? "Submitting..." : "Submit Registration"}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            )}

            {modalView === "association" && (
              <form onSubmit={handleAssociationSubmit} className="member-register-form" style={{ padding: "28px" }}>
                <div
                  style={{
                    border: "1px solid #cfe0ea",
                    borderRadius: "14px",
                    background: "linear-gradient(155deg, #f2f9ff 0%, #ffffff 100%)",
                    padding: "14px 16px",
                    color: "#0f3f5c",
                    fontSize: "1.05rem",
                    lineHeight: 1.6,
                    marginBottom: "16px",
                  }}
                >
                  Complete the association profile below. This form is optimized for mobile and desktop, and supports leadership details in a clean structured format.
                </div>

                <div className="member-section-card" style={sectionCardStyle}>
                  <div style={stepTitleStyle}>Section A: Association Information</div>
                  <div className="row g-3 member-form-grid">
                    <div className="col-md-6">
                      <label style={labelStyle}>Association Name (Required)</label>
                      <input className="form-control" style={inputStyle} value={associationForm.associationName} onChange={(e) => handleAssociationChange("associationName", e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Acronym / Short Name</label>
                      <input className="form-control" style={inputStyle} value={associationForm.acronym} onChange={(e) => handleAssociationChange("acronym", e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Date of Registration</label>
                      <input type="date" className="form-control" style={inputStyle} value={associationForm.registrationDate} onChange={(e) => handleAssociationChange("registrationDate", e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Place of Registration</label>
                      <input className="form-control" style={inputStyle} value={associationForm.registrationPlace} onChange={(e) => handleAssociationChange("registrationPlace", e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Category / Type</label>
                      <select
                        className="form-control"
                        style={inputStyle}
                        value={associationForm.category}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleAssociationChange("category", value);
                          if (value !== "Other type") {
                            handleAssociationChange("otherCategory", "");
                          }
                        }}
                      >
                        <option value="">Select category</option>
                        {ASSOCIATION_CATEGORY_OPTIONS.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    {associationForm.category === "Other type" && (
                      <div className="col-md-6">
                        <label style={labelStyle}>Specify Other Type</label>
                        <input
                          className="form-control"
                          style={inputStyle}
                          value={associationForm.otherCategory}
                          onChange={(e) =>
                            handleAssociationChange("otherCategory", e.target.value)
                          }
                          placeholder="Write the exact association type"
                        />
                      </div>
                    )}
                    <div className="col-md-3">
                      <label style={labelStyle}>District</label>
                      <input className="form-control" style={inputStyle} value={associationForm.district} onChange={(e) => handleAssociationChange("district", e.target.value)} />
                    </div>
                    <div className="col-md-3">
                      <label style={labelStyle}>Region</label>
                      <input className="form-control" style={inputStyle} value={associationForm.region} onChange={(e) => handleAssociationChange("region", e.target.value)} />
                    </div>
                    <div className="col-12">
                      <label style={labelStyle}>Address</label>
                      <input className="form-control" style={inputStyle} value={associationForm.address} onChange={(e) => handleAssociationChange("address", e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <label style={labelStyle}>Phone (Required)</label>
                      <input className="form-control" style={inputStyle} value={associationForm.phone} onChange={(e) => handleAssociationChange("phone", e.target.value)} required />
                    </div>
                    <div className="col-md-4">
                      <label style={labelStyle}>Email (Required)</label>
                      <input type="email" className="form-control" style={inputStyle} value={associationForm.email} onChange={(e) => handleAssociationChange("email", e.target.value)} required />
                    </div>
                    <div className="col-md-4">
                      <label style={labelStyle}>Website</label>
                      <input className="form-control" style={inputStyle} value={associationForm.website} onChange={(e) => handleAssociationChange("website", e.target.value)} placeholder="https://..." />
                    </div>
                    <div className="col-12">
                      <label style={labelStyle}>Main Objectives (Required)</label>
                      <textarea
                        className="form-control"
                        style={{ ...inputStyle, minHeight: "132px", paddingTop: "12px", paddingBottom: "12px" }}
                        rows={4}
                        value={associationForm.objectives}
                        onChange={(e) => handleAssociationChange("objectives", e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label style={labelStyle}>Do you have registration proof?</label>
                      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.1rem" }}>
                          <input type="radio" name="registration-proof" checked={associationForm.hasRegistrationProof === "yes"} onChange={() => handleAssociationChange("hasRegistrationProof", "yes")} />
                          Yes
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.1rem" }}>
                          <input type="radio" name="registration-proof" checked={associationForm.hasRegistrationProof === "no"} onChange={() => handleAssociationChange("hasRegistrationProof", "no")} />
                          No
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <label style={labelStyle}>Upload Registration Certificate (Optional)</label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="form-control"
                        style={inputStyle}
                        onChange={(e) =>
                          setAssociationCertificateFile(e.target.files?.[0] || null)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="member-section-card" style={{ ...sectionCardStyle, marginTop: "16px" }}>
                  <div style={stepTitleStyle}>Section B: Association Leadership</div>
                  <p style={{ marginTop: "-4px", marginBottom: "12px", color: "#4b5563", fontSize: "1rem" }}>
                    Add your leadership team details. You can add or remove rows as needed.
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                    <div style={{ color: "#334155", fontSize: "0.95rem" }}>
                      {associationForm.leaders.length} leader{associationForm.leaders.length > 1 ? "s" : ""} added
                    </div>
                    <button
                      type="button"
                      onClick={addAssociationLeader}
                      disabled={associationForm.leaders.length >= MAX_ASSOCIATION_LEADERS}
                      style={{
                        border: "1px solid #0c4a6e",
                        background:
                          associationForm.leaders.length >= MAX_ASSOCIATION_LEADERS
                            ? "#d9e7f0"
                            : "#f1f7fc",
                        color: "#0c4a6e",
                        borderRadius: "10px",
                        padding: "8px 14px",
                        fontWeight: 700,
                        cursor:
                          associationForm.leaders.length >= MAX_ASSOCIATION_LEADERS
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      + Add Leader
                    </button>
                  </div>
                  <div className="row g-3 member-form-grid">
                    {associationForm.leaders.map((leader, index) => (
                      <div
                        key={index}
                        className="col-12"
                        style={{
                          border: "1px solid #d8e6de",
                          borderRadius: "14px",
                          padding: "14px",
                          background: "#ffffff",
                          boxShadow: "0 8px 18px rgba(15, 23, 42, 0.05)",
                        }}
                      >
                        <div style={{ fontWeight: 800, color: "#0f172a", marginBottom: "10px" }}>
                          Leader {index + 1}
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
                          <button
                            type="button"
                            onClick={() => removeAssociationLeader(index)}
                            disabled={associationForm.leaders.length <= 1}
                            style={{
                              border: "1px solid #dc2626",
                              background:
                                associationForm.leaders.length <= 1
                                  ? "#fee2e2"
                                  : "#fff1f2",
                              color: "#b91c1c",
                              borderRadius: "10px",
                              padding: "6px 12px",
                              fontWeight: 700,
                              cursor:
                                associationForm.leaders.length <= 1
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                          >
                            Remove
                          </button>
                        </div>
                        <div className="row g-3">
                          <div className="col-md-4">
                            <label style={labelStyle}>Full Name</label>
                            <input className="form-control" style={inputStyle} value={leader.fullName} onChange={(e) => handleAssociationLeaderChange(index, "fullName", e.target.value)} />
                          </div>
                          <div className="col-md-3">
                            <label style={labelStyle}>Role / Position</label>
                            <input className="form-control" style={inputStyle} value={leader.role} onChange={(e) => handleAssociationLeaderChange(index, "role", e.target.value)} placeholder="Chairman, Secretary..." />
                          </div>
                          <div className="col-md-3">
                            <label style={labelStyle}>City</label>
                            <input className="form-control" style={inputStyle} value={leader.city} onChange={(e) => handleAssociationLeaderChange(index, "city", e.target.value)} />
                          </div>
                          <div className="col-md-2">
                            <label style={labelStyle}>Phone</label>
                            <input className="form-control" style={inputStyle} value={leader.phone} onChange={(e) => handleAssociationLeaderChange(index, "phone", e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {errorMessage && (
                  <div className="member-form-error" style={{ marginTop: "16px", borderRadius: "12px", border: "1px solid #f5d5d5", background: "#fef2f2", color: "#991b1b", padding: "12px 14px", fontSize: "1.2rem" }}>
                    ⚠️ {errorMessage}
                  </div>
                )}

                <div className="member-form-actions" style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => setModalView("choice")}
                    style={{ border: "1.5px solid #d4e4da", background: "#ffffff", color: "#1f2937", borderRadius: "12px", padding: "12px 20px", fontWeight: 600, cursor: "pointer", fontSize: "1.2rem" }}
                  >
                    Back to Options
                  </button>

                    <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{ border: "none", background: isSubmitting ? "#93b8cd" : "#0c4a6e", color: "#ffffff", borderRadius: "12px", padding: "12px 22px", fontWeight: 700, cursor: isSubmitting ? "not-allowed" : "pointer", fontSize: "1.2rem" }}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Association Request"}
                  </button>
                </div>

                {!canSubmitAssociation && (
                  <div style={{ marginTop: "10px", color: "#b45309", fontSize: "0.95rem" }}>
                    Required fields: {associationMissingFields.join(", ")}
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {showCodeHelp && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.35)",
            zIndex: 10001,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => setShowCodeHelp(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "580px",
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #d4e4da",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
              overflow: "hidden",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              style={{
                padding: "16px 20px",
                background: "linear-gradient(130deg, #edf8f1 0%, #ffffff 100%)",
                borderBottom: "1px solid #e3eee7",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <h4 style={{ margin: 0, color: "#0f5132", fontSize: "1.35rem", fontWeight: 800 }}>
                About Verification Code
              </h4>
              <button
                type="button"
                onClick={() => setShowCodeHelp(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#6b7280",
                  fontSize: "1.6rem",
                  lineHeight: 1,
                  cursor: "pointer",
                }}
                aria-label="Close help modal"
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "20px" }}>
              <p style={{ margin: 0, color: "#334155", fontSize: "1.12rem", lineHeight: 1.75 }}>
                If you don&apos;t have Somaliland national ID, please contact your local Somaliland diaspora association to verify your nationality and provide you with a verification code.
              </p>

              <div style={{ marginTop: "16px", textAlign: "right" }}>
                <button
                  type="button"
                  onClick={() => setShowCodeHelp(false)}
                  style={{
                    border: "none",
                    background: "#006d21",
                    color: "#ffffff",
                    borderRadius: "10px",
                    padding: "10px 16px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
          onClick={() => setShowSuccess(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "520px",
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #d4e4da",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
              padding: "28px",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "12px" }}>✓</div>
              <h3 style={{ marginBottom: "8px", color: "#006d21", fontWeight: 700, fontSize: "2rem" }}>
                {successKind === "member" ? "Registration Submitted" : "Association Request Submitted"}
              </h3>
              <p style={{ marginBottom: "12px", color: "#1f2937", lineHeight: "1.6", fontSize: "1.2rem" }}>
                {successKind === "member" ? (
                  <>
                    Your account is now <strong>pending</strong> and awaits admin approval.
                  </>
                ) : (
                  <>
                    Your association profile is now <strong>pending</strong> and awaits admin review.
                  </>
                )}
              </p>
              <p style={{ marginBottom: "20px", color: "#5a6b76", fontSize: "1.15rem", lineHeight: "1.6" }}>
                {successKind === "member"
                  ? "Once approved, you can login and access your member dashboard to view your profile and other members."
                  : "Once approved, your association will be available in the diaspora system and dashboard integrations."}
              </p>
              <button
                type="button"
                onClick={() => setShowSuccess(false)}
                style={{
                  border: "none",
                  background: "#006d21",
                  color: "#fff",
                  borderRadius: "12px",
                  padding: "12px 24px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "1.2rem",
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .member-register-overlay {
          font-family: "Plus Jakarta Sans", "Segoe UI", sans-serif;
        }

        .member-register-dialog {
          border-radius: 20px !important;
          border: 1px solid #d7e8df !important;
          background: #ffffff !important;
          box-shadow: 0 28px 64px rgba(15, 23, 42, 0.22) !important;
        }

        .member-register-header {
          position: sticky;
          top: 0;
          z-index: 4;
          background:
            radial-gradient(circle at 8% 0%, rgba(0, 109, 33, 0.22) 0%, rgba(255, 255, 255, 1) 34%),
            linear-gradient(125deg, #e9f8ef 0%, #ffffff 58%) !important;
          border-bottom: 1px solid #dbeae2 !important;
        }

        .member-register-title {
          font-size: clamp(1.55rem, 2.8vw, 2.35rem) !important;
          line-height: 1.15 !important;
          letter-spacing: 0.2px;
          margin-bottom: 6px !important;
        }

        .member-register-subtitle {
          font-size: clamp(1rem, 1.45vw, 1.08rem) !important;
          line-height: 1.6 !important;
          max-width: 72ch;
        }

        .member-register-close {
          font-size: 30px !important;
          color: #64748b !important;
        }

        .member-choice-card,
        .member-section-card {
          border-color: #cfe4d8 !important;
          background: linear-gradient(180deg, #ffffff 0%, #fbfefc 100%) !important;
          box-shadow: 0 14px 28px rgba(9, 54, 26, 0.08) !important;
        }

        .member-section-card {
          border-radius: 16px;
        }

        .member-register-choice,
        .member-register-form {
          padding: clamp(12px, 2.2vw, 26px) !important;
        }

        .member-register-dialog .form-control {
          font-size: 1.03rem !important;
          border-radius: 12px !important;
          min-height: 56px !important;
          border-color: #cadfd3 !important;
          background: #ffffff !important;
          box-shadow: 0 6px 14px rgba(15, 23, 42, 0.04) !important;
        }

        .member-register-dialog .member-form-grid {
          --bs-gutter-x: 1.4rem;
          --bs-gutter-y: 1rem;
        }

        .member-register-dialog .form-control:focus {
          border-color: #85c3a2 !important;
          box-shadow: 0 0 0 3px rgba(0, 109, 33, 0.14) !important;
        }

        .member-register-dialog textarea.form-control {
          min-height: 126px !important;
        }

        .member-register-dialog .member-step-chip {
          font-size: 0.97rem !important;
          padding: 10px 14px !important;
          letter-spacing: 0.1px;
          border-width: 1.5px !important;
        }

        .member-register-dialog button {
          font-size: 1rem !important;
        }

        .member-register-dialog small {
          font-size: 0.92rem !important;
        }

        .member-form-error {
          font-size: 1rem !important;
          line-height: 1.45;
        }

        .member-form-actions button {
          min-height: 48px;
          border-radius: 12px !important;
          font-weight: 700 !important;
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.09);
        }

        @media (max-width: 992px) {
          .member-register-dialog {
            max-width: min(96vw, 780px) !important;
          }

          .member-register-form .row > [class*="col-"] {
            width: 100% !important;
            flex: 0 0 100% !important;
          }

          .member-register-form [style*="Read About Code"] {
            margin-left: 0 !important;
          }
        }

        @media (max-width: 680px) {
          .member-register-overlay {
            padding: 8px !important;
            align-items: flex-end !important;
          }

          .member-register-dialog {
            max-height: 94vh !important;
            border-radius: 14px !important;
          }

          .member-register-header {
            padding: 14px !important;
          }

          .member-register-title {
            font-size: 1.35rem !important;
          }

          .member-register-subtitle {
            font-size: 0.98rem !important;
          }

          .member-register-choice,
          .member-register-form {
            padding: 12px !important;
          }

          .member-form-actions {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .member-form-actions > div {
            width: 100%;
            display: grid !important;
            grid-template-columns: 1fr;
          }

          .member-register-dialog button {
            width: 100%;
            min-height: 48px !important;
          }

          .member-register-dialog .member-step-chip {
            width: 100%;
            text-align: center;
          }

          .member-register-dialog .member-form-grid {
            --bs-gutter-x: 0.85rem;
            --bs-gutter-y: 0.85rem;
          }
        }
      `}</style>
    </>
  );
}

export default MemberRegistrationModal;
