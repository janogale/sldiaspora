"use client";

import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";

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
      style={{ margin: "20rem 0 5rem 0" }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-12">
            <div className="contact4__allcontent p-relative mt-255">
              <div className="contact4__bg-color">
                <div className="contact4__bg-img"></div>
                <div className="row">
                  {/* Left side */}
                  <div className="col-6" style={{ padding: "7rem 5rem " }}>
                    <h2 className="contact4__title wow" data-wow-delay=".2s">
                      Our Global Somaliland Community
                    </h2>
                    <p className="wow fadeInLeft animated" data-wow-delay=".6s">
                      Connecting a Worldwide Network for a National Vision
                    </p>
                    <div
                      className="button mt-40 wow fadeInLeft animated"
                      data-wow-delay=".3s"
                    >
                      <Link href="/contact" className="contact4__btn">
                        Contact us <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>

                  {/* Map side */}
                  <div className=" col-6">
                    {locations.length > 0 && (
                      <MapContainer
                        bounds={bounds}
                        style={{
                          height: "400px",
                          width: "100%",
                          borderRadius: "1rem",
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
                              ? `<img src="${flag}" alt="${loc.country} flag" style="width:32px;height:24px;border-radius:4px;border:1px solid #ccc;" />`
                              : `<div style="background:#fff;border-radius:4px;padding:4px;border:1px solid #ccc;">📍</div>`,
                            iconSize: [32, 24],
                            className: "",
                          });

                          return (
                            <Marker
                              key={loc.id}
                              position={[lat, lng]}
                              icon={icon}
                            >
                              <Popup>
                                <strong>{loc.city}</strong> <br />
                                {loc.country} <br />
                                <small>
                                  {lat.toFixed(4)}, {lng.toFixed(4)}
                                </small>
                              </Popup>
                            </Marker>
                          );
                        })}
                      </MapContainer>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;
