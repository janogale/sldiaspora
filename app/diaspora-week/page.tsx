"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Building2,
  CalendarDays,
  Camera,
  Handshake,
  Lightbulb,
  Rocket,
  Sparkles,
  Users,
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
  { dayNumber: 1, dayLabel: "Day 1", title: "Opening Ceremony & Presidential Address" },
  { dayNumber: 2, dayLabel: "Day 2", title: "New Partnership Model & Startup Pitching" },
  { dayNumber: 3, dayLabel: "Day 3", title: "Closing Ceremony & Cultural Gala" },
  { dayNumber: 4, dayLabel: "Day 4", title: "Family & Cultural Fun Day" },
];

export default function DiasporaWeekPage() {
  const [content, setContent] = useState<PublicContent>(EMPTY_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const response = await fetch("/api/diaspora-week/content", { method: "GET" });
        const result = (await response.json().catch(() => null)) as
          | { data?: PublicContent }
          | null;

        if (!isMounted) return;
        if (response.ok && result?.data) {
          setContent(result.data);
        }
      } catch {
        // keep defaults
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const scheduleDays =
    content.scheduleOutline.length > 0
      ? content.scheduleOutline
      : FALLBACK_DAYS.map((item) => ({ ...item, date: "" }));

  return (
    <main className={styles.page}>
      <Header />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContainer}`}>
          <span className={styles.heroBadge}>
            <Sparkles size={16} />
            Annual Flagship Event
          </span>
          <h1 className={styles.heroTitle}>Somaliland Diaspora Week</h1>
          <p className={styles.heroSubtitle}>
            Five days of innovation, investment, culture and connection — bringing together the
            global Somaliland diaspora, businesses, exhibitors and innovators under one roof.
          </p>

          <div className={styles.heroActions}>
            <Link href="/diaspora-week/register" className={styles.primaryCta}>
              Register Now
              <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
            </Link>
            <Link href="/diaspora-week/portal" className={styles.secondaryCta}>
              <CalendarDays size={16} />
              View Event Portal
            </Link>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <strong>5</strong>
              <span>Days of Activities</span>
            </div>
            <div className={styles.heroStat}>
              <strong>2</strong>
              <span>Registration Types</span>
            </div>
            <div className={styles.heroStat}>
              <strong>{content.exhibitorsCount || "—"}</strong>
              <span>Exhibitors</span>
            </div>
            <div className={styles.heroStat}>
              <strong>{content.partnersCount || "—"}</strong>
              <span>Partners</span>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.kicker}>About the Event</span>
            <h2 className={styles.sectionTitle}>What is Diaspora Week?</h2>
            <p className={styles.sectionLead}>
              Somaliland Diaspora Week is a 4-day flagship gathering that connects diaspora
              members, entrepreneurs, investors, and local businesses through exhibitions,
              forums, cultural showcases, and a dedicated startup pitching session. Whether
              you&apos;re joining as an individual or representing a business, the event is
              designed to build lasting partnerships across the diaspora community.
            </p>
          </div>

          <div className={styles.highlightsGrid}>
            <div className={styles.highlightCard}>
              <span className={styles.highlightIcon}>
                <CalendarDays size={22} />
              </span>
              <h3>4-Day Event Schedule</h3>
              <p>A full week of forums, workshops, networking sessions and cultural programs.</p>
            </div>
            <div className={styles.highlightCard}>
              <span className={styles.highlightIcon}>
                <Building2 size={22} />
              </span>
              <h3>Exhibitors</h3>
              <p>Businesses and organizations showcase products, services and investment opportunities.</p>
            </div>
            <div className={styles.highlightCard}>
              <span className={styles.highlightIcon}>
                <Rocket size={22} />
              </span>
              <h3>Startup Pitching Session</h3>
              <p>Diaspora-led startups pitch ideas to investors, partners and the community.</p>
            </div>
            <div className={styles.highlightCard}>
              <span className={styles.highlightIcon}>
                <Camera size={22} />
              </span>
              <h3>Photo &amp; Video Coverage</h3>
              <p>Relive past events and follow live coverage through our media gallery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule outline */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.kicker}>4-Day Program</span>
            <h2 className={styles.sectionTitle}>Event Schedule Outline</h2>
            <p className={styles.sectionLead}>
              Here&apos;s a quick look at how the week unfolds. View the full session details,
              speakers, and locations in the{" "}
              <Link href="/diaspora-week/portal">Event Portal</Link>.
            </p>
          </div>

          <div className={styles.scheduleGrid}>
            {scheduleDays.slice(0, 4).map((day) => (
              <div className={styles.dayCard} key={day.dayNumber}>
                <span className={styles.dayBadge}>{day.dayLabel || `Day ${day.dayNumber}`}</span>
                {day.date && <span className={styles.dayDate}>{day.date}</span>}
                <h3>{day.title}</h3>
                <div className={styles.dayLockNote}>
                  <CalendarDays size={13} />
                  <Link href="/diaspora-week/portal">View full details</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exhibitors */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.kicker}>Showcase</span>
            <h2 className={styles.sectionTitle}>Exhibitors</h2>
            <p className={styles.sectionLead}>
              Diaspora businesses and organizations from around the world will showcase their
              products, services and investment opportunities throughout the week.
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
                  <strong>{item.name}</strong>
                  {item.category && <span>{item.category}</span>}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.placeholderCard}>
              <Building2 size={28} />
              <p>Exhibitor list will be published soon. Register as a business to apply for a booth.</p>
            </div>
          )}
        </div>
      </section>

      {/* Startup Pitching */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <div className={styles.pitchBanner}>
            <div className={styles.pitchIcon}>
              <Lightbulb size={32} />
            </div>
            <div>
              <span className={styles.kicker}>Innovation Stage</span>
              <h2 className={styles.sectionTitle}>Startup Pitching Session</h2>
              <p className={styles.sectionLead}>
                A dedicated session where diaspora entrepreneurs and startups pitch their ideas
                to a panel of investors, partners and community leaders. Indicate your interest
                during registration to apply for a pitching slot.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.kicker}>Memories</span>
            <h2 className={styles.sectionTitle}>Photo &amp; Video Gallery</h2>
            <p className={styles.sectionLead}>
              A glimpse from previous Diaspora Week events. Approved participants get access to
              the full media archive in the Event Portal.
            </p>
          </div>

          {!loading && content.galleryPreview.length > 0 ? (
            <div className={styles.galleryGrid}>
              {content.galleryPreview.map((item) => (
                <div className={styles.galleryItem} key={item.id}>
                  {item.type === "video" ? (
                    <video src={item.url} muted loop playsInline />
                  ) : (
                    <img src={item.url} alt={item.title} />
                  )}
                  {item.type === "video" && (
                    <span className={styles.galleryPlay}>
                      <i className="fa-solid fa-play" aria-hidden="true"></i>
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.placeholderCard}>
              <Camera size={28} />
              <p>Gallery from this year&apos;s Diaspora Week will appear here.</p>
            </div>
          )}
        </div>
      </section>

      {/* Partners */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.kicker}>Collaboration</span>
            <h2 className={styles.sectionTitle}>Our Partners</h2>
          </div>

          {!loading && content.partnersPreview.length > 0 ? (
            <div className={styles.partnersStrip}>
              {content.partnersPreview.map((item) => (
                <div className={styles.partnerLogo} key={item.id}>
                  {item.logo ? (
                    <img src={item.logo} alt={item.name} />
                  ) : (
                    <span>{item.name}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.placeholderCard}>
              <Handshake size={28} />
              <p>Partner organizations will be announced soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={`container ${styles.ctaInner}`}>
          <div className={styles.ctaIcon}>
            <Users size={28} />
          </div>
          <div className={styles.ctaText}>
            <h2>Ready to participate at Somaliland Diaspora Week?</h2>
            <p>
              The event portal is open to everyone — explore the full schedule, exhibitors and
              gallery. Register as an individual or a business to secure a venue hall booth or
              startup pitching slot.
            </p>
          </div>
          <Link href="/diaspora-week/register" className={styles.ctaButton}>
            Start Registration
            <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </Link>
        </div>
      </section>
    </main>
  );
}
