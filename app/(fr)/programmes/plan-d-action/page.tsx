import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { getIndex, metaDescription, ogFor } from "@/lib/content";
import { getTransmissions } from "@/lib/transmissions";
import { getProjets } from "@/lib/projets";
import { AUTO_EVALUATION } from "@/lib/auto-evaluation";
import { breadcrumbSchema, jsonLd, webPageSchema } from "@/lib/schema";

/* Plan d'action par pilier (25/10/2026), présenté comme le font les ONG de développement : pour chaque action, le
   type, l'état, la prochaine étape, le responsable et l'échéance. Rien n'est écrit à la main : les actions viennent
   des plaidoyers (content/index.json, content/transmissions.json), des projets (content/projets.json), des
   coordinations à pourvoir et des suites de l'auto-évaluation. Aucune cible ni aucun budget n'est inventé. */

const ROUTE = "/programmes/plan-d-action";
const TITRE = "Plan d’action par pilier";
const DESCRIPTION = metaDescription("Les actions d’ADEB LONODJI pilier par pilier : plaidoyers, projets, coordinations à pourvoir et chantiers institutionnels, avec leur état, leur prochaine étape, leur responsable et leur échéance.");

export const metadata: Metadata = {
  title: TITRE,
  description: DESCRIPTION,
  alternates: { canonical: ROUTE },
  openGraph: { ...ogFor(ROUTE), title: TITRE, description: DESCRIPTION },
};

type Action = { type: string; titre: string; href: string; etat: string; enCours: boolean; etape: string; qui: string; quand: string };

