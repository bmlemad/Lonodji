# Corrections de la revue du 29 septembre 2026 (contenu français hérité de l'ancien site).
# Remplacements exacts appliqués au HTML source par scripts/import-legacy.py (corrections_revue),
# APRÈS les réécritures de structure_29_09 / lire_source. Clé : chemin relatif à l'ancien site.
# Un remplacement qui ne trouve plus son texte est signalé à l'import (« correction sans effet »).

# --- Thématique 07 : Eau, assainissement & hygiène (le WASH des ONG) ---------------------------
T07_CORPS_ANCIEN = (
    "<p>Accès à l&rsquo;eau potable, à l&rsquo;électricité et à la connexion internet&nbsp;: trois priorités identifiées par la communauté, "
    "encore insuffisantes sur le territoire. Identification des besoins des villages et portage des projets auprès des autorités et des partenaires, "
    "en lien avec les écoles et les centres de santé qui en dépendent directement. Sur l&rsquo;électricité, la thématique fait un choix clair&nbsp;: "
    "<strong>améliorer l&rsquo;accès grâce aux énergies renouvelables</strong> &mdash; solaire en premier lieu &mdash; par des solutions adaptées aux villages&nbsp;: "
    "kits et lampes solaires pour les foyers, mini-réseaux ou installations solaires pour les écoles, les centres de santé et les forages, en complément du réseau "
    "conventionnel là où il existe, et en lien avec la réflexion sur le solaire portée par la thématique Environnement, climat &amp; ressources naturelles. "
    "Sur la connectivité, la thématique porte le <a href=\"articles/2026-09-16-plaidoyer-internet-haut-debit-bedjondo.html\">plaidoyer pour un accès à l&rsquo;internet "
    "haut débit à Bédjondo</a>, zone blanche où les données mobiles restent trop chères, et le <a href=\"articles/2026-09-16-plaidoyer-electricite-bedjondo.html\">plaidoyer "
    "pour l&rsquo;accès à l&rsquo;électricité</a>, qui demande l&rsquo;inscription de Bédjondo dans le PAAET et la Mission 300. <strong>Mise à jour du 29 septembre 2026"
)
T07_CORPS_NOUVEAU = (
    "<p>Eau potable, assainissement et hygiène — ce que les ONG appellent EAH (WASH)&nbsp;: l&rsquo;eau dans chaque quartier, les latrines, "
    "les eaux usées et les déchets, le lavage des mains à l&rsquo;école et au marché, en lien avec les écoles et les centres de santé. "
    "La thématique porte le <a href=\"articles/2026-09-17-plaidoyer-eau-potable-bedjondo.html\">plaidoyer pour l&rsquo;eau potable</a>. "
    "<strong>Mise à jour du 29 septembre 2026"
)

CHIP_6_ANCIEN = ('<a class="odd-chip" href="odd.html#odd-6" style="--odd-accent:#26BDE2;--odd-ink:#10181f" title="ODD 6 &mdash; Eau propre et assainissement | '
                 'cible 6.1 &mdash; acc&egrave;s universel &agrave; l&rsquo;eau potable"><span class="odd-num">6</span><span class="odd-name">Eau &amp; assainissement</span>'
                 '<span class="odd-cible">6.1</span></a>')
CHIP_6_NOUVEAU = ('<a class="odd-chip" href="odd.html#odd-6" style="--odd-accent:#26BDE2;--odd-ink:#10181f" title="ODD 6 &mdash; Eau propre et assainissement | '
                  'cible 6.1 &mdash; acc&egrave;s universel &agrave; l&rsquo;eau potable &middot; cible 6.2 &mdash; assainissement et hygi&egrave;ne">'
                  '<span class="odd-num">6</span><span class="odd-name">Eau &amp; assainissement</span><span class="odd-cible">6.1&thinsp;/&thinsp;6.2</span></a>')
CHIP_7 = ('<a class="odd-chip" href="odd.html#odd-7" style="--odd-accent:#FCC30B;--odd-ink:#10181f" title="ODD 7 &mdash; &Eacute;nergie propre et d&rsquo;un co&ucirc;t abordable | '
          'cible 7.1 &mdash; acc&egrave;s &agrave; des services &eacute;nerg&eacute;tiques fiables &middot; cible 7.2 &mdash; part des &eacute;nergies renouvelables">'
          '<span class="odd-num">7</span><span class="odd-name">&Eacute;nergie</span><span class="odd-cible">7.1&thinsp;/&thinsp;7.2</span></a>')
CHIP_9C = ('<a class="odd-chip" href="odd.html#odd-9" style="--odd-accent:#FD6925;--odd-ink:#10181f" title="ODD 9 &mdash; Industrie, innovation et infrastructure | '
           'cible 9.c &mdash; acc&egrave;s &agrave; internet"><span class="odd-num">9</span><span class="odd-name">Infrastructures</span><span class="odd-cible">9.c</span></a>')
CHIP_2_2 = ('<a class="odd-chip" href="odd.html#odd-2" style="--odd-accent:#DDA63A;--odd-ink:#10181f" title="ODD 2 &mdash; Faim &laquo;&nbsp;z&eacute;ro&nbsp;&raquo; | '
            'cible 2.2 &mdash; mettre fin &agrave; toutes les formes de malnutrition"><span class="odd-num">2</span><span class="odd-name">Faim</span><span class="odd-cible">2.2</span></a>')

CIBLES_ANCIEN = ('<p>Au niveau des cibles, la r&eacute;ponse est plus nuanc&eacute;e, et il vaut mieux la donner nous-m&ecirc;mes&nbsp;: nos th&eacute;matiques en portent '
                 'quarante-deux sur cent soixante-neuf, et quatre cibles centrales du d&eacute;veloppement n&rsquo;y figurent toujours pas. Nous ne revendiquons ni la '
                 '<strong>malnutrition chronique des enfants</strong> (2.2), ni l&rsquo;<strong>alphab&eacute;tisation des adultes</strong> (4.6), ni le <strong>travail des '
                 'enfants</strong> (8.7), ni le <strong>co&ucirc;t des transferts d&rsquo;argent de la diaspora</strong> (10.c).')
