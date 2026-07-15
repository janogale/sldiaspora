"use client";

import { FormEvent, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import styles from "./page.module.css";
import { countries } from "../../data/countries";

export default function DiasporaWeekRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [idDocType, setIdDocType] = useState<"passport" | "licence" | null>(null);
  const [idDocPreview, setIdDocPreview] = useState<string | null>(null);
  const [idDocFileName, setIdDocFileName] = useState<string | null>(null);
  const [idDocIsImage, setIdDocIsImage] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [indivCountry, setIndivCountry] = useState("");

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

    setError("");

    const formData = new FormData(event.currentTarget);

    const cities = formData.getAll("eventLocation");
    if (cities.length === 0) {
      setError("Please select at least one city you will attend.");
      return;
    }

    if (!idDocType) {
      setError("Please select a document type (Passport or Driving Licence).");
      return;
    }
    if (!idDocFileName) {
      setError(`Please upload your ${idDocType === "passport" ? "passport" : "driving licence"}.`);
      return;
    }

    setLoading(true);

    try {
      formData.set("registrationType", "individual");

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
              ) : (
                <>
                  <div className={styles.formHeader}>
                    <div>
                      <h1 className={styles.title}>Individual Registration</h1>
                      <p className={styles.subtitle}>
                        Fill in your details below. Our team will review within 48 hours.
                      </p>
                    </div>
                  </div>

                  <form ref={formRef} onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
                    {/* ── INDIVIDUAL FORM — 2-col compact ── */}
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
                              <label htmlFor="country" className={styles.label}>Country *</label>
                              <select
                                id="country"
                                name="country"
                                className={`form-control ${styles.input}`}
                                value={indivCountry}
                                onChange={(e) => setIndivCountry(e.target.value)}
                                required
                              >
                                <option value="">Select country of residence</option>
                                {countries.map((c) => (
                                  <option key={c.name} value={c.name}>{c.name}</option>
                                ))}
                              </select>
                            </div>
                            <div className={styles.fieldGroup}>
                              <label htmlFor="phone" className={styles.label}>Phone *</label>
                              <input
                                id="phone"
                                name="phone"
                                type="tel"
                                className={`form-control ${styles.input}`}
                                placeholder="e.g. +252 63 1234567"
                                required
                              />
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
                            &nbsp;·&nbsp;<a href="tel:+252638880240">+252 63 8880240</a>
                          </div>
                        </div>
                      </div>

                    {error && <div className={styles.errorBox}>{error}</div>}

                    <button type="submit" disabled={loading} className={styles.submitButton}>
                      {loading ? (
                        <><i className="fa-regular fa-spinner-third fa-spin" aria-hidden="true"></i> Submitting…</>
                      ) : (
                        <><i className="fa-regular fa-paper-plane" aria-hidden="true"></i> Submit My Registration</>
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
