> Référentiel du 6 octobre 2026 : les six piliers stratégiques remplacent les pôles.
> `content/architecture.json` porte leurs intitulés, missions et rattachements ; `scripts/architecture.py`
> régénère la structure et les pages courantes (aussi rejoué automatiquement à l’import).
> Les références UNESCO/ODD expriment un alignement, sans certification ni partenariat.

# ADEB LONODJI — lonodji.org

Site officiel de l’Association de Développement et d’Entraide de Bédjondo (ADEB LONODJI) — Courage • Discipline • Héritage.

Next.js (App Router) sans dépendance UI externe. Le contenu de la première version du site (septembre 2026 : 87 pages, 36 articles, 14 PDF) est intégré dans `content/` et rendu dans le design du site.

## Démarrer

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm start
```

Déploiement : Netlify (plugin Next.js), à partir de la branche `main`.

## Structure

- `app/` — pages (accueil, mission, histoire, programmes = nos actions, actions = plaidoyers, impact = suivi, journal, documents, dossiers, participer, transparence, archives, mentions légales, plan du site, `en/`).
- `components/` — navigation, pied de page, blocs de contenu, rendu du contenu importé (`legacy-content.tsx`), améliorations côté navigateur (formulaires, carte).
- `content/` — contenu importé : `index.json` (structure des pôles, plaidoyers, documents, chronologie, index du journal), `pages/*.json`, `articles/*.json`.
- `public/` — documents PDF, identité visuelle, images, `__forms.html` (déclaration des formulaires Netlify), `geo.js` (carte du pays bedjond).
- `scripts/import-legacy.py` — importe l’ancien site statique dans `content/` et `public/` (`python3 scripts/import-legacy.py /chemin/vers/ancien-site`).
- `scripts/build-legacy-css.py` — génère `app/legacy.css` (styles des composants importés, réduits et raccordés à la palette du site).
- `scripts/build-search-index.py` — génère `public/search-index.json` pour la page `/recherche` (à relancer après toute modification de `content/`).
- `scripts/build-og.py` — génère les images de partage `public/og/*.jpg` (une par page, titres et descriptions lus dans le site construit : lancer `npm run build` avant, puis relancer le build pour les déclarer).

## Carte du territoire

- `/carte` — carte interactive (Leaflet, fond humanitaire OpenStreetMap France) des 14 unités du pays bedjond (contours GADM 4.1), des localités et équipements OpenStreetMap (exports HOT/HDX) et des liens du site par unité ; fiche par lieu, recherche, bouton « Signaler un besoin ici » qui préremplit le formulaire de la carte des besoins (`?localite=`).
- `scripts/build-carte.py` — assemble `public/carte/donnees.json` à partir des sources (téléchargées dans `.cache/carte/` au premier lancement) ; à relancer pour rafraîchir les données OSM.

## Tableau de bord d’impact

- `/impact` — les six indicateurs du plan d’action 2026-2028 (adhérents, coordonnateurs, plaidoyers, besoins recensés, besoins résolus, projets actifs), puis « ce que le site produit » et « ce que le site reçoit » ; chaque chiffre porte sa source et sa date. Bandeau condensé sur l’accueil. Composant `components/tableau-de-bord.tsx`.
- `scripts/build-indicateurs.py` → `content/indicateurs.json` : compte le contenu (plaidoyers, coordinations, articles, PDF, corrections, engagements, problématiques du diagnostic, localités et équipements de la carte, projets et leur stade — liste `PROJETS` à tenir à jour) et fige le dernier relevé des formulaires (`RELEVE`, console Netlify, envois de test retirés). À relancer avant chaque `npm run build` qui suit une modification de contenu.
- `app/api/indicateurs/route.ts` — renvoie ces chiffres ; si la variable d’environnement `NETLIFY_FORMS_TOKEN` est définie sur le site (jeton d’accès personnel Netlify, *User settings → Applications → Personal access tokens*), les compteurs de formulaires sont relevés en direct sur l’API Netlify (mise en cache dix minutes) et la page les affiche « en direct ». Seuls des nombres sortent de l’API : les envois ne sont lus en mémoire que pour compter les personnes distinctes (intentions d’adhésion). Sans jeton, la page garde le relevé daté.
- Les chiffres que seule l’association détient (adhérents à jour de cotisation, besoins résolus) sont dans `bureau` du JSON : ils restent « non publiés » tant que le bureau ne les transmet pas avec leur date.

## Bibliothèque numérique et langue

- `/bibliotheque` — les références de la base de recherche (`content/pages/recherche.json`, importée) reclassées par rubrique documentaire, les publications de l’association (PDF, journal par rubrique), les chercheurs du pays bedjond (liste `CHERCHEURS` dans `scripts/build-bibliotheque.py`, à compléter) et un formulaire de dépôt `depot-document` avec fichier ≤ 10 Mo (`components/depot-form.tsx`). Données : `scripts/build-bibliotheque.py` → `content/bibliotheque.json` (à relancer après un réimport).
- `/langue` — la langue nangnda : ce que le site sait (sources : journal, base), les ressources en ligne (Lexique Nangnda de Dinguemrebeye & Keegan sur morkegbooks.com, rapport SIL), et le formulaire `mot-nangnda` (mot, sens, exemple, enregistrement ≤ 10 Mo, `components/mot-form.tsx`) qui amorce le dictionnaire numérique. L’alphabet et la prononciation restent à écrire avec les linguistes.
- Les formulaires avec pièce jointe partagent `components/envoi-multipart.ts` ; tous les formulaires du site sont déclarés dans `scripts/import-legacy.py` (`FORMULAIRES_SITE`) et décrits dans les mentions légales (`UPDATES`).

## Fiches des villages

- `/villages` (recherche + quatorze unités), `/villages/<unité>` (liste alphabétique, liens du site) et `/villages/<unité>/<village>` (une page par localité nommée : position, unité, équipements connus à moins de 10 km, six questions à documenter reliées aux formulaires préremplis — `?localite=`, `?lieu=` —, pages du site qui la citent, localités voisines). Composants `components/villages-recherche.tsx`, données `lib/villages.ts`.
- `scripts/build-villages.py` → `content/villages.json`, à partir de `public/carte/donnees.json` (qui porte désormais le slug de chaque localité, 8e élément) et de l’index de recherche (mentions). Ordre : `build-carte.py`, `build-search-index.py`, `build-villages.py`, `build-indicateurs.py`, `build-observatoire.py`, puis `npm run build`.
- La carte ouvre une fiche à l’arrivée avec `?village=<unité>/<slug>` ou `?unite=<id>`, et chaque fiche de la carte renvoie à la page du village.

## Répertoire des compétences et témoignages

- `/diaspora` — répertoire des compétences de la diaspora (action 4.1) : formulaire `diaspora-competences`, compteurs par personne, pays et domaines (`components/diaspora-compteurs.tsx`, listes dans `lib/diaspora.ts`). Le répertoire nominatif reste dans Netlify Forms ; le site ne publie que des nombres.
- `/temoignages` — « Racontez Bédjondo » (actions 1.2 et 5.2) : six séries recherchées, règles de consentement et de relecture, formulaire `temoignage` avec pièce jointe (photo, son, vidéo ≤ 10 Mo, envoi multipart par `components/temoignage-form.tsx`).
- Les deux formulaires sont déclarés dans `scripts/import-legacy.py` (`FORMULAIRES_SITE`) pour survivre aux réimports, et décrits dans les mentions légales (`UPDATES`).
- `scripts/build-territoire-svg.py` → `public/carte/territoire.svg` : silhouette des quatorze unités (mêmes tracés que la carte), bannière de l’accueil tant que la banque d’images est vide.

## Projet ODEB LONODJI (vision 2030)

- `/odeb` (vision, pourquoi, six missions, six programmes, repères 2030), `/odeb/livre-blanc` (document fondateur, version de travail, sommaire collant, impression), `/odeb/feuille-de-route` (trois phases 2026-2030, état réel de chaque chantier : réalisé, en cours, à venir, à décider), `/odeb/programmes` et `/odeb/programmes/<programme>` (trois axes chacun : « déjà en place » avec liens, « d’ici 2030 » au conditionnel ; thématiques et coordonnateurs lus dans `content/index.json`).
- Données et textes : `lib/odeb.ts` (formulation institutionnelle, menu, missions, repères, programmes, feuille de route calculée depuis les chiffres du site — `feuilleDeRoute(chiffres)`), `lib/odeb-chiffres.ts` (chiffres assemblés côté serveur), `components/odeb-nav.tsx` (barre de section et encadré d’état). Sources : les quatre documents de stratégie transmis en septembre 2026 ; rien n’y est présenté comme décidé.
- `scripts/build-livre-blanc.py` → `public/odeb/livre-blanc-odeb-lonodji-2026.pdf` : rend la page du livre blanc en A4 (feuille d’impression de `app/site.css`) après `npm run build` ; à relancer quand la page change. Le PDF est listé sur `/documents` et compté par `build-indicateurs.py`.
- `/en/odeb` — résumé en anglais du projet (missions, programmes, feuille de route, façons d’aider), relié depuis l’accueil anglais, le menu et `hreflang` ; le livre blanc reste en français.
- Le formulaire de contact accepte `?objet=odeb|presse|partenariat|question|donnees|autre` (préremplissage du champ Objet, `components/contact-prefill.tsx`) ; l’objet « Le projet ODEB LONODJI » a été ajouté à la source (`UPDATES_SOURCE`).
- Les trois pages importées qui citaient l’ancien développement du sigle (démarches, ONG et partenaires, mentions légales) portent le nouveau (« Organisation pour le Développement et l’Émergence Bedjonde ») et une note datée (`UPDATES` de `scripts/import-legacy.py`).

### Identité visuelle « Les Pas vers l’Avenir » (28 septembre 2026)

- Le logo : trois empreintes (les ancêtres, la génération actuelle, les générations futures) vers un soleil levant, en verre dépoli sur un disque vert profond ; devise « Sur les traces de nos ancêtres, bâtissons notre avenir. ». Dessins et générateurs dans `design/odeb/` (`build-logo.py` à plat, `build-logo-verre.py` verre) ; **rien n’est dessiné ailleurs**.
- `scripts/build-identite-odeb.py` (après `npm run build`, pour les polices) → `public/odeb/identite/` : onze SVG (emblème verre sur fond, superposable sans fond, verre clair, à plat, monochrome, réserve, logos horizontal et vertical, dont les textes sont convertis en tracés avec harfbuzz — `uharfbuzz`, `fonttools`, `brotli`), PNG (2048/1024/512), planche PDF pour l’imprimeur, papier à en-tête DOCX et PDF (`python-docx`), `LISEZMOI.txt`, et le kit ZIP qui rassemble tout. `public/odeb/` n’est pas touché par l’import de l’ancien site.
- Sur le site : `lib/odeb.ts` (`IDENTITE` : chemins, couleurs, polices), `components/odeb-marque.tsx` (`OdebEmbleme` — médaillon rond sur fond clair, verre sans fond sur fond sombre — et `OdebHero`, l’en-tête des pages du projet avec l’emblème), la barre `OdebNav`, la bande « Vision 2030 » de l’accueil, la vedette du méga-menu (`image` dans `lib/navigation.ts`), la page `/odeb/identite` (sens, versions à télécharger, couleurs, polices, règles, documents), `/presse#logo-odeb`, `/documents` (charte), le pied de page.
- `scripts/build-livre-blanc.py --tous` produit le livre blanc **et** la charte (`public/odeb/charte-identite-odeb-lonodji-2026.pdf`, rendu de `/odeb/identite`) ; `build-og.py` et `build-visuels.py` posent l’emblème sur les images des pages et cartes du projet quand `public/odeb/identite/odeb-lonodji-embleme-superposable-1024.png` existe.
- **Logo du site depuis le 28 septembre 2026 au soir** : l’association a adopté l’emblème comme son propre logo. Un emblème, deux noms : `adeb-lonodji-logo-*` (association, devise Courage · Discipline · Héritage) et `odeb-lonodji-logo-*` (projet). L’emblème est dans l’en-tête et le pied (`brand-mark--embleme`, `footer-mark--embleme`), le favicon (`app/icon.svg`, à plat), `app/apple-icon.png`, les icônes de l’application (`public/icones/icone-*.png`, manifest et `sw.js` v4), la pastille des images de partage (`LOGO` de `build-og.py`), le JSON-LD de `app/layout.tsx` ; papiers à en-tête ADEB et ODEB. L’ancien logo bleu reste dans `public/identite/` (documents antérieurs) et sur `/dossiers/identite-visuelle`, qui porte une note datée (`UPDATES`).
- Ordre après un changement de logo : `python3 design/odeb/build-logo-verre.py` (aperçus) → `npm run build` → `python3 scripts/build-identite-odeb.py` (SVG, PNG, icônes, planche, en-têtes, kit) → `python3 scripts/build-og.py` (toutes les pages : la pastille change) → `python3 scripts/build-visuels.py` → `python3 scripts/build-livre-blanc.py --tous` → `python3 scripts/build-indicateurs.py` → `npm run build`.

### Programme 06 — Économie sociale et revenus (28 septembre 2026, soir)

- Sixième programme du projet ODEB (`PROGRAMMES` dans `lib/odeb.ts`, slug `economie-sociale`) : des entreprises distinctes de l’association dont les bénéfices financent les projets. Trois axes proposés (complexe hôtelier à Bédjondo, complexe scolaire avec internat dès la sixième, transport et logistique terrestres — reprend le projet Air Bedjondo), cinq règles (`principes`), dix activités supplémentaires proposées (`portefeuille` : quoi, pourquoi ici, revenus, ce que ça finance, préalables, risque), trois étapes (`etapes`) ; la page `app/odeb/programmes/[programme]` rend ces sections quand elles existent. Rien n’est décidé ni chiffré : tout est au conditionnel.
- Retombées : deux projets au stade « idée » dans `content/projets.json` (`complexe-hotelier`, `complexe-scolaire-internat`), Air Bedjondo rattaché au programme ; deux chantiers de plus dans la feuille de route (phase 2 : études de faisabilité, forme juridique ; phase 3 : première entreprise en service) ; « six programmes » partout (menu, vision, livre blanc, visuels, EN) ; entrée de recherche ; brève au journal `2026-09-28-sixieme-programme-economie-sociale`.

## Directions de pôle (28 septembre 2026)

- Chaque pôle a une direction, au rang de chef de projet, distincte de la coordination des thématiques : `DIRECTIONS_POLES` dans `scripts/import-legacy.py` (nommer quelqu’un : `"pole-2": "Prénom Nom, qualité"`, puis réimporter) → `structure.poles[].direction` dans `content/index.json` (`Direction` dans `lib/content.ts`, `directionsCount`).
- Affichage : `/programmes` (ligne « Direction du pôle » dans chaque en-tête de pôle, tuile de statistiques, section « Diriger un pôle »), accueil (cartes des pôles), `/impact` (carte Coordonnateurs), `/participer` (texte, lien), index de recherche (une entrée par direction). Le formulaire de contact propose « Direction du pôle I–IV » dans la liste des thématiques (`UPDATES_SOURCE`, mêmes champs Netlify) ; `/participer?direction=II&coordo=1#contact` présélectionne (`components/contact-prefill.tsx`). Article du journal : `2026-09-28-directions-de-pole`.

## Plateforme de projets

- `/projets` — chaque projet décrit sur le site avec son stade (huit stades, d’« Idée » à « En service »), ce qui existe (liens), ce qui manque, budget et calendrier tels que connus, thématique et coordonnateur, façons de contribuer ; règles de la plateforme (aucun franc sans compte, budget publié sur devis avant toute demande) ; formulaire `proposition-projet` (compté sur le tableau de bord, décrit dans les mentions légales).
- Données : `content/projets.json`, à tenir à jour à la main (stade, existant, manque, contribuer ; les montants seulement s’ils figurent, sourcés, sur la page du projet) ; lu par `lib/projets.ts` et par `scripts/build-indicateurs.py` (projets actifs = stades essai, réalisation, service).

## Observatoire du Mandoul Occidental

- `/observatoire` — le territoire en chiffres, unité par unité : localités nommées, équipements connus des données ouvertes par famille, couverture à 10 km, localités citées sur le site, pages par unité ; diagnostic par domaine (documenté, partiel, ailleurs, inconnu ; qui décide ; thématiques) ; suivi des plaidoyers (publié, transmis, réponse) ; tableau des huit indicateurs avec source, méthode et état ; ce qui manque est écrit comme manquant (besoins résolus non publiés, population indisponible).
- Données : `scripts/build-observatoire.py` → `content/observatoire.json`, à lancer après `build-carte.py`, `build-villages.py` et `build-indicateurs.py` (il lit aussi `content/pages/problematiques.json` et `content/index.json`). Lecture par `lib/observatoire.ts`.

## Espace presse

- `/presse` — pour journalistes et partenaires : citation prête à l’emploi, chiffres datés (tableau de bord), six dates, bureau exécutif (`ORG.bureau`), communiqués (articles « Vie de l’association » et lettre), documents (dossier de présentation, livre blanc), logos téléchargeables avec leurs règles (`public/identite/`), quatre règles demandées aux médias, contact presse, et cinq visuels carrés à partager (WhatsApp, réseaux) produits par `scripts/build-visuels.py` → `public/partage/` (textes dans `VISUELS`, chiffres lus dans `content/` ; à relancer après `npm run build` quand les compteurs changent). Aucune photo tant que la banque d’images est vide.

## Accessibilité

- `/accessibilite` — déclaration : niveau visé (WCAG 2.1 AA), contrôles avant mise en ligne (axe-core sur toutes les pages, parcours clavier, captures à trois largeurs), limites connues (carte Leaflet, PDF, contenus importés), signalement d’un obstacle ; reliée en pied de page avec « Signaler un manquement » (mécanisme de plainte de la charte).

## Pages anglaises de l’appli (29 septembre 2026)

- En plus des six pages importées (`/en/index`, `about`, `advocacy`, `bedjondo`, `contact`, `themes`) et de `/en/odeb` : `/en/villages` (les quatorze unités, comptes lus dans `content/villages.json`), `/en/projects` (stades et projets traduits dans la page, données de `content/projets.json`), `/en/impact` (les six indicateurs et ce que le site produit, `content/indicateurs.json`). `hreflang` fr/en sur les pages françaises correspondantes ; liste `EN_PAGES_APP` dans `lib/content.ts` (plan du site), sitemap, index de recherche ; l’accueil anglais les relie (`UPDATES_SOURCE`). L’arabe est prêt en brouillon (`content/brouillons/ar/`) et attend un relecteur.

## Dix chantiers du 29 septembre 2026

- **Régime des pages** : plus de préchargement automatique des liens (`components/lien.tsx`, alias `@/`, tous les `next/link` passent par lui) — mesuré sur téléphone, chaque page déclenchait 170 à 210 ko de préchargements ; un fil d’attente (`html.nav-pending`) apparaît pendant le chargement de la page cliquée (`components/nav-tools.tsx`). Mesure : `python3 scripts/qa/controle.py https://lonodji.org --poids`.
- **Partager** (`components/partager.tsx`) : WhatsApp, partage natif, copie du lien, Facebook, e-mail, message prêt à coller ; bloc `<Partager>` en bas des pages de contenu (villages, unités, dossiers, programmes, articles, pages ODEB, pages anglaises) et feuille depuis le bouton de l’en-tête (`lonodji:partager`) sur toute page.
- **Fiches village imprimables** : code QR calculé au build (`lib/qr.ts`, paquet `qrcode`), adresse en toutes lettres, bouton Imprimer (`components/imprimer.tsx`), feuille d’impression avec les six questions à remplir à la main. **Affiches** : `scripts/build-affiches.py` → `public/carte/affiches/` (quatorze unités + une générale, A4, `segno` pour le QR), liées depuis `/villages#affiches` et chaque page d’unité.
- **Kit identité complété** (`scripts/build-identite-odeb.py`) : bannières Facebook/LinkedIn/X/YouTube pour les deux noms, image de profil et icône WhatsApp, signatures e-mail HTML (logo hébergé `…-signature-logo.png`), carte de visite 85 × 55 mm et planche A4, modèles PowerPoint (`scripts/build-diaporama.js --modeles`, pptxgenjs, images dans les masques) ; page Identité `#reseaux`, presse.
- **Fiches de mission** (`scripts/build-fiches-mission.py`) : 25 PDF + recueil dans `public/missions/`, index `content/missions.json`, page `/programmes/fiches-de-mission` ; textes repris de la structure publiée, rien d’inventé ; à relancer après chaque nomination.
- **Présentation ODEB à l’assemblée** : `node scripts/build-diaporama.js --assemblee` (26 diapositives depuis `lib/odeb.ts` et `content/`) puis `python3 scripts/build-diaporama-pdf.py` (LibreOffice, vraies polices) → `public/odeb/odeb-lonodji-presentation-assemblee-2026.pptx/.pdf`, liée depuis `/odeb#presentation`.
- **Lettre d’information** : `scripts/build-lettre.py` → PDF de chaque numéro (`public/lettres/`, index `content/lettres.json`), page `/lettre` ; `--brouillon AAAA-MM` prépare le numéro du mois dans `content/brouillons/` (articles par rubrique, postes ouverts, chiffres datés), à compléter puis publier avec `publier-article.py`.
- **Registre des décisions** : `lib/decisions.ts` (une entrée par fait daté et sourcé, statut décidé/nommé/annoncé/à voter/publié/en vigueur), page `/transparence/decisions`.
- **Contrôles qualité** : `scripts/qa/` (`controle.py`, `coherence.py`, `documents.py`, `local.sh`), `npm run qa` (PDF publiés : aucune messagerie personnelle, kit d'adhésion à jour, aucun original de l'ancien site resté à la place d'un PDF régénéré ; puis site construit sur le port 3100, liens, ancres, console, axe-core, visuel), `npm run qa:live` (site en ligne + poids), `npm run qa:coherence` ; une tâche planifiée hebdomadaire (lundi 6 h 59, Ndjamena) contrôle le site en ligne en lecture seule.
- **Version arabe** : `content/brouillons/ar/` (accueil, contact, DOCX de relecture, marche à suivre) — non publiée tant qu’un locuteur natif n’a pas relu. Depuis le 30 septembre 2026, `content/brouillons/` est hors dépôt (le dépôt est public) : copie de travail sur le Mac, `~/Documents/Lonodji-brouillons`.

## Outils de navigation (28 septembre 2026, soir)

- **Palette « Aller à… »** (`components/palette.tsx`) : ouverte par la loupe de l’en-tête, la touche `/`, `Ctrl+K` ou `⌘K` ; recherche instantanée sur l’index allégé `public/search-palette.json` (titre, route, type, description ; produit par `build-search-index.py` avec l’index complet), résultats groupés par type, clavier (flèches, Entrée, Échap), raccourcis quand le champ est vide, repli vers `/recherche?q=` et `/villages?q=`. Plein écran sur téléphone.
- **En-tête qui se resserre** après 60 px (`html.nav-compact`) et, sur téléphone, **s’efface en descendant et revient en remontant** (`html.nav-hidden`, jamais quand le menu ou la palette sont ouverts) — `components/nav-tools.tsx`.
- **Fil de lecture** (`.lecture`) sur les pages longues (articles, livre blanc, identité, feuille de route, programmes, dossiers, fiches de villages, presse, transparence…) et **retour en haut** avec un anneau d’avancement.
- **Rail « Sur cette page »** (`components/section-rail.tsx`, ≥ 1280 px) : les sections de `<main>` qui ont un titre, construites après le rendu, suivies au défilement ; absent quand la page a un sommaire (livre blanc) ou moins de trois sections.
- **Barre d’onglets** en bas d’écran (`components/app-shell.tsx`) pour tous les visiteurs sur téléphone, plus seulement l’appli installée : Accueil, Villages, Journal, Agir, Menu ; masquée quand le clavier ou la palette sont ouverts.

## Navigation (en-tête, méga-menu, menu mobile, pied de page)

- Une seule source : `lib/navigation.ts` (`NAVIGATION` pour l’en-tête et le menu mobile, `PIED` pour le pied de page, `entreeCourante()` pour surligner la section de la page courante) ; le plan du site s’en sert aussi.
- `components/site-nav.tsx` : barre fixe ; sur ordinateur (> 1100 px) six entrées — L’association, Nos actions, Territoire, Projet ODEB, Journal, Participer — dont cinq ouvrent un panneau (bouton `aria-expanded`, colonnes de liens avec description, carte en vedette dont les chiffres viennent de `content/indicateurs.json` via `app/layout.tsx`) : survol à la souris, clic ou Entrée au clavier, flèche bas vers le premier lien, Échap referme et rend le focus, clic ailleurs et changement de page referment. Sur tablette et mobile (≤ 1100 px) : menu plein écran avec recherche (`/recherche?q=`), groupes dépliables (`<details>`, ouverts par défaut à partir de 641 px), actions (rejoindre, WhatsApp, installer) et liens de fin.
- `components/site-footer.tsx` : bandeau (qui nous sommes, contact, rejoindre, lettre d’information), cinq colonnes, ligne de fin avec la date de construction du site.
- `components/blocks.tsx` : `PageHeader` émet un `BreadcrumbList` (JSON-LD) dès qu’un fil d’Ariane est fourni.
- `components/nav-tools.tsx` : bouton « retour en haut » après 900 px de défilement (au-dessus de la barre d’onglets en appli) et touche `/` vers la recherche hors des champs.

## Espace de rédaction privé

- `/redaction` (noindex, lien discret « Rédaction » en pied de page) : écriture des articles en brouillon, aperçu dans le style du journal, rubrique, statut, enregistrement automatique, export `.md`. Mot de passe unique choisi à la première visite (scrypt + sel), jeton de session HMAC dérivé du hash courant (changer le mot de passe déconnecte tout), cinq erreurs bloquent l’entrée un quart d’heure. Mot de passe en POST seulement, jeton en en-tête `Authorization`.
- API `app/api/redaction/route.ts` ; logique et stockage dans `lib/redaction.ts` — magasin Netlify Blobs `adeb-redaction` en production, fichier `.netlify/redaction-dev.json` en local.
- La publication reste une décision éditoriale : un brouillon « prêt » est exporté (`.md`) puis publié par `python3 scripts/publier-article.py brouillon.md` (article JSON dans `content/articles/`, index, image de partage, index de recherche), suivi de `npm run build` et du déploiement ; `--retirer <slug>` le retire. L’import de l’ancien site conserve ces articles (`"source": "redaction"`).

## Couche appli mobile

- `public/.well-known/assetlinks.json` — lien entre le site et l’appli Android (`org.lonodji.app`) : empreintes de la clé d’essai 2 (APK 1.0.1 du 28/09/2026, ouvre lonodji.org) et de la clé d’essai 1 (APK 1.0.0 du 24/09) ; y ajouter les empreintes des clés Google Play après le premier envoi, puis retirer les clés d’essai.
- `app/manifest.ts` — manifeste d’installation (icônes, raccourcis : Villages, Journal, Adhérer, Rechercher) ; `public/sw.js` — lecture hors ligne des pages déjà ouvertes, page de repli `/hors-ligne` ; incrémenter `VERSION` à chaque changement de la coquille.
- Responsive : mobile ≤ 800 px (barre compacte, menu plein écran, barre d’onglets en appli, silhouette du territoire sous le héros), tablette 801–1100 px (même menu plein écran, groupes sur deux colonnes), ordinateur au-delà (méga-menu).
- `components/app-shell.tsx` — reconnaissance de l’appli installée (écran d’accueil, appli Android, appli iPhone `LONODJI-iOS`) et barre d’onglets sur mobile dans ce cas.
- Outils en ligne : `/dossiers/trouver-ma-thematique` (`public/trouver.js`), `/dossiers/genealogie-outil` (`public/genealogie.js`, données dans le navigateur), carte du pays bedjond (`public/geo.js`).

## Formulaires

Les formulaires postent vers `/__forms.html` (Netlify Forms). Toute modification d’un formulaire doit être reportée dans `public/__forms.html` pour rester détectée au déploiement.

## Revue du 29 septembre 2026

- Pages françaises dans le groupe de routes `app/(fr)`, pages anglaises dans `app/en` : deux mises en page racines
  (`components/root-shell.tsx`), donc `<html lang="en">` sur /en ; 404 globale (`app/global-not-found.tsx`).
- Corrections de texte des pages héritées : `scripts/corrections_fr.py` et `scripts/corrections_en.py`
  (remplacements exacts par fichier source ; l'import signale « correction sans effet » s'il en reste un inopérant).
- Après `import-legacy.py`, relancer aussi `build-dossier-presentation.py` (dossier de présentation régénéré depuis les
  données). `build-kit-adhesion.py` est lancé par l'import lui-même, dès la copie des documents (30/09/2026) : kit
  d'adhésion (collecte suspendue, contact, engagement) et carnet d'enquête (contact). L'adresse personnelle et
  l'ancien engagement sont retirés de la couche texte (caviardage PyMuPDF, `pip install pymupdf`), pas seulement
  recouverts ; `scripts/qa/documents.py` le vérifie.
- Espace de rédaction : la création du mot de passe exige le code d'invitation `REDACTION_INVITATION` (variable Netlify).

## Trente septembre 2026

- **Trois pages de fond « Territoire »**, chacune doublée en anglais. Le français fait référence ; les fichiers `-en.ts` ne portent que la traduction, élément par élément dans le même ordre (un élément sans traduction garde son texte français, visible) :
  - `/territoire/gouvernance-locale` et `/en/governance` : `lib/gouvernance-locale.ts` et `lib/gouvernance-locale-en.ts` ;
  - `/territoire/propositions-commune` et `/en/commune` : `lib/propositions-commune.ts` et `lib/propositions-commune-en.ts`, plus une version imprimable `/territoire/propositions-commune/dossier` (hors menu, non indexée) et son PDF `public/notes/propositions-commune-bedjondo.pdf` ;
  - `/territoire/sous-sol` et `/en/subsoil` : `lib/sous-sol.ts` (`SOURCES` numérotées en bas de page, constats, inconnues, leçons de Doba, propositions, engagements) et `lib/sous-sol-en.ts`. Chaque constat cite ses sources ; ce qui n'est pas établi va dans les inconnues, jamais dans les constats.
- **Thématique 21 Énergie** : l'énergie quitte la 08, qui devient « Routes & urbanisme ». Le découpage se fait à l'import (`structure_30_09` dans `scripts/import-legacy.py` : carte de la thématique, note datée, renvois) ; côté site, slug `energie` dans `lib/bailleurs.ts`, `lib/secteurs.ts` et `lib/odeb.ts`.
- **Comptes recalculés** : les phrases héritées qui comptent les coordinations (`comptes_courants` à l'import) et le nombre de directions de pôle pourvues (`directionsPourvues` et `directionsTotal` dans `content/indicateurs.json`) ne s'écrivent plus à la main.
- **Couleurs** : gris secondaire `--muted: #53625b`, contour des champs `--champ-contour: #7f8b85` et anneau de focus en fin de `app/site.css`. Utiliser ces variables plutôt qu'une couleur écrite en dur.
- **Données structurées** : les six pages ci-dessus portent un bloc `WebPage` (`webPageSchema` de `lib/schema.ts`), comme les autres pages de fond.

## Premier octobre 2026 : organisation décidée

Le bureau exécutif a adopté le 1er octobre 2026 les huit propositions tirées du benchmark de la structure (registre 2026-30 à 2026-32, page `/association/propositions-organisation`, données `lib/organisation.ts`).

- **Cinq pôles** : le pôle II devient « Services essentiels » (07, 09, 10, 11, 12) ; un pôle V, « Économie, territoire & risques », reçoit 04, 05, 06, 08, 20 et 21, sans renumérotation. Le partage se fait à l'import (`structure_01_10` dans `scripts/import-legacy.py`) sur `poles.html`, `suivi.html`, `contact.html`, `trouver.js` et `en/themes.html` ; textes datés et charte d'identité exclus (la charte reçoit une note).
- **Six pôles, vingt-deux thématiques** (registre 2026-35, l'après-midi du 1er octobre) : le pôle V devient « Économie & ressources naturelles » (04, 05, 06) et un pôle VI, « Infrastructures, territoire & risques », reçoit 08, 20 et 21 (second partage dans `structure_01_10`, `VERS_P6`) ; une thématique 22, Sport, arts & loisirs (`structure_sport`, id `sport-arts-loisirs`), rejoint le pôle II. Aucune thématique supprimée ni renumérotée ; la vice-présidence du pôle VI s'ajoute à l'élection (`content/election.json`).
- **Vice-présidences de pôle** : les directions de pôle deviennent des vice-présidences déléguées, pourvues par élection (`DIRECTION_LABEL`, `DIRECTIONS_POLES`, pôle V à pourvoir). Les fichiers PDF gardent leur nom `fiche-mission-direction-pole-N.pdf`.
- **Cellule Financement** : confiée par intérim à la trésorière (ligne dans `NOMINATIONS`).
- **Sept thématiques prioritaires** (`PRIORITAIRES`, `estPrioritaire`) : mention sur chaque ligne de thématique (`ThematiqueRow`), liste sur `/programmes#propositions-organisation`, adjoint à trouver (`?adjoint=1` préremplit le message du formulaire).
- **Postes ouverts** (`lib/postes.ts`, `/participer#postes-ouverts`) : un adjoint par priorité, un titulaire par priorité sans coordonnateur, une vice-présidence par pôle qui n'en a pas, calculés depuis `content/index.json` ; un poste pourvu disparaît à l'import suivant. `scripts/build-postes.py` (même calcul, dans la chaîne après `build-visuels.py`) fait un visuel carré par poste (`public/partage/postes/`, gabarit de `build-visuels.py`) et les messages WhatsApp (`content/brouillons/postes-ouverts-whatsapp.md`, hors dépôt).
- **Transmission des plaidoyers** (`content/transmissions.json`, `lib/transmissions.ts`, `/actions#transmission`) : destinataires de chaque plaidoyer et état de chaque lettre (`a-signer`, `envoye`, `accuse`, `reponse`, avec dates). `scripts/build-lettres-envoi.py` fait une lettre d'envoi par destinataire, à signer par le président et le secrétaire général (numéro et date laissés en blanc), et un bordereau de suivi par dossier, dans `content/brouillons/envois/` (hors dépôt). Un envoi n'entre dans le JSON que le jour où il a eu lieu.
- **Magazine « Lonodji »** (`/magazine`, `lib/magazine.ts`) : trimestriel, un numéro en janvier, avril, juillet et octobre (n° 1 le 1er octobre 2026). Chaque numéro est décrit dans `content/magazine/numeros.json` (une, édito, sommaire) ; tout le reste est repris tel quel du site (articles, registre `lib/decisions.ts`, plaidoyers et `transmissions.json`, structure, postes ouverts). `scripts/build-magazine.py` (après `npm run build`) fait le PDF A4 (`public/magazine/lonodji-NN-AAAA-MM.pdf`, sommaire paginé en deux passes, folios sauf sur les couvertures), la couverture JPEG et `content/magazine/index.json`. Un numéro paru n'est jamais réécrit : seul `--forcer` le refait. Pour un nouveau numéro : ajouter son entrée dans `numeros.json` (période couverte, une, édito, sommaire), lancer le script, relire le PDF.
- **Aperçus légers** (`scripts/build-apercus.py`, dans la chaîne après `build-magazine.py`) : les pages qui montrent en vignette une image à télécharger (Presse, Kit de mobilisation, couverture du magazine, affiches des villages) affichent une copie WebP réduite (`public/apercus/`, 720 px au plus) ; le lien garde l'original. `lib/apercu.ts` choisit l'aperçu s'il existe (`apercu(src)`, et `apercusHtml` pour les pages reprises de l'ancien site). La page Presse passe ainsi d'environ 4,9 Mo à moins de 1 Mo à la première visite.
- **Élection des vice-présidences et plans annuels** (décisions 2026-33 et 2026-34 du 1er octobre 2026) : règles, calendrier, candidats et résultats dans `content/election.json` (seule source, lue par `lib/election.ts`, `lib/postes.ts`, `build-postes.py` et `build-dossier-bureau.py`) ; page `/association/election-vice-presidences`. `scripts/build-dossier-bureau.py` (à relancer quand `election.json` change, hors chaîne) produit les PDF publics `public/organisation/` (procédure et appel, fiche de candidature, plans annuels préremplis avec les engagements écrits de chaque plaidoyer) et, hors dépôt, le dossier complet du bureau avec bulletins et procès-verbal (`content/brouillons/bureau/`). Les candidats n'entrent dans le JSON qu'avec leur accord, après la clôture ; les résultats, qu'avec le procès-verbal signé.
- **Accueil** (refait le 1er octobre 2026, `app/(fr)/page.tsx`, styles `acc-` à la fin de `app/site.css`) : carte cliquable du pays bedjond en tête (`components/carte-accueil.tsx`, tracés `content/territoire-carte.json` produits par `scripts/build-territoire-svg.py` ; chaque unité mène à `/villages/<unité>`), frise « En ce moment » (`components/en-ce-moment.tsx` : calendrier de `content/election.json`, prochain magazine ; la prochaine étape est marquée au jour du lecteur), six pôles en grille 3 × 2, plaidoyers, projet ODEB, journal, territoire et mémoire, tableau de suivi, participer. Tout est lu dans `content/`.
- **Réseaux sociaux** (1er octobre 2026) : page Facebook « Lonodji », compte X @adeb_lonodji, chaîne YouTube @adeb.lonodji. Adresses dans `ORG` (`lib/content.ts` : `facebook`, `x`, `youtube`), reprises par le pied de page et le `sameAs` de `lib/schema.ts`. TikTok : pas encore de compte.
