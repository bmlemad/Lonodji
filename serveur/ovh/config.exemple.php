<?php
/* Configuration des scripts serveur de lonodji.org sur OVH.
   À copier HORS de la racine web : ~/lonodji-prive/config.php (jamais dans le dépôt, jamais dans www/).
   Les scripts cherchent ~/lonodji-prive à côté du dossier www de l'hébergement. */
return [
  // adresse qui reçoit un courriel à chaque envoi de formulaire (vide : pas de courriel, les envois restent dans envois/)
  'COURRIEL_NOTIFICATION' => '',
  // expéditeur des notifications : une adresse du domaine hébergé, sinon OVH peut refuser l'envoi
  'COURRIEL_EXPEDITEUR' => 'formulaires@lonodji.org',
  // code d'invitation pour créer le mot de passe de l'espace de rédaction (/redaction)
  'REDACTION_INVITATION' => '',
  // hôtes acceptés comme origine des formulaires
  'HOTES' => ['lonodji.org', 'www.lonodji.org'],
  // taille maximale d'une pièce jointe (octets) — garder en accord avec .user.ini
  'TAILLE_MAX' => 10 * 1024 * 1024,
];
