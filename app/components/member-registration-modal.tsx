"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type RegisterFormState = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  country: string;
  profession: string;
  nationalIdCode: string;
  additionalNotes: string;
};

const defaultFormState: RegisterFormState = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  country: "",
  profession: "",
  nationalIdCode: "",
  additionalNotes: "",
};

const DIRECTUS_REGISTER_LINK = "https://admin.sldiaspora.org/admin/register";

function MemberRegistrationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formState, setFormState] = useState<RegisterFormState>(defaultFormState);
  const [nationalIdPhoto, setNationalIdPhoto] = useState<File | null>(null);
  const hasIdCode = formState.nationalIdCode.trim().length > 0;
  const hasIdPhoto = !!nationalIdPhoto;

  const canSubmit = useMemo(() => {
    return (
      formState.fullName.trim().length > 1 &&
      formState.phone.trim().length > 5 &&
      formState.address.trim().length > 4 &&
      (hasIdPhoto || hasIdCode) &&
      hasIdPhoto !== hasIdCode
    );
  }, [formState, hasIdCode, hasIdPhoto]);

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

  const handleChange = (
    key: keyof RegisterFormState,
    value: string
  ) => {
    if (key === "nationalIdCode" && value.trim().length > 0 && nationalIdPhoto) {
      setNationalIdPhoto(null);
    }
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhotoChange = (file: File | null) => {
    if (file) {
      setFormState((prev) => ({ ...prev, nationalIdCode: "" }));
    }
    setNationalIdPhoto(file);
  };

  const resetForm = () => {
    setFormState(defaultFormState);
    setNationalIdPhoto(null);
    setErrorMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      setErrorMessage(
        "Please complete required fields and choose only one verification method: upload ID photo or enter shared code."
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
      payload.append("country", formState.country.trim());
      payload.append("profession", formState.profession.trim());
      payload.append("nationalIdCode", formState.nationalIdCode.trim());
      payload.append("additionalNotes", formState.additionalNotes.trim());

      if (nationalIdPhoto) {
        payload.append("nationalIdPhoto", nationalIdPhoto);
      }

      const response = await fetch("/api/member-register", {
        method: "POST",
        body: payload,
      });

      const result = await response.json();

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
              maxWidth: "700px",
              maxHeight: "90vh",
              overflow: "auto",
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #d4e4da",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 107, 33, 0.1)",
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
                  <div
                    style={{
                      display: "inline-block",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: "#006d21",
                      background: "#e6f3ea",
                      border: "1px solid #c8dfd2",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      marginBottom: "12px",
                    }}
                  >
                    SOMALILAND DIASPORA NETWORK
                  </div>
                  <h3 style={{ margin: "0 0 8px 0", color: "#0f172a", fontWeight: 700, fontSize: "1.5rem" }}>
                    Member Registration
                  </h3>
                  <p style={{ margin: "0", color: "#5a6b76", fontSize: "0.94rem", lineHeight: "1.5" }}>
                    Join the official Somaliland Diaspora community and connect with members worldwide.
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
                    flexShrink: 0,
                    padding: "0",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#006d21")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
              <div
                style={{
                  border: "1px solid #d1e8da",
                  background: "linear-gradient(135deg, #f0faf5 0%, #e8f7f1 100%)",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  marginBottom: "20px",
                  color: "#0f5132",
                  fontSize: "0.92rem",
                  lineHeight: "1.5",
                }}
              >
                <strong>Verification Method:</strong> Choose one option only — <strong>Upload National ID photo</strong> or <strong>enter shared code</strong>.
              </div>

              <div className="row g-4">
                <div className="col-12">
                  <div style={sectionCardStyle}>
                    <div style={{ fontWeight: 700, color: "#006d21", marginBottom: "16px", fontSize: "0.95rem", letterSpacing: "0.5px", textTransform: "uppercase" }}>📋 Personal Information</div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label" style={labelStyle}>Full Name *</label>
                        <input
                          className="form-control"
                          style={inputStyle}
                          value={formState.fullName}
                          onChange={(event) => handleChange("fullName", event.target.value)}
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label" style={labelStyle}>Phone *</label>
                        <input
                          className="form-control"
                          style={inputStyle}
                          value={formState.phone}
                          onChange={(event) => handleChange("phone", event.target.value)}
                          placeholder="e.g. +252..."
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label" style={labelStyle}>Email (Optional)</label>
                        <input
                          type="email"
                          className="form-control"
                          style={inputStyle}
                          value={formState.email}
                          onChange={(event) => handleChange("email", event.target.value)}
                          placeholder="name@email.com"
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label" style={labelStyle}>Country</label>
                        <input
                          className="form-control"
                          style={inputStyle}
                          value={formState.country}
                          onChange={(event) => handleChange("country", event.target.value)}
                          placeholder="Country"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label" style={labelStyle}>Address *</label>
                        <input
                          className="form-control"
                          style={inputStyle}
                          value={formState.address}
                          onChange={(event) => handleChange("address", event.target.value)}
                          placeholder="Residential address"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label" style={labelStyle}>Profession</label>
                        <input
                          className="form-control"
                          style={inputStyle}
                          value={formState.profession}
                          onChange={(event) => handleChange("profession", event.target.value)}
                          placeholder="Your profession"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div style={sectionCardStyle}>
                    <div style={{ fontWeight: 700, color: "#006d21", marginBottom: "16px", fontSize: "0.95rem", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                      🔐 Identity Verification
                    </div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label" style={labelStyle}>
                          Upload National ID Photo
                        </label>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="form-control"
                          style={inputStyle}
                          disabled={hasIdCode}
                          onChange={(event) => handlePhotoChange(event.target.files?.[0] || null)}
                        />
                        <small style={{ color: "#6b7280", display: "inline-block", marginTop: "6px" }}>
                          {hasIdCode
                            ? "Disabled because shared code is entered."
                            : nationalIdPhoto
                              ? `Selected: ${nationalIdPhoto.name}`
                              : "Accepted: JPG, PNG, PDF"}
                        </small>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label" style={labelStyle}>
                          Shared Code (if no ID photo)
                        </label>
                        <input
                          className="form-control"
                          style={inputStyle}
                          value={formState.nationalIdCode}
                          disabled={hasIdPhoto}
                          onChange={(event) => handleChange("nationalIdCode", event.target.value)}
                          placeholder="Enter invitation/shared code"
                        />
                        <small style={{ color: "#6b7280", display: "inline-block", marginTop: "6px" }}>
                          {hasIdPhoto
                            ? "Disabled because ID photo is uploaded."
                            : "Use this only when you do not upload an ID photo."}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <label className="form-label" style={labelStyle}>Additional Information</label>
                  <textarea
                    className="form-control"
                    style={{ ...inputStyle, minHeight: "96px" }}
                    rows={3}
                    value={formState.additionalNotes}
                    onChange={(event) => handleChange("additionalNotes", event.target.value)}
                    placeholder="Any details you want admin to review"
                  />
                </div>
              </div>

              {errorMessage && (
                <div
                  style={{
                    marginTop: "16px",
                    marginBottom: "8px",
                    borderRadius: "10px",
                    border: "1px solid #f5d5d5",
                    background: "#fef2f2",
                    color: "#991b1b",
                    padding: "12px 14px",
                    fontSize: "0.92rem",
                    lineHeight: "1.5",
                  }}
                >
                  ⚠️ {errorMessage}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    border: "1.5px solid #d4e4da",
                    background: "#ffffff",
                    color: "#1f2937",
                    borderRadius: "8px",
                    padding: "10px 18px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.94rem",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f8fdfb";
                    e.currentTarget.style.borderColor = "#c8dfd2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.borderColor = "#d4e4da";
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !canSubmit}
                  style={{
                    border: "none",
                    background: isSubmitting || !canSubmit ? "#a8c9b5" : "#006d21",
                    color: "#ffffff",
                    borderRadius: "8px",
                    padding: "10px 20px",
                    fontWeight: 600,
                    cursor: isSubmitting || !canSubmit ? "not-allowed" : "pointer",
                    fontSize: "0.94rem",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting && canSubmit) {
                      e.currentTarget.style.background = "#005a1a";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting && canSubmit) {
                      e.currentTarget.style.background = "#006d21";
                    }
                  }}
                >
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
            backdropFilter: "blur(2px)",
          }}
          onClick={() => setShowSuccess(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "480px",
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #d4e4da",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 107, 33, 0.1)",
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
                Thank you for joining the Somaliland Diaspora network!
              </p>
              <p style={{ marginBottom: "20px", color: "#5a6b76", fontSize: "0.92rem", lineHeight: "1.6" }}>
                Our team will review your information within 2-3 days. You&#39;ll receive a notification once your membership is approved.
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
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#005a1a")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#006d21")}
              >
                Got it, thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MemberRegistrationModal;
