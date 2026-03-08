export interface Schema {
  locations: TLocation[];
  home_page: THomePage;
  articles: TArticle[];
  events: TEvent[];
  event: TEvent[];
  diaspora_events: TEvent[];
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

export type TEvent = {
  id: string | number;
  title?: string;
  Title?: string;
  name?: string;
  event_title?: string;
  event_name?: string;
  description?: string;
  content?: string;
  details?: string;
  location?: string;
  venue?: string;
  address?: string;
  datetime?: string;
  event_date?: string;
  date?: string;
  time?: string;
  mainImg?: string | { id?: string } | null;
  main_image?: string | { id?: string } | null;
  featured_image?: string | { id?: string } | null;
  image?: string | { id?: string } | null;
  date_created?: string;
  date_updated?: string;
  [key: string]: unknown;
};
