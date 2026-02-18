"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Sparkles,
} from "lucide-react";
import BreadCamp from "../components/BreadCamp";
import Header from "../components/header";
import { events } from "../data/events";

function Page() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const parseEventDate = (datetime: string) => {
    try {
      const parts = datetime.split(" ");
      if (parts.length < 3) return new Date(datetime);
      const [year, month, day] = parts[0].split("-").map(Number);
      const [hourStr, minuteStr] = parts[1].split(":");
      const ampm = parts[2].toUpperCase();
      let hour = Number(hourStr);
      const minute = Number(minuteStr || 0);
      if (ampm === "PM" && hour !== 12) hour += 12;
      if (ampm === "AM" && hour === 12) hour = 0;
      return new Date(year, month - 1, day, hour, minute || 0);
    } catch {
      return new Date(datetime);
    }
  };

  const toDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const eventCalendar = useMemo(() => {
    const map = new Map<string, typeof events>();

    const normalized = events
      .map((event) => ({ ...event, dateObject: parseEventDate(event.datetime) }))
      .sort((a, b) => a.dateObject.getTime() - b.dateObject.getTime());

    normalized.forEach((event) => {
      const key = toDateKey(event.dateObject);
      const existing = map.get(key) ?? [];
      map.set(key, [...existing, event]);
    });

    return { map, normalized };
  }, []);

  const today = new Date();
  const todayKey = toDateKey(today);
  const effectiveSelectedDateKey = selectedDateKey ?? todayKey;

  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(currentMonth);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );
  const startingWeekday = firstDayOfMonth.getDay();

  const calendarCells: Array<{ date: Date | null; key: string }> = [];
  for (let i = 0; i < startingWeekday; i++) {
    calendarCells.push({ date: null, key: `empty-${i}` });
  }
  for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    calendarCells.push({ date, key: toDateKey(date) });
  }

  const monthEventCount = calendarCells
    .filter((cell) => cell.date)
    .flatMap((cell) => eventCalendar.map.get(cell.key) ?? []).length;

  const selectedDateEvents = eventCalendar.map.get(effectiveSelectedDateKey) ?? [];

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const upcoming = eventCalendar.normalized.filter(
      (event) => event.dateObject >= now
    );
    const past = eventCalendar.normalized
      .filter((event) => event.dateObject < now)
      .sort((a, b) => b.dateObject.getTime() - a.dateObject.getTime());

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [eventCalendar.normalized]);

  const handleMonthChange = (direction: "prev" | "next") => {
    setCurrentMonth((prev) =>
      new Date(
        prev.getFullYear(),
        direction === "prev" ? prev.getMonth() - 1 : prev.getMonth() + 1,
        1
      )
    );
  };

  const renderEventCardList = (list: typeof eventCalendar.normalized) => (
    <div className="row mb-minus-30">
      {list.map((event, idx) => (
        <div className="col-lg-6 col-md-6" key={`${event.id}-${idx}`}>
          <div
            className="visa-offer__item mb-30 wow fadeInLeft animated"
            data-wow-delay={event.delay}
          >
            <div className="visa-offer__item-thumb">
              <div className="visa-offer__item-thumb-small-img">
                <img src={event.smallImg} alt={event.title} />
              </div>
              <img src={event.mainImg} alt={event.title} />
            </div>
            <div className="visa-offer__item-content">
              <div className="visa-offer__item-content-text">
                <div className="visa-offer__item-content-text-title">
                  <h5>{event.title}</h5>
                  <p>{event.description}</p>
                </div>
                <div className="visa-offer__item-content-text-button">
                  <span>
                    <i className="fa-solid fa-location-dot"></i> {event.location}
                  </span>
                  <br />
                  <span>
                    <i className="fa-solid fa-calendar"></i> {event.datetime}
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
  );

  return (
    <div>
      <div style={{ margin: "2rem" }}></div>
      <Header />
      <BreadCamp title="Events Calendar" />

      <section
        className="pt-100 section-space-bottom"
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #f6faf7 100%)",
          overflow: "hidden",
        }}
      >
        <div className="container">
          <div className="section-title2 mb-40">
            <div className="section-title2__wrapper">
              <span
                className="section-title2__wrapper-subtitle wow fadeInLeft animated"
                data-wow-delay=".2s"
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                <Sparkles size={18} fill="#006d21" />
                Global Diaspora Events Calendar
              </span>
              <h2
                className="section-title2__wrapper-title wow fadeInLeft animated"
                data-wow-delay=".3s"
                style={{ fontSize: "2.5rem" }}
              >
                Plan, Attend, Connect
              </h2>
              <p
                className="wow fadeInUp animated"
                data-wow-delay=".4s"
                style={{ color: "#5d6661", fontSize: "1.05rem", lineHeight: "1.65" }}
              >
                Explore events by date, view details by day, and join diaspora
                programs happening across the world.
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-5">
              <div
                className="wow fadeInLeft animated"
                data-wow-delay=".2s"
                style={{
                  background: "#fff",
                  borderRadius: "18px",
                  border: "1px solid rgba(0, 109, 33, 0.15)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "14px",
                  }}
                >
                  <button
                    onClick={() => handleMonthChange("prev")}
                    style={{
                      border: "1px solid #d6e8db",
                      background: "#fff",
                      borderRadius: "10px",
                      width: "36px",
                      height: "36px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    aria-label="Previous month"
                  >
                    <ChevronLeft size={18} color="#006d21" />
                  </button>

                  <h4 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>
                    {monthLabel}
                  </h4>

                  <button
                    onClick={() => handleMonthChange("next")}
                    style={{
                      border: "1px solid #d6e8db",
                      background: "#fff",
                      borderRadius: "10px",
                      width: "36px",
                      height: "36px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    aria-label="Next month"
                  >
                    <ChevronRight size={18} color="#006d21" />
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "8px",
                  }}
                >
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      style={{
                        textAlign: "center",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        color: "#4b5563",
                        padding: "6px 0",
                      }}
                    >
                      {day}
                    </div>
                  ))}

                  {calendarCells.map((cell) => {
                    if (!cell.date) return <div key={cell.key} />;

                    const key = cell.key;
                    const hasEvents = (eventCalendar.map.get(key) ?? []).length > 0;
                    const isSelected = key === effectiveSelectedDateKey;
                    const isToday = key === todayKey;

                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedDateKey(key)}
                        style={{
                          border: isSelected
                            ? "2px solid #006d21"
                            : hasEvents
                              ? "1px solid #78b88c"
                            : "1px solid #e5e7eb",
                          background: isSelected
                            ? "#006d21"
                            : hasEvents
                              ? "#eaf6ee"
                            : isToday
                              ? "#f3fbf5"
                              : "#fff",
                          borderRadius: "10px",
                          minHeight: "48px",
                          cursor: "pointer",
                          position: "relative",
                          fontWeight: isSelected || hasEvents || isToday ? 700 : 500,
                          color: isSelected
                            ? "#ffffff"
                            : hasEvents
                              ? "#0a5b24"
                              : "#111827",
                        }}
                        aria-label={`Select ${key}`}
                      >
                        {cell.date.getDate()}
                        {hasEvents && (
                          <span
                            style={{
                              position: "absolute",
                              bottom: "7px",
                              left: "50%",
                              transform: "translateX(-50%)",
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              background: isSelected ? "#ffffff" : "#006d21",
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div
                  style={{
                    marginTop: "16px",
                    color: "#4b5563",
                    fontSize: "0.92rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <CalendarDays size={16} color="#006d21" />
                  {monthEventCount} event(s) in {monthLabel}
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div
                className="wow fadeInRight animated"
                data-wow-delay=".2s"
                style={{
                  background: "#fff",
                  borderRadius: "18px",
                  border: "1px solid rgba(0, 109, 33, 0.15)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                  padding: "20px",
                  marginBottom: "20px",
                }}
              >
                <h4 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>
                  Events on {effectiveSelectedDateKey}
                </h4>

                <div className="row g-3 mt-1">
                  {selectedDateEvents.length > 0 ? (
                    selectedDateEvents.map((event, idx) => (
                      <div className="col-md-6" key={`${event.id}-${idx}`}>
                        <div
                          style={{
                            border: "1px solid #e5ece8",
                            borderRadius: "14px",
                            overflow: "hidden",
                            height: "100%",
                            background: "#fff",
                          }}
                        >
                          <div style={{ height: "160px" }}>
                            <img
                              src={event.mainImg}
                              alt={event.title}
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          </div>

                          <div style={{ padding: "14px" }}>
                            <h5 style={{ marginBottom: "8px", fontWeight: 700 }}>
                              {event.title}
                            </h5>
                            <p style={{ color: "#666", marginBottom: "10px", fontSize: "0.92rem" }}>
                              {event.description}
                            </p>

                            <div style={{ fontSize: "0.9rem", color: "#4b5563" }}>
                              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                                <MapPin size={15} color="#006d21" />
                                {event.location}
                              </div>
                              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <Clock3 size={15} color="#006d21" />
                                {event.datetime}
                              </div>
                            </div>

                            <div style={{ marginTop: "12px" }}>
                              <Link
                                href={`/events/${event.id}`}
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  background: "#006d21",
                                  color: "#fff",
                                  borderRadius: "10px",
                                  padding: "8px 12px",
                                  textDecoration: "none",
                                  fontWeight: 600,
                                  fontSize: "0.9rem",
                                }}
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-12">
                      <div
                        style={{
                          border: "1px dashed #c8dbcf",
                          borderRadius: "12px",
                          padding: "18px",
                          color: "#5b655f",
                          background: "#f8fbf9",
                        }}
                      >
                        No events on this day yet. Use another date on the calendar
                        to explore scheduled diaspora programs.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div
                className="wow fadeInRight animated"
                data-wow-delay=".3s"
                style={{
                  background: "#fff",
                  borderRadius: "18px",
                  border: "1px solid rgba(0, 109, 33, 0.15)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                  padding: "20px",
                }}
              >
                <h4 style={{ marginBottom: "8px", fontSize: "1.1rem", fontWeight: 700 }}>
                  All Events
                </h4>
                <p style={{ margin: 0, color: "#5d6661" }}>
                  Scroll below to view your full Upcoming and Past event lists.
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "40px" }}>
            <div className="section-title2 mb-20">
              <div className="section-title2__wrapper">
                <h3
                  className="section-title2__wrapper-title wow fadeInLeft animated"
                  data-wow-delay=".2s"
                  style={{ fontSize: "2rem" }}
                >
                  Upcoming Events ({upcomingEvents.length})
                </h3>
              </div>
            </div>
            {upcomingEvents.length > 0 ? (
              renderEventCardList(upcomingEvents)
            ) : (
              <div
                style={{
                  border: "1px dashed #c8dbcf",
                  borderRadius: "12px",
                  padding: "18px",
                  color: "#5b655f",
                  background: "#f8fbf9",
                  marginBottom: "25px",
                }}
              >
                No upcoming events available right now.
              </div>
            )}

            <div className="section-title2 mb-20" style={{ marginTop: "20px" }}>
              <div className="section-title2__wrapper">
                <h3
                  className="section-title2__wrapper-title wow fadeInLeft animated"
                  data-wow-delay=".2s"
                  style={{ fontSize: "2rem" }}
                >
                  Past Events ({pastEvents.length})
                </h3>
              </div>
            </div>
            {pastEvents.length > 0 ? (
              renderEventCardList(pastEvents)
            ) : (
              <div
                style={{
                  border: "1px dashed #d7d7d7",
                  borderRadius: "12px",
                  padding: "18px",
                  color: "#6b7280",
                  background: "#fafafa",
                }}
              >
                No past events available yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Page;
