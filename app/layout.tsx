import type { Metadata, Viewport } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const siteUrl = "https://adeb-lonodji.netlify.app";

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
    "ADEB Lonodji — engagement, transmission et action au service de la communauté.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "ADEB Lonodji",
    title: "ADEB Lonodji — Courage • Discipline • Héritage",
    description:
      "Engagement, transmission et action au service de la communauté.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ADEB Lonodji — Courage • Discipline • Héritage",
    description:
      "Engagement, transmission et action au service de la communauté.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={`${dmSans.variable} ${playfair.variable}`}>{children}</body>
    </html>
  );
}
