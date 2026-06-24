"use client";

import { FormEvent, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Building2, CheckCircle2, User } from "lucide-react";
import styles from "./page.module.css";

type RegistrationType = "individual" | "business";

export default function DiasporaWeekRegisterPage() {
  const [registrationType, setRegistrationType] = useState<RegistrationType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [idDocType, setIdDocType] = useState<"passport" | "licence" | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setLogoPreview(null);
      return;
    }
    setLogoPreview(URL.createObjectURL(file));
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
            <div className={styles.brandPanel}>
              <p className={styles.kicker}>Somaliland Diaspora Week</p>
              <div className={styles.logoWrap}>
                <Image
                  src="/assets/imgs/logo/logo.png"
                  alt="Somaliland Diaspora Department"
                  width={200}
                  height={66}
                  priority
                  className={styles.logoImage}
                />
              </div>

              <h2 className={styles.brandTitle}>Join Diaspora Week</h2>
              <p className={styles.brandSubtitle}>
                Register as an individual or as a business to take part in our 5-day flagship
                event &mdash; exhibitions, forums, startup pitching, and cultural celebrations.
              </p>

              <ul className={styles.brandList}>
                <li>
                  <i className="fa-regular fa-circle-check" aria-hidden="true"></i>
                  Submit your registration in minutes
                </li>
                <li>
                  <i className="fa-regular fa-circle-check" aria-hidden="true"></i>
                  Our team reviews and approves your request
                </li>
                <li>
                  <i className="fa-regular fa-circle-check" aria-hidden="true"></i>
                  Get an access code by email to unlock the full event portal
                </li>
              </ul>
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
                  <h1 className={styles.title}>How are you registering?</h1>
                  <p className={styles.subtitle}>
                    Choose the option that best describes your participation in Diaspora Week.
                  </p>

                  <div className={styles.typeGrid}>
                    <button
                      type="button"
                      className={styles.typeCard}
                      onClick={() => setRegistrationType("individual")}
                    >
                      <span className={styles.typeIcon}>
                        <User size={26} />
                      </span>
                      <h3>Individual</h3>
                      <p>
                        Register as a single attendee &mdash; diaspora member, professional, or
                        community participant.
                      </p>
                      <span className={styles.typeCta}>Continue</span>
                    </button>

                    <button
                      type="button"
                      className={styles.typeCard}
                      onClick={() => setRegistrationType("business")}
                    >
                      <span className={styles.typeIcon}>
                        <Building2 size={26} />
                      </span>
                      <h3>Business</h3>
                      <p>
                        Register your business or organization, including exhibitor and
                        partnership details.
                      </p>
                      <span className={styles.typeCta}>Continue</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className={styles.changeTypeButton}
                    onClick={() => {
                      setRegistrationType(null);
                      setError("");
                    }}
                  >
                    <i className="fa-regular fa-arrow-left" aria-hidden="true"></i>
                    Change registration type
                  </button>

                  <h1 className={styles.title}>
                    {registrationType === "individual"
                      ? "Individual Registration"
                      : "Business Registration"}
                  </h1>
                  <p className={styles.subtitle}>
                    {registrationType === "individual"
                      ? "Tell us about yourself so we can review your registration."
                      : "Tell us about your business so we can review your registration."}
                  </p>

                  <form ref={formRef} onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
                    {registrationType === "individual" ? (
                      /* ── INDIVIDUAL FORM ───────────────────────────────── */
                      <>
                        {/* ── Personal Details ── */}
                        <div className={styles.formBlock}>
                          <div className={styles.formBlockHeader}>
                            <span className={styles.formBlockBadge}>
                              <i className="fa-regular fa-user" aria-hidden="true"></i>
                            </span>
                            <span className={styles.formBlockLabel}>Personal Details</span>
                          </div>

                          {/* Full Name — full width */}
                          <div className={styles.fieldGroup}>
                            <label htmlFor="fullName" className={styles.label}>
                              Full Name *
                            </label>
                            <input
                              id="fullName"
                              name="fullName"
                              type="text"
                              className={`form-control ${styles.input}`}
                              placeholder="Enter your full name"
                              required
                            />
                          </div>

                          {/* 3-col: Country | Phone | Email */}
                          <div className={styles.fieldRow3}>
                            <div className={styles.fieldGroup}>
                              <label htmlFor="country" className={styles.label}>
                                Country *
                              </label>
                              <input
                                id="country"
                                name="country"
                                type="text"
                                className={`form-control ${styles.input}`}
                                placeholder="Country of residence"
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
                              <label htmlFor="email" className={styles.label}>
                                Email Address *
                              </label>
                              <input
                                id="email"
                                name="email"
                                type="email"
                                className={`form-control ${styles.input}`}
                                placeholder="you@example.com"
                                required
                              />
                            </div>
                          </div>

                          {/* 2-col: Address | Event Location */}
                          <div className={styles.fieldRow}>
                            <div className={styles.fieldGroup}>
                              <label htmlFor="address" className={styles.label}>
                                Address *
                              </label>
                              <input
                                id="address"
                                name="address"
                                type="text"
                                className={`form-control ${styles.input}`}
                                placeholder="Street, apartment, district…"
                                required
                              />
                            </div>

                            <div className={styles.fieldGroup}>
                              <label htmlFor="eventLocation" className={styles.label}>
                                Event Location *
                              </label>
                              <select
                                id="eventLocation"
                                name="eventLocation"
                                className={`form-control ${styles.input} ${styles.select}`}
                                required
                                defaultValue=""
                              >
                                <option value="" disabled>Select a city</option>
                                <option value="Hargeisa">Hargeisa</option>
                                <option value="Boorama">Boorama</option>
                                <option value="Burco">Burco</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* ── Identity Document ── */}
                        <div className={styles.formBlock}>
                          <div className={styles.formBlockHeader}>
                            <span className={styles.formBlockBadge}>
                              <i className="fa-regular fa-id-badge" aria-hidden="true"></i>
                            </span>
                            <span className={styles.formBlockLabel}>Identity Document</span>
                          </div>

                          <div className={styles.idDocTypeRow}>
                            <label
                              className={`${styles.idDocTypeCard} ${
                                idDocType === "passport" ? styles.idDocTypeCardActive : ""
                              }`}
                            >
                              <input
                                type="radio"
                                name="idDocumentType"
                                value="passport"
                                checked={idDocType === "passport"}
                                onChange={() => setIdDocType("passport")}
                                className={styles.idDocRadio}
                              />
                              <span className={styles.idDocTypeIcon}>
                                <i className="fa-regular fa-passport" aria-hidden="true"></i>
                              </span>
                              <span>
                                <strong>Passport</strong>
                                <br />
                                <small>International travel document</small>
                              </span>
                            </label>

                            <label
                              className={`${styles.idDocTypeCard} ${
                                idDocType === "licence" ? styles.idDocTypeCardActive : ""
                              }`}
                            >
                              <input
                                type="radio"
                                name="idDocumentType"
                                value="licence"
                                checked={idDocType === "licence"}
                                onChange={() => setIdDocType("licence")}
                                className={styles.idDocRadio}
                              />
                              <span className={styles.idDocTypeIcon}>
                                <i className="fa-regular fa-id-card" aria-hidden="true"></i>
                              </span>
                              <span>
                                <strong>Driving Licence</strong>
                                <br />
                                <small>National driving licence</small>
                              </span>
                            </label>
                          </div>

                          {idDocType && (
                            <div className={styles.fieldGroup}>
                              <label htmlFor="idDocFile" className={styles.label}>
                                Upload {idDocType === "passport" ? "Passport" : "Driving Licence"} *
                              </label>
                              <div className={styles.uploadZone}>
                                <i className="fa-regular fa-cloud-arrow-up" aria-hidden="true"></i>
                                <span>Drag &amp; drop or click to browse</span>
                                <input
                                  id="idDocFile"
                                  name="idDocFile"
                                  type="file"
                                  accept="image/*,.pdf"
                                  className={styles.uploadZoneInput}
                                  required
                                />
                              </div>
                              <p className={styles.fileHint}>
                                Accepted: JPG, PNG, PDF &mdash; max 5 MB
                              </p>
                            </div>
                          )}
                        </div>

                        {/* ── Contact the Department ── */}
                        <div className={styles.formBlock}>
                          <div className={styles.formBlockHeader}>
                            <span className={styles.formBlockBadge}>
                              <i className="fa-regular fa-headset" aria-hidden="true"></i>
                            </span>
                            <span className={styles.formBlockLabel}>Contact the Department</span>
                          </div>

                          <div className={styles.contactInfoBox}>
                            <p className={styles.contactInfoNote}>
                              Need help with your registration? Reach the Somaliland Diaspora
                              Department directly:
                            </p>
                            <div className={styles.contactInfoGrid}>
                              <div className={styles.contactInfoItem}>
                                <span className={styles.contactInfoItemIcon}>
                                  <i className="fa-regular fa-phone" aria-hidden="true"></i>
                                </span>
                                <div>
                                  <span className={styles.contactInfoItemLabel}>Phone 1</span>
                                  <span className={styles.contactInfoItemValue}>+252 63 000 0000</span>
                                </div>
                              </div>
                              <div className={styles.contactInfoItem}>
                                <span className={styles.contactInfoItemIcon}>
                                  <i className="fa-regular fa-phone" aria-hidden="true"></i>
                                </span>
                                <div>
                                  <span className={styles.contactInfoItemLabel}>Phone 2</span>
                                  <span className={styles.contactInfoItemValue}>+252 63 000 0001</span>
                                </div>
                              </div>
                              <div className={styles.contactInfoItem}>
                                <span className={styles.contactInfoItemIcon}>
                                  <i className="fa-regular fa-envelope" aria-hidden="true"></i>
                                </span>
                                <div>
                                  <span className={styles.contactInfoItemLabel}>Email</span>
                                  <span className={styles.contactInfoItemValue}>diaspora@somaliland.gov.so</span>
                                </div>
                              </div>
                              <div className={styles.contactInfoItem}>
                                <span className={styles.contactInfoItemIcon}>
                                  <i className="fa-regular fa-location-dot" aria-hidden="true"></i>
                                </span>
                                <div>
                                  <span className={styles.contactInfoItemLabel}>Office</span>
                                  <span className={styles.contactInfoItemValue}>Ministry of Diaspora Affairs, Hargeisa</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
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
                      {loading ? "Submitting..." : "Submit Registration"}
                    </button>
                  </form>

                  <p className={styles.footerNote}>
                    Already approved?{" "}
                    <Link href="/diaspora-week/portal">Sign in to the Event Portal</Link>
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
