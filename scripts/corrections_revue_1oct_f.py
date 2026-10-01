# Relecture du 1er octobre 2026, lot F : Participer, Transparence, mentions légales, kit de mobilisation.
# Les chiffres de l'outil « Trouver ma thématique » sont recalculés à l'import (phrases_comptes) ; les liens des
# messages du kit sont écrits par kit_liens() (scripts/import-legacy.py).

_LIGNE = ('<tr><th scope="row"><a href="{href}">{nom}</a><span class="notice-page">{page}</span></th>'
          '<td>{quoi}</td><td>{pourquoi}</td><td>Pas encore fixée&nbsp;: vous pouvez demander à tout moment que ces données soient effacées</td></tr>')
_CINQ = "".join(_LIGNE.format(**l) for l in [
    dict(href="https://lonodji.org/bibliotheque#deposer", nom="Dépôt d&rsquo;un document", page="Bibliothèque",
         quoi="Titre, auteurs, année, type, langue, résumé, lien ou fichier, droits, choix de publication, nom, contact, message",
         pourquoi="Vérifier la référence et les droits, puis publier selon votre choix"),
    dict(href="https://lonodji.org/diaspora", nom="Répertoire des compétences", page="Diaspora",
         quoi="Nom, e-mail, téléphone, pays, ville, lien, métier, domaines, expérience, ce que vous proposez, thématique, langues, disponibilité, message, accord pour l&rsquo;annuaire",
         pourquoi="Vous proposer des missions et vous mettre en relation avec les thématiques&nbsp;; le site ne publie que des nombres"),
    dict(href="https://lonodji.org/langue", nom="Mot nangnda", page="Langue",
         quoi="Mot, catégorie, sens, exemple, traduction, enregistrement audio, variante, source, nom, contact, choix de publication",
         pourquoi="Vérifier la contribution et la publier dans le dictionnaire selon votre choix"),
    dict(href="https://lonodji.org/projets", nom="Proposition de projet", page="Plateforme de projets",
         quoi="Projet, localité, domaine, problème, solution, coût estimé, nom, qualité, contact, choix de publication",
         pourquoi="Instruire la proposition et vous répondre"),
    dict(href="https://lonodji.org/temoignages", nom="Témoignage «&nbsp;Racontez Bédjondo&nbsp;»", page="Témoignages",
         quoi="Type, titre, récit, photo, son ou vidéo, lieu, nom, qualité, contact, localité, choix de publication, personnes présentes, présence de mineurs",
         pourquoi="Vérifier le récit et le fichier, puis les publier après votre relecture"),
])

