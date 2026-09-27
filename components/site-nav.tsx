"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const items = [
  { href: "/mission", label: "Mission", number: "01" },
  { href: "/histoire", label: "Histoire", number: "02" },
  { href: "/archives", label: "Archives", number: "A" },
  { href: "/programmes", label: "Programmes", number: "03" },
  { href: "/actions", label: "Actions", number: "05" },
  { href: "/impact", label: "Impact", number: "06" },
  { href: "/participer", label: "Participer", number: "08" },
  { href: "/transparence", label: "Transparence", number: "09" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
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
        <Link className="brand" href="/" aria-label="ADEB Lonodji — accueil" onClick={() => setOpen(false)}><span className="brand-mark" aria-hidden="true">A</span><span className="brand-name"><span>ADEB</span><b>LONODJI</b></span></Link>
        <div className="links" role="list">{items.map((item) => <Link key={item.href} href={item.href} role="listitem"><small>{item.number}</small><span>{item.label}</span></Link>)}</div>
        <Link className="nav-cta" href="/participer"><span>Nous rejoindre</span><b aria-hidden="true">↗</b></Link>
        <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((value) => !value)}><span>{open ? "Fermer" : "Menu"}</span><i aria-hidden="true">{open ? "×" : "☰"}</i></button>
      </nav>
      <div className={open ? "mobile-menu is-open" : "mobile-menu"} id="mobile-menu" aria-hidden={!open}>
        <div className="mobile-menu-inner">
          <p className="eyebrow">ADEB Lonodji</p><p className="mobile-menu-title">Construire aujourd’hui.<br /><em>Transmettre demain.</em></p>
          <div className="mobile-menu-links">{items.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}><small>{item.number}</small><span>{item.label}</span><b aria-hidden="true">↗</b></Link>)}</div>
          <Link className="button primary mobile-menu-cta" href="/participer" onClick={() => setOpen(false)}>Nous rejoindre <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </>
  );
}