# 45 cibles distinctes sur la page Nos actions une fois 2.2 ajoutée à la thématique 11 (44 avant) :
# la cible 8.7 (travail des enfants) n'est toujours portée par aucune thématique.
CIBLES_NOUVEAU = ('<p>Au niveau des cibles, la r&eacute;ponse est plus nuanc&eacute;e, et il vaut mieux la donner nous-m&ecirc;mes&nbsp;: nos th&eacute;matiques en portent '
                  'quarante-cinq sur cent soixante-neuf, et trois cibles centrales du d&eacute;veloppement n&rsquo;y figurent toujours pas. Nous ne revendiquons ni '
                  'l&rsquo;<strong>alphab&eacute;tisation des adultes</strong> (4.6), ni le <strong>travail des enfants</strong> (8.7), ni le <strong>co&ucirc;t des transferts '
                  'd&rsquo;argent de la diaspora</strong> (10.c). La <strong>malnutrition des enfants</strong> (2.2), que nous citions ici, est entrée le 29 septembre 2026 '
                  'dans la thématique Santé, nutrition &amp; prévention.')


def _lien_odd(ancre: str, libelle: str, cible: str) -> str:
    """Un lien du tableau de odd.html : thématique et cible(s)."""
    return f'<a href="poles.html#{ancre}">{libelle} <span class="odd-cible">{cible}</span></a>'


L04 = "04 &middot; Agriculture, &eacute;levage &amp; s&eacute;curit&eacute; alimentaire"
L06 = "06 &middot; Environnement, climat &amp; ressources naturelles"
L07 = "07 &middot; Eau, assainissement &amp; hygi&egrave;ne"
L08 = "08 &middot; &Eacute;nergie, routes &amp; urbanisme"
L11 = "11 &middot; Sant&eacute;, nutrition &amp; pr&eacute;vention"
L12 = "12 &middot; Protection sociale, enfance &amp; inclusion"
L20 = "20 &middot; Urgences &amp; risques"

INTENTION_ONG = ('<span class="pole-status pole-status--vacant">Décision prise, à engager</span>',
                 '<span class="pole-status pole-status--vacant">Intention annoncée, à décider par l&rsquo;assemblée générale</span>')

