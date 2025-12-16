"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { GlobeMarkerData } from "../types";

const GlobeComponent = dynamic(() => import("./Globe"), {
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
const Hero = () => {
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
          `Processed ${validCount} valid coordinates into ${countryMap.size} unique countries.`
        );

        // Map to GlobeMarkerData
        const mappedData: GlobeMarkerData[] = Array.from(
          countryMap.values()
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
            "Data loaded, but no valid coordinates found in 'map' field."
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
    <section
      className="overflow-hidden p-relative gray-bg section-space-bottom-170 overflow-hidden"
      style={{ background: "#006D21" }}
    >
      <div className="banner2__area p-relative">
        <div
          className="banner2__shape"
          style={{
            backgroundImage: "url(/assets/imgs/banner-2/banner2-shape.svg)",
          }}
        ></div>
        <div className="banner2__padding-spsace2" style={{ marginTop: "5rem" }}>
          <div className="container">
            <div className="row align-items-center">
              <div
                className="col-lg-6 col-md-12"
                style={{ marginTop: "20rem" }}
              >
                <div className="banner2__content p-relative">
                  <h6
                    className="banner2__subtitle wow fadeInLeft animated"
                    data-wow-delay=".2s"
                  >
                     Connecting the Global Somaliland Community
                    <img
                      style={{
                        width: "62px",
                        height: "10px",
                        objectFit: "fill",
                      }}
                      src="/assets/imgs/shape.svg"
                      alt=""
                    />
                  </h6>
                  <h1
                    className="banner2__title wow fadeInLeft animated"
                    data-wow-delay=".4s"
                  >
                    Your official portal for engagement, investment and
                    nation-building.
                  </h1>
                  <Link
                    href="/contact"
                    className="banner2__button mt-40 mt-xs-25 wow fadeInLeft animated"
                    data-wow-delay=".6s"
                  >
                    Contact Us <i className="fa-solid fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
              <div className="col-lg-6 col-md-12">
                <div
                  className="banner2__right-thumb wow fadeInLeft animated"
                  data-wow-delay=".8s"
                  style={{
                    width: "100%",
                    height: "600px",
                    overflow: "hidden",
                    marginTop: "0",
                    paddingTop: "0",
                  }}
                >
                  {/* <div className="banner2__item">
                      <div className="banner2__item-germany upDown">
                        <div className="banner2__item-indonesia-small-img">
                          <img
                            src="/assets/imgs/banner-2/germany-img.png"
                            alt="img not found"
                          />
                        </div>
                        <div className="banner2__item-germany-text">
                          <span>Germany</span>
                        </div>
                      </div>
                      <div className="banner2__item-south-korea upDown-top">
                        <div className="banner2__item-indonesia-small-img">
                          <img
                            src="/assets/imgs/banner-2/south-korea-img.png"
                            alt="img not found"
                          />
                        </div>
                        <div className="banner2__item-south-korea-text">
                          <span>South Korea</span>
                        </div>
                      </div>
                      <div className="banner2__item-south-africa upDown-bottom">
                        <div className="banner2__item-south-africa-small-img">
                          <img
                            src="/assets/imgs/banner-2/south-africa-img.png"
                            alt="img not found"
                          />
                        </div>
                        <div className="banner2__item-south-africa-text">
                          <span>South Africa</span>
                        </div>
                      </div>
                      <div className="banner2__item-turkey leftRight">
                        <div className="banner2__item-turkey-small-img">
                          <img
                            src="/assets/imgs/banner-2/turkey-img.png"
                            alt="img not found"
                          />
                        </div>
                        <div className="banner2__item-turkey-text">
                          <span>Turkey</span>
                        </div>
                      </div>
                      <div className="banner2__item-indonesia rightLeft">
                        <div className="banner2__item-indonesia-small-img">
                          <img
                            src="/assets/imgs/banner-2/indonesia-img.png"
                            alt="img not found"
                          />
                        </div>
                        <div className="banner2__item-indonesia-text">
                          <span>Tndonesia</span>
                        </div>
                      </div>
                    </div> */}

                  <GlobeComponent
                    data={locations}
                    onRegionClick={handleRegionClick}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
