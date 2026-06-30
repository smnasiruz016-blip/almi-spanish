// Static sitemap of the core public pages. The large programmatic-SEO surface
// (study-in-Spain / origin pages) is a later wave, rebuilt on Spanish data; when
// it lands this returns to a chunked generateSitemaps() plan.

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const revalidate = 86_400; // 1 day

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = ["", "/which-spanish-test", "/pricing", "/login", "/signup"];
  return paths.map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
}
