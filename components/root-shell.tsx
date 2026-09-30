import type { Metadata, Viewport } from "next";
import AppShell from "@/components/app-shell";
import NavTools from "@/components/nav-tools";
import Palette from "@/components/palette";
import { FeuillePartage } from "@/components/partager";
import SectionRail from "@/components/section-rail";
import SiteFooter from "@/components/site-footer";
import SiteNav from "@/components/site-nav";
import { ORG } from "@/lib/content";
import { getIndicateurs } from "@/lib/indicateurs";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "../app/globals.css";
import "../app/legacy.css";
import "../app/legacy-layout.css";
import "../app/site.css";

const siteUrl = "https://lonodji.org";

const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-dm" });
// police des titres en italique : pas de préchargement (30/09/2026). Sur une connexion lente, la feuille de style
// et DM Sans passent d'abord ; les titres s'affichent en Georgia puis prennent Playfair dès qu'elle arrive.
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap", variable: "--font-playfair", preload: false, fallback: ["Georgia", "serif"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#173b2d",
};

export const metadataFr: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "ADEB LONODJI",
  title: {
    default: "ADEB LONODJI — Courage · Discipline · Héritage",
    template: "%s — ADEB LONODJI",
  },
  description:
    "L’association de Bédjondo et de sa diaspora, gardienne du patrimoine bedjond : quatre pôles, vingt thématiques, huit dossiers de plaidoyer pour le Mandoul (Tchad).",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "ADEB LONODJI",
    title: "ADEB LONODJI — Courage · Discipline · Héritage",
    description:
      "L’association de Bédjondo et de sa diaspora, gardienne du patrimoine bedjond. Quatre pôles, vingt thématiques, huit dossiers de plaidoyer publiés.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ADEB LONODJI — Courage · Discipline · Héritage" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const metadataEn: Metadata = {
  ...metadataFr,
  title: { default: "ADEB LONODJI — Courage · Discipline · Heritage", template: "%s — ADEB LONODJI" },
  description: "The association of Bédjondo (Mandoul, Chad) and its diaspora, guardian of the Bedjond heritage: four pillars, twenty themes, eight advocacy briefs.",
  alternates: { canonical: "/en/index" },
  openGraph: { ...metadataFr.openGraph, locale: "en_GB", url: `${siteUrl}/en/index`, title: "ADEB LONODJI — Courage · Discipline · Heritage", description: "The association of Bédjondo and its diaspora, guardian of the Bedjond heritage." },
};

export default function RootShell({
  children, lang = "fr",
}: Readonly<{ children: React.ReactNode; lang?: "fr" | "en" }>) {
  const en = lang === "en";
  // chiffres des cartes en vedette du méga-menu (comptés à la construction)
  const ind = getIndicateurs();
  const chiffres = { pourvues: ind.contenu.coordinations.pourvues, total: ind.contenu.coordinations.total, fiches: ind.contenu.carte.localitesNommees, articles: ind.contenu.articles, corrections: ind.contenu.corrections };
  const miseAJour = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Ndjamena" });
  return (
    <html lang={lang}>
      <body className={`${dmSans.variable} ${playfair.variable}`}>
        <a className="skip-link" href="#main-content">{en ? "Skip to content" : "Aller au contenu"}</a>
        <header>
        <SiteNav lang={lang} chiffres={chiffres} whatsapp={ORG.whatsapp} telephone={ORG.phone} telephoneHref={ORG.phoneHref} devise={ORG.motto} />
        </header>
        {children}
        <SiteFooter lang={lang} miseAJour={en ? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Ndjamena" }) : miseAJour} />
        <NavTools />
        <Palette />
        <FeuillePartage />
        <SectionRail />
        <AppShell lang={lang} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: (JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": ["Organization", "NGO"],
                name: "ADEB LONODJI",
                alternateName: "Association de Développement et d’Entraide de Bédjondo",
                url: siteUrl,
                logo: `${siteUrl}/odeb/identite/odeb-lonodji-embleme-1024.png`,
                telephone: ORG.phone,
                foundingDate: "1995",
                address: { "@type": "PostalAddress", addressLocality: "Bédjondo", addressRegion: "Mandoul", addressCountry: "TD" },
                slogan: "Courage · Discipline · Héritage",
              },
              {
                "@type": "WebSite",
                name: "ADEB LONODJI",
                url: siteUrl,
                inLanguage: en ? "en-GB" : "fr-FR",
              },
            ],
          })).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
