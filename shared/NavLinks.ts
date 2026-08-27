export interface NavLink {
  id: string;
  label: string;
  href: string;
  isActive?: boolean;
}

export const navLinks: NavLink[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    isActive: true,
  },
  {
    id: "fleet",
    label: "Fleet",
    href: "#fleet",
    isActive: false,
  },
  {
    id: "services",
    label: "Services",
    href: "#services",
    isActive: false,
  },
];
