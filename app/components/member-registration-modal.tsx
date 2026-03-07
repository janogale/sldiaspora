"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type SecondaryDocumentType = "passport" | "driving_license" | "";
type IdVerificationMethod = "national_id" | "code" | "";

type RegisterFormState = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  nationalIdCode: string;
  secondaryDocumentType: SecondaryDocumentType;
  password: string;
  confirmPassword: string;
  additionalNotes: string;
};

const defaultFormState: RegisterFormState = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  country: "",
  nationalIdCode: "",
  secondaryDocumentType: "",
  password: "",
  confirmPassword: "",
  additionalNotes: "",
};

type SharedCodeOption = {
  code: string;
  label: string;
};

const DIRECTUS_REGISTER_LINK = "https://admin.sldiaspora.org/admin/register";
const SHARED_CODES_WEB_EXCEL_PATH = "/api/shared-codes-webexcel";

function MemberRegistrationModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [modalView, setModalView] = useState<"choice" | "register">("choice");
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formState, setFormState] = useState<RegisterFormState>(defaultFormState);
  const [idMethod, setIdMethod] = useState<IdVerificationMethod>("");
  const [sharedCodes, setSharedCodes] = useState<SharedCodeOption[]>([]);
  const [isLoadingCodes, setIsLoadingCodes] = useState(false);

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [nationalIdPhoto, setNationalIdPhoto] = useState<File | null>(null);
  const [secondaryDocument, setSecondaryDocument] = useState<File | null>(null);

  const passwordsMatch =
    formState.password.length >= 6 && formState.password === formState.confirmPassword;

  const hasRequiredBasics =
    formState.fullName.trim().length > 1 &&
    formState.phone.trim().length > 5 &&
    formState.email.trim().length > 3 &&
    formState.address.trim().length > 3 &&
    formState.city.trim().length > 1 &&
    formState.country.trim().length > 1;

  const isSelectedCodeValid = useMemo(() => {
    const value = formState.nationalIdCode.trim();
    if (!value) return false;
    return sharedCodes.some((item) => item.code === value);
  }, [formState.nationalIdCode, sharedCodes]);

  const hasValidIdMethod =
    (idMethod === "national_id" && !!nationalIdPhoto) ||
    (idMethod === "code" && isSelectedCodeValid);

  const hasSecondaryDoc =
    !!secondaryDocument &&
    (formState.secondaryDocumentType === "passport" ||
      formState.secondaryDocumentType === "driving_license");

  const canSubmit = useMemo(() => {
    return hasRequiredBasics && hasValidIdMethod && hasSecondaryDoc && passwordsMatch;
  }, [hasRequiredBasics, hasValidIdMethod, hasSecondaryDoc, passwordsMatch]);

  const loadSharedCodes = async () => {
    setIsLoadingCodes(true);
    try {
      const response = await fetch("/api/shared-codes", { method: "GET" });
      const result = (await response.json().catch(() => null)) as {
        data?: SharedCodeOption[];
        message?: string;
      } | null;

      if (!response.ok) {
        setSharedCodes([]);
        if (result?.message) setErrorMessage(result.message);
        return;
      }

      const items = Array.isArray(result?.data) ? result!.data : [];
      setSharedCodes(items);
    } catch {
      setSharedCodes([]);
      setErrorMessage("Unable to load shared codes right now.");
    } finally {
      setIsLoadingCodes(false);
    }
  };

  const openModal = () => {
    setErrorMessage("");
    setModalView("choice");
    setCurrentStep(1);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalView("choice");
  };

  const openRegisterFlow = () => {
    setErrorMessage("");
    setModalView("register");
    setCurrentStep(1);
  };

  const goToMemberLogin = () => {
    closeModal();
    router.push("/member-login");
  };

  const openCodesExcel = () => {
    if (typeof window === "undefined") return;
    window.open(SHARED_CODES_WEB_EXCEL_PATH, "_blank", "noopener,noreferrer");
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

  useEffect(() => {
    if (!isOpen) return;
    if (idMethod !== "code") return;
    if (sharedCodes.length > 0 || isLoadingCodes) return;

    loadSharedCodes();
  }, [idMethod, isOpen, sharedCodes.length, isLoadingCodes]);

  const handleChange = (key: keyof RegisterFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const setSecondaryDocumentType = (value: SecondaryDocumentType) => {
    setSecondaryDocument(null);
    setFormState((prev) => ({ ...prev, secondaryDocumentType: value }));
  };

  const resetForm = () => {
    setFormState(defaultFormState);
    setIdMethod("");
    setCurrentStep(1);
    setProfilePicture(null);
    setNationalIdPhoto(null);
    setSecondaryDocument(null);
    setErrorMessage("");
  };

  const goNextStep = () => {
    if (currentStep === 1 && !hasRequiredBasics) {
      setErrorMessage("Please complete all fields in the Information section.");
      return;
    }

    if (currentStep === 2 && (!hasValidIdMethod || !hasSecondaryDoc)) {
      setErrorMessage(
        "Please choose one ID method (National ID upload OR code), and upload your passport or driving licence."
      );
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
        "Please complete all required fields, verification, password, and short bio before submitting."
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
      payload.append("address", formState.address.trim());
      payload.append("city", formState.city.trim());
      payload.append("country", formState.country.trim());
      payload.append("password", formState.password);
      payload.append("profession", "");
      payload.append("countryOfNationality", "");
      payload.append("areasOfInterest", "");
      payload.append("shareContactPreference", "none");

      const finalCode = idMethod === "code" ? formState.nationalIdCode.trim() : "";
      payload.append("nationalIdCode", finalCode);
      payload.append("secondaryDocumentType", formState.secondaryDocumentType);
      payload.append("additionalNotes", formState.additionalNotes.trim());

      if (profilePicture) {
        payload.append("profilePicture", profilePicture);
      }

      if (nationalIdPhoto) {
        payload.append("nationalIdPhoto", nationalIdPhoto);
      }

      if (secondaryDocument) {
        payload.append("secondaryDocument", secondaryDocument);
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
      setShowSuccess(true);
      resetForm();
    } catch {
      setErrorMessage("Unable to submit right now. Please try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelStyle = {
    fontWeight: 600,
    fontSize: "1.35rem",
    color: "#1f2937",
    marginBottom: "12px",
    display: "block",
    letterSpacing: "0.2px",
  } as const;

  const inputStyle = {
    border: "1.5px solid #d4e4da",
    borderRadius: "12px",
    minHeight: "64px",
    boxShadow: "0 8px 20px rgba(10, 48, 24, 0.05)",
    fontSize: "1.25rem",
    paddingLeft: "14px",
    paddingRight: "14px",
    transition: "all 0.2s ease",
  } as const;

  const sectionCardStyle = {
    border: "1px solid #d9e9df",
    borderRadius: "16px",
    padding: "24px",
    background: "linear-gradient(140deg, #f7fcf9 0%, #f1fbf5 100%)",
  } as const;

  const stepTitleStyle = {
    fontWeight: 700,
    color: "#006d21",
    marginBottom: "18px",
    fontSize: "2.1rem",
  } as const;

  const modalGradientHeader = {
    padding: "28px",
    borderBottom: "1px solid #d7e8de",
    background:
      "radial-gradient(circle at 8% 0%, rgba(0,109,33,0.2) 0%, rgba(255,255,255,1) 36%), linear-gradient(125deg, #e9f8ef 0%, #ffffff 60%)",
  } as const;

  const choiceCardBaseStyle = {
    border: "1.5px solid #d4e4da",
    borderRadius: "18px",
    padding: "22px",
    background: "#ffffff",
    boxShadow: "0 12px 30px rgba(9, 54, 26, 0.08)",
  } as const;

  return (
    <>
      {isOpen && (
        <div
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
            style={{
              width: "100%",
              maxWidth: "960px",
              maxHeight: "90vh",
              overflow: "auto",
              background: "#ffffff",
              borderRadius: "20px",
              border: "1px solid #d4e4da",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={modalGradientHeader}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 8px 0", color: "#0f172a", fontWeight: 800, fontSize: "3rem", lineHeight: 1.1 }}>
                    {modalView === "choice" ? "Welcome, Member" : "Become a Member"}
                  </h3>
                  <p style={{ margin: 0, color: "#5a6b76", fontSize: "1.3rem", lineHeight: "1.6" }}>
                    {modalView === "choice"
                      ? "Choose how you want to continue. Sign in if you already have an account, or start your membership registration."
                      : `Step ${currentStep} of 3. Default status is pending. Login is enabled after admin approval.`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
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
              <div style={{ padding: "28px" }}>
                <div
                  style={{
                    borderRadius: "20px",
                    border: "1px solid #d9e9df",
                    background:
                      "linear-gradient(155deg, rgba(241,250,245,1) 0%, rgba(255,255,255,1) 55%, rgba(238,248,242,1) 100%)",
                    padding: "24px",
                  }}
                >
                  <div className="row g-3">
                    <div className="col-lg-6">
                      <div style={choiceCardBaseStyle}>
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
                    <div className="col-lg-6">
                      <div style={choiceCardBaseStyle}>
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
                  </div>
                </div>
              </div>
            )}

            {modalView === "register" && (
              <form onSubmit={handleSubmit} style={{ padding: "28px" }}>
                <div style={{ display: "flex", gap: "12px", marginBottom: "22px", flexWrap: "wrap" }}>
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
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
                <div style={sectionCardStyle}>
                  <div style={stepTitleStyle}>First Information Section</div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label style={labelStyle}>Full Name *</label>
                      <input className="form-control" style={inputStyle} value={formState.fullName} onChange={(e) => handleChange("fullName", e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Phone *</label>
                      <input className="form-control" style={inputStyle} value={formState.phone} onChange={(e) => handleChange("phone", e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Email *</label>
                      <input type="email" className="form-control" style={inputStyle} value={formState.email} onChange={(e) => handleChange("email", e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Address *</label>
                      <input className="form-control" style={inputStyle} value={formState.address} onChange={(e) => handleChange("address", e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>City *</label>
                      <input className="form-control" style={inputStyle} value={formState.city} onChange={(e) => handleChange("city", e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Country *</label>
                      <input className="form-control" style={inputStyle} value={formState.country} onChange={(e) => handleChange("country", e.target.value)} required />
                    </div>
                    <div className="col-12">
                      <label style={labelStyle}>Profile Picture</label>
                      <input type="file" accept="image/*" className="form-control" style={inputStyle} onChange={(e) => setProfilePicture(e.target.files?.[0] || null)} />
                    </div>
                  </div>
                </div>
                )}

                {currentStep === 2 && (
                <div style={sectionCardStyle}>
                  <div style={stepTitleStyle}>Second Identification Section</div>

                  <label style={{ ...labelStyle, marginBottom: "12px" }}>Choose one: Somaliland National ID or Enter Code *</label>
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
                        }}
                      />
                      Enter Code
                    </label>
                  </div>

                  <div className="row g-3" style={{ marginBottom: "14px" }}>
                    <div className="col-md-6">
                      <label style={labelStyle}>Somaliland National ID Upload</label>
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
                        Enter Code *
                        <button
                          type="button"
                          onClick={openCodesExcel}
                          style={{
                            width: "26px",
                            height: "26px",
                            borderRadius: "999px",
                            border: "1px solid #006d21",
                            background: "#ffffff",
                            color: "#006d21",
                            fontWeight: 800,
                            fontSize: "1rem",
                            lineHeight: 1,
                            cursor: "pointer",
                          }}
                          aria-label="Click here to get code"
                          title="Click here to get code"
                        >
                          ?
                        </button>
                        <button
                          type="button"
                          onClick={openCodesExcel}
                          style={{
                            border: "none",
                            background: "transparent",
                            color: "#006d21",
                            textDecoration: "underline",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "1.05rem",
                          }}
                        >
                          Click here to get code
                        </button>
                      </label>
                      <input
                        className="form-control"
                        style={inputStyle}
                        value={formState.nationalIdCode}
                        disabled={idMethod !== "code"}
                        onChange={(e) => handleChange("nationalIdCode", e.target.value)}
                        placeholder="Select code from list"
                        readOnly={idMethod === "code"}
                      />
                      {idMethod === "code" && !isSelectedCodeValid && formState.nationalIdCode.trim() && (
                        <small style={{ color: "#b91c1c", fontSize: "1.05rem" }}>
                          Please choose a valid code from the list.
                        </small>
                      )}
                    </div>
                  </div>

                  {idMethod === "code" && (
                    <div
                      style={{
                        border: "1px solid #d4e4da",
                        borderRadius: "12px",
                        background: "#ffffff",
                        padding: "14px",
                        marginBottom: "20px",
                      }}
                    >
                      <label style={labelStyle}>Choose official code from list</label>
                      <div className="row g-2">
                        <div className="col-md-9">
                          <select
                            className="form-control"
                            style={inputStyle}
                            value={formState.nationalIdCode}
                            onChange={(e) => handleChange("nationalIdCode", e.target.value)}
                          >
                            <option value="">
                              {isLoadingCodes ? "Loading codes..." : "Select a valid code"}
                            </option>
                            {sharedCodes.map((item) => (
                              <option key={item.code} value={item.code}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <button
                            type="button"
                            onClick={loadSharedCodes}
                            style={{
                              width: "100%",
                              minHeight: "64px",
                              border: "1px solid #006d21",
                              background: "#ffffff",
                              color: "#006d21",
                              borderRadius: "12px",
                              fontWeight: 700,
                              fontSize: "1.2rem",
                              cursor: "pointer",
                            }}
                          >
                            Refresh
                          </button>
                        </div>
                      </div>
                      <small style={{ color: "#475569", fontSize: "1rem", display: "block", marginTop: "8px" }}>
                        Only official listed codes are accepted. Sample or manual codes are blocked.
                      </small>
                    </div>
                  )}

                  <label style={{ ...labelStyle, marginBottom: "12px" }}>
                    International Document *
                  </label>
                  <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", marginBottom: "16px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.2rem", color: "#1f2937" }}>
                      <input
                        type="radio"
                        name="secondaryDocMethod"
                        checked={formState.secondaryDocumentType === "passport"}
                        onChange={() => setSecondaryDocumentType("passport")}
                      />
                      Upload Passport
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1.2rem", color: "#1f2937" }}>
                      <input
                        type="radio"
                        name="secondaryDocMethod"
                        checked={formState.secondaryDocumentType === "driving_license"}
                        onChange={() => setSecondaryDocumentType("driving_license")}
                      />
                      Upload Driving Licence
                    </label>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label style={labelStyle}>Passport Upload</label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="form-control"
                        style={inputStyle}
                        disabled={formState.secondaryDocumentType !== "passport"}
                        required={formState.secondaryDocumentType === "passport"}
                        onChange={(e) => {
                          if (formState.secondaryDocumentType !== "passport") return;
                          setSecondaryDocument(e.target.files?.[0] || null);
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Driving Licence Upload</label>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="form-control"
                        style={inputStyle}
                        disabled={formState.secondaryDocumentType !== "driving_license"}
                        required={formState.secondaryDocumentType === "driving_license"}
                        onChange={(e) => {
                          if (formState.secondaryDocumentType !== "driving_license") return;
                          setSecondaryDocument(e.target.files?.[0] || null);
                        }}
                      />
                    </div>
                  </div>
                </div>
                )}

                {currentStep === 3 && (
                <div style={sectionCardStyle}>
                  <div style={stepTitleStyle}>Third Password & Message Section</div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label style={labelStyle}>Password (System Login) *</label>
                      <input type="password" className="form-control" style={inputStyle} value={formState.password} onChange={(e) => handleChange("password", e.target.value)} required minLength={6} />
                    </div>
                    <div className="col-md-6">
                      <label style={labelStyle}>Confirm Password *</label>
                      <input type="password" className="form-control" style={inputStyle} value={formState.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} required minLength={6} />
                      {formState.confirmPassword && !passwordsMatch && (
                        <small style={{ color: "#b91c1c", fontSize: "1.1rem" }}>Passwords do not match.</small>
                      )}
                    </div>
                    <div className="col-12">
                      <label style={labelStyle}>Write small your BIO *</label>
                      <textarea
                        className="form-control"
                        style={{ ...inputStyle, minHeight: "132px", paddingTop: "12px", paddingBottom: "12px" }}
                        rows={4}
                        value={formState.additionalNotes}
                        onChange={(e) => handleChange("additionalNotes", e.target.value)}
                        placeholder="Write a short bio..."
                        required
                      />
                    </div>
                  </div>
                </div>
                )}

                {errorMessage && (
                <div style={{ marginTop: "16px", borderRadius: "12px", border: "1px solid #f5d5d5", background: "#fef2f2", color: "#991b1b", padding: "12px 14px", fontSize: "1.2rem" }}>
                  ⚠️ {errorMessage}
                </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
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
                Registration Submitted
              </h3>
              <p style={{ marginBottom: "12px", color: "#1f2937", lineHeight: "1.6", fontSize: "1.2rem" }}>
                Your account is now <strong>pending</strong> and awaits admin approval.
              </p>
              <p style={{ marginBottom: "20px", color: "#5a6b76", fontSize: "1.15rem", lineHeight: "1.6" }}>
                Once approved, you can login and access your member dashboard to view your profile and other members.
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
    </>
  );
}

export default MemberRegistrationModal;
