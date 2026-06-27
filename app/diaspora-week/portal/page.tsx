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
  Handshake,
  Mail,
  MapPin,
  Megaphone,
  Package,
  PartyPopper,
  Phone,
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
  1: "Hargeisa — Governance, Finance & Innovation and National Investment",
  2: "Hargeisa — Governance, Finance & Innovation and National Investment (Day 2)",
  3: "Borama — Knowledge, Agriculture, Mining, Cross-Border Trade & Tourism",
  4: "Burao — Livestock, Industry & Productive Economy",
  5: "Hargeisa — Grand Finale: Closing Gala & Diaspora Recognition Awards",
};

const DAY_PHOTOS: Record<number, string> = {
  1: "/assets/imgs/Diaspora Week 2025/526662922_1167327548769637_8258044179086207429_n.jpg",
  2: "/assets/imgs/Diaspora Week 2025/527691517_1167226418779750_3577322439121286715_n.jpg",
  3: "/assets/imgs/Diaspora Week 2025/528345424_1169233925245666_1511022412967923258_n.jpg",
  4: "/assets/imgs/Diaspora Week 2025/528603324_1169233405245718_3332848329999857221_n.jpg",
  5: "/assets/imgs/Diaspora Week 2025/527426570_1169233348579057_2900217355379882609_n.jpg",
};

