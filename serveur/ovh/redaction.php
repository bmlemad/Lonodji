<?php
/* Espace de rédaction privé du journal — version PHP pour l'hébergement OVH.
   Même API que app/api/redaction/route.ts (components/redaction-app.tsx ne change pas) :
   GET  → { existe, minimum }
   POST { action, … } : creer · connexion · changer (mot de passe en corps) ;
                        liste · lire · enregistrer · supprimer (jeton en en-tête Authorization: Bearer).
   Différences avec la version Netlify : le mot de passe est dérivé par Argon2id (ou bcrypt à défaut) au lieu de
   scrypt, donc le mot de passe créé sur Netlify ne se transfère pas : on en recrée un avec le code d'invitation
   (REDACTION_INVITATION dans lonodji-prive/config.php). Stockage : lonodji-prive/redaction.json, hors racine web.
   Jeton de session : HMAC-SHA256 signé avec le hash courant (changer le mot de passe invalide tous les jetons). */

declare(strict_types=1);

const MOT_DE_PASSE_MIN = 10;
const DUREE_JETON = 12 * 3600;
const ESSAIS_MAX = 5;
const BLOCAGE = 15 * 60;
const STATUTS = ['brouillon', 'a-relire', 'pret'];

header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
header('Content-Type: application/json; charset=UTF-8');

$config = charger_config();
$magasin = new Magasin($config['DOSSIER_DONNEES'] . '/redaction.json');

try {
  if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET') {
    ok(['existe' => $magasin->get('auth') !== null, 'minimum' => MOT_DE_PASSE_MIN]);
  }
  if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') throw new Erreur(405, 'Méthode non autorisée.');
  $corps = json_decode((string) file_get_contents('php://input'), true);
  if (!is_array($corps)) ok(['erreur' => 'Requête illisible.'], 400);
  $action = is_string($corps['action'] ?? null) ? $corps['action'] : '';
  switch ($action) {
    case 'creer':
      $cle = (string) $config['REDACTION_INVITATION'];
      $code = is_string($corps['invitation'] ?? null) ? trim($corps['invitation']) : '';
      if ($cle === '' || $code === '' || !hash_equals(hash('sha256', $cle), hash('sha256', $code))) throw new Erreur(403, 'Code d’invitation manquant ou incorrect.');
      if (!mot_de_passe_valide($corps['motDePasse'] ?? null)) throw new Erreur(400, 'Le mot de passe doit faire au moins ' . MOT_DE_PASSE_MIN . ' caractères.');
      ok(['jeton' => creer_compte($magasin, $corps['motDePasse'])], 201);
    case 'connexion':
      if (!is_string($corps['motDePasse'] ?? null)) throw new Erreur(400, 'Mot de passe manquant.');
      ok(['jeton' => signer(verifier_mot_de_passe($magasin, $corps['motDePasse'], empreinte($config['SEL']))['hash'])]);
    case 'changer':
      verifier_jeton($magasin, jeton());
      if (!is_string($corps['ancien'] ?? null) || !mot_de_passe_valide($corps['nouveau'] ?? null)) throw new Erreur(400, 'Le nouveau mot de passe doit faire au moins ' . MOT_DE_PASSE_MIN . ' caractères.');
      verifier_mot_de_passe($magasin, $corps['ancien'], empreinte($config['SEL']));
      $auth = ['hash' => deriver($corps['nouveau']), 'maj' => gmdate('c')];
      $magasin->set('auth', json_encode($auth));
      ok(['jeton' => signer($auth['hash'])]);
    case 'liste':
      verifier_jeton($magasin, jeton());
      ok(['brouillons' => lister($magasin)]);
    case 'lire':
      verifier_jeton($magasin, jeton());
      ok(['brouillon' => lire($magasin, (string) ($corps['id'] ?? ''))]);
    case 'enregistrer':
      verifier_jeton($magasin, jeton());
      ok(['brouillon' => enregistrer($magasin, $corps['brouillon'] ?? null)]);
    case 'supprimer':
      verifier_jeton($magasin, jeton());
      supprimer($magasin, (string) ($corps['id'] ?? ''));
      ok(['fait' => true]);
    default:
      throw new Erreur(400, 'Action inconnue.');
  }
} catch (Erreur $e) {
  ok(['erreur' => $e->getMessage()], $e->statut);
} catch (Throwable $e) {
  error_log('redaction: ' . $e->getMessage());
  ok(['erreur' => 'Erreur interne : réessayez, ou signalez-le.'], 500);
}

/* ---------- magasin : un fichier JSON verrouillé ---------- */

