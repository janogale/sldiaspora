"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { GlobeMarkerData } from "../types";

const GlobeMap = dynamic(() => import("./Globe"), {
  ssr: false,
  loading: () => (
    <div className="globe-loading d-flex flex-column align-items-center justify-content-center bg-dark rounded-4">
      <div className="spinner-grow text-primary mb-3" role="status"></div>
      <span className="text-white-50 fw-medium">Initializing World View...</span>
    </div>
  ),
});

interface ApiLocation {
  id: string;
  city: string;
  country: string;
  map: {
    type: string;
    coordinates: number[];
  } | null;
}

// Static country coordinates [lat, lng] — replaces deprecated restcountries.com/v3.1
const COUNTRY_COORDS: Record<string, [number, number]> = {
  "Afghanistan": [33.9391, 67.7100], "Algeria": [28.0339, 1.6596],
  "Angola": [-11.2027, 17.8739], "Argentina": [-38.4161, -63.6167],
  "Australia": [-25.2744, 133.7751], "Austria": [47.5162, 14.5501],
  "Bahrain": [26.0275, 50.5500], "Bangladesh": [23.6850, 90.3563],
  "Belgium": [50.5039, 4.4699], "Brazil": [-14.2350, -51.9253],
  "Bulgaria": [42.7339, 25.4858], "Cameroon": [3.8480, 11.5021],
  "Canada": [56.1304, -106.3468], "Chad": [15.4542, 18.7322],
  "Chile": [-35.6751, -71.5430], "China": [35.8617, 104.1954],
  "Colombia": [4.5709, -74.2973], "Croatia": [45.1000, 15.2000],
  "Cyprus": [35.1264, 33.4299], "Czech Republic": [49.8175, 15.4730],
  "Denmark": [56.2639, 9.5018], "Djibouti": [11.8251, 42.5903],
  "Egypt": [26.8206, 30.8025], "England": [52.3555, -1.1743],
  "Eritrea": [15.1794, 39.7823], "Estonia": [58.5953, 25.0136],
  "Ethiopia": [9.1450, 40.4897], "Finland": [61.9241, 25.7482],
  "France": [46.2276, 2.2137], "Germany": [51.1657, 10.4515],
  "Ghana": [7.9465, -1.0232], "Greece": [39.0742, 21.8243],
  "Hungary": [47.1625, 19.5033], "Iceland": [64.9631, -19.0208],
  "India": [20.5937, 78.9629], "Indonesia": [-0.7893, 113.9213],
  "Iran": [32.4279, 53.6880], "Iraq": [33.2232, 43.6793],
  "Ireland": [53.1424, -7.6921], "Israel": [31.0461, 34.8516],
  "Italy": [41.8719, 12.5674], "Japan": [36.2048, 138.2529],
  "Jordan": [30.5852, 36.2384], "Kenya": [-0.0236, 37.9062],
  "Kosovo": [42.6026, 20.9030], "Kuwait": [29.3117, 47.4818],
  "Latvia": [56.8796, 24.6032], "Lebanon": [33.8547, 35.8623],
  "Libya": [26.3351, 17.2283], "Lithuania": [55.1694, 23.8813],
  "Luxembourg": [49.8153, 6.1296], "Madagascar": [-18.7669, 46.8691],
  "Malaysia": [4.2105, 101.9758], "Malta": [35.9375, 14.3754],
  "Mauritius": [-20.3484, 57.5522], "Mexico": [23.6345, -102.5528],
  "Morocco": [31.7917, -7.0926], "Mozambique": [-18.6657, 35.5296],
  "Netherlands": [52.1326, 5.2913], "New Zealand": [-40.9006, 174.8860],
  "Nigeria": [9.0820, 8.6753], "Norway": [60.4720, 8.4689],
  "Oman": [21.4735, 55.9754], "Pakistan": [30.3753, 69.3451],
  "Palestine": [31.9522, 35.2332], "Philippines": [12.8797, 121.7740],
  "Poland": [51.9194, 19.1451], "Portugal": [39.3999, -8.2245],
  "Qatar": [25.3548, 51.1839], "Romania": [45.9432, 24.9668],
  "Russia": [61.5240, 105.3188], "Rwanda": [-1.9403, 29.8739],
  "Saudi Arabia": [23.8859, 45.0792], "Scotland": [56.4907, -4.2026],
  "Senegal": [14.4974, -14.4524], "Serbia": [44.0165, 21.0059],
  "Singapore": [1.3521, 103.8198], "Somalia": [5.1521, 46.1996],
  "Somaliland": [9.5340, 44.1387], "South Africa": [-30.5595, 22.9375],
  "South Korea": [35.9078, 127.7669], "South Sudan": [6.8770, 31.3070],
  "Spain": [40.4637, -3.7492], "Sri Lanka": [7.8731, 80.7718],
  "Sudan": [12.8628, 30.2176], "Sweden": [60.1282, 18.6435],
  "Switzerland": [46.8182, 8.2275], "Syria": [34.8021, 38.9968],
  "Tanzania": [-6.3690, 34.8888], "Thailand": [15.8700, 100.9925],
  "Tunisia": [33.8869, 9.5375], "Turkey": [38.9637, 35.2433],
  "UAE": [23.4241, 53.8478], "Uganda": [1.3733, 32.2903],
  "Ukraine": [48.3794, 31.1656], "United Arab Emirates": [23.4241, 53.8478],
  "United Kingdom": [55.3781, -3.4360], "United States": [37.0902, -95.7129],
  "US": [37.0902, -95.7129], "USA": [37.0902, -95.7129],
  "UK": [55.3781, -3.4360], "Vietnam": [14.0583, 108.2772],
  "Wales": [52.1307, -3.7837], "Yemen": [15.5527, 48.5164],
  "Zimbabwe": [-19.0154, 29.1549],
};

