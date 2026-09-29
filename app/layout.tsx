import type { Metadata, Viewport } from "next";
import Script from "next/script";
import AppShell from "../components/app-shell";
import NavTools from "../components/nav-tools";
import Palette from "../components/palette";
import { FeuillePartage } from "../components/partager";
import SectionRail from "../components/section-rail";
import SiteFooter from "../components/site-footer";
import SiteNav from "../components/site-nav";
import { ORG } from "../lib/content";
import { getIndicateurs } from "../lib/indicateurs";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import "./legacy.css";
import "./legacy-layout.css";
import "./site.css";

const siteUrl = "https://lonodji.org";

const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-dm" });
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap", variable: "--font-playfair" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#173b2d",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "ADEB LONODJI",
  title: {
    default: "ADEB LONODJI — Courage • Discipline • Héritage",
    template: "%s — ADEB LONODJI",
  },
  description:
    "L’association de Bédjondo et de sa diaspora, gardienne du patrimoine bedjond : quatre pôles, vingt thématiques, huit plaidoyers pour le Mandoul (Tchad).",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "ADEB LONODJI",
    title: "ADEB LONODJI — Courage • Discipline • Héritage",
    description:
      "L’association de Bédjondo et de sa diaspora, gardienne du patrimoine bedjond. Quatre pôles, vingt thématiques, huit plaidoyers publiés.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ADEB LONODJI — Courage • Discipline • Héritage" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // chiffres des cartes en vedette du méga-menu (comptés à la construction)
  const ind = getIndicateurs();
  const chiffres = { pourvues: ind.contenu.coordinations.pourvues, total: ind.contenu.coordinations.total, fiches: ind.contenu.carte.localitesNommees, articles: ind.contenu.articles, corrections: ind.contenu.corrections };
  const miseAJour = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Ndjamena" });
  return (
    <html lang="fr">
      <body className={`${dmSans.variable} ${playfair.variable}`}>
        <a className="skip-link" href="#main-content">Aller au contenu</a>
        <SiteNav chiffres={chiffres} whatsapp={ORG.whatsapp} telephone={ORG.phone} telephoneHref={ORG.phoneHref} devise={ORG.motto} />
        {children}
        <SiteFooter miseAJour={miseAJour} />
        <NavTools />
        <Palette />
        <FeuillePartage />
        <SectionRail />
        <AppShell />
        <Script id="structured-data" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: "ADEB LONODJI",
                alternateName: "Association de Développement et d’Entraide de Bédjondo",
                url: siteUrl,
                logo: `${siteUrl}/odeb/identite/odeb-lonodji-embleme-1024.png`,
                telephone: "+235 66 29 94 03",
                foundingDate: "1995",
                address: { "@type": "PostalAddress", addressLocality: "Bédjondo", addressRegion: "Mandoul", addressCountry: "TD" },
                slogan: "Courage • Discipline • Héritage",
              },
              {
                "@type": "WebSite",
                name: "ADEB LONODJI",
                url: siteUrl,
                inLanguage: "fr-FR",
              },
            ],
          })}
        </Script>
      </body>
    </html>
  );
}
