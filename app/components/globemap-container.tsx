"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { GlobeMarkerData } from "../types";

const GlobeMap = dynamic(() => import("./Globe"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "600px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
      }}
    >
      Loading Globe...
    </div>
  ),
});
interface ApiLocation {
  id: string;
  city: string;
  country: string;
  map: {
    type: string;
    coordinates: number[]; // [lng, lat] per GeoJSON spec
  } | null;
}
const GlobeMapContainer = () => {
  const [locations, setLocations] = useState<GlobeMarkerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  console.log(loading, locations, errorMsg);
  useEffect(() => {
    // We use limit=-1 to fetch all items.
    // We remove the 'fields' param to ensure we get the full object as shown in your sample.
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

        console.log(`Fetched ${rawLocations.length} raw records.`);

        // Aggregate by Country
        const countryMap = new Map<
          string,
          {
            count: number;
            latSum: number;
            lngSum: number;
            name: string;
          }
        >();

        let validCount = 0;

        rawLocations.forEach((loc) => {
          const country = loc.country || "Unknown Region";
          const mapData = loc.map;

          // GeoJSON Point: coordinates is [longitude, latitude]
          if (
            mapData &&
            mapData.coordinates &&
            Array.isArray(mapData.coordinates) &&
            mapData.coordinates.length >= 2
          ) {
            const lng = mapData.coordinates[0];
            const lat = mapData.coordinates[1];

            // Validate numbers
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
              validCount++;
            }
          }
        });

        console.log(
          `Processed ${validCount} valid coordinates into ${countryMap.size} unique countries.`,
        );

        // Map to GlobeMarkerData
        const mappedData: GlobeMarkerData[] = Array.from(
          countryMap.values(),
        ).map((entry, index) => {
          // Calculate centroid
          const avgLat = entry.latSum / entry.count;
          const avgLng = entry.lngSum / entry.count;

          // Determine size based on count (log scale for better visualization)
          // 1 Member = 0 log size, so we use count+1 or a base min size
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
            size: Math.max(1.2, sizeBase), // Minimum visible size
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
  return (
    <section>
      <GlobeMap data={locations} onRegionClick={handleRegionClick} />
    </section>
  );
};

export default GlobeMapContainer;
