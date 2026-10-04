"use client";

import RetourFormulaire from "@/components/retour-formulaire";

import { useState } from "react";

const T = {
  fr: { merci: "Merci ! Votre adresse est enregistrée pour la lettre d’information.", label: "Lettre d’information", email: "Adresse e-mail", placeholder: "votre@e-mail.com", envoyer: "S’abonner",
    accord: "J’accepte que mon adresse soit conservée pour la lettre, chez notre hébergeur aux États-Unis.", droits: "Données et droits", erreur: "L’envoi n’a pas abouti ; réessayez dans un instant." },
  en: { merci: "Thank you! Your address is registered for the newsletter.", label: "Newsletter", email: "E-mail address", placeholder: "you@example.com", envoyer: "Subscribe",
    accord: "I agree that my address is kept for the newsletter, with our host in the United States.", droits: "Data and rights (in French)", erreur: "Sending failed; please try again in a moment." },
};

/* Formulaire d'abonnement du pied de page (Netlify « lettre-info-pied »), en français ou en anglais : mêmes champs. */
export default function NewsletterForm({ id = "footer-nl-email", label, lang = "fr" }: { id?: string; label?: string; lang?: "fr" | "en" } = {}) {
  const t = T[lang];
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  return state === "done" ? (
    <RetourFormulaire className="footer-consent" role="status">{t.merci}</RetourFormulaire>
  ) : (
    <form
      name="lettre-info-pied"
      method="POST"
      action="/__forms.html"
      aria-label={label ?? t.label}
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        setState("sending");
        try {
          const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>);
          const res = await fetch("/__forms.html", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
          if (!res.ok) throw new Error(String(res.status));
          setState("done");
        } catch {
          setState("error");
        }
      }}
    >
      <input type="hidden" name="form-name" value="lettre-info-pied" />
      <input type="text" name="_honey" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />
      <label className="sr-only" htmlFor={id}>{t.email}</label>
      <div className="footer-nl">
        <input id={id} type="email" name="email" required autoComplete="email" placeholder={t.placeholder} />
        <button type="submit" disabled={state === "sending"}>{state === "sending" ? "…" : t.envoyer}</button>
      </div>
      <label className="footer-consent"><input type="checkbox" name="consentement" value="oui" required /> {t.accord} <a href="/mentions-legales#donnees" hrefLang="fr">{t.droits}</a></label>
      {state === "error" ? <RetourFormulaire className="footer-consent" role="alert">{t.erreur}</RetourFormulaire> : null}
    </form>
  );
}
