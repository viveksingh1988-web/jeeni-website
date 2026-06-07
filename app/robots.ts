import type { MetadataRoute } from "next";

const BASE = "https://jeeniai.com";

/* Explicitly welcome AI answer-engine crawlers so the site can be indexed
   and cited by ChatGPT/SearchGPT, Perplexity, Gemini, Claude, and others. */
const AI_BOTS = [
  "GPTBot", // OpenAI training
  "OAI-SearchBot", // ChatGPT search index
  "ChatGPT-User", // ChatGPT live browsing
  "ClaudeBot", // Anthropic
  "anthropic-ai",
  "Claude-Web",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended", // Gemini / Vertex
  "Applebot-Extended",
  "CCBot", // Common Crawl (feeds many models)
  "Amazonbot",
  "Bytespider",
  "cohere-ai",
  "Diffbot",
  "Meta-ExternalAgent",
  "Timpibot",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] },
      { userAgent: AI_BOTS, allow: "/", disallow: ["/studio", "/api/"] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
