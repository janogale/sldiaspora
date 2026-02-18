import Link from "next/link";
import React, { useMemo, useState } from "react";
import { events } from "../data/events";
import { Calendar, MapPin, ArrowRight, Sparkles } from "lucide-react";

const NewsEvents = () => {
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");

  const parseEventDate = (datetime: string) => {
    try {
      const parts = datetime.split(" ");
      if (parts.length < 3) return new Date(datetime);
      const datePart = parts[0];
      const timePart = parts[1];
      const ampm = parts[2].toUpperCase();
      const [year, month, day] = datePart.split("-").map(Number);
      const [hourStr, minuteStr] = timePart.split(":");
      let hour = Number(hourStr);
      const minute = Number(minuteStr || 0);
      if (ampm === "PM" && hour !== 12) hour += 12;
      if (ampm === "AM" && hour === 12) hour = 0;
      return new Date(year, month - 1, day, hour, minute || 0);
    } catch {
      return new Date(datetime);
    }
  };

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const upcoming: typeof events = [];
    const past: typeof events = [];

    events.forEach((event) => {
      const eventDate = parseEventDate(event.datetime);
      if (eventDate >= now) upcoming.push(event);
      else past.push(event);
    });

    upcoming.sort(
      (a, b) =>
        parseEventDate(a.datetime).getTime() -
        parseEventDate(b.datetime).getTime()
    );
    past.sort(
      (a, b) =>
        parseEventDate(b.datetime).getTime() -
        parseEventDate(a.datetime).getTime()
    );

    return { upcomingEvents: upcoming, pastEvents: past };
  }, []);

  const displayedEvents = (filter === "upcoming" ? upcomingEvents : pastEvents).slice(
    0,
    3
  );

  return (
    <section
      className="news-events__area section-space"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f8faf9 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="section-title2 mb-50">
          <div className="section-title2__wrapper">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <span
                className="section-title2__wrapper-subtitle wow fadeInLeft animated"
                data-wow-delay=".2s"
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <Sparkles size={18} fill="#006d21" />
                {filter === "upcoming" ? "Upcoming Events" : "Past Events"}
              </span>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => setFilter("upcoming")}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "10px",
                    border:
                      filter === "upcoming"
                        ? "2px solid #006d21"
                        : "1px solid #cfd8d3",
                    background: filter === "upcoming" ? "#eaf6ea" : "#fff",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setFilter("past")}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "10px",
                    border:
                      filter === "past"
                        ? "2px solid #006d21"
                        : "1px solid #cfd8d3",
                    background: filter === "past" ? "#eaf6ea" : "#fff",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Past
                </button>
              </div>
            </div>

            <h2
              className="section-title2__wrapper-title wow fadeInLeft animated"
              data-wow-delay=".3s"
              style={{ fontSize: "2.5rem" }}
            >
              EVENTS & OPPORTUNITIES
            </h2>
            <p
              className="wow fadeInUp animated"
              data-wow-delay=".4s"
              style={{ color: "#666", fontSize: "1.1rem", lineHeight: "1.6" }}
            >
              Track diaspora events worldwide and join the ones relevant to your
              location and schedule.
            </p>
          </div>
        </div>

        <div className="row g-4">
          {displayedEvents.length > 0 ? (
            displayedEvents.map((event, idx) => (
              <div className="col-lg-4 col-md-6" key={`${event.id}-${idx}`}>
                <div
                  className="h-100"
                  style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    background: "#fff",
                    border: "1px solid rgba(0, 109, 33, 0.12)",
                    boxShadow: "0 4px 14px rgba(0, 0, 0, 0.07)",
                  }}
                >
                  <div style={{ height: "190px", position: "relative" }}>
                    <img
                      src={event.mainImg}
                      alt={event.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  <div style={{ padding: "20px" }}>
                    <h4 style={{ marginBottom: "8px", fontWeight: 700 }}>{event.title}</h4>
                    <p style={{ color: "#666", marginBottom: "14px" }}>{event.description}</p>

                    <div style={{ marginBottom: "16px", color: "#4b5563" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                        <MapPin size={16} color="#006d21" />
                        <span>{event.location}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Calendar size={16} color="#006d21" />
                        <span>{event.datetime}</span>
                      </div>
                    </div>

                    <Link
                      href={`/events/${event.id}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "#006d21",
                        color: "#fff",
                        borderRadius: "10px",
                        padding: "10px 16px",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      Join Now
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div
                style={{
                  border: "1px solid #d6e8db",
                  borderRadius: "12px",
                  padding: "20px",
                  background: "#fff",
                }}
              >
                No {filter} events available right now.
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-5">
          <Link
            href="/events"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 22px",
              borderRadius: "10px",
              border: "2px solid #006d21",
              color: "#006d21",
              textDecoration: "none",
              fontWeight: 600,
              background: "#fff",
            }}
          >
            View Full Events Calendar
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsEvents;
