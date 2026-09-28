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

## Formulaires

Les formulaires postent vers `/__forms.html` (Netlify Forms). Toute modification d’un formulaire doit être reportée dans `public/__forms.html` pour rester détectée au déploiement.
