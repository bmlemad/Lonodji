# lonodji.org — plan de développement

Établi le 16 octobre 2026 par l'animation du site, à la demande de l'utilisateur. Il remplace la suite de petites
tâches par une feuille de route datée, avec pour chaque chantier un livrable, un critère de fin et un responsable.
Les dates viennent du calendrier réel de l'association (`content/election.json`, chronogramme du Comité dans
`lib/odeb.ts`, verrou de transfert du domaine) ; aucune cible chiffrée n'est inventée.

Le plan se relit chaque lundi lors du contrôle hebdomadaire ; une ligne « État » est mise à jour, jamais réécrite.

## 0. Où en est le site (16 octobre 2026)

| Mesure | Valeur | Source |
|---|---|---|
| Pages FR/EN du sitemap | 1 120 (dont 965 fiches de localités) | `app/sitemap.ts` |
| Articles du journal | 47 depuis le 11 septembre 2026 | `content/articles/` |
| Documents PDF publiés | 19 (+ 7 annoncés) | `content/indicateurs.json` |
| Coordinations pourvues | 16 sur 22 thématiques ; 2 directions de pilier sur 6 | idem |
| Plaidoyers publiés / transmis | 8 / 0 | idem |
| Problématiques documentées | 12 sur 34 (7 partielles, 11 inconnues) | idem |
| Corrections publiées | 24 | `/transparence` |
| Audit technique (5 octobre) | axe 0 violation, Lighthouse accessibilité/SEO/bonnes pratiques 100, performance mobile 67–86 | audit du 5 octobre |
| Incident | 15–16 octobre : 36 h d'indisponibilité (quota Netlify) | `docs/migration-ovh.md` |
| Commits | 394 depuis le 27 septembre 2026 | `git log` |

