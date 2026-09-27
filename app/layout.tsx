import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata={title:"ADEB Lonodji — Courage • Discipline • Héritage",description:"ADEB Lonodji — engagement, transmission et action au service de la communauté.",viewport:"width=device-width, initial-scale=1"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr"><body>{children}</body></html>}