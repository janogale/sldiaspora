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
    path: "/about",
  },
  {
    label: "Guidelines",
    path: "/guidelines",
    children: [],
  },
  {
    label: "Events",
    path: "/events",
  },
  {
    label: "News",
    path: "/news",
  },
  {
    label: "Contact",
    path: "/contact",
  },
];
