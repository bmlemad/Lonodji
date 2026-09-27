import Link from "next/link";

const items = [
  { href: "/mission", label: "Mission", number: "01" },
  { href: "/programmes", label: "Programmes", number: "02" },
  { href: "/impact", label: "Impact", number: "03" },
  { href: "/participer", label: "Participer", number: "08" },
  { href: "/transparence", label: "Transparence", number: "09" },
];

export default function SiteNav() {
  return (
    <nav className="nav" aria-label="Navigation principale">
      <Link className="brand" href="/" aria-label="ADEB Lonodji — accueil">
        <span className="brand-mark" aria-hidden="true">A</span>
        <span className="brand-name"><span>ADEB</span><b>LONODJI</b></span>
      </Link>

      <div className="links" role="list">
        {items.map((item) => (
          <Link key={item.href} href={item.href} role="listitem">
            <small>{item.number}</small>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <Link className="nav-cta" href="/participer">
        <span>Nous rejoindre</span>
        <b aria-hidden="true">↗</b>
      </Link>
    </nav>
  );
}
