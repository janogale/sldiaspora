export interface Schema {
    locations: TLocation[];
    home_page: THomePage;
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


export type THomePage = {
  id: string;
  hero_text: string;
  sub_hero_text: string;
}
