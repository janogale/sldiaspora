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
                      <>
                        <div className={styles.fieldGroup}>
                          <label htmlFor="fullName" className={styles.label}>
                            Full Name *
                          </label>
                          <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            className={`form-control ${styles.input}`}
                            placeholder="Your full name"
                            required
                          />
                        </div>

                        <div className={styles.fieldRow}>
                          <div className={styles.fieldGroup}>
                            <label htmlFor="profession" className={styles.label}>
                              Profession / Occupation
                            </label>
                            <input
                              id="profession"
                              name="profession"
                              type="text"
                              className={`form-control ${styles.input}`}
                              placeholder="e.g. Software Engineer"
                            />
                          </div>

                          <div className={styles.fieldGroup}>
                            <label htmlFor="areasOfInterest" className={styles.label}>
                              Areas of Interest
                            </label>
                            <input
                              id="areasOfInterest"
                              name="areasOfInterest"
                              type="text"
                              className={`form-control ${styles.input}`}
                              placeholder="e.g. Education, Investment"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className={styles.fieldRow}>
                          <div className={styles.fieldGroup}>
                            <label htmlFor="businessName" className={styles.label}>
                              Business / Organization Name *
                            </label>
                            <input
                              id="businessName"
                              name="businessName"
                              type="text"
                              className={`form-control ${styles.input}`}
                              placeholder="Business name"
                              required
                            />
                          </div>

                          <div className={styles.fieldGroup}>
                            <label htmlFor="contactPerson" className={styles.label}>
                              Contact Person *
                            </label>
                            <input
                              id="contactPerson"
                              name="contactPerson"
                              type="text"
                              className={`form-control ${styles.input}`}
                              placeholder="Primary contact name"
                              required
                            />
                          </div>
                        </div>

                        <div className={styles.fieldRow}>
                          <div className={styles.fieldGroup}>
                            <label htmlFor="industry" className={styles.label}>
                              Industry
                            </label>
                            <input
                              id="industry"
                              name="industry"
                              type="text"
                              className={`form-control ${styles.input}`}
                              placeholder="e.g. Finance, Technology"
                            />
                          </div>

                          <div className={styles.fieldGroup}>
                            <label htmlFor="businessWebsite" className={styles.label}>
                              Website
                            </label>
                            <input
                              id="businessWebsite"
                              name="businessWebsite"
                              type="text"
                              className={`form-control ${styles.input}`}
                              placeholder="https://"
                            />
                          </div>
                        </div>

                        <div className={styles.fieldGroup}>
                          <label htmlFor="businessLogo" className={styles.label}>
                            Business Logo
                          </label>
                          <div className={styles.logoUpload}>
                            {logoPreview && (
                              <img src={logoPreview} alt="Logo preview" className={styles.logoPreviewImg} />
                            )}
                            <input
                              id="businessLogo"
                              name="businessLogo"
                              type="file"
                              accept="image/*"
                              className={styles.fileInput}
                              onChange={handleLogoChange}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className={styles.fieldRow}>
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
                    </div>

                    <div className={styles.fieldRow}>
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
                        <label htmlFor="city" className={styles.label}>
                          City *
                        </label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          className={`form-control ${styles.input}`}
                          placeholder="City"
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.checkboxRow}>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" name="exhibitorInterest" value="true" />
                        I&apos;m interested in being an exhibitor
                      </label>
                      <label className={styles.checkboxLabel}>
                        <input type="checkbox" name="pitchInterest" value="true" />
                        I&apos;m interested in the startup pitching session
                      </label>
                    </div>

                    <div className={styles.fieldGroup}>
                      <label htmlFor="additionalNotes" className={styles.label}>
                        Additional Notes
                      </label>
                      <textarea
                        id="additionalNotes"
                        name="additionalNotes"
                        className={`form-control ${styles.textarea}`}
                        placeholder="Anything else you'd like us to know"
                        rows={3}
                      />
                    </div>

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
