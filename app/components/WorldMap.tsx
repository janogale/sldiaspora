"use client";
import React, { useState } from "react";

interface Country {
  id: string;
  name: string;
  flag: string;
  position: { x: number; y: number };
  diasporaSize?: string;
  description?: string;
}

const WorldMap = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);

  const countries: Country[] = [
    {
      id: "usa",
      name: "United States",
      flag: "🇺🇸",
      position: { x: 15, y: 35 },
      diasporaSize: "Large Community",
      description: "Strong Somaliland diaspora presence in major US cities",
    },
    {
      id: "uk",
      name: "United Kingdom",
      flag: "🇬🇧",
      position: { x: 48, y: 25 },
      diasporaSize: "Established Community",
      description:
        "Well-established Somaliland community in London and other cities",
    },
    {
      id: "canada",
      name: "Canada",
      flag: "🇨🇦",
      position: { x: 18, y: 28 },
      diasporaSize: "Growing Community",
      description: "Increasing Somaliland diaspora in Toronto and Ottawa",
    },
    {
      id: "sweden",
      name: "Sweden",
      flag: "🇸🇪",
      position: { x: 52, y: 20 },
      diasporaSize: "Active Community",
      description: "Vibrant Somaliland community in Stockholm and Gothenburg",
    },
    {
      id: "norway",
      name: "Norway",
      flag: "🇳🇴",
      position: { x: 50, y: 18 },
      diasporaSize: "Strong Community",
      description: "Active Somaliland diaspora in Oslo",
    },
    {
      id: "netherlands",
      name: "Netherlands",
      flag: "🇳🇱",
      position: { x: 50, y: 23 },
      diasporaSize: "Established Community",
      description: "Somaliland community in Amsterdam and Rotterdam",
    },
    {
      id: "germany",
      name: "Germany",
      flag: "🇩🇪",
      position: { x: 52, y: 25 },
      diasporaSize: "Growing Community",
      description: "Somaliland diaspora in Berlin and other major cities",
    },
    {
      id: "uae",
      name: "United Arab Emirates",
      flag: "🇦🇪",
      position: { x: 58, y: 40 },
      diasporaSize: "Business Community",
      description: "Strong business and trade connections in Dubai",
    },
    {
      id: "saudi",
      name: "Saudi Arabia",
      flag: "🇸🇦",
      position: { x: 55, y: 42 },
      diasporaSize: "Religious Community",
      description: "Somaliland community focused on religious tourism",
    },
    {
      id: "australia",
      name: "Australia",
      flag: "🇦🇺",
      position: { x: 75, y: 55 },
      diasporaSize: "Emerging Community",
      description: "Growing Somaliland diaspora in Melbourne and Sydney",
    },
    {
      id: "somaliland",
      name: "Somaliland",
      flag: "🇸🇱",
      position: { x: 56, y: 38 },
      diasporaSize: "Home Country",
      description: "Republic of Somaliland - Home to our diaspora initiatives",
    },
  ];

  const handleCountryClick = (country: Country) => {
    setSelectedCountry(country);
  };

  const handleCountryHover = (country: Country) => {
    setHoveredCountry(country);
  };

  const handleMouseLeave = () => {
    setHoveredCountry(null);
  };

  return (
    <section className="world-map-section pt-100 pb-100">
      <div className="container">
        <div className="row justify-content-center mb-50">
          <div className="col-lg-8 text-center">
            <h2 className="section-title">Global Diaspora Network</h2>
            <p className="section-subtitle">
              Explore Somaliland diaspora communities around the world. Click on
              any pin to learn more about our global presence.
            </p>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="world-map-container">
              <div className="map-wrapper">
                {/* World Map SVG */}
                <svg
                  viewBox="0 0 100 50"
                  className="world-map-svg"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Simplified world map paths - you can replace with more detailed SVG paths */}
                  <defs>
                    <linearGradient
                      id="landGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#e8f5e8" />
                      <stop offset="100%" stopColor="#c8e6c9" />
                    </linearGradient>
                    <linearGradient
                      id="waterGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#e3f2fd" />
                      <stop offset="100%" stopColor="#bbdefb" />
                    </linearGradient>
                  </defs>

                  {/* Water/Ocean background */}
                  <rect width="100" height="50" fill="url(#waterGradient)" />

                  {/* Simplified continent shapes - these are basic representations */}
                  {/* North America */}
                  <path
                    d="M5 15 Q15 10 25 15 Q35 20 45 15 Q55 10 65 15 L65 25 Q55 30 45 25 Q35 20 25 25 Q15 30 5 25 Z"
                    fill="url(#landGradient)"
                    stroke="#006D21"
                    strokeWidth="0.1"
                  />

                  {/* Europe */}
                  <path
                    d="M45 10 Q55 5 65 10 Q70 15 65 20 Q55 25 45 20 Q40 15 45 10 Z"
                    fill="url(#landGradient)"
                    stroke="#006D21"
                    strokeWidth="0.1"
                  />

                  {/* Africa */}
                  <path
                    d="M45 25 Q50 20 55 25 Q60 30 55 35 Q50 40 45 35 Q40 30 45 25 Z"
                    fill="url(#landGradient)"
                    stroke="#006D21"
                    strokeWidth="0.1"
                  />

                  {/* Asia */}
                  <path
                    d="M65 15 Q75 10 85 15 Q90 20 85 25 Q75 30 65 25 Q60 20 65 15 Z"
                    fill="url(#landGradient)"
                    stroke="#006D21"
                    strokeWidth="0.1"
                  />

                  {/* Australia */}
                  <path
                    d="M75 35 Q85 30 90 35 Q85 40 75 35 Z"
                    fill="url(#landGradient)"
                    stroke="#006D21"
                    strokeWidth="0.1"
                  />

                  {/* Country pins */}
                  {countries.map((country) => (
                    <g key={country.id}>
                      {/* Pin base */}
                      <circle
                        cx={country.position.x}
                        cy={country.position.y}
                        r="0.8"
                        fill="#006D21"
                        stroke="white"
                        strokeWidth="0.2"
                        className="country-pin"
                        onClick={() => handleCountryClick(country)}
                        onMouseEnter={() => handleCountryHover(country)}
                        onMouseLeave={handleMouseLeave}
                        style={{ cursor: "pointer" }}
                      />
                      {/* Pin highlight on hover */}
                      {(hoveredCountry?.id === country.id ||
                        selectedCountry?.id === country.id) && (
                        <circle
                          cx={country.position.x}
                          cy={country.position.y}
                          r="1.2"
                          fill="#004d1a"
                          stroke="white"
                          strokeWidth="0.3"
                          className="pin-highlight"
                        />
                      )}
                    </g>
                  ))}
                </svg>

                {/* Country information display */}
                {(hoveredCountry || selectedCountry) && (
                  <div className="country-info-panel">
                    <div className="country-info-content">
                      <div className="country-flag">
                        {(hoveredCountry || selectedCountry)?.flag}
                      </div>
                      <div className="country-details">
                        <h4 className="country-name">
                          {(hoveredCountry || selectedCountry)?.name}
                        </h4>
                        <p className="country-description">
                          {(hoveredCountry || selectedCountry)?.description}
                        </p>
                        <span className="country-size">
                          {(hoveredCountry || selectedCountry)?.diasporaSize}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="map-legend">
                <div className="legend-item">
                  <div className="legend-pin"></div>
                  <span>Diaspora Communities</span>
                </div>
                <div className="legend-item">
                  <div className="legend-home"></div>
                  <span>Somaliland (Home)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorldMap;
