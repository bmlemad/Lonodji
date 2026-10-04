import { alternatesLangues } from "@/lib/langues";
import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead } from "@/components/blocks";
import ContactPrefill from "@/components/contact-prefill";
import OuvrirAncre from "@/components/ouvrir-ancre";
import { LegacySections, Resume } from "@/components/legacy-content";
import LegacyEnhance from "@/components/legacy-enhance";
import { getIndicateurs } from "@/lib/indicateurs";
import { RESEAUX } from "@/lib/contact";
import { GENRES, getPostes } from "@/lib/postes";
import { enLettres, filledCount, getIndex, getPage, ogFor, ORG, thematiqueCount } from "@/lib/content";

export const metadata: Metadata = {
  title: "Participer : nous écrire, adhérer, soutenir",
  description: "Rejoindre ou coordonner une thématique, adhérer, proposer un article, recevoir la lettre d’information : par formulaire, WhatsApp ou téléphone.",
  alternates: { canonical: "/participer", languages: alternatesLangues("/participer") },
  openGraph: ogFor("/participer"),
};

export default function Participer() {
  const idx = getIndex();
  const vacantes = thematiqueCount(idx) - filledCount(idx);
  const { directionsPourvues, directionsTotal } = getIndicateurs().contenu.coordinations;
  const dirVacantes = directionsTotal - directionsPourvues;
  const contact = getPage("contact");
  const adherer = getPage("adherer");
  const soutenir = getPage("soutenir");
  const journal = getPage("actualites");
  const forms = [...contact.forms, ...adherer.forms, ...soutenir.forms, ...journal.forms];
  const [choisir, ecrireSource, proposer, avant] = contact.sections;
  // Présentation actuelle des réseaux depuis la source de contact, même après un réimport.
  const reseaux = Object.entries(RESEAUX).map(([nom, href]) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${nom === "x" ? "X" : nom === "youtube" ? "YouTube" : nom === "linkedin" ? "LinkedIn" : "Facebook"}</a>`).join(" · ");
  const ecrire = { ...ecrireSource, html: ecrireSource.html.replace(/<p>ADEB LONODJI prépare ses comptes officiels\.[\s\S]*?<\/p>/, `<p>Retrouvez les liens de l’association : ${reseaux}. Les nouvelles sont également publiées dans <a href="/journal">le journal</a>.</p>`) };
  const newsletter = journal.sections[0];
  const postes = getPostes();
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Participer"
        title="Une place pour"
        em="chaque contribution."
        lead="Rejoindre une thématique, la coordonner, proposer un article, adhérer, transmettre un document ou une information : tout passe par cette page. Nous répondons sous quarante-huit heures ouvrées."
      />

      <nav className="link-list participer-choix" aria-label="Choisir comment participer">
        <a href="#adherer"><small>Adhésion</small><strong>Déclarer mon intention d’adhérer</strong><span>Le formulaire d’adhésion, sans aucun paiement.</span></a>
        <Link href="/diaspora"><small>Compétences</small><strong>Proposer une compétence</strong><span>Choisir les domaines dans lesquels je peux aider.</span></Link>
        <a href="#postes-ouverts"><small>Bénévolat</small><strong>Choisir un poste ouvert</strong><span>Coordonner, seconder ou se présenter à une vice-présidence.</span></a>
        <a href="#contact"><small>Contact</small><strong>Écrire à l’association</strong><span>Poser une question, proposer un partenariat ou transmettre une information.</span></a>
      </nav>

      <div className="contact-cta">
        <a className="button primary contact-appel" href={ORG.phoneHref} title="Appeler l’association"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>Appeler l’association</a>
        <small>Adoumbé Maoura, président — appel et WhatsApp, le contact officiel de l’association</small>
        <a className="button secondary" href={ORG.whatsapp} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp <span aria-hidden="true">↗</span></a>
        <a className="button secondary" href={ORG.whatsappGroupe} target="_blank" rel="noopener noreferrer">Rejoindre le groupe WhatsApp <span aria-hidden="true">↗</span></a>
      </div>
      <p className="notice"><strong>Relance de l’association :</strong> membres et sympathisants, au pays comme dans la diaspora, faites-vous recenser avant le 18 octobre 2026 (bureau du 18 septembre). <Link href="/participer/recensement">Se faire recenser <span aria-hidden="true">→</span></Link></p>

      <section id="contact" aria-label="Nous écrire">
        <div className="legacy">
          <LegacySections sections={[ecrire]} />
        </div>
      </section>


      {postes.length ? (
        <details className="plier participer-detail" id="postes-ouverts">
          <summary><strong>Voir les postes ouverts</strong><span>Choisir un rôle bénévole et accéder à sa fiche de mission</span></summary>
          <div className="participer-detail-contenu">
          <SectionHead eyebrow="Postes ouverts" title={`${enLettres(postes.length, true)} postes`} em="cherchent quelqu’un." text="Depuis le 1er octobre 2026, chacune des sept thématiques prioritaires a un titulaire et un adjoint, et chaque pôle une vice-présidence élue. Ces postes sont encore libres. Tous sont bénévoles et s’exercent depuis Bédjondo, N’Djamena ou la diaspora. Le bouton prépare le formulaire de contact ; le lien WhatsApp partage l’annonce à quelqu’un que vous connaissez." />
          <ul className="postes-grille">
            {postes.map((p) => (
              <li key={p.cle} className={`poste poste-${p.genre}`}>
                <span className="poste-genre">{GENRES[p.genre]}</span>
                <h3>{p.numero ? <span className="poste-num">{p.numero}</span> : null}{p.titre}</h3>
                <p className="poste-pole">{p.pole}</p>
                <p className="poste-actions">
                  <a className="button primary" href={p.href}>Je me propose</a>
                  <a className="text-link" href={p.fiche}>Fiche de mission <span className="sr-only">(PDF)</span></a>
                  <a className="text-link" href={p.visuel} download>Visuel <span className="sr-only">à partager (image carrée)</span></a>
                  <a className="text-link" href={`https://wa.me/?text=${encodeURIComponent(p.message)}`} target="_blank" rel="noopener noreferrer">Partager sur WhatsApp <span aria-hidden="true">↗</span></a>
                </p>
              </li>
            ))}
          </ul>
        </div>
        </details>
      ) : null}


      <details className="plier participer-detail" id="thematiques">
          <summary><strong>Trouver ma thématique</strong><span>Organisation, questions fréquentes et pistes de contribution</span></summary>
          <div className="participer-detail-contenu">
        <SectionHead eyebrow="Avant de vous lancer" title="Choisissez un pôle," em="puis une thématique." text={`Vingt-deux thématiques, ${enLettres(vacantes)} sans coordonnateur ; et ${dirVacantes === 0 ? "chaque pôle a sa vice-présidence" : `${enLettres(dirVacantes)} des ${enLettres(idx.structure.poles.length)} pôles ${dirVacantes > 1 ? "attendent" : "attend"} encore leur vice-présidence, pourvue par élection`}. La page Nos actions les détaille ; ce raccourci vous oriente en quelques questions.`} />
        <div className="legacy"><LegacySections sections={[choisir, avant]} sansPremierTitre /></div>
        <div className="section-actions" style={{ justifyContent: "flex-start" }}>
          <Link className="button primary" href="/participer/trouver-ma-thematique">Trouver ma thématique en trois questions <span aria-hidden="true">→</span></Link>
          <Link className="button secondary" href="/programmes#thematiques">Voir les vingt-deux thématiques <span aria-hidden="true">→</span></Link>
          <Link className="text-link" href="/association/election-vice-presidences">Se présenter à une vice-présidence de pôle <span aria-hidden="true">→</span></Link>
          <Link className="text-link" href="/programmes/fiches-de-mission">Les fiches de mission (PDF) <span aria-hidden="true">→</span></Link>
          <Link className="text-link" href="/diaspora">Diaspora : inscrire mes compétences <span aria-hidden="true">→</span></Link>
          <Link className="text-link" href="/temoignages">Raconter Bédjondo : témoignages &amp; photos <span aria-hidden="true">→</span></Link>
        </div>
      </div>
        </details>

      <section className="hub-section" id="adherer">
        <SectionHead eyebrow="Adhésion" title="Adhérer" em="à l’association." />
        <div className="notice"><strong>Collecte suspendue depuis le 23 septembre 2026.</strong> Aucune cotisation ni don n’est encaissé, en espèces comme par Mobile Money, tant que trois conditions ne sont pas réunies : l’autorisation de l’association, le vote de la grille de cotisation par l’assemblée générale et un compte bancaire à double signature au nom de l’association. Les intentions d’adhésion, elles, restent ouvertes : elles n’engagent aucun argent.</div>
        {(() => {
          // en vue : l'essentiel et le formulaire ; repliées : les règles détaillées (rien n'est retiré)
          const vue = ["bulletin"];
          const essentiel = vue.map((id) => adherer.sections.find((x) => x.id === id)).filter((x) => x !== undefined);
          const details = adherer.sections.filter((x) => !vue.includes(x.id));
          return (
            <div className="legacy">
              <Resume items={adherer.resume} />
              <LegacySections sections={essentiel} />
              {details.length ? (
                <details className="plier">
                  <summary><strong>Les règles de l’adhésion en détail</strong><span>{details.length} sections, de la carte de membre à ce qui reste à décider</span></summary>
                  <LegacySections sections={details} />
                </details>
              ) : null}
            </div>
          );
        })()}
      </section>

      <details className="plier participer-detail" id="soutenir">
          <summary><strong>Soutenir l’association</strong><span>Promesses de contribution, matériel et temps ; collecte suspendue</span></summary>
          <div className="participer-detail-contenu">
        <SectionHead eyebrow="Nous soutenir" title="Cinq façons" em="d’agir avec nous." text={soutenir.lede} />
        <div className="legacy"><LegacySections sections={soutenir.sections} sansPremierTitre /></div>
      </div>
        </details>

      <details className="plier participer-detail" id="proposer">
          <summary><strong>Proposer un article</strong><span>Ouvrir le formulaire et les règles de publication</span></summary>
          <div className="participer-detail-contenu">
        <SectionHead eyebrow="Le journal" title="Proposer" em="un article." text="Toute personne peut proposer un article : il est relu, sourcé et publié sous le nom de son auteur." />
        <div className="legacy"><LegacySections sections={[proposer]} sansPremierTitre /></div>
      </div>
        </details>

      <details className="plier participer-detail" id="newsletter">
          <summary><strong>Recevoir la lettre d’information</strong><span>Ouvrir le formulaire d’abonnement</span></summary>
          <div className="participer-detail-contenu">
        <SectionHead eyebrow="Lettre d’information" title="Recevoir" em="les actualités." />
        <div className="legacy"><LegacySections sections={[newsletter]} sansPremierTitre /></div>
        <p className="section-actions" style={{ justifyContent: "flex-start" }}><Link className="text-link" href="/lettre">Les numéros parus <span aria-hidden="true">→</span></Link></p>
      </div>
        </details>

      <ContactPrefill />
      <OuvrirAncre />
      <LegacyEnhance hasForms={forms.length > 0} />
    </main>
  );
}
