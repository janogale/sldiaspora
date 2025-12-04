import Link from "next/link";
import React from "react";
import { events } from "../data/events";
import { Calendar, MapPin, ArrowRight, Sparkles } from "lucide-react";

const NewsEvents = () => {
  // Take first 3 events for the homepage
  const featuredEvents = events.slice(0, 3);

  return (
    <section
      className="news-events__area section-space"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f8faf9 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative background elements */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          right: "-80px",
          width: "250px",
          height: "250px",
          background:
            "radial-gradient(circle, rgba(228, 0, 43, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "-100px",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(0, 109, 33, 0.06) 0%, transparent 70%)",
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
              <Sparkles size={20} fill="#006d21" />
              Upcoming Events
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
              EVENTS & OPPORTUNITIES
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
              Connect with your diaspora community through engaging events
              worldwide
            </p>
          </div>
        </div>

        <div className="row g-4">
          {featuredEvents.map((event, idx) => (
            <div className="col-lg-4 col-md-6" key={event.title + idx}>
              <div
                className="event-card h-100 wow fadeInUp animated"
                data-wow-delay={event.delay}
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  background: "#ffffff",
                  border: "2px solid rgba(0, 109, 33, 0.1)",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-12px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(0, 109, 33, 0.15)";
                  e.currentTarget.style.borderColor = "#006d21";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0, 0, 0, 0.08)";
                  e.currentTarget.style.borderColor = "rgba(0, 109, 33, 0.1)";
                }}
              >
                {/* Image Section */}
                <div
                  style={{
                    position: "relative",
                    height: "220px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={event.mainImg}
                    alt={event.title}
                    style={{
                      width: "100%",
                      height: "100%",
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
                  {/* Flag Badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
                      width: "60px",
                      height: "60px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "3px solid #ffffff",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <img
                      src={event.smallImg}
                      alt="flag"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
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
                      height: "60px",
                      background:
                        "linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent)",
                    }}
                  />
                </div>

                {/* Content Section */}
                <div style={{ padding: "28px" }}>
                  <h3
                    style={{
                      fontSize: "2rem",
                      fontWeight: "700",
                      color: "#1a1a1a",
                      marginBottom: "12px",
                      lineHeight: "1.3",
                    }}
                  >
                    {event.title}
                  </h3>

                  <p
                    style={{
                      fontSize: "1.4rem",
                      color: "#666",
                      lineHeight: "1.7",
                      marginBottom: "20px",
                      minHeight: "60px",
                    }}
                  >
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div style={{ marginBottom: "24px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "10px",
                        fontSize: "1.4rem",
                        color: "#555",
                      }}
                    >
                      <MapPin size={18} color="#006d21" />
                      <span>{event.location}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "1.4rem",
                        color: "#555",
                      }}
                    >
                      <Calendar size={18} color="#006d21" />
                      <span>{event.datetime}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/events/${event.id}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background:
                        "linear-gradient(135deg, #006d21 0%, #009b2e 100%)",
                      color: "#ffffff",
                      padding: "13px 30px",
                      borderRadius: "12px",
                      fontSize: "1.4rem",
                      fontWeight: "600",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 12px rgba(0, 109, 33, 0.3)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateX(4px)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 20px rgba(0, 109, 33, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateX(0)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(0, 109, 33, 0.3)";
                    }}
                  >
                    Join Now
                    <ArrowRight size={18} />
                  </Link>
                </div>

                {/* Decorative corner */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "100px",
                    height: "100px",
                    background:
                      "linear-gradient(135deg, rgba(0, 109, 33, 0.05) 0%, transparent 100%)",
                    borderRadius: "0 20px 0 100%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-5">
          <Link
            href="/events"
            className="btn wow fadeInUp animated"
            data-wow-delay=".5s"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "transparent",
              border: "2px solid #006d21",
              color: "#006d21",
              padding: "16px 40px",
              fontSize: "1.05rem",
              fontWeight: "600",
              borderRadius: "12px",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#006d21";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#006d21";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            View All Events
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsEvents;
