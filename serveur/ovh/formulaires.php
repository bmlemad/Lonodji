<?php
/* Réception des formulaires de lonodji.org sur l'hébergement OVH (remplace Netlify Forms).

   Les 22 formulaires du site envoient en POST (urlencoded ou multipart) avec un champ « form-name »
   et un pot de miel « _honey ». Ce script :
   - refuse tout ce qui n'est pas un formulaire connu, venu du site lui-même ;
   - ignore silencieusement les envois qui remplissent le pot de miel (réponse 200, comme Netlify) ;
   - limite le débit par adresse (hachée, jamais conservée en clair) ;
   - enregistre chaque envoi en une ligne JSON dans DOSSIER_DONNEES/envois/<formulaire>.jsonl, hors de la racine web ;
   - range les pièces jointes dans DOSSIER_DONNEES/fichiers/ sous un nom aléatoire ;
   - prévient par courriel l'adresse configurée.
   Configuration : DOSSIER_DONNEES/config.php (modèle : config.exemple.php). Aucune donnée personnelle
   ne transite par le dépôt : tout reste sur l'hébergement. */

declare(strict_types=1);

const FORMULAIRES = [
  'contact', 'demande-mise-a-jour', 'depot-document', 'diaspora-competences', 'handicap', 'intention-adhesion',
  'lettre-info', 'lettre-info-pied', 'lieu-sacre', 'message-en', 'mesure-debit', 'mot-nangnda', 'plainte',
  'promesse-contribution', 'proposition-article', 'proposition-projet', 'recensement-membres', 'signalement-besoin',
  'soutien-plaidoyer', 'temoignage', 'temoignage-lignee', 'veuves',
];
const CHAMP_MAX = 20000;      // caractères par champ
const CHAMPS_MAX = 80;        // champs par envoi
const ENVOIS_PAR_HEURE = 20;  // par adresse
const EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'gif', 'mp3', 'm4a', 'ogg', 'opus', 'wav', 'aac', 'mp4', 'docx', 'odt', 'txt'];

$config = charger_config();
$donnees = $config['DOSSIER_DONNEES'];
$html = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'text/html') && !str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  repondre(405, ['erreur' => 'Méthode non autorisée.'], $html);
}
if (!origine_valide($config['HOTES'])) {
  repondre(403, ['erreur' => 'Origine refusée.'], $html);
}

$nom = (string) ($_POST['form-name'] ?? '');
if (!in_array($nom, FORMULAIRES, true)) {
  repondre(400, ['erreur' => 'Formulaire inconnu.'], $html);
}
if (trim((string) ($_POST['_honey'] ?? '')) !== '') {
  repondre(200, ['ok' => true], $html); // robot : on fait comme si
}

$empreinte = empreinte_adresse($config['SEL']);
if (!debit_autorise($donnees, $empreinte)) {
  repondre(429, ['erreur' => 'Trop d’envois : réessayez dans une heure.'], $html);
}

// champs
$champs = [];
$n = 0;
foreach ($_POST as $cle => $valeur) {
  if ($cle === 'form-name' || $cle === '_honey') continue;
  if (++$n > CHAMPS_MAX) break;
  $cle = substr(preg_replace('/[^A-Za-z0-9_.\-]/', '', (string) $cle), 0, 60);
  if ($cle === '') continue;
  if (is_array($valeur)) $valeur = implode(', ', array_map('strval', $valeur));
  $valeur = str_replace("\0", '', (string) $valeur);
  $champs[$cle] = mb_substr(trim($valeur), 0, CHAMP_MAX);
}

