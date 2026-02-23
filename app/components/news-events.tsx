"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Sparkles,
} from "lucide-react";
import { events } from "../data/events";

const NewsEvents = () => {
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
  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(currentMonth);

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

  const firstDateWithEvents =
    calendarCells.find((cell) => cell.date && (eventCalendar.map.get(cell.key)?.length ?? 0) > 0)?.key ??
    todayKey;

  const effectiveSelectedDateKey = selectedDateKey ?? firstDateWithEvents;
  const selectedDateEvents = eventCalendar.map.get(effectiveSelectedDateKey) ?? [];

  const diasporaCountriesCount = useMemo(() => {
    const countries = new Set(events.map((event) => event.location.split(",").pop()?.trim() || "Unknown"));
    return countries.size;
  }, []);

  const handleMonthChange = (direction: "prev" | "next") => {
    setCurrentMonth((prev) =>
      new Date(
        prev.getFullYear(),
        direction === "prev" ? prev.getMonth() - 1 : prev.getMonth() + 1,
        1
      )
    );
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
              Upcoming Events
            </h2>

            <p
              className="wow fadeInUp animated"
              data-wow-delay=".4s"
              style={{ color: "#666", fontSize: "1.06rem", lineHeight: "1.65" }}
            >
              Stay informed about diaspora events happening around the world and
              join activities where you are available.
            </p>

            <div className="d-flex gap-2 flex-wrap mt-3">
              <span className="badge bg-success-subtle text-success-emphasis border px-3 py-2">
                <CalendarDays size={14} className="me-1" /> {events.length} Total Events
              </span>
              <span className="badge bg-light text-dark border px-3 py-2">
                <MapPin size={14} className="me-1" /> {diasporaCountriesCount} Countries
              </span>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-5">
            <div
              className="wow fadeInLeft animated"
              data-wow-delay=".2s"
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid rgba(0, 109, 33, 0.15)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                padding: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
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

                <h4 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>
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
                      fontSize: "0.78rem",
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
                        color: isSelected ? "#fff" : "#111827",
                        borderRadius: "9px",
                        height: "38px",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        position: "relative",
                      }}
                    >
                      {cell.date.getDate()}
                      {hasEvents && !isSelected && (
                        <span
                          style={{
                            position: "absolute",
                            right: "5px",
                            top: "5px",
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            background: "#006d21",
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div
              className="wow fadeInRight animated"
              data-wow-delay=".3s"
              style={{
                background: "#fff",
                borderRadius: "16px",
                border: "1px solid rgba(0, 109, 33, 0.15)",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                padding: "18px",
                minHeight: "100%",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h5 className="mb-0 fw-bold" style={{ color: "#0f172a" }}>
                  Events on {effectiveSelectedDateKey}
                </h5>
                <span className="badge bg-success-subtle text-success-emphasis border">
                  {selectedDateEvents.length} event{selectedDateEvents.length === 1 ? "" : "s"}
                </span>
              </div>

              {selectedDateEvents.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {selectedDateEvents.map((event, idx) => (
                    <div
                      key={`${event.id}-${idx}`}
                      style={{
                        border: "1px solid #d6e8db",
                        borderRadius: "14px",
                        padding: "12px",
                        background: "#f9fdfb",
                        boxShadow: "0 6px 14px rgba(0,0,0,0.04)",
                      }}
                    >
                      <div className="row g-3 align-items-start">
                        <div className="col-md-4">
                          <div
                            style={{
                              borderRadius: "10px",
                              overflow: "hidden",
                              border: "1px solid rgba(0,109,33,0.12)",
                              height: "100%",
                              minHeight: "130px",
                              background: "#eef6f0",
                              position: "relative",
                            }}
                          >
                            <Image
                              src={event.mainImg}
                              alt={event.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        </div>

                        <div className="col-md-8">
                          <div className="d-flex justify-content-between align-items-start gap-2 flex-wrap">
                            <h6 className="mb-1 fw-bold" style={{ fontSize: "1.06rem" }}>
                              {event.title}
                            </h6>
                            <span
                              style={{
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                letterSpacing: "0.03em",
                                color: "#0b6d35",
                                background: "#e8f5ec",
                                border: "1px solid #cde8d6",
                                borderRadius: "999px",
                                padding: "4px 10px",
                              }}
                            >
                              Diaspora Event
                            </span>
                          </div>

                          <p className="mb-2 text-muted" style={{ fontSize: "0.95rem" }}>
                            {event.description}
                          </p>

                          <div className="d-flex flex-column gap-1 text-muted" style={{ fontSize: "0.9rem" }}>
                            <span className="d-inline-flex align-items-center gap-2">
                              <MapPin size={15} color="#006d21" /> {event.location}
                            </span>
                            <span className="d-inline-flex align-items-center gap-2">
                              <Clock3 size={15} color="#006d21" /> {event.datetime}
                            </span>
                          </div>

                          <div className="mt-3">
                            <Link
                              href={`/events/${event.id}`}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                background: "#006d21",
                                color: "#fff",
                                borderRadius: "10px",
                                padding: "9px 13px",
                                textDecoration: "none",
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                whiteSpace: "nowrap",
                              }}
                            >
                              View Event
                              <ArrowRight size={15} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    border: "1px dashed #c8ded0",
                    borderRadius: "12px",
                    padding: "20px",
                    background: "#fff",
                    color: "#4b5563",
                  }}
                >
                  No events on this date yet. Keep checking for new diaspora programs.
                </div>
              )}
            </div>
          </div>
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