// ISO alpha-2 flag codes for flagcdn.com
const COUNTRY_FLAG_CODES: Record<string, string> = {
  "Afghanistan": "af", "Algeria": "dz", "Angola": "ao", "Argentina": "ar",
  "Australia": "au", "Austria": "at", "Bahrain": "bh", "Bangladesh": "bd",
  "Belgium": "be", "Brazil": "br", "Bulgaria": "bg", "Cameroon": "cm",
  "Canada": "ca", "Chad": "td", "Chile": "cl", "China": "cn",
  "Colombia": "co", "Croatia": "hr", "Cyprus": "cy", "Czech Republic": "cz",
  "Denmark": "dk", "Djibouti": "dj", "Egypt": "eg", "England": "gb",
  "Eritrea": "er", "Estonia": "ee", "Ethiopia": "et", "Finland": "fi",
  "France": "fr", "Germany": "de", "Ghana": "gh", "Greece": "gr",
  "Hungary": "hu", "Iceland": "is", "India": "in", "Indonesia": "id",
  "Iran": "ir", "Iraq": "iq", "Ireland": "ie", "Israel": "il",
  "Italy": "it", "Japan": "jp", "Jordan": "jo", "Kenya": "ke",
  "Kosovo": "xk", "Kuwait": "kw", "Latvia": "lv", "Lebanon": "lb",
  "Libya": "ly", "Lithuania": "lt", "Luxembourg": "lu", "Madagascar": "mg",
  "Malaysia": "my", "Malta": "mt", "Mauritius": "mu", "Mexico": "mx",
  "Morocco": "ma", "Mozambique": "mz", "Netherlands": "nl", "New Zealand": "nz",
  "Nigeria": "ng", "Norway": "no", "Oman": "om", "Pakistan": "pk",
  "Palestine": "ps", "Philippines": "ph", "Poland": "pl", "Portugal": "pt",
  "Qatar": "qa", "Romania": "ro", "Russia": "ru", "Rwanda": "rw",
  "Saudi Arabia": "sa", "Scotland": "gb", "Senegal": "sn", "Serbia": "rs",
  "Singapore": "sg", "Somalia": "somaliland", "Somaliland": "somaliland",
  "South Africa": "za", "South Korea": "kr", "South Sudan": "ss",
  "Spain": "es", "Sri Lanka": "lk", "Sudan": "sd", "Sweden": "se",
  "Switzerland": "ch", "Syria": "sy", "Tanzania": "tz", "Thailand": "th",
  "Tunisia": "tn", "Turkey": "tr", "UAE": "ae", "Uganda": "ug",
  "Ukraine": "ua", "United Arab Emirates": "ae", "United Kingdom": "gb",
  "United States": "us", "US": "us", "USA": "us", "UK": "gb",
  "Vietnam": "vn", "Wales": "gb", "Yemen": "ye", "Zimbabwe": "zw",
};