CORRECTIONS = {
    "mentions-legales.html": [
        # le tableau ne décrivait que quinze des vingt formulaires (public/__forms.html)
        ("pour pouvoir en rendre compte&nbsp;; si vous le demandez, votre identit&eacute; n&rsquo;est connue que de la personne qui instruit</td></tr></tbody>",
         "pour pouvoir en rendre compte&nbsp;; si vous le demandez, votre identit&eacute; n&rsquo;est connue que de la personne qui instruit</td></tr>" + _CINQ + "</tbody>"),
        # même circuit que /transparence : la plainte arrive à l'animation ; si elle vise l'animateur, au président et au secrétaire général
        ('mécanisme de plainte</a> n&rsquo;est lu que par la personne chargée de l&rsquo;instruire.',
         'mécanisme de plainte</a> arrive à l&rsquo;animation, qui le transmet à la personne chargée de l&rsquo;instruire&nbsp;; s&rsquo;il concerne l&rsquo;animateur, il va directement au président et au secrétaire général.'),
        ("Pour la lettre d&rsquo;information, un message &laquo;&nbsp;désinscription&nbsp;&raquo; suffit.",
         "Pour la lettre d&rsquo;information, un message &laquo;&nbsp;désinscription&nbsp;&raquo; par le formulaire de contact ou par WhatsApp suffit."),
        # sur la page des mentions légales, le bloc renvoyait… aux mentions légales
        ('publiés en ligne. Voir nos <a href="documents.html">documents</a> et nos <a href="mentions-legales.html">mentions légales</a>.',
         'publiés en ligne. Voir nos <a href="documents.html">documents</a>.'),
    ],
    "contact.html": [
        # décision 2026-18 : l'association est ouverte à tous les habitants, sans distinction d'origine
        ("Non. ADEB LONODJI s&rsquo;adresse à toutes les filles et tous les fils du peuple bedjond",
         "Non. ADEB LONODJI est ouverte à tous les habitants de Bédjondo, sans distinction d&rsquo;origine, et à toutes les filles et tous les fils du peuple bedjond"),
        ('Utilisez le <a href="#proposer-article">formulaire dédié</a> ci-dessus', 'Utilisez le <a href="#proposer-article">formulaire dédié</a> ci-dessous'),
        ("Utilisez le formulaire ci-contre, ou transmettez vos coordonnées à un coordonnateur de thématique une fois les postes pourvus.",
         "Utilisez le formulaire de contact, ou transmettez vos coordonnées au coordonnateur de la thématique qui vous intéresse."),
        ('L&rsquo;article est relu par l&rsquo;animation avant publication dans les <a href="actualites.html">Actualités</a>.',
         'L&rsquo;article est relu par l&rsquo;animation avant publication dans le <a href="actualites.html">Journal</a>.'),
        # la page dit plus haut : « Toute personne peut proposer un article »
        ("Ouvert à tous les membres et coordonnateurs de thématique.", "Ouvert à toutes et à tous, membres ou non."),
    ],
    "adherer.html": [
        ("L&rsquo;espèce d&rsquo;abord, le mobile ensuite", "Les espèces d&rsquo;abord, le mobile ensuite"),
        ("la notice de numérotation et de tenue du registre pour le trésorier", "la notice de numérotation et de tenue du registre pour la trésorière"),
    ],
    "soutenir.html": [
        ("Projet annonc&eacute;, Android d&rsquo;abord.", "Version d&rsquo;essai Android en ligne depuis le 28 septembre 2026."),
        # trois conditions (décision 2026-16), pas deux
        (" et qu&rsquo;aucun compte n&rsquo;est ouvert à son nom, nous ne recevons ni cotisation ni don",
         ", que la grille des cotisations n&rsquo;est pas votée et qu&rsquo;aucun compte n&rsquo;est ouvert à son nom, nous ne recevons ni cotisation ni don"),
    ],
    "espace-numerique.html": [
        ("Projet annonc&eacute;, Android d&rsquo;abord.", "Version d&rsquo;essai Android en ligne depuis le 28 septembre 2026."),
    ],
    "kit-mobilisation.html": [
        # messages à copier sur WhatsApp et les réseaux : mêmes faits que les dossiers à jour
        ("8 plaidoyers pour Bédjondo.", "8 dossiers de plaidoyer pour Bédjondo."),
        ("Bédjondo, plus de 15&nbsp;000 habitants, vit dans le noir.", "Bédjondo, sans doute plus de 15&nbsp;000 habitants, vit dans le noir."),
        ("Un chef-lieu de département sans réseau d&rsquo;eau potable. ADEB LONODJI demande l&rsquo;inventaire des points d&rsquo;eau, une mini-adduction solaire et des comités de gestion, et s&rsquo;engage à réparer les forages en panne avec la diaspora.",
         "Un chef-lieu dont le château d&rsquo;eau ne dessert qu&rsquo;un village et s&rsquo;arrête faute de carburant. ADEB LONODJI demande de solariser le pompage, d&rsquo;étendre le réseau à toute la ville et de créer des comités de gestion."),
        ("Au Tchad, près d&rsquo;une femme sur cent meurt en donnant la vie.", "Au Tchad, près d&rsquo;une naissance sur cent coûte la vie à la mère."),
        ("À Bédjondo, la maternité accouche à la lampe", "À Bédjondo, on accouche à la lampe"),
        ("la route de Koumra impraticable en saison des pluies. ADEB LONODJI demande que le PMCR passe par nos cantons.",
         "une ville sans rues ni caniveaux. ADEB LONODJI demande un premier plan de voirie, les deux ponts et des pistes pour nos cantons."),
        ("73 élèves par maître, des classes de 83, des maîtres communautaires",
         "Au Tchad, 73 élèves par maître et des classes de 83&nbsp;; à Bédjondo, des maîtres communautaires"),
        ("chaque signalement est remis à la commune et joint à nos plaidoyers", "chaque signalement sera remis à la commune et joint à nos plaidoyers"),
    ],
    "redevabilite.html": [
        ("r&eacute;unissent dix-neuf th&eacute;matiques (vingt depuis le 29 septembre 2026)",
         "r&eacute;unissent dix-neuf th&eacute;matiques (vingt le 29 septembre 2026, vingt et une depuis le 30 septembre)"),
        ("l&rsquo;association compte <strong>dix-neuf</strong> th&eacute;matiques (vingt depuis le 29 septembre 2026)",
         "l&rsquo;association compte <strong>dix-neuf</strong> th&eacute;matiques (vingt le 29 septembre 2026, vingt et une depuis le 30 septembre)"),
        # aucun moyen de paiement n'est publié : la collecte est suspendue
        ('en dehors des moyens de paiement publiés sur la page <a href="soutenir.html">Soutenir',
         ': la collecte est suspendue depuis le 23 septembre 2026, et seuls vaudront, à sa réouverture, les moyens de paiement publiés sur la page <a href="soutenir.html">Soutenir'),
        ("Il est instruit avec la personne visée, qui est entendue.", "Il est instruit en entendant la personne visée."),
        ("qui l&rsquo;instruisent sans lui. Si votre signalement concerne l&rsquo;animateur,", "qui l&rsquo;instruisent sans lui&nbsp;;"),
        ("un nom voisin, mais un d&eacute;partement distinct, dans une autre province, de <strong>Barh Sara</strong>, qui se trouve dans le Mandoul.",
         "un nom voisin de <strong>Barh Sara</strong>, mais un d&eacute;partement distinct, situ&eacute; dans une autre province&nbsp;: Barh Sara, lui, est dans le Mandoul."),
        # l'entrée du 21/09 laissait ouvert un point que l'entrée du 23/09 tranche : renvoi daté, sans réécrire
        ("Ce qui reste ouvert&nbsp;:</strong> GADM classe Bangoul comme canton du Mandoul Occidental et B&eacute;ti comme unit&eacute; du Logone Oriental.",
         "Ce qui reste ouvert&nbsp;:</strong> GADM classe Bangoul comme canton du Mandoul Occidental et B&eacute;ti comme unit&eacute; du Logone Oriental. "
         "<em>Précision du 1er octobre 2026&nbsp;: GADM classe en fait Bangoul comme sous-préfecture (voir l&rsquo;entrée du 23 septembre).</em>"),
    ],
}
