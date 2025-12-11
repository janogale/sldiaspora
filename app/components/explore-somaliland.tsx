import Link from "next/link";
import React from "react";
import { explorePlaces } from "../data/explores";
import { MapPin, ArrowRight } from "lucide-react";

const ExploreSomaliland = () => {
  return (
    <section
      className="explore-somaliland__area section-space"
      style={{ backgroundColor: "#f8faf9" }}
    >
      <div className="container">
        <div className="section-title2 mb-60">
          <div className="section-title2__wrapper">
            <span
              className="section-title2__wrapper-subtitle wow fadeInLeft animated"
              data-wow-delay=".2s"
            >
              Discover Your Heritage
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
              EXPLORE SOMALILAND
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
              Experience the beauty, culture, and natural wonders of your
              homeland
            </p>
          </div>
        </div>

        <div className="row g-4">
          {explorePlaces.slice(0, 3).map((place, index) => (
            <div className="col-lg-4 col-md-6" key={index}>
              <div
                className="explore-card h-100 rounded-4 overflow-hidden shadow-sm wow fadeInUp animated position-relative"
                data-wow-delay={`.${index + 2}s`}
                style={{
                  backgroundColor: "#fff",
                  border: "none",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow =
                    "0 25px 50px rgba(0, 0, 0, 0.15)";
                  const img = e.currentTarget.querySelector(
                    "img"
                  ) as HTMLImageElement;
                  if (img) img.style.transform = "scale(1.15)";
                  const overlay = e.currentTarget.querySelector(
                    ".explore-overlay"
                  ) as HTMLElement;
                  if (overlay) overlay.style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0, 0, 0, 0.08)";
                  const img = e.currentTarget.querySelector(
                    "img"
                  ) as HTMLImageElement;
                  if (img) img.style.transform = "scale(1)";
                  const overlay = e.currentTarget.querySelector(
                    ".explore-overlay"
                  ) as HTMLElement;
                  if (overlay) overlay.style.opacity = "0.4";
                }}
              >
                <div
                  className="explore-card__image position-relative"
                  style={{ height: "320px", overflow: "hidden" }}
                >
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-100 h-100"
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                  <div
                    className="explore-overlay position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent 0%, rgba(0, 109, 33, 0.9) 100%)",
                      opacity: 0.4,
                      transition: "opacity 0.4s ease",
                    }}
                  />
                  <div className="position-absolute top-0 end-0 m-3">
                    <Link
                      href={place.map}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div
                        className="badge d-flex align-items-center gap-2 px-3 py-2"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          color: "#006d21",
                          fontWeight: "600",
                          fontSize: "1rem",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        <MapPin size={16} /> Destination
                      </div>
                    </Link>
                  </div>
                  <div
                    className="position-absolute bottom-0 start-0 p-4 w-100"
                    style={{ zIndex: 2 }}
                  >
                    <h3
                      className="explore-card__title mb-2 text-white"
                      style={{
                        fontSize: "2rem",
                        fontWeight: "700",
                        textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                      }}
                    >
                      {place.name}
                    </h3>
                  </div>
                </div>
                <div className="explore-card__content p-4 bg-white">
                  <p
                    className="explore-card__description mb-0"
                    style={{
                      fontSize: "1.4rem",
                      color: "#666",
                      lineHeight: "1.7",
                    }}
                  >
                    {place.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-5">
          <Link
            href="/investment"
            className="btn btn-outline-lg px-5 py-3 rounded-pill d-inline-flex align-items-center gap-2 wow fadeInUp animated"
            data-wow-delay=".6s"
            style={{
              borderColor: "#006d21",
              color: "#006d21",
              borderWidth: "2px",
              fontWeight: "600",
              fontSize: "1.1rem",
              backgroundColor: "transparent",
              transition: "all 0.3s ease",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#006d21";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(0, 109, 33, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#006d21";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            View All Attractions <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExploreSomaliland;
