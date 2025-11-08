"use client";
import React, { useState } from "react";
import Header from "../components/header";
import BreadCamp from "../components/BreadCamp";
import { de } from "zod/locales";
import { Investments } from "../data/Investments";
import { explorePlaces } from "../data/explores";

const InvestmentPage = () => {
  const [activeTab, setActiveTab] = useState<"sectors" | "explore">("sectors");
  return (
    <>
      <Header />
      <main>
        <BreadCamp title="Investments" />

        <section className="investment-section ">
          <div className="container">
            {/* Top toggle to switch between sections */}
            <div className="row mb-30">
              <div className="col-lg-12">
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ flex: 1 }} />
                  <div
                    role="tablist"
                    aria-label="Investment sections toggle"
                    style={{
                      display: "inline-flex",
                      background: "#f1f5f3",
                      padding: 4,
                      borderRadius: 999,
                    }}
                  >
                    <button
                      onClick={() => setActiveTab("sectors")}
                      role="tab"
                      aria-selected={activeTab === "sectors"}
                      style={{
                        border: "none",
                        background:
                          activeTab === "sectors" ? "#006D21" : "transparent",
                        color: activeTab === "sectors" ? "#fff" : "#063e1f",
                        padding: "8px 14px",
                        borderRadius: 999,
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      Investment Sectors
                    </button>
                    <button
                      onClick={() => setActiveTab("explore")}
                      role="tab"
                      aria-selected={activeTab === "explore"}
                      style={{
                        border: "none",
                        background:
                          activeTab === "explore" ? "#006D21" : "transparent",
                        color: activeTab === "explore" ? "#fff" : "#063e1f",
                        padding: "8px 14px",
                        borderRadius: 999,
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      Explore Somaliland
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Introduction */}
            {activeTab === "sectors" && (
              <div className="row mb-60">
                <div className="col-lg-12">
                  <div className="investment-intro">
                    <div className="section-title2 mb-40">
                      <h2 className="section-title2__wrapper-title">
                        Priority Sectors for Investment
                      </h2>
                    </div>
                    <p
                      className="mb-20"
                      style={{ fontSize: "16px", lineHeight: "1.8" }}
                    >
                      Somaliland is a land of unexploited potential and emerging
                      opportunities. Strategically located in the Horn of
                      Africa, with an 850-kilometer coastline along the Gulf of
                      Aden, it is a natural gateway to African and Middle
                      Eastern markets. Blessed with abundant natural resources,
                      a resilient and youthful population, and a deep-rooted
                      cultural heritage, Somaliland offers a stable and
                      investor-friendly environment.
                    </p>
                    <p style={{ fontSize: "16px", lineHeight: "1.8" }}>
                      The government is prioritizing key growth sectors:
                      agriculture, livestock, fisheries, technology, trade &
                      logistics, mining, and renewable energy, each supported by
                      a government committed to economic transformation and
                      sustainable development. With competitive business
                      policies, improving infrastructure, and a growing appetite
                      for innovation, Somaliland stands ready to welcome
                      forward-thinking investors and partners. We invite you to
                      explore the opportunities that await in Somaliland, where
                      tradition meets ambition and investment drives impact.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "explore" && (
              <div className="row mb-60">
                <div className="col-lg-12">
                  <div className="investment-intro">
                    <div className="section-title2 mb-40">
                      <h2 className="section-title2__wrapper-title">
                        Explore Somaliland
                      </h2>
                    </div>
                    <p
                      className="mb-20"
                      style={{ fontSize: "16px", lineHeight: "1.8" }}
                    >
                      Somaliland is a unique destination where rich culture,
                      dramatic landscapes, and entrepreneurial opportunity meet.
                      From ancient rock art sites and bustling markets to long
                      stretches of coastline and mountain ranges, the region is
                      ideal for both travelers and investors seeking authentic
                      experiences and high-impact projects.
                    </p>
                    <p style={{ fontSize: "16px", lineHeight: "1.8" }}>
                      Must-see destinations include Laas Geel's prehistoric
                      paintings, the historic port town of Berbera, and the Cal
                      Madow mountains. Whether you're exploring cultural
                      heritage, eco-tourism, or locating strategic logistics
                      hubs, Somaliland offers a welcoming environment and
                      growing infrastructure to support sustainable travel and
                      long-term investment.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "sectors" && (
              <>
                {/* Investment Sectors */}
                <div className="row">
                  {Investments.map((sector, index) => (
                    <div className="col-lg-6 col-md-6 mb-40" key={index}>
                      <div
                        className="investment-card"
                        style={{
                          background: "#fff",
                          padding: "22px",
                          borderRadius: "12px",
                          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                          height: "100%",
                          border: "1px solid #eef0ef",
                          transition:
                            "transform 0.32s ease, boxShadow 0.32s ease",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          className="card-media"
                          style={{
                            height: 260,
                            borderRadius: "10px",
                            overflow: "hidden",
                            marginBottom: 18,
                            position: "relative",
                            background:
                              "linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.02))",
                          }}
                        >
                          <img
                            src={sector.image}
                            alt={`${sector.title} - investment preview`}
                            loading="lazy"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                          <div
                            aria-hidden="true"
                            style={{
                              position: "absolute",
                              left: 14,
                              top: 14,
                              padding: "6px 12px",
                              borderRadius: 999,
                              background: "rgba(0,109,33,0.92)",
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: 13,
                              letterSpacing: "0.4px",
                              textTransform: "uppercase",
                            }}
                          >
                            0{index + 1}
                          </div>
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              background:
                                "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.18))",
                              pointerEvents: "none",
                            }}
                          />
                        </div>

                        <div
                          className="investment-card-body"
                          style={{ flex: 1 }}
                        >
                          <h3
                            style={{
                              fontSize: "20px",
                              fontWeight: 700,
                              color: "#063e1f",
                              marginBottom: "10px",
                            }}
                          >
                            {sector.title}
                          </h3>

                          <h4
                            style={{
                              fontSize: "13px",
                              fontWeight: 700,
                              color: "#333",
                              marginBottom: "12px",
                              textTransform: "uppercase",
                              letterSpacing: "0.6px",
                            }}
                          >
                            Investment Opportunities
                          </h4>

                          <ul
                            style={{
                              listStyle: "none",
                              padding: 0,
                              margin: 0,
                              display: "grid",
                              gap: 10,
                            }}
                          >
                            {sector.opportunities.map((opportunity, idx) => (
                              <li
                                key={idx}
                                style={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  gap: 10,
                                  color: "#444",
                                  fontSize: 15,
                                  lineHeight: 1.5,
                                }}
                              >
                                <span
                                  style={{
                                    minWidth: 20,
                                    minHeight: 20,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 6,
                                    background: "#e9f7ee",
                                    color: "#006D21",
                                    fontWeight: 700,
                                    fontSize: 12,
                                    flexShrink: 0,
                                  }}
                                  aria-hidden="true"
                                >
                                  ✓
                                </span>
                                <span>{opportunity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Call to Action */}
                <div className="row mt-40 mb-60">
                  <div className="col-lg-12">
                    <div
                      className="investment-cta"
                      style={{
                        background:
                          "linear-gradient(135deg, #006D21 0%, #004d17 100%)",
                        padding: "50px 40px",
                        borderRadius: "15px",
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "28px",
                          fontWeight: "700",
                          marginBottom: "20px",
                          color: "#fff",
                        }}
                      >
                        Ready to Invest in Somaliland?
                      </h3>
                      <p
                        style={{
                          fontSize: "16px",
                          marginBottom: "30px",
                          maxWidth: "700px",
                          margin: "0 auto 30px",
                          color: "#fff",
                          opacity: "0.95",
                        }}
                      >
                        Join us in building a prosperous future. Contact our
                        investment team to learn more about opportunities and
                        support available for investors.
                      </p>
                      <a
                        href="/contact"
                        className="rr-btn"
                        style={{
                          background: "#fff",
                          color: "#006D21",
                          padding: "15px 40px",
                          display: "inline-block",
                          borderRadius: "5px",
                          fontWeight: "600",
                          textDecoration: "none",
                        }}
                      >
                        Get in Touch <i className="fa-solid fa-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Explore Somaliland section */}
            {activeTab === "explore" && (
              <>
                <div className="row mb-40">
                  <div className="col-lg-12">
                    <div
                      className="explore-somaliland"
                      style={
                        {
                          // padding: "26px",
                          // borderRadius: "12px",
                          // background: "#f6fbf7",
                          // border: "1px solid #e6f0e9",
                        }
                      }
                    >
                      <h3
                        style={{
                          fontSize: "22px",
                          color: "#063e1f",
                          marginBottom: 12,
                        }}
                      >
                        Explore Somaliland
                      </h3>
                      <p
                        style={{
                          fontSize: "16px",
                          lineHeight: 1.7,
                          color: "#333",
                          marginBottom: 16,
                        }}
                      >
                        Discover Somaliland's culture, history and the
                        must-visit places below. Click any image for a larger
                        view or to learn more.
                      </p>

                      {/* Places list: one column per item, styled like investment cards */}
                      <div
                        className="places-grid"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr", // two columns - first item twice as wide
                          gap: 16,
                          marginTop: 12,
                        }}
                      >
                        {explorePlaces.map((place, idx) => (
                          <div
                            key={idx}
                            className="place-card"
                            style={{
                              background: "#fff",
                              borderRadius: 12,
                              overflow: "hidden",
                              boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                              border: "1px solid #eef0ef",
                              display: "flex",
                              flexDirection: "column",
                              transition:
                                "transform 0.28s ease, box-shadow 0.28s ease",
                            }}
                          >
                            <div
                              style={{
                                height: 320,
                                overflow: "hidden",
                                position: "relative",
                                background:
                                  "linear-gradient(180deg, rgba(0,0,0,0.03), rgba(0,0,0,0.02))",
                              }}
                            >
                              <img
                                src={place.image}
                                alt={place.name}
                                loading="lazy"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  display: "block",
                                }}
                              />
                              <div
                                aria-hidden="true"
                                style={{
                                  position: "absolute",
                                  left: 14,
                                  top: 14,
                                  padding: "6px 12px",
                                  borderRadius: 999,
                                  background: "rgba(0,109,33,0.92)",
                                  color: "#fff",
                                  fontWeight: 700,
                                  fontSize: 13,
                                  letterSpacing: "0.4px",
                                  textTransform: "uppercase",
                                }}
                              >
                                {`0${idx + 1}`}
                              </div>
                            </div>

                            <div
                              style={{
                                padding: 18,
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                              }}
                            >
                              <h4
                                style={{
                                  margin: 0,
                                  fontSize: 18,
                                  color: "#063e1f",
                                  fontWeight: 700,
                                }}
                              >
                                {place.name}
                              </h4>
                              <p
                                style={{
                                  margin: 0,
                                  color: "#444",
                                  fontSize: 15,
                                  lineHeight: 1.6,
                                }}
                              >
                                {place.description}
                              </p>
                              <div
                                style={{
                                  display: "flex",
                                  // justifyContent: "end",
                                  gap: 12,
                                  marginTop: 16,
                                }}
                              >
                                <a
                                  href="https://www.google.com/maps/dir/?api=1&destination=Somaliland"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rr-btn"
                                  style={{
                                    background: "#006D21",
                                    color: "#fff",
                                    padding: "10px 18px",
                                    borderRadius: 6,
                                    textDecoration: "none",
                                    fontWeight: 600,
                                  }}
                                >
                                  Get Directions
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Call to Action */}
                <div className="row mt-40 mb-60">
                  <div className="col-lg-12">
                    <div
                      className="investment-cta"
                      style={{
                        background:
                          "linear-gradient(135deg, #006D21 0%, #004d17 100%)",
                        padding: "50px 40px",
                        borderRadius: "15px",
                        textAlign: "center",
                        color: "#fff",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "28px",
                          fontWeight: "700",
                          marginBottom: "20px",
                          color: "#fff",
                        }}
                      >
                        Ready to Invest in Somaliland?
                      </h3>
                      <p
                        style={{
                          fontSize: "16px",
                          marginBottom: "30px",
                          maxWidth: "700px",
                          margin: "0 auto 30px",
                          color: "#fff",
                          opacity: "0.95",
                        }}
                      >
                        Join us in building a prosperous future. Contact our
                        investment team to learn more about opportunities and
                        support available for investors.
                      </p>
                      <a
                        href="/contact"
                        className="rr-btn"
                        style={{
                          background: "#fff",
                          color: "#006D21",
                          padding: "15px 40px",
                          display: "inline-block",
                          borderRadius: "5px",
                          fontWeight: "600",
                          textDecoration: "none",
                        }}
                      >
                        Get in Touch <i className="fa-solid fa-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default InvestmentPage;
