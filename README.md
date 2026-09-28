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

## Espace de rédaction privé

- `/redaction` (noindex, lien discret « Rédaction » en pied de page) : écriture des articles en brouillon, aperçu dans le style du journal, rubrique, statut, enregistrement automatique, export `.md`. Mot de passe unique choisi à la première visite (scrypt + sel), jeton de session HMAC dérivé du hash courant (changer le mot de passe déconnecte tout), cinq erreurs bloquent l’entrée un quart d’heure. Mot de passe en POST seulement, jeton en en-tête `Authorization`.
- API `app/api/redaction/route.ts` ; logique et stockage dans `lib/redaction.ts` — magasin Netlify Blobs `adeb-redaction` en production, fichier `.netlify/redaction-dev.json` en local.
- La publication reste une décision éditoriale : un brouillon « prêt » est exporté (`.md`) puis publié par `python3 scripts/publier-article.py brouillon.md` (article JSON dans `content/articles/`, index, image de partage, index de recherche), suivi de `npm run build` et du déploiement ; `--retirer <slug>` le retire. L’import de l’ancien site conserve ces articles (`"source": "redaction"`).

## Couche appli mobile

- `public/.well-known/assetlinks.json` — lien entre le site et l’appli Android (`org.lonodji.app`) : empreintes de la clé d’essai 2 (APK 1.0.1 du 28/09/2026, ouvre lonodji.org) et de la clé d’essai 1 (APK 1.0.0 du 24/09) ; y ajouter les empreintes des clés Google Play après le premier envoi, puis retirer les clés d’essai.
- `app/manifest.ts` — manifeste d’installation (icônes, raccourcis) ; `public/sw.js` — lecture hors ligne des pages déjà ouvertes, page de repli `/hors-ligne`.
- `components/app-shell.tsx` — reconnaissance de l’appli installée (écran d’accueil, appli Android, appli iPhone `LONODJI-iOS`) et barre d’onglets sur mobile dans ce cas.
- Outils en ligne : `/dossiers/trouver-ma-thematique` (`public/trouver.js`), `/dossiers/genealogie-outil` (`public/genealogie.js`, données dans le navigateur), carte du pays bedjond (`public/geo.js`).

## Formulaires

Les formulaires postent vers `/__forms.html` (Netlify Forms). Toute modification d’un formulaire doit être reportée dans `public/__forms.html` pour rester détectée au déploiement.
