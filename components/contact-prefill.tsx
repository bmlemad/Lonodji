"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

/** Présélectionne le formulaire de contact depuis l'URL : ?theme=09 (01-22, financement, communication), &coordo=1,
    et ?objet=odeb|presse|partenariat|question|donnees|autre (valeur data-objet des options du champ Objet). */
function ChampsContactPrefill() {
  const params = useSearchParams();
  useEffect(() => {
    const theme = params.get("theme");
    const direction = (params.get("direction") || "").toUpperCase();  // ?direction=I…VI : la vice-présidence d'un pilier
    const coordo = params.get("coordo");
    const adjoint = params.get("adjoint");  // ?adjoint=1 : se proposer comme adjoint d'une thématique prioritaire
    const objetDemande = (params.get("objet") || "").toLowerCase();
    if (!theme && !direction && !coordo && !adjoint && !objetDemande) return;
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
      // 01/10/2026 : les directions de pilier sont devenues des vice-présidences (l'ancien libellé reste reconnu)
      const opt = Array.from(pole.options).find((o) => [`vice-présidence du pilier ${direction.toLowerCase()} `, `direction du pilier ${direction.toLowerCase()} `].some((d) => o.text.trim().toLowerCase().startsWith(d)));
      if (opt) pole.value = opt.value || opt.text;
    }
    const cb = form.querySelector<HTMLInputElement>("input[name='candidature_coordo']");
    if (cb && coordo === "1") cb.checked = true;
    const message = form.querySelector<HTMLTextAreaElement>("textarea[name='message']");
    if (message && adjoint === "1" && !message.value) message.value = "Je me propose comme adjoint ou adjointe de cette thématique.";
    const anchor = document.getElementById("contact");
    if (anchor && !window.location.hash) anchor.scrollIntoView({ block: "start" });
  }, [params]);
  return null;
}

export default function ContactPrefill() {
  return <Suspense fallback={null}><ChampsContactPrefill /></Suspense>;
}
