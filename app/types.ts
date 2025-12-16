export interface RegionData {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  type: string;
  status: "online" | "maintenance";
}

export interface GlobeMarkerData extends RegionData {
  size: number;
  color: string;
  count?: number;
}
