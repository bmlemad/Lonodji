# Scripts serveur pour l'hébergement OVH

Copiés à la racine web par `scripts/statique/construire.sh` (cible `ovh`) :

| Fichier | Rôle |
|---|---|
| `formulaires.php` | reçoit les 22 formulaires (`/formulaires.php`, et `POST /__forms.html` réécrit par `.htaccess`) |
| `redaction.php` | espace de rédaction (`/api/redaction` réécrit par `.htaccess`) |
| `.user.ini` | limites PHP (pièces jointes de 10 Mo) |
| `.ovhconfig` | version de PHP et pare-feu OVH |
| `config.exemple.php` | modèle de configuration, à copier en `~/lonodji-prive/config.php` sur l'hébergement |

Données écrites par les scripts, hors de la racine web, dans `~/lonodji-prive/` : `envois/<formulaire>.jsonl`,
`fichiers/`, `debit/`, `redaction.json`, `sel.txt`. Aucune de ces données n'entre dans le dépôt.
