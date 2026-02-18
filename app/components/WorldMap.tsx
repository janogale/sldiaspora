"use client";

import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { Globe2, MapPin, Users, Sparkles, ArrowRight } from "lucide-react";

interface LocationData {
  id: string;
  city: string;
  country: string;
  map: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
}
async function getLocations(): Promise<LocationData[]> {
  const res = await fetch("http://109.199.126.40/items/locations");
  if (!res.ok) throw new Error("Failed to fetch locations");
  const data = await res.json();
  // If your API returns { data: [...] }, extract the array
  return Array.isArray(data) ? data : data.data || [];
}

const Map = () => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [flags, setFlags] = useState<Record<string, string>>({}); // country → flag URL

  // ✅ Simulate fetching your API data
  useEffect(() => {
    async function fetchData() {
      const data = await getLocations();
      setLocations(data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchFlags() {
      const uniqueCountries = Array.from(
        new Set(locations.map((loc) => loc.country))
      );

      const flagMap: Record<string, string> = {};

      for (const country of uniqueCountries) {
        try {
          const res = await fetch(
            `https://restcountries.com/v3.1/name/${encodeURIComponent(
              country
            )}?fields=flags`
          );
          const data = await res.json();
          const flag = data[0]?.flags?.svg || data[0]?.flags?.png || "";
          flagMap[country] = flag;
        } catch {
          flagMap[country] = "";
        }
      }

      setFlags(flagMap);
    }

    if (locations.length > 0) fetchFlags();
  }, [locations]);

  // ✅ Create map bounds dynamically from coordinates
  const bounds = L.latLngBounds(
    locations.map((loc) => [loc.map.coordinates[1], loc.map.coordinates[0]])
  );

  return (
    <section
      className="contact4__area p-relative"
      style={{
        margin: "0 0 5rem 0",
        background: "linear-gradient(180deg, #f8faf9 0%, #ffffff 100%)",
        padding: "5rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Background Elements */}
      <div
        style={{
          position: "absolute",
          top: "-150px",
          left: "-150px",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(0, 109, 33, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          right: "-100px",
          width: "350px",
          height: "350px",
          background:
            "radial-gradient(circle, rgba(228, 0, 43, 0.06) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div className="container">
        {/* Section Header */}
        <div className="row mb-5">
          <div className="col-12 text-center">
            <div style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Sparkles size={20} style={{ color: "#006d21" }} />
                <span
                  className="wow fadeInUp animated"
                  data-wow-delay=".2s"
                  style={{
                    fontSize: "2rem",
                    fontWeight: "600",
                    color: "#006d21",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                  }}
                >
                  GLOBAL PRESENCE
                </span>
              </div>
            </div>
            <h2
              className="wow fadeInUp animated"
              data-wow-delay=".3s"
              style={{
                fontSize: "3rem",
                fontWeight: "700",
                color: "#1a1a1a",
                marginBottom: "15px",
                lineHeight: "1.3",
              }}
            >
              Our Global Somaliland Community
            </h2>
            <p
              className="wow fadeInUp animated"
              data-wow-delay=".4s"
              style={{
                fontSize: "1.5rem",
                color: "#666",
                maxWidth: "700px",
                margin: "0 auto",
                lineHeight: "1.6",
              }}
            >
              Connecting a Worldwide Network for a National Vision
            </p>
          </div>
        </div>

        <div className="row align-items-center">
          <div className="col-12">
            {/* Stats Cards Above Map */}
            <div className="row g-4 mb-5">
              <div className="col-md-4">
                <div
                  className="wow fadeInUp animated"
                  data-wow-delay=".5s"
                  style={{
                    background:
                      "linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)",
                    borderRadius: "20px",
                    padding: "30px",
                    border: "2px solid #e8f5e9",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(0, 109, 33, 0.15)";
                    e.currentTarget.style.borderColor = "#006d21";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#e8f5e9";
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
                        width: "60px",
                        height: "60px",
                        background:
                          "linear-gradient(135deg, #006d21 0%, #007d25 100%)",
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Globe2 size={30} color="#ffffff" />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: "2rem",
                          fontWeight: "700",
                          color: "#006d21",
                          marginBottom: "5px",
                        }}
                      >
                        {locations.length}+
                      </h3>
                      <p
                        style={{
                          fontSize: "0.95rem",
                          color: "#666",
                          margin: 0,
                        }}
                      >
                        Global Locations
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className="wow fadeInUp animated"
                  data-wow-delay=".6s"
                  style={{
                    background:
                      "linear-gradient(135deg, #fce8ec 0%, #ffffff 100%)",
                    borderRadius: "20px",
                    padding: "30px",
                    border: "2px solid #fce8ec",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(228, 0, 43, 0.15)";
                    e.currentTarget.style.borderColor = "#e4002b";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#fce8ec";
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
                        width: "60px",
                        height: "60px",
                        background:
                          "linear-gradient(135deg, #e4002b 0%, #c20024 100%)",
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MapPin size={30} color="#ffffff" />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: "2rem",
                          fontWeight: "700",
                          color: "#e4002b",
                          marginBottom: "5px",
                        }}
                      >
                        {new Set(locations.map((l) => l.country)).size}+
                      </h3>
                      <p
                        style={{
                          fontSize: "0.95rem",
                          color: "#666",
                          margin: 0,
                        }}
                      >
                        Countries Represented
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className="wow fadeInUp animated"
                  data-wow-delay=".7s"
                  style={{
                    background:
                      "linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)",
                    borderRadius: "20px",
                    padding: "30px",
                    border: "2px solid #f5f7fa",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(26, 26, 26, 0.1)";
                    e.currentTarget.style.borderColor = "#1a1a1a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "#f5f7fa";
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
                        width: "60px",
                        height: "60px",
                        background:
                          "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)",
                        borderRadius: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Users size={30} color="#ffffff" />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: "2rem",
                          fontWeight: "700",
                          color: "#1a1a1a",
                          marginBottom: "5px",
                        }}
                      >
                        1M+
                      </h3>
                      <p
                        style={{
                          fontSize: "0.95rem",
                          color: "#666",
                          margin: 0,
                        }}
                      >
                        Diaspora Members
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div
              className="wow fadeInUp animated"
              data-wow-delay=".8s"
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "20px",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)",
                border: "2px solid rgba(0, 109, 33, 0.1)",
              }}
            >
              {locations.length > 0 && (
                <MapContainer
                  bounds={bounds}
                  style={{
                    height: "600px",
                    width: "100%",
                    borderRadius: "16px",
                  }}
                  scrollWheelZoom={false}
                  key={JSON.stringify(bounds)}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {locations.map((loc) => {
                    const [lng, lat] = loc.map.coordinates;
                    const flag = flags[loc.country];
                    const icon = L.divIcon({
                      html: flag
                        ? `<div style="
                            width: 40px;
                            height: 40px;
                            background: #ffffff;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            box-shadow: 0 4px 12px rgba(0, 109, 33, 0.3);
                            border: 3px solid #006d21;
                            overflow: hidden;
                          ">
                            <img 
                              src="${flag}" 
                              alt="${loc.country} flag" 
                              style="
                                width: 28px;
                                height: 21px;
                                border-radius: 3px;
                                object-fit: cover;
                              " 
                            />
                          </div>`
                        : `<div style="
                            width: 40px;
                            height: 40px;
                            background: linear-gradient(135deg, #006d21 0%, #007d25 100%);
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            box-shadow: 0 4px 12px rgba(0, 109, 33, 0.4);
                            border: 3px solid #ffffff;
                            color: #ffffff;
                            font-size: 18px;
                          ">📍</div>`,
                      iconSize: [40, 40],
                      className: "",
                    });

                    return (
                      <Marker key={loc.id} position={[lat, lng]} icon={icon}>
                        <Popup>
                          <div style={{ padding: "8px" }}>
                            <h4
                              style={{
                                fontSize: "1.2rem",
                                fontWeight: "700",
                                color: "#006d21",
                                marginBottom: "8px",
                              }}
                            >
                              {loc.city}
                            </h4>
                            <p
                              style={{
                                fontSize: "0.95rem",
                                color: "#666",
                                marginBottom: "8px",
                              }}
                            >
                              {loc.country}
                            </p>
                            <small
                              style={{
                                fontSize: "0.85rem",
                                color: "#999",
                              }}
                            >
                              {lat.toFixed(4)}, {lng.toFixed(4)}
                            </small>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              )}
            </div>

            {/* CTA Button */}
            <div className="text-center mt-5">
              <Link
                href="/contact"
                className="wow fadeInUp animated"
                data-wow-delay=".9s"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  background:
                    "linear-gradient(135deg, #006d21 0%, #007d25 100%)",
                  color: "#ffffff",
                  padding: "18px 45px",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  borderRadius: "50px",
                  textDecoration: "none",
                  border: "none",
                  transition: "all 0.3s ease",
                  boxShadow: "0 10px 30px rgba(0, 109, 33, 0.3)",
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
                Connect With Us
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;
