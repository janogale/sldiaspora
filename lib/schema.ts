export interface Schema {
    locations: TLocation[];
}

export type TLocation = {
  id: string;
  member: string;
  map: {
    type: "Point"; 
    coordinates: [number, number]; /** [longitude, latitude] */
  };

  city: string;
  country: string;
};
