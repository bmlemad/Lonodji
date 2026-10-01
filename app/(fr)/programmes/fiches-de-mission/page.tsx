import { metaDescription } from "@/lib/content";
import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { ogFor } from "@/lib/content";
import { getMissions } from "@/lib/missions";

export const metadata: Metadata = {
  title: "Fiches de mission des pôles et thématiques",
  description: metaDescription("Vingt-huit fiches de mission en PDF : cinq vice-présidences de pôle, vingt et une coordinations de thématique et deux cellules, avec le lien pour candidater."),
  alternates: { canonical: "/programmes/fiches-de-mission" },
  openGraph: { ...ogFor("/programmes/fiches-de-mission"), title: "Fiches de mission : vice-présider un pôle, coordonner une thématique", description: "Vingt-huit fiches en PDF : ce que la personne fait, le périmètre, les quatre étapes, le lien pour candidater." },
};

const jour = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default function FichesDeMission() {
  const m = getMissions();
  const coordVacantes = m.coordinations.filter((c) => !c.pourvue).length;
  const cellVacantes = m.cellules.filter((c) => !c.pourvue).length;
  const directionsVacantes = m.directions.filter((d) => !d.pourvue).length;
  return (
    <main id="main-content" className="hub-page">
      <PageHeader
        eyebrow="Nos actions · fiches de mission"
        title="Vice-présider un pôle,"
        em="coordonner une thématique : la fiche avant la candidature."
        lead="Une fiche de mission par poste, en PDF, à faire circuler : ce que la personne fait, le périmètre, les quatre étapes communes à toutes les thématiques, et le lien de candidature déjà rempli. Les textes sont ceux des pages Nos actions, Mission et Participer ; l’état — pourvu, à pourvoir — est celui du site à la date de la fiche."
        crumbs={[{ label: "Nos actions", href: "/programmes" }, { label: "Fiches de mission" }]}
        pills={[`${m.directions.length + m.coordinations.length + m.cellules.length} fiches`, `${directionsVacantes} vice-présidence${directionsVacantes > 1 ? "s" : ""} à pourvoir`, `${coordVacantes} coordination${coordVacantes > 1 ? "s" : ""}${cellVacantes ? ` et ${cellVacantes} cellule${cellVacantes > 1 ? "s" : ""}` : ""} à pourvoir`, `état au ${jour(m.genere)}`]}
      />
      <Stats items={[
        { value: String(m.directions.length), label: "vice-présidences de pôle", note: `fonction élue (Pillar Vice-President) ; ${m.directions.length - directionsVacantes} pourvue${m.directions.length - directionsVacantes > 1 ? "s" : ""}, ${directionsVacantes} à pourvoir par élection` },
        { value: String(m.coordinations.length), label: "coordinations de thématique", note: `${m.coordinations.filter((c) => c.pourvue).length} pourvues, ${m.coordinations.filter((c) => !c.pourvue).length} à pourvoir` },
        { value: String(m.cellules.length), label: "cellules transversales", note: m.cellules.map((c) => `${c.nom} : ${c.pourvue ? "pourvue" : "à pourvoir"}`).join(" · ") },
        { value: "1", label: "recueil complet", note: "toutes les fiches dans un seul PDF, pour la réunion" },
      ]} />

      <div className="section-actions" style={{ justifyContent: "flex-start", marginBottom: 8 }}>
        <a className="button primary" href={m.recueil} download>Toutes les fiches en un PDF <span aria-hidden="true">↓</span></a>
        <Link className="button secondary" href="/participer?coordo=1#contact">Candidater <span aria-hidden="true">→</span></Link>
      </div>

      <section className="hub-section" id="directions">
        <SectionHead eyebrow={`${m.directions.length} vice-présidences de pôle`} title="Pourvues par élection," em={directionsVacantes === m.directions.length ? "et toutes à pourvoir." : `${directionsVacantes} à pourvoir sur ${m.directions.length}.`} text="Le vice-président délégué ou la vice-présidente déléguée réunit chaque trimestre les coordonnateurs de ses thématiques, tient le plan d’action et le calendrier du pôle, suit les plaidoyers et les projets qui en relèvent, et rend compte au bureau et à l’assemblée. Il ou elle ne remplace pas les coordonnateurs : il les tient ensemble. Jusqu’au 1er octobre 2026, ces fonctions s’appelaient directions de pôle, au rang de chef de projet." />
        <div className="link-list">
          {m.directions.map((d) => (
            <a key={d.pole} href={d.pdf} download>
              <small>Pôle {d.roman} · {d.thematiques} thématiques · PDF</small>
              <strong>Vice-présidence du pôle {d.roman} — {d.nom}</strong>
              <span>{d.pourvue ? `Pourvue : ${d.qui}.` : "À pourvoir."} Fiche de mission : rôle, thématiques du pôle et leurs coordinations, étapes, lien de candidature.</span>
            </a>
          ))}
        </div>
      </section>

      <section className="hub-section" id="coordinations">
        <SectionHead eyebrow="Vingt et une coordinations" title="Une thématique," em="une fiche." text="Le coordonnateur ou la coordonnatrice réunit les membres intéressés, propose un plan d’action simple, fait avancer la thématique au quotidien avec l’appui des cellules transversales, et rend compte lors des assemblées. Coordonner demande de la régularité ; contribuer ponctuellement est déjà précieux." />
        <div className="link-list">
          {m.coordinations.map((c) => (
            <a key={c.id} href={c.pdf} download>
              <small>{c.numero} · pôle {c.pole} · {c.pourvue ? "pourvue" : "à pourvoir"} · PDF</small>
              <strong>{c.nom}</strong>
              <span>{c.pourvue ? `Coordination : ${c.qui}.` : "Coordination à pourvoir."} La thématique telle que le site la décrit, ses ODD, le rôle, les étapes, le lien de candidature.</span>
            </a>
          ))}
        </div>
      </section>

      <section className="hub-section" id="cellules">
        <SectionHead eyebrow="Deux cellules transversales" title="L’appui" em="de toutes les thématiques." />
        <div className="link-list">
          {m.cellules.map((c) => (
            <a key={c.id} href={c.pdf} download>
              <small>Cellule · {c.pourvue ? "pourvue" : "à pourvoir"} · PDF</small>
              <strong>{c.nom}</strong>
              <span>{c.pourvue ? `Coordination : ${c.qui}.` : "Coordination à pourvoir."}</span>
            </a>
          ))}
        </div>
      </section>

      <Partager route="/programmes/fiches-de-mission" titre="Fiches de mission" texte="Diriger un pôle, coordonner une thématique : vingt-sept fiches de mission en PDF, avec le rôle, le périmètre, les étapes et le lien pour candidater." />
      <p className="lg-footnote">Fiches établies automatiquement depuis la structure publiée sur <Link href="/programmes">Nos actions</Link> ; état au {jour(m.genere)}. Une nomination est publiée, datée, dans le <Link href="/journal">journal</Link>, puis les fiches sont régénérées.</p>
    </main>
  );
}
