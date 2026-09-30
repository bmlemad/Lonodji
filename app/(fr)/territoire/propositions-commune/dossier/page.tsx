import type { Metadata } from "next";
import { getIndex, ORG } from "@/lib/content";
import { programmeParId } from "@/lib/bailleurs";
import { APPORTS, DEMARCHE, EN_RETOUR, GROUPES, PORTEURS, PROJET_INTEGRE, PROJETS_PRIORITAIRES, REGLES_DEMARCHE } from "@/lib/propositions-commune";

/* Version imprimable de /territoire/propositions-commune (30/09/2026) : le dossier remis au maire, au préfet
   et aux chefs de canton. Mêmes données que la page (lib/propositions-commune.ts), en tableaux compacts ;
   le PDF est tiré de cette page par scripts/build-propositions-pdf.py. Hors menu, non indexée. */
export const metadata: Metadata = {
  title: "Dossier imprimable — nos propositions à la commune de Bédjondo",
  robots: { index: false, follow: true },
  alternates: { canonical: "/territoire/propositions-commune" },
};

const court = (s: string) => s.replace(/^./, (c) => c.toUpperCase());

export default function DossierCommune() {
  const note = getIndex().plaidoyers.find((p) => p.id === "plaidoyer-commune");
  const total = GROUPES.reduce((n, g) => n + g.items.length, 0);
  return (
    <main id="main-content" className="dossier-print">
      <header className="dp-tete">
        <img src="/icones/logo-motif-verre.svg" alt="" width={46} height={52} />
        <div>
          <p className="dp-org"><b>ADEB LONODJI</b> — Association de Développement et d’Entraide de Bédjondo</p>
          <p className="dp-sous">Bédjondo · Mandoul Occidental · Tchad · lonodji.org</p>
        </div>
      </header>
      <h1>Nos propositions à la commune de Bédjondo</h1>
      <p className="dp-lead">Dix projets prioritaires, le projet intégré que nous recommandons, notre démarche avec la commune et les autorités locales, puis les {total} mesures déjà publiées dans nos dossiers. Ce sont des propositions à débattre avec la commune : aucun projet n’a encore d’étude, de budget ni de financement. Version en ligne, avec toutes les sources : lonodji.org/territoire/propositions-commune. Note à la commune publiée le {note?.published ?? "16 septembre 2026"}.</p>

      <h2>1. Dix projets prioritaires</h2>
      <table className="dp-table">
        <thead><tr><th>Projet</th><th>Ce qu’il comprend</th><th>Ce que LONODJI pourrait apporter</th><th>Programmes à rapprocher</th></tr></thead>
        <tbody>
          {PROJETS_PRIORITAIRES.map((p, i) => (
            <tr key={p.id}>
              <td><b>{i + 1}. {p.titre}</b>{p.porteur ? <span className="dp-porteur">parmi les plus porteurs</span> : null}</td>
              <td>{p.volets.join(" ; ")}.</td>
              <td>{p.apport.length ? p.apport.map((a) => court(a.texte)).join(" ; ") + "." : <i>À définir avec la thématique concernée.</i>}</td>
              <td>{p.programmes.map(programmeParId).filter((x) => x !== undefined).map((g) => g.nom.split(" — ")[0]).join(" ; ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="dp-deux">
        <div><p className="dp-titre">Les plus porteurs pour un financement</p><ol>{PORTEURS.map((x) => <li key={x.titre}>{x.titre}</li>)}</ol></div>
        <div className="dp-encadre"><p className="dp-titre">Notre recommandation : {PROJET_INTEGRE.titre.toLowerCase()}</p><p>Réunir {PROJET_INTEGRE.composantes.slice(0, -1).join(", ")} et {PROJET_INTEGRE.composantes[PROJET_INTEGRE.composantes.length - 1]} dans un seul projet, porté par la commune et inscrit au plan de développement communal. {PROJET_INTEGRE.pourquoi}</p></div>
      </div>

      <h2>2. Notre démarche avec la commune et les autorités locales</h2>
      <ol className="dp-etapes">
        {DEMARCHE.map((d) => <li key={d.etape}><b>{d.etape}</b> <span className="dp-etat">{d.etat}</span> — {d.texte}</li>)}
      </ol>
      <p className="dp-regles"><b>Quatre règles tout du long :</b> {REGLES_DEMARCHE.join(" ")}</p>

      <h2>3. Les mesures déjà publiées, en six chantiers</h2>
      {GROUPES.map((g, i) => (
        <section key={g.id} className="dp-chantier">
          <h3>{String.fromCharCode(65 + i)}. {g.titre.replace(/[,:]$/, "")} {g.em}</h3>
          <ol>{g.items.map((p) => <li key={p.texte}>{p.texte}{p.sansDepense ? <span className="dp-decision"> — une décision, sans dépense</span> : null}</li>)}</ol>
        </section>
      ))}

      <h2>4. Ce que l’association apporte, et ce qu’elle demande en retour</h2>
      <div className="dp-deux dp-deux--inverse">
        <ol>{APPORTS.map((p) => <li key={p.texte}>{p.texte}</li>)}</ol>
        <div className="dp-encadre"><p className="dp-titre">En retour, nous demandons</p><ul>{EN_RETOUR.map((t) => <li key={t}>{t}</li>)}</ul></div>
      </div>

      <p className="dp-contact"><b>Contact</b> — Adoumbé MAOURA, président : {ORG.phone} (appel et WhatsApp) · point focal à Bédjondo : …………………………… · lonodji.org</p>
    </main>
  );
}