Ce qui manque le plus, par ordre d'effet sur les lecteurs : un hébergement sans quota ; des réponses aux plaidoyers
et des engagements réalisés (rien n'est encore transmis ni réalisé) ; vingt-deux problématiques sans documentation
complète ; des pages arabes non publiées ; une performance mobile moyenne (le site vise la 3G lente).

## 1. Principes

1. **Le contenu avant la forme** : une page qui dit vrai, datée et sourcée, vaut mieux qu'une page belle.
2. **Rien d'inventé** : chiffres calculés depuis les données, textes datés jamais réécrits, corrections publiées.
3. **Un lecteur en 3G** : chaque ajout se mesure (poids, Lighthouse mobile) avant d'être gardé.
4. **Livrer petit et souvent, un push par série** ; `npm run build` et `npm run qa` avant chaque push.
5. **Ce que l'association n'a pas décidé s'écrit au conditionnel** ; le site ne précède pas le bureau.

## 2. Horizons

### Horizon A — d'ici au 23 octobre (élection et continuité de service)

| # | Chantier | Livrable | Critère de fin | Qui |
|---|---|---|---|---|
| A1 | Élection des vice-présidences III–VI | liste des candidats (17 oct.), résultats (23 oct.) dans `content/election.json` ; textes de campagne | candidats publiés avec accord écrit ; résultats avec PV signé ; page `/association/election-vice-presidences` à jour ; posts fournis à l'utilisateur | bureau (décisions, accords), animation (publication) |
| A2 | Hébergement OVH — premier déploiement | site en ligne sur l'adresse technique OVH | `scripts/qa/hebergement.py` et `controle.py` à 0 problème ; 22 formulaires testés ; mot de passe de rédaction recréé | utilisateur (multisite, utilisateur SFTP, secrets), animation (déploiement, recette) |
| A3 | Secours immédiat | copie statique GitHub Pages construite une fois (`pages.yml`) | `bmlemad.github.io/Lonodji` répond ; procédure de bascule DNS d'urgence écrite dans `docs/migration-ovh.md` | utilisateur (lancer le workflow), animation (procédure) |
| A4 | Groupe WhatsApp | ligne « En ce moment » après la clôture des candidatures | description à jour, validée par l'utilisateur | utilisateur |

### Horizon B — d'ici au 17 novembre (bascule et données)

| # | Chantier | Livrable | Critère de fin | Qui |
|---|---|---|---|---|
| B1 | Bascule du trafic vers OVH | A/CNAME modifiés chez Netlify DNS ; HTTPS OVH ; mentions légales et registre datés | `hebergement.py https://lonodji.org --sitemap` à 0 ; une semaine sans incident ; Netlify réduit à la redirection | utilisateur (DNS), animation (reste) |
| B2 | Comité de réactivation, phase 1 (échéance 18 oct.) et phase 2 (17 nov.) | pages `/odeb` et `/participer/recensement` reflétant l'état réel : recensement, note d'orientation, projets de statuts | chaque action du chronogramme porte « fait », « en cours » ou rien, avec sa date réelle | bureau/Comité (faits), animation (mise à jour) |
| B3 | Problématiques : passer de 12 à davantage de fiches documentées | une fiche complète par chantier prioritaire (7), sources citées | statut « Documenté » gagné uniquement avec une source datée ; pas d'objectif chiffré tant que le bureau n'en fixe pas | coordonnateurs (sources), animation (rédaction) |
| B4 | Plaidoyers : transmission | `content/transmissions.json` renseigné pour chaque plaidoyer envoyé | une ligne par envoi réel, avec date et destinataire ; `/actions#transmission` à jour | bureau (envois), animation |
| B5 | Nomenclature des thématiques (décision 2026-37) | confirmation du bureau ou amendement | ligne du registre passée de « à confirmer » à « confirmée » ou corrigée | bureau |
| B7 | Pièces constitutives (audit ONG du 17 oct.) | autorisation en règle, statuts et règlement intérieur soumis à l'AG, PV d'AG | les quatre lignes « À venir » de `/documents` deviennent des PDF datés | bureau (pièces), animation (publication) |
| B8 | Politiques d'intégrité et code de conduite (audit ONG) | adoption des cinq politiques du 23 septembre ; code de conduite membres et bénévoles ; référent protection désigné | pages publiées, liées depuis `/transparence`, registre à jour | bureau (adoption), animation (rédaction, publication) |
| B6 | Reliquat de la revue du 5 octobre | cinq corrections mineures (assertion de libellé `parcours-revue.py`, cibles cachées `mobile.py`, regex d'impact, z-index `.mm-toolbar`, paramètre `?localite=`) | QA à 0, un commit | animation |

### Horizon C — d'ici au 17 décembre (domaine, performance, arabe)

| # | Chantier | Livrable | Critère de fin | Qui |
|---|---|---|---|---|
| C1 | Domaine et zone DNS chez OVH (transfert possible dès le 23 nov.) | registrar OVH, zone recréée, NS basculés ; zone Netlify supprimée | RDAP : registrar OVH ; Google DNS : NS OVH ; site et HTTPS inchangés | utilisateur (transfert), animation (zone, contrôle) |
| C2 | Performance mobile | mesure puis réduction du JavaScript initial (runtime React ≈ 228 ko) : composants client réduits, chargement différé | Lighthouse mobile ≥ 90 sur accueil, `/participer`, une fiche de village ; aucune régression d'accessibilité | animation |
| C3 | Pages arabes | relecture par un locuteur natif des brouillons (`content/brouillons/`) | publication seulement après relecture signée ; sinon rien | utilisateur (relecteur), animation |
| C4 | Assemblée générale de relance (phase 3) | dossier de l'AG : ordre du jour, documents, convocation sur le site | documents publiés à la date fixée par le bureau | bureau, animation |
| C6 | Compte bancaire et premier exercice (audit ONG) | compte au nom de l'association, barème de cotisation adopté, comptes annuels | « Collecte suspendue » retiré par une décision datée ; page « Comptes » à la clôture du premier exercice | bureau |
| C7 | Relevé des réponses (audit ONG) | chaque trimestre : messages reçus, part répondue sous 48 h, sans donnée personnelle | première publication sur `/transparence` au 31 décembre 2026 | animation |
| C5 | Courriel @lonodji.org | MX, SPF, DMARC chez OVH ; adresses de rôle (contact, formulaires) | courriels des formulaires envoyés depuis le domaine ; mentions légales à jour | utilisateur (création), animation (DNS, textes) |

### Horizon D — 2027 (ODEB et consolidation)

| # | Chantier | Livrable | Critère de fin |
|---|---|---|---|
| D1 | Transformation en ODEB LONODJI (phase 4, mars 2027) | identité, statuts et pages ODEB passées de « projet » à « adopté » après l'AG | aucune page ne présente comme acquis ce que l'AG n'a pas voté |
| D2 | Plateforme de projets | fiches de projets financés avec budget et suivi datés | `projets.finances` > 0 uniquement avec convention signée |
| D3 | Observatoire et carte | données mises à jour (recensement, équipements), localité corrompue de Péni corrigée dans OpenStreetMap | `build-carte.py` sans exclusion manuelle |
| D5 | Rapport d'activité annuel (audit ONG) | premier rapport à la clôture de l'exercice, depuis le registre, les engagements, les corrections et les indicateurs | PDF daté sur `/documents`, ligne « À venir » retirée |
| D4 | Appli mobile | décision du bureau sur la couche appli (`/projets/application`) : poursuivre, geler ou retirer | ligne du registre |

## 3. Rythme et rôles

- **Hebdomadaire (lundi)** : contrôle du site, de l'état des chantiers de l'horizon en cours, du registre ; mise à jour de la ligne « État » ci-dessous.
- **À chaque livraison** : build, QA, push groupé, synchronisation du Mac, note datée si un texte daté est concerné.
- **Bureau exécutif** : décisions (registre `lib/decisions.ts`), accords des personnes, PV, transmissions.
- **Utilisateur** : comptes et accès (OVH, DNS, GitHub, réseaux), publications sur les réseaux, arbitrages.
- **Animation du site (Claude)** : code, données, QA, rédaction datée, propositions ; jamais de publication sur les réseaux ni d'opération de compte.

## 4. Risques suivis

| Risque | Parade |
|---|---|
| Nouvelle coupure d'hébergement avant la bascule | A3 (copie GitHub Pages prête), surveillance hebdomadaire ; bascule B1 au plus tôt |
| Transfert du domaine refusé ou retardé | la zone reste chez Netlify DNS, sans effet sur le site ; relance après le 23 novembre |
| Publication d'un candidat ou d'un résultat sans accord | règle du dépôt (`AGENTS.md`) : rien dans `election.json` sans accord et PV |
| Chiffres ou textes dépassés après la réorganisation en piliers | import rejoue `architecture.py` ; QA de cohérence (`qa:coherence`) |
| Poids des pages (62 Mo d'images de partage, 54 Mo d'identité) | déjà hors quota chez OVH ; C2 pour le JavaScript |

## 5. État

- 2026-10-16 : plan établi.
- 2026-10-16 (soir) : A3 fait — workflow « Secours GitHub Pages » lancé une première fois, copie publiée (1 132 pages, 200 sur les adresses testées). Elle n'est utilisable qu'à la racine d'un domaine (chemins `/_next/…` absolus, `CNAME lonodji.org`) : sur `bmlemad.github.io/Lonodji/` les pages s'affichent sans style, c'est attendu. Procédure d'urgence : chez Netlify DNS, A/CNAME de lonodji.org vers GitHub Pages, puis « Enforce HTTPS » dans les réglages Pages du dépôt. B6 fait pour trois points (assertions de `parcours-revue.py` rendues indépendantes des libellés et des dates ; `mobile.py` mesure aussi les cibles des blocs repliés ; `?localite=` vérifié : le champ `localite` du formulaire de contact existe et le préremplissage le vise) ; la barre de recherche du menu mobile reste sous la barre de navigation à toutes les positions de défilement (mesuré), aucun changement ; la cinquième remarque (expression régulière des indicateurs) n'a pas pu être reconstituée, retirée. A2 prêt côté dépôt (export, scripts PHP, workflow SFTP/rsync, recette) ; en attente du multisite et des secrets. A4 : ligne proposée, en attente d'accord. A1 : liste des candidats demandée au bureau.
- 2026-10-17 : C2 entamé. Mesure : le JavaScript initial est le socle Next/React (≈ 165 ko compressés, incompressible sans changer d'outil) ; l'écart venait des feuilles de style, 323 ko bruts (61 ko compressés) chargées sur toutes les pages, dont `legacy.css` (131 ko) qui ne sert qu'aux 94 pages à contenu importé. Fait : `legacy.css` n'est plus chargée que par ces 94 pages ; 1 034 pages (accueil, 965 fiches de villages, journal, carte, EN) en sont déchargées. Lighthouse mobile local (conteneur, valeurs indicatives) : accueil 58 → 90, village 93 → 93, CSS inutilisé 51 → 28 ko. QA complet 0 problème. Reste pour C2 : `site.css` (192 ko, 36 ko compressés) à découper par rubrique, et une mesure de référence stable (`scripts/qa/performance.py`) plutôt que Lighthouse en conteneur, trop sensible à la machine. Workflow OVH : fichier refusé par GitHub (secrets dans un `if`), corrigé.
- 2026-10-17 (suite) : mesure de référence posée, `scripts/qa/performance.py` (poids compressé par type, JavaScript exécuté et tâches longues sous processeur ralenti ×4, six pages, plafonds qui font échouer le script). Référence du 17 octobre après le déchargement de `legacy.css` : accueil 329 ko (html 32, css 43, js 151, polices 73, images 28), JS 870 ms, tâche la plus longue 660 ms ; /participer 361 ko (css 59) ; fiche de village 304 ko ; /journal 317 ko ; /mission 335 ko ; /en/index 338 ko. Le critère de fin de C2 devient : chaque page sous les plafonds du script (css ≤ 70 ko, js ≤ 220 ko, total ≤ 600 ko, tâche ≤ 800 ms) et aucune hausse d'une livraison à l'autre ; Lighthouse ne sert plus que de contrôle ponctuel.
- 2026-10-17 (matin) : audit du site au regard des référentiels ONG (`docs/audit-ong-2026-10-17.md`, CHS 2024, Global Standard, cadre tchadien). Verdict : au niveau attendu sur la redevabilité envers le public (plainte, corrections, promesse/réalisation, données) ; les manques sont des pièces et des décisions du bureau (autorisation, statuts, PV, compte bancaire, politiques d'intégrité, code de conduite). Chantiers B7, B8, C6, C7, D5 ajoutés.
- 2026-10-17 (suite) : auto-évaluation publiée sur le site (`/transparence/auto-evaluation`, 43 critères depuis `content/auto-evaluation.json`, cinq suites avec responsable et horizon), registre 2026-39, liens depuis Redevabilité, le méga-menu et le plan du site ; 40 images de partage remises à jour après les commits des piliers. QA complet 0 problème.