const FALLBACK_SCHEDULE: ScheduleItem[] = [
  // DAY 1 — Hargeisa, Saturday August 1
  { id: "d1-1", dayNumber: 1, dayLabel: "Day 1 · Hargeisa", date: "August 1, 2026", startTime: "", endTime: "", title: "Official Opening Ceremony with Presidential Address", description: "Opening address by H.E. Abdirahman Mohamed Abdilahi, President of the Republic of Somaliland.", speaker: "H.E. Abdirahman Mohamed Abdilahi", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Opening Ceremony" },
  { id: "d1-2", dayNumber: 1, dayLabel: "Day 1 · Hargeisa", date: "August 1, 2026", startTime: "", endTime: "", title: "Ministerial Investment Portfolio Launch", description: "Launch of the national investment portfolio by the Ministry of Foreign Affairs & International Cooperation.", speaker: "", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Launch" },
  { id: "d1-3", dayNumber: 1, dayLabel: "Day 1 · Hargeisa", date: "August 1, 2026", startTime: "", endTime: "", title: "Diaspora Investment Marketplace", description: "A marketplace connecting diaspora investors with bankable projects across Somaliland's regions.", speaker: "", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Marketplace" },
  { id: "d1-4", dayNumber: 1, dayLabel: "Day 1 · Hargeisa", date: "August 1, 2026", startTime: "", endTime: "", title: "Panel: A New Era of Partnership — From Remittances to Institutional Investment and the Diaspora Trust Fund", description: "Exploring the Somaliland Diaspora Trust Fund, regulated diaspora investment vehicles, public-private partnerships, and the shift from remittance dependency to structured capital mobilization.", speaker: "", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Panel" },
  { id: "d1-5", dayNumber: 1, dayLabel: "Day 1 · Hargeisa", date: "August 1, 2026", startTime: "", endTime: "", title: "Panel: Beyond Recognition — Diaspora Advocacy, Diplomacy, and Somaliland's Rising Global Profile", description: "Examining how the diaspora can leverage growing international recognition to advance advocacy, diplomacy, and Somaliland's standing as a reliable global partner.", speaker: "", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Panel" },

  // DAY 2 — Hargeisa, Sunday August 2
  { id: "d2-1", dayNumber: 2, dayLabel: "Day 2 · Hargeisa", date: "August 2, 2026", startTime: "", endTime: "", title: "Strategic Trade & Logistics Summit", description: "Examining Somaliland's role as a strategic maritime and logistics gateway along the Gulf of Aden.", speaker: "", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Summit" },
  { id: "d2-2", dayNumber: 2, dayLabel: "Day 2 · Hargeisa", date: "August 2, 2026", startTime: "", endTime: "", title: "Infrastructure Investment Dialogue", description: "Dialogue on port development, logistics, free zone investment and infrastructure priorities.", speaker: "", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Dialogue" },
  { id: "d2-3", dayNumber: 2, dayLabel: "Day 2 · Hargeisa", date: "August 2, 2026", startTime: "", endTime: "", title: "Horn of Africa Regional Integration Panel", description: "Positioning Somaliland within Horn of Africa regional trade and integration frameworks.", speaker: "", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Panel" },
  { id: "d2-4", dayNumber: 2, dayLabel: "Day 2 · Hargeisa", date: "August 2, 2026", startTime: "", endTime: "", title: "Blue Economy & Maritime Investment Showcase", description: "Showcasing fisheries, aquaculture and maritime service investment opportunities.", speaker: "", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Showcase" },
  { id: "d2-5", dayNumber: 2, dayLabel: "Day 2 · Hargeisa", date: "August 2, 2026", startTime: "", endTime: "", title: "Panel: Building Somaliland's Future — Diaspora Skills, Innovation, and Investment in Human Capital", description: "Harnessing diaspora expertise in healthcare, education, technology, engineering and governance through knowledge transfer, mentorship and the Diaspora Trust Fund.", speaker: "", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Panel" },
  { id: "d2-6", dayNumber: 2, dayLabel: "Day 2 · Hargeisa", date: "August 2, 2026", startTime: "", endTime: "", title: "Panel: Diaspora Women in Leadership — Architects of Influence, Investment & Recognition", description: "Reframing diaspora women as economic decision-makers, policy influencers, and intergenerational bridge-builders.", speaker: "", location: "Serene Seravoir Hotel, Hargeisa", sessionType: "Panel" },

  // DAY 3 — Borama, Monday August 3
  { id: "d3-1", dayNumber: 3, dayLabel: "Day 3 · Borama", date: "August 3, 2026", startTime: "", endTime: "", title: "Agro-Investment Presentation", description: "Presenting agro-processing and value-addition investment opportunities across Awdal.", speaker: "", location: "Safari Hotel, Borama", sessionType: "Presentation" },
  { id: "d3-2", dayNumber: 3, dayLabel: "Day 3 · Borama", date: "August 3, 2026", startTime: "", endTime: "", title: "Incentivizing Diaspora Investment & Community Development Presentation", description: "Borama Local Government presents incentives for diaspora investment and community development.", speaker: "", location: "Safari Hotel, Borama", sessionType: "Presentation" },
  { id: "d3-3", dayNumber: 3, dayLabel: "Day 3 · Borama", date: "August 3, 2026", startTime: "", endTime: "", title: "University–Diaspora Research & Innovation Forum", description: "Forum on research and innovation partnerships between Amoud University and the diaspora.", speaker: "", location: "Safari Hotel, Borama", sessionType: "Forum" },
  { id: "d3-4", dayNumber: 3, dayLabel: "Day 3 · Borama", date: "August 3, 2026", startTime: "", endTime: "", title: "Field Visits to Newly Installed Monuments & Tourism Sites", description: "Visits to the Ahmed Guray Statue and other newly installed monuments and tourism sites.", speaker: "", location: "Borama", sessionType: "Field Visit" },
  { id: "d3-5", dayNumber: 3, dayLabel: "Day 3 · Borama", date: "August 3, 2026", startTime: "", endTime: "", title: "SME Financing Workshop", description: "SME financing workshop held in collaboration with IOM Somaliland.", speaker: "", location: "Safari Hotel, Borama", sessionType: "Workshop" },
  { id: "d3-6", dayNumber: 3, dayLabel: "Day 3 · Borama", date: "August 3, 2026", startTime: "", endTime: "", title: "Diaspora Recognition Awards — Borama", description: "Awards jointly presented by Borama Local Government and the Diaspora Department.", speaker: "", location: "Safari Hotel, Borama", sessionType: "Awards" },
  { id: "d3-7", dayNumber: 3, dayLabel: "Day 3 · Borama", date: "August 3, 2026", startTime: "", endTime: "", title: "Panel: Roots and Riches — Diaspora Investment in Agriculture, Mining, and Knowledge-Based Development in Awdal", description: "Unlocking diaspora capital, expertise and research partnerships in agro-processing, mining and cross-border trade.", speaker: "", location: "Safari Hotel, Borama", sessionType: "Panel" },
  { id: "d3-8", dayNumber: 3, dayLabel: "Day 3 · Borama", date: "August 3, 2026", startTime: "", endTime: "", title: "Panel: Tourism Hub — Diaspora Investment in Trade, Tourism, and Urban Transformation", description: "Exploring Borama's urban transformation, the Djibouti-Borama road corridor, and education & tourism partnerships.", speaker: "", location: "Safari Hotel, Borama", sessionType: "Panel" },

  // DAY 4 — Burao, Wednesday August 5
  { id: "d4-1", dayNumber: 4, dayLabel: "Day 4 · Burao", date: "August 5, 2026", startTime: "", endTime: "", title: "Livestock Export Strategy & Welfare Dialogue", description: "Dialogue on livestock export strategy, standards and animal welfare.", speaker: "", location: "Plaza Hotel, Burao", sessionType: "Dialogue" },
  { id: "d4-2", dayNumber: 4, dayLabel: "Day 4 · Burao", date: "August 5, 2026", startTime: "", endTime: "", title: "Livestock & Trade History Showcase", description: "Showcasing Burao's livestock trade history and economic legacy.", speaker: "", location: "Plaza Hotel, Burao", sessionType: "Showcase" },
  { id: "d4-3", dayNumber: 4, dayLabel: "Day 4 · Burao", date: "August 5, 2026", startTime: "", endTime: "", title: "Manufacturing & Processing Investment Dialogue", description: "Dialogue on meat processing, leather & hides manufacturing investment opportunities.", speaker: "", location: "Plaza Hotel, Burao", sessionType: "Dialogue" },
  { id: "d4-4", dayNumber: 4, dayLabel: "Day 4 · Burao", date: "August 5, 2026", startTime: "", endTime: "", title: "Youth Skills & Industry Partnership Session", description: "Session on youth vocational training and industrial zone partnerships.", speaker: "", location: "Plaza Hotel, Burao", sessionType: "Session" },
  { id: "d4-5", dayNumber: 4, dayLabel: "Day 4 · Burao", date: "August 5, 2026", startTime: "", endTime: "", title: "Bridging Home and Diaspora: Local Initiatives and Incentives Presentation", description: "Local initiatives and incentives for diaspora investment and retention in Burao.", speaker: "", location: "Plaza Hotel, Burao", sessionType: "Presentation" },
  { id: "d4-6", dayNumber: 4, dayLabel: "Day 4 · Burao", date: "August 5, 2026", startTime: "", endTime: "", title: "Diaspora Recognition Awards — Burao", description: "Awards jointly presented by Burao Local Government and the Diaspora Department.", speaker: "", location: "Plaza Hotel, Burao", sessionType: "Awards" },
  { id: "d4-7", dayNumber: 4, dayLabel: "Day 4 · Burao", date: "August 5, 2026", startTime: "", endTime: "", title: "Panel: Building the Midland — Diaspora-Led Investment in Livestock, Industry, and Burao's Productive Economy", description: "Transforming Burao's livestock economy into a modern industrial sector through diaspora investment, industrial zones and youth vocational training.", speaker: "", location: "Plaza Hotel, Burao", sessionType: "Panel" },
  { id: "d4-8", dayNumber: 4, dayLabel: "Day 4 · Burao", date: "August 5, 2026", startTime: "", endTime: "", title: "High-Profile Diaspora Night Event — \"Honoring the Backbone of the Nation\"", description: "An evening of cultural performances, nomadic heritage exhibitions, live music and oral poetry honoring the diaspora and connecting pastoral roots to modern industry.", speaker: "", location: "Plaza Hotel, Burao", sessionType: "Cultural Evening" },

  // DAY 5 — Hargeisa, Thursday August 6 (Grand Finale)
  { id: "d5-1", dayNumber: 5, dayLabel: "Day 5 · Hargeisa", date: "August 6, 2026", startTime: "", endTime: "", title: "Closing Gala Dinner", description: "A celebratory conclusion to the roadshow, bringing all delegates back to Hargeisa.", speaker: "", location: "Guleed Hotel, Hargeisa", sessionType: "Gala" },
  { id: "d5-2", dayNumber: 5, dayLabel: "Day 5 · Hargeisa", date: "August 6, 2026", startTime: "", endTime: "", title: "Diaspora Recognition Awards Ceremony", description: "Categories include Investment & Enterprise Leadership, International Advocacy & Diplomacy, Youth Innovation & Entrepreneurship, Cultural Preservation & Creative Industries, and Women in Leadership & Community Impact.", speaker: "", location: "Guleed Hotel, Hargeisa", sessionType: "Awards" },
  { id: "d5-3", dayNumber: 5, dayLabel: "Day 5 · Hargeisa", date: "August 6, 2026", startTime: "", endTime: "", title: "Hargeisa Local Government Presentation on Diaspora Incentives", description: "Presentation on diaspora incentives for investment and engagement in Hargeisa.", speaker: "", location: "Guleed Hotel, Hargeisa", sessionType: "Presentation" },
  { id: "d5-4", dayNumber: 5, dayLabel: "Day 5 · Hargeisa", date: "August 6, 2026", startTime: "", endTime: "", title: "Cultural Showcase", description: "Performances from traditional teams, national poetry recitals, and music ensembles celebrating Somaliland's culture and heritage.", speaker: "", location: "Guleed Hotel, Hargeisa", sessionType: "Cultural Showcase" },
];

const EXHIBITOR_BENEFITS = [
  {
    icon: Eye,
    title: "Increase Visibility",
    description:
      "Put your brand in front of hundreds of diaspora attendees, government representatives, investors, and development partners from across Somaliland's regions.",
  },
  {
    icon: Handshake,
    title: "Build New Connections",
    description:
      "Meet potential investors, collaborators, and clients from Somaliland and abroad who share a commitment to national development.",
  },
  {
    icon: Package,
    title: "Showcase Your Impact",
    description:
      "Demonstrate your products, services, or community development work to an audience eager to support diaspora-driven initiatives that are making a tangible difference.",
  },
  {
    icon: Unlock,
    title: "Unlock New Opportunities",
    description:
      "Position your business or organization to benefit from partnerships, investment leads, and future collaborations sparked during the event.",
  },
  {
    icon: Megaphone,
    title: "Contribute to the Narrative",
    description:
      "Be part of a movement that shows the world that Somaliland's diaspora is not just an observer, it is the architect of the modern state.",
  },
];

const EXHIBITOR_CATEGORIES = [
  "Diaspora-founded businesses operating in Somaliland across all sectors, including agriculture, livestock, fishery, mining, manufacturing, real estate, fintech, tourism, energy, healthcare, education, technology, and other professional service sectors.",
  "Diaspora philanthropists and individual changemakers who have invested in community development.",
  "Diaspora-led development organizations and NGOs that have implemented impactful programs in Somaliland.",
  "Community groups and cooperatives that are driving local economic development.",
  "Diaspora professionals with ventures or initiatives contributing to Somaliland's growth.",
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

type Section = "home" | "schedule" | "exhibitors" | "gallery";

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
    { key: "schedule", label: "Event Schedule", icon: <CalendarDays size={16} /> },
    { key: "exhibitors", label: "Exhibitors", icon: <Building2 size={16} /> },
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
                August 1 &ndash; 6, 2026 &nbsp;&middot;&nbsp; Hargeisa, Borama &amp; Burao
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
                <div className={styles.homeHeroStatsGrid}>
                  <div className={styles.homeHeroStat}>
                    <strong>5</strong>
                    <span>Event Days</span>
                  </div>
                  <div className={styles.homeHeroStatDiv} />
                  <div className={styles.homeHeroStat}>
                    <strong>21+</strong>
                    <span>Exhibitors</span>
                  </div>
                  <div className={styles.homeHeroStatDiv} />
                  <div className={styles.homeHeroStat}>
                    <strong>100s</strong>
                    <span>Diaspora Attendees</span>
                  </div>
                  <div className={styles.homeHeroStatDiv} />
                  <div className={styles.homeHeroStat}>
                    <strong>3</strong>
                    <span>Host Cities</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ INVITE / PARTICIPATE ══ */}
          <section id="invite" className={styles.homeInviteSection}>
            <div className="container">
              <div className={styles.homeInviteHeader}>
                <span className={styles.homeKicker}>Join Us</span>
                <h2 className={styles.homeSectionTitle}>Come Be Part of History</h2>
                <p className={styles.homeSectionLead}>
                  Whether you&apos;re reconnecting with your homeland or showcasing your business &mdash; Diaspora Week 2026 has a place for you.
                </p>
              </div>
              <div className={styles.homeInviteCards}>
                <div className={styles.homeInviteCard}>
                  <div className={styles.homeInviteCardBg}>
                    <img src={DW_PHOTOS[0]} alt="" />
                  </div>
                  <div className={styles.homeInviteCardOverlay} />
                  <div className={styles.homeInviteCardBody}>
                    <span className={styles.homeInviteCardBadge}>
                      <User size={13} /> For Individuals
                    </span>
                    <h3>Attend &amp; Connect</h3>
                    <p>Register to attend sessions, panels, networking events and the cultural gala.</p>
                    <Link href="/diaspora-week/register?type=individual" className={styles.homeInviteCardCta}>
                      Register as Individual
                      <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                    </Link>
                  </div>
                </div>
                <div className={`${styles.homeInviteCard} ${styles.homeInviteCardBiz}`}>
                  <div className={styles.homeInviteCardBg}>
                    <img src={DW_PHOTOS[3]} alt="" />
                  </div>
                  <div className={styles.homeInviteCardOverlay} />
                  <div className={styles.homeInviteCardBody}>
                    <span className={styles.homeInviteCardBadge}>
                      <Building2 size={13} /> For Businesses
                    </span>
                    <h3>Exhibit &amp; Grow</h3>
                    <p>Secure a hall booth, showcase your products and connect with investors and diaspora partners.</p>
                    <Link href="/diaspora-week/register?type=business" className={styles.homeInviteCardCta}>
                      Register as Business
                      <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ THEME ══ */}
          <section className={styles.homeThemeSection}>
            <div className="container">
              <div className={styles.homeThemeGrid}>
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
                  <span className={styles.homeThemeVenueDate}>
                    <CalendarDays size={15} /> August 1&ndash;6, 2026
                  </span>
                  <div className={styles.homeThemeVenueGrid}>
                    <div className={styles.homeThemeVenueRow}>
                      <span className={styles.homeThemeVenueCity}><MapPin size={13} /> Hargeisa</span>
                      <span className={styles.homeThemeVenueDivider} />
                      <span className={styles.homeThemeVenueName}>Serene Seravoir Hotel</span>
                    </div>
                    <div className={styles.homeThemeVenueRow}>
                      <span className={styles.homeThemeVenueCity}><MapPin size={13} /> Borama</span>
                      <span className={styles.homeThemeVenueDivider} />
                      <span className={styles.homeThemeVenueName}>Safari Hotel</span>
                    </div>
                    <div className={styles.homeThemeVenueRow}>
                      <span className={styles.homeThemeVenueCity}><MapPin size={13} /> Burao</span>
                      <span className={styles.homeThemeVenueDivider} />
                      <span className={styles.homeThemeVenueName}>Plaza Hotel</span>
                    </div>
                  </div>
                </div>
                <div className={styles.homeThemePhotos}>
                  <div className={styles.homeThemePhotoMain}>
                    <img src={DW_PHOTOS[2]} alt="Diaspora Week 2025" />
                  </div>
                  <div className={styles.homeThemePhotoStack}>
                    <img src={DW_PHOTOS[1]} alt="Diaspora Week 2025" />
                    <img src={DW_PHOTOS[5]} alt="Diaspora Week 2025" />
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
                <video className={styles.homeVideoEl} src={SAMPLE_VIDEO_URL} poster={DW_PHOTOS[1]} controls />
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

          {/* ══ EXHIBITORS PREVIEW ══ */}
          <section className={styles.homeExhibitorSection}>
            <div className="container">
              <div className={styles.homeExhibitorInner}>
                <div className={styles.homeExhibitorText}>
                  <span className={styles.homeKicker}>Exhibitor Showcase</span>
                  <h2 className={styles.homeSectionTitle}>Meet Our Exhibitors</h2>
                  <p className={styles.homeSectionLead}>
                    21+ diaspora-founded businesses, NGOs and changemakers are confirmed to showcase
                    their work across Hargeisa, Borama and Burao. Come discover, connect and invest.
                  </p>
                  <button type="button" className={styles.homeExhibitorCta} onClick={() => setActiveSection("exhibitors")}>
                    <Building2 size={16} />
                    View All Exhibitors
                  </button>
                </div>
                <div className={styles.homeExhibitorLogos}>
                  {SAMPLE_EXHIBITOR_LOGOS.slice(0, 9).map((logo) => (
                    <div className={styles.homeExhibitorLogo} key={logo.name} title={logo.name}>
                      <img
                        src={`/assets/imgs/Diaspora Week 2025/exhibitor-logos/${logo.file}`}
                        alt={logo.name}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
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
            <div className={styles.scheduleModernWrapper}>
              {sortedDays.flatMap((dayNumber, dayIndex) => {
                const sessions = scheduleByDay[dayNumber];
                const DayIcon = DAY_ICONS[(dayNumber - 1) % DAY_ICONS.length];
                const dayPhoto = DAY_PHOTOS[dayNumber] ?? DW_PHOTOS[dayNumber % DW_PHOTOS.length];

                const renderSessions = (list: typeof sessions) => (
                  <div className={styles.scheduleTimeline}>
                    {list.map((session) => (
                      <div className={styles.scheduleTimelineItem} key={session.id}>
                        <div className={styles.scheduleTimelineDot} />
                        <div className={styles.scheduleTimelineCard}>
                          {(session.startTime || session.endTime) && (
                            <div className={styles.scheduleTimelineTime}>
                              {session.startTime}{session.endTime ? ` – ${session.endTime}` : ""}
                            </div>
                          )}
                          <h3>{session.title}</h3>
                          {session.description && <p>{session.description}</p>}
                          <div className={styles.scheduleTimelineMeta}>
                            {session.speaker && (
                              <span><User size={13} />{session.speaker}</span>
                            )}
                            {session.location && (
                              <span><MapPin size={13} />{session.location}</span>
                            )}
                            {session.sessionType && (
                              <span className={styles.scheduleTimelineTag}>{session.sessionType}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );

                /* helper: framed photo panel */
                const renderImagePanel = (src: string, alt: string, icon: React.ReactNode, caption: string) => (
                  <div className={styles.scheduleModernImageSide}>
                    <div className={styles.scheduleModernPhotoFrame}>
                      <img src={src} alt={alt} className={styles.scheduleModernPhoto} />
                      <div className={styles.scheduleModernGeomA} aria-hidden="true" />
                      <div className={styles.scheduleModernGeomB} aria-hidden="true" />
                    </div>
                    <div className={styles.scheduleModernPhotoCaption}>
                      <span className={styles.scheduleModernCaptionIcon}>{icon}</span>
                      <span>{caption}</span>
                    </div>
                  </div>
                );

                /* ── Day 1: split into two halves ── */
                if (dayNumber === 1 && sessions.length > 2) {
                  const splitAt = Math.ceil(sessions.length / 2);
                  const partA = sessions.slice(0, splitAt);
                  const partB = sessions.slice(splitAt);
                  return [
                    <section key="1a" id="schedule-day-1" className={`${styles.scheduleModernSection} ${styles.scheduleModernDay1}`}>
                      <div className={styles.scheduleModernBadgeRow}>
                        <span className={styles.scheduleModernDayChip}>DAY 1 · PART I</span>
                        <span className={styles.scheduleModernDateChip}>{sessions[0]?.date || "August 1, 2026"}</span>
                      </div>
                      <div className={styles.scheduleModernBody}>
                        {renderImagePanel(DW_PHOTOS[0], "Opening Ceremony", <DayIcon size={20} />, "Opening Ceremony & Presidential Address — Hargeisa")}
                        <div className={styles.scheduleModernSessionsSide}>
                          <h2 className={styles.scheduleModernDayTitle}>Morning Programme</h2>
                          {renderSessions(partA)}
                        </div>
                      </div>
                    </section>,

                    <section key="1b" className={`${styles.scheduleModernSection} ${styles.scheduleModernDay1b}`}>
                      <div className={styles.scheduleModernBadgeRow}>
                        <span className={styles.scheduleModernDayChip}>DAY 1 · PART II</span>
                        <span className={styles.scheduleModernDateChip}>Afternoon Sessions</span>
                      </div>
                      <div className={`${styles.scheduleModernBody} ${styles.scheduleModernBodyFlip}`}>
                        <div className={styles.scheduleModernSessionsSide}>
                          <h2 className={styles.scheduleModernDayTitle}>Afternoon Programme</h2>
                          {renderSessions(partB)}
                        </div>
                        {renderImagePanel(DW_PHOTOS[1], "Day 1 Afternoon", <Sparkles size={20} />, "Investment Panels & Diaspora Marketplace")}
                      </div>
                    </section>,
                  ];
                }

                /* ── All other days ── */
                const isFlipped = dayIndex % 2 === 1;
                return [
                  <section
                    key={dayNumber}
                    id={`schedule-day-${dayNumber}`}
                    className={`${styles.scheduleModernSection} ${styles[`scheduleModernDay${dayNumber}`] || styles.scheduleModernDay2}`}
                  >
                    <div className={styles.scheduleModernBadgeRow}>
                      <span className={styles.scheduleModernDayChip}>
                        {sessions[0]?.dayLabel || `DAY ${dayNumber}`}
                      </span>
                      {sessions[0]?.date && (
                        <span className={styles.scheduleModernDateChip}>{sessions[0].date}</span>
                      )}
                    </div>

                    <div className={`${styles.scheduleModernBody} ${isFlipped ? styles.scheduleModernBodyFlip : ""}`}>
                      {!isFlipped && renderImagePanel(dayPhoto, `Day ${dayNumber}`, <DayIcon size={20} />, DAY_THEMES[dayNumber] || `Day ${dayNumber}`)}

                      <div className={styles.scheduleModernSessionsSide}>
                        <h2 className={styles.scheduleModernDayTitle}>
                          {DAY_THEMES[dayNumber] || sessions[0]?.title}
                        </h2>
                        {renderSessions(sessions)}
                      </div>

                      {isFlipped && renderImagePanel(dayPhoto, `Day ${dayNumber}`, <DayIcon size={20} />, DAY_THEMES[dayNumber] || `Day ${dayNumber}`)}
                    </div>
                  </section>,
                ];
              })}
            </div>
          )}
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
                Showcase your brand, services, or initiative at any of our city hubs. As an exhibitor,
                you&apos;ll gain visibility among hundreds of attendees, government representatives, and
                international guests.
              </p>
            </div>
          </section>

          <section className={styles.tabSection}>
            <div className="container">
              <div className={styles.exhibitSplit}>
                <div className={styles.exhibitIntro}>
                  <span className={styles.kicker}>Exhibit With Us</span>
                  <h2 className={styles.sectionTitle}>Showcase Your Work at Diaspora Week 2026</h2>
                  <p className={styles.sectionLead}>
                    Diaspora Week 2026 invites diaspora-founded businesses operating in Somaliland,
                    diaspora philanthropists, and development organizations that have contributed to
                    community development and nation-building to showcase their work, products, and
                    services to a diverse audience of diaspora community members, investors,
                    development partners, government officials, and local stakeholders.
                  </p>
                  <p className={styles.sectionLead}>
                    This is a unique opportunity to celebrate and amplify the impact of diaspora-driven
                    initiatives that are transforming Somaliland&apos;s economic landscape &ndash; from
                    innovative start-ups and agribusinesses to infrastructure projects, educational
                    institutions, health facilities, and community development programs.
                  </p>
                </div>

                <div className={styles.whoListWrap}>
                  <h3 className={styles.whoListTitle}>As an exhibitor, you will have the opportunity to:</h3>
                  <ul className={styles.checkList}>
                    <li>
                      <CheckCircle2 size={20} />
                      <span>Present your brand, vision, and voice to potential customers, investors, and partners.</span>
                    </li>
                    <li>
                      <CheckCircle2 size={20} />
                      <span>Build meaningful relationships within the Somaliland diaspora network and beyond.</span>
                    </li>
                    <li>
                      <CheckCircle2 size={20} />
                      <span>
                        Inspire others by showcasing how diaspora capital, expertise, and passion are
                        driving sustainable development across the nation.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className={styles.exhibitInfoStrip}>
                <div className={styles.exhibitInfoItem}>
                  <CalendarDays size={22} />
                  <div>
                    <strong>July 20, 2026</strong>
                    <span>Application deadline</span>
                  </div>
                </div>
                <div className={styles.exhibitInfoItem}>
                  <Building2 size={22} />
                  <div>
                    <strong>Flexible Booths</strong>
                    <span>One city hub or all three</span>
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
              <span className={styles.kicker}>Benefits for Exhibitors</span>
              <h2 className={styles.sectionTitle}>
                By Exhibiting at Diaspora Week 2026, Your Organization Will&hellip;
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
              <span className={styles.kicker}>Who Should Exhibit?</span>
              <h2 className={styles.sectionTitle}>We Welcome Applications From</h2>
              <p className={styles.sectionLead}>
                Diaspora Week 2026 is open to a wide range of diaspora-driven businesses, organizations
                and changemakers.
              </p>

              <ul className={styles.checkList}>
                {EXHIBITOR_CATEGORIES.map((category) => (
                  <li key={category}>
                    <CheckCircle2 size={20} />
                    <span>{category}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className={`${styles.tabSection} ${styles.tabSectionAlt}`}>
            <div className="container">
              <div className={styles.exhibitIntro}>
                <span className={styles.kicker}>Application Deadline &amp; Selection Process</span>
                <h2 className={styles.sectionTitle}>Apply by July 20th, 2026</h2>
                <p className={styles.sectionLead}>
                  Please submit your application by July 20th, 2026. To ensure optimal use of the venue
                  space, the Diaspora Department will review all submissions after this date. Accepted
                  businesses and organizations will be required to pay an affordable exhibition fee to
                  secure their space. Registration will be finalized only upon payment confirmation.
                </p>

                <div className={styles.contactRow}>
                  <a href="mailto:info@sldiaspora.org" className={styles.contactItem}>
                    <Mail size={18} />
                    info@sldiaspora.org
                  </a>
                  <a href="tel:+252634696895" className={styles.contactItem}>
                    <Phone size={18} />
                    +252-63-4696895
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.tabSection}>
            <div className="container">
              <span className={styles.kicker}>Confirmed Exhibitors</span>
              <h2 className={styles.sectionTitle}>Participating Organizations</h2>
              <p className={styles.sectionLead}>
                A growing line-up of businesses, NGOs and diaspora-led initiatives confirmed to
                exhibit at Diaspora Week 2026.
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
