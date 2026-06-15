"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  CalendarDays,
  Camera,
  Handshake,
  MapPin,
  User,
} from "lucide-react";
import styles from "./page.module.css";

const DW_PHOTOS = [
  "/assets/imgs/Diaspora Week 2025/526662922_1167327548769637_8258044179086207429_n.jpg",
  "/assets/imgs/Diaspora Week 2025/526843704_1167334772102248_1967425005920803411_n.jpg",
  "/assets/imgs/Diaspora Week 2025/527054742_1167225798779812_6423692539836071481_n.jpg",
  "/assets/imgs/Diaspora Week 2025/527077783_1167227228779669_8491341035157829253_n.jpg",
  "/assets/imgs/Diaspora Week 2025/527426570_1169233348579057_2900217355379882609_n.jpg",
  "/assets/imgs/Diaspora Week 2025/527691517_1167226418779750_3577322439121286715_n.jpg",
  "/assets/imgs/Diaspora Week 2025/528070011_1167334945435564_8790450703157594751_n.jpg",
  "/assets/imgs/Diaspora Week 2025/528294853_1167925655376493_3014786838341524566_n.jpg",
  "/assets/imgs/Diaspora Week 2025/528345424_1169233925245666_1511022412967923258_n.jpg",
  "/assets/imgs/Diaspora Week 2025/528393697_1169233671912358_7811958595603563909_n.jpg",
  "/assets/imgs/Diaspora Week 2025/528603324_1169233405245718_3332848329999857221_n.jpg",
];

