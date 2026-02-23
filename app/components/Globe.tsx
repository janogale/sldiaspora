"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import * as THREE from "three";
import { BUMP_IMAGE_URL, GLOBE_IMAGE_URL } from "../constants";
import { GlobeMarkerData } from "../types";

interface GlobeProps {
  data: GlobeMarkerData[];
  onRegionClick?: (region: GlobeMarkerData) => void;
}

const countryFlagCodeMap: Record<string, string> = {
  "United Kingdom": "gb",
  UK: "gb",
  England: "gb",
  Scotland: "gb",
  Wales: "gb",
  "United States": "us",
  USA: "us",
  Somaliland: "somaliland",
  Somalia: "somaliland",
  Ethiopia: "et",
  Kenya: "ke",
  India: "in",
  UAE: "ae",
  "Saudi Arabia": "sa",
  Turkey: "tr",
  Germany: "de",
  France: "fr",
  Canada: "ca",
  Sweden: "se",
  Norway: "no",
  Denmark: "dk",
  Netherlands: "nl",
  Belgium: "be",
  Switzerland: "ch",
};

const getCountryFlagCode = (countryName: string) => {
  return countryFlagCodeMap[countryName.trim()] || null;
};

const SOMALILAND_FLAG_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 16'%3E%3Crect width='24' height='5.333' y='0' fill='%23006D21'/%3E%3Crect width='24' height='5.333' y='5.333' fill='%23FFFFFF'/%3E%3Crect width='24' height='5.334' y='10.666' fill='%23D21034'/%3E%3Cpath d='M12 6.2l1 2.1 2.3.2-1.8 1.5.6 2.2-2.1-1.2-2.1 1.2.6-2.2-1.8-1.5 2.3-.2z' fill='%23000000'/%3E%3C/svg%3E";

const getFlagSrc = (flagCode: string) => {
  if (flagCode === "somaliland") {
    return SOMALILAND_FLAG_SVG;
  }
  return `https://flagcdn.com/w20/${flagCode}.png`;
};

const getDisplayCountryName = (countryName: string) => {
  const normalized = countryName.trim();
  if (normalized === "Somalia" || normalized === "Somaliland") {
    return "Somaliland";
  }
  return normalized;
};

