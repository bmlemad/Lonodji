"use client";

import Link from "@/components/lien";
import { useMemo, useState } from "react";

/* Recherche d'un village par son nom (sans tenir compte des accents), sur la
   liste des localités nommées passée par la page. */

export type EntreeVillage = { n: string; u: string; s: string; t: string; un: string };

function sansAccents(s: string) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }

export default function VillagesRecherche({ villages }: { villages: EntreeVillage[] }) {
  const [q, setQ] = useState("");
  const resultats = useMemo(() => {
    const t = sansAccents(q.trim());
    if (t.length < 2) return [];
    const r = villages.filter((v) => sansAccents(v.n).includes(t));
    r.sort((a, b) => (sansAccents(a.n).startsWith(t) === sansAccents(b.n).startsWith(t) ? a.n.localeCompare(b.n, "fr") : sansAccents(a.n).startsWith(t) ? -1 : 1));
    return r.slice(0, 40);
  }, [q, villages]);
  const actif = q.trim().length >= 2;
  return (
    <div className="vl-recherche">
      <label htmlFor="vl-q" className="vl-label">Le nom de votre village, de votre quartier, de votre canton</label>
      <input id="vl-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ex. Bébopen, Bédaya, Koumogo…" autoComplete="off" aria-controls={actif ? "vl-resultats" : undefined} aria-describedby="vl-aide" />
      <p id="vl-aide" className="vl-aide">{actif ? `${resultats.length === 40 ? "Plus de 40" : resultats.length} ${resultats.length === 1 ? "localité trouvée" : "localités trouvées"}${resultats.length === 40 ? " : précisez le nom" : ""}.` : `${villages.length.toLocaleString("fr-FR")} localités nommées, dans quatorze unités. Tapez au moins deux lettres.`}</p>
      {actif ? (
        <ul id="vl-resultats" className="vl-resultats">
          {resultats.map((v) => (
            <li key={`${v.u}/${v.s}`}><Link href={`/villages/${v.u}/${v.s}`}><strong>{v.n}</strong><span>{v.t} · {v.un}</span></Link></li>
          ))}
          {resultats.length === 0 ? <li className="vl-vide">Aucune localité de ce nom dans les données ouvertes. Elle existe sûrement : <a href="https://www.openstreetmap.org/#map=12/8.63/17.19" target="_blank" rel="noopener noreferrer">ajoutez-la sur OpenStreetMap</a>, ou <Link href="/participer#contact">écrivez-nous</Link> pour qu’elle apparaisse à la prochaine mise à jour.</li> : null}
        </ul>
      ) : null}
    </div>
  );
}