const SOMALILAND_FLAG_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'%3E%3Crect width='24' height='5.333' y='0' fill='%23006D21'/%3E%3Crect width='24' height='5.333' y='5.333' fill='%23FFFFFF'/%3E%3Crect width='24' height='5.334' y='10.666' fill='%23D21034'/%3E%3Cpath d='M12 6.2l1 2.1 2.3.2-1.8 1.5.6 2.2-2.1-1.2-2.1 1.2.6-2.2-1.8-1.5 2.3-.2z' fill='%23000000'/%3E%3C/svg%3E";

const getCountryFlagSrc = (countryName: string): string | null => {
  const code = COUNTRY_FLAG_CODES[countryName.trim()];
  if (!code) return null;
  if (code === "somaliland") return SOMALILAND_FLAG_SVG;
  return `https://flagcdn.com/w40/${code}.png`;
};

const GlobeMapContainer = () => {
  const [locations, setLocations] = useState<GlobeMarkerData[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalCountries: 0, totalCities: 0 });
  const [totalMembers, setTotalMembers] = useState(0);
  const [countryBreakdown, setCountryBreakdown] = useState<
    Array<{ name: string; count: number }>
  >([]);

  useEffect(() => {
    const loadMemberMap = async () => {
      try {
        const res = await fetch("/api/members-map");
        if (!res.ok) throw new Error(`API status: ${res.status}`);

        const data = (await res.json().catch(() => null)) as {
          data?: ApiLocation[];
        } | null;

        const rawMembers = data?.data || [];
        setTotalMembers(rawMembers.length);

        const countryMap = new Map<
          string,
          { count: number; latSum: number; lngSum: number; name: string }
        >();

        const uniqueCountries = new Set<string>();
        const uniqueCities = new Set<string>();

        rawMembers.forEach((member) => {
          const country = member.country?.trim() || "Unknown Region";
          uniqueCountries.add(country);

          if (member.city?.trim()) {
            uniqueCities.add(`${country}::${member.city.trim().toLowerCase()}`);
          }

          const memberCoords = member.map?.coordinates;
          const fallbackCoords = COUNTRY_COORDS[country] as [number, number] | undefined;

          const coordinates =
            memberCoords && memberCoords.length >= 2 ? memberCoords : fallbackCoords;

          if (!coordinates) return;

          const [lng, lat] = coordinates;
          if (typeof lng !== "number" || typeof lat !== "number") return;

          if (!countryMap.has(country)) {
            countryMap.set(country, {
              count: 0,
              latSum: 0,
              lngSum: 0,
              name: country,
            });
          }

          const entry = countryMap.get(country)!;
          entry.count += 1;
          entry.latSum += lat;
          entry.lngSum += lng;
        });

        const mappedData: GlobeMarkerData[] = Array.from(countryMap.values()).map(
          (entry, index) => ({
            id: `country-${index}`,
            name: entry.name,
            code: `${entry.count.toLocaleString()} Member${
              entry.count !== 1 ? "s" : ""
            }`,
            lat: entry.latSum / entry.count,
            lng: entry.lngSum / entry.count,
            type: "Country Group",
            status: "online",
            size: Math.max(1.2, Math.log(entry.count) * 1.5),
            color: "#00E676",
            count: entry.count,
          })
        );

        setLocations(mappedData);
        setCountryBreakdown(
          Array.from(countryMap.values())
            .sort((a, b) => b.count - a.count)
            .map(({ name, count }) => ({ name, count }))
        );
        setStats({
          totalCountries: uniqueCountries.size,
          totalCities: uniqueCities.size,
        });
        setErrorMsg(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load member data";
        setErrorMsg(message);
      }
    };

    loadMemberMap();
  }, []);

  return (
    <section className="globe-section container-fluid px-3 py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-11">
          <div className="globe-master-card position-relative overflow-hidden rounded-4  border-0">
            
            {/* 1. The Globe Layer - Absolute Fill */}
            <div className="globe-viewport position-absolute top-0 start-0 w-100 h-100">
              <GlobeMap data={locations} />
            </div>

            {/* 2. UI Overlay Layer (pointer-events-none) */}
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between p-3 p-md-4 pointer-events-none globe-ui-overlay">
              
              {/* Header */}
              <div className="d-flex justify-content-between align-items-start">
                <div className="bg-dark bg-opacity-50 backdrop-blur p-3 rounded-3 shadow-sm border border-secondary border-opacity-25 pointer-events-auto">
                  <h1 className="h6 mb-1 fw-bold text-white text-uppercase ls-wider">Global Presence</h1>
                  <p className="small text-white-50 mb-0">Live Member Distribution</p>
                </div>
                {errorMsg && (
                  <div className="alert alert-danger py-2 px-3 m-0 shadow-sm border-0 pointer-events-auto">
                    {errorMsg}
                  </div>
                )}
              </div>

              {/* Bottom Counter - Pin to corner to keep map center clear */}
              <div className="d-flex justify-content-center justify-content-md-start globe-status-wrap">
                <div className="globe-status-group pointer-events-auto">
                  <div className="globe-counter-floating p-4 shadow-2xl border border-white border-opacity-10">
                    <div className="d-flex align-items-center gap-4">
                      <div className="counter-icon-box shadow-sm">
                        <div className="pulse-ring"></div>
                        <i className="bi bi-people-fill text-white"></i>
                      </div>
                      <div className="text-start">
                        <span className="d-block text-white-50 text-uppercase fw-bold ls-wider">Total Registered Members</span>
                        <h2 className="display-5 fw-black text-white mb-0 mt-n1 fw-bold">
                          {totalMembers.toLocaleString()}
                        </h2>
                        <div className="d-flex align-items-center gap-2 mt-1 mb-2">
                          <span className="live-dot"></span>
                          <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1">
                            Live
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="globe-mini-card p-3 border border-white border-opacity-10">
                    <div className="d-flex align-items-center gap-3">
                      <div className="counter-icon-box mini-icon-box shadow-sm">
                        <i className="bi bi-globe2 text-white"></i>
                      </div>
                      <div className="text-start">
                        <span className="d-block text-white-50 text-uppercase fw-bold ls-wider mini-label">Total Countries</span>
                        <h3 className="text-white fw-bold mb-0 mt-1">{stats.totalCountries.toLocaleString()}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="globe-mini-card p-3 border border-white border-opacity-10">
                    <div className="d-flex align-items-center gap-3">
                      <div className="counter-icon-box mini-icon-box shadow-sm">
                        <i className="bi bi-geo-alt-fill text-white"></i>
                      </div>
                      <div className="text-start">
                        <span className="d-block text-white-50 text-uppercase fw-bold ls-wider mini-label">Total Cities</span>
                        <h3 className="text-white fw-bold mb-0 mt-1">{stats.totalCities.toLocaleString()}</h3>
                      </div>
                    </div>
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

export default GlobeMapContainer;