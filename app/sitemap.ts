import type { MetadataRoute } from "next";

const siteUrl = "https://lonodji.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/mission", "/histoire", "/programmes", "/actions", "/impact", "/participer", "/transparence"];
  return routes.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
