import type { Metadata, Viewport } from "next";
import Script from "next/script";
import SiteFooter from "../components/site-footer";
import SiteNav from "../components/site-nav";
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
  applicationName: "ADEB Lonodji",
  title: {
    default: "ADEB Lonodji — Courage • Discipline • Héritage",
    template: "%s — ADEB Lonodji",
  },
  description:
    "ADEB LONODJI, l’association de Bédjondo et de sa diaspora, gardienne du patrimoine bedjond : quatre pôles, dix-neuf thématiques, sept plaidoyers pour l’eau, l’électricité, l’école, les routes et la santé au Mandoul Occidental (Tchad).",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "ADEB Lonodji",
    title: "ADEB Lonodji — Courage • Discipline • Héritage",
    description:
      "L’association de Bédjondo et de sa diaspora, gardienne du patrimoine bedjond. Quatre pôles, dix-neuf thématiques, sept plaidoyers publiés.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ADEB LONODJI — Courage • Discipline • Héritage" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ADEB Lonodji — Courage • Discipline • Héritage",
    description:
      "L’association de Bédjondo et de sa diaspora, gardienne du patrimoine bedjond. Quatre pôles, dix-neuf thématiques, sept plaidoyers publiés.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${dmSans.variable} ${playfair.variable}`}>
        <a className="skip-link" href="#main-content">Aller au contenu</a>
        <SiteNav />
        {children}
        <SiteFooter />
        <Script id="structured-data" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: "ADEB LONODJI",
                alternateName: "Association de Développement et d’Entraide de Bédjondo",
                url: siteUrl,
                logo: `${siteUrl}/identite/logo-adeb-lonodji-1024.png`,
                telephone: "+235 66 29 94 03",
                foundingDate: "1995",
                address: { "@type": "PostalAddress", addressLocality: "Bédjondo", addressRegion: "Mandoul", addressCountry: "TD" },
                slogan: "Courage • Discipline • Héritage",
              },
              {
                "@type": "WebSite",
                name: "ADEB Lonodji",
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
