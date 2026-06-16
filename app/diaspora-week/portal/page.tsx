"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  CalendarDays,
  Camera,
  CheckCircle2,
  Eye,
  FileText,
  Handshake,
  MapPin,
  Package,
  PartyPopper,
  Rocket,
  Sparkles,
  Star,
  Unlock,
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

const DAY_ICONS = [Sparkles, Handshake, Star, PartyPopper, Sparkles];

const DAY_THEMES: Record<number, string> = {
  1: "Opening Ceremony & Presidential Address",
  2: "New Partnership Model & Startup Pitching",
  3: "Closing Ceremony & Cultural Gala",
  4: "Family & Cultural Fun Day",
};

const EXHIBITOR_BENEFITS = [
  {
    icon: Eye,
    title: "Increase Visibility",
    description:
      "Put your brand in front of hundreds of diaspora attendees, government representatives, and local partners.",
  },
  {
    icon: Handshake,
    title: "Build New Connections",
    description:
      "Meet potential investors, collaborators, and clients from Somaliland and abroad.",
  },
  {
    icon: Package,
    title: "Showcase Products & Services",
    description:
      "Demonstrate what you offer to an audience eager to support local and diaspora-driven initiatives.",
  },
  {
    icon: Unlock,
    title: "Unlock Opportunities",
    description:
      "Position your business to benefit from partnerships, sales leads, and future collaborations sparked during the event.",
  },
];

const SAMPLE_EXHIBITOR_LOGOS = [
  { name: "Kaaha Design", file: "kaaha-design.png" },
  { name: "AKHRI - Mothers and Daughters Literacy", file: "akhri-mothers.png" },
  { name: "Emaankoo Group", file: "emaankoo-group.png" },
  { name: "Call A Doctor", file: "call-a-doctor.png" },
  { name: "Fresh Harvest Co.", file: "fresh-harvest.png" },
  { name: "Saver Mobile Clinic", file: "saver-mobile-clinic.png" },
  { name: "Luxury Perfumes", file: "luxury-perfumes.png" },
  { name: "Kaabsan Real Estate", file: "kaabsan-real-estate.png" },
  { name: "DPD - Diaspora Property Developers", file: "dpd.png" },
  { name: "Eureka Coffee Roasters", file: "eureka.png" },
  { name: "WTI Somaliland & UK", file: "wti.png" },
  { name: "Yool Training Center", file: "yool-training-center.png" },
  { name: "Vista Real Estate", file: "vista-real-estate.png" },
  { name: "Subeer Real Estate", file: "subeer-real-estate.png" },
  { name: "My Land Code", file: "my-land-code.png" },
  { name: "Diyaar Local Food Processing", file: "diyaar.png" },
  { name: "Dhalin Jaab Initiative", file: "dhalin-jaab.png" },
  { name: "GoodLight Energy", file: "goodlight-energy.png" },
  { name: "Somaliland Leadership Academy", file: "somaliland-leadership-academy.png" },
  { name: "SAAFI - Somali Advice and Forum for Information", file: "saafi.png" },
  { name: "Riyan Organic", file: "riyan-organic.png" },
];

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

type PortalContent = {
  schedule: ScheduleItem[];
  exhibitors: ExhibitorItem[];
  partners: PartnerItem[];
  gallery: GalleryMediaItem[];
};

type Section = "home" | "schedule" | "exhibitors" | "pitching" | "gallery";

