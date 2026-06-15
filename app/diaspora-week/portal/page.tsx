"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  CalendarDays,
  Camera,
  Handshake,
  LogOut,
  MapPin,
  User,
} from "lucide-react";
import styles from "./page.module.css";

type ScheduleItem = {
  id: string;
  dayNumber: number;
  dayLabel: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
  speaker: string;
  location: string;
  sessionType: string;
};

type ExhibitorItem = {
  id: string;
  name: string;
  logo: string | null;
  description: string;
  boothNumber: string;
  category: string;
  website: string;
};

type PartnerItem = {
  id: string;
  name: string;
  logo: string | null;
  website: string;
  partnerType: string;
};

type GalleryMediaItem = {
  id: string;
  title: string;
  url: string;
  type: "image" | "video";
};

type PortalRegistration = {
  id: string;
  registrationType: "individual" | "business";
  name: string;
  email: string;
  country: string;
  city: string;
  exhibitorInterest: boolean;
  pitchInterest: boolean;
};

type PortalContent = {
  schedule: ScheduleItem[];
  exhibitors: ExhibitorItem[];
  partners: PartnerItem[];
  gallery: GalleryMediaItem[];
};

type Section = "home" | "schedule" | "exhibitors" | "partners" | "gallery";

export default function DiasporaWeekPortalPage() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [registration, setRegistration] = useState<PortalRegistration | null>(null);
  const [content, setContent] = useState<PortalContent | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [activeDay, setActiveDay] = useState<number | null>(null);

  const [email, setEmail] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginNotice, setLoginNotice] = useState("");

  const loadPortal = async () => {
    try {
      const response = await fetch("/api/diaspora-week/portal/me", { cache: "no-store" });
      const result = await response.json().catch(() => null);

      if (response.ok && result?.registration && result?.content) {
        setRegistration(result.registration);
        setContent(result.content);
      } else {
        setRegistration(null);
        setContent(null);
      }
    } catch {
      setRegistration(null);
      setContent(null);
    } finally {
      setCheckingSession(false);
    }
  };

  useEffect(() => {
    loadPortal();
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");
    setLoginNotice("");
    setLoginLoading(true);

    try {
      const response = await fetch("/api/diaspora-week/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        if (result?.status === "pending") {
          setLoginNotice(result?.message || "Your registration is still pending approval.");
        } else {
          setLoginError(result?.message || "Unable to sign in.");
        }
        return;
      }

      setCheckingSession(true);
      await loadPortal();
    } catch {
      setLoginError("Unable to sign in right now. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/diaspora-week/portal/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      setRegistration(null);
      setContent(null);
      setActiveSection("home");
    }
  };

  if (checkingSession) {
    return (
      <main className={styles.portalPage}>
        <div className={styles.loadingScreen}>
          <div className={styles.spinner} />
        </div>
      </main>
    );
  }

  if (!registration || !content) {
    return (
      <main className={styles.portalPage}>
        <section className={styles.loginSection}>
          <div className={`container ${styles.loginContainer}`}>
            <div className={styles.backButtonWrap}>
              <Link href="/diaspora-week" className={styles.backButton}>
                <i className="fa-regular fa-arrow-left" aria-hidden="true"></i>
                Back to Diaspora Week
              </Link>
            </div>

            <div className={styles.loginShell}>
              <div className={styles.brandPanel}>
                <p className={styles.kicker}>Somaliland Diaspora Week 2025</p>
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

                <h2 className={styles.brandTitle}>Event Portal</h2>
                <p className={styles.brandSubtitle}>
                  Enter the email address you registered with. Once your registration is
                  approved, you&apos;ll get instant access &mdash; no code needed.
                </p>

                <ul className={styles.brandList}>
                  <li>
                    <i className="fa-regular fa-circle-check" aria-hidden="true"></i>
                    Full 4-day event schedule
                  </li>
                  <li>
                    <i className="fa-regular fa-circle-check" aria-hidden="true"></i>
                    Exhibitors &amp; partner directory
                  </li>
                  <li>
                    <i className="fa-regular fa-circle-check" aria-hidden="true"></i>
                    Photo &amp; video gallery
                  </li>
                </ul>
              </div>

              <div className={styles.loginCard}>
                <h1 className={styles.title}>Sign in to the Event Portal</h1>
                <p className={styles.subtitle}>
                  Not registered yet?{" "}
                  <Link href="/diaspora-week/register">Register for Diaspora Week</Link>
                </p>

                <form onSubmit={handleLogin} className={styles.form}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="portal-email" className={styles.label}>
                      Email Address
                    </label>
                    <input
                      id="portal-email"
                      type="email"
                      className={`form-control ${styles.input}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  {loginNotice && <div className={styles.noticeBox}>{loginNotice}</div>}
                  {loginError && <div className={styles.errorBox}>{loginError}</div>}

                  <button type="submit" disabled={loginLoading} className={styles.loginButton}>
                    {loginLoading ? "Signing in..." : "Enter Portal"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const scheduleByDay = content.schedule.reduce<Record<number, ScheduleItem[]>>((acc, item) => {
    if (!acc[item.dayNumber]) acc[item.dayNumber] = [];
    acc[item.dayNumber].push(item);
    return acc;
  }, {});

  const sortedDays = Object.keys(scheduleByDay)
    .map(Number)
    .sort((a, b) => a - b);

  const currentDay = activeDay && scheduleByDay[activeDay] ? activeDay : sortedDays[0] ?? null;

  const navItems: Array<{ key: Section; label: string; icon: React.ReactNode }> = [
    { key: "home", label: "Home", icon: <i className="fa-regular fa-house" aria-hidden="true"></i> },
    { key: "schedule", label: "Event Schedule", icon: <CalendarDays size={16} /> },
    { key: "exhibitors", label: "Exhibitors", icon: <Building2 size={16} /> },
    { key: "partners", label: "Partners", icon: <Handshake size={16} /> },
    { key: "gallery", label: "Gallery", icon: <Camera size={16} /> },
  ];

  return (
    <main className={styles.sitePage}>
      <header className={styles.siteHeader}>
        <div className={`container ${styles.siteHeaderInner}`}>
          <Link href="/diaspora-week" className={styles.siteLogo}>
            <Image
              src="/assets/imgs/logo/logo.png"
              alt="Somaliland Diaspora Department"
              width={150}
              height={48}
              className={styles.siteLogoImage}
            />
          </Link>

          <nav className={styles.siteNav}>
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`${styles.navItem} ${activeSection === item.key ? styles.navItemActive : ""}`}
                onClick={() => setActiveSection(item.key)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className={styles.siteHeaderRight}>
            <span className={styles.welcomeBadge}>
              <User size={14} />
              {registration.name}
            </span>
            <button type="button" className={styles.logoutButton} onClick={handleLogout}>
              <LogOut size={15} />
              Log Out
            </button>
          </div>
        </div>
      </header>

      {activeSection === "home" && (
        <>
          <section className={styles.hero}>
            <div className={styles.heroOverlay}></div>
            <div className={`container ${styles.heroContainer}`}>
              <span className={styles.heroBadge}>August 2 &ndash; 5, 2025 &middot; Hargeisa</span>
              <h1 className={styles.heroTitle}>Somaliland Diaspora Week 2025</h1>
              <p className={styles.heroSubtitle}>
                Welcome, {registration.name}. You&apos;re signed in as{" "}
                {registration.registrationType === "business" ? "a business" : "an individual"}{" "}
                participant. Explore the schedule, exhibitors, partners and gallery below.
              </p>

              <div className={styles.heroStats}>
                <div className={styles.heroStat}>
                  <strong>{sortedDays.length || 4}</strong>
                  <span>Event Days</span>
                </div>
                <div className={styles.heroStat}>
                  <strong>{content.exhibitors.length}</strong>
                  <span>Exhibitors</span>
                </div>
                <div className={styles.heroStat}>
                  <strong>{content.partners.length}</strong>
                  <span>Partners</span>
                </div>
                <div className={styles.heroStat}>
                  <strong>{content.gallery.length}</strong>
                  <span>Gallery Items</span>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.aboutSection}>
            <div className="container">
              <span className={styles.kicker}>About Diaspora Week</span>
              <h2 className={styles.sectionTitle}>Somaliland &amp; Its Global Citizens</h2>
              <p className={styles.sectionLead}>
                Diaspora Week 2025 brings together government leaders, diaspora communities,
                entrepreneurs and partners over four days of ceremonies, panels, pitching
                sessions and cultural celebration &mdash; building a new partnership model
                between Somaliland and its global citizens.
              </p>

              <div className={styles.quickLinks}>
                <button type="button" className={styles.quickLinkCard} onClick={() => setActiveSection("schedule")}>
                  <CalendarDays size={22} />
                  <div>
                    <h3>Event Schedule</h3>
                    <p>Browse all 4 days of sessions, panels and ceremonies.</p>
                  </div>
                </button>
                <button type="button" className={styles.quickLinkCard} onClick={() => setActiveSection("exhibitors")}>
                  <Building2 size={22} />
                  <div>
                    <h3>Exhibitors</h3>
                    <p>Discover the organizations showcasing at Diaspora Week.</p>
                  </div>
                </button>
                <button type="button" className={styles.quickLinkCard} onClick={() => setActiveSection("partners")}>
                  <Handshake size={22} />
                  <div>
                    <h3>Partners</h3>
                    <p>Meet the partners supporting Diaspora Week 2025.</p>
                  </div>
                </button>
                <button type="button" className={styles.quickLinkCard} onClick={() => setActiveSection("gallery")}>
                  <Camera size={22} />
                  <div>
                    <h3>Gallery</h3>
                    <p>Photos and videos from across the event.</p>
                  </div>
                </button>
              </div>

              {(registration.exhibitorInterest || registration.pitchInterest) && (
                <div className={styles.profileCard}>
                  <span className={styles.profileIcon}>
                    <User size={20} />
                  </span>
                  <div>
                    <h3>Your Registration</h3>
                    <ul className={styles.profileList}>
                      <li>
                        <strong>Type:</strong>{" "}
                        {registration.registrationType === "business" ? "Business" : "Individual"}
                      </li>
                      {registration.exhibitorInterest && (
                        <li>
                          <strong>Exhibitor interest:</strong> Yes
                        </li>
                      )}
                      {registration.pitchInterest && (
                        <li>
                          <strong>Startup pitching interest:</strong> Yes
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {activeSection === "schedule" && (
        <section className={styles.tabSection}>
          <div className="container">
            <span className={styles.kicker}>4-Day Program</span>
            <h2 className={styles.sectionTitle}>Event Schedule</h2>

            {sortedDays.length === 0 ? (
              <p className={styles.emptyState}>The full schedule will be published soon.</p>
            ) : (
              <>
                <div className={styles.dayTabs}>
                  {sortedDays.map((dayNumber) => (
                    <button
                      key={dayNumber}
                      type="button"
                      className={`${styles.dayTab} ${currentDay === dayNumber ? styles.dayTabActive : ""}`}
                      onClick={() => setActiveDay(dayNumber)}
                    >
                      <span>{scheduleByDay[dayNumber][0]?.dayLabel || `Day ${dayNumber}`}</span>
                      {scheduleByDay[dayNumber][0]?.date && (
                        <small>{scheduleByDay[dayNumber][0].date}</small>
                      )}
                    </button>
                  ))}
                </div>

                {currentDay && (
                  <div className={styles.sessionList}>
                    {scheduleByDay[currentDay].map((session) => (
                      <div className={styles.sessionCard} key={session.id}>
                        <div className={styles.sessionTime}>
                          {session.startTime}
                          {session.endTime ? ` - ${session.endTime}` : ""}
                        </div>
                        <div className={styles.sessionBody}>
                          <h3>{session.title}</h3>
                          {session.description && <p>{session.description}</p>}
                          <div className={styles.sessionMeta}>
                            {session.speaker && (
                              <span>
                                <User size={14} /> {session.speaker}
                              </span>
                            )}
                            {session.location && (
                              <span>
                                <MapPin size={14} /> {session.location}
                              </span>
                            )}
                            {session.sessionType && (
                              <span className={styles.sessionTag}>{session.sessionType}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      {activeSection === "exhibitors" && (
        <section className={styles.tabSection}>
          <div className="container">
            <span className={styles.kicker}>Showcase</span>
            <h2 className={styles.sectionTitle}>Exhibitors</h2>

            {content.exhibitors.length === 0 ? (
              <p className={styles.emptyState}>Exhibitor list will be published soon.</p>
            ) : (
              <div className={styles.cardGrid}>
                {content.exhibitors.map((item) => (
                  <div className={styles.entityCard} key={item.id}>
                    {item.logo ? (
                      <img src={item.logo} alt={item.name} className={styles.entityLogo} />
                    ) : (
                      <span className={styles.entityFallback}>{item.name.slice(0, 2).toUpperCase()}</span>
                    )}
                    <h3>{item.name}</h3>
                    {item.category && <span className={styles.entityTag}>{item.category}</span>}
                    {item.boothNumber && <p className={styles.entityMeta}>Booth {item.boothNumber}</p>}
                    {item.description && <p>{item.description}</p>}
                    {item.website && (
                      <a href={item.website} target="_blank" rel="noreferrer">
                        Visit website
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {activeSection === "partners" && (
        <section className={styles.tabSection}>
          <div className="container">
            <span className={styles.kicker}>Collaboration</span>
            <h2 className={styles.sectionTitle}>Partners</h2>

            {content.partners.length === 0 ? (
              <p className={styles.emptyState}>Partner organizations will be announced soon.</p>
            ) : (
              <div className={styles.cardGrid}>
                {content.partners.map((item) => (
                  <div className={styles.entityCard} key={item.id}>
                    {item.logo ? (
                      <img src={item.logo} alt={item.name} className={styles.entityLogo} />
                    ) : (
                      <span className={styles.entityFallback}>{item.name.slice(0, 2).toUpperCase()}</span>
                    )}
                    <h3>{item.name}</h3>
                    {item.partnerType && <span className={styles.entityTag}>{item.partnerType}</span>}
                    {item.website && (
                      <a href={item.website} target="_blank" rel="noreferrer">
                        Visit website
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {activeSection === "gallery" && (
        <section className={styles.tabSection}>
          <div className="container">
            <span className={styles.kicker}>Memories</span>
            <h2 className={styles.sectionTitle}>Photo &amp; Video Gallery</h2>

            {content.gallery.length === 0 ? (
              <p className={styles.emptyState}>Gallery content will appear here during the event.</p>
            ) : (
              <div className={styles.galleryGrid}>
                {content.gallery.map((item) => (
                  <div className={styles.galleryItem} key={item.id}>
                    {item.type === "video" ? (
                      <video src={item.url} controls />
                    ) : (
                      <img src={item.url} alt={item.title} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <footer className={styles.siteFooter}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Somaliland Diaspora Department</p>
          <Link href="/diaspora-week">Back to Diaspora Week site</Link>
        </div>
      </footer>
    </main>
  );
}
