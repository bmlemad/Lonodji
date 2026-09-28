import type { Metadata } from "next";
import Link from "next/link";
import { SectionHead } from "../../../components/blocks";
import { OdebHero } from "../../../components/odeb-marque";
import OdebNav, { OdebEtat } from "../../../components/odeb-nav";
import { ogFor } from "../../../lib/content";
import { IDENTITE, ODEB } from "../../../lib/odeb";

export const metadata: Metadata = {
  title: "Identité visuelle du projet ODEB LONODJI : le logo « Les Pas vers l’Avenir »",
  description: "Trois empreintes — les ancêtres, la génération actuelle, les générations futures — qui avancent vers un soleil levant : le logo du projet ODEB LONODJI, ses versions, ses couleurs, ses règles d’usage, le kit à télécharger et le papier à en-tête.",
  alternates: { canonical: "/odeb/identite" },
  openGraph: ogFor("/odeb/identite"),
};

/* Les versions du logo, avec le fond d'aperçu et le fichier à télécharger. */
const VERSIONS: { titre: string; usage: string; svg: string; png?: string; fond: "clair" | "sombre" | "sable" }[] = [
  { titre: "Emblème en verre", usage: "Écrans, réseaux, vidéos : la version de référence, sur son fond vert profond. En médaillon rond, c’est celui des en-têtes de ces pages.", svg: IDENTITE.embleme, png: IDENTITE.png.embleme2048, fond: "clair" },
  { titre: "Emblème superposable", usage: "Sans fond : à poser sur une photo ou un fond sombre. C’est celui du menu et de l’accueil.", svg: IDENTITE.superposable, png: IDENTITE.png.superposable1024, fond: "sombre" },
  { titre: "Verre clair", usage: "Papeterie, fonds blancs ou sable, quand le fond vert serait trop lourd.", svg: IDENTITE.clair, png: IDENTITE.png.clair1024, fond: "clair" },
  { titre: "À plat, couleur", usage: "Impression courante, petites tailles (en dessous de 40 px), broderie.", svg: IDENTITE.plat, png: IDENTITE.png.plat1024, fond: "sable" },
  { titre: "Monochrome", usage: "Tampon, gravure, photocopie, fax : le verre s’écrase en noir et blanc, pas celui-ci.", svg: IDENTITE.mono, fond: "clair" },
  { titre: "Réserve blanche", usage: "Sur une couleur pleine ou une photo sombre, quand le verre ne convient pas.", svg: IDENTITE.reserve, fond: "sombre" },
];

const LOGOS: { titre: string; usage: string; svg: string; png: string; fond: "clair" | "sombre" }[] = [
  { titre: "Logo horizontal", usage: "Emblème, nom, développement du sigle, devise : documents, bannières, signatures.", svg: IDENTITE.horizontal, png: IDENTITE.png.horizontal, fond: "sombre" },
  { titre: "Logo horizontal clair", usage: "La même composition sur fond sable, pour le papier et les fonds blancs.", svg: IDENTITE.horizontalClair, png: IDENTITE.png.horizontalClair, fond: "clair" },
  { titre: "Logo vertical", usage: "Avatars, affiches, couvertures : l’emblème au-dessus du nom.", svg: IDENTITE.vertical, png: IDENTITE.png.vertical, fond: "sombre" },
];

const INTERDITS = [
  "Déformer, incliner, étirer ou faire pivoter le logo.",
  "Changer ses couleurs, ou poser l’emblème à plat couleur sur une photo.",
  "Ajouter une ombre, un contour, un effet ou un fond qui n’est pas le sien.",
  "Séparer les empreintes du soleil, en changer l’ordre ou le nombre.",
  "Réécrire le nom dans une autre police, ou l’accoler à un autre nom.",
  "Le placer dans la zone de protection d’un autre logo, ou en dessous des tailles minimales.",
];

