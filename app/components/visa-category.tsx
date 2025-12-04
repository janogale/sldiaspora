import {
  ArrowRight,
  Briefcase,
  Building2,
  GraduationCap,
  Plane,
} from "lucide-react";
import Link from "next/link";

const VisaCategory = () => {
  const categories = [
    {
      icon: Building2,
      category: "Financial Investment",
      title: "Business & Infrastructure",
      description:
        "Secure, government-vetted opportunities in key sectors to build legacy and drive economic growth.",
      delay: ".3s",
      color: "#006d21",
      gradient: "linear-gradient(135deg, #006d21 0%, #007d25 100%)",
      lightBg: "#e8f5e9",
      textDark: false,
    },
    {
      icon: GraduationCap,
      category: "Knowledge Transfer",
      title: "Skill Share Education",
      description:
        "Lend your expertise to educate, mentor, and build capacity within Somaliland's institutions.",
      delay: ".4s",
      color: "#1a1a1a",
      gradient: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
      lightBg: "#f5f7fa",
      textDark: true,
    },
    {
      icon: Plane,
      category: "Cultural Connection",
      title: "Tourism & Reconnection",
      description:
        "Journey home to reconnect with your heritage, culture, and contribute to the local economy.",
      delay: ".5s",
      color: "#e4002b",
      gradient: "linear-gradient(135deg, #e4002b 0%, #c20024 100%)",
      lightBg: "#fce8ec",
      textDark: false,
    },
    {
      icon: Briefcase,
      category: "Professional Contribution",
      title: "Workforce Development",
      description:
        "Apply your professional skills to national projects, both remotely and on the ground.",
      delay: ".6s",
      color: "#006d21",
      gradient: "linear-gradient(135deg, #006d21 0%, #007d25 100%)",
      lightBg: "#e8f5e9",
      textDark: false,
    },
  ];

  return (
    <section
      className="visa-catagory__area section-space overflow-hidden position-relative"
      style={{
        background: "linear-gradient(180deg, #f8faf9 0%, #ffffff 100%)",
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
            "radial-gradient(circle, rgba(0, 109, 33, 0.06) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      <div className="container">
        <div className="section-title2 mb-60">
          <div className="section-title2__wrapper">
            <span
              className="section-title2__wrapper-subtitle wow fadeInLeft animated"
              data-wow-delay=".2s"
            >
              CONTRIBUTION CHANNELS
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
              Forging New Pathways for Development
            </h2>
            <p
              className="wow fadeInUp animated"
              data-wow-delay=".4s"
              style={{
                maxWidth: "650px",

                color: "#666",
                fontSize: "1.6rem",
                lineHeight: "1.6",
              }}
            >
              Multiple ways to contribute your skills, resources, and expertise
              to Somaliland&apos;s growth
            </p>
          </div>

          <div className="row g-4 align-items-center">
            <div className="col-lg-8">
              <div className="row g-4">
                {categories.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <div className="col-sm-6" key={index}>
                      <div
                        className="contribution-card h-100 wow fadeInUp animated"
                        data-wow-delay={category.delay}
                        style={{
                          background: `linear-gradient(135deg, ${category.lightBg} 0%, #ffffff 100%)`,
                          borderRadius: "20px",
                          padding: "32px 28px",
                          border: `2px solid ${category.lightBg}`,
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(-10px) scale(1.02)";
                          e.currentTarget.style.boxShadow = `0 20px 45px ${category.color}30`;
                          e.currentTarget.style.borderColor = category.color;
                          e.currentTarget.style.background = category.gradient;
                          const title = e.currentTarget.querySelector(
                            "h3"
                          ) as HTMLElement;
                          const desc = e.currentTarget.querySelector(
                            "p"
                          ) as HTMLElement;
                          const label = e.currentTarget.querySelector(
                            "span"
                          ) as HTMLElement;
                          if (title)
                            title.style.color = category.textDark
                              ? "#1a1a1a"
                              : "#ffffff";
                          if (desc)
                            desc.style.color = category.textDark
                              ? "rgba(26, 26, 26, 0.8)"
                              : "rgba(255, 255, 255, 0.9)";
                          if (label)
                            label.style.color = category.textDark
                              ? "#1a1a1a"
                              : "#ffffff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(0, 0, 0, 0.08)";
                          e.currentTarget.style.borderColor = category.lightBg;
                          e.currentTarget.style.background = `linear-gradient(135deg, ${category.lightBg} 0%, #ffffff 100%)`;
                          const title = e.currentTarget.querySelector(
                            "h3"
                          ) as HTMLElement;
                          const desc = e.currentTarget.querySelector(
                            "p"
                          ) as HTMLElement;
                          const label = e.currentTarget.querySelector(
                            "span"
                          ) as HTMLElement;
                          if (title) title.style.color = "#1a1a1a";
                          if (desc) desc.style.color = "#666";
                          if (label) label.style.color = category.color;
                        }}
                      >
                        {/* Icon */}
                        <div
                          style={{
                            width: "75px",
                            height: "75px",
                            background: category.gradient,
                            borderRadius: "18px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "20px",
                            boxShadow: `0 10px 28px ${category.color}45`,
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          {/* Shine effect */}
                          <div
                            style={{
                              position: "absolute",
                              top: "-50%",
                              left: "-50%",
                              width: "200%",
                              height: "200%",
                              background:
                                "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)",
                              transform: "rotate(45deg)",
                            }}
                          />
                          <Icon
                            size={40}
                            color={category.textDark ? "#1a1a1a" : "#ffffff"}
                            strokeWidth={2.5}
                          />
                        </div>

                        {/* Category Label */}
                        <span
                          style={{
                            fontSize: "1.8rem",
                            fontWeight: "700",
                            color: category.color,
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            display: "block",
                            marginBottom: "10px",
                            transition: "color 0.3s ease",
                          }}
                        >
                          {category.category}
                        </span>

                        {/* Title */}
                        <h3
                          style={{
                            fontSize: "1.4rem",
                            fontWeight: "700",
                            color: "#1a1a1a",
                            marginBottom: "14px",
                            lineHeight: "1.3",
                            transition: "color 0.3s ease",
                          }}
                        >
                          {category.title}
                        </h3>

                        {/* Description */}
                        <p
                          style={{
                            fontSize: "1.5rem",
                            color: "#666",
                            lineHeight: "1.7",
                            marginBottom: "20px",
                            minHeight: "80px",
                            transition: "color 0.3s ease",
                          }}
                        >
                          {category.description}
                        </p>

                        {/* Learn More Link */}
                        <Link
                          href="/contact"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            color: category.color,
                            fontSize: "1.5rem",
                            fontWeight: "600",
                            textDecoration: "none",
                            transition: "all 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.gap = "12px";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.gap = "6px";
                          }}
                        >
                          Learn More
                          <ArrowRight size={18} />
                        </Link>

                        {/* Decorative corner */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: "90px",
                            height: "90px",
                            background: `linear-gradient(135deg, ${category.color}08 0%, transparent 100%)`,
                            borderRadius: "0 20px 0 100%",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Image Column */}
            <div className="col-lg-4">
              <div
                className="contribution-image-wrapper wow fadeInRight animated"
                data-wow-delay=".7s"
                style={{
                  position: "relative",
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 20px 50px rgba(0, 109, 33, 0.2)",
                }}
              >
                <img
                  src="/assets/imgs/visa/visa-catagory-home-2-img.png"
                  alt="Contribution pathways"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    transition: "transform 0.4s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
                {/* Overlay gradient */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "120px",
                    background:
                      "linear-gradient(to top, rgba(0, 109, 33, 0.7), transparent)",
                    display: "flex",
                    alignItems: "flex-end",
                    padding: "24px",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        color: "#ffffff",
                        fontSize: "1.4rem",
                        fontWeight: "700",
                        marginBottom: "4px",
                      }}
                    >
                      Join the Movement
                    </h4>
                    <p
                      style={{
                        color: "rgba(255, 255, 255, 0.9)",
                        fontSize: "0.95rem",
                        margin: 0,
                      }}
                    >
                      Be part of Somaliland&apos;s future
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* View All Button */}
        </div>
      </div>
    </section>
  );
};

export default VisaCategory;
