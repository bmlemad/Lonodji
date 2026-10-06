import type { MetadataRoute } from "next";

/* Manifeste d'application web : il sert à l'installation sur l'écran d'accueil
   et à l'appli Android (activité web de confiance, paquet org.lonodji.app),
   qui reprend ses raccourcis et ses icônes. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "ADEB LONODJI — peuple bedjond",
    short_name: "LONODJI",
    description:
      "Au service de tout le peuple bedjond, au Tchad et dans la diaspora : villages, thématiques, plaidoyers, journal. Les pages déjà ouvertes restent lisibles sans connexion.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "any",
    background_color: "#f4f6f1",
    theme_color: "#173b2d",
    lang: "fr",
    dir: "ltr",
    categories: ["education", "social", "news"],
    prefer_related_applications: false,
    icons: [
      { src: "/icones/icone-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icones/icone-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icones/icone-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Retrouver son village", short_name: "Villages", url: "/villages", icons: [{ src: "/icones/raccourci-villages.png", sizes: "96x96", type: "image/png" }] },
      { name: "Le journal", short_name: "Journal", url: "/journal", icons: [{ src: "/app/raccourci-journal.png", sizes: "96x96", type: "image/png" }] },
      { name: "Adhérer à l’association", short_name: "Adhérer", url: "/participer#adherer", icons: [{ src: "/app/raccourci-adherer.png", sizes: "96x96", type: "image/png" }] },
      { name: "Rechercher sur le site", short_name: "Rechercher", url: "/recherche", icons: [{ src: "/app/raccourci-rechercher.png", sizes: "96x96", type: "image/png" }] },
    ],
    // captures de la version actuelle (6 octobre 2026), montrées par le navigateur à l'installation
    screenshots: [
      { src: "/icones/capture-accueil.jpg", sizes: "1080x1920", type: "image/jpeg", form_factor: "narrow", label: "Accueil" },
      { src: "/icones/capture-villages.jpg", sizes: "1080x1920", type: "image/jpeg", form_factor: "narrow", label: "Retrouver son village" },
      { src: "/icones/capture-programmes.jpg", sizes: "1080x1920", type: "image/jpeg", form_factor: "narrow", label: "Six piliers stratégiques, vingt-deux thématiques" },
      { src: "/icones/capture-carte.jpg", sizes: "1080x1920", type: "image/jpeg", form_factor: "narrow", label: "Carte du territoire" },
      { src: "/icones/capture-ordinateur.jpg", sizes: "1280x800", type: "image/jpeg", form_factor: "wide", label: "Accueil sur ordinateur" },
    ],
  };
}
