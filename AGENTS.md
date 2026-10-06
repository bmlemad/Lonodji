<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Règles du projet lonodji.org (à lire avant toute modification)

Site de l'association ADEB LONODJI (Bédjondo, Mandoul Occidental, Tchad). Next.js 16, hébergé sur Netlify ;
**chaque push sur `main` déclenche une construction et une mise en ligne**. Le dépôt GitHub est public.

## Publier
- Grouper les modifications : un seul push par série de travail, pas un commit poussé par fichier. Chaque push
  coûte une construction Netlify ; le quota du compte a déjà été épuisé une fois (30/09/2026).
- Avant chaque push : `npm run build` doit réussir en local. Ne jamais pousser un état qui ne se construit pas.
- Contrôle complet : `npm run qa` (PDF publiés, liens, pages, console, accessibilité) et `npm run qa:coherence` (chiffres).
- Aucune adresse de messagerie personnelle dans un PDF publié, même sous un cache : le texte doit être retiré
  (`scripts/qa/documents.py` échoue sinon). Le contact public est lonodji.org/participer.
- Récupérer d'abord le travail des autres (`git pull --rebase`) ; ne jamais forcer un push.

## Contenu : ce qui ne se négocie pas
- **Aucun chiffre inventé.** Tout chiffre affiché vient des données (`content/*.json`, `lib/*`) ou d'une source
  citée sur la page. Les compteurs se calculent (`thematiqueCount`, `getIndicateurs`, `villages.length`…),
  jamais écrits en dur — y compris dans les métadonnées et le JSON-LD.
- **Ce qui n'est pas fait s'écrit au conditionnel** ou comme proposition. Un indicateur proposé n'a pas de cible
  chiffrée tant que le bureau ne l'a pas validée.
- **Lieux sacrés et sépultures : jamais sur la carte publique**, ni leurs coordonnées nulle part.
- Écrire **« coordonnateur »** (jamais « coordinateur »).
- **Téléphone et contacts** : une seule source, `lib/contact.ts` (reprise par `ORG` dans `lib/content.ts`, par `scripts/org.py` pour les scripts Python et lue par `scripts/build-diaporama.js`) ; jamais en dur ailleurs dans le code.
- **Aucune donnée personnelle** issue des formulaires dans le dépôt (noms, courriels, téléphones des personnes).
- **Articles datés** (`content/articles/`, `/journal/…`) : leur texte ne se réécrit pas ; on ajoute au besoin une
  note datée. Même règle pour les entrées datées du journal des corrections (`/transparence`).
- Pages en arabe : non publiées tant qu'un locuteur natif ne les a pas relues. Les brouillons (`content/brouillons/`)
  sont hors dépôt.
- Auteur des articles dans le JSON-LD : l'association (`organizationId`), sauf signature nominative réelle.

## Contenu hérité et génération
- Les pages issues de l'ancien site se corrigent dans `scripts/corrections_fr.py` / `corrections_en.py`
  (remplacements exacts), puis `python3 scripts/import-legacy.py <ancien-site>` ; un remplacement sans effet est
  signalé à l'import.
  Les relectures suivantes ont leur propre fichier, `scripts/corrections_revue_<date>_<lot>.py`, chargé après les deux
  premiers. `python3 scripts/trouver-texte.py "texte affiché"` donne le fichier source et l'extrait exact à remplacer ;
  `--verifier` liste les corrections sans effet sans rien écrire. Ne pas éditer `content/pages/*.json` à la main : l'import les réécrit.
- Nommer un coordonnateur : une ligne dans `NOMINATIONS` (`scripts/import-legacy.py`) et une entrée dans
  `lib/decisions.ts`. Les phrases héritées qui comptent les coordinations (« quatre des vingt thématiques… »,
  « Sixteen themes out of twenty… ») sont recalculées à l'import (`comptes_courants`) : ne pas les corriger à la main.
