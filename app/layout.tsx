import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const siteUrl = "https://lonodji.org";

const dmSans = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-dm" });
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap", variable: "--font-playfair" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ADEB Lonodji — Courage • Discipline • Héritage",
    template: "%s — ADEB Lonodji",
  },
  description:
    "ADEB Lonodji — association dédiée à l’engagement, la transmission, la communauté et la valorisation du territoire et du patrimoine.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "ADEB Lonodji",
    title: "ADEB Lonodji — Courage • Discipline • Héritage",
    description:
      "Engagement, transmission, communauté, territoire et patrimoine au service d’une action collective documentée.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ADEB Lonodji — Courage • Discipline • Héritage",
    description:
      "Engagement, transmission, communauté, territoire et patrimoine au service d’une action collective documentée.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${dmSans.variable} ${playfair.variable}`}>
        {children}
        <Script id="structured-data" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                name: "ADEB Lonodji",
                url: siteUrl,
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
