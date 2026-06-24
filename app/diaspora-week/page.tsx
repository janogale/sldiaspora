"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
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
    dayLabel: "Day 1",
    title: "Opening Ceremony & Presidential Address",
    desc: "Grand opening with keynote speeches from top government officials and diaspora leaders.",
    icon: "🎯",
  },
  {
    dayNumber: 2,
    dayLabel: "Day 2",
    title: "New Partnership Model & Startup Pitching",
    desc: "Entrepreneurs pitch bold ideas to investors. Business partnerships forged for the future.",
    icon: "🚀",
  },
  {
    dayNumber: 3,
    dayLabel: "Day 3",
    title: "Closing Ceremony & Cultural Gala",
    desc: "A magnificent celebration of culture, achievement, and collective Somaliland identity.",
    icon: "🌟",
  },
  {
    dayNumber: 4,
    dayLabel: "Day 4",
    title: "Family & Cultural Fun Day",
    desc: "Community activities, music, art, and food — celebrating our shared heritage.",
    icon: "🎉",
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
      : FALLBACK_DAYS.map((item) => ({ ...item, date: "" }));

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
            Annual Flagship Event · Hargeisa, Somaliland
          </div>

          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleLine1}>Somaliland </span>
            <span className={styles.heroTitleLine2}>Diaspora Week</span>
          </h1>

          <p className={styles.heroSubtitle}>
            Four transformative days uniting the global Somaliland diaspora — through investment
            forums, startup pitching, cultural showcases, and partnerships that build our nation&apos;s future.
          </p>

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
              <h2 className={styles.sectionTitle}>Watch the Official Diaspora Week Announcement</h2>
              <p className={styles.sectionLead}>
                Hear directly from Somaliland government officials and diaspora leaders about this
                year&apos;s groundbreaking event. Discover why thousands of diaspora members are
                flying in from across the globe to be part of history.
              </p>
              <ul className={styles.videoHighlights}>
                <li><Globe size={15} /> Diaspora members from 40+ countries</li>
                <li><TrendingUp size={15} /> $50M+ in investment discussions</li>
                <li><Heart size={15} /> Cultural reconnection programs</li>
                <li><Star size={15} /> Awards & recognition ceremony</li>
              </ul>
              <button className={styles.watchNowBtn} onClick={() => setVideoOpen(true)}>
                <span className={styles.watchBtnPulse}>
                  <Play size={18} fill="white" />
                </span>
                Watch Now — 3 min
              </button>
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

      {/* ── WHY ATTEND ── */}
      <section className={`${styles.section} ${styles.whySection}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.kicker}>
              <Sparkles size={13} />
              Why Attend
            </span>
            <h2 className={styles.sectionTitle}>Four Days That Will Change Your Future</h2>
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
              <h3 className={styles.whyTitle}>4-Day Event Schedule</h3>
              <p className={styles.whyDesc}>
                A carefully curated four-day journey — opening ceremonies, investment forums,
                startup pitching, cultural galas, and networking sessions. Every moment is
                designed to connect, inspire, and transform the diaspora experience.
              </p>
              <div className={styles.whyTags}>
                <span>Forums</span>
                <span>Workshops</span>
                <span>Networking</span>
                <span>Gala Night</span>
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
                  <h3 className={styles.whyTitle}>Business Exhibition Hall</h3>
                  <p className={styles.whyDesc}>
                    Diaspora businesses showcase products, services and investment opportunities to a live audience of decision-makers.
                  </p>
                </div>
              </div>
              <div className={`${styles.whyCard} ${styles.whyCardSide}`}>
                <span className={styles.whyNum}>03</span>
                <span className={styles.whyIcon} style={{ background: "linear-gradient(135deg,#fef3c7,#fde68a)", color: "#b45309" }}>
                  <Rocket size={22} />
                </span>
                <div>
                  <h3 className={styles.whyTitle}>Startup Pitching Stage</h3>
                  <p className={styles.whyDesc}>
                    Pitch bold ideas to investors and community leaders. Winners announced at the closing gala.
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
                title: "Live Media Coverage",
                desc: "Follow the event live and access full media archives through our portal.",
                tags: ["Live Stream", "Photo Archive", "Videos"],
              },
              {
                num: "05",
                icon: <Globe size={22} />,
                bg: "linear-gradient(135deg,#ccfbf1,#a7f3d0)",
                color: "#0f766e",
                title: "Global Networking",
                desc: "Connect with diaspora members, investors and changemakers from 40+ countries.",
                tags: ["40+ Countries", "Investors", "Officials"],
              },
              {
                num: "06",
                icon: <Heart size={22} />,
                bg: "linear-gradient(135deg,#ffe4e6,#fecdd3)",
                color: "#be123c",
                title: "Cultural Reconnection",
                desc: "Celebrate Somaliland's rich identity through art, music, food and storytelling.",
                tags: ["Art", "Music", "Heritage"],
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

      {/* ── SCHEDULE ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.kicker}>
              <CalendarDays size={13} />
              4-Day Program
            </span>
            <h2 className={styles.sectionTitle}>Event Schedule Outline</h2>
            <p className={styles.sectionLead}>
              A carefully curated journey through four transformative days. Full session details,
              speakers, and locations in the{" "}
              <Link href="/diaspora-week/portal">Event Portal</Link>.
            </p>
          </div>

          <div className={styles.scheduleTimeline}>
            {scheduleDays.slice(0, 4).map((day, i) => (
              <div className={styles.timelineRow} key={day.dayNumber}>
                <div className={styles.timelineSide}>
                  <div className={styles.timelineNum}>{day.dayNumber}</div>
                  {i < 3 && <div className={styles.timelineLine} />}
                </div>
                <div className={styles.timelineCard}>
                  <div className={styles.timelineCardTop}>
                    <span className={styles.dayBadge}>{day.dayLabel || `Day ${day.dayNumber}`}</span>
                    {day.date && <span className={styles.dayDate}>{day.date}</span>}
                    <span className={styles.timelineEmoji}>{(day as { icon?: string }).icon || "📅"}</span>
                  </div>
                  <h3>{day.title}</h3>
                  {(day as { desc?: string }).desc && (
                    <p className={styles.timelineDesc}>{(day as { desc?: string }).desc}</p>
                  )}
                  <Link href="/diaspora-week/portal" className={styles.dayLink}>
                    <CalendarDays size={13} />
                    View full schedule
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
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
      <section className={styles.pitchSection}>
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
      </section>

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

      {/* ── PARTNERS ── */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.kicker}>
              <Handshake size={13} />
              Collaboration
            </span>
            <h2 className={styles.sectionTitle}>Our Partners</h2>
            <p className={styles.sectionLead}>
              Leading organizations supporting Somaliland Diaspora Week.
            </p>
          </div>

          <div className={styles.partnersStrip}>
              {[
                {
                  name: "Hargeisa Local Development Authority",
                  abbr: "HLDA",
                  logo: "/partners/DHH.jpg",
                },
                {
                  name: "Burco Municipality",
                  abbr: "BM",
                  logo: "/partners/DHBurco.jpg",
                },
                {
                  name: "Berbera Port Authority",
                  abbr: "BP",
                  logo: "/partners/DHBerbera.jpg",
                },
                {
                  name: "Ministry",
                  abbr: "MN",
                  logo: "/partners/Ministry.jpg",
                },
                {
                  name: "Telesom",
                  abbr: "TL",
                  logo: "/partners/telesom.jpg",
                },
                {
                  name: "Dahabshiil",
                  abbr: "DS",
                  logo: "/partners/dahabshiil.png",
                },
              ].map((p) => (
                <div className={styles.partnerLogo} key={p.name}>
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
      </section>
    </main>
  );
}
