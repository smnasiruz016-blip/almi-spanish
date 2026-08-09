import type { MetadataRoute } from "next";

const SITE_URL = "https://almispanish.almiworld.com";

// Deep per-origin long-tail leaves. Origin HUBS (/spanish-nationality/<origin>,
// /study-in-spain/<origin>, /which-spanish-test/<origin>) stay crawlable; only
// /from/ leaves are trimmed.
const DEEP_LEAVES = ["/program/*/from/", "/university/*/from/"];

const HEAVY_BOTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "anthropic-ai",
  "CCBot", "Bytespider", "Amazonbot", "PerplexityBot", "Google-Extended",
  "AhrefsBot", "SemrushBot", "MJ12bot", "DotBot", "DataForSeoBot", "PetalBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // HOLDING 2026-08-09 — DEEP_LEAVES now applies to Googlebot and Bingbot too; those routes no
      // longer render. Advisory only — the route config is what stops the ISR writes.
      { userAgent: ["Googlebot", "Bingbot"], allow: "/", disallow: ["/practice/", "/account", "/admin", "/api/", ...DEEP_LEAVES] },
      { userAgent: "*", allow: "/", disallow: ["/practice/", "/account", "/admin", "/api/", ...DEEP_LEAVES], crawlDelay: 10 },
      { userAgent: HEAVY_BOTS, disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap-index.xml`,
  };
}
