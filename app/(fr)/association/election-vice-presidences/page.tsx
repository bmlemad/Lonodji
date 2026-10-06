import type { Metadata } from "next";
import { alternatesLangues } from "@/lib/langues";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { enLettres, getIndex, ogFor } from "@/lib/content";
import { college, dateFr, etape, etatElection, getElection, nombreAElire, periodeCandidatures } from "@/lib/election";
import { jsonLd, webPageSchema } from "@/lib/schema";

/* Élection des vice-présidences de pilier sans titulaire (décision 5 du 1er octobre 2026, procédure adoptée le même
   jour : registre 2026-33). Règles, calendrier, candidats et résultats : content/election.json. */
const ROUTE = "/association/election-vice-presidences";
const TITRE = "L’élection des vice-présidences de pilier";
const RESUME = `${nombreAElire(true)} vice-présidences de pilier à élire en octobre 2026 : qui peut se présenter, qui vote, comment, et quand. Procédure adoptée par le bureau exécutif le 1er octobre 2026.`;

export const metadata: Metadata = {
  title: "Élection des vice-présidences",
  description: RESUME,
  alternates: { canonical: ROUTE, languages: alternatesLangues(ROUTE) },
  openGraph: { ...ogFor(ROUTE), title: TITRE, description: RESUME },
};

