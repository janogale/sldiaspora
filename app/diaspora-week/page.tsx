"use client";

import Link from "next/link";
import { useEffect, useState, useRef, type CSSProperties } from "react";
import {
  Building2,
  CalendarDays,
  Camera,
  Handshake,
  Lightbulb,
  Rocket,
  Sparkles,
  Users,
  Play,
  Globe,
  TrendingUp,
  Heart,
  ChevronRight,
  Star,
} from "lucide-react";
import Header from "../components/header";
import styles from "./page.module.css";

type ScheduleOutlineItem = {
  dayNumber: number;
  dayLabel: string;
  date: string;
  title: string;
};

type ExhibitorPreview = {
  id: string;
  name: string;
  logo: string | null;
  category: string;
};

type PartnerPreview = {
  id: string;
  name: string;
  logo: string | null;
  partnerType: string;
};

type GalleryPreviewItem = {
  id: string;
  title: string;
  url: string;
  type: "image" | "video";
};

type PublicContent = {
  scheduleOutline: ScheduleOutlineItem[];
  exhibitorsPreview: ExhibitorPreview[];
  exhibitorsCount: number;
  partnersPreview: PartnerPreview[];
  partnersCount: number;
  galleryPreview: GalleryPreviewItem[];
};

const EMPTY_CONTENT: PublicContent = {
  scheduleOutline: [],
  exhibitorsPreview: [],
  exhibitorsCount: 0,
  partnersPreview: [],
  partnersCount: 0,
  galleryPreview: [],
};