export default function Identite() {
  return (
    <main id="main-content" className="hub-page od-page">
      <OdebHero
        eyebrow={`Projet ${ODEB.sigle} · identité visuelle`}
        title="Les Pas vers l’Avenir :"
        em="le logo du projet, et comment l’utiliser."
        lead={`Trois empreintes qui avancent vers un soleil levant : la première, la plus grande, ce sont les ancêtres ; la deuxième, la génération actuelle ; la troisième, la plus lumineuse, les générations futures. Sur les traces de nos ancêtres, bâtissons notre avenir. Identité retenue le ${IDENTITE.retenueLabel}, le jour du lancement de la réflexion ; ses fichiers, ses couleurs et ses règles sont ici.`}
        crumbs={[{ label: "Projet ODEB", href: "/odeb" }, { label: "Identité visuelle" }]}
        pills={[`Retenue le ${IDENTITE.retenueLabel}`, "Six versions de l’emblème", "Textes en tracés : aucune police à installer", "Kit ZIP, charte PDF, papier à en-tête"]}
      />
      <OdebNav actif="identite" />

      <section className="hub-section" id="sens">
        <SectionHead eyebrow="Le sens" title="Trois pas," em="un horizon." text="Le logo dit en une image ce que le projet dit en un livre blanc : on part de ce que les anciens ont laissé, on marche, et l’on avance vers ce que l’on prépare pour ceux qui viennent." />
        <div className="detail-grid od-sens">
          <article><span className="od-num">01</span><h3>Les ancêtres</h3><p>La première empreinte, la plus grande et la plus proche, la plus transparente aussi : ce qui a été fait avant nous, les fondations de 1986, la reconnaissance de 1995, la mémoire des lieux et des lignées.</p></article>
          <article><span className="od-num">02</span><h3>La génération actuelle</h3><p>La deuxième empreinte, au milieu du chemin : l’association remise en mouvement en 2026, ses coordonnateurs, ses plaidoyers, sa diaspora. Celle qui marche aujourd’hui.</p></article>
          <article><span className="od-num">03</span><h3>Les générations futures</h3><p>La troisième empreinte, la plus petite et la plus lumineuse, juste sous le soleil : les jeunes, les enfants, ceux pour qui l’on documente, l’on plaide, l’on construit.</p></article>
          <article><span className="od-num">☼</span><h3>Le soleil levant</h3><p>Posé sur l’horizon, sept rayons, du doré au vert acacia : l’espoir, le développement, l’avenir. Le disque vert profond reprend la couleur du site et le disque du logo d’ADEB LONODJI, dont l’ODEB est la suite : les empreintes de pas sont déjà dans le logo de l’association.</p></article>
        </div>
        <p className="od-devise">« {ODEB.devise} »</p>
      </section>

      <section className="hub-section" id="versions">
        <SectionHead eyebrow="Les versions" title="Six emblèmes," em="trois logos complets." text="Un seul dessin, décliné selon le support. Le verre est fait pour les écrans, les vidéos, les fonds photo et l’impression haut de gamme ; les versions à plat pour tout ce qui s’imprime vite ou petit. Chaque fichier se télécharge d’un clic ; le kit ZIP les rassemble." />
        <ul className="od-versions">
          {VERSIONS.map((v) => (
            <li key={v.svg}>
              <span className={`od-version-apercu est-${v.fond}`}><img src={v.svg} alt="" width={200} height={200} loading="lazy" decoding="async" /></span>
              <h3>{v.titre}</h3>
              <p>{v.usage}</p>
              <p className="od-version-liens"><a href={v.svg} download>SVG <span aria-hidden="true">↓</span></a>{v.png ? <a href={v.png} download>PNG <span aria-hidden="true">↓</span></a> : null}</p>
            </li>
          ))}
        </ul>
        <ul className="od-versions od-versions--logos">
          {LOGOS.map((v) => (
            <li key={v.svg}>
              <span className={`od-version-apercu od-version-apercu--large est-${v.fond}`}><img src={v.svg} alt="" width={v.svg.includes("vertical") ? 216 : 600} height={v.svg.includes("vertical") ? 270 : 192} loading="lazy" decoding="async" /></span>
              <h3>{v.titre}</h3>
              <p>{v.usage}</p>
              <p className="od-version-liens"><a href={v.svg} download>SVG <span aria-hidden="true">↓</span></a><a href={v.png} download>PNG <span aria-hidden="true">↓</span></a></p>
            </li>
          ))}
        </ul>
      </section>

      <section className="hub-section" id="couleurs">
        <SectionHead eyebrow="Couleurs et polices" title="Les couleurs du site," em="et deux polices." text="Les équivalents CMJN sont indicatifs : l’imprimeur ajuste sur épreuve. Les logos du kit ont leurs textes convertis en tracés, il n’y a donc aucune police à installer pour les afficher ; les polices servent aux documents qui les accompagnent." />
        <ul className="od-couleurs">
          {IDENTITE.couleurs.map((c) => (
            <li key={c.hex} style={{ background: c.hex, color: ["#B6CF45", "#F2C94C", "#F4F6F1"].includes(c.hex) ? "#10241e" : "#fff", borderColor: c.hex === "#F4F6F1" ? "var(--line)" : "transparent" }}>
              <strong>{c.nom}</strong><code>{c.hex}</code><small>CMJN {c.cmjn}</small><span>{c.role}</span>
            </li>
          ))}
        </ul>
        <div className="detail-grid" style={{ marginTop: 18 }}>
          {IDENTITE.polices.map((p) => <article key={p.nom}><h3 className={p.nom === "Playfair Display" ? "od-police-serif" : undefined}>{p.nom}</h3><p>{p.usage}</p></article>)}
        </div>
      </section>

      <section className="hub-section" id="regles">
        <SectionHead eyebrow="Les règles" title="Ce qu’on fait," em="ce qu’on ne fait pas." />
        <div className="detail-grid">
          <article><h3>Zone de protection</h3><p>Tout autour du logo, un espace vide au moins égal à la hauteur d’une empreinte (un quart du disque). Rien n’y entre : ni texte, ni autre logo, ni bord de page.</p></article>
          <article><h3>Tailles minimales</h3><p>Emblème : 40 px à l’écran, 12 mm imprimé. Logo horizontal : 180 px ou 45 mm. En dessous, l’emblème à plat, qui reste lisible jusqu’à 24 px.</p></article>
          <article><h3>Sur quel fond</h3><p>Sur fond clair, le verre clair ou l’emblème à plat ; sur fond sombre ou photo, la version superposable ou la réserve blanche ; sur couleur pleine, la réserve blanche. Jamais l’emblème à plat couleur sur une photo.</p></article>
          <article><h3>Avec le logo d’ADEB LONODJI</h3><p>Le projet est porté par l’association : quand les deux logos sont présents, celui d’ADEB LONODJI vient en premier, à la même hauteur d’emblème, séparés par leur zone de protection. Dans un texte institutionnel, la mention « projet porté par ADEB LONODJI » accompagne le nom.</p></article>
        </div>
        <div className="notice" style={{ marginTop: 18 }}>
          <strong>Ce qu’on ne fait pas.</strong>
          <ul className="od-interdits">{INTERDITS.map((i) => <li key={i}>{i}</li>)}</ul>
        </div>
      </section>

      <section className="hub-section" id="documents">
        <SectionHead eyebrow="À télécharger" title="Le kit," em="et les documents qui vont avec." />
        <div className="link-list">
          <a href={IDENTITE.kit} download><small>ZIP · tous les fichiers</small><strong>Kit du logo ODEB LONODJI</strong><span>Les onze SVG, les PNG jusqu’à 2048 px, la planche PDF, le papier à en-tête et un LISEZMOI avec les règles courtes.</span></a>
          <a href={IDENTITE.charte} download><small>PDF · charte</small><strong>Identité visuelle du projet ODEB LONODJI</strong><span>Cette page, en PDF, pour la joindre à un dossier ou l’envoyer à un partenaire.</span></a>
          <a href={IDENTITE.planche} download><small>PDF · 2 pages</small><strong>Planche pour l’imprimeur</strong><span>Toutes les versions, les couleurs avec leurs équivalents CMJN, les règles ; les textes en tracés.</span></a>
          <a href={IDENTITE.enTeteDocx} download><small>DOCX · A4</small><strong>Papier à en-tête, à compléter</strong><span>Logo, mention du portage par l’association, pied avec le contact ; le corps de la lettre est à vous.</span></a>
          <a href={IDENTITE.enTetePdf} download><small>PDF · A4</small><strong>Papier à en-tête, modèle à imprimer</strong><span>La même feuille en PDF, pour l’imprimeur ou pour écrire à la main.</span></a>
          <Link href="/presse#logo-odeb"><small>Espace presse</small><strong>Les logos de l’association et du projet</strong><span>Pour les journalistes et les partenaires, avec les règles de citation et les visuels à partager.</span></Link>
        </div>
      </section>

      <OdebEtat />
      <p className="lg-footnote">Identité « {IDENTITE.nom} » retenue le {IDENTITE.retenueLabel} pour le projet {ODEB.sigle}, porté par ADEB LONODJI ; elle deviendra celle de l’organisation si l’association le décide. Le logo appartient à l’association. Usage libre pour parler du projet, à condition de ne pas le modifier ; toute autre utilisation, <Link href="/participer?objet=odeb#contact">écrivez-nous</Link>, objet « Le projet ODEB LONODJI ». Dessins et scripts de génération : <code>design/odeb/</code> et <code>scripts/build-identite-odeb.py</code> dans le dépôt du site.</p>
    </main>
  );
}