export default function ElectionVicePresidences() {
  const e = getElection();
  const idx = getIndex();
  const poles = idx.structure.poles.filter((p) => e.poles.includes(p.roman));
  const n = college();
  const appel = etape("appel"), cloture = etape("cloture"), vote = etape("vote");
  return (
    <main id="main-content" className="hub-page gl-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", ...webPageSchema({ url: ROUTE, name: TITRE, description: RESUME, lang: "fr" }) }) }} />
      <PageHeader
        eyebrow="L’association · élection"
        title={`${enLettres(poles.length, true)} vice-présidences`}
        em={e.resultats ? `élues le ${dateFr(vote.date)}.` : "à élire en octobre 2026."}
        lead={`Depuis le 1er octobre 2026, chaque pilier est conduit par un vice-président délégué ou une vice-présidente déléguée, élu. Les piliers ${poles.map((p) => p.roman).join(", ").replace(/, ([^,]+)$/, " et $1")} n’ont pas encore le leur. Le bureau exécutif a adopté le même jour la procédure ci-dessous : candidatures ${periodeCandidatures()}, vote le ${dateFr(vote.date)}.`}
        crumbs={[{ label: "L’association", href: "/mission" }, { label: "Décisions d’organisation", href: "/association/propositions-organisation" }, { label: "Élection" }]}
        pills={[`Adoptée le ${dateFr(e.adoptee)}`, etatElection(), `Collège de ${n} personnes`]}
      />
      <Stats items={[
        { value: String(poles.length), label: "vice-présidences à pourvoir", note: poles.map((p) => `pilier ${p.roman}`).join(", ") },
        { value: dateFr(cloture.date, false), label: "clôture des candidatures", note: `ouvertes le ${dateFr(appel.date)}` },
        { value: dateFr(vote.date, false), label: "jour du vote", note: "sur place et à distance" },
        { value: String(n), label: "membres du collège électoral", note: "bureau, vice-présidences en fonction, coordonnateurs" },
      ]} />

      <section className="hub-section" id="postes">
        <SectionHead eyebrow="Les postes" title={`${enLettres(poles.length, true)} piliers,`} em={`${enLettres(poles.length)} élus.`} text="Le vice-président délégué ou la vice-présidente déléguée réunit chaque trimestre les coordonnateurs et coordonnatrices des thématiques de son pilier, tient son plan d’action et son calendrier, suit ses plaidoyers et ses projets, et rend compte au bureau et à l’assemblée. Fonction bénévole, ouverte au Tchad comme dans la diaspora ; les candidatures de femmes sont particulièrement attendues." />
        <ul className="postes-grille">
          {poles.map((p) => (
            <li key={p.id} className="poste poste-vice-presidence">
              <span className="poste-genre">Pilier {p.roman}</span>
              <h3>{p.name}</h3>
              <p className="poste-pole">{p.items.map((t) => `${t.number}. ${t.name}`).join(" · ")}</p>
              <p className="poste-actions">
                <a className="button primary" href={`/participer?direction=${p.roman}&coordo=1#contact`}>Je me porte candidat</a>
                <a className="text-link" href={`/missions/fiche-mission-direction-${p.id}.pdf`}>Fiche de mission <span className="sr-only">(PDF)</span></a>
              </p>
            </li>
          ))}
        </ul>
        <p className="lg-footnote">Trois façons de se porter candidat : le formulaire en ligne (le bouton le remplit pour le pilier choisi), la <a href="/organisation/fiche-candidature-vice-presidence.pdf">fiche papier</a> remise au secrétariat général, ou un message WhatsApp au contact officiel de l’association (page <Link href="/participer#contact">Participer</Link>).</p>
      </section>

      <section className="hub-section" id="calendrier">
        <SectionHead eyebrow="Le calendrier" title="Du premier appel" em="aux résultats." />
        <div className="ob-table-wrap" tabIndex={0} role="region" aria-label="Calendrier de l’élection">
          <table className="ob-table">
            <thead><tr><th scope="col">Date</th><th scope="col">Étape</th></tr></thead>
            <tbody>{e.calendrier.map((s) => <tr key={s.cle}><th scope="row" className="nowrap">{dateFr(s.date)}</th><td>{s.quoi}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="hub-section" id="regles">
        <SectionHead eyebrow="Les règles" title="Les règles" em="du vote." text={`Les ${enLettres(e.regles.length)} règles adoptées par le bureau exécutif le ${dateFr(e.adoptee)}.`} />
        <div className="ob-table-wrap" tabIndex={0} role="region" aria-label="Règles de l’élection">
          <table className="ob-table ob-table--empile">
            <thead><tr><th scope="col">Point</th><th scope="col">Règle</th><th scope="col">À savoir</th></tr></thead>
            <tbody>{e.regles.map((r) => <tr key={r.point}><th scope="row">{r.point}</th><td>{r.texte.replace("{college}", enLettres(n))}</td><td data-label="À savoir">{r.note}</td></tr>)}</tbody>
          </table>
        </div>
        <h3 className="el-sous-titre">Qui organise</h3>
        <ul className="el-liste">{e.organisation.map((o) => <li key={o}>{o}</li>)}</ul>
      </section>

      {e.resultats ? (
        <section className="hub-section" id="resultats">
          <SectionHead eyebrow="Les résultats" title="Le vote du" em={`${dateFr(vote.date)}.`} text={`Recopiés du procès-verbal${e.pv ? ` signé le ${dateFr(e.pv)}` : " signé"}, conservé par le secrétariat général. Réclamations au bureau jusqu’au ${dateFr(etape("reclamations").date)} ; la prochaine assemblée générale confirme les élus.`} />
          <div className="ob-table-wrap" tabIndex={0} role="region" aria-label="Résultats de l’élection">
            <table className="ob-table ob-table--empile">
              <thead><tr><th scope="col">Pilier</th><th scope="col">Élu ou élue</th><th scope="col">Votants</th><th scope="col">Suffrages exprimés</th><th scope="col">Voix</th></tr></thead>
              <tbody>{e.resultats.map((r) => {
                const p = idx.structure.poles.find((x) => x.roman === r.pole);
                return <tr key={r.pole}><th scope="row">Pilier {r.pole}{p ? ` — ${p.name}` : ""}</th><td>{r.elu || "Personne n’est élu"}{r.note ? <><br /><small>{r.note}</small></> : null}</td><td data-label="Votants">{r.votants}</td><td data-label="Suffrages exprimés">{r.exprimes}{r.blancs ? ` (et ${r.blancs} blanc${r.blancs > 1 ? "s" : ""})` : ""}</td><td data-label="Voix">{(r.voix ?? []).map((v) => `${v.nom} : ${v.voix}`).join(" ; ")}{r.tour && r.tour > 1 ? ` (${r.tour}e tour)` : ""}</td></tr>;
              })}</tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="hub-section" id="candidats">
        <SectionHead eyebrow="Les candidats" title={e.candidats.length ? `${enLettres(e.candidats.length, true)} candidature${e.candidats.length > 1 ? "s" : ""}` : "La liste des candidats"} em={e.candidats.length ? "retenues." : `le ${dateFr(etape("liste").date)}.`} text={e.candidats.length ? "Avec l’accord de chacun : nom, pilier et présentation." : "Elle sera publiée ici après vérification par le bureau, avec l’accord de chaque candidat : nom, pilier et présentation d’une page. Aucune autre donnée personnelle n’est publiée."} />
        {e.candidats.length ? (
          <div className="link-list">{e.candidats.map((c) => <div key={c.nom} className="el-candidat"><small>Pilier {c.pole}</small><strong>{c.nom}</strong><span>{c.presentation}</span></div>)}</div>
        ) : null}
      </section>

      <section className="hub-section" id="documents">
        <SectionHead eyebrow="Documents" title="À imprimer," em="à faire circuler." />
        <div className="link-list">
          <a href="/organisation/election-vice-presidences-2026.pdf"><small>PDF · A4</small><strong>La procédure et l’appel à candidatures</strong><span>Les règles, le calendrier, l’appel et la fiche de candidature, tels qu’adoptés le {dateFr(e.adoptee)}.</span></a>
          <a href="/partage/election-vice-presidences.png" download><small>Image carrée · WhatsApp, Facebook</small><strong>Le visuel de l’élection</strong><span>À partager avec le lien de cette page, dans les groupes de Bédjondo et de la diaspora.</span></a>
          <a href="/organisation/fiche-candidature-vice-presidence.pdf"><small>PDF · une page</small><strong>La fiche de candidature</strong><span>À remplir et à remettre au secrétariat général, ou à photographier et envoyer par WhatsApp.</span></a>
          <Link href="/programmes/fiches-de-mission"><small>Fiches de mission</small><strong>Ce que fait chaque vice-présidence</strong><span>Une fiche par pilier, avec ses thématiques et ses coordonnateurs.</span></Link>
          <Link href="/transparence/decisions"><small>Registre · 2026-33</small><strong>La décision du bureau</strong><span>Inscrite au registre public des décisions ; les résultats y entreront le {dateFr(etape("resultats").date)}.</span></Link>
        </div>
      </section>

      <Partager route={ROUTE} titre={TITRE} texte={`${nombreAElire()} vice-présidences de pilier à élire : candidatures ${periodeCandidatures()}, vote le ${dateFr(vote.date)}`} />
    </main>
  );
}
