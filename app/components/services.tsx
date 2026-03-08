import Link from "next/link";
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

  // Accept common Directus/icon-picker formats: "lucide:map", "fa-map", "line-chart".
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

async function Services() {
  const services = await getServices();

  return (
    <div id="services">
      {" "}
      <section className="visa-catagory__area section-space  overflow-hidden position-relative">
        <div className="container">
          <div className="section-title2 mb-60">
            <div className="section-title2__wrapper">
              <span
                className="section-title2__wrapper-subtitle wow fadeInLeft animated"
                data-wow-delay=".2s"
              >
                What We Do
                <img
                  style={{ width: "52px", height: "10px" }}
                  src="./assets/imgs/shape2.svg"
                  alt=""
                />
              </span>
              <h2
                className="section-title2__wrapper-title  wow fadeInLeft animated"
                data-wow-delay=".3s"
              >
                Empowering the Somaliland Diaspora
              </h2>
            </div>
            <div
              className="section-title2__button wow fadeInLeft animated"
              data-wow-delay=".4s"
            >
              <Link href="/contact">
                Get in Touch <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="row mb-minus-30">
                {services.length === 0 && (
                  <div className="col-12">
                    <div className="visa-catagory__item mb-3">
                      <div className="visa-catagory__item-content">
                        <h3 style={{ fontSize: "26px" }} className="visa-catagory__title">
                          Services will be available soon
                        </h3>
                        <p>We are updating this section from Directus.</p>
                      </div>
                    </div>
                  </div>
                )}
                {services.map((service) => {
                  const iconKey = normalizeIconKey(service.icon);
                  const Icon = iconKey === "fallback" ? Circle : ICON_BY_KEY[iconKey];
                  const renderMaterial = isMaterialSymbolName(service.icon);
                  const materialName = service.icon
                    .trim()
                    .toLowerCase()
                    .replace(/-/g, "_")
                    .replace(/^materialsymbols(outlined|rounded|sharp):/, "")
                    .replace(/^mi:/, "")
                    .replace(/^icon:/, "");

                  return (
                    <div className="col-sm-4" key={service.id}>
                      <div
                        className="visa-catagory__item mb-3 wow fadeInLeft animated"
                        data-wow-delay=".3s"
                      >
                        <div className="visa-catagory__item-icon">
                          {renderMaterial ? (
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: 34, color: "#006d21", lineHeight: 1 }}
                              aria-hidden="true"
                            >
                              {materialName}
                            </span>
                          ) : (
                            <Icon size={34} color="#006d21" />
                          )}
                        </div>
                        <div className="visa-catagory__item-content">
                          <h3
                            style={{ fontSize: "26px" }}
                            className="visa-catagory__title"
                          >
                            {service.title}
                          </h3>
                          <p>{service.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