CORRECTIONS = {
    "poles.html": [
        # 29/09/2026 : Air Bedjondo devient Bedjondo Transport et Logistique
        ('<span class="rubrique-card-title">Air Bedjondo</span>', '<span class="rubrique-card-title">Bedjondo Transport et Logistique</span>'),
        ('(voir <a href="air-bedjondo.html">Air Bedjondo</a>).', '(voir <a href="https://lonodji.org/dossiers/bedjondo-transport-logistique">Bedjondo Transport et Logistique</a>, ex-Air Bedjondo).'),
        ('<a class="pole-hub-link" href="air-bedjondo.html">Air Bedjondo &rarr;</a>', '<a class="pole-hub-link" href="https://lonodji.org/dossiers/bedjondo-transport-logistique">Bedjondo Transport et Logistique &rarr;</a>'),
        # 1. Thématique 07 : corps, étiquettes, ODD, suivi
        (T07_CORPS_ANCIEN, T07_CORPS_NOUVEAU),
        ('<div class="pole-tags"><span class="tag">Eau potable</span><span class="tag">Électricité</span><span class="tag">Solaire</span><span class="tag">Internet</span></div>',
         '<div class="pole-tags"><span class="tag">Eau potable</span><span class="tag">Assainissement</span><span class="tag">Hygiène</span></div>'),
        (CHIP_6_ANCIEN + CHIP_7 + CHIP_9C + "</div>", CHIP_6_NOUVEAU + "</div>"),
        ('<a class="pole-hub-link" href="suivi.html#eau-energie-connectivite">Suivi : 3 problématiques &middot; 3 plaidoyers &rarr;</a>',
         '<a class="pole-hub-link" href="poles.html#desenclavement-urbanisation">Énergie, routes &amp; urbanisme &rarr;</a>\n'
         '          <a class="pole-hub-link" href="suivi.html#eau-energie-connectivite">Suivi : 2 problématiques &middot; 1 plaidoyer &rarr;</a>'),
        # 1. Thématique 08 : l'énergie venue de la 07 (étiquettes, ODD 7, suivi)
        ('<span class="tag">Routes</span><span class="tag">Assainissement</span><span class="tag">Plan de ville</span></div>',
         '<span class="tag">Routes</span><span class="tag">Électricité</span><span class="tag">Solaire</span><span class="tag">Plan de ville</span></div>'),
        ('<span class="odd-cible">11.3&thinsp;/&thinsp;11.6</span></a></div>', '<span class="odd-cible">11.3&thinsp;/&thinsp;11.6</span></a>' + CHIP_7 + "</div>"),
        ('<a class="pole-hub-link" href="suivi.html#desenclavement-urbanisation">Suivi : 4 problématiques &middot; 1 plaidoyer &rarr;</a>',
         '<a class="pole-hub-link" href="suivi.html#desenclavement-urbanisation">Suivi : 4 problématiques &middot; 2 plaidoyers &rarr;</a>'),
        # 1. Thématique 17 : la connexion internet venue de la 07
        ('<div class="pole-tags"><span class="tag">E-administration</span><span class="tag">Inclusion numérique</span><span class="tag">Mobile money</span></div>',
         '<div class="pole-tags"><span class="tag">Internet</span><span class="tag">E-administration</span><span class="tag">Inclusion numérique</span><span class="tag">Mobile money</span></div>'),
        # 2. Renvois des thématiques 06 et 17
        ("en complément de l&rsquo;énergie conventionnelle portée par la <a href=\"poles.html#eau-energie-connectivite\">thématique Eau, assainissement &amp; hygiène</a>.",
         "en complément de l&rsquo;énergie conventionnelle portée par la <a href=\"poles.html#desenclavement-urbanisation\">thématique Énergie, routes &amp; urbanisme</a>."),
        ("en lien avec la connectivité et l&rsquo;énergie solaire portées par la thématique <a href=\"#eau-energie-connectivite\">Eau, assainissement &amp; hygiène</a>.",
         "en lien avec l&rsquo;énergie solaire portée par la thématique <a href=\"#desenclavement-urbanisation\">Énergie, routes &amp; urbanisme</a>."),
        ('<a class="pole-hub-link" href="poles.html#eau-energie-connectivite">Eau, assainissement &amp; hygiène &rarr;</a>\n'
         '          <a class="pole-hub-link" href="poles.html#gouvernance-plaidoyer">',
         '<a class="pole-hub-link" href="poles.html#desenclavement-urbanisation">Énergie, routes &amp; urbanisme &rarr;</a>\n'
         '          <a class="pole-hub-link" href="suivi.html#transformation-numerique-services">Suivi : 1 problématique &middot; 1 plaidoyer &rarr;</a>\n'
         '          <a class="pole-hub-link" href="poles.html#gouvernance-plaidoyer">'),
        # 3. Thématique 12 : l'aide d'urgence est passée à la 20 ; thématique 11 : cible 2.2 (nutrition)
        ("<p>Accompagnement social, soutien aux familles, solidarité dans les moments difficiles et aide d&rsquo;urgence en cas de catastrophe ou d&rsquo;épidémie. Premières pistes",
         "<p>Accompagnement social, soutien aux familles et solidarité dans les moments difficiles. Premières pistes"),
        ('<span class="odd-cible">6.2</span></a></div>', '<span class="odd-cible">6.2</span></a>' + CHIP_2_2 + "</div>"),
        # 5. Bloc ODD : le compte des cibles et les cibles manquantes
        (CIBLES_ANCIEN, CIBLES_NOUVEAU),
        ("Ce sont quatre chantiers disponibles&nbsp;:", "Ce sont trois chantiers disponibles&nbsp;:"),
        # 16. Espaces parasites avant la virgule (tiret de fin d'incise perdu dans l'ancien site)
        ("c&rsquo;est une préoccupation récurrente des familles , et l&rsquo;hygiène", "c&rsquo;est une préoccupation récurrente des familles, et l&rsquo;hygiène"),
        ("mobile money et accès bancaire , notamment", "mobile money et accès bancaire, notamment"),
        ("en porte la prévention , et avec l&rsquo;", "en porte la prévention, et avec l&rsquo;"),
        # 17. Les cellules ne sont pas des thématiques
        ('<a class="pole-hub-link pole-hub-link--join" href="contact.html?theme=financement">Rejoindre cette th&eacute;matique &rarr;</a>',
         '<a class="pole-hub-link pole-hub-link--join" href="contact.html?theme=financement">Rejoindre cette cellule &rarr;</a>'),
        ('<a class="pole-hub-link pole-hub-link--join" href="contact.html?theme=communication">Rejoindre cette th&eacute;matique &rarr;</a>',
         '<a class="pole-hub-link pole-hub-link--join" href="contact.html?theme=communication">Rejoindre cette cellule &rarr;</a>'),
    ],
    "odd.html": [
        # 5. Tableau des ODD : thématique 20, ODD 7 passé à la 08, 9.c à la seule 17, 2.2 et 6.2
        ('<span class="hero-pill">42 cibles</span>', '<span class="hero-pill">45 cibles</span>'),
        (_lien_odd("solidarite-inclusion", L12, "1.3") + "</div>",
         _lien_odd("solidarite-inclusion", L12, "1.3") + _lien_odd("urgences-risques", L20, "1.5") + "</div>"),
        (_lien_odd("agriculture-elevage-securite-alimentaire", L04, "2.1&thinsp;/&thinsp;2.3") + "</div>",
         _lien_odd("agriculture-elevage-securite-alimentaire", L04, "2.1&thinsp;/&thinsp;2.3") + _lien_odd("sante-prevention", L11, "2.2") + "</div>"),
        (_lien_odd("eau-energie-connectivite", L07, "6.1"), _lien_odd("eau-energie-connectivite", L07, "6.1&thinsp;/&thinsp;6.2")),
        (_lien_odd("eau-energie-connectivite", L07, "7.1&thinsp;/&thinsp;7.2"), _lien_odd("desenclavement-urbanisation", L08, "7.1&thinsp;/&thinsp;7.2")),
        (_lien_odd("eau-energie-connectivite", L07, "9.c"), ""),
        (_lien_odd("desenclavement-urbanisation", L08, "11.3&thinsp;/&thinsp;11.6") + "</div>",
         _lien_odd("desenclavement-urbanisation", L08, "11.3&thinsp;/&thinsp;11.6") + _lien_odd("urgences-risques", L20, "11.5") + "</div>"),
        (_lien_odd("environnement-ressources", L06, "13.1") + "</div>",
         _lien_odd("environnement-ressources", L06, "13.1") + _lien_odd("urgences-risques", L20, "13.1") + "</div>"),
    ],
    "suivi.html": [
        # 4. Électricité → 08, haut débit → 17, assainissement → 07 ; 6. vingt thématiques
        ('<p class="kanban-card-meta">3 problématiques reliées &mdash; Documenté&nbsp;: 2 &middot; Partiel&nbsp;: 1 &mdash; 3 plaidoyers actifs</p><div class="pole-hub-links">'
         '<a class="pole-hub-link" href="problematiques.html#prob-09">Réseau d’eau limité à un seul village et fréquemment à l’arrêt… &rarr;</a>'
         '<a class="pole-hub-link" href="problematiques.html#prob-10">Aucun équipement public électrifié connu &rarr;</a>'
         '<a class="pole-hub-link" href="problematiques.html#prob-11">Bédjondo absente du volet rural du projet national de… &rarr;</a>'
         '<a class="pole-hub-link" href="plaidoyers.html#plaidoyer-internet">&laquo;&nbsp;Bédjondo a droit au haut débit&nbsp;&raquo; &rarr;</a>'
         '<a class="pole-hub-link" href="plaidoyers.html#plaidoyer-electricite">&laquo;&nbsp;De la lumière pour Bédjondo&nbsp;&raquo; &rarr;</a>'
         '<a class="pole-hub-link" href="plaidoyers.html#plaidoyer-eau">',
         '<p class="kanban-card-meta">2 problématiques reliées &mdash; Documenté&nbsp;: 1 &middot; Inconnu&nbsp;: 1 &mdash; 1 plaidoyer actif</p><div class="pole-hub-links">'
         '<a class="pole-hub-link" href="problematiques.html#prob-09">Réseau d’eau limité à un seul village et fréquemment à l’arrêt… &rarr;</a>'
         '<a class="pole-hub-link" href="problematiques.html#prob-12">Assainissement et gestion des déchets &rarr;</a>'
         '<a class="pole-hub-link" href="plaidoyers.html#plaidoyer-eau">'),
        ('<p class="kanban-card-meta">4 problématiques reliées &mdash; Documenté&nbsp;: 1 &middot; Partiel&nbsp;: 1 &middot; Ailleurs&nbsp;: 1 &middot; Inconnu&nbsp;: 1 &mdash; 1 plaidoyer actif</p><div class="pole-hub-links">'
         '<a class="pole-hub-link" href="problematiques.html#prob-12">Assainissement et gestion des déchets &rarr;</a>',
         '<p class="kanban-card-meta">4 problématiques reliées &mdash; Documenté&nbsp;: 1 &middot; Partiel&nbsp;: 2 &middot; Ailleurs&nbsp;: 1 &mdash; 2 plaidoyers actifs</p><div class="pole-hub-links">'
         '<a class="pole-hub-link" href="problematiques.html#prob-10">Aucun équipement public électrifié connu &rarr;</a>'),
        ('<a class="pole-hub-link" href="plaidoyers.html#plaidoyer-routes">',
         '<a class="pole-hub-link" href="plaidoyers.html#plaidoyer-electricite">&laquo;&nbsp;De la lumière pour Bédjondo&nbsp;&raquo; &rarr;</a>'
         '<a class="pole-hub-link" href="plaidoyers.html#plaidoyer-routes">'),
        ('<p class="kanban-card-meta">Aucune problématique reliée pour l&rsquo;instant.</p><div class="pole-hub-links"><a class="pole-hub-link" href="besoins.html">Signaler un premier cas concret &rarr;</a>'
         '<a class="pole-hub-link pole-hub-link--join" href="poles.html#transformation-numerique-services">',
         '<p class="kanban-card-meta">1 problématique reliée &mdash; Documenté&nbsp;: 1 &mdash; 1 plaidoyer actif</p><div class="pole-hub-links">'
         '<a class="pole-hub-link" href="problematiques.html#prob-11">Bédjondo absente du volet rural du projet national de… &rarr;</a>'
         '<a class="pole-hub-link" href="plaidoyers.html#plaidoyer-internet">&laquo;&nbsp;Bédjondo a droit au haut débit&nbsp;&raquo; &rarr;</a>'
         '<a class="pole-hub-link pole-hub-link--join" href="poles.html#transformation-numerique-services">'),
        ('aria-label="14 thématiques déjà reliées à une problématique — voir le suivi par pôle">', 'aria-label="15 thématiques déjà reliées à une problématique — voir le suivi par pôle">'),
        ('<span class="bento-num">14</span>\n          <span class="bento-label">thématiques déjà reliées', '<span class="bento-num">15</span>\n          <span class="bento-label">thématiques déjà reliées'),
        ('<span class="bento-note">sur 19, tous pôles confondus</span>', '<span class="bento-note">sur 20, tous pôles confondus</span>'),
        # 11. Sept plaidoyers et une note à la commune : huit dossiers
        ('aria-label="8 plaidoyers en cours — voir nos plaidoyers">', 'aria-label="8 dossiers de plaidoyer en cours — voir nos plaidoyers">'),
        ('<span class="bento-label">plaidoyers en cours</span>\n          <span class="bento-note">tous publiés, réponse encore à obtenir</span>',
         '<span class="bento-label">dossiers de plaidoyer en cours</span>\n          <span class="bento-note">sept plaidoyers et une note à la commune, tous publiés, réponse encore à obtenir</span>'),
        ('<span class="hero-pill">8 plaidoyers</span>', '<span class="hero-pill">8 dossiers de plaidoyer</span>'),
    ],
    "plaidoyers.html": [
        # 4. Rattachement des plaidoyers électricité et haut débit
        ('<a class="plea-theme" href="poles.html#eau-energie-connectivite">Connectivité</a>', '<a class="plea-theme" href="poles.html#transformation-numerique-services">Connectivité</a>'),
        ('<a class="plea-theme" href="poles.html#eau-energie-connectivite">Énergie</a>', '<a class="plea-theme" href="poles.html#desenclavement-urbanisation">Énergie</a>'),
        ('Électricité <a class="prob-theme-lien" href="poles.html#eau-energie-connectivite">&rarr; Eau, assainissement & hygiène</a>',
         'Électricité <a class="prob-theme-lien" href="poles.html#desenclavement-urbanisation">&rarr; Énergie, routes & urbanisme</a>'),
        ('Connectivité <a class="prob-theme-lien" href="poles.html#eau-energie-connectivite">&rarr; Eau, assainissement & hygiène</a>',
         'Connectivité <a class="prob-theme-lien" href="poles.html#transformation-numerique-services">&rarr; Connectivité & services numériques</a>'),
        # 11. Numéro WhatsApp publié, transmission au futur, huit dossiers
        ("Une photo d&rsquo;écran du test est bienvenue par WhatsApp quand nous aurons publié le numéro.",
         "Une photo d&rsquo;écran du test est bienvenue par WhatsApp au <a href=\"tel:+23566299403\">+235&nbsp;66&nbsp;29&nbsp;94&nbsp;03</a>."),
        ("Nous les collectons nous-mêmes et transmettons les résultats à l&rsquo;ARCEP.", "Nous les collectons nous-mêmes et transmettrons les résultats à l&rsquo;ARCEP."),
        ('<span class="hero-pill">8 plaidoyers publiés</span>', '<span class="hero-pill">7 plaidoyers et 1 note publiés</span>'),
        ("<li>Huit plaidoyers, notamment sur l’eau, l’énergie, la santé et l’école, sont publiés mais pas encore envoyés",
         "<li>Sept plaidoyers et une note à la commune — huit dossiers —, notamment sur l’eau, l’énergie, la santé et l’école, sont publiés mais pas encore envoyés"),
        # 16.
        ("couture, mécanique, numérique , avec apprentissage", "couture, mécanique, numérique, avec apprentissage"),
    ],
    "problematiques.html": [
        # 4. Rattachement des problématiques 10, 11, 12
        ('(<a href="articles/2026-09-16-plaidoyer-electricite-bedjondo.html">&eacute;lectricit&eacute;</a>) <a class="prob-theme-lien" href="poles.html#eau-energie-connectivite">→ Eau, assainissement & hygiène</a>',
         '(<a href="articles/2026-09-16-plaidoyer-electricite-bedjondo.html">&eacute;lectricit&eacute;</a>) <a class="prob-theme-lien" href="poles.html#desenclavement-urbanisation">→ Énergie, routes & urbanisme</a>'),
        ('(<a href="articles/2026-09-16-plaidoyer-internet-haut-debit-bedjondo.html">connectivit&eacute;</a>) <a class="prob-theme-lien" href="poles.html#eau-energie-connectivite">→ Eau, assainissement & hygiène</a>',
         '(<a href="articles/2026-09-16-plaidoyer-internet-haut-debit-bedjondo.html">connectivit&eacute;</a>) <a class="prob-theme-lien" href="poles.html#transformation-numerique-services">→ Connectivité & services numériques</a>'),
        ('dans une ville qui a grandi sans plan <a class="prob-theme-lien" href="poles.html#desenclavement-urbanisation">→ Énergie, routes & urbanisme</a>',
         'dans une ville qui a grandi sans plan <a class="prob-theme-lien" href="poles.html#eau-energie-connectivite">→ Eau, assainissement & hygiène</a>'),
        ('mairie (&eacute;lectricit&eacute;)</div><div class="kanban-card-meta">Qui d&eacute;cide&nbsp;: National</div><div class="kanban-card-theme">→ Eau, assainissement & hygiène</div>',
         'mairie (&eacute;lectricit&eacute;)</div><div class="kanban-card-meta">Qui d&eacute;cide&nbsp;: National</div><div class="kanban-card-theme">→ Énergie, routes & urbanisme</div>'),
        ('num&eacute;rique (connectivit&eacute;)</div><div class="kanban-card-meta">Qui d&eacute;cide&nbsp;: National</div><div class="kanban-card-theme">→ Eau, assainissement & hygiène</div>',
         'num&eacute;rique (connectivit&eacute;)</div><div class="kanban-card-meta">Qui d&eacute;cide&nbsp;: National</div><div class="kanban-card-theme">→ Connectivité & services numériques</div>'),
        ('grandi sans plan</div><div class="kanban-card-meta">Qui d&eacute;cide&nbsp;: Commune</div><div class="kanban-card-theme">→ Énergie, routes & urbanisme</div>',
         'grandi sans plan</div><div class="kanban-card-meta">Qui d&eacute;cide&nbsp;: Commune</div><div class="kanban-card-theme">→ Eau, assainissement & hygiène</div>'),
        # 13. L'inventaire des villages : les données ouvertes (public/carte/donnees.json : 966 localités
        # nommées sur 14 unités, 205 dans les sept unités du Mandoul Occidental), pas 133 relevés.
        ("Inventaire des villages incomplet &mdash; 133 recens&eacute;s par nous sur 256 estim&eacute;s (<a href=\"articles/2026-09-13-villages-cantons-pays-nangnda.html\">villages et cantons</a>)",
         "Inventaire des villages incomplet &mdash; 966 localités nommées dans les données ouvertes (OpenStreetMap) sur les quatorze unités du pays bedjond, dont 205 dans le Mandoul Occidental, "
         "aucune encore vérifiée sur le terrain, pour environ 256 villages estimés dans ce seul département (<a href=\"articles/2026-09-13-villages-cantons-pays-nangnda.html\">villages et cantons</a>)"),
        ("Inventaire des villages incomplet &mdash; 133 recens&eacute;s par nous sur 256 estim&eacute;s (villages et cantons)",
         "Inventaire des villages incomplet &mdash; 966 localités nommées dans les données ouvertes, dont 205 dans le Mandoul Occidental, aucune vérifiée sur le terrain, pour environ 256 villages estimés"),
        ("la seule base de données locale existante est celle que nous construisons nous-mêmes&nbsp;: <strong>133 villages inventoriés sur environ 256 estimés</strong>. C&rsquo;est modeste, c&rsquo;est incomplet",
         "la seule base de données locale existante est celle que nous rassemblons nous-mêmes à partir des données ouvertes (OpenStreetMap)&nbsp;: <strong>966 localités nommées sur les quatorze unités du pays bedjond, "
         "dont 205 dans le Mandoul Occidental, pour environ 256 villages estimés dans ce département</strong>, aucune encore vérifiée sur le terrain. C&rsquo;est modeste, c&rsquo;est incomplet"),
    ],
    "mission.html": [
        # 7.
        ("quatre pôles et vingt thématiques d&rsquo;action, chacune confiée à un coordonnateur qui rend compte devant l&rsquo;ensemble des membres.</p>",
         "quatre pôles et vingt thématiques d&rsquo;action, dont quinze ont déjà leur coordonnateur&nbsp;; chaque coordonnateur rend compte devant l&rsquo;ensemble des membres.</p>"),
        ("la raison d&rsquo;être première de l&rsquo;association&nbsp;: agriculture, élevage et sécurité alimentaire, entrepreneuriat et finance inclusive, environnement et ressources naturelles, "
         "eau, énergie et connectivité, désenclavement et urbanisation, jeunesse et réussite, genre et autonomisation des femmes, santé et prévention, protection sociale et inclusion.",
         "la raison d&rsquo;être première de l&rsquo;association&nbsp;: agriculture, élevage et sécurité alimentaire&nbsp;; entrepreneuriat et finance inclusive&nbsp;; environnement, climat et ressources naturelles&nbsp;; "
         "eau, assainissement et hygiène&nbsp;; énergie, routes et urbanisme&nbsp;; éducation, jeunesse et formation&nbsp;; genre et autonomisation des femmes&nbsp;; santé, nutrition et prévention&nbsp;; "
         "protection sociale, enfance et inclusion&nbsp;; urgences et risques."),
        ("<p>Bédjondo est l&rsquo;ancrage exclusif de l&rsquo;association&nbsp;: chef-lieu du Mandoul Occidental, dans la province du Mandoul, et berceau du peuple bedjond dont ADEB LONODJI demeure, dans son objet, le seul cadre.",
         "<p>Bédjondo est l&rsquo;ancrage de l&rsquo;association&nbsp;: chef-lieu du Mandoul Occidental, dans la province du Mandoul, et berceau du peuple bedjond, dont elle garde le patrimoine aux côtés d&rsquo;autres initiatives comme Kokotan."),
        ("<p class=\"prose\">L&rsquo;animation générale de l&rsquo;association est assurée par son animateur, appuyé par un bureau exécutif&nbsp;: <strong>Adoumbé Maoura</strong>, président, "
         "<strong>Célestine Moyombaye</strong>, vice-présidente, <strong>Salomon Ngarbaye</strong>, secrétaire général, et <strong>&Eacute;lisabeth Neloumngaye Ndodinguem</strong>, trésorière.",
         "<p class=\"prose\">Le bureau exécutif répond de l&rsquo;association&nbsp;: <strong>Adoumbé Maoura</strong>, président, qui la représente, "
         "<strong>Célestine Moyombaye</strong>, vice-présidente, <strong>Salomon Ngarbaye</strong>, secrétaire général, et <strong>&Eacute;lisabeth Neloumngaye Ndodinguem</strong>, trésorière. "
         "L&rsquo;animation générale — coordination, communication, numérique — est assurée par <strong>Bignéro Moïalbéi LE MADANG</strong>, en appui du bureau."),
        ("Cette organisation est présentée en détail sur la page <a href=\"poles.html\">Pôles d&rsquo;action</a>.",
         "Cette organisation est présentée en détail sur la page <a href=\"poles.html\">Nos actions</a>."),
        ("village de Péni &mdash; aujourd&rsquo;hui l&rsquo;une des quatre sous-préfectures du département &mdash;",
         "village de Péni &mdash; aujourd&rsquo;hui l&rsquo;une des sous-préfectures du département &mdash;"),
    ],
    "mentions-legales.html": [
        # 8.
        ("à l&rsquo;adresse <a href=\"https://adeb-lonodji.netlify.app\">adeb-lonodji.netlify.app</a>, la seule qui fasse foi.",
         "à l&rsquo;adresse <a href=\"https://lonodji.org\">lonodji.org</a>, la seule qui fasse foi (l&rsquo;ancienne adresse adeb-lonodji.netlify.app y renvoie)."),
        INTENTION_ONG,
        ("Effacer les données du site dans les réglages du navigateur supprime le tout.</p>",
         "Effacer les données du site dans les réglages du navigateur supprime le tout.</p>\n"
         "      <p>Les cartes affichent des fonds OpenStreetMap servis par OpenStreetMap France (tile.openstreetmap.fr)&nbsp;: pour les afficher, votre navigateur transmet votre adresse IP à ce service.</p>"),
        ("<em>Cette page décrit les pratiques réelles du site au 23 septembre 2026.", "<em>Cette page décrit les pratiques réelles du site au 29 septembre 2026."),
    ],
    "demarches.html": [
        # 9.
        ("C&rsquo;est une décision portée collectivement, pas seulement annoncée par un responsable&nbsp;: nous l&rsquo;écrivons ici comme ce que c&rsquo;est&nbsp;: une décision prise, pas une démarche déjà engagée ni un statut déjà obtenu.</p>",
         "C&rsquo;est une orientation annoncée par l&rsquo;association&nbsp;: l&rsquo;instance et la date de la décision ne sont pas encore publiées, et le nom comme l&rsquo;objet de la future ONG seront fixés par l&rsquo;assemblée générale. "
         "Ce n&rsquo;est ni une démarche déjà engagée ni un statut déjà obtenu.</p>"),
        INTENTION_ONG,
        # La note du 28/09 (UPDATES de scripts/import-legacy.py) est posée ici, déjà juste : six programmes depuis le soir du 28 septembre.
        ("l&rsquo;association prendra alors le nom d&rsquo;<strong>ODEB</strong> &mdash; Organisation de Développement et d&rsquo;Entraide des Bedjond &mdash; en cohérence avec son nouveau statut. "
         "Le nom ADEB LONODJI reste, à ce jour, celui de l&rsquo;association telle qu&rsquo;elle existe&nbsp;; ODEB est le nom prévu pour l&rsquo;ONG à venir, pas encore effectif.</p>",
         "l&rsquo;association prendra alors le nom d&rsquo;<strong>ODEB LONODJI</strong> &mdash; Organisation pour le Développement et l&rsquo;Émergence Bedjonde &mdash; en cohérence avec son nouveau statut. "
         "Le nom ADEB LONODJI reste, à ce jour, celui de l&rsquo;association telle qu&rsquo;elle existe&nbsp;; ODEB est le nom prévu pour l&rsquo;ONG à venir, pas encore effectif.</p>\n"
         "<p class=\"form-note\"><strong>Mise à jour du 28 septembre 2026&nbsp;:</strong> le développement du sigle, que nous écrivions «&nbsp;Organisation de Développement et d&rsquo;Entraide des Bedjond&nbsp;», "
         "est désormais «&nbsp;Organisation pour le Développement et l&rsquo;Émergence Bedjonde&nbsp;», conformément au projet ODEB LONODJI présenté ce jour — vision 2030, six missions, "
         "six programmes (le sixième ajouté le soir du 28 septembre) et livre blanc en version de travail, sur <a href=\"https://lonodji.org/odeb\">sa page</a>. Le statut, lui, n&rsquo;a pas changé&nbsp;: aucun dossier déposé.</p>"),
    ],
    "ong-partenaires.html": [
        INTENTION_ONG,
        ("Une adresse &eacute;lectronique d&eacute;di&eacute;e sera publi&eacute;e ici d&egrave;s que le nom de domaine de l&rsquo;association sera enregistr&eacute;.",
         "Une adresse &eacute;lectronique d&eacute;di&eacute;e sera publi&eacute;e ici d&egrave;s qu&rsquo;une adresse &eacute;lectronique sera rattach&eacute;e &agrave; lonodji.org."),
    ],
    "articles/2026-09-17-plaidoyer-eau-potable-bedjondo.html": [
        # coquille (29/09/2026) : « desserre » pour « dessert », sans changement de sens
        ("nous ignorons quel village exactement son réseau desserre,", "nous ignorons quel village exactement son réseau dessert,"),
    ],
    "articles/2026-09-19-annonce-air-bedjondo.html": [
        # 29/09/2026 : nouveau nom (note datée ; le texte du 19 septembre reste tel quel)
        ('<div class="wrap prose article-body">\n<p>L&rsquo;animateur d&rsquo;ADEB LONODJI vient d&rsquo;annoncer',
         '<div class="wrap prose article-body">\n<p class="form-note"><strong>Mise à jour du 29 septembre 2026&nbsp;:</strong> le projet s&rsquo;appelle désormais <a href="https://lonodji.org/dossiers/bedjondo-transport-logistique">Bedjondo Transport et Logistique</a>&nbsp;; l&rsquo;ancien nom laissait croire à un projet aérien. Six propositions pour le mener y sont publiées. Le texte ci-dessous est celui du 19 septembre.</p>\n<p>L&rsquo;animateur d&rsquo;ADEB LONODJI vient d&rsquo;annoncer'),
    ],
    "air-bedjondo.html": [
        ('<h1>Air Bedjondo</h1>', '<h1>Bedjondo Transport et Logistique (ex-Air Bedjondo)</h1>'),
        ('<title>Air Bedjondo — transport et logistique terrestre — ADEB LONODJI</title>', '<title>Bedjondo Transport et Logistique (ex-Air Bedjondo) — ADEB LONODJI</title>'),
    ],
    "environnement.html": [
        ('<a href="air-bedjondo.html#durabilite-titre">Air Bedjondo</a>', '<a href="https://lonodji.org/dossiers/bedjondo-transport-logistique">Bedjondo Transport et Logistique</a>'),
    ],
    "redevabilite.html": [
        # 10.
        ("qui l&rsquo;instruisent sans lui. Si la réponse ne vous satisfait pas,",
         "qui l&rsquo;instruisent sans lui. Si votre signalement concerne l&rsquo;animateur, vous pouvez aussi l&rsquo;adresser directement au président, Adoumbé Maoura, "
         "par appel ou WhatsApp au <a href=\"tel:+23566299403\">+235&nbsp;66&nbsp;29&nbsp;94&nbsp;03</a>. Si la réponse ne vous satisfait pas,"),
        ("et donnions le +235&nbsp;66&nbsp;29&nbsp;44&nbsp;62 comme num&eacute;ro Mobile Money pour les cotisations et les dons.",
         "et donnions un num&eacute;ro personnel, retir&eacute; depuis, comme num&eacute;ro Mobile Money pour les cotisations et les dons."),
        ("et le num&eacute;ro &agrave; utiliser pour le Mobile Money est le <strong>+235&nbsp;66&nbsp;27&nbsp;06&nbsp;29</strong>.",
         "et le num&eacute;ro alors indiqu&eacute; &eacute;tait celui de la tr&eacute;sori&egrave;re&nbsp;; il a &eacute;t&eacute; retir&eacute; le 23 septembre 2026, la collecte &eacute;tant suspendue."),
        ("<p>ADEB LONODJI est consacrée au peuple bedjond de Bédjondo et à sa diaspora, et elle l&rsquo;assume&nbsp;: c&rsquo;est son objet. Mais au sein de ce cadre,",
         "<p>ADEB LONODJI est l&rsquo;association de Bédjondo et de sa diaspora, gardienne du patrimoine bedjond. Ses actions de développement servent tous les habitants de Bédjondo, sans distinction d&rsquo;origine. En son sein,"),
        ("Les activités impliquant des mineurs se font toujours", "Les activités impliquant des mineurs se feront toujours"),
        ("l&rsquo;association compte <strong>dix-neuf</strong> th&eacute;matiques r&eacute;parties en quatre p&ocirc;les",
         "l&rsquo;association compte <strong>dix-neuf</strong> th&eacute;matiques (vingt depuis le 29 septembre 2026) r&eacute;parties en quatre p&ocirc;les"),
    ],
    "espace-numerique.html": [
        # 12. Un projet : au conditionnel
        ('<meta name="description" content="Un espace numérique communautaire à Bédjondo, connecté par satellite et alimenté au solaire, financé avec la diaspora.">',
         '<meta name="description" content="Un projet d’espace numérique communautaire à Bédjondo, qui serait connecté par satellite et alimenté au solaire, financé avec la diaspora.">'),
        ("<p class=\"lede\">Une salle connectée par satellite, alimentée au solaire, ouverte aux élèves, aux enseignants, aux agents de santé, à la commune et aux porteurs de projets — financée par l&rsquo;association et sa diaspora, gérée par un comité local.</p>",
         "<p class=\"lede\">Une salle qui serait connectée par satellite, alimentée au solaire, ouverte aux élèves, aux enseignants, aux agents de santé, à la commune et aux porteurs de projets — financée par l&rsquo;association et sa diaspora, gérée par un comité local.</p>"),
        ("<p>Il s&rsquo;agit d&rsquo;une salle existante mise à disposition par la commune ou un établissement, équipée d&rsquo;une connexion satellitaire",
         "<p>Il s&rsquo;agirait d&rsquo;une salle existante, mise à disposition par la commune ou un établissement, équipée d&rsquo;une connexion satellitaire"),
        ("Un comité local &mdash; commune, école, centre de santé, jeunes formés &mdash; en assure l&rsquo;ouverture, l&rsquo;entretien et les règles d&rsquo;usage. "
         "L&rsquo;association finance l&rsquo;investissement avec sa diaspora&nbsp;; les recettes modestes (impressions, formations, accès payant pour les usages commerciaux) et une part de cotisations couvrent l&rsquo;abonnement et la maintenance.</p>",
         "Un comité local &mdash; commune, école, centre de santé, jeunes formés &mdash; en assurerait l&rsquo;ouverture, l&rsquo;entretien et les règles d&rsquo;usage. "
         "L&rsquo;association financerait l&rsquo;investissement avec sa diaspora&nbsp;; les recettes modestes (impressions, formations, accès payant pour les usages commerciaux) et une part de cotisations couvriraient l&rsquo;abonnement et la maintenance.</p>"),
    ],
    "engagements.html": [
        # 14.
        ("<p>C&rsquo;est le compte exact au 19 septembre 2026. Cette page",
         "<p>C&rsquo;est le compte exact au 19 septembre 2026. Ces engagements figurent dans des textes publiés les 16 et 17 septembre 2026, non encore signés par le bureau&nbsp;: "
         "ils engageront l&rsquo;association à la signature des lettres. Cette page"),
    ],
    "documents.html": [
        # 15. Le dossier de présentation (PDF de septembre 2026 : quatre pôles, dix-neuf thématiques)
        ("<p>Qui nous sommes, les quatre pôles et dix-huit thématiques, Bédjondo aujourd&rsquo;hui, les huit plaidoyers et leurs engagements, la bibliothèque, et quatre façons de contribuer.",
         "<p>Qui nous sommes, les quatre pôles et leurs thématiques (dix-neuf dans cette édition de septembre 2026&nbsp;; vingt depuis le 29 septembre), Bédjondo aujourd&rsquo;hui, "
         "les sept plaidoyers et la note à la commune, la bibliothèque, et quatre façons de contribuer."),
        ("<p>Le document fondateur qui définit l&rsquo;objet, l&rsquo;organisation et le fonctionnement d&rsquo;ADEB LONODJI.</p>",
         "<p>Le document fondateur qui définit l&rsquo;objet, l&rsquo;organisation et le fonctionnement d&rsquo;ADEB LONODJI. Les statuts de 1995 ne sont pas publiés à ce jour&nbsp;; "
         "des statuts révisés, s&rsquo;il y a lieu, seront adoptés par l&rsquo;assemblée générale, puis publiés ici.</p>"),
        ("<p>Le bilan des actions menées par les thématiques et cellules, partagé avec l&rsquo;ensemble des membres.</p>\n        </article>",
         "<p>Le bilan des actions menées par les thématiques et cellules, partagé avec l&rsquo;ensemble des membres.</p>\n        </article>\n"
         "        <article class=\"pole-card\">\n          <span class=\"pole-status pole-status--vacant\">En vérification</span>\n"
         "          <h3>Autorisation (arrêté ou récépissé)</h3>\n"
         "          <p>La pièce qui établit l&rsquo;autorisation de l&rsquo;association au titre de l&rsquo;ordonnance n<sup>o</sup>&nbsp;023/PR/2018&nbsp;: sa mise en conformité est en vérification "
         "(voir <a href=\"demarches.html\">Démarches</a>).</p>\n        </article>\n"
         "        <article class=\"pole-card\">\n          <span class=\"pole-status pole-status--vacant\">Projets</span>\n"
         "          <h3>Cinq politiques d&rsquo;intégrité</h3>\n"
         "          <p>Conflits d&rsquo;intérêts, fraude et corruption, données personnelles, achats et dépenses, exploitation et abus sexuels&nbsp;: projets du 23 septembre 2026, soumis au bureau exécutif, "
         "publiés ici une fois adoptés.</p>\n        </article>\n"
         "        <article class=\"pole-card\">\n          <span class=\"pole-status pole-status--vacant\">À venir</span>\n"
         "          <h3>Comptes annuels</h3>\n"
         "          <p>À partir du premier exercice qui suivra l&rsquo;ouverture du compte au nom de l&rsquo;association.</p>\n        </article>"),
        # 16.
        ("la menuiserie bois et la menuiserie métallique , y habiliter", "la menuiserie bois et la menuiserie métallique, y habiliter"),
    ],
    "agriculture-securite-alimentaire.html": [
        # 16.
        ("un miel d&rsquo;origine arboricole et non florale , l&rsquo;a", "un miel d&rsquo;origine arboricole et non florale, l&rsquo;a"),
    ],
}


