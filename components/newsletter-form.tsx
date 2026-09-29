"use client";

import { useState } from "react";

export default function NewsletterForm({ id = "footer-nl-email", label = "Lettre d’information" }: { id?: string; label?: string } = {}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  return state === "done" ? (
    <p className="footer-consent" role="status">Merci ! Votre adresse est enregistrée pour la lettre d’information.</p>
  ) : (
    <form
      name="lettre-info-pied"
      method="POST"
      action="/__forms.html"
      aria-label={label}
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
      <label className="sr-only" htmlFor={id}>Adresse e-mail</label>
      <div className="footer-nl">
        <input id={id} type="email" name="email" required autoComplete="email" placeholder="votre@e-mail.com" />
        <button type="submit" disabled={state === "sending"}>{state === "sending" ? "…" : "S’abonner"}</button>
      </div>
      <label className="footer-consent"><input type="checkbox" name="consentement" value="oui" required /> J’accepte que mon adresse soit conservée pour la lettre, chez notre hébergeur aux États-Unis. <a href="/mentions-legales#donnees">Données et droits</a></label>
      {state === "error" ? <p className="footer-consent" role="alert">L’envoi n’a pas abouti ; réessayez dans un instant.</p> : null}
    </form>
  );
}
