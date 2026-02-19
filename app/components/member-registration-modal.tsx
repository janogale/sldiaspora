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
    fontWeight: 700,
    fontSize: "0.86rem",
    color: "#1f2937",
    marginBottom: "6px",
  } as const;

  const inputStyle = {
    border: "1px solid #cfe0d5",
    borderRadius: "10px",
    minHeight: "44px",
    boxShadow: "none",
    fontSize: "0.94rem",
  } as const;

  const sectionCardStyle = {
    border: "1px solid #deebe2",
    borderRadius: "12px",
    padding: "14px",
    background: "#fbfefc",
  } as const;

  return (
    <>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.55)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "18px",
          }}
          onClick={closeModal}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "760px",
              maxHeight: "92vh",
              overflow: "auto",
              background: "#ffffff",
              borderRadius: "18px",
              border: "1px solid #dbe8df",
              boxShadow: "0 26px 60px rgba(0, 0, 0, 0.28)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              style={{
                padding: "20px 22px 16px",
                borderBottom: "1px solid #edf2ef",
                background: "linear-gradient(180deg, #f0f8f3 0%, #ffffff 100%)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "inline-block",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      color: "#006d21",
                      background: "#eaf6ee",
                      border: "1px solid #cfe5d5",
                      borderRadius: "999px",
                      padding: "5px 11px",
                      marginBottom: "10px",
                    }}
                  >
                    SOMALILAND DIASPORA
                  </div>
                  <h4 style={{ margin: 0, color: "#0f172a", fontWeight: 800, fontSize: "1.35rem" }}>
                    Member Registration
                  </h4>
                  <p style={{ margin: "7px 0 0", color: "#4b5563", fontSize: "0.95rem" }}>
                    Complete your profile to join the official Somaliland Diaspora members network.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    border: "1px solid #d5e4da",
                    background: "#fff",
                    borderRadius: "10px",
                    width: "34px",
                    height: "34px",
                    cursor: "pointer",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "18px 22px 22px" }}>
              <div
                style={{
                  border: "1px solid #d3e7da",
                  background: "linear-gradient(180deg, #f7fcf9 0%, #f2f9f5 100%)",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  marginBottom: "16px",
                  color: "#0f5132",
                  fontSize: "0.92rem",
                }}
              >
                Use one verification option only: <strong>Upload National ID photo</strong> or <strong>enter shared code</strong>.
              </div>

              <div className="row g-3">
                <div className="col-12">
                  <div style={sectionCardStyle}>
                    <div style={{ fontWeight: 800, color: "#0f172a", marginBottom: "12px" }}>Personal Information</div>
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
                    <div style={{ fontWeight: 800, color: "#0f172a", marginBottom: "12px" }}>
                      Identity Verification (Choose One)
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
                    marginTop: "12px",
                    borderRadius: "10px",
                    border: "1px solid #f4c8c8",
                    background: "#fff5f5",
                    color: "#991b1b",
                    padding: "10px 12px",
                    fontSize: "0.94rem",
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "18px" }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    border: "1px solid #cadacc",
                    background: "#ffffff",
                    color: "#0f172a",
                    borderRadius: "10px",
                    padding: "10px 16px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !canSubmit}
                  style={{
                    border: "none",
                    background: isSubmitting || !canSubmit ? "#89b99a" : "#006d21",
                    color: "#ffffff",
                    borderRadius: "10px",
                    padding: "10px 18px",
                    fontWeight: 700,
                    cursor: isSubmitting || !canSubmit ? "not-allowed" : "pointer",
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
            background: "rgba(0, 0, 0, 0.55)",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "18px",
          }}
          onClick={() => setShowSuccess(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "560px",
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #d8e7dc",
              boxShadow: "0 24px 52px rgba(0, 0, 0, 0.26)",
              padding: "22px",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <h4 style={{ marginBottom: "8px", color: "#006d21", fontWeight: 700 }}>
              Registration Received
            </h4>
            <p style={{ marginBottom: "8px", color: "#1f2937" }}>
              Please wait while we review your data.
            </p>
            <p style={{ marginBottom: "16px", color: "#4b5563" }}>
              Verification usually takes about 2 to 3 business days. Your member status is now
              pending until admin approval in Directus.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowSuccess(false)}
                style={{
                  border: "none",
                  background: "#006d21",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "9px 16px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MemberRegistrationModal;
