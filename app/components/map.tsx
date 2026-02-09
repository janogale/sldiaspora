// app/components/map.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "@/lib/leafletIconFix";

const members = [
  {
    id: 1,
    country: "Somaliland (Hargeisa)",
    position: [9.56, 44.07],
    count: 2,
  },
  {
    id: 2,
    country: "Kenya (Nairobi)",
    position: [-1.286389, 36.817223],
    count: 4,
  },
  {
    id: 3,
    country: "Ethiopia (Addis Ababa)",
    position: [8.9806, 38.7578],
    count: 3,
  },
  {
    id: 4,
    country: "United Kingdom (London)",
    position: [51.5074, -0.1278],
    count: 6,
  },
  {
    id: 5,
    country: "United States (New York)",
    position: [40.7128, -74.006],
    count: 8,
  },
  {
    id: 6,
    country: "UAE (Dubai)",
    position: [25.2048, 55.2708],
    count: 5,
  },
];

export default function Map() {
  return (
    <MapContainer
      center={[20, 0]}   // 🌍 World view
      zoom={1.5}        // 🌍 Zoomed out for global view
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {members.map((member) => (
        <Marker
          key={member.id}
          position={member.position as [number, number]}
        >
          <Popup>
            <strong>{member.country}</strong>
            <br />
            {member.count} Members 👋
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
