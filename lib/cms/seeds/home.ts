import type { SeedCollection } from "../types";

export const HOME_MEASURE: SeedCollection = {
  id: "home.measure",
  items: [
    { _id: "revenue", fields: { title: "Revenue earned", body: "New income from automated sales, personalized experiences, and faster launches—tracked in dollars." } },
    { _id: "hours", fields: { title: "Hours reclaimed", body: "20+ hours per week, on average, returned to high-value strategic work." } },
    { _id: "cost", fields: { title: "Cost optimized", body: "Streamlined workflows and smarter resource allocation, measured dollar for dollar." } },
    { _id: "readiness", fields: { title: "AI readiness", body: "A clear audit of where you stand and the highest-value places to start." } },
    { _id: "efficiency", fields: { title: "Workflow efficiency", body: "Bottlenecks removed—repetitive email, manual data entry, slow reporting." } },
    { _id: "insight", fields: { title: "Strategic insight", body: "Research-backed direction from global business leaders at Davos 2026." } },
  ],
};

export const HOME_PRINCIPLES: SeedCollection = {
  id: "home.principles",
  items: [
    { _id: "p1", fields: { quote: "Stop asking what AI can do. Start asking what it costs—and what it earns.", label: "The Jeeni principle" } },
    { _id: "p2", fields: { quote: "We track revenue and savings from day one for clear ROI.", label: "Measurement" } },
    { _id: "p3", fields: { quote: "Most businesses fail at AI because they begin with tools instead of problems.", label: "Why audits first" } },
    { _id: "p4", fields: { quote: "20+ hours reclaimed per week your team reinvests in growth.", label: "Time reclaimed" } },
    { _id: "p5", fields: { quote: "Rooted in insight. Powered by research.", label: "Our approach" } },
    { _id: "p6", fields: { quote: "Measure the cost. Measure the return. Bank the difference.", label: "Clear ROI" } },
  ],
};

export const HOME_SLIDES: SeedCollection = {
  id: "home.slides",
  items: [
    { _id: "s1", fields: { image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80", eyebrow: "Financial Services", title: "Real-time ROI visibility", text: "Track revenue and savings as they happen—numbers your board can trust, quarter over quarter." } },
    { _id: "s2", fields: { image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80", eyebrow: "Professional Services", title: "Hours reclaimed, value created", text: "20+ hours a week back for your team to invest in strategy, relationships, and growth." } },
    { _id: "s3", fields: { image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1600&q=80", eyebrow: "Retail & E-commerce", title: "Personalized at scale", text: "Automated sales and tailored experiences that drive measurable new revenue." } },
    { _id: "s4", fields: { image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80", eyebrow: "Operations", title: "Workflows, optimized", text: "Streamline repetitive work, cut waste, and reinvest every dollar saved into growth." } },
  ],
};

export const HOME_MARQUEE: SeedCollection = {
  id: "home.marquee",
  items: [
    { _id: "m1", fields: { text: "Measurable ROI" } },
    { _id: "m2", fields: { text: "Revenue Growth" } },
    { _id: "m3", fields: { text: "Time Reclaimed" } },
    { _id: "m4", fields: { text: "Cost Optimization" } },
    { _id: "m5", fields: { text: "Day-One Tracking" } },
    { _id: "m6", fields: { text: "Davos 2026 Research" } },
    { _id: "m7", fields: { text: "Rooted in Insight" } },
    { _id: "m8", fields: { text: "Powered by Research" } },
  ],
};

export const HOME_FAQ: SeedCollection = {
  id: "home.faq",
  items: [
    { _id: "f1", fields: { q: "How do you actually measure AI ROI?", a: "We instrument every initiative from day one—tracking new revenue, hours reclaimed, and costs optimized. You get a clear number, quarter over quarter, not a vague promise." } },
    { _id: "f2", fields: { q: "How quickly do we see results?", a: "Most teams reclaim 20+ hours per week within the first engagement. Because we start with an AI audit and target the highest-value workflows, value shows up fast and compounds." } },
    { _id: "f3", fields: { q: "What if we're not sure we're ‘AI-ready’?", a: "That's exactly where we start. Our AI Readiness assessment and audit map your operations and surface the opportunities worth pursuing—before you spend on tools." } },
    { _id: "f4", fields: { q: "How is Jeeni different from typical AI consultants?", a: "We don't sell capability for its own sake. We measure what AI costs to run and what it returns. Stop asking what AI can do; start asking what it costs—and what it earns." } },
    { _id: "f5", fields: { q: "Which industries do you work with?", a: "Nearly every sector benefits, but data- and customer-interaction-heavy industries—retail, hospitality, financial and professional services—see immediate gains from automation and analytics." } },
  ],
};
