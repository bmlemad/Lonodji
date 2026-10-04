import type { Metadata, Viewport } from "next";
import AppShell from "@/components/app-shell";
import SiteFooter from "@/components/site-footer";
import DeferredChrome from "@/components/deferred-chrome";
import SiteNav from "@/components/site-nav";
import TablesMobiles from "@/components/tables-mobiles";
import { ORG, enLettres, getIndex, thematiqueCount } from "@/lib/content";
import { getIndicateurs } from "@/lib/indicateurs";
import { jsonLd, siteOrganization, siteWebSite } from "@/lib/schema";
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

const themeCount = thematiqueCount(getIndex());
const plaidoyerCount = getIndicateurs().contenu.plaidoyers.publies;
const themeLabel = `${enLettres(themeCount)} thématiques`;

export const metadataFr: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "ADEB LONODJI",
  title: {
    default: "ADEB LONODJI — Association de Bédjondo et de sa diaspora",
    template: "%s — ADEB LONODJI",
  },
  description:
    `ADEB LONODJI relie Bédjondo et sa diaspora : développement local, patrimoine bedjond, données territoriales et ${enLettres(plaidoyerCount)} dossiers de plaidoyer suivis publiquement dans le Mandoul, au Tchad.`,
  keywords: ["ADEB LONODJI", "Bédjondo", "Mandoul Occidental", "Tchad", "diaspora bedjond", "développement local Bédjondo", "patrimoine bedjond", "plaidoyer Bédjondo"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "ADEB LONODJI",
    title: "ADEB LONODJI — Bédjondo, diaspora, développement et patrimoine",
    description:
      `Association de Bédjondo et de sa diaspora : développement local, patrimoine bedjond, données territoriales et ${enLettres(plaidoyerCount)} dossiers de plaidoyer suivis publiquement.`,
    images: [{ url: "/og/index.jpg", width: 1200, height: 630, alt: "ADEB LONODJI — Courage · Discipline · Héritage" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const metadataEn: Metadata = {
  ...metadataFr,
  title: { default: "ADEB LONODJI — Courage · Discipline · Heritage", template: "%s — ADEB LONODJI" },
  description: `The association of Bédjondo (Mandoul, Chad) and its diaspora, guardian of the Bedjond heritage: six pillars, ${themeCount} structured themes, ${plaidoyerCount} advocacy briefs.`,
  alternates: { canonical: "/en/index" },
  openGraph: { ...metadataFr.openGraph, locale: "en_GB", url: `${siteUrl}/en/index`, title: "ADEB LONODJI — Courage · Discipline · Heritage", description: `The association of Bédjondo and its diaspora, guardian of the Bedjond heritage: six pillars, ${themeCount} structured themes, ${plaidoyerCount} published advocacy briefs.` },
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
    <html lang={lang} suppressHydrationWarning>
      <body className={`${dmSans.variable} ${playfair.variable}`}>
        {/* Téléphone modeste ou mode économie de données : pas de flou (verre plein), cf. site.css « Verre clair ». */}
        <script dangerouslySetInnerHTML={{ __html: "try{var n=navigator,c=n.connection;if((n.deviceMemory&&n.deviceMemory<=2)||(c&&(c.saveData||/^(slow-2g|2g)$/.test(c.effectiveType||''))))document.documentElement.classList.add('sobre')}catch(e){}" }} />
        <a className="skip-link" href="#main-content">{en ? "Skip to content" : "Aller au contenu"}</a>
        <header>
        <SiteNav lang={lang} chiffres={chiffres} whatsapp={ORG.whatsapp} telephone={ORG.phone} telephoneHref={ORG.phoneHref} devise={ORG.motto} />
        </header>
        {children}
        <SiteFooter lang={lang} miseAJour={en ? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Ndjamena" }) : miseAJour} />
        <DeferredChrome />
        <AppShell lang={lang} />
        <TablesMobiles />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
          "@context": "https://schema.org",
          "@graph": [siteOrganization(ORG), siteWebSite(ORG.name, lang)],
        }) }} />
      </body>
    </html>
  );
}
