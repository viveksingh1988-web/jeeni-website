import type { SeedCollection } from "../types";

const IMG = "https://images.unsplash.com/photo-";

export const SERVICES_CARDS: SeedCollection = {
  id: "services.cards",
  items: [
    { _id: "roadmap", fields: { icon: "map", title: "AI Readiness & Strategy Roadmap", body: "Assess your readiness, audit your operations, and identify the highest-value opportunities. We deliver a clear implementation roadmap focused on profitable AI investments—not hype.", cta: "Get My Road Map", image: `${IMG}1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80` } },
    { _id: "custom", fields: { icon: "build", title: "Custom Solutions & Implementation", body: "We create a customized strategy aligned with your business goals. Through an AI audit we develop an actionable plan and build custom AI solutions for growth.", cta: "Build My Solution", image: `${IMG}1620712943543-bcc4688e7485?auto=format&fit=crop&w=900&q=80` } },
    { _id: "workflow", fields: { icon: "flow", title: "Workflow Automation & Efficiency", body: "We identify operational bottlenecks—repetitive emails, manual data entry, and slow reporting—and streamline them so your team moves faster.", cta: "Automate My Workflow", image: `${IMG}1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80` } },
    { _id: "data", fields: { icon: "chart", title: "Data & Analytics Automation", body: "Jeeni builds AI-powered systems that conduct an AI Audit to assess your AI Readiness and automatically analyze patterns in your data.", cta: "Automate my Analytics", image: `${IMG}1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80` } },
    { _id: "content", fields: { icon: "spark", title: "Content & Marketing Automation", body: "Scale your marketing with tailored AI solutions focused on performance—more output, sharper targeting, and measurable lift you can track.", cta: "Scale my Content", image: `${IMG}1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80` } },
    { _id: "venture", fields: { icon: "rocket", title: "Venture Strategy & Advisory", body: "Valley-rooted advisory that shows you how to build lean and fast with a focus on AI readiness.", cta: "Launch My Venture", image: `${IMG}1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80` } },
  ],
};

export const SERVICES_FAQ: SeedCollection = {
  id: "services.faq",
  items: [
    { _id: "begin", fields: { q: "Where do we begin?", a: "Every engagement starts with an AI audit and readiness assessment. We map your operations, identify the highest-value opportunities, and hand you a clear, prioritized roadmap—so you invest in what actually drives profit." } },
    { _id: "custom", fields: { q: "Do you build custom solutions or use off-the-shelf tools?", a: "Both. We design automated workflows using proven, off-the-shelf tools where they fit, and build custom AI solutions where they create a real edge—always aligned to your business goals." } },
    { _id: "automate", fields: { q: "Can you automate our existing workflows?", a: "Yes. We target operational bottlenecks—repetitive emails, manual data entry, slow reporting—and streamline them so your team moves faster and reclaims hours every week." } },
    { _id: "prove", fields: { q: "How do you prove it's working?", a: "We track every dollar earned and saved from day one—revenue growth, time reclaimed, and cost optimization—so the return is measurable, not theoretical." } },
  ],
};
