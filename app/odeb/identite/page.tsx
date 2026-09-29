import type { Metadata } from "next";
import Link from "@/components/lien";
import { SectionHead } from "../../../components/blocks";
import { OdebHero } from "../../../components/odeb-marque";
import OdebNav, { OdebEtat } from "../../../components/odeb-nav";
import { ogFor } from "../../../lib/content";
import { IDENTITE, ODEB } from "../../../lib/odeb";
import Partager from "@/components/partager";

export const metadata: Metadata = {
  title: "Identité visuelle : le logo « Les Pas vers l’Avenir », adopté le 28 septembre 2026",
  description: "Trois empreintes — les ancêtres, la génération actuelle, les générations futures — qui avancent vers un soleil levant : le logo d’ADEB LONODJI et de son projet ODEB LONODJI, ses versions, ses couleurs, ses règles d’usage, le kit à télécharger et les papiers à en-tête.",
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
  { titre: "ADEB LONODJI, horizontal", usage: "Emblème, nom de l’association, « Association de Développement et d’Entraide de Bédjondo », Courage · Discipline · Héritage.", svg: IDENTITE.adeb.horizontal, png: IDENTITE.adeb.png.horizontal, fond: "sombre" },
  { titre: "ADEB LONODJI, horizontal clair", usage: "La même composition sur fond sable, pour le papier et les fonds blancs.", svg: IDENTITE.adeb.horizontalClair, png: IDENTITE.adeb.png.horizontalClair, fond: "clair" },
  { titre: "ADEB LONODJI, vertical", usage: "Avatars, affiches, couvertures : l’emblème au-dessus du nom de l’association.", svg: IDENTITE.adeb.vertical, png: IDENTITE.adeb.png.vertical, fond: "sombre" },
  { titre: "ODEB LONODJI, horizontal", usage: "Emblème, nom du projet, développement du sigle, devise : documents du projet, bannières.", svg: IDENTITE.horizontal, png: IDENTITE.png.horizontal, fond: "sombre" },
  { titre: "ODEB LONODJI, horizontal clair", usage: "La même composition sur fond sable, pour le papier et les fonds blancs.", svg: IDENTITE.horizontalClair, png: IDENTITE.png.horizontalClair, fond: "clair" },
  { titre: "ODEB LONODJI, vertical", usage: "Avatars, affiches, couvertures : l’emblème au-dessus du nom du projet.", svg: IDENTITE.vertical, png: IDENTITE.png.vertical, fond: "sombre" },
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
        eyebrow="ADEB LONODJI · projet ODEB LONODJI · identité visuelle"
        title="Les Pas vers l’Avenir :"
        em="le logo de l’association et de son projet."
        lead={`Trois empreintes qui avancent vers un soleil levant : la première, la plus grande, ce sont les ancêtres ; la deuxième, la génération actuelle ; la troisième, la plus lumineuse, les générations futures. Sur les traces de nos ancêtres, bâtissons notre avenir. Dessiné pour le projet ODEB LONODJI et adopté le ${IDENTITE.adopteeLabel} par l’association comme son propre logo — un emblème, deux noms —, il est celui du site, de l’application et des images de partage. Ses fichiers, ses couleurs et ses règles sont ici.`}
        crumbs={[{ label: "L’association", href: "/mission" }, { label: "Identité visuelle" }]}
        pills={[`Adopté le ${IDENTITE.adopteeLabel}`, "Un emblème, deux noms", "Six emblèmes, six logos complets", "Textes en tracés : aucune police à installer", "Kit ZIP, charte PDF, papiers à en-tête", "Bannières, signature e-mail, cartes de visite, diaporamas"]}
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
        <SectionHead eyebrow="Les versions" title="Six emblèmes," em="six logos complets." text="Un seul dessin, décliné selon le support. Le verre est fait pour les écrans, les vidéos, les fonds photo et l’impression haut de gamme ; les versions à plat pour tout ce qui s’imprime vite ou petit. L’emblème seul est commun ; les logos complets portent le nom de l’association ou celui du projet. Chaque fichier se télécharge d’un clic ; le kit ZIP les rassemble." />
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
          <article><h3>Un emblème, deux noms</h3><p>« ADEB LONODJI » pour l’association, « ODEB LONODJI » pour le projet qu’elle porte : jamais les deux noms sous le même emblème. L’ancien logo bleu — disque, empreintes, poignée de main — reste sur les documents publiés avant le {IDENTITE.adopteeLabel} et ne se mélange pas au nouveau ; ses règles sont dans l’<Link href="/dossiers/identite-visuelle">identité visuelle précédente</Link>.</p></article>
        </div>
        <div className="notice" style={{ marginTop: 18 }}>
          <strong>Ce qu’on ne fait pas.</strong>
          <ul className="od-interdits">{INTERDITS.map((i) => <li key={i}>{i}</li>)}</ul>
        </div>
      </section>

      <section className="hub-section" id="documents">
        <SectionHead eyebrow="À télécharger" title="Le kit," em="et les documents qui vont avec." />
        <div className="link-list">
          <a href={IDENTITE.kit} download><small>ZIP · tous les fichiers</small><strong>Kit du logo « Les Pas vers l’Avenir »</strong><span>Les dix-neuf SVG (emblèmes, logos ADEB LONODJI et ODEB LONODJI), les PNG jusqu’à 2048 px, la planche PDF, les papiers à en-tête, les bannières, les images de profil, les signatures e-mail, les cartes de visite, les modèles de diaporama et un LISEZMOI avec les règles courtes.</span></a>
          <a href={IDENTITE.charte} download><small>PDF · charte</small><strong>Identité visuelle d’ADEB LONODJI et du projet ODEB</strong><span>Cette page, en PDF, pour la joindre à un dossier ou l’envoyer à un partenaire.</span></a>
          <a href={IDENTITE.planche} download><small>PDF · 3 pages</small><strong>Planche pour l’imprimeur</strong><span>Toutes les versions, les couleurs avec leurs équivalents CMJN, les règles ; les textes en tracés.</span></a>
          <a href={IDENTITE.adeb.enTeteDocx} download><small>DOCX · A4</small><strong>Papier à en-tête de l’association</strong><span>Logo ADEB LONODJI, reconnaissance de 1995, devise, pied avec le contact ; le corps de la lettre est à vous.</span></a>
          <a href={IDENTITE.adeb.enTetePdf} download><small>PDF · A4</small><strong>Papier à en-tête de l’association, à imprimer</strong><span>La même feuille en PDF, pour l’imprimeur ou pour écrire à la main.</span></a>
          <a href={IDENTITE.enTeteDocx} download><small>DOCX · A4</small><strong>Papier à en-tête du projet ODEB</strong><span>Logo ODEB LONODJI, mention du portage par l’association, pied avec le contact.</span></a>
          <a href={IDENTITE.enTetePdf} download><small>PDF · A4</small><strong>Papier à en-tête du projet ODEB, à imprimer</strong><span>La même feuille en PDF.</span></a>
          <Link href="/presse#visuels"><small>Espace presse</small><strong>Les logos de l’association et du projet</strong><span>Pour les journalistes et les partenaires, avec les règles de citation et les visuels à partager.</span></Link>
        </div>
      </section>

      <section className="hub-section" id="reseaux">
        <SectionHead eyebrow="Réseaux, messagerie, papeterie" title="Prêts à poser," em="le jour où l’on change de logo." text="Ajoutés au kit le 29 septembre 2026 : ce dont une page Facebook, un groupe WhatsApp, une boîte mail ou un imprimeur ont besoin, sans rien redessiner. Les bannières placent le logo dans la zone que les recadrages des téléphones ne coupent pas ; l’image de profil est faite pour le rond." />
        <div className="od-bannieres">
          {(["adeb", "odeb"] as const).map((m) => (
            <figure key={m} className="od-banniere">
              <img src={IDENTITE.reseaux.facebook[m]} alt={`Bannière ${m === "adeb" ? "ADEB LONODJI" : "ODEB LONODJI"} pour Facebook`} width="820" height="312" loading="lazy" />
              <figcaption><strong>{m === "adeb" ? "ADEB LONODJI" : "ODEB LONODJI"}</strong> · <a href={IDENTITE.reseaux.facebook[m]} download>Facebook {IDENTITE.reseaux.facebook.taille}</a> · <a href={IDENTITE.reseaux.linkedin[m]} download>LinkedIn {IDENTITE.reseaux.linkedin.taille}</a> · <a href={IDENTITE.reseaux.x[m]} download>X {IDENTITE.reseaux.x.taille}</a> · <a href={IDENTITE.reseaux.youtube[m]} download>YouTube {IDENTITE.reseaux.youtube.taille}</a></figcaption>
            </figure>
          ))}
        </div>
        <div className="link-list">
          <a href={IDENTITE.reseaux.profil} download><small>PNG · 1024 × 1024</small><strong>Image de profil</strong><span>L’emblème sur fond vert profond, pour Facebook, LinkedIn, WhatsApp : rien n’est coupé par le recadrage rond.</span></a>
          <a href={IDENTITE.reseaux.whatsapp} download><small>PNG · 640 × 640</small><strong>Icône de groupe WhatsApp</strong><span>La même image, à la taille que WhatsApp accepte.</span></a>
          <a href={IDENTITE.signature.adeb} download><small>HTML · messagerie</small><strong>Signature e-mail de l’association</strong><span>Ouvrir, tout sélectionner, copier, coller dans Gmail ou Outlook ; trois lignes entre crochets à remplacer. Le logo est hébergé ici, rien à joindre.</span></a>
          <a href={IDENTITE.signature.odeb} download><small>HTML · messagerie</small><strong>Signature e-mail du projet ODEB</strong><span>La même, au nom du projet.</span></a>
          <a href={IDENTITE.cartes.pdf} download><small>PDF · 85 × 55 mm</small><strong>Carte de visite de l’association, recto verso</strong><span>Nom, fonction, téléphone et adresse à remplacer par l’imprimeur ou dans un éditeur PDF ; code QR vers le site.</span></a>
          <a href={IDENTITE.cartes.planche} download><small>PDF · A4</small><strong>Planche de dix cartes de visite</strong><span>Recto puis verso, à imprimer en recto verso retourné sur le bord long, et à découper sur le trait.</span></a>
          <a href={IDENTITE.diaporama.adeb} download><small>PPTX · 16:9</small><strong>Modèle de diaporama de l’association</strong><span>Sept diapositives types (titre, partie, texte, colonnes, chiffres, étapes, fin) aux couleurs de l’identité ; installer DM Sans et Playfair Display pour retrouver les polices.</span></a>
          <a href={IDENTITE.diaporama.odeb} download><small>PPTX · 16:9</small><strong>Modèle de diaporama du projet ODEB</strong><span>Le même, au nom du projet.</span></a>
          <Link href="/odeb#presentation"><small>Projet ODEB</small><strong>La présentation du projet à l’assemblée</strong><span>Vingt-six diapositives faites depuis les pages du site : vision, missions, programmes, règles à voter, décisions attendues. PPTX et PDF.</span></Link>
        </div>
      </section>

      <OdebEtat />
      <Partager route="/odeb/identite" titre="Identité visuelle" texte="Trois empreintes — les ancêtres, la génération actuelle, les générations futures — qui avancent vers un soleil levant : le logo d’ADEB LONODJI et de son projet ODEB LONODJI, ses versions, ses couleurs, ses règles d’usage, le kit à télécharger et les papiers à en-tête." />
      <p className="lg-footnote">Identité « {IDENTITE.nom} » dessinée le {IDENTITE.retenueLabel} pour le projet {ODEB.sigle} et adoptée le même jour par ADEB LONODJI comme son logo, pour l’association et pour le projet qu’elle porte. Le logo appartient à l’association. Usage libre pour parler de l’association ou du projet, à condition de ne pas le modifier ; toute autre utilisation, <Link href="/participer#contact">écrivez-nous</Link>. Dessins et scripts de génération : <code>design/odeb/</code> et <code>scripts/build-identite-odeb.py</code> dans le dépôt du site.</p>
    </main>
  );
}
