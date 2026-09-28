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

## Espace de rédaction privé

- `/redaction` (noindex, lien discret « Rédaction » en pied de page) : écriture des articles en brouillon, aperçu dans le style du journal, rubrique, statut, enregistrement automatique, export `.md`. Mot de passe unique choisi à la première visite (scrypt + sel), jeton de session HMAC dérivé du hash courant (changer le mot de passe déconnecte tout), cinq erreurs bloquent l’entrée un quart d’heure. Mot de passe en POST seulement, jeton en en-tête `Authorization`.
- API `app/api/redaction/route.ts` ; logique et stockage dans `lib/redaction.ts` — magasin Netlify Blobs `adeb-redaction` en production, fichier `.netlify/redaction-dev.json` en local.
- La publication reste une décision éditoriale : un brouillon « prêt » est exporté (`.md`) puis publié par `python3 scripts/publier-article.py brouillon.md` (article JSON dans `content/articles/`, index, image de partage, index de recherche), suivi de `npm run build` et du déploiement ; `--retirer <slug>` le retire. L’import de l’ancien site conserve ces articles (`"source": "redaction"`).

## Couche appli mobile

- `public/.well-known/assetlinks.json` — lien entre le site et l’appli Android (`org.lonodji.app`) ; y ajouter les empreintes des clés Google Play après le premier envoi.
- `app/manifest.ts` — manifeste d’installation (icônes, raccourcis) ; `public/sw.js` — lecture hors ligne des pages déjà ouvertes, page de repli `/hors-ligne`.
- `components/app-shell.tsx` — reconnaissance de l’appli installée (écran d’accueil, appli Android, appli iPhone `LONODJI-iOS`) et barre d’onglets sur mobile dans ce cas.
- Outils en ligne : `/dossiers/trouver-ma-thematique` (`public/trouver.js`), `/dossiers/genealogie-outil` (`public/genealogie.js`, données dans le navigateur), carte du pays bedjond (`public/geo.js`).

## Formulaires

Les formulaires postent vers `/__forms.html` (Netlify Forms). Toute modification d’un formulaire doit être reportée dans `public/__forms.html` pour rester détectée au déploiement.
