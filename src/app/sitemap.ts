// Chunked sitemap for the full Wave-2 surface. Under Google's 50k-per-file cap.
//
// CRITICAL (Next 16): `id` arrives as Promise<string> — must be awaited + Number()'d,
// or every chunk silently emits 0 URLs. See docs/SITEMAP_CHUNKING.md. Test only with a
// real `npm run build` + production server, never direct function invocation.

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { ORIGINS } from "@/lib/seo/origins";
import { CHUNK, N, UNIS, PROGS, uniChunks, CHUNKS } from "@/lib/seo/sitemap-plan";

export const revalidate = false;

export async function generateSitemaps() {
  return Array.from({ length: CHUNKS }, (_, i) => ({ id: i }));
}

function entry(path: string, priority = 0.6): MetadataRoute.Sitemap[number] {
  return { url: `${SITE_URL}${path}`, changeFrequency: "weekly", priority };
}

// Slice a (destinations × origins) product space by global index, without
// materialising the full list.
function productSlice<T extends { slug: string }>(
  list: T[],
  lo: number,
  hi: number,
  make: (item: T, originSlug: string) => string,
): MetadataRoute.Sitemap {
  const end = Math.min(hi, list.length * N);
  const out: MetadataRoute.Sitemap = [];
  for (let gi = lo; gi < end; gi++) {
    const item = list[Math.floor(gi / N)];
    const origin = ORIGINS[gi % N];
    out.push(entry(make(item, origin.slug), 0.5));
  }
  return out;
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const idNum = Number(await id);

  // Chunk 0 — statics, hubs, and all base (non-origin) pages.
  if (idNum === 0) {
    const out: MetadataRoute.Sitemap = [
      entry("", 1),
      entry("/which-spanish-test", 0.7),
      entry("/study-in-spain", 0.8),
      entry("/universities", 0.7),
      entry("/programs", 0.7),
      entry("/pricing", 0.6),
      entry("/signup", 0.5),
      entry("/login", 0.4),
    ];
    for (const o of ORIGINS) {
      out.push(entry(`/study-in-spain/${o.slug}`, 0.8));
      out.push(entry(`/which-spanish-test/${o.slug}`, 0.7));
      out.push(entry(`/spanish-nationality/${o.slug}`, 0.8));
    }
    for (const u of UNIS) out.push(entry(`/university/${u.slug}`, 0.6));
    for (const p of PROGS) out.push(entry(`/program/${p.slug}`, 0.6));
    return out;
  }

  // University × origin chunks.
  if (idNum <= uniChunks) {
    const k = idNum - 1;
    return productSlice(UNIS, k * CHUNK, (k + 1) * CHUNK, (u, o) => `/university/${u.slug}/from/${o}`);
  }

  // Programme × origin chunks.
  const k = idNum - 1 - uniChunks;
  return productSlice(PROGS, k * CHUNK, (k + 1) * CHUNK, (p, o) => `/program/${p.slug}/from/${o}`);
}
