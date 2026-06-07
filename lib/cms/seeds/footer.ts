import type { SeedCollection } from "../types";

/** Footer "Get started" action links. */
export const FOOTER_ACTIONS: SeedCollection = {
  id: "footer.actions",
  items: [
    { _id: "contact", fields: { label: "Contact Us", href: "/contact-us" } },
    {
      _id: "whitepaper",
      fields: { label: "Read the whitepaper", href: "/whitepaper#read" },
    },
  ],
};
