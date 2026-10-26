// Sitemap (one chunk, served at /sitemap/0.xml; the index is app/sitemap-index.xml/route.ts).
//
// CRITICAL (Next 16): `id` arrives as Promise<string> — must be awaited even though only
// chunk 0 exists. See docs/SITEMAP_CHUNKING.md.
//
// COST FIX 26 Oct 2026 — every programmatic family was removed (owner ruling 17 Oct: deleted,
// no redirects) and answers 410 Gone from src/proxy.ts: /program/*, /university/*,
// /study-in-spain/<origin>, /which-spanish-test/<origin>, /spanish-nationality/*. Only the
// kept pages are listed.

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const revalidate = false;

export async function generateSitemaps() {
  return [{ id: 0 }];
}

function entry(path: string, priority = 0.6): MetadataRoute.Sitemap[number] {
  return { url: `${SITE_URL}${path}`, changeFrequency: "weekly", priority };
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  void (await id);
  return [
    entry("", 1),
    entry("/which-spanish-test", 0.7),
    entry("/study-in-spain", 0.8),
    entry("/universities", 0.7),
    entry("/programs", 0.7),
    entry("/pricing", 0.6),
    entry("/signup", 0.5),
    entry("/login", 0.4),
  ];
}
