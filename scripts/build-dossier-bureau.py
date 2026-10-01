#!/usr/bin/env python3
"""Deux documents de travail pour le bureau exécutif, qui appliquent les décisions d'organisation du
1er octobre 2026 (lib/organisation.ts) :

  1. Élire les vice-présidences des pôles sans titulaire (décision 5) : projet de procédure, avec les
     points que le bureau doit trancher, un calendrier en jours relatifs, et quatre annexes prêtes
     (appel à candidatures, fiche de candidature, bulletin, procès-verbal).
  2. Les plans annuels des thématiques prioritaires (décision 1) : un plan par priorité, prérempli
     avec ce que le site a publié — titulaire, pôle, plaidoyers et leurs destinataires, engagements
     pris par l'association dans chaque plaidoyer, chantier de la commune (décision 8), ce qui reste à
     documenter — et des cases vides pour l'échéance, le responsable, les moyens et l'indicateur.

Rien n'y est inventé : les choix proposés sont présentés comme des propositions, les dates sont en
jours relatifs (J, J+14…) ou laissées en blanc. Les documents ne sont pas publiés : ils vont dans
content/brouillons/bureau/ (hors dépôt). Une fois la procédure adoptée, elle se publie sur le site.

    npm run build && python3 scripts/build-dossier-bureau.py
"""
from __future__ import annotations

import base64
import html as h
import importlib.util
import json
import re
from pathlib import Path

from org import TELEPHONE  # seule source : lib/contact.ts

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "content" / "brouillons" / "bureau"
CONTENT = ROOT / "content"
SITE = "lonodji.org"
LOGO = ROOT / "public" / "odeb" / "identite" / "adeb-lonodji-logo-horizontal-clair-superposable.png"
PREPARE = "1er octobre 2026"


