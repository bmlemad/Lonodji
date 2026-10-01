const SITE_URL = "https://lonodji.org";

export const organizationId = `${SITE_URL}/#organization`;
export const websiteId = `${SITE_URL}/#website`;

export function siteOrganization(org: {
  name: string;
  fullName: string;
  motto: string;
  phone: string;
}) {
  return {
    "@id": organizationId,
    "@type": "NGO",
    name: org.name,
    legalName: org.fullName,
    url: SITE_URL,
    logo: `${SITE_URL}/odeb/identite/odeb-lonodji-embleme-1024.png`,
    image: `${SITE_URL}/og/index.jpg`,
    telephone: org.phone,
    foundingDate: "1995",
    address: { "@type": "PostalAddress", addressLocality: "Bédjondo", addressRegion: "Mandoul", addressCountry: "TD" },
    areaServed: { "@type": "AdministrativeArea", name: "Mandoul Occidental, Tchad" },
    slogan: org.motto,
    sameAs: ["https://www.facebook.com/profile.php?id=61594849805565", "https://x.com/adeb_lonodji"],
  };
}

export function siteWebSite(name: string, lang: "fr" | "en") {
  return {
    "@id": websiteId,
    "@type": "WebSite",
    name,
    url: SITE_URL,
    inLanguage: lang === "en" ? "en-GB" : "fr-FR",
    publisher: { "@id": organizationId },
  };
}

export function webPageSchema(args: {
  url: string;
  name: string;
  description?: string;
  lang?: "fr" | "en";
}) {
  return {
    "@id": `${SITE_URL}${args.url}#webpage`,
    "@type": "WebPage",
    url: `${SITE_URL}${args.url}`,
    name: args.name,
    ...(args.description ? { description: args.description } : {}),
    inLanguage: args.lang === "en" ? "en-GB" : "fr-FR",
    isPartOf: { "@id": websiteId },
    publisher: { "@id": organizationId },
  };
}

export function breadcrumbSchema(items: { name: string; url?: string }[], id: string) {
  return {
    "@id": `${SITE_URL}${id}#breadcrumb`,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: `${SITE_URL}${item.url}` } : {}),
    })),
  };
}

export function articleSchema(args: {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  image: string;
  lang?: "fr" | "en";
  byline?: string;
}) {
  return {
    "@id": `${SITE_URL}${args.url}#article`,
    "@type": "Article",
    headline: args.headline,
    description: args.description,
    datePublished: args.datePublished,
    image: [args.image],
    inLanguage: args.lang === "en" ? "en-GB" : "fr-FR",
    // Une Person seulement pour une vraie signature nominative : « Rédaction ADEB LONODJI » ou « ADEB LONODJI »
    // désignent l'association elle-même, pas une personne.
    author: args.byline && !/ADEB LONODJI|^Rédaction\b/i.test(args.byline) ? { "@type": "Person", name: args.byline } : { "@id": organizationId },
    publisher: { "@id": organizationId },
    mainEntityOfPage: { "@id": `${SITE_URL}${args.url}#webpage` },
  };
}

export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