const FALLBACK_DAYS = [
  {
    dayNumber: 1,
    dayLabel: "Hargeisa",
    date: "August 1–2",
    title: "Governance, Finance, Innovation & National Investment",
    desc: "The capital hosts the national investment forum, government dialogue, and innovation showcase.",
    icon: "🎯",
  },
  {
    dayNumber: 2,
    dayLabel: "Borama",
    date: "August 3",
    title: "Knowledge, Agriculture, Mining, Tourism & Cross-Border Trade Hub",
    desc: "Borama showcases its strengths in education, agriculture, mining, tourism and cross-border trade.",
    icon: "🌾",
  },
  {
    dayNumber: 3,
    dayLabel: "Burao",
    date: "August 5",
    title: "Livestock, Industry & Productive Economy",
    desc: "Burao highlights livestock, industry and the productive economy driving national growth.",
    icon: "🏭",
  },
  {
    dayNumber: 4,
    dayLabel: "Hargeisa",
    date: "August 6",
    title: "Grand Finale: Closing Gala & Diaspora Recognition Awards",
    desc: "The roadshow concludes in Hargeisa with the closing gala and Diaspora Recognition Awards.",
    icon: "🌟",
  },
];

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <div className={styles.countdown}>
      <span className={styles.countdownLabel}>Event Begins In</span>
      <div className={styles.countdownGrid}>
        {[
          { val: timeLeft.days, unit: "Days" },
          { val: timeLeft.hours, unit: "Hours" },
          { val: timeLeft.mins, unit: "Minutes" },
          { val: timeLeft.secs, unit: "Seconds" },
        ].map(({ val, unit }) => (
          <div key={unit} className={styles.countdownCell}>
            <strong>{String(val).padStart(2, "0")}</strong>
            <span>{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DiasporaWeekPage() {
  const [content, setContent] = useState<PublicContent>(EMPTY_CONTENT);
  const [loading, setLoading] = useState(true);
  const [galleryImages, setGalleryImages] = useState<{ id: string; url: string; title: string; type: "image" | "video" }[]>([]);
  const [videoOpen, setVideoOpen] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  const EVENT_DATE = new Date("2026-08-01T09:00:00");

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const [weekRes, galRes] = await Promise.all([
          fetch("/api/diaspora-week/content", { method: "GET" }),
          fetch("/api/galleries", { method: "GET" }),
        ]);
        const weekResult = (await weekRes.json().catch(() => null)) as { data?: PublicContent } | null;
        const galResult = (await galRes.json().catch(() => null)) as { data?: Array<{ id: string; title: string; images: string[] }> } | null;
        if (!isMounted) return;
        if (weekRes.ok && weekResult?.data) setContent(weekResult.data);

        // Build flat image list: prefer diaspora-week gallery, fall back to general galleries
        const weekGallery = weekResult?.data?.galleryPreview ?? [];
        if (weekGallery.length > 0) {
          setGalleryImages(weekGallery.slice(0, 8));
        } else if (galResult?.data) {
          const flat = galResult.data.flatMap((album) =>
            (album.images ?? []).slice(0, 3).map((url, i) => ({
              id: `${album.id}-${i}`,
              url,
              title: album.title,
              type: "image" as const,
            }))
          ).slice(0, 8);
          setGalleryImages(flat);
        }
      } catch {
        // keep defaults
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!videoOpen) return;
    const handler = (e: MouseEvent) => {
      if (videoRef.current && !videoRef.current.contains(e.target as Node)) {
        setVideoOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [videoOpen]);

  const scheduleDays =
    content.scheduleOutline.length > 0
      ? content.scheduleOutline.map((d, i) => ({ ...d, ...FALLBACK_DAYS[i] }))
      : FALLBACK_DAYS;

  return (
    <main className={styles.page}>
      <Header />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true">
          <div className={styles.orb1} />
          <div className={styles.orb2} />
          <div className={styles.orb3} />
          <div className={styles.gridLines} />
        </div>

        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroBadge}>
            <Sparkles size={14} />
            Somaliland Diaspora Week 2026
          </div>

          {/* <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleLine1}>Somaliland </span>
            <span className={styles.heroTitleLine2}>Diaspora Week 2026</span>
          </h1> */}

          <div className={styles.heroDescCard}>
            <div className={styles.heroMetaRow}>
              <span className={styles.heroMetaPill}>
                <CalendarDays size={14} />
                August 1–6, 2026
              </span>
              <span className={styles.heroMetaPill}>
                <Globe size={14} />
                Hargeisa · Borama · Burao
              </span>
            </div>
            <p className={styles.heroSubtitle}>
              Uniting the <span className={styles.heroSubtitleHighlight}>global Somaliland diaspora</span>{" "}
              through investment forums, knowledge exchange, and cultural showcases in partnership
              with Dahabshiil, Telesom, IOM Somaliland and the Municipalities of Hargeisa, Borama
              &amp; Burao.
            </p>
          </div>

          <div className={styles.heroActions}>
            <Link href="/diaspora-week/register" className={styles.primaryCta}>
              <span>Register Now</span>
              <span className={styles.ctaArrow}>
                <ChevronRight size={18} />
              </span>
            </Link>
            <button
              className={styles.videoBtn}
              onClick={() => setVideoOpen(true)}
              aria-label="Watch announcement video"
            >
              <span className={styles.videoBtnIcon}>
                <Play size={16} fill="currentColor" />
              </span>
              Watch the Announcement
            </button>
            <Link href="/diaspora-week/portal" className={styles.secondaryCta}>
              <CalendarDays size={16} />
              Event Portal
            </Link>
          </div>

          <CountdownTimer targetDate={EVENT_DATE} />

        </div>
      </section>

      {/* ── VIDEO MODAL ── */}
      {videoOpen && (
        <div className={styles.videoOverlay} role="dialog" aria-modal="true">
          <div className={styles.videoModal} ref={videoRef}>
            <button
              className={styles.videoClose}
              onClick={() => setVideoOpen(false)}
              aria-label="Close video"
            >
              ✕
            </button>
            <div className={styles.videoFrame}>
              <video
                src="/assets/videos/diaspora-week-hero.mp4"
                controls
                autoPlay
                style={{ width: "100%", height: "100%", display: "block" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── VIDEO ANNOUNCEMENT SECTION ── */}
      <section className={styles.videoSection}>
        <div className="container">
          <div className={styles.videoSectionInner}>
            <div className={styles.videoSectionText}>
              <span className={styles.kicker}>
                <Play size={13} />
                Official Announcement
              </span>
              <h2 className={styles.sectionTitle}>Welcome to the Somaliland Diaspora Week 2026</h2>
              <p className={styles.announcementText}>
                The Somaliland 2nd Diaspora Week 2026 moves beyond a single venue or centralized format to a national,
                multi-city roadshow hosted across Hargeisa, Borama, and Burao, reinforcing that development is national,
                not centralized, with each region representing a distinct pillar of Somaliland&apos;s economic and cultural
                strength, and offering unique opportunities for diaspora investment, engagement, and partnership.
              </p>
              <p className={styles.announcementText}>
                It will bring together Somalilanders from around the world, government officials, entrepreneurs and
                innovators to explore opportunities, strengthen partnerships, celebrate identity, and contribute to a
                shared vision for the future. This is more than a conference, it is a national platform for engagement,
                a marketplace for ideas and investment, a celebration of culture and identity, and a journey across
                Somaliland&apos;s past, present, and future.
              </p>
              <p className={styles.announcementText}>
                This is the moment to move from dialogue to action, from commitment to tangible impact.
                Together, we can build a nation where every Somalilander, at home and abroad, has a stake in our shared
                future.
              </p>
            </div>

            <div className={styles.videoThumb} onClick={() => setVideoOpen(true)} role="button" tabIndex={0} aria-label="Play announcement video" onKeyDown={e => e.key === "Enter" && setVideoOpen(true)}>
              {/* floating accent blobs */}
              <div className={styles.videoAccent1} aria-hidden="true" />
              <div className={styles.videoAccent2} aria-hidden="true" />

              {/* inner frame with shadow + border-radius */}
              <div className={styles.videoThumbInner}>
                <div className={styles.videoThumbImg}>
                  <video
                    src="/assets/videos/diaspora-week-hero.mp4"
                    muted
                    loop
                    playsInline
                    autoPlay
                  />
                  <div className={styles.videoThumbOverlay}>
                    <div className={styles.playBtn}>
                      <Play size={32} fill="white" />
                    </div>
                    <div className={styles.videoThumbBadge}>
                      <Sparkles size={12} />
                      Official 2026 Announcement
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY ATTEND (hidden) ── */}
      {false && (
      <section className={`${styles.section} ${styles.whySection}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.kicker}>
              <Sparkles size={13} />
              Why Attend
            </span>
            <h2 className={styles.sectionTitle}>Why Attend Diaspora Week 2026?</h2>
            <p className={styles.sectionLead}>
              Somaliland Diaspora Week is more than an event — it&apos;s a movement that connects
              hearts, builds bridges, and shapes the future of our nation together.
            </p>
          </div>

          {/* Top row: 1 large feature + 2 stacked cards */}
          <div className={styles.whyTopRow}>
            {/* Feature card */}
            <div className={`${styles.whyCard} ${styles.whyCardFeature}`}>
              <span className={styles.whyNum}>01</span>
              <span className={styles.whyIcon} style={{ background: "linear-gradient(135deg,#d7f5e0,#b8eccb)", color: "#1f8a3b" }}>
                <CalendarDays size={28} />
              </span>
              <h3 className={styles.whyTitle}>Invest</h3>
              <p className={styles.whyDesc}>
                Discover bankable projects, emerging industries, and investment opportunities
                across Somaliland&apos;s major regions.
              </p>
              <div className={styles.whyTags}>
                <span>Bankable Projects</span>
                <span>Emerging Industries</span>
                <span>Regional Opportunities</span>
              </div>
            </div>

            {/* 2 stacked cards */}
            <div className={styles.whyStack}>
              <div className={`${styles.whyCard} ${styles.whyCardSide}`}>
                <span className={styles.whyNum}>02</span>
                <span className={styles.whyIcon} style={{ background: "linear-gradient(135deg,#daeeff,#b8dcf5)", color: "#0070c0" }}>
                  <Building2 size={22} />
                </span>
                <div>
                  <h3 className={styles.whyTitle}>Connect</h3>
                  <p className={styles.whyDesc}>
                    Meet government leaders, business executives, entrepreneurs, development
                    partners, academics, and diaspora professionals from around the world.
                  </p>
                </div>
              </div>
              <div className={`${styles.whyCard} ${styles.whyCardSide}`}>
                <span className={styles.whyNum}>03</span>
                <span className={styles.whyIcon} style={{ background: "linear-gradient(135deg,#fef3c7,#fde68a)", color: "#b45309" }}>
                  <Rocket size={22} />
                </span>
                <div>
                  <h3 className={styles.whyTitle}>Innovate</h3>
                  <p className={styles.whyDesc}>
                    Share ideas, expertise, technology, and solutions that contribute to
                    sustainable growth and economic transformation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row: 3 equal cards */}
          <div className={styles.whyBottomRow}>
            {[
              {
                num: "04",
                icon: <Camera size={22} />,
                bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)",
                color: "#7c3aed",
                title: "Celebrate",
                desc: "Experience Somaliland's rich culture, heritage, traditions, creativity, and resilience through exhibitions, performances, and community events.",
                tags: ["Exhibitions", "Performances", "Heritage"],
              },
              {
                num: "05",
                icon: <Heart size={22} />,
                bg: "linear-gradient(135deg,#ffe4e6,#fecdd3)",
                color: "#be123c",
                title: "Inspire",
                desc: "Strengthen the connection between generations and encourage young Somalilanders abroad to engage with their heritage and future opportunities.",
                tags: ["Second Generation", "Heritage", "Opportunity"],
              },
              {
                num: "06",
                icon: <Globe size={22} />,
                bg: "linear-gradient(135deg,#ccfbf1,#a7f3d0)",
                color: "#0f766e",
                title: "Engage Local Governments",
                desc: "Dialogue with Municipal Councils across Hargeisa, Borama and Burao to shape incentives, service delivery, and investment facilitation.",
                tags: ["Hargeisa", "Borama", "Burao"],
              },
            ].map((item) => (
              <div className={`${styles.whyCard} ${styles.whyCardBottom}`} key={item.num}>
                <div className={styles.whyCardBottomTop}>
                  <span className={styles.whyNum}>{item.num}</span>
                  <span className={styles.whyIcon} style={{ background: item.bg, color: item.color }}>
                    {item.icon}
                  </span>
                </div>
                <h3 className={styles.whyTitle}>{item.title}</h3>
                <p className={styles.whyDesc}>{item.desc}</p>
                <div className={styles.whyTags}>
                  {item.tags.map((t) => <span key={t}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── SCHEDULE ── */}
      <section className={`${styles.section} ${styles.scheduleSection}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.kicker}>
              <CalendarDays size={13} />
              Multi-City Roadshow
            </span>
            <h2 className={styles.sectionTitle}>The 2026 Roadshow at a Glance</h2>
            <p className={styles.sectionLead}>
              Hargeisa, Borama and Burao — each city representing a distinct pillar of
              Somaliland&apos;s economic and cultural strength. Full session details, speakers,
              and locations in the{" "}
              <Link href="/diaspora-week/portal">Event Portal</Link>.
            </p>
          </div>

          <div className={styles.scheduleGrid}>
            {scheduleDays.slice(0, 4).map((day, i) => {
              const accents = [
                { line: "#1f8a3b", bg: "linear-gradient(135deg,#d7f5e0,#b8eccb)", num: "#1f8a3b" },
                { line: "#0070c0", bg: "linear-gradient(135deg,#daeeff,#b8dcf5)", num: "#0070c0" },
                { line: "#b45309", bg: "linear-gradient(135deg,#fef3c7,#fde68a)", num: "#b45309" },
                { line: "#7c3aed", bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", num: "#7c3aed" },
              ];
              const a = accents[i];
              return (
                <div
                  className={styles.schedCard}
                  key={day.dayNumber}
                  style={{ "--accent": a.line } as React.CSSProperties}
                >
                  <div className={styles.schedCardTop}>
                    <span className={styles.schedDayNum} style={{ background: a.bg, color: a.num }}>
                      {String(day.dayNumber).padStart(2, "0")}
                    </span>
                    <div className={styles.schedMeta}>
                      <span className={styles.schedDayLabel}>{day.dayLabel || `Day ${day.dayNumber}`}</span>
                      {day.date && <span className={styles.schedDate}>{day.date}</span>}
                    </div>
                    <span className={styles.schedEmoji}>{(day as { icon?: string }).icon || "📅"}</span>
                  </div>
                  <h3 className={styles.schedTitle}>{day.title}</h3>
                  {(day as { desc?: string }).desc && (
                    <p className={styles.schedDesc}>{(day as { desc?: string }).desc}</p>
                  )}
                  <Link href="/diaspora-week/portal" className={styles.schedLink}>
                    <CalendarDays size={13} />
                    View full schedule
                    <ChevronRight size={13} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── EXHIBITORS ── */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.kicker}>
              <Building2 size={13} />
              Showcase
            </span>
            <h2 className={styles.sectionTitle}>Meet the Exhibitors</h2>
            <p className={styles.sectionLead}>
              Diaspora businesses and organizations from around the world will showcase
              their products, services and investment opportunities throughout the week.
            </p>
          </div>

          {!loading && content.exhibitorsPreview.length > 0 ? (
            <div className={styles.logoGrid}>
              {content.exhibitorsPreview.map((item) => (
                <div className={styles.logoCard} key={item.id}>
                  {item.logo ? (
                    <img src={item.logo} alt={item.name} />
                  ) : (
                    <span className={styles.logoFallback}>{item.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.logoGrid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div className={styles.logoCard} key={i}>
                  <img src="/partners/Ministry.jpg" alt="Exhibitor" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── STARTUP PITCHING ── */}
      {/* <section className={styles.pitchSection}>
        <div className="container">
          <div className={styles.pitchInner}>
            <div className={styles.pitchLeft}>
              <div className={styles.pitchIconWrap}>
                <Lightbulb size={36} />
              </div>
              <span className={styles.kicker} style={{ color: "#fbbf24" }}>
                Innovation Stage
              </span>
              <h2 className={styles.pitchTitle}>Startup Pitching Session</h2>
              <p className={styles.pitchDesc}>
                A dedicated stage where diaspora entrepreneurs pitch transformative ideas to a
                panel of investors, partners and community leaders. This is your moment to turn
                a vision into a funded reality.
              </p>
              <div className={styles.pitchFeatures}>
                <div className={styles.pitchFeature}>
                  <TrendingUp size={16} /> Pitch to real investors
                </div>
                <div className={styles.pitchFeature}>
                  <Users size={16} /> Live audience of 500+
                </div>
                <div className={styles.pitchFeature}>
                  <Star size={16} /> Winners announced at Gala
                </div>
              </div>
              <Link href="/diaspora-week/register" className={styles.pitchCta}>
                Apply to Pitch
                <ChevronRight size={16} />
              </Link>
            </div>
            <div className={styles.pitchRight}>
              <div className={styles.pitchStat}>
                <strong>Day 2</strong>
                <span>Innovation Stage</span>
              </div>
              <div className={styles.pitchStat}>
                <strong>10+</strong>
                <span>Startup Slots</span>
              </div>
              <div className={styles.pitchStat}>
                <strong>$50K+</strong>
                <span>In Potential Investment Discussions</span>
              </div>
              <div className={styles.pitchStat}>
                <strong>Live</strong>
                <span>Judging Panel</span>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* ── GALLERY ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.kicker}>
              <Camera size={13} />
              Memories
            </span>
            <h2 className={styles.sectionTitle}>Photo &amp; Video Gallery</h2>
            <p className={styles.sectionLead}>
              A glimpse of past Diaspora Week moments. Full media archive available to
              registered participants in the Event Portal.
            </p>
          </div>

          {!loading && galleryImages.length > 0 ? (
            <div className={styles.galleryGrid}>
              {galleryImages.map((item) => (
                <div className={styles.galleryItem} key={item.id}>
                  {item.type === "video" ? (
                    <video src={item.url} muted loop playsInline />
                  ) : (
                    <img src={item.url} alt={item.title} />
                  )}
                  {item.type === "video" && (
                    <span className={styles.galleryPlay}>
                      <Play size={20} fill="white" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.galleryPlaceholder}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className={styles.galleryPlaceholderItem}>
                  <Camera size={20} />
                </div>
              ))}
              <div className={styles.galleryPlaceholderOverlay}>
                <Camera size={32} />
                <p>Photos &amp; videos from Diaspora Week 2026 will appear here</p>
                <Link href="/diaspora-week/portal" className={styles.galleryPortalLink}>
                  Access Event Portal
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── ORGANIZERS & PARTNERS ── */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.kicker}>
              <Handshake size={13} />
              Collaboration
            </span>
            <h2 className={styles.sectionTitle}>Organizers &amp; Partners</h2>
            <p className={styles.sectionLead}>
              Local government bodies and partner organizations supporting Somaliland Diaspora
              Week.
            </p>
          </div>

          <div className={styles.partnerGroups}>
            <div
              className={styles.partnerGroup}
              style={
                {
                  "--partner-accent": "linear-gradient(90deg,#1f8a3b,#6fcf8d)",
                  "--partner-accent-soft": "#e8f7ec",
                } as CSSProperties
              }
            >
              <h3 className={styles.partnerGroupLabel} style={{ color: "#1f8a3b" }}>
                <Building2 size={16} />
                Local Government
              </h3>
              <div className={styles.partnersStrip}>
                {[
                  {
                    name: "Hargeisa Local Government",
                    abbr: "DHH",
                    logo: "/partners/DHH.jpg",
                  },
                  {
                    name: "Burco Local Government",
                    abbr: "DHB",
                    logo: "/partners/DHBurco.jpg",
                  },
                  {
                    name: "Berbera Maritime Authority",
                    abbr: "BMA",
                    logo: "/partners/DHBerbera.jpg",
                  },
                ].map((p) => (
                  <div className={`${styles.partnerLogo} ${styles.partnerLogoZoomSm}`} key={p.name}>
                    <img
                      src={p.logo}
                      alt={p.name}
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.style.display = "none";
                        const fb = img.nextElementSibling as HTMLElement | null;
                        if (fb) fb.style.display = "flex";
                      }}
                    />
                    <span className={styles.partnerFallback} style={{ display: "none" }}>
                      {p.abbr}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={styles.partnerGroup}
              style={
                {
                  "--partner-accent": "linear-gradient(90deg,#b45309,#f4a637)",
                  "--partner-accent-soft": "#fdf0dc",
                } as CSSProperties
              }
            >
              <h3 className={styles.partnerGroupLabel} style={{ color: "#b45309" }}>
                <Handshake size={16} />
                Partners
              </h3>
              <div className={styles.partnersStrip}>
                {[
                  {
                    name: "Dahabshiil",
                    abbr: "DS",
                    logo: "/partners/dahabshiil-clear.png",
                    bg: "linear-gradient(135deg,#4caf50,#3d8b40)",
                  },
                  {
                    name: "Telesom",
                    abbr: "TL",
                    logo: "/partners/telesom.png",
                    bg: "linear-gradient(135deg,#9ccc3c,#7cb030)",
                  },
                  {
                    name: "IOM",
                    abbr: "IOM",
                    logo: "/partners/IOM-clear.png",
                    bg: "linear-gradient(135deg,#1f3fa0,#142a73)",
                  },
                ].map((p) => (
                  <div
                    className={`${styles.partnerLogo} ${p.bg ? styles.partnerLogoZoom : ""}`}
                    key={p.name}
                    style={p.bg ? { background: p.bg, border: "none" } : undefined}
                  >
                    {p.logo && (
                      <img
                        src={p.logo}
                        alt={p.name}
                        onError={(e) => {
                          const img = e.currentTarget;
                          img.style.display = "none";
                          const fb = img.nextElementSibling as HTMLElement | null;
                          if (fb) fb.style.display = "flex";
                        }}
                      />
                    )}
                    <span
                      className={styles.partnerFallback}
                      style={{ display: p.logo ? "none" : "flex" }}
                    >
                      {p.abbr}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