const GlobeComponent: React.FC<GlobeProps> = ({ data, onRegionClick }) => {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredObject, setHoveredObject] = useState<GlobeMarkerData | null>(
    null
  );
  const [dimensions, setDimensions] = useState({
    width: 900,
    height: 730,
  });

  // Handle container resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: width || 900,
          height: height || 730,
        });
      }
    };

    updateDimensions();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }
  }, []);

  // Configure auto-rotation and initial view
  useEffect(() => {
    if (globeEl.current) {
      // Slow, smooth rotation typical of data visualizations
      const controls = globeEl.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        // Disable zooming (mouse wheel / pinch)
        controls.enableZoom = false;
      }

      // Initial position
      // Initial position - set a closer altitude for a "zoomed-in" view
      // (second arg is animation duration in ms)
      globeEl.current.pointOfView({ lat: 25, lng: 10, altitude: 1.5 }, 1500);
    }
  }, []);

  // Toggle rotation based on hover state
  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      if (controls) {
        controls.autoRotate = !hoveredObject;
      }
    }
  }, [hoveredObject]);

  /**
   * Creates a custom HTML DOM element for the label.
   */
  const createHtmlElement = useCallback(
    (d: object): HTMLElement => {
      const data = d as GlobeMarkerData;
      const displayName = getDisplayCountryName(data.name);
      const el = document.createElement("div");

      // Container style
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.gap = "8px";
      el.style.cursor = "pointer";
      el.style.pointerEvents = "auto"; // Ensure clicks pass through
      el.className = "globe-label-container";

      // The Dot indicator
      const dot = document.createElement("div");
      dot.style.width = "8px";
      dot.style.height = "8px";
      dot.style.borderRadius = "50%";
      dot.style.backgroundColor =
        data.status === "online" ? "#4ade80" : "#facc15";
      dot.style.boxShadow = `0 0 10px ${
        data.status === "online" ? "#4ade80" : "#facc15"
      }`;

      // The Text Label Container
      const textContainer = document.createElement("div");
      textContainer.style.background = "transparent";
      textContainer.style.border = "1px solid rgba(148, 163, 184, 0.3)";
      textContainer.style.borderRadius = "4px";
      textContainer.style.padding = "4px 8px";
      textContainer.style.backdropFilter = "blur(4px)";
      textContainer.style.display = "flex";
      textContainer.style.alignItems = "center";
      textContainer.style.gap = "6px";
      textContainer.style.transition = "all 0.2s ease";

      // Region Name
      const flagCode = getCountryFlagCode(displayName);
      const flagNode = flagCode
        ? document.createElement("img")
        : document.createElement("span");

      if (flagCode) {
        const flagImg = flagNode as HTMLImageElement;
        flagImg.src = getFlagSrc(flagCode);
        flagImg.alt = `${displayName} flag`;
        flagImg.loading = "lazy";
        flagImg.style.width = "14px";
        flagImg.style.height = "10px";
        flagImg.style.objectFit = "cover";
        flagImg.style.borderRadius = "2px";
        flagImg.style.boxShadow = "0 0 0 1px rgba(255,255,255,0.15)";
      } else {
        const flagSpan = flagNode as HTMLSpanElement;
        flagSpan.textContent = "🌍";
        flagSpan.style.fontSize = "12px";
        flagSpan.style.lineHeight = "1";
      }

      const nameSpan = document.createElement("span");
      nameSpan.textContent = displayName;
      nameSpan.style.color = "rgba(255, 255, 255, 0.95)";
      nameSpan.style.fontFamily = "sans-serif";
      nameSpan.style.fontSize = "12px";
      nameSpan.style.fontWeight = "600";
      nameSpan.style.whiteSpace = "nowrap";

      // Count Badge
      const countSpan = document.createElement("span");
      countSpan.textContent = data.count ? data.count.toLocaleString() : "";
      countSpan.style.color = "#fbbf24"; // Amber-400
      countSpan.style.fontSize = "11px";
      countSpan.style.fontWeight = "500";
      countSpan.style.borderLeft = "1px solid rgba(255,255,255,0.2)";
      countSpan.style.paddingLeft = "6px";

      textContainer.appendChild(flagNode);
      textContainer.appendChild(nameSpan);
      if (data.count) textContainer.appendChild(countSpan);

      el.appendChild(dot);
      el.appendChild(textContainer);

      // Hover effect
      el.onmouseenter = () => {
        setHoveredObject(data);
        textContainer.style.background = "red";
        textContainer.style.borderColor = "#38bdf8";
        textContainer.style.transform = "scale(1.05)";
      };
      el.onmouseleave = () => {
        setHoveredObject(null);
        textContainer.style.background = "transparent";
        textContainer.style.borderColor = "rgba(148, 163, 184, 0.3)";
        textContainer.style.transform = "scale(1)";
      };

      el.onclick = () => {
        if (onRegionClick) onRegionClick(data);
      };

      return el;
    },
    [onRegionClick]
  );

  /**
   * Creates a custom Three.js object for the 3D marker.
   */
  const createThreeObject = useCallback((d: object): THREE.Object3D => {
    const data = d as GlobeMarkerData;
    const group = new THREE.Group();

    // 1. Core Sphere
    const geometry = new THREE.SphereGeometry(data.size * 0.5, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(data.color),
      emissive: new THREE.Color(data.color),
      emissiveIntensity: 0.7,
      shininess: 100,
    });
    const sphere = new THREE.Mesh(geometry, material);
    group.add(sphere);

    // 2. Outer Glow
    const glowGeo = new THREE.SphereGeometry(data.size * 1.2, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: data.color,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    group.add(glow);

    return group;
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        // --- Visuals ---
        globeImageUrl={GLOBE_IMAGE_URL}
        bumpImageUrl={BUMP_IMAGE_URL}
        // backgroundImageUrl={BACKGROUND_URL}
        backgroundColor="#006D21"
        atmosphereColor="#006D21"
        atmosphereAltitude={0.15}
        // --- 3D Objects ---
        objectsData={data}
        objectLat="lat"
        objectLng="lng"
        objectAltitude={0.01}
        objectThreeObject={createThreeObject}
        objectLabel={(d: object) => {
          const item = d as GlobeMarkerData;
          return `
            <div style="
              background: transparent; 
              color: white; 
              padding: 10px 14px; 
              border-radius: 8px; 
              font-family: sans-serif;
              border: 1px solid #475569;
              box-shadow: 0 4px 6px rgba(0,0,0,0.3);
              min-width: 120px;
            ">
              <div style="font-size: 14px; font-weight: 700; margin-bottom: 4px;">${
                item.name
              }</div>
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #cbd5e1;">
                <span>Total Members</span>
                <span style="color: #fbbf24; font-weight: 600;">${item.count?.toLocaleString()}</span>
              </div>
            </div>
          `;
        }}
        onObjectHover={(obj) => {
          setHoveredObject(obj as GlobeMarkerData | null);
          if (typeof document !== "undefined") {
            document.body.style.cursor = obj ? "pointer" : "default";
          }
        }}
        onObjectClick={(obj) => {
          if (onRegionClick && obj) onRegionClick(obj as GlobeMarkerData);
        }}
        // --- HTML Labels ---
        htmlElementsData={data}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={0.1}
        htmlElement={createHtmlElement}
        htmlTransitionDuration={1000}
      />

      {/* Title */}
      {/* <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h1 className="text-white text-2xl font-bold tracking-tight mb-2 drop-shadow-md">
          Global Member Distribution
        </h1>
        <p className="text-slate-400 text-sm max-w-xs drop-shadow-sm">
          Aggregated view of 5,000 members.
        </p>
      </div> */}

      {/* Info Card */}
      {/* {hoveredObject && (
        <div className="absolute bottom-6 right-6 z-10 pointer-events-none">
          <div className="border border-slate-700 p-5 rounded-xl shadow-2xl backdrop-blur-md text-white w-72">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    hoveredObject.status === "online"
                      ? "bg-green-400"
                      : "bg-yellow-400"
                  } animate-pulse`}
                />
                <span className="font-semibold text-xs uppercase tracking-wider text-slate-400">
                  Region Active
                </span>
              </div>
              <span className="text-xs px-2 py-1 rounded text-slate-300 border border-slate-700">
                ID: {hoveredObject.id.split("-")[1]}
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-1 text-white">
              {hoveredObject.name}
            </h2>
            <div className="text-xs text-slate-400 font-mono mb-4 flex items-center gap-2">
              <span>{Math.round(hoveredObject.lat * 100) / 100}° N</span>
              <span>{Math.round(hoveredObject.lng * 100) / 100}° E</span>
            </div>

            <div className="rounded-lg p-3 border border-slate-700">
              <div className="flex justify-between items-end">
                <span className="text-slate-400 text-sm">Members</span>
                <span className="text-2xl font-bold text-amber-400">
                  {hoveredObject.count?.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default GlobeComponent;
