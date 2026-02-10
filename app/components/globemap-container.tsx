"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GlobeMarkerData } from "../types";

const GlobeMap = dynamic(() => import("./Globe"), {
  ssr: false,
  loading: () => (
    <div className="globe-loading d-flex align-items-center justify-content-center rounded-4">
      <span className="spinner-border spinner-border-sm me-2" role="status" />
      Loading globe...
    </div>
  ),
});

interface ApiLocation {
  id: string;
  city: string;
  country: string;
  map: {
    type: string;
    coordinates: number[]; // [lng, lat]
  } | null;
}

const GlobeMapContainer = () => {
  const [locations, setLocations] = useState<GlobeMarkerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://sldp.duckdns.org/items/locations")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API returned status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: { data: ApiLocation[] }) => {
        const rawLocations = data.data;

        if (!rawLocations || !Array.isArray(rawLocations)) {
          throw new Error("Invalid data format received from API");
        }

        const countryMap = new Map<
          string,
          { count: number; latSum: number; lngSum: number; name: string }
        >();

        rawLocations.forEach((loc) => {
          const country = loc.country || "Unknown Region";
          const mapData = loc.map;

          if (
            mapData &&
            mapData.coordinates &&
            Array.isArray(mapData.coordinates) &&
            mapData.coordinates.length >= 2
          ) {
            const [lng, lat] = mapData.coordinates;

            if (
              typeof lat === "number" &&
              typeof lng === "number" &&
              !isNaN(lat) &&
              !isNaN(lng)
            ) {
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
            }
          }
        });

        const mappedData: GlobeMarkerData[] = Array.from(
          countryMap.values(),
        ).map((entry, index) => {
          const avgLat = entry.latSum / entry.count;
          const avgLng = entry.lngSum / entry.count;
          const sizeBase = Math.log(entry.count) * 1.5;

          return {
            id: `country-${index}`,
            name: entry.name,
            code: `${entry.count.toLocaleString()} Member${
              entry.count !== 1 ? "s" : ""
            }`,
            lat: avgLat,
            lng: avgLng,
            type: "Country Group",
            status: "online",
            size: Math.max(1.2, sizeBase),
            color: "#FF9900",
            count: entry.count,
          };
        });

        if (mappedData.length === 0 && rawLocations.length > 0) {
          setErrorMsg(
            "Data loaded, but no valid coordinates found in 'map' field.",
          );
        } else if (mappedData.length === 0) {
          setErrorMsg("No location data found.");
        }

        setLocations(mappedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching locations:", err);
        setErrorMsg(err.message || "Failed to load data");
        setLoading(false);
      });
  }, []);

  const handleRegionClick = useCallback((region: GlobeMarkerData) => {
    console.log(`Region clicked: ${region.name}, Count: ${region.count}`);
  }, []);

  const totalMembers = useMemo(
    () => locations.reduce((sum, loc) => sum + (loc.count ?? 0), 0),
    [locations],
  );

  const totalCountries = useMemo(() => locations.length, [locations]);

  const countryCounts = useMemo(
    () =>
      [...locations]
        .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
        .map((loc) => ({
          name: loc.name,
          count: loc.count ?? 0,
        })),
    [locations],
  );

  return (
    <section className="globe-section container py-4 py-md-5">
      <div className="row justify-content-center g-4">
        {/* Map column */}
        <div className="col-12">
          <div className="globe-wrapper rounded-4 overflow-hidden d-flex">
            <div className="flex-grow-1 min-vh-25">
              <GlobeMap data={locations} onRegionClick={handleRegionClick} />
            </div>
          </div>

          {(loading || errorMsg) && (
            <div
              className={`mt-2 small ${
                errorMsg ? "text-danger" : "text-muted"
              }`}
            >
              {loading ? "Loading locations..." : errorMsg}
            </div>
          )}
        </div>

        {/* Stats / counters */}
        <div className="col-12">
          <div className="globe-stats card border-0 rounded-4 shadow-sm">
            <div className="card-body">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <div>
                  <h3 className="h5 mb-1 text-body">Member Counters</h3>
                  <p className="small mb-0 text-muted">
                    Overview of diaspora members by country.
                  </p>
                </div>

                <div className="d-flex flex-wrap align-items-center gap-2">
                  <div className="globe-pill d-flex align-items-center gap-2">
                    <span className="globe-pill-dot globe-pill-dot--members" />
                    <span className="small fw-semibold text-body">
                      Total Members: {totalMembers.toLocaleString()}
                    </span>
                  </div>
                  <div className="globe-pill d-flex align-items-center gap-2">
                    <span className="globe-pill-dot globe-pill-dot--countries" />
                    <span className="small fw-semibold text-body">
                      Countries: {totalCountries.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="row g-2">
                {countryCounts.map((country) => (
                  <div
                    key={country.name}
                    className="col-12 col-sm-6 col-md-4 col-lg-3"
                  >
                    <div className="globe-country-card d-flex align-items-center justify-content-between rounded-3 px-3 py-2">
                      <span
                        className="globe-country-name text-truncate"
                        title={country.name}
                      >
                        {country.name}
                      </span>
                      <span className="fw-semibold globe-country-count">
                        {country.count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
                {countryCounts.length === 0 && !loading && !errorMsg && (
                  <div className="col-12 text-muted small">
                    No country data available.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobeMapContainer;