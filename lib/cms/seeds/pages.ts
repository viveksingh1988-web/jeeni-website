import type { SeedCollection } from "../types";

export const WHATWEDO_STEPS: SeedCollection = {
  id: "whatwedo.steps",
  items: [
    { _id: "revenue", fields: { n: "01", title: "Revenue Growth", body: "Measure how AI drives new revenue: automated sales, personalized experiences, faster launches. Track the dollars earned—quarter over quarter growth you can bank on." } },
    { _id: "time", fields: { n: "02", title: "Time Reclaimed", body: "Quantify hours gained: 20+ per week on average. That's time your team invests in high-value work—strategy, relationships, growth. Calculate what that time is worth." } },
    { _id: "cost", fields: { n: "03", title: "Cost Optimization", body: "Identify efficiency gains: streamlined workflows, optimized processes, smarter resource allocation. Track every dollar saved and reinvest in growth initiatives." } },
  ],
};

export const CONTACT_POINTS: SeedCollection = {
  id: "contact.points",
  items: [
    { _id: "p1", fields: { text: "A genuine conversation about your AI opportunities." } },
    { _id: "p2", fields: { text: "We'll explore what's possible and what makes sense for your business." } },
    { _id: "p3", fields: { text: "Track revenue and savings from day one for clear ROI." } },
  ],
};

export const RESOURCES_STATS: SeedCollection = {
  id: "resources.stats",
  items: [
    { _id: "hours", fields: { value: "20+", label: "Hours reclaimed weekly" } },
    { _id: "roi", fields: { value: "312%", label: "Measured ROI uplift" } },
    { _id: "day", fields: { value: "Day 1", label: "Tracked from day" } },
  ],
};

export const WHITEPAPER_FINDINGS: SeedCollection = {
  id: "whitepaper.findings",
  items: [
    { _id: "hours", fields: { value: "20+", label: "Hours reclaimed weekly" } },
    { _id: "roi", fields: { value: "312%", label: "Measured ROI uplift" } },
    { _id: "rev", fields: { value: "$2.4M", label: "Revenue tracked" } },
  ],
};

export const WHITEPAPER_INSIDE: SeedCollection = {
  id: "whitepaper.inside",
  items: [
    { _id: "i1", fields: { text: "The real cost structure of AI adoption—what it takes to run, not just to buy." } },
    { _id: "i2", fields: { text: "How leaders track revenue and savings from day one for clear ROI." } },
    { _id: "i3", fields: { text: "A board-ready framework for measuring AI value across the business." } },
    { _id: "i4", fields: { text: "The ROI playbook from global business leaders at Davos 2026." } },
  ],
};
