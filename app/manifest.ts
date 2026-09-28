import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ADEB LONODJI",
    short_name: "ADEB LONODJI",
    description: "L’association de Bédjondo et de sa diaspora, gardienne du patrimoine bedjond.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f6f1",
    theme_color: "#173b2d",
    lang: "fr",
    icons: [
      { src: "/app/icone-192.png", sizes: "192x192", type: "image/png" },
      { src: "/app/icone-512.png", sizes: "512x512", type: "image/png" },
      { src: "/app/icone-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
