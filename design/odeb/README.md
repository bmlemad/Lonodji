# Identité ODEB LONODJI — « Les Pas vers l’Avenir »

Concept du 28 septembre 2026, jour du lancement de la réflexion ODEB LONODJI,
**retenu le soir même et intégré au site** (version verre). Ce dossier garde les
dessins et leurs générateurs ; les fichiers publiés sont produits par
`scripts/build-identite-odeb.py` dans `public/odeb/identite/` et la page
`/odeb/identite` en est la charte en ligne.

## L’idée

Trois empreintes stylisées avancent vers un soleil levant posé sur l’horizon.

| Empreinte | Génération | Traitement |
|---|---|---|
| la première, la plus grande, en bas à gauche | les ancêtres | sable, la plus sombre |
| la deuxième, au milieu | la génération actuelle | crème |
| la troisième, la plus petite, sous le soleil | les générations futures | blanc, la plus claire |

Elles se suivent comme on marche — pied gauche, pied droit, pied gauche — et
rapetissent vers l’horizon, ce qui donne la profondeur du chemin. Le soleil
levant (doré → vert acacia, sept rayons) dit l’espoir, le développement,
l’avenir. Le disque vert profond reprend la couleur du site et le disque du
logo d’ADEB LONODJI, dont l’ODEB est la suite.

Devise associée : « Sur les traces de nos ancêtres, bâtissons notre avenir. » (28 septembre 2026).
Depuis le 2 octobre 2026, les logos complets portent la devise retenue par le bureau exécutif le
18 septembre 2026 : Unité • Solidarité • Développement ; la phrase ci-dessus dit le sens de l’emblème.

## Fichiers

Tout est produit par `python3 design/odeb/build-logo.py` (SVG, PNG 1024, planche).

- `odeb-embleme.svg` — emblème couleur (fond clair ou transparent)
- `odeb-embleme-reserve.svg` — réserve blanche, pour fond vert ou photo
- `odeb-embleme-mono.svg` — monochrome (tampon, photocopie, gravure)
- `odeb-logo-horizontal.svg`, `-sombre.svg` — emblème + nom + développement du sigle + devise
- `odeb-logo-vertical.svg`, `-sombre.svg` — version empilée (avatars, affiches, couvertures)
- `planche-les-pas-vers-l-avenir.png` — planche de présentation, avec test aux petites tailles

Couleurs : vert profond `#173b2d`, vert feuille `#2f6b4a`, acacia `#b6cf45`,
doré `#f2c94c`, encre `#10241e`. Polices : DM Sans (nom), Playfair Display
italique (devise) — celles du site.

## Version verre (28 septembre 2026, soir)

Le même concept traité en verre dépoli, produit par `python3 design/odeb/build-logo-verre.py`
dans `design/odeb/verre/` : disque translucide qui floute ce qu’il y a derrière lui,
bord en dégradé de lumière blanc → doré, reflet diffus, ombre portée profonde,
empreintes taillées dans le verre (de la plus transparente, les ancêtres, à la plus
lumineuse, les générations futures), soleil en lumière avec ses rayons. Le nom passe
en « ODEB » gras + « LONODJI » fin, lettres espacées.

- `odeb-verre-embleme.svg` / `-2048.png` — emblème sur fond premium sombre
- `odeb-verre-embleme-clair.svg` / `-2048.png` — verre clair sur fond sable (papeterie, fonds blancs)
- `odeb-verre-embleme-superposable.svg` — sans fond propre, à poser sur une photo ou un fond sombre
- `odeb-verre-logo-horizontal.svg` / `-clair.svg` (+ PNG) — emblème + nom + devise, 2000 × 640
- `odeb-verre-logo-vertical.svg` (+ PNG) — version empilée 1080 × 1350
- `planche-verre.png` — planche de présentation

Le verre est fait pour les écrans, les vidéos, les fonds photo et l’impression haut de
gamme ; pour le tampon, la photocopie et la gravure, `odeb-embleme-mono.svg` reste la
référence. Le flou « derrière le verre » est un filtre SVG : il s’affiche dans les
navigateurs et dans les PNG ; certains logiciels d’impression l’ignorent, d’où les PNG.

## Choix faits le 28 septembre 2026

1. Le vert (l’étape nouvelle), en continuité avec le disque du logo ADEB.
2. Le nom en capitales : « ODEB » gras, « LONODJI » fin.
3. La devise dans les logos complets (horizontal, vertical), pas dans l’emblème.
4. Textes convertis en tracés, planche PDF avec équivalents CMJN, kit ZIP,
   papier à en-tête : `scripts/build-identite-odeb.py`. Publication dans
   `public/odeb/identite/` (pas `public/identite/`, vidé par l’import).
