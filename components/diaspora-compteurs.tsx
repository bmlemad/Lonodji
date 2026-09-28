"use client";

import { useEffect, useState } from "react";
import type { Compte, Releve } from "../lib/indicateurs";
import { DOMAINES } from "../lib/diaspora";

/* Compteurs du répertoire des compétences : inscrits (par personne), pays et
   domaines représentés. Rien de nominatif : des nombres, relevés à la mise en
   ligne puis en direct quand /api/indicateurs y a accès. */

const nf = new Intl.NumberFormat("fr-FR");

function dateLongue(iso: string) {
  return new Date(iso + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function DiasporaCompteurs({ releve, vacantes }: { releve: Releve; vacantes: number }) {
  const [etat, setEtat] = useState<Releve>({ ...releve, live: false });

  useEffect(() => {
    const ctrl = new AbortController();
    fetch("/api/indicateurs", { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { formulaires?: Releve } | null) => { if (j?.formulaires?.live) setEtat(j.formulaires); })
      .catch(() => { /* hors ligne : on garde le relevé daté */ });
    return () => ctrl.abort();
  }, []);

  const c: Compte = etat.comptes["diaspora-competences"] ?? { envois: 0 };
  const inscrits = c.personnes ?? c.envois;
  const domaines = Object.entries(c.domaines ?? {}).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]);
  const nomDomaine = (cle: string) => DOMAINES.find(([k]) => k === cle)?.[1] ?? cle;

  return (
    <div className="stat-row dp-compteurs" role="group" aria-label="Où en est le répertoire">
      <div className="stat-tile">
        <strong>{nf.format(inscrits)}</strong>
        <span>{inscrits === 1 ? "personne inscrite" : "personnes inscrites"}</span>
        <small>{etat.live ? "compteur en direct" : `relevé du ${dateLongue(etat.date)}`}</small>
      </div>
      <div className="stat-tile">
        <strong>{c.pays != null ? nf.format(c.pays) : "—"}</strong>
        <span>{c.pays === 1 ? "pays représenté" : "pays représentés"}</span>
        <small>{c.pays != null ? "d’après le pays de résidence déclaré" : "compté dès la première inscription"}</small>
      </div>
      <div className="stat-tile">
        <strong>{domaines.length ? nf.format(domaines.length) : "—"}</strong>
        <span>{domaines.length === 1 ? "domaine représenté" : "domaines représentés"}</span>
        <small>{domaines.length ? domaines.slice(0, 3).map(([k]) => nomDomaine(k)).join(" · ") : `sur ${DOMAINES.length - 1} domaines proposés`}</small>
      </div>
      <div className="stat-tile">
        <strong>{nf.format(vacantes)}</strong>
        <span>thématiques sans coordonnateur</span>
        <small>où une compétence changerait la donne</small>
      </div>
    </div>
  );
}
