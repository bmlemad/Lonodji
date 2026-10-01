import type { MetadataRoute } from "next";
import { getIndex } from "@/lib/content";
import { alternatesLangues } from "@/lib/langues";
import { PROGRAMMES, routeProgramme } from "@/lib/odeb";
import { getVillages, routeVillage } from "@/lib/villages";

const siteUrl = "https://lonodji.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const idx = getIndex();
  const fixed = ["/", "/mission", "/histoire", "/programmes", "/programmes/fiches-de-mission", "/secteurs", "/bailleurs", "/territoire", "/territoire/propositions-commune", "/territoire/sous-sol", "/association/propositions-organisation", "/en/subsoil", "/en/governance", "/territoire/gouvernance-locale", "/patrimoine", "/projets/bedjondo-transport-logistique", "/en/sectors", "/en/donors", "/en/commune", "/actions", "/impact", "/projets", "/journal", "/documents", "/dossiers", "/carte", "/villages", "/observatoire", "/bibliotheque", "/langue", "/diaspora", "/temoignages", "/odeb", "/en/odeb", "/en/villages", "/en/projects", "/en/impact", "/odeb/livre-blanc", "/odeb/feuille-de-route", "/odeb/programmes", "/odeb/identite", ...PROGRAMMES.map(routeProgramme), "/participer", "/presse", "/transparence", "/transparence/decisions", "/lettre", "/archives", "/accessibilite", "/mentions-legales", "/plan-du-site"];
  const entries: MetadataRoute.Sitemap = fixed.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: path === "/" || path === "/journal" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
  for (const p of idx.pages.filter((x) => (x.kind === "dossier" || x.kind === "en") && x.slug !== "air-bedjondo")) {
    entries.push({ url: new URL(p.route, siteUrl).toString(), changeFrequency: "monthly", priority: 0.5 });
  }
  for (const a of idx.articles) {
    entries.push({ url: new URL(a.route, siteUrl).toString(), lastModified: a.date ? new Date(a.date) : undefined, changeFrequency: "yearly", priority: 0.5 });
  }
  const villages = getVillages();
  for (const id of Object.keys(villages.unites)) {
    entries.push({ url: new URL(`/villages/${id}`, siteUrl).toString(), changeFrequency: "monthly", priority: 0.5 });
  }
  for (const v of villages.villages) {
    entries.push({ url: new URL(routeVillage(v), siteUrl).toString(), changeFrequency: "monthly", priority: 0.3 });
  }
  // paires français / anglais (lib/langues.ts) : hreflang dans le plan du site, adresses absolues
  const vus = new Set<string>();
  return entries.filter((e) => (vus.has(e.url) ? false : (vus.add(e.url), true))).map((e) => {
    const langues = alternatesLangues(new URL(e.url).pathname);
    return langues ? { ...e, alternates: { languages: Object.fromEntries(Object.entries(langues).map(([l, chemin]) => [l, new URL(chemin, siteUrl).toString()])) } } : e;
  });
}