# Revue des symboles et libellés (29 septembre 2026) : plus d'invitation à « cotiser » tant que la collecte est suspendue.
for _f, _paires in {
    "documents.html": [("Adh&eacute;rer et cotiser", "Adh&eacute;rer (d&eacute;claration d&rsquo;intention)")],
    "adherer.html": [("Adh&eacute;rer et cotiser", "Adh&eacute;rer (d&eacute;claration d&rsquo;intention)")],
    "soutenir.html": [("Adhérer et cotiser", "Adhérer (déclaration d’intention)")],
    "sitemap.html": [("Adhérer et cotiser", "Adhérer (déclaration d’intention)")],
}.items():
    CORRECTIONS.setdefault(_f, []).extend(_paires)

# Compteur d'abonnés : le tableau de bord publie les zéros tels quels ; plus de seuil annoncé ici.
CORRECTIONS.setdefault("actualites.html", []).append((
    "Le nombre d&rsquo;abonn&eacute;s s&rsquo;affichera ici &agrave; partir du dixi&egrave;me. Inscrivez-vous pour recevoir le prochain num&eacute;ro.",
    "Le nombre d&rsquo;abonn&eacute;s est publi&eacute;, m&ecirc;me &agrave; z&eacute;ro, sur le <a href=\"suivi.html\">tableau de bord</a>. Inscrivez-vous pour recevoir le prochain num&eacute;ro.",
))

# Programmes des bailleurs (relevé du 29 septembre 2026) : le PMCR est clos depuis le 30 avril 2026.
CORRECTIONS.setdefault("plaidoyers.html", []).append((
    "<dd>Ministère des Infrastructures · Délégation provinciale · PMCR (Banque mondiale) · Fonds d&rsquo;entretien routier · commune</dd>",
    "<dd>Ministère des Infrastructures · Délégation provinciale · PMCR (Banque mondiale ; clos le 30 avril 2026, successeur à identifier — <a href=\"https://lonodji.org/bailleurs#pmcr\">voir les programmes des bailleurs</a>) · Fonds d&rsquo;entretien routier · commune</dd>",
))
CORRECTIONS.setdefault("ong-partenaires.html", []).append((
    "Le <strong>PMCR</strong>, projet de mobilit&eacute; et de collectivit&eacute; rurale,",
    "Le <strong>PMCR</strong>, projet de mobilit&eacute; et de collectivit&eacute; rurale (clos le 30 avril 2026&nbsp;; <a href=\"https://lonodji.org/bailleurs\">voir les programmes des bailleurs, relev&eacute; du 29 septembre 2026</a>),",
))
