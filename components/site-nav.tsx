"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const items = [
  { href: "/mission", label: "Mission", number: "01" },
  { href: "/histoire", label: "Histoire", number: "02" },
  { href: "/programmes", label: "Nos actions", number: "03" },
  { href: "/actions", label: "Plaidoyers", number: "04" },
  { href: "/journal", label: "Journal", number: "05" },
  { href: "/documents", label: "Documents", number: "06" },
  { href: "/participer", label: "Participer", number: "07" },
  { href: "/transparence", label: "Transparence", number: "08" },
];

function isCurrent(pathname: string, href: string) {
  if (pathname === href) return true;
  if (href === "/journal" && pathname.startsWith("/journal/")) return true;
  if (href === "/programmes" && pathname.startsWith("/dossiers")) return true;
  return false;
}

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("menu-open");
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.classList.remove("menu-open"); };
  }, [open]);
  return (
    <>
      <nav className="nav" aria-label="Navigation principale">
        <Link className="brand" href="/" aria-label="ADEB LONODJI — accueil" onClick={() => setOpen(false)}><span className="brand-mark" aria-hidden="true">A</span><span className="brand-name"><span>ADEB</span><b>LONODJI</b></span></Link>
        <div className="links" role="list">{items.map((item) => <Link key={item.href} href={item.href} role="listitem" aria-current={isCurrent(pathname, item.href) ? "page" : undefined}><small>{item.number}</small><span>{item.label}</span></Link>)}</div>
        <Link className="nav-search" href="/recherche" aria-label="Rechercher dans le site" title="Rechercher"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg></Link>
        <Link className="nav-cta" href="/participer"><span>Nous rejoindre</span><b aria-hidden="true">↗</b></Link>
        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}><span>{open ? "Fermer" : "Menu"}</span><i aria-hidden="true">{open ? "×" : "☰"}</i></button>
      </nav>
      <div className={open ? "mobile-menu is-open" : "mobile-menu"} id="mobile-menu" aria-hidden={!open} inert={!open}>
        <div className="mobile-menu-inner">
          <p className="eyebrow">ADEB LONODJI</p><p className="mobile-menu-title">Courage.<br /><em>Discipline. Héritage.</em></p>
          <div className="mobile-menu-links">{items.map((item) => <Link key={item.href} href={item.href} aria-current={isCurrent(pathname, item.href) ? "page" : undefined} onClick={() => setOpen(false)}><small>{item.number}</small><span>{item.label}</span><b aria-hidden="true">↗</b></Link>)}</div>
          <Link className="button primary mobile-menu-cta" href="/participer" onClick={() => setOpen(false)}>Nous rejoindre <span aria-hidden="true">↗</span></Link>
          <Link className="text-link" style={{ display: "inline-block", marginTop: 22 }} href="/recherche" onClick={() => setOpen(false)}>Rechercher dans le site <span aria-hidden="true">→</span></Link>
        </div>
      </div>
    </>
  );
}
