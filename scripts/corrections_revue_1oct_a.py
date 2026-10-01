# Relecture du 1er octobre 2026, lot A : rubrique Nos actions (/programmes et ses dossiers).
CORRECTIONS = {
    "poles.html": [
        # état au 30/09 : 16 coordinations pourvues sur 21
        ("le nombre de th&eacute;matiques qui ont un coordonnateur&nbsp;: quinze sur vingt au 29 septembre 2026.",
         "le nombre de th&eacute;matiques qui ont un coordonnateur&nbsp;: seize sur vingt et une au 30 septembre 2026."),
        # la table objectif par objectif est sur une page à part (bloc suivant)
        ("Les correspondances retenues sont r&eacute;capitul&eacute;es <a href=\"#odd-index\">en bas de page</a>, objectif par objectif.",
         "Les correspondances retenues sont r&eacute;capitul&eacute;es, objectif par objectif, sur <a href=\"odd.html\">une page &agrave; part</a>."),
        # thématique 11 : énumération cassée par le point-virgule
        ("dont les risques pour la santé sont sérieux&nbsp;; c&rsquo;est une préoccupation récurrente des familles, et l&rsquo;hygiène",
         "dont les risques pour la santé sont sérieux (une préoccupation récurrente des familles), et l&rsquo;hygiène"),
        # les ODD sont une résolution, pas un traité
        ("Le Tchad en est signataire.", "Le Tchad les a adoptés avec les autres États membres."),
        # thématique 20 : même libellé d'ODD 11 que partout ailleurs
        ('<span class="odd-num">11</span><span class="odd-name">Villes</span>',
         '<span class="odd-num">11</span><span class="odd-name">Villes durables</span>'),
    ],
    "agriculture-securite-alimentaire.html": [
        # thématique 04 pourvue depuis le 28/09
        ("Producteurs, éleveurs, transformateurs&nbsp;: faites-vous connaître, ou portez cette thématique comme coordonnateur.",
         "Producteurs, éleveurs, transformateurs&nbsp;: faites-vous connaître, ou rejoignez cette thématique, coordonnée par Olivier Allaramadji Nomaye."),
        # le PRAPS-2 ne couvre pas le Mandoul (même page)
        ("ProPAD, ProAGRI, PRAPS-2, ONDR, ITRAD, coopération suisse&nbsp;: qui intervient déjà dans le Mandoul.",
         "ProPAD, ProAGRI, ONDR, ITRAD, coopération suisse&nbsp;: qui intervient déjà dans le Mandoul &mdash; et le PRAPS-2, qui l&rsquo;exclut."),
        # sources des 3 et 5 septembre : pas de date précise établie
        ("le 5 septembre 2026, un affrontement entre habitants des cantons de Bangoul et de Békamba",
         "en septembre 2026, un affrontement entre habitants des cantons de Bangoul et de Békamba"),
        # différend de limite entre cantons, pas un conflit agriculteurs-éleveurs (cf. agriculteurs-eleveurs.html)
        ("Les affrontements de septembre 2026 entre Bangoul et Békamba ne sont pas un accident&nbsp;: ils sont la conséquence prévisible d&rsquo;un espace partagé sans règles écrites.",
         "Les affrontements de septembre 2026 entre Bangoul et Békamba, nés d&rsquo;une limite jamais tranchée entre deux cantons, montrent ce que coûte un espace partagé sans règles écrites."),
        ("régit un ensemble de filières", "couvre un ensemble de filières"),
        ("Quatre mesures, dans l&rsquo;ordre.", "Quatre d&rsquo;entre elles, dans l&rsquo;ordre."),
        ("Nous demandons un quatrième site dans le Mandoul Occidental",
         "Nous demandons un quatrième village climato-intelligent (après Maibessé, Amsinéné et Bédogo 2) dans le Mandoul Occidental"),
    ],
    "agriculteurs-eleveurs.html": [
        # Lac-Iro est un département du Moyen-Chari, pas une localité ; phrase sans verbe
        ("Deux localités du département voisin du nôtre.",
         "Deux sites du Moyen-Chari, province voisine de la nôtre."),
        ("briefing n°199", "briefing n&deg;&nbsp;199"),
    ],
    "environnement.html": [
        # contredit « aucune de ces filières n'est ouverte, aucune n'a de budget, aucune n'a de responsable »
        ("Engag&eacute;</span>\n          <h3>Bois, arbres et mat&eacute;riaux locaux",
         "Piste</span>\n          <h3>Bois, arbres et mat&eacute;riaux locaux"),
        ("Un ma&icirc;tre-pompier form&eacute; &agrave; l&rsquo;entretien des forages solaires",
         "Un artisan réparateur formé à l&rsquo;entretien des pompes et des forages solaires"),
        # meta description complète (≤ 160 caractères)
        ("et la grille de durabilité en cinq questions appliquée à chacun de ses projets.",
         "et une grille de durabilité en cinq questions."),
    ],
    "solidarite-inclusion.html": [
        # « l' » = le troisième programme (masculin)
        ("Nous l&rsquo;avons retirée de la liste.", "Nous l&rsquo;avons retiré de la liste."),
        # « dix ans » n'est appuyé par aucune source (étude 2020–2023)
        ("qui ont dix ans d&rsquo;avance sur nous", "qui ont de l&rsquo;avance sur nous"),
    ],
    "engagements.html": [
        ("qui ont dix ans d&rsquo;avance sur nous", "qui ont de l&rsquo;avance sur nous"),
    ],
    "veuves.html": [
        # la ligne annonce un exemple kenyan mais donne un chiffre continental
        ('<th scope="row">Exemple kenyan, peuple luhya</th>',
         '<th scope="row">Synthèse africaine, avec l&rsquo;exemple luhya du Kenya</th>'),
        # le texte cité en regard est un projet non adopté
        ("Une pension de veuve r&eacute;gl&eacute;e par un texte g&eacute;n&eacute;ral &mdash; <em>et non par la loi qui manque encore</em>",
         "Une pension de veuve, <em>qu&rsquo;aucun texte ne règle encore</em>"),
        ("N&deg;003/PR/2025", "n&deg;&nbsp;003/PR/2025"),
        ("que nous ne sommes pas comp&eacute;tents &agrave; donner", "que nous ne sommes pas comp&eacute;tents pour donner"),
    ],
    "odd.html": [
        ("th&eacute;matiques d'ADEB LONODJI qui les touchent.", "th&eacute;matiques d&rsquo;ADEB LONODJI qui les touchent."),
        ('<a href="poles.html">P&ocirc;les et th&eacute;matiques</a>', '<a href="poles.html">Nos actions</a>'),
    ],
}
