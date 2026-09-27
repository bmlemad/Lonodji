import Link from "next/link";

export default function SiteNav() {
  return (
    <nav className="nav" aria-label="Navigation principale">
      <Link className="brand" href="/" aria-label="ADEB Lonodji — accueil">
        <span className="brand-mark" aria-hidden="true">A</span>
        <span>ADEB <b>LONODJI</b></span>
      </Link>
      <div className="links">
        <Link href="/mission">Mission</Link>
        <Link href="/programmes">Programmes</Link>
        <Link href="/impact">Impact</Link>
        <Link href="/participer">Participer</Link>
        <Link href="/transparence">Transparence</Link>
      </div>
      <Link className="nav-cta" href="/participer">Nous rejoindre</Link>
    </nav>
  );
}
