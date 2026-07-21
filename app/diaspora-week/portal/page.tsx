"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  CalendarDays,
  Camera,
  CheckCircle2,
  Handshake,
  MapPin,
  PartyPopper,
  Sparkles,
  Star,
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

const SAMPLE_VIDEO_URL = "/assets/videos/diaspora-week-hero.mp4";

const DAY_ICONS = [Sparkles, Handshake, Star, PartyPopper, Sparkles];

const DAY_THEMES: Record<number, string> = {
  1: "Opening Day Ceremony",
  2: "Somaliland & Its Global Citizens: A New Partnership Model",
  3: "Closing Gala Evening",
  4: "Youth, Culture & Identity",
};

const DAY_PHOTOS: Record<number, string> = {
  1: "/assets/imgs/Diaspora Week 2025/526662922_1167327548769637_8258044179086207429_n.jpg",
  2: "/diaspora-img.png",
  3: "/diaspora-img.png",
  4: "/diaspora-img.png",
  5: "/diaspora-img.png",
};

const FALLBACK_SCHEDULE: ScheduleItem[] = [
  // ══ DAY 1 — Hargeisa, Sunday August 2 (Opening Day Ceremony) ══
  { id: "d1-1",  dayNumber: 1, dayLabel: "Day 1 · Hargeisa", date: "August 2, 2026", startTime: "08:30", endTime: "09:00", title: "Guest Arrival and Registration",  description: "", speaker: "", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Program Highlight" },
  { id: "d1-2",  dayNumber: 1, dayLabel: "Day 1 · Hargeisa", date: "August 2, 2026", startTime: "09:00", endTime: "09:10", title: "Quran, National Anthem and Cultural Dance", description: "", speaker: "", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Program Highlight" },
  { id: "d1-3",  dayNumber: 1, dayLabel: "Day 1 · Hargeisa", date: "August 2, 2026", startTime: "09:10", endTime: "09:15", title: "Welcome Remarks", description: "", speaker: "", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Program Highlight" },
  { id: "d1-4",  dayNumber: 1, dayLabel: "Day 1 · Hargeisa", date: "August 2, 2026", startTime: "09:15", endTime: "09:25", title: "H.E. Abdirahman Dahir Adam", description: "Speech by Minister of Foreign Affairs & International Cooperation", speaker: "H.E. Abdirahman Dahir Adam", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Program Highlight" },
  { id: "d1-5",  dayNumber: 1, dayLabel: "Day 1 · Hargeisa", date: "August 2, 2026", startTime: "09:25", endTime: "09:35", title: "H.E. Khadar Hussien Abdi", description: "Speech by Minister of the Presidency", speaker: "H.E. Khadar Hussien Abdi", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Program Highlight" },
  { id: "d1-6",  dayNumber: 1, dayLabel: "Day 1 · Hargeisa", date: "August 2, 2026", startTime: "09:35", endTime: "09:55", title: "Speeches from Diaspora Leaders", description: "Hibo Ali Hussein\nEng. Ahmed Jama\nAhmed Hersi Madar\nCumar Hassan Libaan\nSicid Ahmed Ali", speaker: "", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Program Highlight" },
  { id: "d1-7",  dayNumber: 1, dayLabel: "Day 1 · Hargeisa", date: "August 2, 2026", startTime: "09:55", endTime: "10:05", title: "Ougbad Nassir Omar", description: "Keynote Speech – Somaliland and its Global Citizens", speaker: "Ougbad Nassir Omar, Director, Diaspora Department", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Program Highlight" },
  { id: "d1-8",  dayNumber: 1, dayLabel: "Day 1 · Hargeisa", date: "August 2, 2026", startTime: "10:05", endTime: "10:25", title: "H.E. President Abdirahman Mohamed (Irro)", description: "Presidential Address", speaker: "H.E. President Abdirahman Mohamed (Irro)", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Program Highlight" },
  { id: "d1-9",  dayNumber: 1, dayLabel: "Day 1 · Hargeisa", date: "August 2, 2026", startTime: "10:25", endTime: "10:35", title: "Refreshments", description: "", speaker: "", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Program Highlight" },
  { id: "d1-10", dayNumber: 1, dayLabel: "Day 1 · Hargeisa", date: "August 2, 2026", startTime: "10:35", endTime: "11:35", title: "High-Level Panel Discussion", description: "Redefining the Role of the Diaspora: From Benefactor to Strategic Partner\n\nModerator: Mushtaaq\n\nPanellists:\nJama Egal, Scholar and Senior Advisor to MoFAIC\nAnab Yussuf, Canadian Public Servant, President & Co-founder, Akhri Foundation\nMohamed Ahmed Askar, seasoned governance expert", speaker: "", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Panel" },

  // ══ DAY 2 — Somaliland & Its Global Citizens: A New Partnership Model ══
  { id: "d2-1",  dayNumber: 2, dayLabel: "Day 2 · Hargeisa", date: "August 3, 2026", startTime: "09:00", endTime: "09:15", title: "Registration", description: "", speaker: "", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Program Highlight" },
  { id: "d2-2",  dayNumber: 2, dayLabel: "Day 2 · Hargeisa", date: "August 3, 2026", startTime: "09:15", endTime: "09:30", title: "Recap & Welcome Remarks", description: "", speaker: "", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Program Highlight" },
  { id: "d2-3",  dayNumber: 2, dayLabel: "Day 2 · Hargeisa", date: "August 3, 2026", startTime: "09:30", endTime: "10:30", title: "Panel 1: Diaspora and Somaliland's International Engagement: Recognition, Advocacy & Influence", description: "Moderator: Fatima Omer\n\nPanellists:\nMP Mohamed Hassan Saed, Chair, Foreign Affairs, International Cooperation, Planning & Investment Committee of the House of Representatives\nAbdi Shakur Hussein Osman, Somaliland Immigration\nFatima Saeed Ibrahim, Senior Foreign Affairs Advisor, Upper House\nDr. Muna Magan, Founder, Riyan Organics", speaker: "", location: "Main Hall", sessionType: "Panel" },
  { id: "d2-4",  dayNumber: 2, dayLabel: "Day 2 · Hargeisa", date: "August 3, 2026", startTime: "09:30", endTime: "10:30", title: "Pitch Session: Startups Showcase", description: "", speaker: "", location: "Hall 2", sessionType: "Program Highlight" },
  { id: "d2-5",  dayNumber: 2, dayLabel: "Day 2 · Hargeisa", date: "August 3, 2026", startTime: "10:30", endTime: "10:45", title: "Refreshments", description: "", speaker: "", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Program Highlight" },
  { id: "d2-6",  dayNumber: 2, dayLabel: "Day 2 · Hargeisa", date: "August 3, 2026", startTime: "10:45", endTime: "11:45", title: "Panel 2: Unlocking Investment Potential: Legal, Financial & Institutional Support for Diaspora", description: "Moderator: Hana Kaise\n\nPanellists:\nMohamed Abdillahi Hassan, Founder & CEO, Fusion Remit Planning & Investment\nKhalid Mohamed Yasin, Operations Manager, Darasalaam\nMubarak Abdi Ismail, Lawyer, Somaliland House of Representatives\nProf. Adan Ismail Hassan, Economist\nHamza Khaire, Deputy Governor, Central Bank of Somaliland", speaker: "", location: "Main Hall", sessionType: "Panel" },
  { id: "d2-7",  dayNumber: 2, dayLabel: "Day 2 · Hargeisa", date: "August 3, 2026", startTime: "10:45", endTime: "11:45", title: "Roundtable (Closed): Ministries and Diaspora Policy Priorities", description: "", speaker: "", location: "Hall 2", sessionType: "Program Highlight" },

  // ══ DAY 3 — Closing Gala Evening ══
  { id: "d3-1",  dayNumber: 3, dayLabel: "Day 3 · Boorama", date: "August 4, 2026", startTime: "06:00", endTime: "07:00", title: "Gala Evening Registration", description: "", speaker: "", location: "Safari Hotel, Boorama", sessionType: "Program Highlight" },
  { id: "d3-2",  dayNumber: 3, dayLabel: "Day 3 · Boorama", date: "August 4, 2026", startTime: "07:05", endTime: "07:15", title: "Mohammed Abdirahman", description: "Opening Remarks", speaker: "Mohammed Abdirahman, Director General Ministry of Foreign Affairs and International Cooperation", location: "Safari Hotel, Boorama", sessionType: "Program Highlight" },
  { id: "d3-3",  dayNumber: 3, dayLabel: "Day 3 · Boorama", date: "August 4, 2026", startTime: "07:15", endTime: "07:30", title: "Recap Video & Highlights Presentation", description: "", speaker: "", location: "Safari Hotel, Boorama", sessionType: "Program Highlight" },
  { id: "d3-4",  dayNumber: 3, dayLabel: "Day 3 · Boorama", date: "August 4, 2026", startTime: "07:30", endTime: "08:00", title: "Commitments: Diaspora Pledge", description: "", speaker: "", location: "Safari Hotel, Boorama", sessionType: "Program Highlight" },
  { id: "d3-5",  dayNumber: 3, dayLabel: "Day 3 · Boorama", date: "August 4, 2026", startTime: "08:00", endTime: "09:40", title: "Cultural Performances & Gala Dinner", description: "Maxamed BK\nHodan Omar Dhuule\nUgbaad Aragsan\nMaxamed Maame", speaker: "", location: "Safari Hotel, Boorama", sessionType: "Cultural Showcase" },
  { id: "d3-6",  dayNumber: 3, dayLabel: "Day 3 · Boorama", date: "August 4, 2026", startTime: "09:40", endTime: "10:00", title: "Ayan Osman", description: "Closing Remarks & Diaspora Week Planning Committee", speaker: "Ayan Osman, Advisor Diaspora Department, Ministry of Foreign Affairs & International Cooperation", location: "Safari Hotel, Boorama", sessionType: "Program Highlight" },

  // ══ DAY 4 — Youth, Culture & Identity ══
  { id: "d4-1",  dayNumber: 4, dayLabel: "Day 4 · Burco", date: "August 5, 2026", startTime: "04:30", endTime: "05:30", title: "Fun Day: Youth Activities", description: "Engaging the younger generation in cultural crafts, weaving and pottery.", speaker: "", location: "Plaza Hotel, Burco", sessionType: "Program Highlight" },
  { id: "d4-2",  dayNumber: 4, dayLabel: "Day 4 · Burco", date: "August 5, 2026", startTime: "05:30", endTime: "06:30", title: "Panel 1: Volunteering Smarter: Skills Transfer & Diaspora for Development", description: "Moderator: Hassan Farah Oman\n\nPanelists:\nAhmed Mahamud Askar, Founding member of Hargeisa Debates\nAhmed Yusuf Gool'adde, Director of Public Relations, University of Hargeisa\nFathia Ali Abdallah, Labor Mobility Human Development Division, IOM\nHodo Cabdi Cali Botan, Writer, Investigative Journalist, Strategic Communications Advisor, and Media Scholar", speaker: "", location: "Plaza Hotel, Burco", sessionType: "Panel" },
  { id: "d4-3",  dayNumber: 4, dayLabel: "Day 4 · Burco", date: "August 5, 2026", startTime: "06:30", endTime: "07:30", title: "Panel 2: Language, Identity & Belonging: Diaspora Youth & Somaliland", description: "Moderator: Dr. Jama Muse Jama\n\nPanelists:\nMaxamed Xasan Cali (Weji), Director, Department of Culture, Ministry of Information, Culture and Guidance\nAmirah Abdullah, Civil Engineer, Speaker, and Consultant\nHawa Dubde Gorrah, Hargeisa Deaf Club", speaker: "", location: "Plaza Hotel, Burco", sessionType: "Panel" },
  { id: "d4-4",  dayNumber: 4, dayLabel: "Day 4 · Burco", date: "August 5, 2026", startTime: "07:30", endTime: "08:15", title: "Cultural Exhibition", description: "Fashion Show, storytelling, poetry, and photography.", speaker: "", location: "Plaza Hotel, Burco", sessionType: "Cultural Showcase" },
  { id: "d4-5",  dayNumber: 4, dayLabel: "Day 4 · Burco", date: "August 5, 2026", startTime: "08:15", endTime: "09:00", title: "Intergenerational Dialogue Circle", description: "Elders & diaspora youth share experiences.", speaker: "", location: "Plaza Hotel, Burco", sessionType: "Program Highlight" },
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

type Section = "home" | "schedule" | "gallery";

export default function DiasporaWeekPortalPage() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<PortalContent | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [activeDay, setActiveDay] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const portalRes = await fetch("/api/diaspora-week/portal/public", { cache: "no-store" });
        const result = await portalRes.json().catch(() => null);
        if (portalRes.ok && result?.data) setContent(result.data);
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

  const safeContent: PortalContent = {
    schedule: content?.schedule && content.schedule.length > 0 ? content.schedule : FALLBACK_SCHEDULE,
    exhibitors: content?.exhibitors ?? [],
    partners: content?.partners ?? [],
    gallery: content?.gallery ?? [],
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

  const scheduleQuickDays = sortedDays.length > 0 ? sortedDays : [1, 2, 3, 4, 5];

  const navItems: Array<{ key: Section; label: string; icon: React.ReactNode }> = [
    { key: "home", label: "Home", icon: <i className="fa-regular fa-house" aria-hidden="true"></i> },
    // { key: "schedule", label: "Event Schedule", icon: <CalendarDays size={16} /> },
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
          {/* ══ HERO ══ */}
          <section className={styles.homeHero}>
            <div className={styles.homeHeroBg}>
              <img src="/assets/imgs/Diaspora Week 2025/hero-flags-crowd.jpg" alt="" className={styles.homeHeroBgImg} />
            </div>
            <div className={styles.homeHeroOverlay} />
            <div className={styles.homeHeroBlob1} aria-hidden="true" />
            <div className={styles.homeHeroBlob2} aria-hidden="true" />
            <div className={`container ${styles.homeHeroContent}`}>
              <span className={styles.homeHeroBadge}>
                <CalendarDays size={14} />
                August 2 &ndash; 6, 2026 &nbsp;&middot;&nbsp; Hargeisa, Borama &amp; Burao
              </span>
              <h1 className={styles.homeHeroTitle}>
                Somaliland <span className={styles.homeHeroAccent}>Diaspora</span> Week 2026
              </h1>
              <p className={styles.homeHeroSubtitle}>
                A multi-city roadshow connecting local roots to global recognition. Join us as
                we build Somaliland&apos;s future together.
              </p>
              <div className={styles.homeHeroCtas}>
                <Link href="/diaspora-week/register" className={styles.homeHeroCtaPrimary}>
                  Register to Participate
                  <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </Link>
                <button type="button" className={styles.homeHeroCtaSecondary} onClick={() => setActiveSection("schedule")}>
                  <CalendarDays size={16} />
                  View Schedule
                </button>
              </div>
            </div>
            <div className={styles.homeHeroStatsBar}>
              <div className="container">
                <div className={styles.heroRoadshowGrid}>
                  {[
                    {
                      city: "Hargeisa",
                      date: "August 2–3",
                      theme: "Governance, Finance & Innovation and National Investment",
                      accent: "#1f8a3b",
                      soft: "rgba(31,138,59,0.18)",
                      icon: "🏛️",
                    },
                    {
                      city: "Borama",
                      date: "August 4",
                      theme: "Knowledge, Agriculture, Mining, Cross-Border Trade & Tourism",
                      accent: "#0070c0",
                      soft: "rgba(0,112,192,0.18)",
                      icon: "🌾",
                    },
                    {
                      city: "Burao",
                      date: "August 5",
                      theme: "Livestock, Industry & Productive Economy",
                      accent: "#b45309",
                      soft: "rgba(180,83,9,0.18)",
                      icon: "🏭",
                    },
                  ].map((c) => (
                    <div
                      key={c.city}
                      className={styles.heroRoadshowCard}
                      style={{ "--city-accent": c.accent, "--city-soft": c.soft } as React.CSSProperties}
                    >
                      <div className={styles.heroRoadshowCardTop}>
                        <span className={styles.heroRoadshowIcon}>{c.icon}</span>
                        <div>
                          <span className={styles.heroRoadshowCity}>{c.city}</span>
                          <span className={styles.heroRoadshowCardDate}>{c.date}</span>
                        </div>
                      </div>
                      <p className={styles.heroRoadshowTheme}>{c.theme}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ══ THEME ══ */}
          <section className={styles.homeThemeSection}>
            {/* decorative background blobs */}
            <div className={styles.homeThemeBlobA} aria-hidden="true" />
            <div className={styles.homeThemeBlobB} aria-hidden="true" />

            <div className="container">
              <div className={styles.homeThemeGrid}>

                {/* ── Image column ── */}
                <div className={styles.homeThemeVisual}>
                  <div className={styles.homeThemeImgWrap}>
                    <img
                      src="/diaspora-img.png"
                      alt="Somaliland Diaspora"
                      className={styles.homeThemeImgMain}
                    />
                    <div className={styles.homeThemeImgBadge}>
                      <Sparkles size={14} />
                      Diaspora Week 2026
                    </div>
                  </div>
                </div>

                {/* ── Text column ── */}
                <div className={styles.homeThemeText}>
                  <span className={styles.homeKicker}>2026 Theme</span>

                  <blockquote className={styles.homeThemeQuote}>
                    &ldquo;A Multi-City Roadshow: Connecting Local Roots to Global Recognition&rdquo;
                  </blockquote>

                  <p className={styles.homeThemeTagline}>From Local Roots to Global Recognition</p>

                  <p className={styles.homeThemeBody}>
                    Our diaspora is not an external supporter &mdash; they are the architects of the
                    modern Somaliland state. For over three decades the diaspora has financed
                    businesses, built institutions, and connected Somaliland to the world. This year,
                    the roadshow moves beyond a single venue to Hargeisa, Borama and Burao, proving
                    that development is national, not centralized.
                  </p>

                  <div className={styles.homeThemeDatePill}>
                    <CalendarDays size={15} />
                    August 2&ndash;6, 2026
                  </div>

                  <div className={styles.homeThemeVenueGrid}>
                    {[
                      { city: "Hargeisa", venue: "Serene Seravoir Hotel", day: "Day 1–2", accent: "#1f8a3b", soft: "#e3f5e9", icon: "🏛️" },
                      { city: "Borama",   venue: "Safari Hotel",          day: "Day 3",   accent: "#0070c0", soft: "#e1eefb", icon: "🌾" },
                      { city: "Burao",    venue: "Plaza Hotel",           day: "Day 4",   accent: "#b45309", soft: "#fdf0e1", icon: "🏭" },
                    ].map((v) => (
                      <div
                        className={styles.homeThemeVenueRow}
                        key={v.city}
                        style={{ "--venue-accent": v.accent, "--venue-accent-soft": v.soft } as React.CSSProperties}
                      >
                        <span className={styles.homeThemeVenueEmoji}>{v.icon}</span>
                        <span className={styles.homeThemeVenueText}>
                          <span className={styles.homeThemeVenueCity}>{v.city}</span>
                          <span className={styles.homeThemeVenueName}>{v.venue}</span>
                        </span>
                        <span className={styles.homeThemeVenueDay}>{v.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* ══ VIDEO ══ */}
          <section className={styles.homeVideoSection}>
            <div className="container">
              <div className={styles.homeVideoHeader}>
                <span className={styles.homeKicker}>Watch</span>
                <h2 className={styles.homeSectionTitle}>Relive the Opening Day</h2>
                <p className={styles.homeSectionLead}>Watch highlights from the opening ceremony of Somaliland Diaspora Week 2026.</p>
              </div>
              <div className={styles.homeVideoFrame}>
                <video className={styles.homeVideoEl} src={SAMPLE_VIDEO_URL} poster={DW_PHOTOS[1]} controls autoPlay muted playsInline loop />
              </div>
            </div>
          </section>

          {/* ══ GOALS ══ */}
          <section className={styles.homeGoalsSection}>
            <div className="container">
              <div className={styles.homeGoalsHeader}>
                <span className={styles.homeKicker}>Why We Gather</span>
                <h2 className={styles.homeSectionTitle}>Strategic Objectives & Goals</h2>
                <p className={styles.homeSectionLead}>Diaspora Week 2026 is committed to these priorities.</p>
              </div>
              <div className={styles.homeGoalsGrid}>
                {[
                  { n: "01", icon: <User size={22} />, title: "Engage the Diaspora", desc: "Engage the Somaliland diaspora in the country's socio-economic, cultural, and political development." },
                  { n: "02", icon: <Handshake size={22} />, title: "Facilitate Investment", desc: "Facilitate investment, innovation, entrepreneurship, and knowledge exchange between diaspora professionals, businesses, government and development partners." },
                  { n: "03", icon: <Building2 size={22} />, title: "Showcase Opportunities", desc: "Showcase city-level and regional investment opportunities, sector strengths, and development priorities across Somaliland." },
                  { n: "04", icon: <Sparkles size={22} />, title: "Promote Partnerships", desc: "Promote structured diaspora investment and partnership opportunities through B2B and B2G matchmaking and collaboration frameworks." },
                  { n: "05", icon: <Star size={22} />, title: "Strengthen Identity", desc: "Strengthen cultural identity, national cohesion, and intergenerational engagement between second-generation diaspora and Somaliland's heritage." },
                  { n: "06", icon: <PartyPopper size={22} />, title: "Co-Create Policy", desc: "Provide a platform for dialogue and co-creation of diaspora-related policies, programs, and institutional partnerships." },
                ].map((g) => (
                  <div className={styles.homeGoalCard} key={g.n}>
                    <div className={styles.homeGoalCardTop}>
                      <span className={styles.homeGoalNum}>{g.n}</span>
                      <span className={styles.homeGoalIcon}>{g.icon}</span>
                    </div>
                    <h3 className={styles.homeGoalTitle}>{g.title}</h3>
                    <p className={styles.homeGoalDesc}>{g.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══ SCHEDULE QUICK ACCESS ══ */}
          <section className={styles.homeScheduleSection}>
            <div className="container">
              <div className={styles.homeScheduleHeader}>
                <div>
                  <span className={styles.homeKicker}>{scheduleQuickDays.length}-Day Roadshow</span>
                  <h2 className={styles.homeSectionTitle}>Event Schedule</h2>
                  <p className={styles.homeSectionLead}>Tap a day to explore sessions, panels and locations across Hargeisa, Borama and Burao.</p>
                </div>
                <button type="button" className={styles.homeScheduleViewAll} onClick={() => setActiveSection("schedule")}>
                  Full Schedule
                  <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </button>
              </div>
              <div className={styles.homeDayGrid}>
                {scheduleQuickDays.map((dayNumber) => {
                  const firstSession = scheduleByDay[dayNumber]?.[0];
                  const dayPhoto = DAY_PHOTOS[dayNumber] ?? DW_PHOTOS[dayNumber % DW_PHOTOS.length];
                  return (
                    <button
                      key={dayNumber}
                      type="button"
                      className={`${styles.homeDayCard} ${styles[`homeDayCard${dayNumber}`] || ""}`}
                      onClick={() => { setActiveDay(dayNumber); setActiveSection("schedule"); }}
                    >
                      <div className={styles.homeDayCardBg}>
                        <img src={dayPhoto} alt="" />
                      </div>
                      <div className={styles.homeDayCardOverlay} />
                      <div className={styles.homeDayCardContent}>
                        <span className={styles.homeDayLabel}>DAY {dayNumber}</span>
                        <h3 className={styles.homeDayTitle}>
                          {firstSession?.title || DAY_THEMES[dayNumber] || "Sessions & Activities"}
                        </h3>
                        {firstSession?.date && <span className={styles.homeDayDate}>{firstSession.date}</span>}
                      </div>
                      <span className={styles.homeDayArrow} aria-hidden="true">&#8594;</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ══ GALLERY MOSAIC ══ */}
          <section className={styles.homeGallerySection}>
            <div className="container">
              <div className={styles.homeGalleryHeader}>
                <div>
                  <span className={styles.homeKicker}>Memories</span>
                  <h2 className={styles.homeSectionTitle}>Diaspora Week in Photos</h2>
                  <p className={styles.homeSectionLead}>Moments from across Hargeisa, Borama and Burao.</p>
                </div>
                <button type="button" className={styles.homeGalleryCta} onClick={() => setActiveSection("gallery")}>
                  <Camera size={16} />
                  View Full Gallery
                </button>
              </div>
              <div className={styles.homeGalleryMosaic}>
                {DW_PHOTOS.slice(0, 7).map((src, i) => (
                  <div key={src} className={`${styles.homeGalleryItem} ${styles[`homeGalleryItem${i + 1}`] || ""}`}>
                    <img src={src} alt={`Diaspora Week 2025 — photo ${i + 1}`} loading="lazy" />
                  </div>
                ))}
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
              <span className={styles.heroBadge}>{scheduleQuickDays.length}-Day Roadshow</span>
              <h1 className={styles.scheduleHeroTitle}>Event Schedule</h1>
              <p className={styles.scheduleHeroSubtitle}>
                Sessions, panels and locations across Hargeisa, Borama and Burao &mdash; from the
                opening ceremony in the capital to the closing gala and Diaspora Recognition Awards.
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

          {sortedDays.length === 0 ? (
            <section className={styles.tabSection}>
              <div className="container">
                <p className={styles.emptyState}>The full schedule will be published soon.</p>
              </div>
            </section>
          ) : (
            <div className={styles.pgWrapper}>
              {sortedDays.map((dayNumber, dayIndex) => {
                const sessions = scheduleByDay[dayNumber];
                const isFlipped = dayIndex % 2 === 1;
                const dayTitle = DAY_THEMES[dayNumber] || sessions[0]?.title || "";
                const venue    = sessions[0]?.location || "";
                const date     = sessions[0]?.date || "";

                // colour accent per day
                const DAY_ACCENTS: Record<number, string> = {
                  1: "#d4600a", 2: "#1f8a3b", 3: "#0070c0", 4: "#7c3aed", 5: "#b45309",
                };
                const accent = DAY_ACCENTS[dayNumber] ?? "#d4600a";

                // photo per day (replaces camel in the programme booklet)
                const dayPhoto = DAY_PHOTOS[dayNumber] ?? DW_PHOTOS[dayNumber % DW_PHOTOS.length];

                // sessions to display — skip meta-only rows
                const HIDDEN_TYPES = new Set(["Theme Anchor", "Focus Areas"]);
                const displaySessions = sessions.filter((s) => !HIDDEN_TYPES.has(s.sessionType));

                // split panel description into body + focus bullets
                const splitPanel = (desc: string) => {
                  const marker = "Focus Areas:";
                  const idx = desc.indexOf(marker);
                  if (idx === -1) return { body: desc, focusItems: [] };
                  const body = desc.slice(0, idx).trim();
                  const focusText = desc.slice(idx + marker.length).trim();
                  const focusItems = focusText
                    ? focusText.replace(/\.$/, "").split("; ").map((s) => s.replace(/^and\s+/i, "").trim()).filter(Boolean)
                    : [];
                  return { body, focusItems };
                };

                // award category bullets
                const splitAwards = (desc: string) =>
                  desc.replace(/^Award Categories:\s*/, "").replace(/\.$/, "").split(" • ").map((s) => s.trim()).filter(Boolean);

                // ── reusable: render one session row ──
                const renderRow = (s: ScheduleItem) => {
                  const time = s.startTime && s.endTime
                    ? `${s.startTime} – ${s.endTime}`
                    : s.startTime || "";

                  if (s.sessionType === "Panel") {
                    const { body, focusItems } = splitPanel(s.description);
                    const panelLines = body
                      ? body.split("\n").map((l) => l.trim()).filter(Boolean)
                      : [];
                    return (
                      <tr key={s.id} className={styles.pgRow}>
                        <td className={styles.pgTime}>{time}</td>
                        <td className={styles.pgCell}>
                          <strong className={styles.pgTitle}>{s.title}</strong>
                          {panelLines.map((line, i) => (
                            <span key={i} className={i === 0 ? styles.pgDesc2 : styles.pgSubLine}>{line}</span>
                          ))}
                          {focusItems.length > 0 && (
                            <ul className={styles.pgFocusList}>
                              {focusItems.map((f) => <li key={f}><CheckCircle2 size={13} />{f}</li>)}
                            </ul>
                          )}
                          {s.location && <span className={styles.pgLocation}><MapPin size={12} />{s.location}</span>}
                        </td>
                      </tr>
                    );
                  }

                  if (s.sessionType === "Awards") {
                    const cats = splitAwards(s.description);
                    return (
                      <tr key={s.id} className={styles.pgRow}>
                        <td className={styles.pgTime}>{time}</td>
                        <td className={styles.pgCell}>
                          <strong className={styles.pgTitle}>{s.title}</strong>
                          {cats.length > 0 && (
                            <ul className={styles.pgFocusList}>
                              {cats.map((c) => <li key={c}><Star size={13} />{c}</li>)}
                            </ul>
                          )}
                          {s.location && <span className={styles.pgLocation}><MapPin size={12} />{s.location}</span>}
                        </td>
                      </tr>
                    );
                  }

                  const descLines = s.description
                    ? s.description.split("\n").map((l) => l.trim()).filter(Boolean)
                    : [];
                  return (
                    <tr key={s.id} className={styles.pgRow}>
                      <td className={styles.pgTime}>{time}</td>
                      <td className={styles.pgCell}>
                        {descLines.length > 0 && (
                          <span className={styles.pgSuper}>{descLines[0]}</span>
                        )}
                        <strong className={styles.pgTitle}>{s.title}</strong>
                        {descLines.slice(1).map((line, i) => (
                          <span key={i} className={styles.pgSubLine}>{line}</span>
                        ))}
                      </td>
                    </tr>
                  );
                };

                // ── split sessions into two halves ──
                const half = Math.ceil(displaySessions.length / 2);
                const part1 = displaySessions.slice(0, half);
                const part2 = displaySessions.slice(half);

                // ── Part 1 day header — text only, no image ──
                const DayHeaderCol = () => (
                  <div className={styles.pgDayHeader}>
                    <div className={styles.pgDayNumWrap}>
                      <span className={styles.pgDayLabel}>DAY</span>
                      <span className={styles.pgDayNum}>{dayNumber}</span>
                    </div>
                    <h2 className={styles.pgDayTitle}>{dayTitle}</h2>
                    {date  && <p className={styles.pgDayMeta}><CalendarDays size={16} />{date}</p>}
                    {venue && <p className={styles.pgDayMeta}><MapPin size={16} />{venue}</p>}
                  </div>
                );

                // Part 2 right-column photo — Day 1 uses president's official photo
                const PRESIDENT_IRRO_IMG = "/president.jpg";
                const dayPhoto2 = dayNumber === 1
                  ? PRESIDENT_IRRO_IMG
                  : "/diaspora-img.png";

                return (
                  <div
                    key={dayNumber}
                    id={`schedule-day-${dayNumber}`}
                    className={styles.pgDayBlock}
                    style={{ "--pg-accent": accent } as React.CSSProperties}
                  >
                    {/* ══ PART 1: Day header LEFT · Sessions RIGHT ══ */}
                    <div className={styles.pgPattern} aria-hidden="true" />
                    <div className="container">
                      <div className={styles.pgLayout}>

                        {/* left — cream header, text only */}
                        <DayHeaderCol />

                        {/* right — sessions table */}
                        <div className={styles.pgTableWrap}>
                          <table className={styles.pgTable}>
                            <tbody>{part1.map(renderRow)}</tbody>
                          </table>
                        </div>

                      </div>
                    </div>

                    {/* ══ PART 2: Sessions LEFT · Large photo RIGHT ══ */}
                    {part2.length > 0 && (
                      <>
                        <div className={styles.pgPatternMid} aria-hidden="true" />
                        <div className="container">
                          <div className={styles.pgLayout2}>

                            {/* left — sessions table */}
                            <div className={styles.pgTableWrap}>
                              <table className={styles.pgTable}>
                                <tbody>{part2.map(renderRow)}</tbody>
                              </table>
                            </div>

                            {/* right — full-height photo */}
                            <div className={styles.pgPhotoCol}>
                              <img
                                src={dayPhoto2}
                                alt={`Diaspora Week Day ${dayNumber}`}
                              />
                            </div>

                          </div>
                        </div>
                      </>
                    )}

                    <div className={styles.pgPattern} aria-hidden="true" />
                  </div>
                );
              })}
            </div>
          )}

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
