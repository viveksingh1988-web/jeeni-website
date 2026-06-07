/* Shared palette of built-in block types used by both the page builder
   (add-section panel) and the component picker side panel. Pure data — no JSX. */

const STOCK = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80";
const AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80";
const IMG2 = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80";
const IMG3 = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80";
const IMG4 = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80";

export type PaletteItem = {
  type: string;
  label: string;
  category: string;
  desc: string;
  fields: () => Record<string, string>;
};

export const PALETTE_CATEGORIES = ["Headers", "Content", "Media", "Social proof", "Conversion", "Layout"] as const;

export const PALETTE: PaletteItem[] = [
  // ── Headers ──────────────────────────────────────────────────────────────
  {
    type: "hero", label: "Hero", category: "Headers", desc: "Full-width hero with image, headline and CTAs",
    fields: () => ({ type: "hero", eyebrow: "Eyebrow", title: "A bold hero headline", subtitle: "A clear supporting sentence that explains the value.", cta1: "Get started", cta1href: "/contact-us", cta2: "Learn more", cta2href: "#", image: STOCK }),
  },
  {
    type: "hero-gradient", label: "Gradient Hero", category: "Headers", desc: "Bold hero with animated gradient overlay",
    fields: () => ({ type: "hero-gradient", eyebrow: "Trusted by 500+ companies", title: "Ship faster.", gradient: "than ever before.", subtitle: "The modern way to build and launch products. Beautiful components, zero config.", cta1: "Start for free", cta1href: "/contact-us", cta2: "View demo →", cta2href: "#" }),
  },
  {
    type: "heading", label: "Section Heading", category: "Headers", desc: "Eyebrow, title and subtitle",
    fields: () => ({ type: "heading", eyebrow: "Eyebrow", title: "Section heading", subtitle: "A supporting line of text." }),
  },

  // ── Content ──────────────────────────────────────────────────────────────
  {
    type: "paragraph", label: "Text Block", category: "Content", desc: "Rich text paragraph",
    fields: () => ({ type: "paragraph", text: "Write your paragraph here." }),
  },
  {
    type: "columns", label: "Text + Image", category: "Content", desc: "Two-column layout with image and text",
    fields: () => ({ type: "columns", title: "Title", body: "Describe this here.", image: STOCK }),
  },
  {
    type: "feature-bento", label: "Feature Bento Grid", category: "Content", desc: "Bento grid layout with 4 feature cards",
    fields: () => ({ type: "feature-bento", heading: "Everything you need to ship", f1title: "Lightning fast", f1body: "Built for performance from the ground up.", f1icon: "bolt", f2title: "Secure by default", f2body: "Enterprise-grade security out of the box.", f2icon: "shield", f3title: "Scales with you", f3body: "From startup to enterprise without limits.", f3icon: "layers", f4title: "Analytics built in", f4body: "Real-time insights on everything.", f4icon: "chart" }),
  },
  {
    type: "features3", label: "3 Features", category: "Content", desc: "Three feature cards with icons",
    fields: () => ({ type: "features3", heading: "Why choose us", f1icon: "spark", f1title: "Feature one", f1body: "Short description of this feature.", f2icon: "bolt", f2title: "Feature two", f2body: "Short description of this feature.", f3icon: "shield", f3title: "Feature three", f3body: "Short description of this feature." }),
  },
  {
    type: "timeline", label: "Timeline", category: "Content", desc: "Step-by-step process timeline",
    fields: () => ({ type: "timeline", heading: "How it works", t1label: "Step 1", t1title: "Discovery", t1body: "We map your operations and surface the highest-value opportunities.", t2label: "Step 2", t2title: "Strategy", t2body: "A prioritised roadmap of profitable AI investments.", t3label: "Step 3", t3title: "Implementation", t3body: "We build and deploy, measuring returns from day one.", t4label: "Step 4", t4title: "Ongoing ROI", t4body: "Continuous tracking of revenue, time reclaimed, and costs saved." }),
  },
  {
    type: "steps", label: "Process Steps", category: "Content", desc: "Numbered process steps",
    fields: () => ({ type: "steps", heading: "How it works", s1n: "01", s1t: "Discover", s1b: "We assess and map opportunities.", s2n: "02", s2t: "Build", s2b: "We implement the solution.", s3n: "03", s3t: "Measure", s3b: "We track the return." }),
  },
  {
    type: "pricing", label: "Pricing Table", category: "Content", desc: "3-tier pricing with features list",
    fields: () => ({ type: "pricing", heading: "Simple, transparent pricing", subheading: "Choose the plan that works for your team.", p1name: "Starter", p1price: "$0", p1period: "/month", p1desc: "Perfect for small teams just getting started.", p1cta: "Get started", p1href: "/contact-us", p1f1: "5 projects", p1f2: "Basic analytics", p1f3: "Email support", p2name: "Pro", p2price: "$49", p2period: "/month", p2desc: "For growing teams that need more power.", p2cta: "Start free trial", p2href: "/contact-us", p2popular: "true", p2f1: "Unlimited projects", p2f2: "Advanced analytics", p2f3: "Priority support", p2f4: "Custom integrations", p3name: "Enterprise", p3price: "Custom", p3period: "", p3desc: "For large organisations with complex needs.", p3cta: "Contact sales", p3href: "/contact-us", p3f1: "Everything in Pro", p3f2: "Dedicated support", p3f3: "SLA guarantee", p3f4: "Custom contracts" }),
  },
  {
    type: "team", label: "Team Grid", category: "Content", desc: "Team member cards with bios",
    fields: () => ({ type: "team", heading: "Meet the team", subheading: "The people behind the product.", m1name: "Alex Rivera", m1role: "Co-founder & CEO", m1bio: "10+ years in AI and product strategy.", m1img: IMG4, m2name: "Sam Chen", m2role: "Head of Engineering", m2bio: "Previously at Google DeepMind.", m2img: IMG4, m3name: "Jordan Lee", m3role: "Head of Design", m3bio: "Crafting beautiful, functional interfaces.", m3img: IMG4 }),
  },
  {
    type: "stats", label: "Stats", category: "Content", desc: "Three metric stats with labels",
    fields: () => ({ type: "stats", v1: "100+", l1: "Metric one", v2: "50%", l2: "Metric two", v3: "24/7", l3: "Metric three" }),
  },
  {
    type: "quote", label: "Pull Quote", category: "Content", desc: "Highlighted quote with attribution",
    fields: () => ({ type: "quote", text: "An impactful quote goes here.", author: "Attribution" }),
  },
  {
    type: "faq-21", label: "FAQ Accordion", category: "Content", desc: "Expandable FAQ section",
    fields: () => ({ type: "faq-21", heading: "Frequently asked questions", q1: "How does it work?", a1: "Our platform uses AI to analyse your operations and surface the highest-value opportunities.", q2: "Is there a free trial?", a2: "Yes, you can get started for free with no credit card required.", q3: "Can I cancel anytime?", a3: "Absolutely. Cancel whenever you like with no penalties.", q4: "How is my data handled?", a4: "We use enterprise-grade encryption and are fully GDPR compliant." }),
  },

  // ── Media ─────────────────────────────────────────────────────────────────
  {
    type: "image", label: "Image", category: "Media", desc: "Single full-width image",
    fields: () => ({ type: "image", src: STOCK, alt: "Image" }),
  },
  {
    type: "image-mosaic", label: "Image Mosaic", category: "Media", desc: "3-image mosaic layout",
    fields: () => ({ type: "image-mosaic", heading: "Visual showcase", i1: STOCK, i2: IMG2, i3: IMG3, i4: STOCK }),
  },
  {
    type: "gallery", label: "Gallery Grid", category: "Media", desc: "6-image grid gallery",
    fields: () => ({ type: "gallery", heading: "Gallery", g1: STOCK, g2: IMG2, g3: IMG3, g4: STOCK, g5: IMG2, g6: IMG3 }),
  },
  {
    type: "video", label: "Video Embed", category: "Media", desc: "YouTube or Vimeo video embed",
    fields: () => ({ type: "video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }),
  },

  // ── Social proof ─────────────────────────────────────────────────────────
  {
    type: "logos", label: "Logo Cloud", category: "Social proof", desc: "Partner or client logo strip",
    fields: () => ({ type: "logos", heading: "Trusted by teams everywhere", l1: STOCK, l2: IMG2, l3: IMG3, l4: STOCK, l5: IMG2 }),
  },
  {
    type: "testimonial", label: "Testimonial", category: "Social proof", desc: "Single testimonial with avatar",
    fields: () => ({ type: "testimonial", quote: "This made a measurable difference to our business.", author: "Jane Doe", role: "VP, Operations", avatar: AVATAR }),
  },
  {
    type: "testimonials-3", label: "3 Testimonials", category: "Social proof", desc: "Three testimonial cards",
    fields: () => ({ type: "testimonials-3", heading: "Loved by teams everywhere", t1q: "Absolutely transformed how we work.", t1a: "Sarah K.", t1r: "CTO, Acme Corp", t1img: AVATAR, t2q: "The ROI was visible within weeks.", t2a: "Marcus L.", t2r: "COO, FinScale", t2img: AVATAR, t3q: "Exceptional quality and support.", t3a: "Priya M.", t3r: "Director, NovaTech", t3img: AVATAR }),
  },

  // ── Conversion ───────────────────────────────────────────────────────────
  {
    type: "cta", label: "Call to Action", category: "Conversion", desc: "Dark CTA section with button",
    fields: () => ({ type: "cta", heading: "Ready to start?", body: "A short supporting line.", button: "Get in touch", href: "/contact-us" }),
  },
  {
    type: "cta-split", label: "Split CTA", category: "Conversion", desc: "Half text, half image CTA block",
    fields: () => ({ type: "cta-split", heading: "Start measuring your AI ROI today.", body: "Join forward-thinking companies already tracking revenue, reclaiming time, and reducing cost with Jeeni.", cta1: "Book a call", cta1href: "/contact-us", cta2: "Read the research", cta2href: "/resources", image: STOCK }),
  },
  {
    type: "newsletter", label: "Newsletter", category: "Conversion", desc: "Email newsletter signup form",
    fields: () => ({ type: "newsletter", heading: "Stay ahead of the curve", body: "Get the latest AI ROI research and insights direct to your inbox.", placeholder: "Enter your email", button: "Subscribe" }),
  },
  {
    type: "banner", label: "Banner", category: "Conversion", desc: "Announcement banner with CTA",
    fields: () => ({ type: "banner", text: "Announce something important here.", button: "Take action", href: "/contact-us" }),
  },

  // ── Layout ────────────────────────────────────────────────────────────────
  {
    type: "divider", label: "Divider", category: "Layout", desc: "Horizontal divider line",
    fields: () => ({ type: "divider" }),
  },
  {
    type: "spacer", label: "Spacer", category: "Layout", desc: "Vertical spacing block",
    fields: () => ({ type: "spacer", size: "md" }),
  },
];