- Structure en vigueur depuis le 6 octobre 2026 : six piliers stratégiques, intitulés et missions dans
  `content/architecture.json`. Ils remplacent les anciens pôles. Les vingt-deux thématiques sont rattachées une
  seule fois dans ce fichier ; `scripts/architecture.py` projette cette structure sur les données importées et les
  pages courantes. `import-legacy.py` rejoue cette projection. Les noms et l’ordre des piliers se reprennent depuis
  cette source ; les vice-présidences I et II conservent leurs titulaires, les III à VI restent à élire.
  Les articles, notes historiques et décisions datées conservent leurs formulations d’origine. Ne pas présenter
  l’alignement UNESCO/ODD comme une certification ou un partenariat. Le numérique est transversal : formation au II,
  connectivité au III, données et IA au VI. Les sept priorités restent dans `lib/organisation.ts`.
- `content/transmissions.json` : n'y porter un envoi, un accusé ou une réponse qu'avec sa date réelle, donnée par le
  bureau ; `/actions#transmission` l'affiche. Les lettres d'envoi (`build-lettres-envoi.py`) restent hors dépôt.
- Magazine « Lonodji » : un numéro paru (`public/magazine/*.pdf`) est un texte daté, jamais régénéré (pas de
  `--forcer` sans demande). Il ne reprend que ce que le site a publié ; seul l'édito de `numeros.json` lui est propre.
- Élection des vice-présidences : ne rien inscrire dans `content/election.json` (candidats, résultats) sans l'accord
  des candidats et le procès-verbal signé ; un changement de date passe par le bureau et par une ligne du registre.
- `import-legacy.py` **efface et recrée** `public/documents`, `public/identite`, `public/kit`, `public/app`.
  Les fichiers propres au site vont dans `public/og`, `carte`, `odeb`, `icones`, `missions`, `lettres`, `notes`.
- Après un import (qui lance lui-même `build-kit-adhesion.py`) : `build-dossier-presentation.py`, `build-carte.py`,
  `build-search-index.py`, puis `build-bibliotheque`, `build-villages`, `build-observatoire`,
  `build-indicateurs`, `build-fiches-mission` (voir README).
- Images de partage (`build-og.py`, toutes les pages) et visuels carrés (`build-visuels.py`) : seules celles dont le
  texte a changé sont refaites (empreintes dans `content/og-textes.json`). Les relancer après chaque build.
  Les visuels du kit de mobilisation (`public/kit/`) sont refaits par `build-kit-visuels.py` juste après l'import, qui
  recopie ceux de l'ancien site. Images de partage en JPEG ou PNG allégé : WhatsApp n'affiche pas d'aperçu au-delà de
  300 ko environ.
- Ne régénérer un PDF, un ZIP ou une présentation que si son contenu change : chaque version reste dans
  l'historique git (le dépôt dépasse déjà 270 Mo).
- Une nouvelle page s'enregistre dans `app/sitemap.ts`, `scripts/build-og.py`, `scripts/qa/controle.py` et
  `scripts/build-search-index.py` ; si elle a une version anglaise, aussi dans `FR_VERS_EN` (`lib/langues.ts`),
  `lib/navigation.ts` (FR et EN), `components/site-footer.tsx` et, au besoin, `LIENS_EN` de
  `components/legacy-content.tsx`. Une page de fond porte un bloc JSON-LD `WebPage` (`webPageSchema`).
- Couleurs : passer par les variables (`--muted`, `--champ-contour`, `--deep`, `--accent`) . Ne pas éclaircir
  `--muted` sans mesurer le contraste sur les fonds teintés : l'ancien `#607069` tombait à 4,1:1 sur `#dfe7cf`
  (AA demande 4,5:1), `#53625b` y tient 5,0:1.

## Performance et cache
- Cache immuable seulement sur les fichiers à empreinte (`/_next/static/*`). Les index et données sans empreinte
  (`search-index.json`, `search-palette.json`, `carte/donnees.json`, `sw.js`) se revalident à chaque visite.
- Le site doit rester utilisable en 3G lente : pas de bibliothèque lourde ajoutée sans mesure ; tout ce qui est
  différé doit rester utilisable pendant son chargement (voir `components/deferred-chrome.tsx`).
