import Link from "next/link";
import React from "react";
import { Briefcase, Heart, HelpCircle } from "lucide-react";

const GetInvolved = () => {
  const sections = [
    {
      icon: Briefcase,
      title: "DOING BUSINESS",
      description: "Step-by-step guide to start your business at home",
      link: "/investment",
      gradient: "linear-gradient(135deg, #006d21 0%, #009b2e 100%)",
    },
    {
      icon: Heart,
      title: "COMMUNITY PROGRAMS",
      description: "Sponsor, volunteer, and support local initiatives",
      link: "/contact",
      gradient: "linear-gradient(135deg, #d32f2f 0%, #f44336 100%)",
    },
    {
      icon: HelpCircle,
      title: "DIASPORA DESK",
      description: "Airport help, emergency contacts, FAQs",
      link: "/contact",
      gradient: "linear-gradient(135deg, #000 0%, #16191bff 100%)",
    },
  ];

  return (
    <section
      className="get-involved__area section-space"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f8faf9 100%)",
        position: "relative",
      }}
    >
      <div className="container">
        <div className="section-title2 mb-60">
          <div className="section-title2__wrapper">
            <span
              className="section-title2__wrapper-subtitle wow fadeInLeft animated"
              data-wow-delay=".2s"
            >
              Join Our Mission
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
              GET INVOLVED NOW
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
              Discover opportunities to contribute, connect, and make a lasting
              impact
            </p>
          </div>
          <div
            className="section-title2__button wow fadeInLeft animated"
            data-wow-delay=".4s"
          ></div>
        </div>

        <div className="row g-4">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div className="col-lg-4 col-md-6" key={index}>
                <div
                  className="get-involved__card h-100 wow fadeInUp animated"
                  data-wow-delay={`.${index + 2}s`}
                  style={{
                    background: "#ffffff",
                    borderRadius: "20px",
                    padding: "40px 32px",
                    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-12px)";
                    e.currentTarget.style.boxShadow =
                      "0 16px 48px rgba(0, 0, 0, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 24px rgba(0, 0, 0, 0.06)";
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      width: "120px",
                      height: "120px",
                      background: section.gradient,
                      opacity: 0.08,
                      borderRadius: "0 20px 0 100%",
                    }}
                  />
                  <div
                    className="get-involved__icon mb-4"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "80px",
                      height: "80px",
                      borderRadius: "20px",
                      background: section.gradient,
                      boxShadow: "0 8px 24px rgba(0, 109, 33, 0.2)",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <Icon size={40} color="#ffffff" strokeWidth={2.5} />
                  </div>
                  <h3
                    className="get-involved__title mb-3"
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {section.title}
                  </h3>
                  <p
                    className="get-involved__description mb-4"
                    style={{
                      color: "#666",
                      fontSize: "1.4rem",
                      lineHeight: "1.6",
                      marginBottom: "24px",
                    }}
                  >
                    {section.description}
                  </p>
                  <Link
                    href={section.link}
                    className="btn btn-link p-0"
                    style={{
                      color: "#006d21",
                      textDecoration: "none",
                      fontSize: "1.4rem",
                      fontWeight: "600",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.3s ease",
                      position: "relative",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.gap = "12px";
                      e.currentTarget.style.color = "#005419";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.gap = "8px";
                      e.currentTarget.style.color = "#006d21";
                    }}
                  >
                    Learn More{" "}
                    <i
                      className="fa-solid fa-arrow-right"
                      style={{ transition: "transform 0.3s ease" }}
                    ></i>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GetInvolved;
