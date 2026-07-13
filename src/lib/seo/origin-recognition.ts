// Home-country recognition + search-vocabulary layer (AlmiWorld pSEO
// Localization Standard). Complements origins.ts (which localizes the Spain-side
// visa / DELE route per nationality). This adds the ORIGIN side: how a foreign
// degree is recognised back home, and the real terms that nationality searches
// with — all from the verified @smnasiruz016-blip/almi-data layer.

import { originContext } from "@smnasiruz016-blip/almi-data";

export type OriginStudyLocalization = {
  localized: boolean;
  recognitionBody: string;
  recognitionUrl?: string;
  equivalenceNote: string;
  commonConcern: string;
  searchTerms: string[];
  sourceNote?: string;
};

/** Never null — unresearched origins get an honest-generic, hedged block. */
export function resolveOriginStudy(originSlug: string, originName: string): OriginStudyLocalization {
  const loc = originContext(originSlug);
  if (loc) {
    return {
      localized: true,
      recognitionBody: loc.recognitionBody,
      recognitionUrl: loc.recognitionUrl,
      equivalenceNote: loc.equivalenceNote,
      commonConcern: loc.commonConcern.replace(/\s*[.?;]+\s*$/, "").trim(),
      searchTerms: loc.searchTerms,
      sourceNote: loc.sourceNote,
    };
  }
  return {
    localized: false,
    recognitionBody: `the official degree-recognition authority in ${originName}`,
    equivalenceNote: `If you plan to use a Spanish degree back in ${originName}, confirm how a foreign qualification is recognised with the relevant authority there before you rely on it.`,
    commonConcern: `how a foreign degree is recognised back in ${originName}`,
    searchTerms: [],
  };
}
