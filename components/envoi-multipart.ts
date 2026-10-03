"use client";

import { useRef, useState } from "react";

/* Envoi d'un formulaire Netlify avec pièce jointe (multipart), sans quitter la
   page : état, contrôle de la taille du fichier (10 Mo), messages. Partagé par
   les formulaires témoignage, dépôt de document et mot nangnda. */

export const TAILLE_MAX = 10 * 1024 * 1024;

export function useEnvoiMultipart(telephone: string) {
  const [etat, setEtat] = useState<"pret" | "envoi" | "ok" | "erreur">("pret");
  const [erreur, setErreur] = useState("");
  const [fichier, setFichier] = useState("");
  const form = useRef<HTMLFormElement>(null);

  function surFichier(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) { setFichier(""); setErreur(""); return; }
    if (f.size > TAILLE_MAX) {
      setErreur(`Ce fichier fait ${(f.size / 1048576).toFixed(1)} Mo : la limite est de 10 Mo. Réduisez-le, ou envoyez-le par WhatsApp.`);
      e.target.value = ""; setFichier(""); return;
    }
    setErreur(""); setFichier(`${f.name} · ${(f.size / 1048576).toFixed(1)} Mo`);
  }

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.current) return;
    setEtat("envoi"); setErreur("");
    try {
      const res = await fetch("/__forms.html", { method: "POST", body: new FormData(form.current) });
      if (!res.ok) throw new Error(String(res.status));
      setEtat("ok");
    } catch {
      setEtat("erreur");
      setErreur(`L’envoi n’a pas abouti. Réessayez dans un instant, ou envoyez-le par WhatsApp (lien ci-dessous).`);
    }
  }

  return { etat, erreur, fichier, form, surFichier, envoyer };
}
