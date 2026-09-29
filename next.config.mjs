/** @type {import('next').NextConfig} */
const nextConfig = {
  // les brouillons (arabes notamment) ne doivent jamais être embarqués dans les fonctions serveur
  outputFileTracingExcludes: { "*": ["content/brouillons/**"] },
  reactStrictMode: true,
  experimental: { globalNotFound: true },
  poweredByHeader: false,
  async redirects() {
    // Adresses de la première version du site (septembre 2026) : conservées pour les liens déjà partagés.
    return [
      // doublons : pages de la première version servies aussi sous /dossiers/ (audit des doublons du 29/09/2026)
      { source: "/dossiers/mission", destination: "/mission", permanent: true },
      { source: "/dossiers/poles", destination: "/programmes", permanent: true },
      { source: "/dossiers/plaidoyers", destination: "/actions", permanent: true },
      { source: "/dossiers/suivi", destination: "/impact", permanent: true },
      { source: "/dossiers/redevabilite", destination: "/transparence", permanent: true },
      { source: "/dossiers/documents", destination: "/documents", permanent: true },
      { source: "/dossiers/soutenir", destination: "/participer#soutenir", permanent: true },
      { source: "/dossiers/adherer", destination: "/participer#adherer", permanent: true },
      { source: "/dossiers/contact", destination: "/participer#contact", permanent: true },
      { source: "/dossiers/actualites", destination: "/journal", permanent: true },
      { source: "/dossiers/figures", destination: "/histoire#figures", permanent: true },
      {
        // adresse devinée couramment (revue du 29/09/2026)
        source: "/thematiques",
        destination: "/programmes",
        permanent: true,
      },
      {
        // adresse devinée couramment (revue du 29/09/2026)
        source: "/newsletter",
        destination: "/lettre",
        permanent: true,
      },
      {
        // adresse devinée couramment (revue du 29/09/2026)
        source: "/don",
        destination: "/participer#soutenir",
        permanent: true,
      },
      {
        // adresse devinée couramment (revue du 29/09/2026)
        source: "/dons",
        destination: "/participer#soutenir",
        permanent: true,
      },
      {
        // adresse devinée couramment (revue du 29/09/2026)
        source: "/partenaires",
        destination: "/dossiers/ong-partenaires",
        permanent: true,
      },
      {
        // adresse devinée couramment (revue du 29/09/2026)
        source: "/equipe",
        destination: "/mission",
        permanent: true,
      },
      {
        // adresse devinée couramment (revue du 29/09/2026)
        source: "/bureau",
        destination: "/mission",
        permanent: true,
      },
      {
        // adresse devinée couramment (revue du 29/09/2026)
        source: "/statuts",
        destination: "/documents",
        permanent: true,
      },
      {
        // adresse devinée couramment (revue du 29/09/2026)
        source: "/decisions",
        destination: "/transparence/decisions",
        permanent: true,
      },
      {
        // adresse devinée couramment (revue du 29/09/2026)
        source: "/secteurs-intervention",
        destination: "/secteurs",
        permanent: true,
      },
      {
        // adresse devinée couramment (revue du 29/09/2026)
        source: "/en/press",
        destination: "/en/contact",
        permanent: true,
      },
      {
        // adresse devinée couramment (revue du 29/09/2026)
        source: "/en/donate",
        destination: "/en/contact",
        permanent: true,
      },
      {
        // adresse devinée couramment (revue du 29/09/2026)
        source: "/en/sectors-of-intervention",
        destination: "/en/sectors",
        permanent: true,
      },

      {
            source: "/index.html",
            destination: "/",
            permanent: true
      },
      {
            source: "/poles",
            destination: "/programmes",
            permanent: true
      },
      {
            source: "/poles.html",
            destination: "/programmes",
            permanent: true
      },
      {
            source: "/plaidoyers",
            destination: "/actions",
            permanent: true
      },
      {
            source: "/plaidoyers.html",
            destination: "/actions",
            permanent: true
      },
      {
            source: "/suivi",
            destination: "/impact",
            permanent: true
      },
      {
            source: "/suivi.html",
            destination: "/impact",
            permanent: true
      },
      {
            source: "/actualites",
            destination: "/journal",
            permanent: true
      },
      {
            source: "/actualites.html",
            destination: "/journal",
            permanent: true
      },
      {
            source: "/contact",
            destination: "/participer#contact",
            permanent: true
      },
      {
            source: "/contact.html",
            destination: "/participer#contact",
            permanent: true
      },
      {
            source: "/adherer",
            destination: "/participer#adherer",
            permanent: true
      },
      {
            source: "/adherer.html",
            destination: "/participer#adherer",
            permanent: true
      },
      {
            source: "/soutenir",
            destination: "/participer#soutenir",
            permanent: true
      },
      {
            source: "/soutenir.html",
            destination: "/participer#soutenir",
            permanent: true
      },
      {
            source: "/redevabilite",
            destination: "/transparence",
            permanent: true
      },
      {
            source: "/redevabilite.html",
            destination: "/transparence",
            permanent: true
      },
      {
            source: "/figures",
            destination: "/histoire",
            permanent: true
      },
      {
            source: "/figures.html",
            destination: "/histoire",
            permanent: true
      },
      {
            source: "/sitemap",
            destination: "/plan-du-site",
            permanent: true
      },
      {
            source: "/sitemap.html",
            destination: "/plan-du-site",
            permanent: true
      },
      {
            source: "/hors-ligne.html",
            destination: "/hors-ligne",
            permanent: true
      },
      {
            source: "/redaction.html",
            destination: "/redaction",
            permanent: true
      },
      {
            source: "/agriculteurs-eleveurs",
            destination: "/dossiers/agriculteurs-eleveurs",
            permanent: true
      },
      {
            source: "/agriculteurs-eleveurs.html",
            destination: "/dossiers/agriculteurs-eleveurs",
            permanent: true
      },
      {
            source: "/agriculture-securite-alimentaire",
            destination: "/dossiers/agriculture-securite-alimentaire",
            permanent: true
      },
      {
            source: "/agriculture-securite-alimentaire.html",
            destination: "/dossiers/agriculture-securite-alimentaire",
            permanent: true
      },
      {
            source: "/air-bedjondo",
            destination: "/dossiers/air-bedjondo",
            permanent: true
      },
      {
            source: "/air-bedjondo.html",
            destination: "/dossiers/air-bedjondo",
            permanent: true
      },
      {
            source: "/application",
            destination: "/dossiers/application",
            permanent: true
      },
      {
            source: "/application.html",
            destination: "/dossiers/application",
            permanent: true
      },
      {
            source: "/bedjondo",
            destination: "/dossiers/bedjondo",
            permanent: true
      },
      {
            source: "/bedjondo.html",
            destination: "/dossiers/bedjondo",
            permanent: true
      },
      {
            source: "/besoins",
            destination: "/dossiers/besoins",
            permanent: true
      },
      {
            source: "/besoins.html",
            destination: "/dossiers/besoins",
            permanent: true
      },
      {
            source: "/complexe-sportif",
            destination: "/dossiers/complexe-sportif",
            permanent: true
      },
      {
            source: "/complexe-sportif.html",
            destination: "/dossiers/complexe-sportif",
            permanent: true
      },
      {
            source: "/decentralisation",
            destination: "/dossiers/decentralisation",
            permanent: true
      },
      {
            source: "/decentralisation.html",
            destination: "/dossiers/decentralisation",
            permanent: true
      },
      {
            source: "/demarches",
            destination: "/dossiers/demarches",
            permanent: true
      },
      {
            source: "/demarches.html",
            destination: "/dossiers/demarches",
            permanent: true
      },
      {
            source: "/drones-innovation",
            destination: "/dossiers/drones-innovation",
            permanent: true
      },
      {
            source: "/drones-innovation.html",
            destination: "/dossiers/drones-innovation",
            permanent: true
      },
      {
            source: "/engagements",
            destination: "/dossiers/engagements",
            permanent: true
      },
      {
            source: "/engagements.html",
            destination: "/dossiers/engagements",
            permanent: true
      },
      {
            source: "/enquetes",
            destination: "/dossiers/enquetes",
            permanent: true
      },
      {
            source: "/enquetes.html",
            destination: "/dossiers/enquetes",
            permanent: true
      },
      {
            source: "/environnement",
            destination: "/dossiers/environnement",
            permanent: true
      },
      {
            source: "/environnement.html",
            destination: "/dossiers/environnement",
            permanent: true
      },
      {
            source: "/espace-numerique",
            destination: "/dossiers/espace-numerique",
            permanent: true
      },
      {
            source: "/espace-numerique.html",
            destination: "/dossiers/espace-numerique",
            permanent: true
      },
      {
            source: "/evenements",
            destination: "/dossiers/evenements",
            permanent: true
      },
      {
            source: "/evenements.html",
            destination: "/dossiers/evenements",
            permanent: true
      },
      {
            source: "/genealogies",
            destination: "/dossiers/genealogies",
            permanent: true
      },
      {
            source: "/genealogies.html",
            destination: "/dossiers/genealogies",
            permanent: true
      },
      {
            source: "/handicap",
            destination: "/dossiers/handicap",
            permanent: true
      },
      {
            source: "/handicap.html",
            destination: "/dossiers/handicap",
            permanent: true
      },
      {
            source: "/identite-visuelle",
            destination: "/dossiers/identite-visuelle",
            permanent: true
      },
      {
            source: "/identite-visuelle.html",
            destination: "/dossiers/identite-visuelle",
            permanent: true
      },
      {
            source: "/kit-mobilisation",
            destination: "/dossiers/kit-mobilisation",
            permanent: true
      },
      {
            source: "/kit-mobilisation.html",
            destination: "/dossiers/kit-mobilisation",
            permanent: true
      },
      {
            source: "/lieux-sacres",
            destination: "/dossiers/lieux-sacres",
            permanent: true
      },
      {
            source: "/lieux-sacres.html",
            destination: "/dossiers/lieux-sacres",
            permanent: true
      },
      {
            source: "/odd",
            destination: "/dossiers/odd",
            permanent: true
      },
      {
            source: "/odd.html",
            destination: "/dossiers/odd",
            permanent: true
      },
      {
            source: "/ong-partenaires",
            destination: "/dossiers/ong-partenaires",
            permanent: true
      },
      {
            source: "/ong-partenaires.html",
            destination: "/dossiers/ong-partenaires",
            permanent: true
      },
      {
            source: "/problematiques",
            destination: "/dossiers/problematiques",
            permanent: true
      },
      {
            source: "/problematiques.html",
            destination: "/dossiers/problematiques",
            permanent: true
      },
      {
            source: "/recherche.html",
            destination: "/dossiers/recherche",
            permanent: true
      },
      {
            source: "/solidarite-inclusion",
            destination: "/dossiers/solidarite-inclusion",
            permanent: true
      },
      {
            source: "/solidarite-inclusion.html",
            destination: "/dossiers/solidarite-inclusion",
            permanent: true
      },
      {
            source: "/veuves",
            destination: "/dossiers/veuves",
            permanent: true
      },
      {
            source: "/veuves.html",
            destination: "/dossiers/veuves",
            permanent: true
      },
      {
            source: "/trouver-ma-thematique",
            destination: "/dossiers/trouver-ma-thematique",
            permanent: true
      },
      {
            source: "/trouver-ma-thematique.html",
            destination: "/dossiers/trouver-ma-thematique",
            permanent: true
      },
      {
            source: "/genealogie-outil",
            destination: "/dossiers/genealogie-outil",
            permanent: true
      },
      {
            source: "/genealogie-outil.html",
            destination: "/dossiers/genealogie-outil",
            permanent: true
      },
      {
            source: "/mission.html",
            destination: "/mission",
            permanent: true
      },
      {
            source: "/documents.html",
            destination: "/documents",
            permanent: true
      },
      {
            source: "/mentions-legales.html",
            destination: "/mentions-legales",
            permanent: true
      },
      {
            source: "/articles/:slug.html",
            destination: "/journal/:slug",
            permanent: true
      },
      {
            source: "/articles/:slug",
            destination: "/journal/:slug",
            permanent: true
      },
      {
            source: "/articles",
            destination: "/journal",
            permanent: true
      },
      {
            source: "/en/:slug.html",
            destination: "/en/:slug",
            permanent: true
      },
      {
            source: "/en",
            destination: "/en/index",
            permanent: true
      },
      {
            source: "/en/index.html",
            destination: "/en/index",
            permanent: true
      },
      {
            source: "/composantes",
            destination: "/mission",
            permanent: true
      },
      {
            source: "/composantes.html",
            destination: "/mission",
            permanent: true
      }
];
  },
  async headers() {
    return [
      {
        // le service worker doit toujours être revérifié, jamais servi longtemps depuis un cache
        source: "/sw.js",
        headers: [{ key: "Cache-Control", value: "no-cache" }],
      },
      {
        // espace de rédaction privé : jamais indexé, jamais mis en cache
        source: "/redaction",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/api/redaction",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        // lien appli Android ↔ site (Digital Asset Links)
        source: "/.well-known/assetlinks.json",
        headers: [
          { key: "Content-Type", value: "application/json" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.tile.openstreetmap.fr; font-src 'self'; connect-src 'self'; media-src 'self' blob:; worker-src 'self'; manifest-src 'self'; frame-src 'none'; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests" },
        ],
      },
    ];
  },
};

export default nextConfig;
