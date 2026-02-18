import Link from "next/link";
import React from "react";
import {
  Hospital,
  Accessibility,
  Users,
  Gift,
  ShieldAlert,
  ArrowRight,
  Heart,
} from "lucide-react";

const DiasporaInitiatives = () => {
  const initiatives = [
    {
      icon: Hospital,
      title: "Help Hospital Home",
      description:
        "Supporting hospitals and health centers with essential medical equipment, supplies, and patient care items.",
      action: "Donate Now",
      link: "/contact",
      color: "#006d21",
      bgGradient: "linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%)",
    },
    {
      icon: Accessibility,
      title: "Help Disable Hope",
      description:
        "Providing assistive items and support for people with disabilities, including mobility aids and educational tools.",
      action: "Donate Now",
      link: "/contact",
      color: "#ffffff",
      bgGradient: "linear-gradient(135deg, #fafafa 0%, #ffffff 100%)",
    },
    {
      icon: Gift,
      title: "Take the Gift Home",
      description:
        "Encouraging diaspora to bring meaningful gifts that support vulnerable groups and improve daily living conditions.",
      action: "Support Now",
      link: "/contact",
      color: "#0077b6",
      bgGradient: "linear-gradient(135deg, #e3f2fd 0%, #f0f8ff 100%)",
    },
    {
      icon: Users,
      title: "Diaspora Sponsor",
      description:
        "Connecting diaspora sponsors with vulnerable children, families, and individuals needing monthly support.",
      action: "Sponsor Now",
      link: "/contact",
      color: "#e4002b",
      bgGradient: "linear-gradient(135deg, #ffebee 0%, #fef5f6 100%)",
    },
    {
      icon: ShieldAlert,
      title: "Diaspora Response Initiative (DIRA)",
      description:
        "Mobilizing diaspora to support emergency relief efforts during crises and humanitarian needs across Somaliland.",
      action: "Contribute Now",
      link: "/contact",
      color: "#f57f17",
      bgGradient: "linear-gradient(135deg, #fff8e1 0%, #fffde7 100%)",
    },
  ];
  return (
    <section
      className="diaspora-initiatives__area section-space"
      style={{
        background: "linear-gradient(180deg, #f8faf9 0%, #ffffff 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background elements */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(0, 109, 33, 0.05) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-150px",
          left: "-150px",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(0, 155, 46, 0.03) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="section-title2 mb-60">
          <div className="section-title2__wrapper">
            <span
              className="section-title2__wrapper-subtitle wow fadeInLeft animated"
              data-wow-delay=".2s"
            >
              <Heart size={20} fill="#006d21" />
              Make a Direct Impact
              <img
                style={{ width: "52px", height: "10px" }}
                src="./assets/imgs/shape2.svg"
                alt=""
              />
            </span>
            <h2
              className="section-title2__wrapper-title  wow fadeInLeft animated"
              data-wow-delay=".3s"
              style={{ fontSize: "3rem" }}
            >
              OUR COMMUNITY INITIATIVES
            </h2>
            <p
              className="wow fadeInUp animated"
              data-wow-delay=".4s"
              style={{
                color: "#666",
                fontSize: "1.5rem",
                lineHeight: "1.6",
              }}
            >
              Join hands with the Somaliland diaspora community to create
              lasting change through targeted initiatives that uplift our
              people.
            </p>
          </div>
        </div>

        <div className="row g-4">
          {initiatives.map((initiative, index) => {
            const Icon = initiative.icon;
            return (
              <div className="col-lg-4 col-md-6" key={index}>
                <div
                  className="initiative-card h-100 wow fadeInUp animated"
                  data-wow-delay={`.${index + 4}s`}
                  style={{
                    background: initiative.bgGradient,
                    borderRadius: "20px",
                    padding: "40px 30px",
                    textAlign: "center",
                    border: "2px solid rgba(0, 109, 33, 0.1)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-12px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(0, 109, 33, 0.2)";
                    e.currentTarget.style.borderColor = initiative.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0, 0, 0, 0.08)";
                    e.currentTarget.style.borderColor = "rgba(0, 109, 33, 0.1)";
                  }}
                >
                  {/* Icon Container */}
                  <div
                    style={{
                      width: "90px",
                      height: "90px",
                      background:
                        initiative.color === "#ffffff"
                          ? "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)"
                          : `linear-gradient(135deg, ${initiative.color} 0%, ${initiative.color}dd 100%)`,
                      borderRadius: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px",
                      boxShadow:
                        initiative.color === "#ffffff"
                          ? "0 8px 24px rgba(0, 0, 0, 0.15)"
                          : `0 8px 24px ${initiative.color}40`,
                      transition: "all 0.3s ease",
                      border:
                        initiative.color === "#ffffff"
                          ? "2px solid #ddd"
                          : "none",
                    }}
                    className="icon-container"
                  >
                    <Icon
                      size={48}
                      color={
                        initiative.color === "#ffffff" ? "#666" : "#ffffff"
                      }
                      strokeWidth={2}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      marginBottom: "16px",
                      lineHeight: "1.3",
                    }}
                  >
                    {initiative.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: "1.4rem",
                      color: "#666",
                      lineHeight: "1.7",
                      marginBottom: "28px",
                      minHeight: "80px",
                    }}
                  >
                    {initiative.description}
                  </p>

                  {/* Action Button */}
                  <Link
                    href={initiative.link}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: initiative.color,
                      color:
                        initiative.color === "#ffffff" ? "#333" : "#ffffff",
                      padding: "13px 30px",
                      borderRadius: "12px",
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      boxShadow:
                        initiative.color === "#ffffff"
                          ? "0 4px 12px rgba(0, 0, 0, 0.15)"
                          : `0 4px 12px ${initiative.color}40`,
                      border:
                        initiative.color === "#ffffff"
                          ? "2px solid #ddd"
                          : "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateX(4px)";
                      if (initiative.color === "#ffffff") {
                        e.currentTarget.style.boxShadow =
                          "0 6px 20px rgba(0, 0, 0, 0.25)";
                        e.currentTarget.style.borderColor = "#bbb";
                      } else {
                        e.currentTarget.style.boxShadow = `0 6px 20px ${initiative.color}60`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateX(0)";
                      if (initiative.color === "#ffffff") {
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(0, 0, 0, 0.15)";
                        e.currentTarget.style.borderColor = "#ddd";
                      } else {
                        e.currentTarget.style.boxShadow = `0 4px 12px ${initiative.color}40`;
                      }
                    }}
                  >
                    {initiative.action}
                    <ArrowRight size={18} />
                  </Link>

                  {/* Decorative corner element */}
                  <div
                    style={{
                      position: "absolute",
                      top: "0",
                      right: "0",
                      width: "80px",
                      height: "80px",
                      background: `linear-gradient(135deg, ${initiative.color}10 0%, transparent 100%)`,
                      borderRadius: "0 20px 0 100%",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DiasporaInitiatives;
