"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  CalendarDays,
  Camera,
  Handshake,
  LayoutDashboard,
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

type Section = "overview" | "schedule" | "exhibitors" | "partners" | "gallery";

export default function DiasporaWeekPortalPage() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [registration, setRegistration] = useState<PortalRegistration | null>(null);
  const [content, setContent] = useState<PortalContent | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("overview");

  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
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
        body: JSON.stringify({
          email: email.trim(),
          accessCode: accessCode.trim(),
        }),
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
      setActiveSection("overview");
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

                <h2 className={styles.brandTitle}>Event Portal</h2>
                <p className={styles.brandSubtitle}>
                  Sign in with the email address you registered with and the access code we sent
                  after your registration was approved.
                </p>

                <ul className={styles.brandList}>
                  <li>
                    <i className="fa-regular fa-circle-check" aria-hidden="true"></i>
                    Full 5-day event schedule
                  </li>
                  <li>
                    <i className="fa-regular fa-circle-check" aria-hidden="true"></i>
                    Exhibitors, partners &amp; sessions
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
                  Not approved yet?{" "}
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

                  <div className={styles.fieldGroup}>
                    <label htmlFor="portal-code" className={styles.label}>
                      Access Code
                    </label>
                    <input
                      id="portal-code"
                      type="text"
                      className={`form-control ${styles.input} ${styles.codeInput}`}
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                      placeholder="XXXX-XXXX"
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

  const navItems: Array<{ key: Section; label: string; icon: React.ReactNode }> = [
    { key: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { key: "schedule", label: "Event Schedule", icon: <CalendarDays size={18} /> },
    { key: "exhibitors", label: "Exhibitors", icon: <Building2 size={18} /> },
    { key: "partners", label: "Partners", icon: <Handshake size={18} /> },
    { key: "gallery", label: "Gallery", icon: <Camera size={18} /> },
  ];

  return (
    <main className={styles.dashboardPage}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <Image
            src="/assets/imgs/logo/logo.png"
            alt="Somaliland Diaspora Department"
            width={150}
            height={48}
            className={styles.sidebarLogo}
          />
          <span className={styles.sidebarTitle}>Diaspora Week Portal</span>
        </div>

        <nav className={styles.sidebarNav}>
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

        <div className={styles.sidebarFooter}>
          <Link href="/diaspora-week" className={styles.sidebarLink}>
            Back to Diaspora Week site
          </Link>
          <button type="button" className={styles.logoutButton} onClick={handleLogout}>
            <LogOut size={16} />
            Log Out
          </button>
        </div>
      </aside>

      <div className={styles.content}>
        <header className={styles.contentHeader}>
          <div>
            <h1>Welcome, {registration.name}</h1>
            <p>
              {registration.registrationType === "business" ? "Business" : "Individual"}{" "}
              registration &middot; {registration.city}
              {registration.city && registration.country ? ", " : ""}
              {registration.country}
            </p>
          </div>
          <span className={styles.statusBadge}>
            <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
            Approved
          </span>
        </header>

        {activeSection === "overview" && (
          <div className={styles.sectionBody}>
            <div className={styles.overviewGrid}>
              <div className={styles.overviewCard}>
                <span className={styles.overviewIcon}>
                  <CalendarDays size={22} />
                </span>
                <div>
                  <strong>{sortedDays.length || 5}</strong>
                  <span>Event Days</span>
                </div>
              </div>
              <div className={styles.overviewCard}>
                <span className={styles.overviewIcon}>
                  <Building2 size={22} />
                </span>
                <div>
                  <strong>{content.exhibitors.length}</strong>
                  <span>Exhibitors</span>
                </div>
              </div>
              <div className={styles.overviewCard}>
                <span className={styles.overviewIcon}>
                  <Handshake size={22} />
                </span>
                <div>
                  <strong>{content.partners.length}</strong>
                  <span>Partners</span>
                </div>
              </div>
              <div className={styles.overviewCard}>
                <span className={styles.overviewIcon}>
                  <Camera size={22} />
                </span>
                <div>
                  <strong>{content.gallery.length}</strong>
                  <span>Gallery Items</span>
                </div>
              </div>
            </div>

            <div className={styles.profileCard}>
              <span className={styles.profileIcon}>
                <User size={22} />
              </span>
              <div>
                <h3>Your Registration</h3>
                <ul className={styles.profileList}>
                  <li>
                    <strong>Name:</strong> {registration.name}
                  </li>
                  <li>
                    <strong>Email:</strong> {registration.email}
                  </li>
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
          </div>
        )}

        {activeSection === "schedule" && (
          <div className={styles.sectionBody}>
            {sortedDays.length === 0 ? (
              <p className={styles.emptyState}>The full schedule will be published soon.</p>
            ) : (
              sortedDays.map((dayNumber) => (
                <div className={styles.dayBlock} key={dayNumber}>
                  <h2 className={styles.dayHeading}>
                    {scheduleByDay[dayNumber][0]?.dayLabel || `Day ${dayNumber}`}
                    {scheduleByDay[dayNumber][0]?.date && (
                      <span className={styles.dayHeadingDate}>
                        {scheduleByDay[dayNumber][0].date}
                      </span>
                    )}
                  </h2>
                  <div className={styles.sessionList}>
                    {scheduleByDay[dayNumber].map((session) => (
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
                </div>
              ))
            )}
          </div>
        )}

        {activeSection === "exhibitors" && (
          <div className={styles.sectionBody}>
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
        )}

        {activeSection === "partners" && (
          <div className={styles.sectionBody}>
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
        )}

        {activeSection === "gallery" && (
          <div className={styles.sectionBody}>
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
        )}
      </div>
    </main>
  );
}
