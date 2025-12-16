"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import BreadCamp from "../components/BreadCamp";
import Header from "../components/header";
import { events } from "../data/events";

function Page() {
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
    events.forEach((ev) => {
      const evDate = parseEventDate(ev.datetime);
      if (evDate >= now) upcoming.push(ev);
      else past.push(ev);
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

  const displayed = filter === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <div>
      <div style={{ margin: "2rem" }}></div>
      <Header />
      <BreadCamp title="Events & Opportunities" />
      <section className="visa-offer__area pt-100 section-space-bottom">
        <div className="container">
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginBottom: 20,
            }}
          >
            <button
              onClick={() => setFilter("upcoming")}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border:
                  filter === "upcoming"
                    ? "2px solid #006d21"
                    : "1px solid #ccc",
                background: filter === "upcoming" ? "#eaf6ea" : "transparent",
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
                borderRadius: 10,
                border:
                  filter === "past" ? "2px solid #006d21" : "1px solid #ccc",
                background: filter === "past" ? "#eaf6ea" : "transparent",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Past
            </button>
          </div>

          <div className="row mb-minus-30">
            {displayed.map((event, idx) => (
              <div className="col-lg-6 col-md-6" key={event.title + idx}>
                <div
                  className="visa-offer__item mb-30 wow fadeInLeft animated"
                  data-wow-delay={event.delay}
                >
                  <div className="visa-offer__item-thumb">
                    <div className="visa-offer__item-thumb-small-img">
                      <img src={event.smallImg} alt="img not found" />
                    </div>
                    <img src={event.mainImg} alt="img not found" />
                  </div>
                  <div className="visa-offer__item-content">
                    <div className="visa-offer__item-content-text">
                      <div className="visa-offer__item-content-text-title">
                        <h5>{event.title}</h5>
                        <p>{event.description}</p>
                      </div>
                      <div className="visa-offer__item-content-text-button">
                        <span>
                          <i className="fa-solid fa-location-dot"></i>{" "}
                          {event.location}
                        </span>
                        <br />
                        <span>
                          <i className="fa-solid fa-calendar"></i>{" "}
                          {event.datetime}
                        </span>
                      </div>
                    </div>
                    <div className="visa-offer__item-content-btn mt-30">
                      <Link href={`/events/${event.id}`}>
                        Join Now <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Page;
