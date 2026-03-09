import styles from "./introduction-section.module.css";
import {
  Building2,
  Circle,
  FileText,
  Handshake,
  HeartHandshake,
  LifeBuoy,
  Lightbulb,
  LineChart,
  Map,
  Users,
} from "lucide-react";
import Link from "next/link";
import { getServices } from "../../lib/services";

const ICON_BY_KEY = {
  handshake: Handshake,
  map: Map,
  linechart: LineChart,
  chartline: LineChart,
  chart: LineChart,
  building2: Building2,
  building: Building2,
  users: Users,
  usergroup: Users,
  group: Users,
  filetext: FileText,
  file: FileText,
  document: FileText,
  lifebuoy: LifeBuoy,
  supportagent: LifeBuoy,
  headsetmic: LifeBuoy,
  support: LifeBuoy,
  hearthandshake: HeartHandshake,
  community: HeartHandshake,
  lightbulb: Lightbulb,
  idea: Lightbulb,
} as const;

function normalizeIconKey(raw: string): keyof typeof ICON_BY_KEY | "fallback" {
  const normalized = raw.toLowerCase();
  const key = normalized.replace(/[^a-z0-9]/g, "");

  if (key in ICON_BY_KEY) return key as keyof typeof ICON_BY_KEY;

  const aliases: Array<[pattern: RegExp, target: keyof typeof ICON_BY_KEY]> = [
    [/(handshake|hand-shake)/, "handshake"],
    [/(^|[^a-z])map([^a-z]|$)|globe|location/, "map"],
    [/(linechart|line-chart|chartline|chart|analytics|graph)/, "linechart"],
    [/(building|office|home)/, "building2"],
    [/(users|people|team|group)/, "users"],
    [/(filetext|file-text|file|document|policy|doc)/, "filetext"],
    [/(lifebuoy|life-buoy|supportagent|support_agent|support|headset|help|rescue)/, "lifebuoy"],
    [/(hearthandshake|heart-handshake|community|care|solidarity)/, "hearthandshake"],
    [/(lightbulb|light-bulb|idea|knowledge|innovation)/, "lightbulb"],
  ];

  for (const [pattern, target] of aliases) {
    if (pattern.test(normalized) || pattern.test(key)) return target;
  }

  return "fallback";
}

function isMaterialSymbolName(value: string): boolean {
  if (!value.trim()) return false;
  return /[_\s:]/.test(value) || /^[a-z0-9_]+$/.test(value.trim());
}

const introImage = {
  src: "/team-img2.jpeg",
  alt: "Diaspora community gathering",
};

const IntroductionSection = async () => {
  const services = await getServices();

  return (
    <section className={styles.root} aria-labelledby="diaspora-heading">
      <div className="container">
        <div className={styles.top}>
          <div className={styles.lead}>
            <div className={styles.eyebrow}>About</div>
            <h2 id="diaspora-heading" className={styles.heading}>
              About the Diaspora Department
            </h2>

            <div className={styles.introText}>
              <p>
                The Diaspora Department serves as a vital link between the
                global Somaliland diaspora and the government of Somaliland,
                acting as a bridge to facilitate seamless access to resources,
                services, and opportunities for Somalilanders living abroad and
                when they return.
              </p>

              <p>
                Our mandate is to empower the diaspora community by providing
                tailored support, fostering engagement, and ensuring their
                contributions are maximized for the benefit of Somaliland’s
                prosperity. As a one-stop-shop for information, programs, and
                services, we are committed to addressing the unique needs of the
                diaspora both when they are in Somaliland and when they are
                abroad.
              </p>

              <p>
                We strive to create a strong network of collaboration,
                knowledge-sharing, and mutual support that aligns with the
                broader Somaliland agenda.
              </p>
            </div>

            <div className={styles.ctaRow}>
              
              <Link
                target="_blank"
                href="https://mfa.govsomaliland.org/article/diaspora-department"
              >
                <button className={`${styles.cta} ${styles.secondary}`}>
                  Learn More
                </button>
              </Link>
            </div>
          </div>

          <div className={styles.imageBox}>
            <div className={styles.slider}>
              <div className={`${styles.slide} ${styles.active}`}>
                <img
                  src={introImage.src}
                  alt={introImage.alt}
                  className={styles.sliderImage}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.subSection}>
          <h3 className={styles.subTitle}>Our Mandate and Areas of Service</h3>
          <p className={styles.subLead}>
            We operate with a dual focus: supporting the diaspora during their
            time in Somaliland and maintaining a strong connection while they
            are abroad.
          </p>

          <div className={styles.grid}>
            {services.map((s) => {
              const iconKey = normalizeIconKey(s.icon);
              const Icon = iconKey === "fallback" ? Circle : ICON_BY_KEY[iconKey];
              const renderMaterial = isMaterialSymbolName(s.icon);
              const materialName = s.icon
                .trim()
                .toLowerCase()
                .replace(/-/g, "_")
                .replace(/^materialsymbols(outlined|rounded|sharp):/, "")
                .replace(/^mi:/, "")
                .replace(/^icon:/, "");

              return (
              <article
                key={s.id}
                className={styles.card}
                aria-labelledby={`svc-${s.id}`}
              >
                <div className={styles.icon} aria-hidden>
                  {renderMaterial ? (
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 24, color: "#006d21", lineHeight: 1 }}
                    >
                      {materialName}
                    </span>
                  ) : (
                    <Icon size={24} color="#006d21" />
                  )}
                </div>
                <div>
                  <h4 id={`svc-${s.id}`} className={styles.cardTitle}>
                    {s.title}
                  </h4>
                  <p className={styles.cardText}>{s.description}</p>
                </div>
              </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroductionSection;
