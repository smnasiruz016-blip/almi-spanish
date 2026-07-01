// Sitemap index — lists every /sitemap/[id].xml chunk. Next 16 does not serve an
// index at /sitemap.xml when generateSitemaps() is used, so we emit a standard
// <sitemapindex> here and point robots.txt + GSC at /sitemap-index.xml.

import { SITE_URL } from "@/lib/site";
import { CHUNKS } from "@/lib/seo/sitemap-plan";

export const revalidate = 86_400; // 1 day

export function GET() {
  const items = Array.from(
    { length: CHUNKS },
    (_, id) => `<sitemap><loc>${SITE_URL}/sitemap/${id}.xml</loc></sitemap>`,
  ).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</sitemapindex>`;
  return new Response(xml, {
    headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=0, must-revalidate" },
  });
}
