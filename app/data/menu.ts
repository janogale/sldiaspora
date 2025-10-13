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
    label: "Department Structure",
    path: "/department-structure",
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
