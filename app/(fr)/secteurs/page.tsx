import { alternatesLangues } from "@/lib/langues";
import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats, VuesThematiques } from "@/components/blocks";
import { ogFor } from "@/lib/content";
import { thematiquesParId } from "@/lib/odeb-chiffres";
import { ETATS_SECTEUR, GROUPES_SECTEURS, NON_COUVERTS, SECTEURS } from "@/lib/secteurs";

export const metadata: Metadata = {
  title: "Secteurs d’intervention et thématiques",
  description: "Nos vingt et une thématiques dans la langue des ONG : dix-sept secteurs (WASH, santé, nutrition, éducation, urgences, protection), clusters, codes CAD et ODD.",
  alternates: { canonical: "/secteurs", languages: alternatesLangues("/secteurs") },
  openGraph: { ...ogFor("/secteurs"), title: "Secteurs d’intervention : WASH, santé, nutrition et urgences", description: "Dix-sept secteurs des ONG, nos vingt et une thématiques, ce qui est publié et ce qui n’est qu’une piste." },
};

export default function Secteurs() {
  const th = thematiquesParId();
  const faites = SECTEURS.flatMap((s) => s.activites).filter((a) => a.etat === "fait").length;
  const pistes = SECTEURS.flatMap((s) => s.activites).filter((a) => a.etat === "piste").length;
  const nouveaux = SECTEURS.filter((s) => s.etat !== "couvert").length;
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Nos actions · secteurs d’intervention"
        title="WASH, santé, urgences…"
        em="nos thématiques dans la langue des ONG."
        lead="Les partenaires du développement et de l’aide classent le travail par secteurs — les clusters humanitaires, les codes du Comité d’aide au développement de l’OCDE, les Objectifs de développement durable. Voici les vingt et une thématiques de l’association rangées dans ces secteurs, avec pour chacun ce qui est déjà publié (un lien vers la page, le document ou le formulaire — pas une activité réalisée sur le terrain) et ce qui n’est encore qu’une piste. Rien n’est chiffré ni financé à ce jour."
        crumbs={[{ label: "Nos actions", href: "/programmes" }, { label: "Secteurs d’intervention" }]}
        pills={[`${SECTEURS.length} secteurs`, "21 thématiques", `${nouveaux} élargis ou nouveaux le 29 septembre 2026`, `${NON_COUVERTS.length} secteurs non couverts, dits`]}
      />
      <VuesThematiques active="secteurs" />
      <Stats items={[
        { value: String(SECTEURS.length), label: "secteurs de rattachement", note: "des services essentiels aux urgences, avec leurs thématiques" },
        { value: String(faites), label: "pages ou outils publiés", note: "une page, un document ou un formulaire existe ; ce n’est pas une activité réalisée sur le terrain" },
        { value: String(pistes), label: "pistes", note: "envisagées, ni engagées ni chiffrées" },
        { value: String(NON_COUVERTS.length), label: "secteurs non couverts", note: "abris, camps, logistique : l’association oriente" },
      ]} />

      <section className="hub-section" id="correspondance">
        <SectionHead eyebrow="En un tableau" title="Secteur, thématiques," em="cadre de référence." text="Pour un bailleur ou une ONG partenaire : le secteur, son étiquette usuelle, les thématiques qui le portent, le cluster, le code CAD et l’ODD de référence." />
        <div className="ob-table-wrap">
          <table className="sec-table">
            <thead><tr><th scope="col">Secteur</th><th scope="col">Thématiques</th><th scope="col">Cluster</th><th scope="col">CAD</th><th scope="col">ODD</th><th scope="col">État</th></tr></thead>
            <tbody>
              {SECTEURS.map((s) => (
                <tr key={s.id}>
                  <th scope="row"><a href={`#${s.id}`}>{s.nom}</a><small>{s.sigle}</small></th>
                  <td>{s.thematiques.map((id) => th[id] ? <span key={id} className="sec-num" title={th[id].name}>{th[id].number}</span> : null)}</td>
                  <td>{s.cadre.clusterFr ?? s.cadre.cluster ?? "—"}</td>
                  <td>{s.cadre.cadFr ?? s.cadre.cad}</td>
                  <td>{s.cadre.odd}{s.cadre.reference ? <small>{s.cadre.reference}</small> : null}</td>
                  <td><span className={`sec-etat sec-etat--${s.etat}`}>{s.etat === "couvert" ? "Couvert" : s.etat === "elargi" ? "Élargi" : "Nouveau"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="lg-footnote">La colonne Cluster indique le groupe de coordination humanitaire de référence (IASC) ; ADEB LONODJI n’est membre d’aucun cluster à ce jour. État des activités : <b>Publié</b> — une page, un document ou un formulaire existe ; ce n’est pas une activité réalisée sur le terrain. <b>Piste</b> — envisagée, ni engagée ni chiffrée. Qui finance aujourd’hui ces secteurs au Tchad, et dans le Mandoul : <Link href="/bailleurs">les programmes des bailleurs, et où nous nous raccrochons</Link>.</p>
      </section>

      <section className="hub-section" id="principes">
        <SectionHead eyebrow="Comment nous intervenons" title="Nos principes" em="d’intervention." text="Ce que les pages de l’association engagent déjà, rassemblé ici pour un partenaire. Rien de nouveau : chaque principe renvoie à la page qui l’énonce." />
        <div className="detail-grid">
          <article><span>01</span><h3>Sans distinction</h3><p>Les actions de développement servent tous les habitants de Bédjondo, sans distinction d’origine ; l’adhésion et les coordinations ne peuvent être refusées en raison du sexe, de l’âge, du village, de la religion ou du handicap. <Link href="/transparence#a-qui-lassociation-est-ouverte">La charte</Link></p></article>
          <article><span>02</span><h3>Ne pas nuire</h3><p>Aucune collecte avant un compte au nom de l’association ; rien n’est publié sur les lieux sacrés et les sépultures ; aucun enfant identifiable dans un témoignage ; en cas de crise, informer et orienter plutôt que doubler l’État et les agences. <Link href="/patrimoine/lieux-sacres">Lieux sacrés</Link> · <Link href="/transparence#ce-que-nous-protegeons-et-comment">Ce que nous protégeons</Link></p></article>
          <article><span>03</span><h3>Redevabilité envers les populations</h3><p>Réponse sous 48 heures ouvrées, signalement possible même anonyme, recours devant le bureau puis l’assemblée, et chaque erreur de fait corrigée et datée. <Link href="/transparence#comment-nous-signaler-un-manquement">Signaler un manquement</Link> · <Link href="/transparence#corrections">Journal des corrections</Link></p></article>
          <article><span>04</span><h3>Genre</h3><p>Une thématique, Genre & autonomisation des femmes, porte l’égalité femmes-hommes ; la charte interdit d’écarter quiconque d’une activité ou d’une coordination en raison de son sexe. <Link href="/programmes#leadership-feminin">La thématique 10</Link></p></article>
          <article><span>05</span><h3>Organisation locale</h3><p>Une association de Bédjondo et de sa diaspora, avec un siège des opérations à Bédjondo, des coordonnateurs issus de ses membres et des besoins signalés localité par localité. <Link href="/mission#sieges">Les deux sièges</Link> · <Link href="/territoire/besoins">Signaler un besoin</Link></p></article>
        </div>
        <p className="lg-footnote">Logique d’intervention, telle que le site l’organise — à valider par l’assemblée générale : le <Link href="/territoire/diagnostic">diagnostic territorial</Link> recense les problèmes et ce que l’on en sait ; chaque problème est rattaché à une thématique ; la thématique porte un <Link href="/actions">plaidoyer</Link> ou un <Link href="/projets">projet</Link> ; le <Link href="/impact">tableau de suivi</Link> suit ce qui avance.</p>
      </section>

      {GROUPES_SECTEURS.map((g) => (
        <section className="hub-section" id={`groupe-${g.id}`} key={g.id}>
          <SectionHead eyebrow="Groupe de secteurs" title={g.nom} text={g.texte} />
          <div className="sec-grille">
            {SECTEURS.filter((s) => s.groupe === g.id).map((s) => (
              <article className="sec-carte" id={s.id} key={s.id}>
                <div className="sec-tete">
                  <span className="sec-sigle">{s.sigle}</span>
                  <span className={`sec-etat sec-etat--${s.etat}`}>{ETATS_SECTEUR[s.etat].label}</span>
                </div>
                <h3>{s.nom}</h3>
                <p className="sec-cadre">{[s.cadre.clusterFr ?? s.cadre.cluster, s.cadre.cadFr ?? s.cadre.cad, s.cadre.odd, s.cadre.reference].filter(Boolean).join(" · ")}</p>
                <ul className="sec-activites">
                  {s.activites.map((a) => (
                    <li key={a.texte} className={a.etat === "fait" ? "est-fait" : "est-piste"}>
                      <b>{a.etat === "fait" ? "Publié" : "Piste"}</b>
                      {a.href ? <Link href={a.href}>{a.texte}</Link> : <span>{a.texte}</span>}
                    </li>
                  ))}
                </ul>
                <p className="sec-them">
                  {s.thematiques.map((id) => th[id] ? <Link key={id} href={`/programmes#${id}`}><span>{th[id].number}</span>{th[id].name}{th[id].filled ? "" : " · à pourvoir"}</Link> : null)}
                </p>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="hub-section" id="non-couverts">
        <SectionHead eyebrow="Ce que nous ne faisons pas" title="Trois secteurs" em="hors de notre portée, et nous le disons." text="Une association sans budget ni stocks ne distribue pas d’abris et ne gère pas de camps. Elle informe, oriente et relaie les besoins vers ceux dont c’est le mandat." />
        <div className="detail-grid">
          {NON_COUVERTS.map((n) => <article key={n.sigle}><span>{n.sigle}</span><h3>{n.nom}</h3><p>{n.pourquoi}</p></article>)}
        </div>
      </section>

      <section className="hub-section" id="partenaires">
        <SectionHead eyebrow="Travailler avec nous" title="Une ONG, un bailleur," em="un cluster ?" />
        <div className="link-list">
          <Link href="/participer?objet=partenariat#contact"><small>Écrire</small><strong>Proposer un partenariat sectoriel</strong><span>Réponse sous 48 heures ouvrées ; indiquez le secteur et la zone.</span></Link>
          <Link href="/association/ong-partenaires"><small>Partenaires</small><strong>Les ONG et partenaires présents au Mandoul</strong><span>Qui fait quoi, où, d’après les sources publiques.</span></Link>
          <Link href="/programmes/fiches-de-mission"><small>Coordinations</small><strong>Les fiches de mission</strong><span>Cinq thématiques, dont Urgences & risques, cherchent leur coordination.</span></Link>
          <Link href="/en/sectors"><small>In English</small><strong>Our sectors, for international partners</strong><span>The same mapping, in English.</span></Link>
        </div>
      </section>

      <Partager route="/secteurs" titre="Secteurs d’intervention d’ADEB LONODJI" texte="WASH, santé, nutrition, éducation, sécurité alimentaire, urgences et protection : nos vingt et une thématiques dans la langue des ONG." />
      <p className="lg-footnote">Nomenclatures : clusters du Comité permanent interorganisations (IASC), codes-objet du Comité d’aide au développement de l’OCDE (CAD), Objectifs de développement durable. Correspondance établie par l’association le 29 septembre 2026. Une erreur de classement ? <Link href="/transparence#corrections">Signalez-la</Link>.</p>
    </main>
  );
}
