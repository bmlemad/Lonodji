import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ADEB Lonodji",
    short_name: "ADEB Lonodji",
    description: "Engagement, transmission et action au service de la communauté.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f6f1",
    theme_color: "#173b2d",
    lang: "fr",
  };
}
