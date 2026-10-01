# Relecture du 1er octobre 2026, lot G : accueil, tableau de suivi (/impact), presse, journal, dossiers, documents,
# mission, plaidoyers (/actions), villages. Paires appliquées au HTML de l'ancien site par scripts/import-legacy.py
# (corrections_revue), avant structure_30_09 et comptes_courants : les textes « vingt thématiques » écrits ici
# deviennent « vingt et une » à l'étape suivante (COMPTES_RE_30_09) ; aucun n'en contient donc ici.

# Fiche de suivi de la thématique 20 (créée le 29/09, annoncée dans le texte de la page mais jamais affichée).
# Insérée après la fiche 12 ; structure_30_09 insère la fiche 21 (Énergie) au même endroit, juste après la 12.
URGENCES_SUIVI = (
    '<article class="pole-card" id="urgences-risques"><div class="pole-head-row"><span class="pole-icon">'
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    '<path d="M12 3L2 20h20L12 3z"/><path d="M12 10v4"/><path d="M12 17h.01"/></svg></span>'
    '<span class="pole-num">THÉMATIQUE 20</span></div><span class="pole-status pole-status--vacant">À pourvoir</span>'
    '<h3><a href="poles.html#urgences-risques">Urgences &amp; risques</a></h3>'
    '<p class="kanban-card-meta">Aucune problématique reliée pour l&rsquo;instant.</p><div class="pole-hub-links">'
    '<a class="pole-hub-link" href="besoins.html">Signaler un premier cas concret &rarr;</a>'
    '<a class="pole-hub-link pole-hub-link--join" href="poles.html#urgences-risques">Voir la fiche thématique &rarr;</a></div></article>'
)
FIN_FICHE_12 = ('<a class="pole-hub-link pole-hub-link--join" href="poles.html#solidarite-inclusion">Voir la fiche thématique &rarr;</a></div></article>\n'
                '</div></div></section>')

# Résumés de plaidoyers alignés sur le corps des articles (eau : réseau existant limité à un village et arrêté faute
# de carburant ; routes : desserte par la nationale, pas de voirie ; santé : taux par naissance, pas par femme).
EAU_ANCIEN = "Un chef-lieu sans réseau d&rsquo;eau : le plaidoyer d&rsquo;ADEB LONODJI pour inscrire Bédjondo dans les programmes d&rsquo;hydraulique et bâtir une mini-adduction solaire."
EAU_NOUVEAU = "Un réseau d&rsquo;eau qui ne dessert qu&rsquo;un village et s&rsquo;arrête faute de carburant : le plaidoyer d&rsquo;ADEB LONODJI pour le solariser et l&rsquo;étendre à toute la ville."
ROUTES_ANCIEN = "Un chef-lieu coupé à chaque saison des pluies : le plaidoyer d&rsquo;ADEB LONODJI pour l&rsquo;axe Koumra–Bédjondo, le pont de l&rsquo;axe Bédjondo–Békamba et le pont de Hoblo."
ROUTES_NOUVEAU = "Desservie par la nationale mais sans voirie : le plaidoyer d&rsquo;ADEB LONODJI pour les rues de Bédjondo, le pont de l&rsquo;axe Bédjondo–Békamba et le pont de Hoblo."
SANTE_ANCIEN = "Une femme tchadienne sur cent meurt en couches : le plaidoyer d&rsquo;ADEB LONODJI pour un centre de santé de Bédjondo digne d&rsquo;un chef-lieu de département."
SANTE_NOUVEAU = "Au Tchad, près d&rsquo;une naissance sur cent coûte la vie à la mère : le plaidoyer d&rsquo;ADEB LONODJI pour un centre de santé de Bédjondo digne d&rsquo;un chef-lieu."


def _nbsp(s: str) -> str:
    """Même texte, avec l'espace insécable devant « : » (forme de actualites.html)."""
    return s.replace(" : ", "&nbsp;: ", 1)


