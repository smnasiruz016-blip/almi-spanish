// Sitemap of the public surface. Core static pages + the Wave-2 origin surface
// (study-in-Spain / which-test / nationality × 196 origins). Still flat and well
// under the 50k limit; when the programme×origin and university×origin clusters
// land this returns to a chunked generateSitemaps() plan (Next 16 chunking pattern).

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { ORIGINS } from "@/lib/seo/origins";

export const revalidate = 86_400; // 1 day

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = ["", "/which-spanish-test", "/study-in-spain", "/pricing", "/login", "/signup"];

  const originPaths: string[] = [];
  for (const o of ORIGINS) {
    originPaths.push(`/study-in-spain/${o.slug}`);
    originPaths.push(`/which-spanish-test/${o.slug}`);
    originPaths.push(`/spanish-nationality/${o.slug}`);
  }

  return [...staticPaths, ...originPaths].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority:
      p === ""
        ? 1
        : p.startsWith("/study-in-spain/") || p.startsWith("/spanish-nationality/")
          ? 0.8
          : 0.7,
  }));
}
