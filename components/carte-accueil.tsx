import fs from "node:fs";
import path from "node:path";
import { GROUPES, getVillages, ORDRE_GROUPES } from "@/lib/villages";

/* Carte cliquable du pays bedjond, au cœur de l'accueil : chaque unité mène à ses villages (/villages/<unité>).
   Tracés : content/territoire-carte.json (scripts/build-territoire-svg.py, d'après la carte du territoire, GADM 4.1).
   Le nom et le nombre de localités apparaissent au survol et au focus clavier ; Bédjondo reste marquée. */
type Carte = { largeur: number; hauteur: number; bedjondo: [number, number]; unites: { id: string; nom: string; groupe: string; d: string; cx: number; cy: number }[] };

export default function CarteAccueil() {
  const carte: Carte = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "territoire-carte.json"), "utf8"));
  const v = getVillages().unites;
  const fr = new Intl.NumberFormat("fr-FR");
  const [bx, by] = carte.bedjondo;
  return (
    <figure className="acc-carte">
      <svg viewBox={`0 0 ${carte.largeur} ${carte.hauteur}`} role="group" aria-label="Carte du pays bedjond : choisissez une unité pour voir ses villages">
        {carte.unites.map((u) => {
          const n = v[u.id]?.comptes.nommes ?? 0;
          return (
            <a key={u.id} href={`/villages/${u.id}`} data-u={u.id} className={`acc-unite acc-unite--${u.groupe}`} aria-label={`${u.nom} : ${fr.format(n)} localités nommées`}>
              <path d={u.d} />
            </a>
          );
        })}
        <g className="acc-bedjondo" aria-hidden="true">
          <circle cx={bx} cy={by} r="18" className="acc-bedjondo-halo" />
          <circle cx={bx} cy={by} r="6.5" />
          <text x={bx + 20} y={by + 34}>Bédjondo</text>
        </g>
        {/* étiquettes au premier plan : une par unité, montrée par la règle :has() ci-dessous */}
        <g aria-hidden="true">
          {carte.unites.map((u) => {
            const n = v[u.id]?.comptes.nommes ?? 0;
            const gauche = u.cx > carte.largeur * 0.7;
            return (
              <g key={u.id} data-u={u.id} className="acc-etiquette" transform={`translate(${u.cx} ${u.cy})`}>
                <text textAnchor={gauche ? "end" : "start"} x={gauche ? -14 : 14} y={-6}>{u.nom}</text>
                <text className="acc-etiquette-n" textAnchor={gauche ? "end" : "start"} x={gauche ? -14 : 14} y={20}>{fr.format(n)} localités</text>
                <circle r="5" />
              </g>
            );
          })}
        </g>
        <style>{carte.unites.map((u) => `.acc-carte svg:has([data-u="${u.id}"]:is(:hover,:focus)) .acc-etiquette[data-u="${u.id}"]{opacity:1}`).join("")}</style>
      </svg>
      <figcaption>
        <ul className="acc-legende">
          {ORDRE_GROUPES.map((g) => <li key={g} className={`acc-legende--${g}`}>{GROUPES[g]}</li>)}
        </ul>
      </figcaption>
    </figure>
  );
}
