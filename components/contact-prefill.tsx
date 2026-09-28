"use client";

import { useEffect } from "react";

/** Présélectionne le formulaire de contact depuis l'URL : ?theme=09 (01-19, financement, communication), &coordo=1,
    et ?objet=odeb|presse|partenariat|question|donnees|autre (valeur data-objet des options du champ Objet). */
export default function ContactPrefill() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const theme = params.get("theme");
    const direction = (params.get("direction") || "").toUpperCase();  // ?direction=I|II|III|IV : la direction d'un pôle
    const coordo = params.get("coordo");
    const objetDemande = (params.get("objet") || "").toLowerCase();
    if (!theme && !direction && !coordo && !objetDemande) return;
    const form = document.querySelector<HTMLFormElement>("form[name='contact'], form#formulaire-contact");
    if (!form) return;
    const objet = form.querySelector<HTMLSelectElement>("select[name='objet']");
    if (objet) {
      const voulu = objetDemande === "presse" ? "partenariat" : objetDemande || "thematique";
      const opt = Array.from(objet.options).find((o) => o.dataset.objet === voulu) ?? (objetDemande ? undefined : Array.from(objet.options).find((o) => o.dataset.objet === "thematique"));
      if (opt) objet.value = opt.value || opt.text;
    }
    const pole = form.querySelector<HTMLSelectElement>("select[name='pole']");
    if (pole && theme) {
      const key = theme.toLowerCase();
      const opt = Array.from(pole.options).find((o) => {
        const t = o.text.trim().toLowerCase();
        return /^\d{2}\./.test(t) ? t.startsWith(key.padStart(2, "0") + ".") : t.startsWith(key);
      });
      if (opt) pole.value = opt.value || opt.text;
    }
    if (pole && direction) {
      const opt = Array.from(pole.options).find((o) => o.text.trim().toLowerCase().startsWith(`direction du pôle ${direction.toLowerCase()} `));
      if (opt) pole.value = opt.value || opt.text;
    }
    const cb = form.querySelector<HTMLInputElement>("input[name='candidature_coordo']");
    if (cb && coordo === "1") cb.checked = true;
    const anchor = document.getElementById("contact");
    if (anchor && !window.location.hash) anchor.scrollIntoView({ block: "start" });
  }, []);
  return null;
}
