import type { MetadataRoute } from "next";
import { getIndex } from "../lib/content";
import { PROGRAMMES, routeProgramme } from "../lib/odeb";
import { getVillages, routeVillage } from "../lib/villages";

const siteUrl = "https://lonodji.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const idx = getIndex();
  const fixed = ["/", "/mission", "/histoire", "/programmes", "/actions", "/impact", "/projets", "/journal", "/documents", "/dossiers", "/carte", "/villages", "/observatoire", "/bibliotheque", "/langue", "/diaspora", "/temoignages", "/odeb", "/odeb/livre-blanc", "/odeb/feuille-de-route", "/odeb/programmes", ...PROGRAMMES.map(routeProgramme), "/participer", "/presse", "/transparence", "/archives", "/mentions-legales", "/plan-du-site"];
  const entries: MetadataRoute.Sitemap = fixed.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: path === "/" || path === "/journal" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
  for (const p of idx.pages.filter((x) => x.kind === "dossier" || x.kind === "en")) {
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
  return entries;
}
