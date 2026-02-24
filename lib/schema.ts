export interface Schema {
    locations: TLocation[];
    home_page: THomePage;
  articles: TArticle[];
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

export type TArticle = {
  id: string | number;
  Title?: string;
  content?: string;
  featured_image?: string | { id?: string } | null;
  date_created?: string;
  date_updated?: string;
  [key: string]: unknown;
};