// pièces jointes
$fichiers = [];
foreach ($_FILES as $cle => $f) {
  if (!is_array($f) || ($f['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) continue;
  if ($f['error'] !== UPLOAD_ERR_OK) repondre(400, ['erreur' => 'Pièce jointe illisible ou trop lourde.'], $html);
  if ($f['size'] > $config['TAILLE_MAX']) repondre(413, ['erreur' => 'Pièce jointe trop lourde (10 Mo au plus).'], $html);
  $original = basename(str_replace("\0", '', (string) $f['name']));
  $ext = strtolower(pathinfo($original, PATHINFO_EXTENSION));
  if (!in_array($ext, EXTENSIONS, true)) repondre(415, ['erreur' => 'Type de fichier non accepté.'], $html);
  $dossier = "$donnees/fichiers";
  if (!is_dir($dossier) && !mkdir($dossier, 0700, true)) repondre(500, ['erreur' => 'Stockage indisponible.'], $html);
  $cible = sprintf('%s/%s-%s.%s', $dossier, date('Ymd-His'), bin2hex(random_bytes(6)), $ext);
  if (!move_uploaded_file($f['tmp_name'], $cible)) repondre(500, ['erreur' => 'Stockage indisponible.'], $html);
  chmod($cible, 0600);
  $fichiers[] = ['champ' => (string) $cle, 'nom' => mb_substr($original, 0, 200), 'taille' => (int) $f['size'], 'fichier' => basename($cible)];
}

$enregistrement = [
  'date' => gmdate('c'),
  'formulaire' => $nom,
  'champs' => $champs,
  'fichiers' => $fichiers,
  'adresse' => $empreinte,                       // empreinte, pas l'adresse
  'page' => mb_substr((string) ($_SERVER['HTTP_REFERER'] ?? ''), 0, 300),
];
if (!ajouter_ligne("$donnees/envois/$nom.jsonl", json_encode($enregistrement, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES))) {
  repondre(500, ['erreur' => 'Enregistrement impossible : réessayez, ou écrivez-nous par WhatsApp.'], $html);
}
notifier($config, $nom, $champs, $fichiers);
repondre(200, ['ok' => true], $html);

/* ---------- fonctions ---------- */

function charger_config(): array {
  $base = dirname((string) ($_SERVER['DOCUMENT_ROOT'] ?: __DIR__)) . '/lonodji-prive';
  $defaut = [
    'DOSSIER_DONNEES' => $base,
    'COURRIEL_NOTIFICATION' => '',
    'COURRIEL_EXPEDITEUR' => 'formulaires@lonodji.org',
    'HOTES' => ['lonodji.org', 'www.lonodji.org'],
    'TAILLE_MAX' => 10 * 1024 * 1024,
    'SEL' => '',
    'REDACTION_INVITATION' => '',
  ];
  $fichier = "$base/config.php";
  $perso = is_file($fichier) ? (include $fichier) : [];
  $c = array_merge($defaut, is_array($perso) ? $perso : []);
  if ($c['SEL'] === '') {
    // sel de hachage des adresses, créé une fois et gardé hors de la racine web
    $f = $c['DOSSIER_DONNEES'] . '/sel.txt';
    if (!is_file($f)) { @mkdir($c['DOSSIER_DONNEES'], 0700, true); file_put_contents($f, bin2hex(random_bytes(16)), LOCK_EX); chmod($f, 0600); }
    $c['SEL'] = trim((string) @file_get_contents($f)) ?: 'lonodji';
  }
  return $c;
}

function origine_valide(array $hotes): bool {
  foreach (['HTTP_ORIGIN', 'HTTP_REFERER'] as $h) {
    if (empty($_SERVER[$h])) continue;
    $hote = strtolower((string) parse_url((string) $_SERVER[$h], PHP_URL_HOST));
    return in_array($hote, $hotes, true) || str_ends_with($hote, '.hosting.ovh.net') || $hote === 'localhost';
  }
  return true; // ni Origin ni Referer (navigateur ancien, vie privée) : on accepte, le pot de miel et le débit font le reste
}

function empreinte_adresse(string $sel): string {
  $ip = (string) ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '?');
  $ip = trim(explode(',', $ip)[0]);
  return substr(hash('sha256', $sel . $ip), 0, 16);
}

function debit_autorise(string $donnees, string $empreinte): bool {
  $dossier = "$donnees/debit";
  if (!is_dir($dossier) && !mkdir($dossier, 0700, true)) return true;
  $f = "$dossier/$empreinte";
  $maintenant = time();
  $instants = is_file($f) ? array_filter(array_map('intval', file($f, FILE_IGNORE_NEW_LINES)), fn($t) => $t > $maintenant - 3600) : [];
  if (count($instants) >= ENVOIS_PAR_HEURE) return false;
  $instants[] = $maintenant;
  file_put_contents($f, implode("\n", $instants) . "\n", LOCK_EX);
  // ménage occasionnel des empreintes anciennes
  if (random_int(1, 50) === 1) foreach (glob("$dossier/*") ?: [] as $g) if (filemtime($g) < $maintenant - 7200) @unlink($g);
  return true;
}

function ajouter_ligne(string $fichier, string $ligne): bool {
  $dossier = dirname($fichier);
  if (!is_dir($dossier) && !mkdir($dossier, 0700, true)) return false;
  $ok = file_put_contents($fichier, $ligne . "\n", FILE_APPEND | LOCK_EX) !== false;
  if ($ok) @chmod($fichier, 0600);
  return $ok;
}

function notifier(array $config, string $nom, array $champs, array $fichiers): void {
  $a = (string) $config['COURRIEL_NOTIFICATION'];
  if ($a === '') return;
  $lignes = ["Formulaire : $nom", 'Reçu le : ' . date('d/m/Y H:i') . ' (heure du serveur)', ''];
  foreach ($champs as $k => $v) $lignes[] = "$k : " . str_replace(["\r", "\n"], ["", "\n    "], $v);
  foreach ($fichiers as $f) $lignes[] = "pièce jointe ({$f['champ']}) : {$f['nom']} — " . round($f['taille'] / 1048576, 2) . " Mo → fichiers/{$f['fichier']}";
  $lignes[] = '';
  $lignes[] = 'Les envois complets sont dans lonodji-prive/envois/ sur l’hébergement.';
  $sujet = '=?UTF-8?B?' . base64_encode("[lonodji.org] $nom") . '?=';
  $entetes = ['From: ADEB LONODJI <' . $config['COURRIEL_EXPEDITEUR'] . '>', 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: 8bit'];
  if (!empty($champs['email']) && filter_var($champs['email'], FILTER_VALIDATE_EMAIL)) $entetes[] = 'Reply-To: ' . $champs['email'];
  @mail($a, $sujet, implode("\n", $lignes), implode("\r\n", $entetes));
}

function repondre(int $statut, array $corps, bool $html): never {
  http_response_code($statut);
  header('Cache-Control: no-store');
  header('X-Robots-Tag: noindex');
  if ($html) {
    header('Content-Type: text/html; charset=UTF-8');
    $ok = $statut === 200;
    $titre = $ok ? 'Merci' : 'Envoi impossible';
    $texte = $ok ? 'Merci, votre message est bien parti. Vous recevrez un accusé de réception sous 48 heures ouvrées si vous avez laissé un moyen de vous joindre.'
                 : htmlspecialchars((string) ($corps['erreur'] ?? 'Réessayez dans un instant.'), ENT_QUOTES, 'UTF-8');
    $retour = htmlspecialchars((string) (($_SERVER['HTTP_REFERER'] ?? '') ?: '/'), ENT_QUOTES, 'UTF-8');
    echo "<!doctype html><html lang=\"fr\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"robots\" content=\"noindex\"><title>$titre — ADEB LONODJI</title><style>body{font-family:system-ui,sans-serif;max-width:40rem;margin:4rem auto;padding:0 1rem;line-height:1.5}</style></head><body><h1>$titre</h1><p>$texte</p><p><a href=\"$retour\">Retour à la page</a></p></body></html>";
  } else {
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($corps, JSON_UNESCAPED_UNICODE);
  }
  exit;
}
