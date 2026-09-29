# Version arabe : accueil et contact — brouillons, non publiés

Deux pages traduites depuis la version anglaise du 28 septembre 2026, recalées le 29 septembre sur les faits corrigés (vingt thématiques dont quinze pourvues, noms actuels des thématiques, nom de domaine en service) (`content/pages/en--index.json`, `en--contact.json`), en arabe standard moderne, **à relire par un locuteur natif avant toute publication**. Elles ne sont pas dans le build : rien de ce dossier n'est lu par le site.

- `index.md` — l'accueil (« Building Bédjondo's heritage together »)
- `contact.md` — le contact (« Get in touch »), avec les libellés du formulaire
- `relecture-arabe.docx` — les deux pages en tableau bilingue (anglais à gauche, arabe à droite, paragraphe par paragraphe), à envoyer au relecteur ; il corrige dans la colonne de droite ou en commentaire.

## Ce que le relecteur doit trancher

1. La translittération des noms propres : Bédjondo (بيدجوندو), Bedjond (بيدجوند), Mandoul (ماندول), Mandoul Occidental (ماندول الغربي), Sara (سارا), Bébopen (بيبوبين), Kul (كول), et les noms des personnes (Bignéro Moïalbéi LE MADANG, Adoumbé Maoura), gardés en caractères latins entre parenthèses.
2. Le registre : vouvoiement collectif (اكتبوا إلينا), formules d'accueil, et le mot retenu pour « plaidoyer » (مرافعة) et pour « pôle » (قطب).
3. Les chiffres : écrits en chiffres arabes occidentaux (15,000 ; 4,344), comme sur le reste du site ; le relecteur peut préférer les chiffres arabo-indiques (١٥٬٠٠٠).

## Après relecture : publier

1. Créer `app/ar/index/page.tsx` et `app/ar/contact/page.tsx` sur le modèle de `app/en/villages/page.tsx`, avec `<main lang="ar" dir="rtl">`, `alternates.languages` (fr, en, ar) et `ogFor(route, "ar")` (ajouter « ar » au type de `ogFor` et un gabarit d'image de partage en arabe dans `scripts/build-og.py`).
2. Ajouter dans `app/site.css` les règles `[dir="rtl"]` nécessaires (alignement, marges inversées des chevrons et des listes de liens, police avec glyphes arabes : `Noto Naskh Arabic` ou `Noto Sans Arabic` via `next/font/google`, sous-ensemble « arabic »).
3. Formulaire : dupliquer le formulaire `message-en` en `message-ar` dans `public/__forms.html` (Netlify Forms le détecte au build) et dans `components/`.
4. Déclarer les deux routes dans `lib/content.ts` (`EN_PAGES_APP` → une liste `AR_PAGES_APP`), l'index de recherche (`scripts/build-search-index.py`, rubrique « بالعربية »), le plan du site, la page Accessibilité (« deux pages en arabe »), le sélecteur de langue du pied de page.
5. `npm run build`, `python3 scripts/build-og.py /ar/index /ar/contact`, QA (`npm run qa`), déploiement.
