# Migration de lonodji.org vers OVH — plan de travail

Décision du 16 octobre 2026 : tout passer chez OVH (domaine, zone DNS, hébergement), après la coupure du 15 au 16 octobre (Netlify, bande passante du palier gratuit dépassée, site indisponible environ 36 heures).

## 1. État de départ (constaté le 16 octobre 2026)

| Élément | Aujourd'hui | Source |
|---|---|---|
| Registrar | Name.com (partenaire de Netlify), statut `clientTransferProhibited` | RDAP du registre .org |
| Serveurs de noms | dns1–4.p09.nsone.net (Netlify DNS) | Google DNS |
| Enregistrements | A lonodji.org et www → Netlify ; aucun MX, TXT, DMARC | Google DNS |
| Hébergement | Netlify, `next build` + fonctions serveur, 158 Mo de fichiers publics | dépôt |
| Formulaires | 22 formulaires Netlify Forms, tous postés sur `/__forms.html` | `public/__forms.html`, composants |
| Espace de rédaction | `/api/redaction` sur Netlify Blobs, jeton `REDACTION_INVITATION` | `lib/redaction.ts` |
| Indicateurs | `/api/indicateurs` et `scripts/build-indicateurs.py` lisent l'API Netlify Forms (`NETLIFY_FORMS_TOKEN`, `SITE_ID`) | `lib/indicateurs.ts` |
| En-têtes et redirections | `netlify.toml` (en-têtes, CSP, 301 de l'ancienne adresse) et `next.config.mjs` (redirections `/dossiers/*` et adresses devinées) | dépôt |
| Secours | `scripts/statique/construire.sh` + `.github/workflows/pages.yml` (export statique GitHub Pages, jamais lancé) | dépôt |

Contrainte de calendrier : le domaine a été créé le 24 septembre 2026. La règle ICANN interdit le transfert entre registrars pendant 60 jours après la création : **transfert possible à partir du 23 novembre 2026 environ**. La commande passée chez OVH reste en attente jusque-là ; l'hébergement et la bascule du trafic, eux, peuvent se faire avant.

## 2. Cible

- **Hébergement web mutualisé OVH** (gamme avec accès SSH, PHP 8, certificat Let's Encrypt, trafic non compté) plutôt qu'un VPS : pas de serveur à administrer, pas de quota de bande passante.
- **Site servi en statique** (export Next `output: 'export'`, déjà préparé dans `scripts/statique/construire.sh`), déployé par rsync depuis GitHub Actions.
- **Trois petits scripts PHP** remplacent ce que Netlify faisait côté serveur : réception des formulaires, espace de rédaction, lecture des envois pour les indicateurs.
- **Zone DNS chez OVH** une fois le transfert accepté ; d'ici là, la zone reste chez Netlify DNS et c'est là que se fait la bascule du trafic.
- **Courriel** : hors périmètre pour l'instant (aucun MX aujourd'hui). À décider séparément ; l'offre d'hébergement inclut des boîtes si besoin.

## 3. Ce que la migration change pour le site

| Fonction | Netlify | OVH | Travail |
|---|---|---|---|
| Pages | rendu serveur à la demande | export statique, `trailingSlash` | `construire.sh` existe ; vérifier les 1 121 adresses du sitemap et `dynamicParams` |
| Redirections 301 | `next.config.mjs` | `.htaccess` généré depuis la même liste | script à écrire (`scripts/statique/htaccess.mjs`) ; abandonner les pages de renvoi HTML de `redirections.mjs` |
| En-têtes (CSP, HSTS, cache) | `netlify.toml` + `next.config.mjs` | `.htaccess` (`Header set …`, `ExpiresByType`) | même script |
| Formulaires (22) | Netlify Forms, pot de miel `_honey` | `formulaires.php` : validation, pot de miel, limite de débit, enregistrement JSON/CSV hors racine web, courriel de notification | 1 script PHP ; côté site, remplacer `/__forms.html` par `/formulaires.php` dans 7 composants et `legacy-enhance.tsx` |
| Pièces jointes (dépôt de document, témoignage, mot nangnda) | Netlify (10 Mo) | dossier hors racine web, taille limitée dans PHP | inclus dans `formulaires.php` |
| Espace de rédaction | `/api/redaction` + Netlify Blobs | `redaction.php` : même API JSON, fichier JSON hors racine, jeton d'invitation | 1 script PHP ; `components/redaction-app.tsx` inchangé si l'API reste identique |
| Indicateurs (envois comptés) | API Netlify Forms | `scripts/build-indicateurs.py` lit l'export des envois (rsync depuis OVH avant la construction) ; `/api/indicateurs` supprimé, le relevé daté suffit | adaptation Python |
| Image de partage, PDF, cartes | servis par Netlify | servis par Apache, cache long | rien, sauf `.htaccess` |
| Service worker, recherche hors ligne | identique | identique | rien |
| Ancienne adresse adeb-lonodji.netlify.app | 301 forcé | garder le site Netlify en coquille vide avec la seule redirection, ou le supprimer | décision |
| Déploiement | push sur `main` → Netlify | push sur `main` → GitHub Actions → `construire.sh` → rsync SSH vers OVH | workflow à écrire ; supprimer `nextjs.yml` (modèle GitHub, en échec) |

Fonctions perdues sans remplacement : formulaires lus dans l'interface Netlify (remplacés par le fichier JSON/CSV et le courriel) ; prévisualisations de branche.

## 4. Étapes

### A. Avant toute bascule
1. Hébergement. Constat du 16 octobre : le compte OVH « Konguil Technologies » possède déjà un hébergement **Perso** (`enertcp`, cluster 129, Gravelines) qui porte enertchad.com ; lonodji.org n'est pas encore chez OVH (transfert en attente du 23 novembre). Deux voies :
   - **sans achat** : rattacher `lonodji.org` en multisite de cet hébergement (dossier racine `lonodji/www`, SSL activé). L'offre Perso n'a pas de SSH : déploiement par SFTP (mode `lftp` du workflow). Le site de l'association partage alors l'hébergement d'une entreprise de l'utilisateur : à acter ;
   - **avec achat** : hébergement Pro dédié à l'association (SSH, rsync, séparation nette). Décision de l'utilisateur.
   Dans les deux cas : utilisateur FTP/SFTP dédié dont le dossier racine contient `www/` ; copier `serveur/ovh/config.exemple.php` en `lonodji-prive/config.php` à côté de `www/` (courriel de notification, code d'invitation) ; secrets GitHub `OVH_HOST`, `OVH_USER`, `OVH_PASSWORD` (et `OVH_SSH_KEY` en mode SSH) ; variables `OVH_WWW`, `OVH_URL`. Vérifier que `.ovhconfig` à la racine de l'hébergement est en PHP 8 (sur un multisite, c'est celui de la racine qui compte).
2. Dépôt — **fait le 16 octobre 2026** (commit « Préparer l'hébergement OVH ») :
   - `lib/formulaires.ts` : l'adresse d'envoi des formulaires vient de `NEXT_PUBLIC_FORMULAIRES_URL` (`/__forms.html` sur Netlify, `/formulaires.php` dans l'export OVH) ; les huit composants concernés l'utilisent ;
   - `serveur/ovh/formulaires.php` (22 formulaires, pot de miel, limite de 20 envois par heure et par adresse hachée, pièces jointes de 10 Mo, enregistrement JSON hors racine web, courriel), `serveur/ovh/redaction.php` (même API que `/api/redaction`, Argon2id, blocage après cinq échecs), `.user.ini`, `.ovhconfig`, `config.exemple.php` ;
   - `scripts/statique/htaccess.mjs` : 142 redirections 301 et tous les en-têtes, générés depuis `next.config.mjs` et `netlify.toml` ; `POST /__forms.html` et `/api/redaction` réécrits vers les scripts ;
   - `scripts/statique/construire.sh` : cible `ovh` (défaut) ou `pages` ;
   - `.github/workflows/deploy-ovh.yml` (lancement manuel, rsync, rapatriement des envois pour les indicateurs) ; `nextjs.yml` retiré ;
   - `scripts/build-indicateurs.py` lit les envois OVH (`ENVOIS_DIR`).
   - adresses identiques à celles d'aujourd'hui (sans barre finale ni `.html`) : export `trailingSlash: false`, `.htaccess` sert `page.html` et renvoie `/page/` vers `/page` ; les compteurs en direct (`/api/indicateurs`) sont désactivés dans l'export (`NEXT_PUBLIC_SITE_STATIQUE`), le relevé de construction fait foi.
   Testé en local le 16 octobre : export de 1 132 pages servi par un routeur PHP qui imite `.htaccess` ; `scripts/qa/controle.py` complet (73 pages, 816 liens, console, axe) : 0 problème ; 1 120 adresses du sitemap en 200 ; scripts PHP exercés (formulaire connu/inconnu, pot de miel, origine, pièce jointe acceptée/refusée, débit, création du mot de passe, brouillons, jetons, blocage) ; `npm run build` pour Netlify inchangé.
3. Déployer sur l'adresse technique OVH (workflow « Déploiement OVH », lancement manuel), puis :
   - `python3 scripts/qa/hebergement.py https://<adresse technique> --sitemap` : en-têtes réels d'Apache, redirections, barre finale, 404, scripts PHP, fichiers privés refusés, toutes les adresses du sitemap ;
   - `python3 scripts/qa/controle.py https://<adresse technique>` : pages, liens, console, accessibilité ;
   - un envoi de test sur chacun des 22 formulaires (courriel reçu, ligne dans `envois/`), puis suppression de ces lignes de test ;
   - création du mot de passe de l'espace de rédaction avec le code d'invitation.

### B. Bascule du trafic (zone encore chez Netlify DNS)
4. Dans Netlify DNS : remplacer les A de `lonodji.org` et `www` par l'adresse OVH (A ou CNAME selon ce qu'OVH indique), TTL court la veille.
5. Demander le certificat Let's Encrypt côté OVH dès que la propagation est faite ; vérifier HTTPS, HSTS, redirection www → apex.
6. Laisser Netlify en place une semaine en secours ; puis réduire le site Netlify à la redirection de l'ancienne adresse.
   Le jour de la bascule : `DATE_BASCULE_OVH` dans `scripts/import-legacy.py` (date réelle), relancer l'import (note datée sous le paragraphe « Hébergement » des mentions légales), ajouter la décision au registre (`lib/decisions.ts`), activer le déclencheur `push` de `deploy-ovh.yml`, puis `python3 scripts/qa/hebergement.py https://lonodji.org --sitemap`.

### C. Domaine et zone (à partir du 23 novembre 2026)
7. Relancer le transfert chez OVH (code de transfert fourni par Netlify/Name.com, déverrouillage du domaine). Netlify documente la procédure dans « Domain management ».
8. Avant de changer les serveurs de noms : recréer dans la zone OVH exactement les enregistrements en service (A/CNAME vers OVH, éventuels TXT de validation). Puis NS → OVH. Vérifier avec Google DNS et RDAP.
9. Supprimer la zone chez Netlify une fois la propagation complète.

### D. Après
10. Mentions légales : note datée préparée dans `import-legacy.py` (`bascule_ovh`, adresse d'OVH SAS vérifiée le 16 octobre 2026 sur ovhcloud.com) ; `lib/decisions.ts` (décision de changement d'hébergeur, à dater du jour de la bascule).
11. Mettre à jour `README.md`, `AGENTS.md` et `scripts/qa` pour le nouveau déploiement ; retirer `netlify.toml`, `@netlify/blobs`, les variables `NETLIFY_*`.

## 5. Répartition

| Qui | Quoi |
|---|---|
| Utilisateur | commande OVH, accès SSH, clé de déploiement dans GitHub, modification de la zone chez Netlify, transfert du domaine, code de transfert, courriel de notification à utiliser |
| Animation du site (Claude) | scripts PHP, `.htaccess`, workflow, adaptation des composants et de Python, QA, mise à jour des textes datés, suivi DNS |

Rien dans ce plan n'est irréversible avant l'étape 4 ; l'étape 4 se défait en remettant les anciens enregistrements.
