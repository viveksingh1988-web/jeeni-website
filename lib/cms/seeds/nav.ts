import type { SeedCollection } from "../types";

/** Primary navigation links (navbar + footer share these). */
export const NAV_LINKS: SeedCollection = {
  id: "nav.links",
  items: [
    { _id: "what-we-do", fields: { label: "What we do", href: "/what-we-do" } },
    { _id: "services", fields: { label: "Services", href: "/services" } },
    { _id: "blog", fields: { label: "Blog", href: "/blog" } },
    { _id: "resources", fields: { label: "Resources", href: "/resources" } },
    { _id: "contact", fields: { label: "Contact Us", href: "/contact-us" } },
  ],
};
