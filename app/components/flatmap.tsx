// app/components/map.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "@/lib/leafletIconFix";
import {readItems } from '@directus/sdk';
import client from "@/lib/directus";
import { TLocation } from "@/lib/schema";
import React from "react";

export default function Map() {


  const [locations, setLocations] = React.useState<TLocation[]>([]);

  React.useEffect(() => {
  // read locations from directus
    const fetchLocations = async () => {
      const locations = await client.request<TLocation[]>(readItems("locations", {
        fields: ["id", "member", "map", "city", "country"],
      }));

      setLocations(locations);
    };

    fetchLocations();
  }, []);

  console.log("Locations from Directus:", locations);

  // group locations by country and count members per country, 
  const countryMemberCount = locations.reduce((acc, location) => {
    if (!acc[location.country]) {
      acc[location.country] = {
        count: 0,
        coordinates: location.map.coordinates,
      };
    }
    acc[location.country].count += 1;
    return acc;
  }, {} as Record<string, { count: number; coordinates: [number, number] }>);

  console.log("Country Member Count:", countryMemberCount);

  return (
    <MapContainer
      center={[20, 0]}   // 🌍 World view
      zoom={1.5}        // 🌍 Zoomed out for global view
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; <a href=&quot;https://sldiaspor.org/&quot;>Somaliland</a> Diaspora"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {Object.entries(countryMemberCount).map(([country, data]) => (
        <Marker
          key={country}
          position={[data.coordinates[1], data.coordinates[0]]} // [latitude, longitude]
        >
          <Popup>
            <strong>{country}</strong>
            <br />
            {data.count} Members 👋
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
