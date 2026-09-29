import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import MotForm from "@/components/mot-form";
import { getIndex, ogFor, ORG } from "@/lib/content";
import { getIndicateurs } from "@/lib/indicateurs";

export const metadata: Metadata = {
  title: "La langue nangnda (bedjond)",
  description: "Le nangnda, langue sara du pays bedjond : nom, parenté, aire, références, lexique en ligne avec l’audio, et le dictionnaire numérique qui commence par vos mots.",
  alternates: { canonical: "/langue" },
  openGraph: ogFor("/langue"),
};

/* Section langue (recommandation 5, 28/09/2026). Tout ce qui est affirmé ici
   vient des références de la base de recherche et des articles du journal ;
   l'alphabet et la prononciation attendent les linguistes. Le dictionnaire
   numérique commence par la collecte : un mot, un sens, une voix. */
export default function Langue() {
  const idx = getIndex();
  const articles = idx.articles.filter((a) => ["2026-09-22-ce-que-veut-dire-nangnda", "2026-09-15-sil-enquete-langue-bedjond", "2026-09-13-kokotan-langue-nangnda"].includes(a.slug));
  const ind = getIndicateurs();
  const mots = ind.formulaires.comptes["mot-nangnda"]?.envois ?? 0;
  const releve = new Date(ind.formulaires.date + "T12:00:00Z").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return (
    <main id="main-content" className="hub-page lg-langue">
      <PageHeader
        eyebrow="Territoire · la langue nangnda"
        title="Le nangnda,"
        em="la langue du pays bedjond."
        lead="Bedjond, bediondo, nangnda, nang-nda, ta-bedjond : plusieurs noms pour une même langue sara, parlée à Bédjondo et dans ses cantons, décrite par des linguistes, documentée par un lexique de 2 650 mots que l’on peut écouter en ligne, et transmise sur le terrain par l’association Kokotan. Cette page réunit ce que nous en savons, où l’apprendre, et comment y ajouter votre voix."
        crumbs={[{ label: "Histoire & patrimoine", href: "/histoire" }, { label: "Langue" }]}
        pills={["Famille sara, groupe « Doba »", "Lexique en ligne, avec l’audio", "Dictionnaire numérique : en collecte"]}
      />

      <Stats items={[
        { value: "2 650", label: "mots dans le Lexique Nangnda", note: "Dinguemrebeye & Keegan, 2e édition, 2014 ; 1 820 phrases, 700 expressions" },
        { value: "88 %", label: "de vocabulaire partagé avec le bebot", note: "86 % avec le mango, 84 % avec le gor (SIL, listes de 225 mots)" },
        { value: "700", label: "proverbes nangnda réunis", note: "Madjidéné Altana Lydie, ouvrage signalé par un membre" },
        { value: String(mots), label: mots === 1 ? "mot versé au dictionnaire" : "mots versés au dictionnaire", note: `relevé du ${releve}` },
      ]} />

      <section className="hub-section" id="savons">
        <SectionHead eyebrow="Ce que nous savons" title="Une langue sara," em="décrite, comptée, écoutée." text="Trois choses sont établies par des sources publiques ; le reste est à écrire avec les linguistes et les locuteurs. Nous ne publierons ni alphabet ni règle sans source." />
        <div className="detail-grid">
          <article><span>01</span><h3>Le nom</h3><p>« Nangnda » est le terme que le Comité de langue nangnda emploie depuis 1996 pour couvrir ensemble les parlers de Bédjondo et de Béboto ; « bedjond » désigne d’abord celui de Bédjondo. Les linguistes écrivent aussi « bediondo » ou « bedjonde ». Le journal a démêlé ce que le mot veut dire — et ce qu’il ne veut pas dire.</p><Link className="text-link" href="/journal/2026-09-22-ce-que-veut-dire-nangnda">Ce que veut dire « nangnda » <span aria-hidden="true">→</span></Link></article>
          <article><span>02</span><h3>La parenté</h3><p>Une langue sara (famille nilo-saharienne). L’enquête de la SIL (1999-2000, publiée en 2007) la place dans une fratrie avec le bebot, le gor et le mango — le groupe « Doba » de Bender — avec 84 à 88 % de vocabulaire commun et une intercompréhension de 94 à 95 % avec le gor et le mango. Des frères, pas une langue mère et ses filles.</p><Link className="text-link" href="/journal/2026-09-15-sil-enquete-langue-bedjond">Ce que la SIL a écrit <span aria-hidden="true">→</span></Link></article>
          <article><span>03</span><h3>Où on la parle</h3><p>Dans la sous-préfecture de Bédjondo — cantons de Bédjondo, Bébopen, Bédan, Nderguigui et Yomi — et dans des villages des sous-préfectures de Bodo, Doba rural et Béboto ; l’association ajoute Yamodo, dans la Nya Pendé. Variantes citées : bedjond, bebote, yom, pen, maguer.</p><Link className="text-link" href="/carte">Le pays bedjond sur la carte <span aria-hidden="true">→</span></Link></article>
        </div>
      </section>

      <section className="hub-section" id="apprendre">
        <SectionHead eyebrow="Apprendre et consulter" title="Les ressources" em="qui existent déjà." text="Nous ne réécrivons pas ce que d’autres ont fait mieux : nous y menons. Chaque ressource est référencée dans la bibliothèque avec sa fiche et sa citation." />
        <div className="detail-grid lg-ressources">
          <article>
            <span>Lexique · en ligne, avec l’audio</span>
            <h3>Lexique Nangnda (Bediondo)</h3>
            <p>Roger Dinguemrebeye et John M. Keegan, avec l’association Kokotan (KOKOTAN) ; 2e édition, avril 2014 ; environ 2 650 mots, 1 820 phrases d’exemple et 700 expressions, chaque mot accompagné de son enregistrement. Produit dans le cadre du Sara Bagirmi Language Project, avec le soutien du National Endowment for the Humanities.</p>
            <div className="bb-liens">
              <a className="text-link" href="https://morkegbooks.com/Services/World/Languages/SaraBagirmi/SoundDictionary/Nangnda/" target="_blank" rel="noopener noreferrer">Consulter le lexique sonore <span aria-hidden="true">↗</span></a>
              <a className="text-link" href="https://morkegbooks.com/Services/World/Languages/SaraBagirmi/pdfs/Bediondo.pdf" target="_blank" rel="noopener noreferrer">Le lexique en PDF <span aria-hidden="true">↗</span></a>
              <Link className="text-link" href="/dossiers/recherche#src-lexique-nangnda">La fiche dans la base<span className="sr-only"> : le lexique nangnda</span> <span aria-hidden="true">→</span></Link>
            </div>
          </article>
          <article>
            <span>Étude linguistique · référence</span>
            <h3>Description phonologique et grammaticale du bedjonde</h3>
            <p>Djarangar Djita Issa, linguiste tchadien, professeur titulaire des universités (École normale supérieure de Bongor). Le travail de référence sur le parler de Bédjondo, à l’origine de la désignation du peuple bedjond ; c’est là que sont décrits les sons et la grammaire de la langue.</p>
            <div className="bb-liens"><Link className="text-link" href="/dossiers/recherche#src-description-phonologique-et-grammaticale">La fiche dans la base<span className="sr-only"> : la description phonologique et grammaticale</span> <span aria-hidden="true">→</span></Link></div>
          </article>
          <article>
            <span>Enquête · SIL International, 2007</span>
            <h3>Enquête sociolinguistique de la région de Doba</h3>
            <p>Eric Johnson, SIL Electronic Survey Report 2007-010 : la seule enquête publiée consacrée au bedjond — cantons, locuteurs, noms de la langue, similarité lexicale et intercompréhension avec le bebot, le gor, le mango, le mbay et le ngambay, vitalité, écriture.</p>
            <div className="bb-liens">
              <a className="text-link" href="https://www.sil.org/system/files/reapdata/17/11/23/17112357599868426173562598215635923193/silesr2007_010.pdf" target="_blank" rel="noopener noreferrer">Le rapport (PDF) <span aria-hidden="true">↗</span></a>
              <Link className="text-link" href="/dossiers/recherche#src-enquete-sociolinguistique-des-varietes-l">La fiche dans la base<span className="sr-only"> : l’enquête sociolinguistique</span> <span aria-hidden="true">→</span></Link>
            </div>
          </article>
          <article>
            <span>Recueil · proverbes</span>
            <h3>Sept cents proverbes Nang-nda</h3>
            <p>Madjidéné Altana Lydie. Le plus vaste corpus de proverbes nangnda réuni en un volume, à notre connaissance, et le premier ouvrage de la bibliothèque dont l’autrice appartient au peuple dont elle écrit la langue. Référencé d’après l’exemplaire physique ; éditeur et année restent à établir.</p>
            <div className="bb-liens"><Link className="text-link" href="/dossiers/recherche#src-sept-cents-proverbes-nang-nda">La fiche dans la base<span className="sr-only"> : les sept cents proverbes</span> <span aria-hidden="true">→</span></Link></div>
          </article>
          <article>
            <span>Classification · Keegan</span>
            <h3>Les langues sara, vues d’ensemble</h3>
            <p>John M. Keegan a publié une série d’ouvrages de documentation des langues sara (<em>The Central Sara Languages</em>, <em>The Eastern</em>, <em>The Western</em>, <em>Sara Languages Lexicon</em>), en accès libre sur le site du Sara Bagirmi Language Project.</p>
            <div className="bb-liens">
              <a className="text-link" href="https://morkegbooks.com/Services/World/Languages/SaraBagirmi/ProjectOverView.htm" target="_blank" rel="noopener noreferrer">Le Sara Bagirmi Language Project <span aria-hidden="true">↗</span></a>
              <a className="text-link" href="https://morkegbooks.com/Services/World/Languages/SaraBagirmi/pdfs/SaraLanguagesLexicon.pdf" target="_blank" rel="noopener noreferrer">Sara Languages Lexicon (PDF) <span aria-hidden="true">↗</span></a>
            </div>
          </article>
          <article>
            <span>Sur le terrain · association</span>
            <h3>Kokotan, pour la promotion de la langue</h3>
            <p>Association basée à Bédjondo, présidée par Benayal Ndoloum Yassa, associée au Lexique Nangnda de Dinguemrebeye et Keegan ; elle porte la transmission de la langue aux jeunes générations et a tenu sa dixième assemblée générale en avril 2023.</p>
            <div className="bb-liens"><Link className="text-link" href="/journal/2026-09-13-kokotan-langue-nangnda">L’article du journal <span aria-hidden="true">→</span></Link></div>
          </article>
        </div>
      </section>

      <section className="hub-section" id="journal">
        <SectionHead eyebrow="Le journal" title="Ce que nous avons écrit" em="sur la langue." />
        <div className="link-list">
          {articles.map((a) => <Link key={a.slug} href={a.route}><small>{a.dateLabel} · {a.tag}</small><strong>{a.title}</strong><span>{a.summary}</span></Link>)}
        </div>
      </section>

      <section className="hub-section" id="alphabet">
        <SectionHead eyebrow="Ce qui reste à écrire" title="L’alphabet, la prononciation," em="les règles." text="Le lexique de Dinguemrebeye et Keegan utilise une orthographe pratique avec des tons ; la paroisse de Bédjondo et le Comité de langue ont eu leurs propres essais d’écriture, que la SIL relevait déjà en 2000. Réconcilier ces usages en une page « Apprendre le nangnda » — alphabet, sons, tons, premières phrases — est un travail pour la thématique Culture & patrimoine vivant, avec les linguistes et Kokotan. Nous ne le publierons pas avant qu’il soit vérifié : une langue mal écrite se transmet mal." />
        <div className="section-actions" style={{ justifyContent: "flex-start" }}>
          <Link className="button secondary" href="/programmes#culture-patrimoine-vivant">La thématique Culture &amp; patrimoine vivant <span aria-hidden="true">→</span></Link>
          <Link className="text-link" href="/diaspora">Linguiste, enseignant·e ? Inscrivez vos compétences <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="hub-section" id="dictionnaire">
        <SectionHead eyebrow="Le dictionnaire numérique" title="Il commence" em="par vos mots." text="Un mot, ce qu’il veut dire, une phrase où on l’entend, et si possible votre voix qui le prononce. Chaque contribution est vérifiée avec les linguistes, puis publiée avec ou sans votre nom. Les mots qui existent déjà dans le Lexique Nangnda seront rapprochés de leur entrée ; ceux qui n’y sont pas sont les plus précieux." />
        <div className="legacy dp-formulaire">
          <MotForm telephone={ORG.phone} whatsapp={ORG.whatsapp} />
        </div>
      </section>

      <p className="lg-footnote">Sources : références de la <Link href="/bibliotheque">bibliothèque</Link> (Lexique Nangnda ; SIL ESR 2007-010 ; Djarangar Djita Issa ; Madjidéné Altana Lydie) et articles du journal. Page ouverte le 28 septembre 2026 ; les chiffres du lexique sont ceux qu’annonce sa page d’accueil, consultée ce jour. Une erreur ? <Link href="/transparence#corrections">Signalez-la</Link>.</p>
    </main>
  );
}
