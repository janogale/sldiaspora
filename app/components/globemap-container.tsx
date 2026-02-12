"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
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

const GlobeMapContainer = () => {
  const [locations, setLocations] = useState<GlobeMarkerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://sldp.duckdns.org/items/locations")
      .then((res) => {
        if (!res.ok) throw new Error(`API status: ${res.status}`);
        return res.json();
      })
      .then((data: { data: ApiLocation[] }) => {
        const rawLocations = data.data || [];
        const countryMap = new Map<string, { count: number; latSum: number; lngSum: number; name: string }>();

        rawLocations.forEach((loc) => {
          const country = loc.country || "Unknown Region";
          const mapData = loc.map;
          if (!mapData?.coordinates || mapData.coordinates.length < 2) return;

          const [lng, lat] = mapData.coordinates;
          if (!countryMap.has(country)) {
            countryMap.set(country, { count: 0, latSum: 0, lngSum: 0, name: country });
          }
          const entry = countryMap.get(country)!;
          entry.count += 1;
          entry.latSum += lat;
          entry.lngSum += lng;
        });

        const mappedData: GlobeMarkerData[] = Array.from(countryMap.values()).map((entry, index) => ({
          id: `country-${index}`,
          name: entry.name,
          code: `${entry.count.toLocaleString()} Member${entry.count !== 1 ? "s" : ""}`,
          lat: entry.latSum / entry.count,
          lng: entry.lngSum / entry.count,
          type: "Country Group",
          status: "online",
          size: Math.max(1.2, Math.log(entry.count) * 1.5),
          color: "#00E676",
          count: entry.count,
        }));

        setLocations(mappedData);
        setLoading(false);
      })
      .catch((err) => {
        setErrorMsg(err.message || "Failed to load data");
        setLoading(false);
      });
  }, []);

  const totalMembers = useMemo(() => locations.reduce((sum, loc) => sum + (loc.count ?? 0), 0), [locations]);

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
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between p-3 p-md-4 pointer-events-none">
              
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
              <div className="d-flex justify-content-center justify-content-md-start">
                <div className="globe-counter-floating p-4 shadow-2xl border border-white border-opacity-10 pointer-events-auto">
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
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobeMapContainer;