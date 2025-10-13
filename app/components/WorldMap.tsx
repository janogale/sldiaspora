"use client";

import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";

// Example country markers with flag URLs
const countryMarkers: {
  geocode: [number, number];
  popUp: string;
  flagUrl: string;
}[] = [
  {
    geocode: [38.89511, -77.03637], // Washington, USA
    popUp: "United States",
    flagUrl: "https://flagcdn.com/us.svg",
  },
  {
    geocode: [48.8566, 2.3522], // Paris, France
    popUp: "France",
    flagUrl: "https://flagcdn.com/fr.svg",
  },
  {
    geocode: [35.6895, 139.6917], // Tokyo, Japan
    popUp: "Japan",
    flagUrl: "https://flagcdn.com/jp.svg",
  },
  {
    geocode: [51.5074, -0.1278], // London, UK
    popUp: "United Kingdom",
    flagUrl: "https://flagcdn.com/gb.svg",
  },
  {
    geocode: [55.7558, 37.6173], // Moscow, Russia
    popUp: "Russia",
    flagUrl: "https://flagcdn.com/ru.svg",
  },
  {
    geocode: [52.52, 13.405], // Berlin, Germany
    popUp: "Germany",
    flagUrl: "https://flagcdn.com/de.svg",
  },
  {
    geocode: [40.7128, -74.006], // New York, USA
    popUp: "New York",
    flagUrl: "https://flagcdn.com/us.svg",
  },
  {
    geocode: [28.6139, 77.209], // New Delhi, India
    popUp: "India",
    flagUrl: "https://flagcdn.com/in.svg",
  },
  {
    geocode: [-33.8688, 151.2093], // Sydney, Australia
    popUp: "Australia",
    flagUrl: "https://flagcdn.com/au.svg",
  },
  {
    geocode: [-23.5505, -46.6333], // São Paulo, Brazil
    popUp: "Brazil",
    flagUrl: "https://flagcdn.com/br.svg",
  },
];

// Calculate bounds to fit all markers
const bounds = countryMarkers.map((marker) => marker.geocode);

const Map = () => {
  return (
    <>
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
                    <div className="col-6" style={{ padding: "7rem 5rem " }}>
                      <h2 className="contact4__title wow" data-wow-delay=".2s">
                        Our Global Somaliland Community
                      </h2>
                      <p
                        className=" wow fadeInLeft animated"
                        data-wow-delay=".6s"
                      >
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
                    <div className=" col-6">
                      <MapContainer
                        bounds={bounds}
                        style={{
                          height: "400px",
                          width: "100%",
                          borderRadius: "1rem",
                        }}
                        scrollWheelZoom={false}
                        key={JSON.stringify(bounds)} // Ensures re-render if bounds change
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {countryMarkers.map((marker, idx) => {
                          const icon = L.divIcon({
                            html: `<img src="${marker.flagUrl}" alt="${marker.popUp} flag" style="width:32px;height:24px;border-radius:4px;border:1px solid #ccc;" />`,
                            iconSize: [32, 24],
                            className: "",
                          });
                          return (
                            <Marker
                              key={idx}
                              position={marker.geocode}
                              icon={icon}
                            >
                              <Popup>{marker.popUp}</Popup>
                            </Marker>
                          );
                        })}
                      </MapContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Map;
