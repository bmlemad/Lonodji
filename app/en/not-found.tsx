import Link from "@/components/lien";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found" lang="en">
      <p className="eyebrow">404 — Page not found</p>
      <h1>This page does not exist.</h1>
      <p>The page may have moved. Try one of these instead.</p>
      <ul className="not-found-liens">
        <li><Link href="/en/index">English home</Link></li>
        <li><Link href="/en/villages">Find your village</Link></li>
        <li><Link href="/en/contact">Contact us</Link></li>
        <li><Link href="/" hrefLang="fr" lang="fr">Site en français</Link></li>
      </ul>
    </main>
  );
}
