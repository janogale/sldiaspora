"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type InterestOption =
  | ""
  | "charity"
  | "networking"
  | "community_building"
  | "skills_knowledge_transfer"
  | "advocacy"
  | "other";

type SecondaryDocumentType = "passport" | "driving_license" | "";

type RegisterFormState = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  password: string;
  confirmPassword: string;

  profession: string;
  countryOfNationality: string;
  areasOfInterest: InterestOption;
  areasOfInterestOther: string;
  shareContactPreference: "none" | "email" | "phone";

  nationalIdCode: string;
  secondaryDocumentType: SecondaryDocumentType;
  additionalNotes: string;
};

const defaultFormState: RegisterFormState = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  country: "",
  password: "",
  confirmPassword: "",

  profession: "",
  countryOfNationality: "",
  areasOfInterest: "",
  areasOfInterestOther: "",
  shareContactPreference: "none",

  nationalIdCode: "",
  secondaryDocumentType: "",
  additionalNotes: "",
};

const DIRECTUS_REGISTER_LINK = "https://admin.sldiaspora.org/admin/register";

function MemberRegistrationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formState, setFormState] = useState<RegisterFormState>(defaultFormState);

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [nationalIdPhoto, setNationalIdPhoto] = useState<File | null>(null);
  const [secondaryDocument, setSecondaryDocument] = useState<File | null>(null);

  const hasIdCode = formState.nationalIdCode.trim().length > 0;
  const hasIdPhoto = !!nationalIdPhoto;

  const passwordsMatch =
    formState.password.length >= 6 && formState.password === formState.confirmPassword;

  const canSubmit = useMemo(() => {
    const hasRequiredBasics =
      formState.fullName.trim().length > 1 &&
      formState.phone.trim().length > 5 &&
      formState.email.trim().length > 3 &&
      formState.address.trim().length > 3 &&
      formState.city.trim().length > 1 &&
      formState.country.trim().length > 1;

    const hasOneIdMethod = (hasIdPhoto || hasIdCode) && hasIdPhoto !== hasIdCode;

    const hasSecondaryDoc =
      !!secondaryDocument &&
      (formState.secondaryDocumentType === "passport" ||
        formState.secondaryDocumentType === "driving_license");

    const hasOtherInterestText =
      formState.areasOfInterest !== "other" ||
      formState.areasOfInterestOther.trim().length > 1;

    return (
      hasRequiredBasics &&
      passwordsMatch &&
      hasOneIdMethod &&
      hasSecondaryDoc &&
      hasOtherInterestText
    );
  }, [formState, hasIdCode, hasIdPhoto, passwordsMatch, secondaryDocument]);

  const openModal = () => {
    setErrorMessage("");
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
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

  const handleChange = (key: keyof RegisterFormState, value: string) => {
    if (key === "nationalIdCode" && value.trim().length > 0 && nationalIdPhoto) {
      setNationalIdPhoto(null);
    }

    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setFormState(defaultFormState);
    setProfilePicture(null);
    setNationalIdPhoto(null);
    setSecondaryDocument(null);
    setErrorMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      setErrorMessage(
        "Please complete required fields, choose one ID verification method, and upload passport or driving licence."
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

      payload.append("profession", formState.profession.trim());
      payload.append("countryOfNationality", formState.countryOfNationality.trim());

      const interestValue =
        formState.areasOfInterest === "other"
          ? `other:${formState.areasOfInterestOther.trim()}`
          : formState.areasOfInterest;
      payload.append("areasOfInterest", interestValue);
      payload.append("shareContactPreference", formState.shareContactPreference);

      payload.append("nationalIdCode", formState.nationalIdCode.trim());
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
    fontSize: "0.875rem",
    color: "#1f2937",
    marginBottom: "8px",
    display: "block",
    letterSpacing: "0.3px",
  } as const;

  const inputStyle = {
    border: "1.5px solid #d4e4da",
    borderRadius: "8px",
    minHeight: "42px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
    fontSize: "0.94rem",
    paddingLeft: "12px",
    paddingRight: "12px",
    transition: "all 0.2s ease",
  } as const;

  const sectionCardStyle = {
    border: "1px solid #d4e4da",
    borderRadius: "12px",
    padding: "16px",
    background: "linear-gradient(135deg, #f8fdfb 0%, #f2faf6 100%)",
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
              maxWidth: "760px",
              maxHeight: "90vh",
              overflow: "auto",
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #d4e4da",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              style={{
                padding: "24px",
                borderBottom: "1px solid #e0ebe5",
                background: "linear-gradient(135deg, #f0f9f4 0%, #ffffff 100%)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 8px 0", color: "#0f172a", fontWeight: 700, fontSize: "1.5rem" }}>
                    Member Registration
                  </h3>
                  <p style={{ margin: 0, color: "#5a6b76", fontSize: "0.94rem", lineHeight: "1.5" }}>
                    Default status is <strong>pending</strong>. You can login after admin approval.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#9ca3af",
                    fontSize: "24px",
                    cursor: "pointer",
                    fontWeight: 300,
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
              <div className="row g-4">
                <div className="col-12">
                  <div style={sectionCardStyle}>
                    <div style={{ fontWeight: 700, color: "#006d21", marginBottom: "16px", fontSize: "0.95rem", textTransform: "uppercase" }}>
                      Personal Details
                    </div>
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
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div style={sectionCardStyle}>
                    <div style={{ fontWeight: 700, color: "#006d21", marginBottom: "16px", fontSize: "0.95rem", textTransform: "uppercase" }}>
                      Login Credentials
                    </div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label style={labelStyle}>Password *</label>
                        <input type="password" className="form-control" style={inputStyle} value={formState.password} onChange={(e) => handleChange("password", e.target.value)} required minLength={6} />
                      </div>
                      <div className="col-md-6">
                        <label style={labelStyle}>Confirm Password *</label>
                        <input type="password" className="form-control" style={inputStyle} value={formState.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} required minLength={6} />
                        {formState.confirmPassword && !passwordsMatch && (
                          <small style={{ color: "#b91c1c" }}>Passwords do not match.</small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div style={sectionCardStyle}>
                    <div style={{ fontWeight: 700, color: "#006d21", marginBottom: "16px", fontSize: "0.95rem", textTransform: "uppercase" }}>
                      Profile (Optional except Name/Country/City)
                    </div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label style={labelStyle}>Profile Picture (Optional)</label>
                        <input type="file" accept="image/*" className="form-control" style={inputStyle} onChange={(e) => setProfilePicture(e.target.files?.[0] || null)} />
                      </div>
                      <div className="col-md-6">
                        <label style={labelStyle}>Profession (Optional)</label>
                        <input className="form-control" style={inputStyle} value={formState.profession} onChange={(e) => handleChange("profession", e.target.value)} />
                      </div>
                      <div className="col-md-6">
                        <label style={labelStyle}>Country of Nationality (Optional)</label>
                        <input className="form-control" style={inputStyle} value={formState.countryOfNationality} onChange={(e) => handleChange("countryOfNationality", e.target.value)} />
                      </div>
                      <div className="col-md-6">
                        <label style={labelStyle}>Area of Interest (Optional)</label>
                        <select className="form-control" style={inputStyle} value={formState.areasOfInterest} onChange={(e) => handleChange("areasOfInterest", e.target.value)}>
                          <option value="">Select area</option>
                          <option value="charity">Charity</option>
                          <option value="networking">Networking</option>
                          <option value="community_building">Community Building</option>
                          <option value="skills_knowledge_transfer">Skills &amp; Knowledge Transfer</option>
                          <option value="advocacy">Advocacy</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      {formState.areasOfInterest === "other" && (
                        <div className="col-md-6">
                          <label style={labelStyle}>Other Interest *</label>
                          <input className="form-control" style={inputStyle} value={formState.areasOfInterestOther} onChange={(e) => handleChange("areasOfInterestOther", e.target.value)} />
                        </div>
                      )}

                      <div className="col-md-6">
                        <label style={labelStyle}>Share contact when connecting</label>
                        <select className="form-control" style={inputStyle} value={formState.shareContactPreference} onChange={(e) => handleChange("shareContactPreference", e.target.value)}>
                          <option value="none">Don&apos;t share by default</option>
                          <option value="email">Share email</option>
                          <option value="phone">Share phone</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div style={sectionCardStyle}>
                    <div style={{ fontWeight: 700, color: "#006d21", marginBottom: "16px", fontSize: "0.95rem", textTransform: "uppercase" }}>
                      Verification Documents
                    </div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label style={labelStyle}>National ID Photo (choose this OR code)</label>
                        <input type="file" accept="image/*,.pdf" className="form-control" style={inputStyle} disabled={hasIdCode} onChange={(e) => setNationalIdPhoto(e.target.files?.[0] || null)} />
                      </div>
                      <div className="col-md-6">
                        <label style={labelStyle}>Shared Code (choose this OR ID photo)</label>
                        <input className="form-control" style={inputStyle} value={formState.nationalIdCode} disabled={hasIdPhoto} onChange={(e) => handleChange("nationalIdCode", e.target.value)} />
                      </div>

                      <div className="col-md-6">
                        <label style={labelStyle}>Secondary Document Type *</label>
                        <select className="form-control" style={inputStyle} value={formState.secondaryDocumentType} onChange={(e) => handleChange("secondaryDocumentType", e.target.value)} required>
                          <option value="">Select one</option>
                          <option value="passport">Passport</option>
                          <option value="driving_license">Driving Licence</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label style={labelStyle}>Upload Passport or Driving Licence *</label>
                        <input type="file" accept="image/*,.pdf" className="form-control" style={inputStyle} onChange={(e) => setSecondaryDocument(e.target.files?.[0] || null)} required />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <label style={labelStyle}>Additional Notes (Optional)</label>
                  <textarea className="form-control" style={{ ...inputStyle, minHeight: "96px" }} rows={3} value={formState.additionalNotes} onChange={(e) => handleChange("additionalNotes", e.target.value)} />
                </div>
              </div>

              {errorMessage && (
                <div style={{ marginTop: "16px", borderRadius: "10px", border: "1px solid #f5d5d5", background: "#fef2f2", color: "#991b1b", padding: "12px 14px", fontSize: "0.92rem" }}>
                  ⚠️ {errorMessage}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                <button type="button" onClick={closeModal} style={{ border: "1.5px solid #d4e4da", background: "#ffffff", color: "#1f2937", borderRadius: "8px", padding: "10px 18px", fontWeight: 600, cursor: "pointer", fontSize: "0.94rem" }}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting || !canSubmit} style={{ border: "none", background: isSubmitting || !canSubmit ? "#a8c9b5" : "#006d21", color: "#ffffff", borderRadius: "8px", padding: "10px 20px", fontWeight: 600, cursor: isSubmitting || !canSubmit ? "not-allowed" : "pointer", fontSize: "0.94rem" }}>
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </button>
              </div>
            </form>
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
              <h3 style={{ marginBottom: "8px", color: "#006d21", fontWeight: 700, fontSize: "1.25rem" }}>
                Registration Submitted
              </h3>
              <p style={{ marginBottom: "12px", color: "#1f2937", lineHeight: "1.6" }}>
                Your account is now <strong>pending</strong> and awaits admin approval.
              </p>
              <p style={{ marginBottom: "20px", color: "#5a6b76", fontSize: "0.92rem", lineHeight: "1.6" }}>
                Once approved, you can login and access your member dashboard to view your profile and other members.
              </p>
              <button
                type="button"
                onClick={() => setShowSuccess(false)}
                style={{
                  border: "none",
                  background: "#006d21",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.94rem",
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
