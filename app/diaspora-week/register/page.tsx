"use client";

import { FormEvent, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Building2, CalendarDays, CheckCircle2, User } from "lucide-react";
import styles from "./page.module.css";

type RegistrationType = "individual" | "business";

export default function DiasporaWeekRegisterPage() {
  const [registrationType, setRegistrationType] = useState<RegistrationType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [idDocType, setIdDocType] = useState<"passport" | "licence" | null>(null);
  const [idDocPreview, setIdDocPreview] = useState<string | null>(null);
  const [idDocFileName, setIdDocFileName] = useState<string | null>(null);
  const [idDocIsImage, setIdDocIsImage] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setLogoPreview(null);
      return;
    }
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleIdDocChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setIdDocPreview(null);
      setIdDocFileName(null);
      return;
    }
    setIdDocFileName(file.name);
    setIdDocIsImage(file.type.startsWith("image/"));
    setIdDocPreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!registrationType) return;

    setError("");
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      formData.set("registrationType", registrationType);

      const response = await fetch("/api/diaspora-week/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setError(result?.message || "Registration failed. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Unable to submit registration right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.registerPage}>
      <section className={styles.registerSection}>
        <div className={`container ${styles.registerContainer}`}>
          <div className={styles.backButtonWrap}>
            <Link href="/diaspora-week" className={styles.backButton}>
              <i className="fa-regular fa-arrow-left" aria-hidden="true"></i>
              Back to Diaspora Week
            </Link>
          </div>

          <div className={styles.registerShell}>
            {/* ── left: image only ── */}
            <div className={styles.brandPanel}>
              <div className={styles.brandPanelImg} aria-hidden="true" />
            </div>

            <div className={styles.formCard}>
              {submitted ? (
                <div className={styles.successState}>
                  <span className={styles.successIcon}>
                    <CheckCircle2 size={40} />
                  </span>
                  <h1 className={styles.title}>Registration Received</h1>
                  <p className={styles.subtitle}>
                    Thank you for registering for Somaliland Diaspora Week. Your registration is
                    now <strong>pending review</strong>. Once approved, we&apos;ll send an access
                    code to your email so you can sign in to the Event Portal and view the full
                    schedule, exhibitors, partners and gallery.
                  </p>
                  <div className={styles.successActions}>
                    <Link href="/diaspora-week" className={styles.secondaryButton}>
                      Back to Diaspora Week
                    </Link>
                    <Link href="/diaspora-week/portal" className={styles.primaryButton}>
                      Go to Event Portal
                    </Link>
                  </div>
                </div>
              ) : !registrationType ? (
                <>
                  <h1 className={styles.title}>How would you like to participate?</h1>
                  <p className={styles.subtitle}>
                    Select the option that matches your role at Diaspora Week 2026.
                  </p>

                  <div className={styles.typeGrid}>
                    <button
                      type="button"
                      className={styles.typeCard}
                      onClick={() => setRegistrationType("individual")}
                    >
                      <span className={styles.typeIcon}>
                        <User size={28} />
                      </span>
                      <h3>Individual Attendee</h3>
                      <p>
                        Diaspora member, professional, student or community participant
                        attending sessions, panels and cultural events.
                      </p>
                      <span className={styles.typeCta}>
                        Register as Individual
                        <i className="fa-regular fa-arrow-right" aria-hidden="true"></i>
                      </span>
                    </button>

                    <button
                      type="button"
                      className={`${styles.typeCard} ${styles.typeCardBiz}`}
                      onClick={() => setRegistrationType("business")}
                    >
                      <span className={`${styles.typeIcon} ${styles.typeIconBiz}`}>
                        <Building2 size={28} />
                      </span>
                      <h3>Business / Exhibitor</h3>
                      <p>
                        Diaspora-founded business, NGO or organization seeking a booth to
                        showcase products, services or development initiatives.
                      </p>
                      <span className={`${styles.typeCta} ${styles.typeCtaBiz}`}>
                        Register as Business
                        <i className="fa-regular fa-arrow-right" aria-hidden="true"></i>
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.formHeader}>
                    <div>
                      <button
                        type="button"
                        className={styles.changeTypeButton}
                        onClick={() => { setRegistrationType(null); setError(""); }}
                      >
                        <i className="fa-regular fa-arrow-left" aria-hidden="true"></i>
                        Change participation type
                      </button>
                      <h1 className={styles.title}>
                        {registrationType === "individual" ? "Individual Registration" : "Business / Exhibitor Registration"}
                      </h1>
                      <p className={styles.subtitle}>
                        {registrationType === "individual"
                          ? "Fill in your details below. Our team will review within 48 hours."
                          : "Complete your business details. Once approved, your logo appears in the Showcase."}
                      </p>
                    </div>

                  </div>

                  <form ref={formRef} onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
                    {registrationType === "individual" ? (
                      /* ── INDIVIDUAL FORM — 2-col compact ── */
                      <div className={styles.indivGrid}>

                        {/* LEFT — Personal Details */}
                        <div className={styles.indivBlock}>
                          <div className={styles.formBlockHeader}>
                            <span className={styles.formBlockBadge}><i className="fa-regular fa-user" aria-hidden="true"></i></span>
                            <span className={styles.formBlockLabel}>Personal Details</span>
                          </div>

                          <div className={styles.fieldGroup}>
                            <label htmlFor="fullName" className={styles.label}>Full Name *</label>
                            <input id="fullName" name="fullName" type="text" className={`form-control ${styles.input}`} placeholder="Your full legal name" required />
                          </div>

                          <div className={styles.fieldRow}>
                            <div className={styles.fieldGroup}>
                              <label htmlFor="phone" className={styles.label}>Phone *</label>
                              <input id="phone" name="phone" type="tel" className={`form-control ${styles.input}`} placeholder="+252 ..." required />
                            </div>
                            <div className={styles.fieldGroup}>
                              <label htmlFor="country" className={styles.label}>Country *</label>
                              <input id="country" name="country" type="text" className={`form-control ${styles.input}`} placeholder="Country of residence" required />
                            </div>
                          </div>

                          <div className={styles.fieldRow}>
                            <div className={styles.fieldGroup}>
                              <label htmlFor="email" className={styles.label}>Email *</label>
                              <input id="email" name="email" type="email" className={`form-control ${styles.input}`} placeholder="you@example.com" required />
                            </div>
                            <div className={styles.fieldGroup}>
                              <label htmlFor="address" className={styles.label}>Address *</label>
                              <input id="address" name="address" type="text" className={`form-control ${styles.input}`} placeholder="Street / district" required />
                            </div>
                          </div>

                          {/* Event city checkboxes */}
                          <div className={styles.fieldGroup}>
                            <label className={styles.label}>Which city will you attend? *</label>
                            <div className={styles.cityChecklist}>
                              {["Hargeisa", "Burco", "Boorama"].map((city) => (
                                <label key={city} className={styles.cityCheckItem}>
                                  <input type="checkbox" name="eventLocation" value={city} className={styles.cityCheckbox} />
                                  <span className={styles.cityCheckMark} />
                                  {city}
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* RIGHT — Identity Document */}
                        <div className={styles.indivBlock}>
                          <div className={styles.formBlockHeader}>
                            <span className={styles.formBlockBadge}><i className="fa-regular fa-id-badge" aria-hidden="true"></i></span>
                            <span className={styles.formBlockLabel}>Identity Document</span>
                          </div>

                          {/* doc type toggle */}
                          <div className={styles.fieldGroup}>
                            <label className={styles.label}>Document Type *</label>
                            <div className={styles.docToggle}>
                              {(["passport", "licence"] as const).map((type) => (
                                <label key={type} className={`${styles.docToggleBtn} ${idDocType === type ? styles.docToggleBtnActive : ""}`}>
                                  <input type="radio" name="idDocumentType" value={type}
                                    checked={idDocType === type}
                                    onChange={() => { setIdDocType(type); setIdDocPreview(null); setIdDocFileName(null); }}
                                    className={styles.idDocRadio} />
                                  <i className={`fa-regular ${type === "passport" ? "fa-passport" : "fa-id-card"}`} aria-hidden="true"></i>
                                  {type === "passport" ? "Passport" : "Driving Licence"}
                                </label>
                              ))}
                            </div>
                          </div>

                          {idDocType && (
                            <div className={styles.fieldGroup}>
                              <label htmlFor="idDocFile" className={styles.label}>
                                Upload {idDocType === "passport" ? "Passport" : "Licence"} *
                              </label>

                              {idDocFileName && (
                                <div className={styles.logoPreviewWrap}>
                                  {idDocIsImage && idDocPreview
                                    ? <img src={idDocPreview} alt="Preview" className={styles.logoPreviewLg} />
                                    : <span className={styles.idDocTypeIcon}><i className="fa-regular fa-file-pdf" aria-hidden="true"></i></span>
                                  }
                                  <div className={styles.logoPreviewMeta}>
                                    <p className={styles.logoPreviewTitle}>{idDocFileName}</p>
                                    <p className={styles.logoPreviewHint}>Click below to change</p>
                                  </div>
                                </div>
                              )}

                              <div className={styles.uploadZone}>
                                <i className="fa-regular fa-cloud-arrow-up" aria-hidden="true"></i>
                                <span>Click or drag &amp; drop</span>
                                <input id="idDocFile" name="idDocFile" type="file"
                                  accept="image/*,.pdf" className={styles.uploadZoneInput}
                                  onChange={handleIdDocChange} required />
                              </div>
                              <p className={styles.fileHint}>JPG, PNG or PDF — max 5 MB</p>
                            </div>
                          )}

                          <div className={styles.indivContactNote}>
                            <i className="fa-regular fa-circle-info" aria-hidden="true"></i>
                            Need help? <a href="mailto:info@sldiaspora.org">info@sldiaspora.org</a>
                            &nbsp;·&nbsp;<a href="tel:+252634696895">+252-63-4696895</a>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* ── BUSINESS FORM ─────────────────────────────────── */
                      <>
                        {/* ── Business Identity ── */}
                        <div className={styles.formBlock}>
                          <div className={styles.formBlockHeader}>
                            <span className={styles.formBlockBadge}>
                              <i className="fa-regular fa-building" aria-hidden="true"></i>
                            </span>
                            <span className={styles.formBlockLabel}>Business Identity</span>
                          </div>

                          {/* Business Name — full width */}
                          <div className={styles.fieldGroup}>
                            <label htmlFor="businessName" className={styles.label}>
                              Business / Organization Name *
                            </label>
                            <input
                              id="businessName"
                              name="businessName"
                              type="text"
                              className={`form-control ${styles.input}`}
                              placeholder="e.g. Somali Trade Co."
                              required
                            />
                          </div>

                          {/* 3-col: Contact Person | Phone | Industry */}
                          <div className={styles.fieldRow3}>
                            <div className={styles.fieldGroup}>
                              <label htmlFor="contactPerson" className={styles.label}>
                                Contact Person / Owner *
                              </label>
                              <input
                                id="contactPerson"
                                name="contactPerson"
                                type="text"
                                className={`form-control ${styles.input}`}
                                placeholder="Full name"
                                required
                              />
                            </div>

                            <div className={styles.fieldGroup}>
                              <label htmlFor="phone" className={styles.label}>
                                Phone Number *
                              </label>
                              <input
                                id="phone"
                                name="phone"
                                type="tel"
                                className={`form-control ${styles.input}`}
                                placeholder="+252 ..."
                                required
                              />
                            </div>

                            <div className={styles.fieldGroup}>
                              <label htmlFor="industry" className={styles.label}>
                                Industry *
                              </label>
                              <input
                                id="industry"
                                name="industry"
                                type="text"
                                className={`form-control ${styles.input}`}
                                placeholder="e.g. Finance, Technology"
                                required
                              />
                            </div>
                          </div>

                          {/* 2-col: Website | Business Address */}
                          <div className={styles.fieldRow}>
                            <div className={styles.fieldGroup}>
                              <label htmlFor="businessWebsite" className={styles.label}>
                                Website URL
                                <span className={styles.optionalBadge}>Optional</span>
                              </label>
                              <input
                                id="businessWebsite"
                                name="businessWebsite"
                                type="url"
                                className={`form-control ${styles.input}`}
                                placeholder="https://yourbusiness.com"
                              />
                            </div>

                            <div className={styles.fieldGroup}>
                              <label htmlFor="businessAddress" className={styles.label}>
                                Business Address / Location *
                              </label>
                              <input
                                id="businessAddress"
                                name="businessAddress"
                                type="text"
                                className={`form-control ${styles.input}`}
                                placeholder="City, Country"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* ── Business Logo ── */}
                        <div className={styles.formBlock}>
                          <div className={styles.formBlockHeader}>
                            <span className={styles.formBlockBadge}>
                              <i className="fa-regular fa-image" aria-hidden="true"></i>
                            </span>
                            <span className={styles.formBlockLabel}>Business Logo</span>
                          </div>

                          <div className={styles.logoUploadBlock}>
                            {logoPreview ? (
                              <div className={styles.logoPreviewWrap}>
                                <img
                                  src={logoPreview}
                                  alt="Logo preview"
                                  className={styles.logoPreviewLg}
                                />
                                <div className={styles.logoPreviewMeta}>
                                  <p className={styles.logoPreviewTitle}>Logo selected</p>
                                  <p className={styles.logoPreviewHint}>
                                    Click the upload area to change it
                                  </p>
                                </div>
                              </div>
                            ) : null}
                            <div className={styles.uploadZone}>
                              <i className="fa-regular fa-cloud-arrow-up" aria-hidden="true"></i>
                              <span>Drag &amp; drop or click to upload your logo</span>
                              <input
                                id="businessLogo"
                                name="businessLogo"
                                type="file"
                                accept="image/*"
                                className={styles.uploadZoneInput}
                                onChange={handleLogoChange}
                              />
                            </div>
                            <p className={styles.fileHint}>
                              PNG, JPG, SVG &mdash; max 5 MB. Recommended: square format.
                            </p>
                          </div>
                        </div>

                        {/* ── Note ── */}
                        <div className={styles.formBlock}>
                          <div className={styles.formBlockHeader}>
                            <span className={styles.formBlockBadge}>
                              <i className="fa-regular fa-note-sticky" aria-hidden="true"></i>
                            </span>
                            <span className={styles.formBlockLabel}>Note</span>
                          </div>

                          <div className={styles.fieldGroup}>
                            <label htmlFor="additionalNotes" className={styles.label}>
                              Additional Notes
                              <span className={styles.optionalBadge}>Optional</span>
                            </label>
                            <textarea
                              id="additionalNotes"
                              name="additionalNotes"
                              className={`form-control ${styles.textarea}`}
                              placeholder="Anything you'd like us to know about your business or participation…"
                              rows={4}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {error && <div className={styles.errorBox}>{error}</div>}

                    <button type="submit" disabled={loading} className={styles.submitButton}>
                      {loading ? (
                        <><i className="fa-regular fa-spinner-third fa-spin" aria-hidden="true"></i> Submitting…</>
                      ) : (
                        <><i className="fa-regular fa-paper-plane" aria-hidden="true"></i> {registrationType === "individual" ? "Submit My Registration" : "Submit Business Registration"}</>
                      )}
                    </button>
                  </form>

                  <p className={styles.footerNote}>
                    Already registered and approved?{" "}
                    <Link href="/diaspora-week/portal">Access the Event Portal →</Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