export default function PlanAction() {
  const idx = getIndex();
  const t = getTransmissions();
  const { projets, stades } = getProjets();
  const nomStade = (id: string) => stades.find((s) => s.id === id)?.nom ?? id;
  const ancre = (href: string) => href.split("#")[1] ?? "";

  const piliers = idx.structure.poles.map((p) => {
    const ids = new Set(p.items.map((i) => i.id));
    const coord = (id: string) => { const i = p.items.find((x) => x.id === id); return i?.filled && i.coordinator ? `${i.coordinator}, ${i.name}` : `${p.direction?.filled ? p.direction.name + " (vice-présidence)" : "Bureau exécutif"}`; };
    const actions: Action[] = [];
    for (const pl of idx.plaidoyers.filter((x) => ids.has(ancre(x.themeHref)))) {
      const ds = t[pl.id]?.destinataires ?? [];
      const aSigner = ds.filter((d) => d.statut === "a-signer").length;
      actions.push({
        type: "Plaidoyer", titre: pl.title, href: pl.href,
        etat: ds.length ? (aSigner === ds.length ? `publié ; ${ds.length > 1 ? `${ds.length} lettres prêtes` : "1 lettre prête"}, à signer` : `${ds.length - aSigner} lettre(s) sur ${ds.length} envoyée(s)`) : "publié",
        enCours: aSigner < ds.length,
        etape: aSigner ? "Signature par le bureau, puis dépôt daté auprès des destinataires" : "Suivi des réponses",
        qui: coord(ancre(pl.themeHref)), quand: "Dès la signature",
      });
    }
    for (const pr of projets.filter((x) => x.thematiques.some((id) => ids.has(id)))) {
      actions.push({
        type: "Projet", titre: pr.nom, href: pr.route, etat: pr.libelle.toLowerCase().startsWith(nomStade(pr.stade).toLowerCase()) ? pr.libelle : `${nomStade(pr.stade)} — ${pr.libelle}`,
        enCours: ["souscription", "finance", "realisation", "essai", "service"].includes(pr.stade),
        etape: pr.manque[0] ?? "À préciser", qui: coord(pr.thematiques.find((id) => ids.has(id)) ?? ""), quand: /^(aucun|non fix)/i.test(pr.calendrier) ? "non fixée" : pr.calendrier,
      });
    }
    for (const i of p.items.filter((x) => !x.filled)) {
      actions.push({ type: "Organisation", titre: `Pourvoir la coordination « ${i.name} »`, href: `/participer?theme=${i.number}#contact`, etat: "poste ouvert", enCours: false, etape: "Recevoir les candidatures, nomination par le bureau", qui: p.direction?.filled ? `${p.direction.name} (vice-présidence)` : "Bureau exécutif", quand: "D’ici fin 2026" });
    }
    if (!p.direction?.filled) actions.push({ type: "Organisation", titre: `Élire la vice-présidence du pilier ${p.roman}`, href: "/association/election-vice-presidences", etat: "élection organisée, résultats à publier avec le procès-verbal signé", enCours: true, etape: "Publication des résultats", qui: "Collège électoral, bureau exécutif", quand: "Dès réception du procès-verbal" });
    return { p, actions };
  });

  const institutionnel: Action[] = AUTO_EVALUATION.suites.map((s) => ({ type: "Institutionnel", titre: s.quoi, href: `/transparence/auto-evaluation#suite-${s.id}`, etat: "décidé, à réaliser", enCours: false, etape: s.quoi.split(/[;:,]/)[0], qui: s.qui, quand: s.quand }));
  const toutes = [...piliers.flatMap((x) => x.actions), ...institutionnel];
  const par = (type: string) => toutes.filter((a) => a.type === type).length;

  const Ligne = ({ a }: { a: Action }) => (
    <li className="registre-ligne">
      <div className="registre-tete"><span className={`status registre-statut ${a.enCours ? "eval-statut--present" : "eval-statut--partiel"}`}>{a.type}</span><small>{a.etat}</small></div>
      <h3><Link href={a.href}>{a.titre}</Link></h3>
      <p className="registre-suite"><b>Prochaine étape :</b> {a.etape}</p>
      <p className="registre-suite"><b>Responsable :</b> {a.qui} · <b>Échéance :</b> {a.quand}</p>
    </li>
  );

  return (
    <main id="main-content" className="hub-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@graph": [webPageSchema({ url: ROUTE, name: TITRE, description: DESCRIPTION }), breadcrumbSchema([{ name: "Accueil", url: "/" }, { name: "Programmes", url: "/programmes" }, { name: "Plan d’action" }], ROUTE)] }) }} />
      <PageHeader
        eyebrow="Programmes · plan d’action"
        title="Ce que nous faisons, pilier par pilier,"
        em="et la prochaine étape de chaque action."
        lead="Chaque action de l’association, avec son état réel, sa prochaine étape, son responsable et son échéance. Les plaidoyers sont publiés et leurs lettres attendent la signature du bureau ; les projets vont de l’idée à la souscription ; aucun n’est encore financé. Rien n’est présenté comme fait avant de l’être, et aucun budget ni aucune cible n’est affiché sans décision du bureau."
        crumbs={[{ label: "Programmes", href: "/programmes" }, { label: "Plan d’action" }]}
        pills={[`${toutes.length} actions`, `${par("Plaidoyer")} plaidoyers`, `${par("Projet")} projets`, `${par("Organisation")} postes et élections`, `${par("Institutionnel")} chantiers institutionnels`]}
      />
      <Stats items={[
        { value: String(par("Plaidoyer")), label: "plaidoyers à transmettre", note: "publiés, avec destinataires et sources" },
        { value: String(par("Projet")), label: "projets suivis", note: "de l’idée à la souscription ; aucun financé" },
        { value: String(par("Organisation")), label: "postes et élections", note: "coordinations à pourvoir, vice-présidences" },
        { value: String(par("Institutionnel")), label: "chantiers institutionnels", note: "pièces, politiques, compte, rapports" },
      ]} />

      {piliers.map(({ p, actions }) => (
        <section className="hub-section" id={p.id} key={p.id}>
          <SectionHead eyebrow={`Pilier ${p.roman} · ${actions.length} action${actions.length > 1 ? "s" : ""}`} title={p.name} text={`${p.intro} Vice-présidence : ${p.direction?.filled ? p.direction.name : "à élire"}.`} />
          {actions.length ? <ol className="registre">{actions.map((a) => <Ligne key={a.titre} a={a} />)}</ol> : <p className="form-note">Aucune action engagée pour l’instant : les thématiques de ce pilier préparent leurs premiers travaux.</p>}
        </section>
      ))}

      <section className="hub-section" id="institutionnel">
        <SectionHead eyebrow={`Toute l’association · ${institutionnel.length} chantiers`} title="Chantiers institutionnels," em="pour pouvoir conventionner." text="Ce que les bailleurs et l’administration demandent avant tout partenariat ; repris de l’auto-évaluation au regard des référentiels des ONG." />
        <ol className="registre">{institutionnel.map((a) => <Ligne key={a.titre} a={a} />)}</ol>
        <p className="form-note">Méthode : cette page est calculée à chaque mise à jour du site depuis les plaidoyers, les envois, les projets, l’organigramme et l’auto-évaluation. Une action change d’état ici quand elle change dans sa page source, avec sa date. Voir aussi le <Link href="/impact">tableau de suivi</Link> et le <Link href="/transparence/decisions">registre des décisions</Link>.</p>
      </section>
      <Partager route={ROUTE} titre={TITRE} texte={DESCRIPTION} />
    </main>
  );
}