final class Magasin {
  public function __construct(private string $fichier) {}
  private function lire(): array {
    $brut = is_file($this->fichier) ? (string) file_get_contents($this->fichier) : '';
    $d = $brut === '' ? [] : json_decode($brut, true);
    return is_array($d) ? $d : [];
  }
  private function ecrire(array $d): void {
    $dossier = dirname($this->fichier);
    if (!is_dir($dossier)) mkdir($dossier, 0700, true);
    if (file_put_contents($this->fichier, json_encode($d, JSON_UNESCAPED_UNICODE), LOCK_EX) === false) throw new Erreur(500, 'Stockage indisponible.');
    @chmod($this->fichier, 0600);
  }
  public function get(string $cle): ?string { return $this->lire()[$cle] ?? null; }
  public function set(string $cle, string $valeur): void { $d = $this->lire(); $d[$cle] = $valeur; $this->ecrire($d); }
  public function delete(string $cle): void { $d = $this->lire(); unset($d[$cle]); $this->ecrire($d); }
}

/* ---------- mot de passe et jeton ---------- */

function deriver(string $motDePasse): string {
  $m = normaliser_nfc($motDePasse);
  return defined('PASSWORD_ARGON2ID') ? password_hash($m, PASSWORD_ARGON2ID) : password_hash($m, PASSWORD_BCRYPT, ['cost' => 12]);
}

function normaliser_nfc(string $s): string {
  return class_exists('Normalizer') ? (Normalizer::normalize($s, Normalizer::FORM_C) ?: $s) : $s;
}

function mot_de_passe_valide(mixed $m): bool {
  return is_string($m) && mb_strlen($m) >= MOT_DE_PASSE_MIN && mb_strlen($m) <= 200;
}

function creer_compte(Magasin $m, string $motDePasse): string {
  if ($m->get('auth') !== null) throw new Erreur(409, 'Un mot de passe existe déjà.');
  $auth = ['hash' => deriver($motDePasse), 'maj' => gmdate('c')];
  $m->set('auth', json_encode($auth));
  return signer($auth['hash']);
}

function verifier_mot_de_passe(Magasin $m, string $motDePasse, string $ip): array {
  $brut = $m->get('auth');
  if ($brut === null) throw new Erreur(404, 'Aucun mot de passe n’a encore été créé.');
  $cle = "tentatives/$ip";
  $t = json_decode($m->get($cle) ?? '{"n":0,"jusqua":0}', true) ?: ['n' => 0, 'jusqua' => 0];
  if ($t['jusqua'] > time()) throw new Erreur(429, 'Trop d’essais : réessayez dans ' . (int) ceil(($t['jusqua'] - time()) / 60) . ' min.');
  $auth = json_decode($brut, true);
  if (!is_array($auth) || !password_verify(normaliser_nfc($motDePasse), (string) $auth['hash'])) {
    $n = ($t['jusqua'] ? 0 : (int) $t['n']) + 1;
    $m->set($cle, json_encode(['n' => $n, 'jusqua' => $n >= ESSAIS_MAX ? time() + BLOCAGE : 0]));
    throw new Erreur(401, 'Mot de passe incorrect.');
  }
  if ($t['n']) $m->delete($cle);
  return $auth;
}

function signer(string $hash): string {
  $charge = b64url(json_encode(['exp' => (time() + DUREE_JETON) * 1000]));
  return $charge . '.' . b64url(hash_hmac('sha256', $charge, $hash, true));
}

function verifier_jeton(Magasin $m, string $jeton): void {
  if (!preg_match('/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/', $jeton)) throw new Erreur(401, 'Session absente.');
  $brut = $m->get('auth');
  if ($brut === null) throw new Erreur(401, 'Session invalide.');
  $auth = json_decode($brut, true);
  [$charge, $sig] = explode('.', $jeton, 2);
  $attendu = b64url(hash_hmac('sha256', $charge, (string) $auth['hash'], true));
  if (!hash_equals($attendu, $sig)) throw new Erreur(401, 'Session invalide : reconnectez-vous.');
  $exp = json_decode((string) base64_decode(strtr($charge, '-_', '+/')), true)['exp'] ?? 0;
  if (!is_numeric($exp) || $exp < time() * 1000) throw new Erreur(401, 'Session expirée : reconnectez-vous.');
}

function jeton(): string {
  $h = (string) ($_SERVER['HTTP_AUTHORIZATION'] ?? '');
  if ($h === '' && function_exists('apache_request_headers')) $h = (string) (apache_request_headers()['Authorization'] ?? '');
  return str_starts_with($h, 'Bearer ') ? trim(substr($h, 7)) : '';
}