def charger(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(mod)
    return mod


def esc(t: str) -> str:
    return h.escape(t, quote=False)


def texte(html: str) -> str:
    return re.sub(r"\s+", " ", h.unescape(re.sub(r"<[^>]+>", "", html))).strip()


# ---------------------------------------------------------------- données publiées

def prioritaires() -> list[dict]:
    """PRIORITAIRES de lib/organisation.ts : id, plaidoyers (label, href), chantiers de la commune."""
    src = (ROOT / "lib" / "organisation.ts").read_text("utf8")
    bloc = src.split("export const PRIORITAIRES", 1)[1].split("= [", 1)[1].split("\n];", 1)[0]
    out = []
    for morceau in re.split(r"\n  \{ id: ", bloc)[1:]:
        ident = re.match(r'"([^"]+)"', morceau).group(1)
        pl = morceau.split("plaidoyers:", 1)[1].split("commune:", 1)[0]
        co = morceau.split("commune:", 1)[1]
        paires = lambda s: [{"label": a, "href": b} for a, b in re.findall(r'label: "([^"]+)", href: "([^"]+)"', s)]
        out.append({"id": ident, "plaidoyers": paires(pl), "commune": paires(co)})
    return out


def recommandation(rid: str) -> dict:
    src = (ROOT / "lib" / "organisation.ts").read_text("utf8")
    m = re.search(rf'\{{ id: "{rid}", titre: "([^"]+)",\s*texte: "([^"]+)",\s*change: "([^"]+)"', src)
    return {"titre": m.group(1), "texte": m.group(2), "change": m.group(3)}


def section(article: dict, motif: str) -> str:
    """HTML de la section d'un article dont le titre h2 contient `motif` (jusqu'au h2 suivant)."""
    html = "".join(s["html"] for s in article["sections"])
    for m in re.finditer(r"<h2[^>]*>(.*?)</h2>", html, re.S):
        if motif in texte(m.group(1)):
            suite = html[m.end():]
            fin = re.search(r"<h2", suite)
            return suite[: fin.start()] if fin else suite
    return ""


def engagements(article: dict) -> list[str]:
    s = section(article, "s’engage à")
    items = [texte(x) for x in re.findall(r"<li[^>]*>(.*?)</li>", s, re.S)]
    if not items:  # note à la commune : paragraphes
        items = [texte(x) for x in re.findall(r"<p[^>]*>(.*?)</p>", s, re.S) if len(texte(x)) > 40]
    return [re.sub(r"^à ", "", i).rstrip(" ;.") for i in items]


def a_documenter(article: dict) -> str:
    s = section(article, "Ce que nous ne savons pas")
    p = re.findall(r"<p[^>]*>(.*?)</p>", s, re.S)
    return texte(p[0]) if p else ""


# ---------------------------------------------------------------- mise en page

CSS = """
@page{size:A4;margin:16mm 17mm 18mm}
*{box-sizing:border-box}
html,body{margin:0;color:#10241e;font-family:'DM Sans',system-ui,sans-serif;font-size:9.8pt;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.doc{break-after:page}
.doc:last-child{break-after:auto}
.tete{display:flex;justify-content:space-between;align-items:center;gap:8mm;padding-bottom:3mm;border-bottom:1px solid #d5ddd6;margin-bottom:6mm}
.tete img{height:13mm}
.tete .meta{text-align:right;font-size:7.6pt;color:#526159;line-height:1.5}
.projet{display:inline-block;font-size:7.4pt;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#7a4b00;background:#fdf1d6;border:1px solid #f0d48a;border-radius:3mm;padding:1mm 3mm;margin-bottom:3mm}
h1{font-family:'Playfair Display',Georgia,serif;font-weight:500;font-size:22pt;line-height:1.1;margin:0 0 3mm}
h1 small{display:block;font-family:'DM Sans',sans-serif;font-size:10pt;color:#526159;margin-top:2mm;font-weight:400}
h2{font-size:12pt;margin:6mm 0 2.5mm;color:#173b2d;break-after:avoid}
h3{font-size:10pt;margin:4mm 0 1.5mm;break-after:avoid}
p{margin:0 0 2.5mm}
ul,ol{margin:0 0 3mm;padding-left:5mm}
li{margin:0 0 1.2mm}
.cite{border-left:2px solid #b6cf45;background:#f7f9f4;padding:2.5mm 4mm;margin:0 0 3mm;font-size:9.4pt}
table{width:100%;border-collapse:collapse;margin:0 0 4mm;font-size:8.8pt;break-inside:auto}
th{text-align:left;font-size:7.2pt;letter-spacing:.1em;text-transform:uppercase;color:#173b2d;border-bottom:1.5px solid #173b2d;padding:1.8mm 1.5mm;vertical-align:bottom}
td{border-bottom:1px solid #d5ddd6;padding:2.2mm 1.5mm;vertical-align:top}
tr{break-inside:avoid}
td.blanc{color:#9aa59f;white-space:nowrap}
.choix td:first-child{font-weight:700;width:30mm}
.prop{background:#eef5dd}
.case{display:inline-block;width:3.4mm;height:3.4mm;border:1px solid #10241e;border-radius:.6mm;vertical-align:-.6mm;margin-right:1.5mm}
.ligne{border-bottom:1px solid #9aa59f;height:7mm}
.champ{margin:0 0 3.5mm}
.champ b{display:block;font-size:8pt;letter-spacing:.06em;text-transform:uppercase;color:#526159;margin-bottom:1mm}
.zone{border:1px solid #9aa59f;border-radius:2mm;height:30mm}
.zone.petite{height:16mm}
.sign{display:grid;grid-template-columns:repeat(3,1fr);gap:8mm;margin-top:8mm;text-align:center;font-size:8.8pt}
.sign div{border-top:1px solid #9aa59f;padding-top:2mm;margin-top:14mm}
.note{font-size:8pt;color:#526159}
.cartouche{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm;margin:0 0 4mm}
.cartouche div{border:1px solid #d5ddd6;border-radius:2mm;padding:2mm 3mm;font-size:8.6pt}
.cartouche b{display:block;font-size:6.8pt;letter-spacing:.12em;text-transform:uppercase;color:#526159;margin-bottom:.8mm}
.etapes{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm;margin-bottom:3mm}
.etapes div{border:1px solid #9aa59f;border-radius:2mm;padding:2mm 3mm;height:24mm;font-size:8pt}
.etapes b{display:block;font-size:7pt;letter-spacing:.1em;text-transform:uppercase;color:#173b2d}
.saut{break-before:page}
.serre{font-size:9pt;line-height:1.42}
.serre li{margin-bottom:.8mm}
.serre h2{margin-top:4mm}
.serre td{padding:1.5mm}
"""


def entete(logo: str, droite: str) -> str:
    return f'<div class="tete"><img src="{logo}" alt="ADEB LONODJI"><div class="meta">{droite}</div></div>'


# ---------------------------------------------------------------- 1. élection

def election(idx: dict, logo: str, bureau: list[dict]) -> tuple[str, str]:
    poles = idx["structure"]["poles"]
    vacants = [p for p in poles if p.get("direction") and not p["direction"].get("filled")]
    pourvus = [p for p in poles if p.get("direction") and p["direction"].get("filled")]
    r5, r6 = recommandation("r5"), recommandation("r6")
    # collège proposé : bureau exécutif + coordonnateurs titulaires des thématiques et des cellules (personnes distinctes)
    noms = {b["name"] for b in bureau}
    coord = set()
    for p in poles + [idx["structure"]["cellules"]]:
        for t in p["items"]:
            if t["filled"] and t["coordinator"]:
                coord.add(re.sub(r",.*$", "", t["coordinator"]).strip())
    for p in pourvus:
        coord.add(p["direction"]["name"])
    college = len(noms | coord)
    compte: dict[str, int] = {}
    for p in poles + [idx["structure"]["cellules"]]:
        for t in p["items"]:
            if t["filled"] and t["coordinator"]:
                n = re.sub(r",.*$", "", t["coordinator"]).strip()
                compte[n] = compte.get(n, 0) + 1
    cumuls = sorted(n for n, k in compte.items() if k > 1)
    cumul_note = (f"Coordonnent aujourd’hui plus d’une thématique : {', '.join(cumuls)} ; le cas est à régler dans le cadre de la décision 6."
                  if cumuls else "D’après la page Nos actions, personne ne coordonne aujourd’hui plus d’une thématique : la règle ne joue que pour l’avenir.")
    lignes_vacants = "".join(
        f"<tr><td>Pôle {p['roman']}</td><td>{esc(p['name'])}</td><td>{', '.join(esc(t['number'] + '. ' + t['name']) for t in p['items'])}</td><td>{SITE}/participer?direction={p['roman']}&amp;coordo=1</td></tr>"
        for p in vacants)
    tete = entete(logo, f"Bureau exécutif · document de travail<br>préparé le {PREPARE}")
    jalons = [
        ("J", "Le bureau adopte la procédure et fixe les dates ci-dessous."),
        ("J + 1", "L’appel à candidatures est publié : site, page Facebook, compte X, groupes WhatsApp (annexe A)."),
        ("J + 14", "Clôture des candidatures (formulaire en ligne ou fiche papier, annexe B)."),
        ("J + 16", "Le bureau vérifie les candidatures et publie la liste des candidats, avec la présentation d’une page de chacun."),
        ("J + 21", "Réunion du collège électoral : vote, dépouillement, procès-verbal (annexes C et D)."),
        ("J + 22", "Résultats publiés : registre des décisions, page Nos actions, fiches de mission."),
        ("J + 29", "Fin du délai de réclamation, adressée au bureau ; l’élection devient définitive."),
    ]
    cal = "".join(f'<tr><td><b>{j}</b></td><td>{esc(t)}</td><td class="blanc">…… / …… / 20……</td></tr>' for j, t in jalons)
    choix = [
        ("Qui peut se présenter",
         "Toute personne membre de l’association, ou qui a déposé sa déclaration d’adhésion, au Tchad comme dans la diaspora. Une personne ne se présente qu’à une seule vice-présidence.",
         "Les statuts de 1995 ne sont pas publiés : le bureau vérifie qu’ils ne posent pas d’autre condition."),
        ("Le cumul",
         f"Décision 6 : « {r6['texte']} » Une personne élue qui coordonne déjà une thématique la garde jusqu’à ce que le bureau ait revu les cumuls avec elle.",
         cumul_note),
        ("Qui vote",
         f"Le collège des responsables : les membres du bureau exécutif et les coordonnateurs titulaires des thématiques et des cellules, soit {college} personnes distinctes à ce jour. La prochaine assemblée générale confirme les élus.",
         "Autres options : le bureau exécutif seul (plus rapide, moins représentatif) ; l’assemblée des membres (plus légitime, mais la liste des membres et la grille de cotisation ne sont pas encore arrêtées)."),
        ("Le quorum",
         "La moitié au moins du collège, présente ou à distance. Sans quorum, une seconde réunion se tient sept jours plus tard, sans condition de quorum.",
         ""),
        ("Le vote",
         "En réunion, sur place et à distance (appel vidéo), à main levée ; au scrutin secret si un membre du collège le demande. Le vote secret à distance se fait par message individuel adressé aux deux scrutateurs, qui ne communiquent que le décompte.",
         "Les scrutateurs ne sont pas candidats ; le secrétaire général tient le procès-verbal (décision 4)."),
        ("La majorité",
         "Majorité absolue des suffrages exprimés au premier tour ; majorité relative au second. Candidat unique : vote pour ou contre, majorité absolue. Sans candidat, l’appel est rouvert pour quatorze jours.",
         ""),
        ("Le mandat",
         "Jusqu’à la prochaine assemblée générale ordinaire, qui confirme l’élu ou organise une nouvelle élection. La durée définitive relève des statuts.",
         "Pas de durée fixée ici : elle dépend des statuts et de l’assemblée."),
    ]
    tab_choix = "".join(f'<tr><td>{esc(q)}</td><td class="prop">{esc(p)}</td><td>{esc(n)}</td></tr>' for q, p, n in choix)
    titulaires = "; ".join(f"pôle {p['roman']} : {esc(p['direction']['name'])}" for p in pourvus)

    doc = f"""<section class="doc">{tete}
<span class="projet">Projet · non adopté · à délibérer par le bureau exécutif</span>
<h1>Élire les vice-présidences des pôles {', '.join(p['roman'] for p in vacants[:-1])} et {vacants[-1]['roman']}<small>Projet de procédure, en application de la décision 5 du {PREPARE}</small></h1>
<h2>1. Ce que le bureau a décidé</h2>
<p class="cite">« {esc(r5['texte'])} » — {esc(r5['change'])}</p>
<p>Les vice-présidences déjà tenues restent en place ({titulaires}). Trois sont à pourvoir :</p>
<table><thead><tr><th>Pôle</th><th>Nom</th><th>Thématiques</th><th>Candidater</th></tr></thead><tbody>{lignes_vacants}</tbody></table>
<h2>2. Ce que fait une vice-présidence</h2>
<p>D’après la fiche de mission publiée, le vice-président délégué ou la vice-présidente déléguée réunit chaque trimestre les coordonnateurs et coordonnatrices des thématiques de son pôle ; tient le plan d’action et le calendrier du pôle ; suit les plaidoyers et les projets qui en relèvent ; rend compte au bureau et à l’assemblée. La fonction est bénévole et élue.</p>
<h2>3. Sept points à trancher</h2>
<p>Pour chaque point, une proposition (en vert) et ce qu’il faut savoir. Le bureau adopte, modifie ou écarte chaque proposition.</p>
<table class="choix"><thead><tr><th>Point</th><th>Proposition</th><th>À savoir</th></tr></thead><tbody>{tab_choix}</tbody></table>
<h2>4. Le calendrier</h2>
<p>En jours à compter de l’adoption ; le bureau inscrit les dates.</p>
<table><thead><tr><th>Quand</th><th>Quoi</th><th>Date</th></tr></thead><tbody>{cal}</tbody></table>
<h2>5. Qui organise</h2>
<ul><li>Le président de l’association préside la réunion de vote ; s’il est candidat, la vice-présidente de l’association le remplace.</li>
<li>Le bureau désigne deux scrutateurs parmi les membres du collège qui ne sont pas candidats.</li>
<li>Le secrétaire général tient le procès-verbal et la liste d’émargement (décision 4).</li>
<li>Les candidatures en ligne arrivent par le formulaire de la page Participer ; aucune donnée personnelle n’est publiée sans l’accord du candidat.</li></ul>
<h2>6. Ce qui est publié</h2>
<p>La liste des candidats (nom, pôle, présentation d’une page, avec leur accord), puis les résultats : nombre de votants, suffrages exprimés, voix par candidat, élu. Les résultats entrent dans le registre public des décisions, sur la page Nos actions et dans le magazine suivant. Le procès-verbal signé est conservé par le secrétariat général.</p>
<p class="note">Sources : décisions d’organisation du {PREPARE} ({SITE}/association/propositions-organisation) ; fiches de mission ({SITE}/programmes/fiches-de-mission) ; registre des décisions ({SITE}/transparence/decisions), dont la décision 2026-16 sur la collecte et la grille de cotisation. Le décompte du collège est fait d’après la page Nos actions au {PREPARE}.</p>
</section>"""

    # annexes
    appel_txt = []
    for p in vacants:
        appel_txt.append(f"Pôle {p['roman']} — {p['name']} : {SITE}/participer?direction={p['roman']}&coordo=1")
    annexe_a = f"""<section class="doc">{tete}
<span class="projet">Annexe A · à publier le jour J + 1</span>
<h1>Appel à candidatures<small>Vice-présidences des pôles {', '.join(p['roman'] for p in vacants)}</small></h1>
<p>ADEB LONODJI élit les vice-présidents délégués ou vice-présidentes déléguées de trois de ses cinq pôles. Chacun réunit chaque trimestre les coordonnateurs de son pôle, tient son plan d’action et son calendrier, suit ses plaidoyers et ses projets, et rend compte au bureau et à l’assemblée. Fonction bénévole et élue, ouverte au Tchad comme dans la diaspora ; les candidatures de femmes sont particulièrement attendues.</p>
<ul>{''.join(f'<li><b>{esc(x.split(" : ")[0])}</b> : {esc(x.split(" : ")[1])}</li>' for x in appel_txt)}</ul>
<p>Candidatures jusqu’au …… / …… / 20…… : par le formulaire en ligne (le lien ci-dessus le remplit pour le pôle choisi), par la fiche papier, ou par WhatsApp au {esc(TELEPHONE)}. Liste des candidats publiée le …… / …… / 20…… ; vote le …… / …… / 20…….</p>
<p>Les fiches de mission : {SITE}/programmes/fiches-de-mission</p>
<h2>Version WhatsApp</h2>
<p class="cite">ADEB LONODJI élit les vice-présidences de trois pôles : {'; '.join(f"pôle {p['roman']}, {p['name']}" for p in vacants)}. Bénévole, au Tchad ou dans la diaspora. Candidatures jusqu’au …… : {SITE}/participer#postes-ouverts</p>
</section>"""

    def champ(l: str, zone: str = "ligne") -> str:
        return f'<div class="champ"><b>{esc(l)}</b><div class="{zone}"></div></div>'
    annexe_b = f"""<section class="doc">{tete}
<span class="projet">Annexe B · fiche de candidature</span>
<h1>Candidature à une vice-présidence de pôle</h1>
<p>Pôle choisi (une seule case) : {''.join(f'&nbsp;&nbsp;<span class="case"></span>Pôle {p["roman"]} — {esc(p["name"])}' for p in vacants)}</p>
{champ("Nom et prénoms")}{champ("Lieu de résidence (ville, pays)")}{champ("Téléphone ou WhatsApp, e-mail (non publiés)")}
{champ("Lien avec Bédjondo et avec l’association (membre depuis, déclaration d’adhésion)")}
{champ("Ce que vous voulez faire pour le pôle dans l’année", "zone")}
{champ("Expérience utile (associative, professionnelle)", "zone petite")}
{champ("Disponibilité (heures par mois, réunions trimestrielles)")}
<p><span class="case"></span>Je fais déjà partie d’une coordination : laquelle ? ………………………………………</p>
<p><span class="case"></span>J’accepte que mon nom, mon pôle et ma présentation soient publiés sur {SITE} pendant l’élection.</p>
<div class="sign"><div>Date</div><div>Signature</div><div>Reçu par (secrétariat général)</div></div>
</section>"""

    def bulletin(p: dict) -> str:
        return f"""<div style="border:1px dashed #9aa59f;border-radius:2mm;padding:4mm;margin-bottom:5mm;break-inside:avoid">
<b>Bulletin de vote · vice-présidence du pôle {p['roman']} — {esc(p['name'])}</b>
<p class="note">Cocher une seule case. Candidat unique : cocher « pour » ou « contre ».</p>
<p><span class="case"></span>………………………………………………… &nbsp;&nbsp; <span class="case"></span>………………………………………………… &nbsp;&nbsp; <span class="case"></span>…………………………………………………</p>
<p><span class="case"></span>Pour &nbsp;&nbsp; <span class="case"></span>Contre &nbsp;&nbsp; <span class="case"></span>Blanc</p></div>"""
    annexe_c = f"""<section class="doc">{tete}
<span class="projet">Annexe C · bulletins (à découper, ou à recopier dans un message aux scrutateurs)</span>
<h1>Bulletins de vote</h1>{''.join(bulletin(p) for p in vacants)}
</section>"""
    pv_lignes = "".join(f"<tr><td>Pôle {p['roman']}</td><td class='blanc'></td><td class='blanc'></td><td class='blanc'></td><td class='blanc'></td><td class='blanc'></td></tr>" for p in vacants)
    annexe_d = f"""<section class="doc">{tete}
<span class="projet">Annexe D · procès-verbal</span>
<h1>Procès-verbal de l’élection des vice-présidences</h1>
<p>Le …… / …… / 20……, à …… h ……, à …………………… et à distance, le collège électoral d’ADEB LONODJI s’est réuni sous la présidence de ……………………………………, conformément à la procédure adoptée par le bureau exécutif le …… / …… / 20…….</p>
<p>Membres du collège : …… ; présents ou à distance : …… (liste d’émargement jointe). Quorum : <span class="case"></span>atteint <span class="case"></span>non atteint. Scrutateurs : …………………………………… et ……………………………………. Mode de vote : <span class="case"></span>main levée <span class="case"></span>scrutin secret.</p>
<table><thead><tr><th>Pôle</th><th>Candidats et voix</th><th>Votants</th><th>Exprimés</th><th>Blancs</th><th>Élu(e)</th></tr></thead><tbody>{pv_lignes}</tbody></table>
<h2>Observations et réclamations</h2><div class="zone"></div>
<div class="sign"><div>Le président de séance</div><div>Les scrutateurs</div><div>Le secrétaire général</div></div>
</section>"""
    liste = "; ".join(f"pôle {p['roman']}, {p['name']}" for p in vacants)
    note = "\n".join(["# Appel à candidatures — vice-présidences (texte WhatsApp)", "",
                      f"ADEB LONODJI élit les vice-présidences de trois pôles : {liste}. Bénévole, au Tchad ou dans la diaspora. Candidatures jusqu’au …… : https://{SITE}/participer#postes-ouverts", ""]
                     + [f"- {x}" for x in appel_txt])
    return doc + annexe_a + annexe_b + annexe_c + annexe_d, note


# ---------------------------------------------------------------- 2. plans annuels

def plans(idx: dict, logo: str) -> str:
    r1 = recommandation("r1")
    tr = {k: v for k, v in json.loads((CONTENT / "transmissions.json").read_text("utf8")).items() if not k.startswith("_")}
    plaid_par_route = {p["href"]: p for p in idx["plaidoyers"]}
    themes = {t["id"]: (t, p) for p in idx["structure"]["poles"] for t in p["items"]}
    tete = entete(logo, f"Bureau exécutif · document de travail<br>préparé le {PREPARE}")
    pages = [f"""<section class="doc serre">{tete}
<span class="projet">Projet · à compléter par chaque titulaire, puis à valider par la vice-présidence du pôle</span>
<h1>Les plans annuels des sept thématiques prioritaires<small>En application des décisions 1, 5, 6 et 8 du {PREPARE}</small></h1>
<p class="cite">Décision 1 : « {esc(r1['texte'])} »</p>
<h2>Comment remplir le plan</h2>
<ol><li>Chaque plan reprend ce que le site a déjà publié : le titulaire, le pôle, les plaidoyers rattachés et leurs destinataires, <b>les engagements que l’association a pris par écrit</b> dans chaque plaidoyer, et le chantier des propositions à la commune (décision 8).</li>
<li>Le titulaire, avec son adjoint s’il est trouvé, remplit pour chaque action l’échéance, le responsable, les moyens nécessaires et l’indicateur qui dira si c’est fait. Il peut retirer une action en disant pourquoi, ou en ajouter.</li>
<li>La vice-présidence du pôle valide le plan et le suit chaque trimestre (décision 5) ; là où elle est à pourvoir, le bureau exécutif le fait en attendant l’élection.</li>
<li>Le plan couvre douze mois à compter de sa validation. Il est publié sur la page de la thématique une fois validé, et chaque compte rendu trimestriel y est daté.</li></ol>
<h2>À garder en tête</h2>
<ul><li><b>Argent</b> : la collecte est suspendue jusqu’à trois conditions (autorisation au titre de l’ordonnance n° 023/PR/2018, grille de cotisation votée par l’assemblée, compte au nom de l’association à double signature — décision 2026-16). Toute action qui demande une dépense indique d’où viendrait l’argent, et attend ces conditions.</li>
<li><b>Plaidoyers</b> : les lettres d’envoi sont prêtes et attendent la signature du président et du secrétaire général ; l’envoi est la première action de chaque plan.</li>
<li><b>Service technique</b> : chaque plan invite un agent du service technique de l’État concerné (décision 8).</li>
<li><b>Genre et climat</b> sont des critères de chaque action (décision 7) : la dernière colonne le rappelle.</li></ul>
<table><thead><tr><th>N°</th><th>Thématique prioritaire</th><th>Pôle</th><th>Titulaire</th><th>Adjoint</th></tr></thead><tbody>"""]
    lignes_som = []
    corps = []
    for pr in prioritaires():
        t, p = themes[pr["id"]]
        d = p.get("direction") or {}
        vp = d["name"] if d.get("filled") else "à élire"
        titulaire = t["coordinator"] if t["filled"] else "à pourvoir"
        lignes_som.append(f"<tr><td>{t['number']}</td><td>{esc(t['name'])}</td><td>{p['roman']}</td><td>{esc(titulaire)}</td><td class='blanc'>à trouver</td></tr>")
        actions, plaid_html, docs = [], [], []
        for pl in pr["plaidoyers"]:
            idx_p = plaid_par_route.get(pl["href"])
            slug = pl["href"].rsplit("/", 1)[-1]
            art = json.loads((CONTENT / "articles" / f"{slug}.json").read_text("utf8"))
            nb = len(tr.get(idx_p["id"], {}).get("destinataires", [])) if idx_p else 0
            plaid_html.append(f"<li><b>{esc(art['title'].replace('Plaidoyer : ', ''))}</b> — publié le {esc(art.get('dateLabel', ''))} ; {nb} destinataire{'s' if nb > 1 else ''}, lettres prêtes à signer. Demande : {esc(idx_p['demand']) if idx_p else ''}</li>")
            actions.append((f"Faire signer et envoyer les {nb} lettres d’envoi du plaidoyer « {pl['label']} », puis dater chaque envoi et chaque réponse", "Plaidoyer"))
            for e in engagements(art):
                actions.append((e[0].upper() + e[1:], "Engagement publié"))
            doc = a_documenter(art)
            if doc:
                docs.append(f"<li><b>{esc(pl['label'])}</b> : {esc(doc)}</li>")
        actions.append(("Trouver un adjoint ou une adjointe (fiche de mission, appel « Postes ouverts »)", "Décision 6"))
        actions.append(("Inviter un agent du service technique de l’État concerné à suivre la thématique", "Décision 8"))
        for c in pr["commune"]:
            actions.append((f"Faire avancer le chantier « {c['label']} » des propositions à la commune", "Décision 8"))
        lignes = "".join(f"<tr><td>{i}</td><td>{esc(a)}<br><span class='note'>{esc(src)}</span></td><td class='blanc'></td><td class='blanc'></td><td class='blanc'></td><td class='blanc'></td><td class='blanc'></td></tr>" for i, (a, src) in enumerate(actions, 1))
        lignes += "".join(f"<tr><td>{i}</td><td class='blanc'>Autre action proposée par le titulaire</td><td></td><td></td><td></td><td></td><td></td></tr>" for i in range(len(actions) + 1, len(actions) + 3))
        corps.append(f"""<section class="doc">{tete}
<span class="projet">Plan annuel · projet à compléter</span>
<h1>{t['number']}. {esc(t['name'])}<small>Pôle {p['roman']} · {esc(p['name'])} · thématique prioritaire depuis le {PREPARE}</small></h1>
<div class="cartouche"><div><b>Titulaire</b>{esc(titulaire)}</div><div><b>Adjoint ou adjointe</b>à trouver</div><div><b>Vice-présidence du pôle</b>{esc(vp)}</div><div><b>Plan validé le</b>…… / …… / 20……</div></div>
<h2>Ce qui est déjà publié</h2>
<ul>{''.join(plaid_html)}<li><b>Propositions à la commune</b> : {', '.join(esc(c['label']) for c in pr['commune'])}.</li></ul>
<h2>Les actions de l’année</h2>
<table><thead><tr><th>N°</th><th style="width:44%">Action</th><th>Échéance</th><th>Responsable</th><th>Moyens</th><th>Indicateur</th><th>Genre, climat</th></tr></thead><tbody>{lignes}</tbody></table>
{f'<h2>Ce qu’il faut encore documenter</h2><ul>{"".join(docs)}</ul>' if docs else ''}
<div style="break-inside:avoid"><h2>Comptes rendus trimestriels</h2>
<div class="etapes"><div><b>Trimestre 1</b>fait, en cours, bloqué</div><div><b>Trimestre 2</b></div><div><b>Trimestre 3</b></div><div><b>Trimestre 4</b>bilan de l’année</div></div>
<div class="sign"><div>Le ou la titulaire</div><div>L’adjoint ou l’adjointe</div><div>La vice-présidence du pôle</div></div></div>
</section>""")
    pages[0] += "".join(lignes_som) + "</tbody></table></section>"
    return pages[0] + "".join(corps)


def main() -> None:
    from playwright.sync_api import sync_playwright

    og = charger("build_og", ROOT / "scripts" / "build-og.py")
    idx = json.loads((CONTENT / "index.json").read_text("utf8"))
    src = (ROOT / "lib" / "content.ts").read_text("utf8")
    bureau = [{"role": r, "name": n} for r, n in re.findall(r'\{ role: "([^"]+)", name: "([^"]+)"', src)]
    logo = "data:image/png;base64," + base64.b64encode(LOGO.read_bytes()).decode()
    fonts = og.font_faces()
    OUT.mkdir(parents=True, exist_ok=True)
    elec, note = election(idx, logo, bureau)
    docs = {
        "election-vice-presidences-projet.pdf": ("Élire les vice-présidences — projet de procédure", elec),
        "plans-annuels-priorites-projet.pdf": ("Plans annuels des thématiques prioritaires — projet", plans(idx, logo)),
    }
    tmp = ROOT / ".next" / "dossier-bureau-tmp.html"
    pied = ('<div style="width:100%;font:7pt DM Sans,Arial,sans-serif;color:#6a776f;padding:0 17mm;display:flex;justify-content:space-between">'
            '<span>ADEB LONODJI · bureau exécutif · document de travail, non publié</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>')
    with sync_playwright() as pw:
        b = pw.chromium.launch()
        pg = b.new_page()
        for nom, (titre, corps) in docs.items():
            tmp.write_text(f'<!doctype html><html lang="fr"><meta charset="utf-8"><title>{esc(titre)}</title><style>{fonts}{CSS}</style><body>{corps}</body></html>', encoding="utf-8")
            pg.goto(tmp.as_uri(), wait_until="load")
            pg.evaluate("document.fonts.ready")
            pg.pdf(path=str(OUT / nom), format="A4", print_background=True, prefer_css_page_size=True,
                   display_header_footer=True, header_template="<span></span>", footer_template=pied)
            print(f"{(OUT / nom).relative_to(ROOT)}")
        b.close()
    tmp.unlink(missing_ok=True)
    (OUT / "appel-candidatures-whatsapp.md").write_text(note + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
