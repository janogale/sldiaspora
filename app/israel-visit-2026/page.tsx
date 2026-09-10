"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Header from "../components/header";
import styles from "./page.module.css";

const AREAS = [
  "Business and economic cooperation",
  "Official and institutional engagement",
  "Diaspora leadership and peer exchange",
  "Tourism and cultural heritage exchange",
];

export default function IsraelVisit2026Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);

    if (formData.getAll("areasOfInterest").length === 0) {
      setError("Please choose at least one area of interest.");
      return;
    }
    const doc = formData.get("idDocument");
    if (!(doc instanceof File) || doc.size === 0) {
      setError("Please upload your passport or national ID.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/israel-visit/register", {
        method: "POST",
        body: formData,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        setError(result?.message || "Registration failed. Please try again.");
        return;
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Unable to submit right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      {/* ---------- HERO ---------- */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.kicker}>Israel–Africa Business Connect</span>
          <h1 className={styles.heroTitle}>
            Historic First Somaliland Diaspora-Led{" "}
            <span>Delegation Visit to Israel</span>
          </h1>
          <div className={styles.heroMeta}>
            <span>17 – 22 October 2026</span>
            <span>Jerusalem · Tel Aviv · Haifa</span>
            <span>Six-day program</span>
          </div>
          <p className={styles.exclusive}>
            Registration is open exclusively to Somalilanders
          </p>
          <a href="#register" className={styles.jump}>
            Register Now
          </a>
        </div>
      </section>

      <div className={styles.wrap}>
        {/* ---------- ABOUT ---------- */}
        <div className={styles.card}>
          <h2>About the Delegation</h2>
          <p>
            Israel-Africa Business Connect (IABC), in joint collaboration with the
            Diaspora Affairs Department of the Ministry of Foreign Affairs and
            International Cooperation of the Republic of Somaliland, invites
            dedicated diaspora leaders, professionals and entrepreneurs to engage
            in a landmark six-day program of institutional, business, and cultural
            exchange with Israeli counterparts. The local business community, civil
            society and other interested stakeholders residing in Somaliland are
            equally encouraged and welcome to apply and participate.
          </p>
          <p>
            Following the formal diplomatic ties and mutual recognition established
            between the governments of Somaliland and Israel, this historic visit
            represents a definitive step toward strengthening ties between the two
            peoples and building lasting partnerships.
          </p>
          <p>
            This is more than a visit, it is a statement of dialogue, economic
            cooperation, and people-to-people connection. Participants will engage
            with Israeli government bodies, explore innovation ecosystems, and
            experience meaningful cultural exchange across a rich historical
            landscape.
          </p>
        </div>

        {/* ---------- PARTICIPATION FEE ---------- */}
        <div className={styles.card}>
          <h2>Participation Fee</h2>
          <div className={styles.feeGrid}>
            <div className={styles.feeBox}>
              <b>€1,370</b>
              <small>per person (double occupancy)</small>
            </div>
            <div className={styles.feeBox}>
              <b>€300</b>
              <small>deposit on registration</small>
            </div>
            <div className={styles.feeBox}>
              <b>€1,070</b>
              <small>payable on arrival in Israel</small>
            </div>
          </div>
          <div className={styles.included}>
            <div>
              <h4>Package includes</h4>
              <ul>
                <li>Hotel accommodation</li>
                <li>Daily breakfast and dinner</li>
                <li>Guided tours &amp; official meetings</li>
                <li>Site entrance fees</li>
                <li>Group local transportation</li>
              </ul>
            </div>
            <div className={styles.notInc}>
              <h4>Not included</h4>
              <ul>
                <li>International airfare</li>
                <li>Travel insurance</li>
                <li>Lunches (approx. $20–$25 per day)</li>
                <li>Airport transfers &amp; visa fees</li>
                <li>Private taxi transportation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ---------- QUOTES ---------- */}
        <div className={styles.card}>
          <h2>Who Can Take Part</h2>
          <div className={styles.quotes}>
            <div className={styles.quote}>
              “Open to all Somalilanders – Diaspora and Residents at Home”
            </div>
            <div className={styles.quote}>
              “Connecting Somaliland’s Diaspora, Business Community, Professionals
              &amp; Other Stakeholders with Israeli Government Institutions,
              Investors, Businesses &amp; Innovators”
            </div>
            <div className={styles.quote}>
              “Participation is exclusively for Somaliland citizens, subject to
              verification by the Diaspora Department”
            </div>
          </div>
        </div>

        {/* ---------- FORM ---------- */}
        <div className={styles.formCard} id="register">
          {submitted ? (
            <div className={styles.success}>
              <span className={styles.successIcon}>
                <CheckCircle2 size={38} />
              </span>
              <h2>Registration Received</h2>
              <p>
                Thank you for registering for the Somaliland Diaspora-Led
                Delegation Visit to Israel. Your application is now pending
                verification by the Diaspora Department. Our team will contact you
                by email regarding the €300 deposit and next steps.
              </p>
            </div>
          ) : (
            <>
              <div className={styles.formHead}>
                <h2>Register Now</h2>
                <p>
                  Registration is exclusively for Somaliland citizens, subject to
                  verification by the Diaspora Department.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className={styles.grid}
                encType="multipart/form-data"
              >
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="fullName">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    className={styles.input}
                    placeholder="Your full legal name"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="organization">
                    Business / Organization <small>(optional)</small>
                  </label>
                  <input
                    id="organization"
                    name="organization"
                    className={styles.input}
                    placeholder="Name of business or organization"
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="phone">
                    Phone *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className={styles.input}
                    placeholder="e.g. +252 63 4081527"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="email">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={styles.input}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="departingCity">
                    Departing City *
                  </label>
                  <input
                    id="departingCity"
                    name="departingCity"
                    className={styles.input}
                    placeholder="City you will travel from"
                    required
                  />
                </div>

                <div className={`${styles.field} ${styles.full}`}>
                  <label className={styles.label}>
                    Areas of Interest * <small>(choose one or more)</small>
                  </label>
                  <div className={styles.checks}>
                    {AREAS.map((area) => (
                      <label key={area} className={styles.check}>
                        <input
                          type="checkbox"
                          name="areasOfInterest"
                          value={area}
                        />
                        {area}
                      </label>
                    ))}
                  </div>
                </div>

                <div className={`${styles.field} ${styles.full}`}>
                  <label className={styles.label} htmlFor="idDocument">
                    Upload Passport or National ID *
                  </label>
                  <div className={styles.upload}>
                    {fileName ? (
                      <span className={styles.fileName}>{fileName}</span>
                    ) : (
                      "Click to upload — choose one document (JPG, PNG or PDF)"
                    )}
                    <input
                      id="idDocument"
                      name="idDocument"
                      type="file"
                      accept="image/*,.pdf"
                      required
                      onChange={(e) =>
                        setFileName(e.target.files?.[0]?.name ?? null)
                      }
                    />
                  </div>
                  <span className={styles.hint}>Max file size 8 MB.</span>
                </div>

                <div className={`${styles.field} ${styles.full}`}>
                  <label className={styles.label} htmlFor="additionalComment">
                    Additional Comment <small>(optional)</small>
                  </label>
                  <textarea
                    id="additionalComment"
                    name="additionalComment"
                    className={styles.input}
                    placeholder="Anything else you would like us to know"
                  />
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button
                  type="submit"
                  className={styles.submit}
                  disabled={loading}
                >
                  {loading ? "Submitting…" : "Submit Registration"}
                </button>

                <p className={styles.consent}>
                  By submitting, you confirm you are a Somaliland citizen and
                  consent to verification by the Diaspora Department.
                </p>
              </form>
            </>
          )}

          <p className={styles.contact}>
            For inquiries or further information, message us on WhatsApp{" "}
            <a href="https://wa.me/252634081527">+252-63-4081527</a> / 4696895 or
            email <a href="mailto:info@sldiaspora.org">info@sldiaspora.org</a>
          </p>
        </div>
      </div>
    </main>
  );
}