CORRECTIONS = {
    "suivi.html": [
        # 16 thématiques ont au moins une problématique (01 à 14, 17 et, après structure_30_09, 21), sur 21
        ('aria-label="15 thématiques déjà reliées à une problématique — voir le suivi par pôle">\n          <span class="bento-num">15</span>',
         'aria-label="16 thématiques déjà reliées à une problématique — voir le suivi par pôle">\n          <span class="bento-num">16</span>'),
        ("sur 20, tous pôles confondus", "sur 21, tous pôles confondus"),
        # la fiche 20, annoncée par la page, manquait
        (FIN_FICHE_12,
         FIN_FICHE_12.replace("</article>\n", "</article>\n" + URGENCES_SUIVI + "\n", 1)),
        # Connectivité a une problématique (fiche 17 de la même page) ; la cinquième sans problématique est la 20
        ('&middot; <a href="poles.html#transformation-numerique-services">Connectivité &amp; services numériques</a> &middot; <a href="poles.html#intelligence-artificielle-donnees">',
         '&middot; <a href="poles.html#intelligence-artificielle-donnees">'),
        ("Compétences &amp; entrepreneuriat numérique</a>. Ce n&rsquo;est pas un oubli&nbsp;: ce sont des chantiers tournés vers l&rsquo;avenir (numérique, données, diaspora, droit)",
         "Compétences &amp; entrepreneuriat numérique</a> &middot; <a href=\"poles.html#urgences-risques\">Urgences &amp; risques</a>. Ce n&rsquo;est pas un oubli&nbsp;: ce sont des chantiers tournés vers l&rsquo;avenir ou vers l&rsquo;imprévu (numérique, données, diaspora, droit, urgences)"),
        # la fiche Énergie (ajoutée par structure_30_09) n'a qu'une problématique « Partiel » : rien de « documenté »
        ("<p>Ces deux thématiques ont des problématiques documentées <strong>et</strong> un plaidoyer déjà publié",
         "<p>Ces trois thématiques ont un diagnostic engagé <strong>et</strong> un plaidoyer déjà publié"),
        # liste alignée sur les fiches de la même page : Culture (Partiel, Inconnu) et Environnement (Ailleurs) n'ont
        # rien de documenté ; Protection sociale (Documenté : 2, sans plaidoyer) manquait
        ('Ces cinq thématiques ont des problématiques documentées mais pas encore de dossier de plaidoyer&nbsp;: <a href="poles.html#culture-patrimoine-vivant">Culture &amp; patrimoine vivant</a> &middot; <a href="poles.html#agriculture-elevage-securite-alimentaire">Agriculture, élevage &amp; sécurité alimentaire</a> &middot; <a href="poles.html#entrepreneuriat-finance-inclusive">Entrepreneuriat &amp; finance inclusive</a> &middot; <a href="poles.html#environnement-ressources">Environnement, climat &amp; ressources naturelles</a> &middot; <a href="poles.html#paix-cohesion">Paix &amp; cohésion</a>.',
         'Ces quatre thématiques ont des problématiques documentées mais pas encore de dossier de plaidoyer&nbsp;: <a href="poles.html#agriculture-elevage-securite-alimentaire">Agriculture, élevage &amp; sécurité alimentaire</a> &middot; <a href="poles.html#entrepreneuriat-finance-inclusive">Entrepreneuriat &amp; finance inclusive</a> &middot; <a href="poles.html#solidarite-inclusion">Protection sociale, enfance &amp; inclusion</a> &middot; <a href="poles.html#paix-cohesion">Paix &amp; cohésion</a>.'),
    ],
    "actualites.html": [
        (_nbsp(EAU_ANCIEN), _nbsp(EAU_NOUVEAU)),
        (_nbsp(ROUTES_ANCIEN), _nbsp(ROUTES_NOUVEAU)),
        (_nbsp(SANTE_ANCIEN), _nbsp(SANTE_NOUVEAU)),
    ],
    # description, og:description, twitter:description et JSON-LD de chaque article (le corps n'est pas réécrit)
    "articles/2026-09-17-plaidoyer-eau-potable-bedjondo.html": [
        (EAU_ANCIEN, EAU_NOUVEAU),
        (EAU_ANCIEN.replace("&rsquo;", "’"), EAU_NOUVEAU.replace("&rsquo;", "’")),
    ],
    "articles/2026-09-17-plaidoyer-routes-ponts-bedjondo.html": [
        (ROUTES_ANCIEN, ROUTES_NOUVEAU),
        (ROUTES_ANCIEN.replace("&rsquo;", "’"), ROUTES_NOUVEAU.replace("&rsquo;", "’")),
    ],
    "articles/2026-09-17-plaidoyer-sante-bedjondo.html": [
        (SANTE_ANCIEN, SANTE_NOUVEAU),
        (SANTE_ANCIEN.replace("&rsquo;", "’"), SANTE_NOUVEAU.replace("&rsquo;", "’")),
    ],
    "trouver-ma-thematique.html": [
        # 5 thématiques à pourvoir (16/21) ; « Vingt » devient « Vingt et une » à l'étape COMPTES_RE_30_09
        # « dont quatre sans coordonnateur » : recalculé à l'import (phrases_comptes), plus de paire ici
    ],
    "application.html": [
        # une version d'essai Android 1.0.1 est en ligne depuis le 28/09 (content/projets.json, /impact)
        ('<div class="eyebrow">Projet annonc&eacute;</div>', '<div class="eyebrow">Version d&rsquo;essai</div>'),
        ("Elle sera lanc&eacute;e dans les mois &agrave; venir, Android d&rsquo;abord.",
         "Une version d&rsquo;essai Android est en ligne depuis le 28 septembre 2026&nbsp;; la version d&eacute;finitive viendrait ensuite."),
    ],
    "mission.html": [
        # l'association ne se concerte pas « avec » elle-même
        ("consolider un cadre de concertation stable avec ADEB LONODJI et les autres initiatives",
         "consolider un cadre de concertation stable entre ADEB LONODJI et les autres initiatives"),
        # 11 → 30 septembre ; « vingt thématiques » devient « vingt et une » à l'étape COMPTES_RE_30_09
        ("portés à quatre pôles et vingt thématiques dans les jours qui suivent",
         "portés à quatre pôles et vingt thématiques dans les semaines qui suivent"),
        # « 300+ » n'est pas une écriture française
        ("au-delà de l&rsquo;estimation actuelle de 300+ personnes réunies autour de l&rsquo;association",
         "au-delà des quelque 300 personnes réunies aujourd&rsquo;hui autour de l&rsquo;association"),
        # « en hériter » + attribut : construction bancale (même phrase corrigée sur l'accueil)
        ("pour que les générations futures en héritent renforcé.", "pour que les générations futures le reçoivent renforcé."),
    ],
    "plaidoyers.html": [
        # « celles » sans antécédent ; aucun dossier n'est encore envoyé
        ("Ces huit dossiers ne sont pas la liste de nos difficultés, mais celles que nous avons jugées assez documentées pour être écrites et envoyées.",
         "Ces huit dossiers ne sont pas toutes nos difficultés, mais celles que nous avons jugées assez documentées pour être écrites, puis envoyées."),
        # tiret d'incise jamais refermé (repris sur l'accueil et /actions)
        ("couture, mécanique, numérique, avec apprentissage financé par le FONAP",
         "couture, mécanique, numérique &mdash;, avec apprentissage financé par le FONAP"),
        # « 5 cantons » ou « seize » selon la source : la cible vise les cinq de la SIL
        ("<strong>les 5 cantons bedjond</strong>", "<strong>les 5 cantons bedjond relevés par la SIL</strong>"),
    ],
}
