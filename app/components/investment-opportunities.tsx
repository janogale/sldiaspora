"use client";

import Link from "next/link";
import React from "react";
import { Investments } from "../data/Investments";

const InvestmentOpportunities = () => {
  return (
    <section
      className="investment-opportunities__area section-space"
      style={{
        background: "linear-gradient(180deg, #f8faf9 0%, #ffffff 100%)",
      }}
    >
      <div className="container">
        <div className="section-title2 mb-60">
          <div className="section-title2__wrapper">
            <span
              className="section-title2__wrapper-subtitle wow fadeInLeft animated"
              data-wow-delay=".2s"
            >
              Priority Sectors for Growth
              <img
                style={{ width: "52px", height: "10px" }}
                src="./assets/imgs/shape2.svg"
                alt=""
              />
            </span>
            <h2
              className="section-title2__wrapper-title  wow fadeInLeft animated"
              data-wow-delay=".3s"
              style={{ fontSize: "4 rem" }}
            >
              INVESTMENT OPPORTUNITIES
            </h2>
            <p
              className="wow fadeInUp animated"
              data-wow-delay=".4s"
              style={{
                maxWidth: "650px",
                margin: "0 auto",
                color: "#666",
                fontSize: "1.5rem",
                lineHeight: "1.6",
              }}
            >
              Explore strategic investment sectors driving economic growth and
              sustainable development in Somaliland
            </p>
          </div>
        </div>
        <div className="row g-4">
          {Investments.slice(0, 6).map((investment, index) => (
            <div className="col-lg-4 col-md-6" key={index}>
              <div
                className="investment-card h-100 wow fadeInUp animated"
                data-wow-delay={`.${index + 2}s`}
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0, 109, 33, 0.08)",
                  border: "1px solid rgba(0, 109, 33, 0.1)",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 40px rgba(0, 109, 33, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(0, 109, 33, 0.08)";
                }}
              >
                <div
                  className="investment-card__image position-relative"
                  style={{ height: "240px", overflow: "hidden" }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.7) 100%)",
                      zIndex: 1,
                    }}
                  />
                  <img
                    src={investment.image}
                    alt={investment.title}
                    className="w-100 h-100"
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      left: "20px",
                      right: "20px",
                      zIndex: 2,
                    }}
                  >
                    <h3
                      className="investment-card__title mb-0"
                      style={{
                        fontSize: "2rem",
                        fontWeight: "700",
                        color: "#ffffff",
                        textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      {investment.title}
                    </h3>
                  </div>
                </div>
                <div className="investment-card__content p-4">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "3px",
                        background:
                          "linear-gradient(90deg, #006d21 0%, #50FEA8 100%)",
                        borderRadius: "2px",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "1.3rem",
                        color: "#006d21",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Key Opportunities
                    </span>
                  </div>
                  <ul
                    className="investment-card__list mb-0"
                    style={{ listStyle: "none", padding: 0 }}
                  >
                    {investment.opportunities
                      .slice(0, 3)
                      .map((opportunity, idx) => (
                        <li
                          key={idx}
                          style={{
                            fontSize: "1.2rem",
                            color: "#555",
                            marginBottom: "12px",
                            paddingLeft: "24px",
                            position: "relative",
                            lineHeight: "1.5",
                          }}
                        >
                          <i
                            className="fa-solid fa-circle-check"
                            style={{
                              position: "absolute",
                              left: 0,
                              top: "3px",
                              color: "#006d21",
                              fontSize: "1rem",
                            }}
                          />
                          {opportunity}
                        </li>
                      ))}
                  </ul>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: 12,
                    }}
                  >
                    <Link
                      href={investment.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid #006d21",
                        color: "#006d21",
                        padding: "10px 18px",
                        fontSize: "1rem",
                        fontWeight: 600,
                        borderRadius: "8px",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "#006d21";
                        (e.currentTarget as HTMLElement).style.color = "#fff";
                        (e.currentTarget as HTMLElement).style.transform =
                          "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor =
                          "transparent";
                        (e.currentTarget as HTMLElement).style.color =
                          "#006d21";
                        (e.currentTarget as HTMLElement).style.transform =
                          "translateY(0)";
                      }}
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* <div className="text-center mt-5 pt-3">
          <Link
            href="/investment"
            className="btn btn-primary wow fadeInUp animated"
            data-wow-delay=".6s"
            style={{
              backgroundColor: "#006d21",
              border: "none",
              padding: "16px 48px",
              fontSize: "1.15rem",
              fontWeight: "600",
              borderRadius: "50px",
              boxShadow: "0 8px 24px rgba(0, 109, 33, 0.25)",
              transition: "all 0.3s ease",
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#005419";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 12px 32px rgba(0, 109, 33, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#006d21";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(0, 109, 33, 0.25)";
            }}
          >
            <i className="fa-solid fa-download"></i>
            Download Investment Guide
          </Link>
        </div> */}
      </div>
    </section>
  );
};

export default InvestmentOpportunities;
