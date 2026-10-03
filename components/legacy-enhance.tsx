"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window { __initGeo?: () => void; __initTrouver?: () => void; __initGenealogie?: () => void }
}

const INIT: Record<string, keyof Window> = { "/geo.js": "__initGeo", "/trouver.js": "__initTrouver", "/genealogie.js": "__initGenealogie" };

/**
 * Améliorations côté navigateur du contenu importé :
 * - envoi des formulaires Netlify sans quitter la page, avec accusé de réception ;
 * - initialisation de la carte du pays bedjond (geo.js) quand la page en contient une.
 */
export default function LegacyEnhance({ hasMap = false, hasForms = false, scripts = [] }: { hasMap?: boolean; hasForms?: boolean; scripts?: string[] }) {
  const done = useRef(false);

  useEffect(() => {
    if (!hasForms || done.current) return;
    done.current = true;
    const forms = Array.from(document.querySelectorAll<HTMLFormElement>(".legacy form[action='/__forms.html']"));
    const cleanups = forms.map((form) => {
      const handler = async (event: SubmitEvent) => {
        event.preventDefault();
        const button = form.querySelector<HTMLButtonElement>("button[type=submit], input[type=submit]");
        const label = button?.textContent;
        // formulaires des pages anglaises : messages en anglais
        const en = !!form.closest('[lang="en"]');
        if (button) { button.disabled = true; button.textContent = en ? "Sending…" : "Envoi…"; }
        try {
          const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>);
          const res = await fetch("/__forms.html", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
          if (!res.ok) throw new Error(String(res.status));
          const note = document.createElement("p");
          note.className = "form-note form-success";
          note.setAttribute("role", "status");
          note.textContent = en
            ? "Thank you, your message has been sent. If you left a way to reach you, you will receive an acknowledgement within 48 working hours."
            : "Merci, votre message est bien parti. Vous recevrez un accusé de réception sous 48 heures ouvrées si vous avez laissé un moyen de vous joindre.";
          form.replaceWith(note);
          // le formulaire disparaît : le focus passe sur l'accusé de réception (sinon il retombe sur <body>)
          note.tabIndex = -1;
          note.focus();
        } catch {
          if (button) { button.disabled = false; button.textContent = label ?? (en ? "Send" : "Envoyer"); }
          let err = form.querySelector<HTMLElement>(".form-error");
          if (!err) {
            err = document.createElement("p");
            err.className = "form-note form-error";
            err.setAttribute("role", "alert");
            form.appendChild(err);
          }
          err.textContent = en
            ? `Your message could not be sent. Please try again in a moment, or write to us on WhatsApp (link at the bottom of the page).`
            : `L’envoi n’a pas abouti. Réessayez dans un instant, ou écrivez-nous par WhatsApp (lien en bas de page).`;
        }
      };
      form.addEventListener("submit", handler);
      return () => form.removeEventListener("submit", handler);
    });
    return () => { cleanups.forEach((c) => c()); done.current = false; };
  }, [hasForms]);

  // ?localite=Nom ou ?lieu=Nom (depuis la carte et les fiches des villages) : préremplit le champ
  // « localité » (signalement, lieu sacré…) ou « lieu » (mesure de débit) du formulaire de la page
  useEffect(() => {
    if (!hasForms) return;
    const q = new URLSearchParams(window.location.search);
    const localite = q.get("localite"); const lieu = q.get("lieu");
    if (!localite && !lieu) return;
    const champ = localite
      ? document.querySelector<HTMLInputElement>(".legacy form input[name='localite']")
      : document.querySelector<HTMLInputElement>(".legacy form input[name='lieu']");
    if (!champ) return;
    champ.value = (localite || lieu || "").slice(0, 120);
    const t = setTimeout(() => { champ.closest("form")?.scrollIntoView({ behavior: "smooth", block: "start" }); champ.focus({ preventScroll: true }); }, 350);
    return () => clearTimeout(t);
  }, [hasForms]);

  const srcs = [...(hasMap ? ["/geo.js"] : []), ...scripts];
  if (!srcs.length) return null;
  return (
    <>
      {srcs.map((src) => (
        <Script key={src} src={src} strategy="afterInteractive" onReady={() => { const fn = window[INIT[src]] as unknown as (() => void) | undefined; fn?.(); }} />
      ))}
    </>
  );
}
