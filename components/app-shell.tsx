"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/* Couche « appli » du site : enregistrement du service worker (lecture hors
   ligne), reconnaissance de l'appli installée (écran d'accueil, appli Android
   — activité web de confiance ouverte avec un référent android-app://, appli
   iPhone qui signe « LONODJI-iOS » dans son agent utilisateur), barre
   d'onglets en bas d'écran dans ce cas, et invitation à l'installation. */

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

const ICO = {
  accueil: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 10.5 12 3.8l8.5 6.7" /><path d="M5.5 9.2V20h4.8v-5.6h3.4V20h4.8V9.2" /></svg>,
  villages: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6-5.2-6-10a6 6 0 0 1 12 0c0 4.8-6 10-6 10z" /><circle cx="12" cy="11" r="2.2" /></svg>,
  journal: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h12.5V18a2.5 2.5 0 0 0 2.5 2.5H6.5A2.5 2.5 0 0 1 4 18z" /><path d="M16.5 9H20v9a2.5 2.5 0 0 1-2.5 2.5" /><path d="M7.5 9h5.5M7.5 12.5h5.5M7.5 16h3.5" /></svg>,
  agir: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.2s-7.5-4.6-7.5-10.3A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.6c0 5.7-7.5 10.3-7.5 10.3z" /></svg>,
  menu: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h11" /></svg>,
};

const ONGLETS = [
  { id: "accueil", href: "/", label: "Accueil" },
  { id: "villages", href: "/villages", label: "Villages" },
  { id: "journal", href: "/journal", label: "Journal" },
  { id: "agir", href: "/participer", label: "Agir" },
] as const;

function ongletActif(pathname: string) {
  if (pathname === "/" || pathname === "/en/index") return "accueil";
  if (/^\/(villages|carte)/.test(pathname)) return "villages";
  if (pathname.startsWith("/journal")) return "journal";
  if (/^\/(participer|en\/contact)/.test(pathname)) return "agir";
  return "";
}

function estAppli(): boolean {
  const ua = navigator.userAgent || "";
  let natif = /LONODJI-(iOS|Android)/.test(ua) || (document.referrer || "").indexOf("android-app://") === 0;
  try {
    if (natif) sessionStorage.setItem("lonodji-app", "1");
    else natif = sessionStorage.getItem("lonodji-app") === "1";
  } catch { /* stockage indisponible : on s'en passe */ }
  const nav = navigator as Navigator & { standalone?: boolean };
  return natif || nav.standalone === true || (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches);
}

export default function AppShell() {
  const pathname = usePathname();
  const [appli, setAppli] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const enAppli = estAppli();
    setAppli(enAppli);
    html.classList.toggle("is-standalone", enAppli);

    // lecture hors ligne : les pages déjà ouvertes restent lisibles
    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
      const enregistrer = () => { navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {}); };
      if (document.readyState === "complete") enregistrer();
      else window.addEventListener("load", enregistrer, { once: true });
    }

    // invitation à l'installation (Android/Chrome) : le bouton n'apparaît que si le navigateur la propose
    let invite: InstallEvent | null = null;
    const surInvite = (e: Event) => { e.preventDefault(); invite = e as InstallEvent; html.classList.add("can-install"); };
    const installer = () => {
      if (!invite) return;
      invite.prompt();
      invite.userChoice.finally(() => { invite = null; html.classList.remove("can-install"); });
    };
    const installee = () => { invite = null; html.classList.remove("can-install"); };
    window.addEventListener("beforeinstallprompt", surInvite);
    window.addEventListener("appinstalled", installee);
    window.addEventListener("lonodji:install", installer);

    // le clavier virtuel ouvert, les onglets s'effacent
    let t: ReturnType<typeof setTimeout> | undefined;
    const estChamp = (el: Element | null) => !!el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) && !/^(checkbox|radio|button|submit|reset|file|range|color)$/i.test((el as HTMLInputElement).type || "");
    const focusIn = (e: FocusEvent) => { if (estChamp(e.target as Element)) { clearTimeout(t); html.classList.add("kb-open"); } };
    const focusOut = () => { clearTimeout(t); t = setTimeout(() => { if (!estChamp(document.activeElement)) html.classList.remove("kb-open"); }, 120); };
    document.addEventListener("focusin", focusIn);
    document.addEventListener("focusout", focusOut);

    const etatMenu = (e: Event) => setMenuOuvert(!!(e as CustomEvent<boolean>).detail);
    window.addEventListener("lonodji:menu-state", etatMenu);
    return () => {
      window.removeEventListener("beforeinstallprompt", surInvite);
      window.removeEventListener("appinstalled", installee);
      window.removeEventListener("lonodji:install", installer);
      document.removeEventListener("focusin", focusIn);
      document.removeEventListener("focusout", focusOut);
      window.removeEventListener("lonodji:menu-state", etatMenu);
    };
  }, []);

  if (!appli) return null;
  const actif = ongletActif(pathname);
  return (
    <nav className="tabbar" aria-label="Onglets de l’application">
      {ONGLETS.map((o) => {
        const on = o.id === actif;
        return (
          <Link
            key={o.id}
            href={o.href}
            className={on ? "tab is-active" : "tab"}
            aria-current={on ? (pathname === o.href ? "page" : "true") : undefined}
            onClick={(e) => {
              // toucher l'onglet de la page où l'on est : retour en haut, comme dans une appli
              if (pathname === o.href && window.scrollY > 0) { e.preventDefault(); window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }
              window.dispatchEvent(new CustomEvent("lonodji:menu", { detail: false }));
            }}
          >
            <span className="tab-ico">{ICO[o.id]}</span><span className="tab-txt">{o.label}</span>
          </Link>
        );
      })}
      <button className={menuOuvert ? "tab tab--menu is-active" : "tab tab--menu"} type="button" aria-controls="mobile-menu" aria-expanded={menuOuvert} onClick={() => window.dispatchEvent(new CustomEvent("lonodji:menu", { detail: !menuOuvert }))}>
        <span className="tab-ico">{ICO.menu}</span><span className="tab-txt">{menuOuvert ? "Fermer" : "Menu"}</span>
      </button>
    </nav>
  );
}
