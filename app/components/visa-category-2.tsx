"use client";
import { useState } from "react";
import {
  TrendingUp,
  Users,
  Globe,
  Building2,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const VisaCategory2 = () => {
  const [activeTab, setActiveTab] = useState("student");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const categories = [
    {
      id: "student",
      icon: TrendingUp,
      title: "Investment & Entrepreneurship",
      description:
        "Fund high-impact projects in key sectors to build a lasting legacy and foster economic growth.",
      color: "#006d21",
      gradient: "linear-gradient(135deg, #006d21 0%, #007d25 100%)",
      textDark: false,
    },
    {
      id: "working",
      icon: Users,
      title: "Skills & Volunteering",
      description:
        "Offer your professional expertise through remote consulting or in-person missions for national development.",
      color: "#1a1a1a",
      gradient: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
      textDark: true,
    },
    {
      id: "business",
      icon: Globe,
      title: "Citizenship & Advocacy",
      description:
        "Secure your citizenship rights and advocate for Somaliland's recognition on the global stage.",
      color: "#e4002b",
      gradient: "linear-gradient(135deg, #e4002b 0%, #c20024 100%)",
      textDark: false,
    },
  ];

  return (
    <section
      className="visa-category-2 section-space overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f8fffe 0%, #ffffff 100%)",
        position: "relative",
      }}
    >
      {/* Decorative Background Element */}
      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(0, 109, 33, 0.05) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div className="container">
        {/* Section Header */}
        <div className="row text-center">
          <div className="col-12">
            <div className="section__title-wrapper text-center mb-60">
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "15px",
                }}
              >
                <Sparkles size={20} style={{ color: "#006d21" }} />
                <h6
                  className="section__title-wrapper-center-subtitle wow fadeInLeft animated"
                  data-wow-delay=".2s"
                  style={{
                    margin: 0,
                    color: "#006d21",
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                  }}
                >
                  ENGAGEMENT PATHWAYS
                </h6>
              </div>
              <h2
                className="section__title-wrapper-title wow fadeInLeft animated"
                data-wow-delay=".3s"
                style={{
                  fontSize: "3rem",
                  fontWeight: "700",
                  color: "#1a1a1a",
                  marginBottom: "15px",
                  lineHeight: "1.3",
                }}
              >
                Multiple Avenues to Contribute <br /> to Somaliland&apos;s
                Growth
              </h2>
              <p
                style={{
                  fontSize: "1.5rem",
                  color: "#666",
                  maxWidth: "700px",
                  margin: "0 auto",
                  lineHeight: "1.6",
                }}
              >
                Choose your pathway to make a meaningful impact in
                Somaliland&apos;s development journey
              </p>
            </div>
          </div>
        </div>

        <div className="row align-items-center">
          {/* Left Side - Tab Navigation */}
          <div className="col-lg-6">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {categories.map((category, index) => {
                const Icon = category.icon;
                const isActive = activeTab === category.id;
                const isHovered = hoveredCard === category.id;

                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    onMouseEnter={() => setHoveredCard(category.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="wow fadeInLeft animated"
                    data-wow-delay={`${0.2 + index * 0.1}s`}
                    style={{
                      background: isActive ? category.gradient : "#ffffff",
                      border: isActive ? "none" : "2px solid #e8f5e9",
                      borderRadius: "20px",
                      padding: "25px",
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      cursor: "pointer",
                      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: isActive
                        ? "0 15px 40px rgba(0, 109, 33, 0.25)"
                        : isHovered
                        ? "0 10px 30px rgba(0, 0, 0, 0.08)"
                        : "0 4px 15px rgba(0, 0, 0, 0.05)",
                      transform: isActive
                        ? "translateX(10px)"
                        : isHovered
                        ? "translateX(5px)"
                        : "translateX(0)",
                      textAlign: "left",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Decorative Corner */}
                    {isActive && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: "80px",
                          height: "80px",
                          background:
                            "linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%)",
                          borderRadius: "0 20px 0 100%",
                        }}
                      />
                    )}

                    {/* Icon Container */}
                    <div
                      style={{
                        width: "70px",
                        height: "70px",
                        borderRadius: "16px",
                        background: isActive
                          ? category.textDark
                            ? "rgba(0, 0, 0, 0.05)"
                            : "rgba(255, 255, 255, 0.2)"
                          : category.id === "business"
                          ? "linear-gradient(135deg, #fce8ec 0%, #fef1f3 100%)"
                          : category.id === "working"
                          ? "linear-gradient(135deg, #e8eef5 0%, #f5f7fa 100%)"
                          : "linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        backdropFilter: isActive ? "blur(10px)" : "none",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Icon
                        size={32}
                        style={{
                          color: isActive
                            ? category.textDark
                              ? category.color
                              : "#ffffff"
                            : category.color,
                          transition: "all 0.3s ease",
                        }}
                      />
                    </div>

                    {/* Text Content */}
                    <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
                      <h4
                        style={{
                          fontSize: "2rem",
                          fontWeight: "700",
                          color: isActive
                            ? category.textDark
                              ? "#1a1a1a"
                              : "#ffffff"
                            : "#1a1a1a",
                          marginBottom: "8px",
                          transition: "color 0.3s ease",
                          lineHeight: "1.3",
                        }}
                      >
                        {category.title}
                      </h4>
                      <p
                        style={{
                          fontSize: "1.3rem",
                          color: isActive
                            ? category.textDark
                              ? "rgba(26, 26, 26, 0.8)"
                              : "rgba(255, 255, 255, 0.9)"
                            : "#666",
                          margin: 0,
                          lineHeight: "1.5",
                          transition: "color 0.3s ease",
                        }}
                      >
                        {category.description}
                      </p>
                    </div>

                    {/* Arrow Icon */}
                    <ChevronRight
                      size={24}
                      style={{
                        color: isActive
                          ? category.textDark
                            ? "#1a1a1a"
                            : "#ffffff"
                          : category.color,
                        opacity: isActive || isHovered ? 1 : 0.3,
                        transition: "all 0.3s ease",
                        flexShrink: 0,
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side - Image Display */}
          <div className="col-lg-6">
            <div className="tab-content">
              {categories.map((category, index) => (
                <div
                  key={category.id}
                  className={`tab-pane fade ${
                    activeTab === category.id ? "show active" : ""
                  }`}
                  style={{
                    animation:
                      activeTab === category.id
                        ? "fadeIn 0.5s ease-in-out"
                        : "none",
                  }}
                >
                  <div
                    className="visa-category-2__tab-content wow fadeInRight animated"
                    data-wow-delay={`${0.3 + index * 0.1}s`}
                  >
                    <div
                      style={{
                        position: "relative",
                        borderRadius: "24px",
                        overflow: "hidden",
                        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      {/* Main Image Container */}
                      <div
                        style={{
                          position: "relative",
                          paddingBottom: "75%",
                          background:
                            "linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%)",
                        }}
                      >
                        <img
                          style={{
                            position: "absolute",
                            top: "10%",
                            left: "10%",
                            width: "45%",
                            height: "70%",
                            objectFit: "cover",
                            borderRadius: "16px",
                            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                            zIndex: 2,
                          }}
                          src="/assets/imgs/visa/visa-category-1.png"
                          alt="Engagement pathway"
                        />
                        <img
                          style={{
                            position: "absolute",
                            top: "20%",
                            right: "10%",
                            width: "45%",
                            height: "70%",
                            objectFit: "cover",
                            borderRadius: "16px",
                            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                            zIndex: 1,
                          }}
                          src="/assets/imgs/visa/visa-category-2.png"
                          alt="Engagement pathway"
                        />

                        {/* Decorative Shapes */}
                        <div
                          style={{
                            position: "absolute",
                            top: "5%",
                            right: "5%",
                            width: "100px",
                            height: "100px",
                            background:
                              "linear-gradient(135deg, rgba(0, 109, 33, 0.1) 0%, transparent 70%)",
                            borderRadius: "50%",
                            zIndex: 0,
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: "5%",
                            left: "5%",
                            width: "80px",
                            height: "80px",
                            background:
                              "linear-gradient(135deg, rgba(0, 109, 33, 0.1) 0%, transparent 70%)",
                            borderRadius: "50%",
                            zIndex: 0,
                          }}
                        />
                      </div>

                      {/* Gradient Overlay */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "40%",
                          background:
                            "linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 100%)",
                          display: "flex",
                          alignItems: "flex-end",
                          padding: "30px",
                          zIndex: 3,
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              color: "#ffffff",
                              fontSize: "2rem",
                              fontWeight: "700",
                              marginBottom: "8px",
                            }}
                          >
                            {categories.find((c) => c.id === activeTab)?.title}
                          </h3>
                          <p
                            style={{
                              color: "rgba(255, 255, 255, 0.9)",
                              fontSize: "1.5rem",
                              margin: 0,
                            }}
                          >
                            Make your impact today
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Info Card Below */}
                    <div
                      style={{
                        marginTop: "25px",
                        padding: "25px",
                        background: "#ffffff",
                        borderRadius: "16px",
                        border: "2px solid #e8f5e9",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                        }}
                      >
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "12px",
                            background: categories.find(
                              (c) => c.id === activeTab
                            )?.gradient,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Building2 size={24} style={{ color: "#ffffff" }} />
                        </div>
                        <div>
                          <h4
                            style={{
                              fontSize: "2rem",
                              fontWeight: "600",
                              color: "#1a1a1a",
                              marginBottom: "5px",
                            }}
                          >
                            Ready to Get Started?
                          </h4>
                          <p
                            style={{
                              fontSize: "1.5rem",
                              color: "#666",
                              margin: 0,
                            }}
                          >
                            Connect with us to explore opportunities in this
                            pathway
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {/* <div className="row mt-60">
          <div className="col-12 text-center">
            <button
              className="wow fadeInUp animated"
              data-wow-delay=".5s"
              style={{
                padding: "18px 45px",
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "#ffffff",
                background: "linear-gradient(135deg, #006d21 0%, #007d25 100%)",
                border: "none",
                borderRadius: "50px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 10px 30px rgba(0, 109, 33, 0.3)",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-3px) scale(1.05)";
                e.currentTarget.style.boxShadow =
                  "0 15px 40px rgba(0, 109, 33, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 10px 30px rgba(0, 109, 33, 0.3)";
              }}
            >
              Explore All Pathways
              <ChevronRight size={20} />
            </button>
          </div>
        </div> */}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default VisaCategory2;