export default function DiasporaWeekPortalPage() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<PortalContent | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [activeDay, setActiveDay] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/diaspora-week/portal/public", { cache: "no-store" });
        const result = await response.json().catch(() => null);
        if (response.ok && result?.data) {
          setContent(result.data);
        }
      } catch {
        // keep null — fallbacks handle empty state
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <main className={styles.portalPage}>
        <div className={styles.loadingScreen}>
          <div className={styles.spinner} />
        </div>
      </main>
    );
  }

  const safeContent: PortalContent = content ?? {
    schedule: [],
    exhibitors: [],
    partners: [],
    gallery: [],
  };

  const scheduleByDay = safeContent.schedule.reduce<Record<number, ScheduleItem[]>>((acc, item) => {
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
    { key: "pitching", label: "Startup Pitching", icon: <Rocket size={16} /> },
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
            <Link href="/diaspora-week/register" className={styles.registerHeaderButton}>
              <User size={14} />
              Register to Participate
            </Link>
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
                Explore the full event schedule, exhibitors, partners and gallery.
                Want to participate at the venue? Register as an individual or business below.
              </p>

              <div className={styles.heroActions}>
                <Link href="/diaspora-week/register" className={styles.heroPrimaryCta}>
                  Register to Participate
                  <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </Link>
              </div>

              <div className={styles.heroStats}>
                <div className={styles.heroStat}>
                  <strong>{sortedDays.length || 4}</strong>
                  <span>Event Days</span>
                </div>
                <div className={styles.heroStat}>
                  <strong>{safeContent.exhibitors.length || "—"}</strong>
                  <span>Exhibitors</span>
                </div>
                <div className={styles.heroStat}>
                  <strong>{safeContent.partners.length || "—"}</strong>
                  <span>Partners</span>
                </div>
                <div className={styles.heroStat}>
                  <strong>{safeContent.gallery.length || DW_PHOTOS.length + 1}</strong>
                  <span>Gallery Items</span>
                </div>
              </div>
            </div>
          </section>

          {/* Participate CTA banner */}
          <section className={styles.participateBanner}>
            <div className={`container ${styles.participateBannerInner}`}>
              <div className={styles.participateText}>
                <h2>Want to exhibit or pitch at the venue?</h2>
                <p>
                  Individuals and businesses can register to secure a hall booth or a startup
                  pitching slot at Somaliland Diaspora Week 2025.
                </p>
              </div>
              <div className={styles.participateActions}>
                <Link href="/diaspora-week/register?type=individual" className={styles.participateCta}>
                  <User size={16} />
                  Register as Individual
                </Link>
                <Link href="/diaspora-week/register?type=business" className={styles.participateCtaAlt}>
                  <Building2 size={16} />
                  Register as Business
                </Link>
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
                        {firstSession?.title || DAY_THEMES[dayNumber] || "Sessions & Activities"}
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
              <h2 className={styles.sectionTitle}>Startup Pitching &amp; Gallery</h2>
              <div className={styles.quickLinks}>
                <button type="button" className={styles.quickLinkCard} onClick={() => setActiveSection("pitching")}>
                  <img src={DW_PHOTOS[8]} alt="" className={styles.quickLinkImage} />
                  <div className={styles.quickLinkBody}>
                    <Rocket size={20} />
                    <div>
                      <h3>Startup Pitching</h3>
                      <p>Apply to pitch your idea to investors and mentors.</p>
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
            </div>
          </section>
        </>
      )}

      {activeSection === "schedule" && (
        <>
          <section className={styles.scheduleHero}>
            <div className={styles.scheduleHeroBg}>
              <img
                src="/assets/imgs/Diaspora Week 2025/hero-flags-crowd.jpg"
                alt=""
                className={styles.scheduleHeroBgImage}
              />
            </div>
            <div className={styles.scheduleHeroOverlay}></div>
            <div className={`container ${styles.scheduleHeroContainer}`}>
              <span className={styles.heroBadge}>{scheduleQuickDays.length}-Day Program</span>
              <h1 className={styles.scheduleHeroTitle}>Event Schedule</h1>
              <p className={styles.scheduleHeroSubtitle}>
                Sessions, speakers and locations for every day of Diaspora Week 2025 &mdash; from
                the opening ceremony to the closing cultural gala.
              </p>

              {sortedDays.length > 0 && (
                <div className={styles.dayTabs}>
                  {sortedDays.map((dayNumber) => (
                    <a
                      key={dayNumber}
                      href={`#schedule-day-${dayNumber}`}
                      className={`${styles.dayTab} ${currentDay === dayNumber ? styles.dayTabActive : ""}`}
                      onClick={() => setActiveDay(dayNumber)}
                    >
                      <span>{scheduleByDay[dayNumber][0]?.dayLabel || `Day ${dayNumber}`}</span>
                      {scheduleByDay[dayNumber][0]?.date && (
                        <small>{scheduleByDay[dayNumber][0].date}</small>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className={styles.tabSection}>
            <div className="container">
            {sortedDays.length === 0 ? (
              <p className={styles.emptyState}>The full schedule will be published soon.</p>
            ) : (
              <div className={styles.scheduleDayList}>
                {sortedDays.map((dayNumber) => {
                  const sessions = scheduleByDay[dayNumber];
                  const DayIcon = DAY_ICONS[(dayNumber - 1) % DAY_ICONS.length];
                  return (
                    <div
                      key={dayNumber}
                      id={`schedule-day-${dayNumber}`}
                      className={`${styles.scheduleDayBlock} ${styles[`scheduleDay${dayNumber}`] || styles.scheduleDay1}`}
                    >
                      <div className={styles.scheduleDayIntro}>
                        <span className={styles.scheduleDayShape} aria-hidden="true">
                          <DayIcon size={32} />
                        </span>
                        <div className={styles.scheduleDayHeading}>
                          <span className={styles.scheduleDayLabel}>
                            {sessions[0]?.dayLabel || `Day ${dayNumber}`}
                          </span>
                          <h3>{DAY_THEMES[dayNumber] || sessions[0]?.title}</h3>
                          {sessions[0]?.date && (
                            <span className={styles.scheduleDayDate}>{sessions[0].date}</span>
                          )}
                        </div>
                      </div>

                      <div className={styles.sessionList}>
                        {sessions.map((session) => (
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
                  );
                })}
              </div>
            )}
            </div>
          </section>
        </>
      )}

      {activeSection === "exhibitors" && (
        <>
          <section className={styles.scheduleHero}>
            <div className={styles.scheduleHeroBg}>
              <img
                src="/assets/imgs/Diaspora Week 2025/hero-flags-crowd.jpg"
                alt=""
                className={styles.scheduleHeroBgImage}
              />
            </div>
            <div className={styles.scheduleHeroOverlay}></div>
            <div className={`container ${styles.scheduleHeroContainer}`}>
              <span className={styles.heroBadge}>Exhibitor Showcase</span>
              <h1 className={styles.scheduleHeroTitle}>Exhibitors</h1>
              <p className={styles.scheduleHeroSubtitle}>
                Present your brand, products and services to a diverse audience of diaspora
                community members, investors, development partners and local stakeholders.
              </p>
            </div>
          </section>

          <section className={styles.tabSection}>
            <div className="container">
              <div className={styles.exhibitIntro}>
                <span className={styles.kicker}>Exhibit With Us</span>
                <h2 className={styles.sectionTitle}>Showcase Your Work at Diaspora Week 2025</h2>
                <p className={styles.sectionLead}>
                  Diaspora Week 2025 invites businesses, NGOs, community groups, and diaspora-led
                  initiatives to showcase their work, products, and services to a diverse audience of
                  diaspora community members, investors, development partners, and local stakeholders.
                </p>
                <p className={styles.sectionLead}>
                  As an exhibitor, you will have the opportunity to present your brand, vision and
                  voice with potential customers and partners, and build meaningful relationships
                  within the Somaliland diaspora network. Exhibition spaces are available for the
                  first three days of the event from August 2nd to August 4th, with flexible booth
                  options to suit your needs.
                </p>
                <Link href="/diaspora-week/register?type=business" className={styles.exhibitRegisterCta}>
                  <Building2 size={16} />
                  Register a Business Booth
                </Link>
              </div>

              <div className={styles.exhibitInfoStrip}>
                <div className={styles.exhibitInfoItem}>
                  <CalendarDays size={22} />
                  <div>
                    <strong>Aug 2 &ndash; 4, 2025</strong>
                    <span>3 exhibition days</span>
                  </div>
                </div>
                <div className={styles.exhibitInfoItem}>
                  <Building2 size={22} />
                  <div>
                    <strong>Flexible Booths</strong>
                    <span>Sized to suit your needs</span>
                  </div>
                </div>
                <div className={styles.exhibitInfoItem}>
                  <Sparkles size={22} />
                  <div>
                    <strong>Diverse Audience</strong>
                    <span>Diaspora, investors &amp; partners</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={`${styles.tabSection} ${styles.tabSectionAlt}`}>
            <div className="container">
              <span className={styles.kicker}>Benefits for Business</span>
              <h2 className={styles.sectionTitle}>
                By Exhibiting at Diaspora Week 2025, Your Organization Will&hellip;
              </h2>

              <div className={styles.benefitsGrid}>
                {EXHIBITOR_BENEFITS.map((benefit) => {
                  const BenefitIcon = benefit.icon;
                  return (
                    <div className={styles.benefitCard} key={benefit.title}>
                      <span className={styles.benefitIcon}>
                        <BenefitIcon size={26} />
                      </span>
                      <h3>{benefit.title}</h3>
                      <p>{benefit.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className={styles.tabSection}>
            <div className="container">
              <span className={styles.kicker}>Confirmed Exhibitors</span>
              <h2 className={styles.sectionTitle}>Participating Organizations</h2>
              <p className={styles.sectionLead}>
                A growing line-up of businesses, NGOs and diaspora-led initiatives confirmed to
                exhibit at Diaspora Week 2025.
              </p>

              <div className={styles.logoCloud}>
                {SAMPLE_EXHIBITOR_LOGOS.map((logo) => (
                  <div className={styles.logoCloudItem} key={logo.name}>
                    <span className={styles.logoCloudMark}>
                      <img
                        src={`/assets/imgs/Diaspora Week 2025/exhibitor-logos/${logo.file}`}
                        alt={logo.name}
                        loading="lazy"
                      />
                    </span>
                    <span className={styles.logoCloudName}>{logo.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {activeSection === "pitching" && (
        <>
          {/* ── Hero ── */}
          <section className={styles.pitchHero}>
            <div className={styles.pitchHeroBg}>
              <img src={DW_PHOTOS[6]} alt="" className={styles.pitchHeroBgImage} />
            </div>
            <div className={styles.pitchHeroOverlay} />
            {/* Somali star-burst shapes */}
            <div className={styles.pitchStarA} aria-hidden="true" />
            <div className={styles.pitchStarB} aria-hidden="true" />
            <div className={`container ${styles.pitchHeroContainer}`}>
              <span className={styles.pitchHeroBadge}>
                <Rocket size={15} />
                Innovation Stage · Diaspora Week 2025
              </span>
              <h1 className={styles.pitchHeroTitle}>Startup Pitching Session</h1>
              <p className={styles.pitchHeroSubtitle}>
                Pitch your boldest ideas to investors, accelerators and mentors — and compete for
                seed funding, incubation opportunities and life-changing exposure.
              </p>
              <div className={styles.pitchHeroMeta}>
                <span><CalendarDays size={16} /> August 2 &ndash; 5, 2025</span>
                <span><MapPin size={16} /> Hotel Guuleed, Hargeisa</span>
              </div>
            </div>
          </section>

          {/* ── Somali divider ── */}
          <div className={styles.somaliDivider} aria-hidden="true">
            {Array.from({ length: 32 }).map((_, i) => (
              <span key={i} className={styles.somaliDividerCell} />
            ))}
          </div>

          {/* ── Information ── */}
          <section className={styles.pitchInfoSection}>
            <div className="container">
              <div className={styles.pitchInfoInner}>
                <span className={styles.pitchInfoKicker}>Information</span>
                <h2 className={styles.pitchInfoHeading}>
                  Are you an entrepreneur with a bold idea that can make a difference for
                  Somaliland?
                </h2>
                <p className={styles.pitchInfoBody}>
                  This Diaspora Week, we&apos;re giving innovators a unique stage to pitch their
                  startups to investors, accelerators, and mentors.
                </p>
                <p className={styles.pitchInfoBody}>
                  This live pitching event is open to local and diaspora founders with early-stage
                  ideas or growing businesses that need funding and support to scale. Finalists will
                  pitch to a panel of judges and an engaged audience, with the chance to win seed
                  funding, incubation opportunities, and valuable exposure.
                </p>

                <div className={styles.pitchInfoStats}>
                  <div className={styles.pitchInfoStat}>
                    <strong>Seed Funding</strong>
                    <span>Cash prizes for winners</span>
                  </div>
                  <div className={styles.pitchInfoStatDivider} />
                  <div className={styles.pitchInfoStat}>
                    <strong>Incubation</strong>
                    <span>Growth support opportunities</span>
                  </div>
                  <div className={styles.pitchInfoStatDivider} />
                  <div className={styles.pitchInfoStat}>
                    <strong>Live Audience</strong>
                    <span>Investors, mentors &amp; diaspora</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Somali divider ── */}
          <div className={styles.somaliDivider} aria-hidden="true">
            {Array.from({ length: 32 }).map((_, i) => (
              <span key={i} className={styles.somaliDividerCell} />
            ))}
          </div>

          {/* ── Eligibility Criteria ── */}
          <section className={styles.pitchEligibilitySection}>
            {/* Background cultural pattern */}
            <div className={styles.pitchEligBg} aria-hidden="true" />

            <div className="container">
              <h2 className={styles.pitchEligibilityTitle}>Eligibility Criteria</h2>

              <div className={styles.pitchEligGrid}>
                {/* Left — cultural visual panel */}
                <div className={styles.pitchCulturalPanel}>
                  <div className={styles.pitchCulturalFrame}>
                    <img
                      src={DW_PHOTOS[7]}
                      alt="Startup pitching at Diaspora Week"
                      className={styles.pitchCulturalPhoto}
                    />
                    <div className={styles.pitchCulturalGeomA} aria-hidden="true" />
                    <div className={styles.pitchCulturalGeomB} aria-hidden="true" />
                  </div>
                  {/* Side star decorations */}
                  <div className={styles.pitchCamelWrap} aria-hidden="true">
                    <svg viewBox="0 0 60 60" className={styles.pitchSideStarLeft}>
                      <polygon points="30,2 36,20 55,20 40,32 46,50 30,38 14,50 20,32 5,20 24,20" fill="#C8572A" />
                      <circle cx="30" cy="30" r="7" fill="#e07340" />
                    </svg>
                    <svg viewBox="0 0 60 60" className={styles.pitchSideStarRight}>
                      <polygon points="30,2 36,20 55,20 40,32 46,50 30,38 14,50 20,32 5,20 24,20" fill="#016D21" />
                      <circle cx="30" cy="30" r="7" fill="#1f8a3b" />
                    </svg>
                  </div>
                </div>

                {/* Right — criteria content */}
                <div className={styles.pitchEligContent}>
                  <div className={styles.pitchCriteriaCard}>
                    <div className={styles.pitchCriteriaIconWrap}>
                      <CheckCircle2 size={22} />
                    </div>
                    <div>
                      <h3 className={styles.pitchCriteriaLabel}>Eligibility</h3>
                      <p className={styles.pitchCriteriaText}>
                        Open to early-stage startups or founders who are Somaliland nationals or
                        diaspora members with a project directly benefiting Somaliland.
                      </p>
                    </div>
                  </div>

                  <div className={styles.pitchCriteriaCard}>
                    <div className={styles.pitchCriteriaIconWrap}>
                      <FileText size={22} />
                    </div>
                    <div>
                      <h3 className={styles.pitchCriteriaLabel}>Application Requirements</h3>
                      <p className={styles.pitchCriteriaText}>
                        Complete the official application form before the deadline{" "}
                        <strong>July 30, 2025.</strong>
                      </p>
                    </div>
                  </div>

                  <div className={styles.pitchDownloadButtons}>
                    <a
                      href="https://drive.google.com/file/d/1fLcAKeLjM-9zbNLlRxRIJ9HD79doEsCc/view"
                      target="_blank"
                      rel="noreferrer"
                      className={styles.pitchDownloadPrimary}
                    >
                      <FileText size={18} />
                      Rules &amp; Regulations
                    </a>
                    <a
                      href="/assets/docs/diaspora-week-application.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className={styles.pitchDownloadSecondary}
                    >
                      <FileText size={18} />
                      Application Form
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Prizes & What You Win ── */}
          <section className={styles.pitchPrizesSection}>
            <div className={styles.pitchPrizesBg} aria-hidden="true" />
            <div className="container">
              <span className={styles.pitchPrizesKicker}>What You Stand to Win</span>
              <h2 className={styles.pitchPrizesTitle}>Why You Should Apply</h2>
              <div className={styles.pitchPrizesGrid}>
                <div className={styles.pitchPrizeCard}>
                  <span className={styles.pitchPrizeNumber}>01</span>
                  <h3>Seed Funding</h3>
                  <p>Cash prizes awarded to top-ranked pitches by the judging panel.</p>
                </div>
                <div className={styles.pitchPrizeCard}>
                  <span className={styles.pitchPrizeNumber}>02</span>
                  <h3>Incubation Support</h3>
                  <p>Selected finalists gain access to incubation programs and mentorship networks.</p>
                </div>
                <div className={styles.pitchPrizeCard}>
                  <span className={styles.pitchPrizeNumber}>03</span>
                  <h3>Investor Connections</h3>
                  <p>Direct introductions to diaspora investors and development finance partners.</p>
                </div>
                <div className={styles.pitchPrizeCard}>
                  <span className={styles.pitchPrizeNumber}>04</span>
                  <h3>Media Exposure</h3>
                  <p>Coverage across diaspora media channels and the Somaliland Diaspora network.</p>
                </div>
              </div>

              <div className={styles.pitchApplyCta}>
                <Link href="/diaspora-week/register?pitch=1" className={styles.pitchApplyButton}>
                  <Rocket size={18} />
                  Apply to Pitch
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {activeSection === "gallery" && (
        <section className={styles.tabSection}>
          <div className="container">
            <span className={styles.kicker}>Memories</span>
            <h2 className={styles.sectionTitle}>Photo &amp; Video Gallery</h2>

            {safeContent.gallery.length > 0 ? (
              <div className={styles.galleryGrid}>
                {safeContent.gallery.map((item) => (
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
