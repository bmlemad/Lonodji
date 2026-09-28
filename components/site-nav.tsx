"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { entreeCourante, NAVIGATION, type NavChiffres, type NavEntree } from "../lib/navigation";

/* En-tête du site : barre fixe, méga-menu par section sur ordinateur (bouton
   « disclosure » + panneau en colonnes et carte en vedette), menu plein écran
   sur tablette et mobile (recherche, groupes dépliables, actions). Une seule
   source de données : lib/navigation.ts. */

type Props = { chiffres: NavChiffres; whatsapp: string; telephone: string; telephoneHref: string; devise: string };

const Fleche = () => <svg className="nav-chev" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>;

export default function SiteNav({ chiffres, whatsapp, telephone, telephoneHref, devise }: Props) {
  const pathname = usePathname();
  const courante = entreeCourante(pathname);
  const [ouvert, setOuvert] = useState<string | null>(null);   // panneau ouvert (ordinateur)
  const [menu, setMenu] = useState(false);                     // menu plein écran (tablette, mobile)
  const [large, setLarge] = useState(true);                    // ≥ 641 px : groupes du menu mobile dépliés
  const navRef = useRef<HTMLElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const fine = useRef(false);                                  // pointeur précis (souris) : ouverture au survol

  const annuler = () => { if (timer.current) { window.clearTimeout(timer.current); timer.current = undefined; } };
  const ouvrir = useCallback((id: string) => { annuler(); setOuvert(id); }, []);
  const fermer = useCallback(() => { annuler(); setOuvert(null); }, []);
  const fermerDoucement = useCallback(() => { annuler(); timer.current = window.setTimeout(() => setOuvert(null), 280); }, []);

  useEffect(() => {
    fine.current = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
    const mq = window.matchMedia("(min-width:641px)");
    const maj = () => setLarge(mq.matches);
    maj();
    mq.addEventListener("change", maj);
    return () => mq.removeEventListener("change", maj);
  }, []);

  // changement de page : tout se referme
  useEffect(() => { setOuvert(null); setMenu(false); }, [pathname]);

  // la barre d'onglets de l'appli (components/app-shell.tsx) ouvre et ferme le menu mobile
  useEffect(() => {
    const surDemande = (e: Event) => setMenu(!!(e as CustomEvent<boolean>).detail);
    window.addEventListener("lonodji:menu", surDemande);
    return () => window.removeEventListener("lonodji:menu", surDemande);
  }, []);
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("lonodji:menu-state", { detail: menu }));
    if (!menu) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && setMenu(false);
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("menu-open");
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.classList.remove("menu-open"); };
  }, [menu]);

  // panneau ouvert : Échap, clic ailleurs, défilement long le referment
  useEffect(() => {
    if (!ouvert) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const bouton = navRef.current?.querySelector<HTMLButtonElement>(`[aria-controls="mega-${ouvert}"]`);
      fermer();
      bouton?.focus();
    };
    const onPointer = (e: PointerEvent) => { if (!navRef.current?.contains(e.target as Node)) fermer(); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onPointer); };
  }, [ouvert, fermer]);

  const surSortieFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) fermerDoucement();
  };

  // rendu d'une entrée de la barre (fonction, pas composant : pas de remontage à chaque rendu)
  const rendreEntree = (e: NavEntree) => {
    const estCourante = courante === e.id;
    if (!e.colonnes) {
      return <Link className={estCourante ? "nav-lien is-current" : "nav-lien"} href={e.href} key={e.id} aria-current={estCourante ? "page" : undefined}>{e.court || e.label}</Link>;
    }
    const on = ouvert === e.id;
    return (
      <div
        key={e.id}
        className={on ? "nav-entree is-open" : "nav-entree"}
        onPointerEnter={(ev) => { if (ev.pointerType === "mouse" && fine.current) { annuler(); timer.current = window.setTimeout(() => setOuvert(e.id), 70); } }}
        onPointerLeave={(ev) => { if (ev.pointerType === "mouse" && fine.current) fermerDoucement(); }}
        onBlur={surSortieFocus}
      >
        <button
          type="button"
          className={estCourante ? "nav-lien nav-bouton is-current" : "nav-lien nav-bouton"}
          aria-expanded={on}
          aria-controls={`mega-${e.id}`}
          aria-current={estCourante ? "true" : undefined}
          onClick={() => (on ? fermer() : ouvrir(e.id))}
          onKeyDown={(ev) => {
            if (ev.key === "ArrowDown") { ev.preventDefault(); ouvrir(e.id); window.setTimeout(() => navRef.current?.querySelector<HTMLAnchorElement>(`#mega-${e.id} a`)?.focus(), 0); }
          }}
        >
          <span>{e.court || e.label}</span><Fleche />
        </button>
        <div className="mega" id={`mega-${e.id}`} hidden={!on} aria-label={e.label}>
          <div className="mega-inner">
            <div className="mega-tete">
              <Link className="mega-tout" href={e.href} onClick={fermer}>{e.label} <span aria-hidden="true">→</span></Link>
            </div>
            <div className="mega-cols" style={{ ["--mega-cols" as string]: e.colonnes.length }}>
              {e.colonnes.map((c) => (
                <div className="mega-col" key={c.titre}>
                  <p className="mega-titre">{c.titre}</p>
                  <ul>
                    {c.liens.map((l) => (
                      <li key={l.href + l.label}>
                        {l.externe
                          ? <a href={l.href} target="_blank" rel="noopener noreferrer"><b>{l.label}</b>{l.note ? <span>{l.note}</span> : null}</a>
                          : <Link href={l.href} onClick={fermer} aria-current={pathname === l.href ? "page" : undefined}><b>{l.label}</b>{l.note ? <span>{l.note}</span> : null}</Link>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {e.vedette ? (
                <Link className="mega-vedette" href={e.vedette.href} onClick={fermer}>
                  <small>{e.vedette.kicker}</small>
                  <strong>{e.vedette.titre(chiffres)}</strong>
                  <span>{e.vedette.texte(chiffres)}</span>
                  <b>{e.vedette.label} <i aria-hidden="true">↗</i></b>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <nav className="nav" aria-label="Navigation principale" ref={navRef}>
        <Link className="brand" href="/" aria-label="ADEB LONODJI — accueil" onClick={() => { fermer(); setMenu(false); }}><span className="brand-mark" aria-hidden="true">A</span><span className="brand-name"><span>ADEB</span><b>LONODJI</b></span></Link>
        <div className="links">{NAVIGATION.map(rendreEntree)}</div>
        <Link className="nav-search" href="/recherche" aria-label="Rechercher dans le site" title="Rechercher" onClick={fermer}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg></Link>
        <Link className="nav-cta" href="/participer" aria-label="Nous rejoindre" onClick={fermer}><span>Nous rejoindre</span><b aria-hidden="true">↗</b></Link>
        <button className="menu-toggle" type="button" aria-expanded={menu} aria-controls="mobile-menu" onClick={() => { fermer(); setMenu((v) => !v); }}><span>{menu ? "Fermer" : "Menu"}</span><i aria-hidden="true">{menu ? "×" : "☰"}</i></button>
      </nav>

      <div className={menu ? "mobile-menu is-open" : "mobile-menu"} id="mobile-menu" aria-hidden={!menu} inert={!menu}>
        <div className="mobile-menu-inner">
          <form className="mm-search" action="/recherche" method="get" role="search" onSubmit={() => setMenu(false)}>
            <label className="sr-only" htmlFor="mm-q">Rechercher dans le site</label>
            <input id="mm-q" name="q" type="search" placeholder="Rechercher un village, un dossier, un mot…" autoComplete="off" />
            <button type="submit" aria-label="Lancer la recherche"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg></button>
          </form>
          <div className="mm-groups">
            {NAVIGATION.map((e) => {
              const estCourante = courante === e.id;
              if (!e.colonnes) {
                return <Link className={estCourante ? "mm-lien is-current" : "mm-lien"} href={e.href} key={e.id} aria-current={estCourante ? "page" : undefined} onClick={() => setMenu(false)}><span>{e.label}</span><b aria-hidden="true">↗</b></Link>;
              }
              return (
                <details className="mm-group" key={e.id} open={large || estCourante || undefined}>
                  <summary><span className={estCourante ? "is-current" : undefined}>{e.label}</span><Fleche /></summary>
                  <div className="mm-group-body">
                    <Link className="mm-tout" href={e.href} onClick={() => setMenu(false)}>Tout sur « {e.label} » <span aria-hidden="true">→</span></Link>
                    <ul>
                      {e.colonnes.flatMap((c) => c.liens).map((l) => (
                        <li key={l.href + l.label}>
                          {l.externe
                            ? <a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
                            : <Link href={l.href} aria-current={pathname === l.href ? "page" : undefined} onClick={() => setMenu(false)}>{l.label}</Link>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              );
            })}
          </div>
          <div className="mm-actions">
            <Link className="button primary" href="/participer" onClick={() => setMenu(false)}>Nous rejoindre <span aria-hidden="true">↗</span></Link>
            <a className="button secondary" href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>
            <button className="button secondary install-cta" type="button" onClick={() => { setMenu(false); window.dispatchEvent(new Event("lonodji:install")); }}>Installer l’application <span aria-hidden="true">↓</span></button>
          </div>
          <p className="mm-foot">
            <span>{devise}</span>
            <a href={telephoneHref}>{telephone}</a>
            <Link href="/en/index" onClick={() => setMenu(false)}>English</Link>
            <Link href="/plan-du-site" onClick={() => setMenu(false)}>Plan du site</Link>
          </p>
        </div>
      </div>
    </>
  );
}
