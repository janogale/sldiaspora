export interface MenuItem {
  label: string;
  path: string;

  children?: MenuItem[];
}

export const menuList: MenuItem[] = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "About",
    path: "#",
    children: [
      {
        label: "About the Diaspora Department",
        path: "/about",
      },
      {
        label: "Galleries",
        path: "/galleries",
      },
    ],
  },
  {
    label: "Services",
    path: "/#services",
  },
  {
    label: "Explore",
    path: "/investment",
  },
  {
    label: "Guidelines",
    path: "/guidlines",
    // children: [],
  },
  {
    label: "Events",
    path: "/events",
  },
  {
    label: "News",
    path: "/blogs",
  },
  {
    label: "Contact",
    path: "/contact",
  },
];
