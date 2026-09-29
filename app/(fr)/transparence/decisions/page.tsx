import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { ogFor } from "@/lib/content";
import { DECISIONS, decisionsTriees, TYPES, type TypeDecision } from "@/lib/decisions";

export const metadata: Metadata = {
  title: "Registre public des décisions : décidé, nommé, annoncé, proposé",
  description: "Ce que l’association a décidé, nommé, annoncé ou proposé depuis septembre 2026, tel que le site l’a publié, avec la source de chaque ligne et ce qui reste attendu. Les procès-verbaux ne sont pas encore publiés : le registre reprend ce qui a été rendu public.",
  alternates: { canonical: "/transparence/decisions" },
  openGraph: { ...ogFor("/transparence/decisions"), title: "Registre public des décisions", description: "Décidé, nommé, annoncé, proposé : chaque ligne avec sa date, sa source et ce qui reste attendu." },
};

const jour = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const ORDRE: TypeDecision[] = ["decision", "nomination", "annonce", "proposition", "publication", "regle"];

export default function Decisions() {
  const liste = decisionsTriees();
  const compte = (t: TypeDecision) => DECISIONS.filter((d) => d.type === t).length;
  const dernier = liste.find((d) => d.type !== "regle");
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Redevabilité · registre des décisions"
        title="Ce qui a été décidé,"
        em="nommé, annoncé, proposé — et ce qui ne l’est pas."
        lead="Une ligne par fait daté, avec sa source sur le site et ce qui reste attendu. Le registre distingue ce que l’association a décidé de ce qu’elle a seulement annoncé ou proposé à son assemblée. Les procès-verbaux ne sont pas encore publiés : le registre reprend ce qui a été rendu public, il ne les remplace pas. Une ligne fausse ou manquante ? Elle sera corrigée et datée."
        crumbs={[{ label: "Redevabilité & transparence", href: "/transparence" }, { label: "Registre des décisions" }]}
        pills={[`${DECISIONS.length} entrées`, `${compte("decision")} décisions`, `${compte("proposition")} proposition à voter`, dernier ? `dernier fait : ${jour(dernier.date)}` : ""].filter(Boolean)}
      />
      <Stats items={[
        { value: String(compte("decision")), label: "décisions", note: TYPES.decision.note },
        { value: String(compte("nomination")), label: "nominations", note: "quinze coordinations sur vingt pourvues, une cellule sur deux" },
        { value: String(compte("proposition")), label: "proposition à voter", note: "les cinq règles du programme 06, par l’assemblée" },
        { value: String(compte("regle")), label: "règles en vigueur", note: "que l’association s’impose depuis la mise en ligne du site" },
      ]} />

      <section className="hub-section" id="registre">
        <SectionHead eyebrow="Le registre" title="Du plus récent" em="au plus ancien." text="Un statut par ligne : décidé, nommé, annoncé, à voter, publié, en vigueur. Les règles n’ont pas de date de vote connue : elles valent depuis la mise en ligne des pages qui les énoncent." />
        <ol className="registre">
          {liste.map((d) => (
            <li key={d.id} className={`registre-ligne registre-ligne--${d.type}`} id={d.id}>
              <div className="registre-tete">
                <span className={`status registre-statut registre-statut--${d.type}`}>{TYPES[d.type].court}</span>
                <time dateTime={d.type === "regle" ? undefined : d.date}>{d.type === "regle" ? "Depuis la mise en ligne" : jour(d.date)}</time>
                <small>n° {d.id}</small>
              </div>
              <h3>{d.titre}</h3>
              <p>{d.texte}</p>
              {d.suite ? <p className="registre-suite"><b>Ce qui reste attendu :</b> {d.suite}</p> : null}
              <p className="registre-sources">{d.sources.map((s) => <Link key={s.href} href={s.href}>{s.label}</Link>)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="hub-section" id="statuts">
        <SectionHead eyebrow="Les statuts" title="Six mots," em="pour ne pas confondre." />
        <div className="detail-grid">
          {ORDRE.map((t) => <article key={t}><span className={`status registre-statut registre-statut--${t}`}>{TYPES[t].court}</span><h3>{TYPES[t].label}</h3><p>{TYPES[t].note.charAt(0).toUpperCase() + TYPES[t].note.slice(1)}.</p></article>)}
        </div>
      </section>

      <section className="hub-section" id="methode">
        <SectionHead eyebrow="Comment le registre est tenu" title="Une source par ligne," em="et rien sans source." />
        <div className="detail-grid">
          <article><h3>Ce qui y entre</h3><p>Un fait daté que le site a publié : une décision de l’association, une nomination, une annonce, une proposition soumise à l’assemblée, un texte qui l’engage, une règle qu’elle s’impose. Pas les intentions, pas les projets d’articles, pas ce qui se dit hors du site.</p></article>
          <article><h3>Ce qui manque encore</h3><p>Les procès-verbaux des assemblées et les décisions du bureau qui n’ont pas été rendues publiques. Quand ils seront transmis, ils seront publiés sur la page <Link href="/transparence">Redevabilité & transparence</Link> et le registre citera leur numéro.</p></article>
          <article><h3>Corriger une ligne</h3><p>Une date fausse, une décision mal résumée, un oubli : <Link href="/transparence#corrections">signalez-le</Link>. La correction est publiée et datée dans le journal des corrections, comme pour toute page du site.</p></article>
        </div>
      </section>

      <Partager route="/transparence/decisions" titre="Registre public des décisions" texte="ce que l’association a décidé, nommé, annoncé ou proposé, avec la source de chaque ligne et ce qui reste attendu" />
      <p className="lg-footnote">Registre tenu à la main dans <code>lib/decisions.ts</code>, à partir des articles du journal, des lettres d’information et des pages du site ; {DECISIONS.length} entrées.</p>
    </main>
  );
}
