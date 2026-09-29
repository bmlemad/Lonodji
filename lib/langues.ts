/* Correspondance des pages françaises et anglaises : sélecteur de langue contextuel et hreflang. */
export const FR_VERS_EN: Record<string, string> = {
  "/": "/en/index",
  "/mission": "/en/about",
  "/actions": "/en/advocacy",
  "/dossiers/bedjondo": "/en/bedjondo",
  "/participer": "/en/contact",
  "/programmes": "/en/themes",
  "/secteurs": "/en/sectors",
  "/bailleurs": "/en/donors",
  "/impact": "/en/impact",
  "/projets": "/en/projects",
  "/villages": "/en/villages",
  "/odeb": "/en/odeb",
};

export const EN_VERS_FR: Record<string, string> = Object.fromEntries(Object.entries(FR_VERS_EN).map(([fr, en]) => [en, fr]));

/** Page équivalente dans l'autre langue (accueil de l'autre langue à défaut). */
export function equivalent(chemin: string): { href: string; lang: "fr" | "en"; exact: boolean } {
  const c = chemin.replace(/\/$/, "") || "/";
  if (c.startsWith("/en")) {
    const fr = EN_VERS_FR[c];
    return { href: fr ?? "/", lang: "fr", exact: Boolean(fr) };
  }
  const en = FR_VERS_EN[c];
  return { href: en ?? "/en/index", lang: "en", exact: Boolean(en) };
}

/** alternates.languages pour les métadonnées Next (fr, en, x-default = fr). */
export function alternatesLangues(chemin: string): Record<string, string> | undefined {
  const c = chemin.replace(/\/$/, "") || "/";
  const fr = c.startsWith("/en") ? EN_VERS_FR[c] : (FR_VERS_EN[c] ? c : undefined);
  const en = fr ? FR_VERS_EN[fr] : undefined;
  if (!fr || !en) return undefined;
  return { fr, en, "x-default": fr };
}
