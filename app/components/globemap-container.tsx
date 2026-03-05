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

const countryCoordsCache = new Map<string, [number, number]>();

const getCountryCoordinates = async (
  country: string
): Promise<[number, number] | null> => {
  const key = country.trim().toLowerCase();
  if (!key) return null;

  if (countryCoordsCache.has(key)) {
    return countryCoordsCache.get(key)!;
  }

  const fetchFromRestCountries = async (fullText: boolean) => {
    const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(
      country
    )}${fullText ? "?fullText=true" : ""}`;
    const response = await fetch(url);
    if (!response.ok) return null;

    const result = (await response.json().catch(() => null)) as
      | Array<{ latlng?: number[] }>
      | null;

    const latlng = result?.[0]?.latlng;
    if (!latlng || latlng.length < 2) return null;

    const [lat, lng] = latlng;
    if (typeof lat !== "number" || typeof lng !== "number") return null;

    return [lng, lat] as [number, number];
  };

  const coordinates =
    (await fetchFromRestCountries(true)) ??
    (await fetchFromRestCountries(false));

  if (coordinates) {
    countryCoordsCache.set(key, coordinates);
  }

  return coordinates;
};

const GlobeMapContainer = () => {
  const [locations, setLocations] = useState<GlobeMarkerData[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalCountries: 0, totalCities: 0 });
  const [totalMembers, setTotalMembers] = useState(0);

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

        const countryCoordMap = new Map<string, [number, number]>();
        await Promise.all(
          Array.from(
            new Set(
              rawMembers
                .map((member) => member.country?.trim())
                .filter((country): country is string => Boolean(country))
            )
          ).map(async (country) => {
            const coordinates = await getCountryCoordinates(country);
            if (coordinates) {
              countryCoordMap.set(country, coordinates);
            }
          })
        );

        rawMembers.forEach((member) => {
          const country = member.country?.trim() || "Unknown Region";
          uniqueCountries.add(country);

          if (member.city?.trim()) {
            uniqueCities.add(`${country}::${member.city.trim().toLowerCase()}`);
          }

          const memberCoords = member.map?.coordinates;
          const fallbackCoords = countryCoordMap.get(country);

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