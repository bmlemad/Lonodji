import type { MetadataRoute } from "next";
import { getIndex } from "../lib/content";

const siteUrl = "https://lonodji.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const idx = getIndex();
  const fixed = ["/", "/mission", "/histoire", "/programmes", "/actions", "/impact", "/journal", "/documents", "/dossiers", "/carte", "/participer", "/transparence", "/archives", "/mentions-legales", "/plan-du-site"];
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
  return entries;
}
