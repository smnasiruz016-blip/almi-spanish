// Shared sitemap chunk plan — used by both app/sitemap.ts (chunk generation) and
// app/sitemap-index.xml/route.ts (the index). Next 16 does not serve an index at
// /sitemap.xml when generateSitemaps() is used, so the index route lists these chunks.

import { ORIGINS } from "@/lib/seo/origins";
import { UNIVERSITIES } from "@/lib/seo/universities";
import { PROGRAMMES, isIndexableProgramme } from "@/lib/seo/programmes";

export const CHUNK = 40_000;
export const N = ORIGINS.length; // origins per destination

// Indexable destination sets (noindex/dated rows excluded from the sitemap).
export const UNIS = UNIVERSITIES.filter((u) => u.verified);
export const PROGS = PROGRAMMES.filter(isIndexableProgramme);

export const uniChunks = Math.ceil((UNIS.length * N) / CHUNK);
export const progChunks = Math.ceil((PROGS.length * N) / CHUNK);

// Total sitemap files: chunk 0 (statics + bases) + uni×origin chunks + programme×origin chunks.
export const CHUNKS = 1 + uniChunks + progChunks;