function empreinte(string $sel): string {
  $ip = trim(explode(',', (string) ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '?'))[0]);
  return substr(hash('sha256', $sel . $ip), 0, 16);
}

function b64url(string $s): string { return rtrim(strtr(base64_encode($s), '+/', '-_'), '='); }

/* ---------- brouillons ---------- */

function texte(mixed $v, int $max): string { return is_string($v) ? mb_substr($v, 0, $max) : ''; }

function normaliser(mixed $b, string $id, string $cree): array {
  $o = is_array($b) ? $b : [];
  $statut = in_array($o['statut'] ?? null, STATUTS, true) ? $o['statut'] : 'brouillon';
  $rubrique = preg_replace('/[^a-z0-9-]/', '', texte($o['rubrique'] ?? null, 40)) ?: 'vie-association';
  return [
    'id' => $id,
    'titre' => trim(texte($o['titre'] ?? null, 200)),
    'chapo' => trim(texte($o['chapo'] ?? null, 600)),
    'rubrique' => $rubrique,
    'statut' => $statut,
    'corps' => texte($o['corps'] ?? null, 60000),
    'auteur' => trim(texte($o['auteur'] ?? null, 120)) ?: 'Rédaction ADEB LONODJI',
    'cree' => $cree,
    'maj' => gmdate('Y-m-d\TH:i:s.v\Z'),
  ];
}

function lister(Magasin $m): array {
  $liste = json_decode($m->get('index') ?? '[]', true) ?: [];
  usort($liste, fn($a, $b) => strcmp($b['maj'], $a['maj']));
  return $liste;
}

function id_valide(string $id): bool { return (bool) preg_match('/^[a-z0-9-]{8,40}$/', $id); }

function lire(Magasin $m, string $id): array {
  if (!id_valide($id)) throw new Erreur(400, 'Identifiant invalide.');
  $brut = $m->get("brouillons/$id");
  if ($brut === null) throw new Erreur(404, 'Brouillon introuvable.');
  return json_decode($brut, true);
}

function enregistrer(Magasin $m, mixed $entree): array {
  $o = is_array($entree) ? $entree : [];
  $id = is_string($o['id'] ?? null) && id_valide($o['id']) ? $o['id'] : '';
  $cree = gmdate('Y-m-d\TH:i:s.v\Z');
  if ($id !== '') {
    $existant = $m->get("brouillons/$id");
    if ($existant !== null) $cree = json_decode($existant, true)['cree'] ?? $cree;
  } else {
    $id = substr($cree, 0, 10) . '-' . bin2hex(random_bytes(4));
  }
  $b = normaliser($o, $id, $cree);
  $m->set("brouillons/$id", json_encode($b, JSON_UNESCAPED_UNICODE));
  $liste = array_values(array_filter(lister($m), fn($x) => $x['id'] !== $id));
  $liste[] = ['id' => $id, 'titre' => $b['titre'], 'rubrique' => $b['rubrique'], 'statut' => $b['statut'], 'maj' => $b['maj']];
  $m->set('index', json_encode($liste, JSON_UNESCAPED_UNICODE));
  return $b;
}

function supprimer(Magasin $m, string $id): void {
  if (!id_valide($id)) throw new Erreur(400, 'Identifiant invalide.');
  $m->delete("brouillons/$id");
  $m->set('index', json_encode(array_values(array_filter(lister($m), fn($x) => $x['id'] !== $id)), JSON_UNESCAPED_UNICODE));
}

/* ---------- divers ---------- */

function charger_config(): array {
  $base = dirname((string) ($_SERVER['DOCUMENT_ROOT'] ?: __DIR__)) . '/lonodji-prive';
  $defaut = ['DOSSIER_DONNEES' => $base, 'REDACTION_INVITATION' => '', 'SEL' => ''];
  $fichier = "$base/config.php";
  $perso = is_file($fichier) ? (include $fichier) : [];
  $c = array_merge($defaut, is_array($perso) ? $perso : []);
  if ($c['SEL'] === '') {
    $f = $c['DOSSIER_DONNEES'] . '/sel.txt';
    if (!is_file($f)) { @mkdir($c['DOSSIER_DONNEES'], 0700, true); file_put_contents($f, bin2hex(random_bytes(16)), LOCK_EX); @chmod($f, 0600); }
    $c['SEL'] = trim((string) @file_get_contents($f)) ?: 'lonodji';
  }
  return $c;
}

function ok(array $data, int $statut = 200): never {
  http_response_code($statut);
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}

final class Erreur extends RuntimeException {
  public function __construct(public readonly int $statut, string $message) { parent::__construct($message); }
}