const SAMPLE_VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

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
      setActiveSection("schedule");
    } catch {
      setLoginError("Unable to sign in right now. Please try again.");
    } finally {
      setLoginLoading(false);
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

  const scheduleQuickDays = sortedDays.length > 0 ? sortedDays : [1, 2, 3, 4];

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
            <Link href="/diaspora-week" className={styles.backToSiteButton}>
              <i className="fa-regular fa-arrow-left" aria-hidden="true"></i>
              Back to Main Website
            </Link>
          </div>
        </div>
      </header>

      {activeSection === "home" && (
        <>
          <section className={styles.hero}>
            <div className={styles.heroBg}>
              <img
                src="/assets/imgs/Diaspora Week 2025/hero-flags-crowd.jpg"
                alt=""
                className={styles.heroBgImage}
              />
            </div>
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
                  <strong>{content.gallery.length || DW_PHOTOS.length + 1}</strong>
                  <span>Gallery Items</span>
                </div>
              </div>
            </div>
          </section>

          {/* Recap of Opening Day */}
          <section className={styles.recapSection}>
            <div className="container">
              <span className={styles.kicker}>Highlights</span>
              <h2 className={styles.sectionTitle}>Recap of Opening Day</h2>
              <p className={styles.sectionLead}>
                Watch highlights from the opening ceremony of Somaliland Diaspora Week 2025.
              </p>
              <div className={styles.recapVideoWrap}>
                <video
                  className={styles.recapVideo}
                  src={SAMPLE_VIDEO_URL}
                  poster={DW_PHOTOS[1]}
                  controls
                />
              </div>
            </div>
          </section>

          {/* Theme */}
          <section className={styles.themeSection}>
            <div className="container">
              <div className={styles.themeGrid}>
                <div className={styles.themeImageWrap}>
                  <img src={DW_PHOTOS[2]} alt="Diaspora Week 2025" className={styles.themeImage} />
                </div>
                <div className={styles.themeText}>
                  <span className={styles.kicker}>Theme</span>
                  <h2 className={styles.sectionTitle}>&ldquo;Redefining the Role of Diaspora&rdquo;</h2>
                  <p className={styles.themeSubtitle}>From Benefactor to Strategic Partner</p>
                  <p className={styles.sectionLead}>
                    This Diaspora Week, we celebrate a powerful shift: from giving back to
                    building forward. Redefining the Role of Diaspora &mdash; From Benefactor to
                    Strategic Partner calls on Somalilanders around the world to stand not just
                    as supporters, but as co-architects of our nation&apos;s future, investing
                    ideas, skills, and resources to shape lasting progress together.
                  </p>
                  <p className={styles.themeVenue}>
                    <MapPin size={16} /> Venue: Hotel Guuleed
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Goals */}
          <section className={styles.goalsSection}>
            <div className="container">
              <span className={styles.kicker}>Why We Gather</span>
              <h2 className={styles.sectionTitle}>Our Goals</h2>
              <p className={styles.sectionLead}>
                Five priorities guide everything we do during Diaspora Week 2025.
              </p>
              <div className={styles.goalsList}>
                <div className={styles.goalRow}>
                  <span className={styles.goalNumber}>01</span>
                  <div className={styles.goalRowBody}>
                    <h3>Engage the Diaspora</h3>
                    <p>
                      Engage the diaspora in Somaliland&apos;s socio-economic and political
                      development.
                    </p>
                  </div>
                </div>
                <div className={styles.goalRow}>
                  <span className={styles.goalNumber}>02</span>
                  <div className={styles.goalRowBody}>
                    <h3>Co-Create Policy</h3>
                    <p>Provide a platform to co-create diaspora-related policies and programs.</p>
                  </div>
                </div>
                <div className={styles.goalRow}>
                  <span className={styles.goalNumber}>03</span>
                  <div className={styles.goalRowBody}>
                    <h3>Drive Investment</h3>
                    <p>Facilitate investment, innovation, and knowledge exchange.</p>
                  </div>
                </div>
                <div className={styles.goalRow}>
                  <span className={styles.goalNumber}>04</span>
                  <div className={styles.goalRowBody}>
                    <h3>Strengthen Identity</h3>
                    <p>
                      Strengthen cultural identity and youths&apos; generational connection to
                      Somaliland.
                    </p>
                  </div>
                </div>
                <div className={styles.goalRow}>
                  <span className={styles.goalNumber}>05</span>
                  <div className={styles.goalRowBody}>
                    <h3>Showcase &amp; Network</h3>
                    <p>Showcase diaspora achievements and provide networking opportunities.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Event Schedule quick access */}
          <section className={styles.scheduleQuickSection}>
            <div className="container">
              <span className={styles.kicker}>{scheduleQuickDays.length}-Day Program</span>
              <h2 className={styles.sectionTitle}>Event Schedule</h2>
              <p className={styles.sectionLead}>
                Tap a day to jump straight to its sessions, speakers and locations.
              </p>
              <div className={styles.dayButtonGrid}>
                {scheduleQuickDays.map((dayNumber) => {
                  const firstSession = scheduleByDay[dayNumber]?.[0];
                  return (
                    <button
                      key={dayNumber}
                      type="button"
                      className={`${styles.dayButton} ${styles[`dayButton${dayNumber}`] || styles.dayButton1}`}
                      onClick={() => {
                        setActiveDay(dayNumber);
                        setActiveSection("schedule");
                      }}
                    >
                      <span className={styles.dayButtonLabel}>DAY {dayNumber}</span>
                      <span className={styles.dayButtonTitle}>
                        {firstSession?.title || "Sessions & Activities"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Exhibitors preview */}
          <section className={styles.tabSection}>
            <div className="container">
              <span className={styles.kicker}>Showcase</span>
              <h2 className={styles.sectionTitle}>Exhibitors</h2>
              <p className={styles.sectionLead}>
                Diaspora businesses, NGOs, community groups and diaspora-led initiatives
                showcase their work to hundreds of attendees, investors and partners during
                Diaspora Week 2025.
              </p>
              <div className={styles.previewImageGrid}>
                <img src={DW_PHOTOS[3]} alt="Exhibitors at Diaspora Week" />
                <img src={DW_PHOTOS[4]} alt="Exhibitors at Diaspora Week" />
                <img src={DW_PHOTOS[5]} alt="Exhibitors at Diaspora Week" />
              </div>
              <button type="button" className={styles.previewLinkButton} onClick={() => setActiveSection("exhibitors")}>
                <Building2 size={18} />
                View All Exhibitors
              </button>
            </div>
          </section>

          {/* Startup Pitching Sessions */}
          <section className={`${styles.tabSection} ${styles.tabSectionAlt}`}>
            <div className="container">
              <span className={styles.kicker}>Innovation Stage</span>
              <h2 className={styles.sectionTitle}>Startup Pitching Sessions</h2>
              <div className={styles.previewSplit}>
                <div className={styles.previewImageGrid}>
                  <img src={DW_PHOTOS[6]} alt="Startup pitching session" />
                  <img src={DW_PHOTOS[7]} alt="Startup pitching session" />
                </div>
                <p className={styles.sectionLead}>
                  As part of the week&apos;s programming, a dedicated Startup Pitching Session
                  showcases innovative ideas and high-potential startups driven by Somaliland&apos;s
                  aspiring entrepreneurs, including returnees, diaspora members, and local
                  founders.
                </p>
              </div>
              <button type="button" className={styles.previewLinkButton} onClick={() => setActiveSection("schedule")}>
                <CalendarDays size={18} />
                View Pitching Schedule
              </button>
            </div>
          </section>

          {/* Explore more */}
          <section className={styles.aboutSection}>
            <div className="container">
              <span className={styles.kicker}>Explore More</span>
              <h2 className={styles.sectionTitle}>Partners &amp; Gallery</h2>
              <div className={styles.quickLinks}>
                <button type="button" className={styles.quickLinkCard} onClick={() => setActiveSection("partners")}>
                  <img src={DW_PHOTOS[8]} alt="" className={styles.quickLinkImage} />
                  <div className={styles.quickLinkBody}>
                    <Handshake size={20} />
                    <div>
                      <h3>Partners</h3>
                      <p>Meet the partners supporting Diaspora Week 2025.</p>
                    </div>
                  </div>
                </button>
                <button type="button" className={styles.quickLinkCard} onClick={() => setActiveSection("gallery")}>
                  <img src={DW_PHOTOS[9]} alt="" className={styles.quickLinkImage} />
                  <div className={styles.quickLinkBody}>
                    <Camera size={20} />
                    <div>
                      <h3>Gallery</h3>
                      <p>Photos and videos from across the event.</p>
                    </div>
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
                {content.exhibitors.map((item, index) => (
                  <div className={styles.entityCard} key={item.id}>
                    <img
                      src={item.logo || DW_PHOTOS[(index + 7) % DW_PHOTOS.length]}
                      alt={item.name}
                      className={styles.entityLogo}
                    />
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
                {content.partners.map((item, index) => (
                  <div className={styles.entityCard} key={item.id}>
                    <img
                      src={item.logo || DW_PHOTOS[(index + 2) % DW_PHOTOS.length]}
                      alt={item.name}
                      className={styles.entityLogo}
                    />
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

            {content.gallery.length > 0 ? (
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
            ) : (
              <div className={styles.galleryGrid}>
                <div className={styles.galleryItem}>
                  <video src={SAMPLE_VIDEO_URL} controls />
                </div>
                {DW_PHOTOS.map((src) => (
                  <div className={styles.galleryItem} key={src}>
                    <img src={src} alt="Diaspora Week 2025" />
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
