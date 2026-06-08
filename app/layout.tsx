import type { Metadata } from "next";
import { Lexend, Source_Sans_3, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd } from "@/components/json-ld";
import { EditProvider } from "@/components/cms/edit-context";
import { EditBar } from "@/components/cms/edit-bar";
import { MediaLibrary } from "@/components/cms/media-library";
import { PagesManager } from "@/components/cms/pages-manager";
import { MenuManager } from "@/components/cms/menu-manager";
import { ComponentPicker } from "@/components/cms/component-picker";
import { Analytics } from "@/components/analytics";
import { getStore } from "@/lib/cms/store";
import { cookies, headers } from "next/headers";
import { sessionValid, SESSION_COOKIE, isAdminEmail } from "@/lib/cms/auth";
import { auth as nextAuth } from "@/auth";

export const dynamic = "force-dynamic";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jeeniai.com"),
  title: {
    default: "Jeeni — We turn futurist research into measurable value",
    template: "%s | Jeeni",
  },
  description:
    "Jeeni tracks revenue and savings from day one for clear ROI. Stop asking what AI can do. Start asking what it costs—and what it earns.",
  applicationName: "Jeeni",
  keywords: [
    "AI ROI",
    "AI adoption cost",
    "measurable AI value",
    "AI consulting",
    "AI readiness",
    "AI audit",
    "workflow automation",
    "data analytics automation",
    "business consulting AI",
    "Davos 2026 AI",
  ],
  authors: [{ name: "Jeeni" }],
  creator: "Jeeni",
  publisher: "Jeeni LLC",
  category: "AI Consulting",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Jeeni",
    url: "https://jeeniai.com",
    locale: "en_US",
    title: "Jeeni — Measurable AI ROI",
    description:
      "We turn futurist research into measurable value. We track revenue and savings from day one for clear ROI.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeeni — Measurable AI ROI",
    description:
      "We turn futurist research into measurable value. Track revenue, time reclaimed, and cost optimization from day one.",
  },
};

const orgSchema = {
  "@type": "ProfessionalService",
  "@id": "https://jeeniai.com/#organization",
  name: "Jeeni",
  legalName: "Jeeni LLC",
  url: "https://jeeniai.com",
  slogan: "We turn futurist research into measurable value.",
  description:
    "Jeeni is an AI-ROI consulting firm. We measure what AI costs to run and what it returns—tracking revenue growth, time reclaimed, and cost optimization from day one.",
  image: "https://jeeniai.com/opengraph-image",
  logo: "https://jeeniai.com/opengraph-image",
  areaServed: "Global",
  knowsAbout: [
    "AI ROI",
    "AI adoption cost",
    "AI consulting",
    "AI readiness assessment",
    "workflow automation",
    "data analytics automation",
    "venture advisory",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "AI Services",
    itemListElement: [
      "AI Readiness & Strategy Roadmap",
      "Custom Solutions & Implementation",
      "Workflow Automation & Efficiency",
      "Data & Analytics Automation",
      "Content & Marketing Automation",
      "Venture Strategy & Advisory",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name },
    })),
  },
};

const websiteSchema = {
  "@type": "WebSite",
  "@id": "https://jeeniai.com/#website",
  url: "https://jeeniai.com",
  name: "Jeeni",
  description:
    "We turn futurist research into measurable value. Track revenue and savings from day one for clear ROI.",
  publisher: { "@id": "https://jeeniai.com/#organization" },
};

const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [orgSchema, websiteSchema],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const published = await getStore().getPublished();
  // Read the path set by middleware so we can suppress chrome on /studio.
  const hdrs = await headers();
  const currentPath = hdrs.get("x-current-path") ?? "";
  const isStudio = currentPath.startsWith("/studio");
  const isAdmin =
    sessionValid((await cookies()).get(SESSION_COOKIE)?.value) ||
    isAdminEmail((await nextAuth())?.user?.email);

  return (
    <html
      lang="en"
      className={`${lexend.variable} ${sourceSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Analytics />
        <JsonLd data={siteGraph} />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <EditProvider initial={published} isAdmin={isAdmin}>
          {!isStudio && <SiteHeader />}
          <main id="main-content" className="flex-1">
            {children}
          </main>
          {!isStudio && <SiteFooter />}
          <EditBar />
          <MediaLibrary />
          <PagesManager />
          <MenuManager />
          <ComponentPicker />
        </EditProvider>
      </body>
    </html>
  );
}
