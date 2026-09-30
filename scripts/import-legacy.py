#!/usr/bin/env python3
"""Importe le contenu de l'ancien site statique ADEB LONODJI (dossier HTML publié
le 24/09/2026) dans les modules de contenu du site Next.js.

Usage : python3 scripts/import-legacy.py /chemin/vers/ancien-site

Produit :
  content/pages/<slug>.json      pages de fond (dossiers, hubs) nettoyées, liens réécrits
  content/articles/<slug>.json   articles du journal
  content/index.json             index des pages, articles, structure, plaidoyers, documents
  public/__forms.html            déclaration statique des formulaires Netlify
  public/{documents,identite,kit,app,og}/…   ressources copiées

Le script est idempotent : il écrase les fichiers générés.
"""
import json
import os
import re
import shutil
import sys
from copy import copy
from pathlib import Path

from bs4 import BeautifulSoup, NavigableString, Tag

LEGACY = Path(sys.argv[1] if len(sys.argv) > 1 else "/home/claude/lonodji").resolve()
ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
PUBLIC = ROOT / "public"

# ----------------------------------------------------------------------------
# Carte des routes : ancien fichier -> nouvelle route
# ----------------------------------------------------------------------------
HUB_ROUTES = {
    "index": "/",
    "mission": "/mission",
    "poles": "/programmes",
    "plaidoyers": "/actions",
    "suivi": "/impact",
    "actualites": "/journal",
    "documents": "/documents",
    "contact": "/participer#contact",
    "adherer": "/participer#adherer",
    "soutenir": "/participer#soutenir",
    "redevabilite": "/transparence",
    "mentions-legales": "/mentions-legales",
    "figures": "/histoire",
    "sitemap": "/plan-du-site",
    "hors-ligne": "/hors-ligne",
    "404": "/",
    "redaction": "/",
}
# Scripts de page (outils interactifs), servis depuis public/
PAGE_SCRIPTS = {
    "trouver-ma-thematique": ["/trouver.js"],
    "genealogie-outil": ["/genealogie.js"],
}
# Pages portées telles quelles ; leur adresse vient de content/routes-dossiers.json (restructuration du 29/09/2026 :
# chaque page rejoint sa rubrique). « air-bedjondo » n’est plus importée : remplacée par la page du projet renommé.
ROUTES_DOSSIERS = json.loads((Path(__file__).resolve().parent.parent / "content" / "routes-dossiers.json").read_text(encoding="utf-8"))["routes"]
DOSSIERS = [
    "agriculteurs-eleveurs", "agriculture-securite-alimentaire", "application",
    "bedjondo", "besoins", "complexe-sportif", "decentralisation", "demarches", "drones-innovation",
    "engagements", "enquetes", "environnement", "espace-numerique", "evenements", "genealogies",
    "handicap", "identite-visuelle", "kit-mobilisation", "lieux-sacres", "odd", "ong-partenaires",
    "problematiques", "recherche", "solidarite-inclusion", "veuves",
    "trouver-ma-thematique", "genealogie-outil",
]
# Pages de fond dont les sections alimentent une page conçue
HUB_PAGES = ["mission", "poles", "plaidoyers", "suivi", "contact", "adherer", "soutenir",
             "redevabilite", "mentions-legales", "figures", "documents", "actualites"]
EN_PAGES = ["index", "about", "advocacy", "bedjondo", "contact", "themes"]

PARENTS = {
    "Nos actions": "/programmes",
    "L’association": "/mission",
    "L'association": "/mission",
    "Bédjondo & héritage": "/histoire",
    "Actualités": "/journal",
    "Agir avec nous": "/participer",
    "Le journal": "/journal",
}


def route_for(name: str, base_dir: str) -> str:
    """name : chemin relatif tel qu'écrit dans l'ancien site (sans ancre ni requête)."""
    p = name
    # normalisation du chemin par rapport au dossier de la page source
    parts = []
    for seg in (base_dir.rstrip("/").split("/") if base_dir else []) + p.split("/"):
        if seg in ("", "."):
            continue
        if seg == "..":
            if parts:
                parts.pop()
            continue
        parts.append(seg)
    p = "/".join(parts)
    if p.endswith(".pdf"):
        return "/" + p
    if re.search(r"\.(png|jpe?g|svg|webp|ico|json|xml|txt|webmanifest|css|js)$", p):
        return "/" + p
    if p.startswith("articles/"):
        slug = p[len("articles/"):].replace(".html", "")
        return "/journal/" + slug
    if p.startswith("en/"):
        n = p[3:].replace(".html", "")
        return "/en/" + ("index" if n == "" else n)
    n = p.replace(".html", "")
    if n == "":
        return "/"
    if n in HUB_ROUTES:
        return HUB_ROUTES[n]
    if n in ROUTES_DOSSIERS:
        return ROUTES_DOSSIERS[n]
    return "/dossiers/" + n


ANCHOR_MAP = {
    "/journal#formulaire-newsletter": "/participer#newsletter",
    # 30/09/2026 : l'étagère quitte la base de recherche (doublon du classement de la bibliothèque)
    "/patrimoine/base-de-recherche#shelf-title": "/bibliotheque",
}


def rewrite_href(href: str, base_dir: str) -> str:
    if not href or href.startswith(("#", "http://", "https://", "mailto:", "tel:", "sms:", "data:", "javascript:")):
        return href
    m = re.match(r"^([^?#]*)(\?[^#]*)?(#.*)?$", href)
    path, query, frag = m.group(1), m.group(2) or "", m.group(3) or ""
    if path == "":
        return href
    route = route_for(path, base_dir)
    # Une route qui porte déjà une ancre (ex. /participer#contact) garde la sienne
    if "#" in route and frag:
        route = route.split("#")[0]
        return route + query + frag
    if "#" in route:
        r, f = route.split("#", 1)
        return r + query + "#" + f
    out = route + query + frag
    return ANCHOR_MAP.get(out, out)


def rewrite_src(src: str, base_dir: str) -> str:
    if not src or src.startswith(("http://", "https://", "data:")):
        return src
    return route_for(src.split("#")[0].split("?")[0], base_dir)


# ----------------------------------------------------------------------------
# Nettoyage
# ----------------------------------------------------------------------------
REMOVE_SELECTORS = [
    'script:not([type="application/json"])', "noscript", ".crumbs", ".tri-bar", ".page-hero-visual", ".article-share",
    ".related", ".article-back", ".filter-tabs", "[data-journal-filters]", ".search-bar",
    ".journal-search", "#journal-search", ".result-count", ".share-feedback",
    ".back-to-top", ".retour-haut", "[data-share]", ".kit-actions",
]


def text(el) -> str:
    return re.sub(r"\s+", " ", el.get_text(" ", strip=True)).strip() if el else ""


def clean_tree(root: Tag, base_dir: str, collected_forms: dict):
    for sel in REMOVE_SELECTORS:
        for el in root.select(sel):
            el.decompose()
    for a in root.find_all("a"):
        if a.has_attr("href"):
            a["href"] = rewrite_href(a["href"], base_dir)
    for el in root.find_all(["img", "source", "video", "audio", "iframe"]):
        if el.has_attr("src"):
            el["src"] = rewrite_src(el["src"], base_dir)
        if el.has_attr("srcset"):
            el["srcset"] = ", ".join(
                (rewrite_src(part.strip().split(" ")[0], base_dir) + (" " + part.strip().split(" ")[1] if " " in part.strip() else ""))
                for part in el["srcset"].split(",") if part.strip()
            )
        if el.name == "img" and not el.has_attr("loading"):
            el["loading"] = "lazy"
    for f in root.find_all("form"):
        name = f.get("name")
        if name:
            collected_forms[name] = f
            f["action"] = "/__forms.html"
            f["method"] = "POST"
            for attr in ("data-local-form", "data-netlify", "netlify-honeypot", "netlify"):
                if f.has_attr(attr):
                    del f[attr]
            # remplace le libellé d'accord (adresse chez Netlify) : inchangé, conforme aux mentions
            marquer_obligatoires(f, root)
            for champ in f.find_all("input", attrs={"name": "nom"}):
                if not champ.has_attr("autocomplete"):
                    champ["autocomplete"] = "name"
        else:
            # outil local (cahier généalogique) : les noms saisis sont ceux des ancêtres, pas de l'utilisateur
            for champ in f.find_all("input"):
                if champ.get("type", "text") == "text" and not champ.has_attr("autocomplete"):
                    champ["autocomplete"] = "off"
        # les formulaires sans nom sont des outils locaux (cahier généalogique) : conservés tels quels
    # les attributs `style` avec variables ODD sont conservés ; on retire les data-* d'interactivité inutiles
    for el in root.find_all(True):
        for attr in list(el.attrs):
            if attr in ("data-search", "data-need-loc", "data-plea"):
                del el[attr]


def marquer_obligatoires(form: Tag, root: Tag) -> None:
    """Une seule convention pour les champs obligatoires : un astérisque après le libellé, expliqué en tête."""
    soup = form
    while soup.parent is not None:
        soup = soup.parent
    marques = 0
    for champ in form.find_all(["input", "textarea", "select"]):
        if not champ.has_attr("required") or champ.get("type") in ("hidden", "submit"):
            continue
        lab = None
        if champ.get("id"):
            lab = form.find("label", attrs={"for": champ["id"]}) or root.find("label", attrs={"for": champ["id"]})
        if lab is None:
            lab = champ.find_parent("label")
        if lab is None or "*" in lab.get_text() or lab.find(class_="requis"):
            marques += 1 if lab is not None else 0
            continue
        etoile = soup.new_tag("span", attrs={"class": "requis", "aria-hidden": "true"})
        etoile.string = " *"
        cible = lab.find("span") if champ.get("type") in ("checkbox", "radio") and lab.find("span") else lab
        if cible is lab and champ.find_parent("label") is lab:
            # libellé qui englobe le champ : l'astérisque suit le texte, avant le champ
            premier_texte = next((c for c in lab.contents if isinstance(c, NavigableString) and c.strip()), None)
            if premier_texte is not None:
                premier_texte.insert_after(etoile)
            else:
                lab.append(etoile)
        else:
            cible.append(etoile)
        marques += 1
    if marques and not form.find(class_="form-requis"):
        note = soup.new_tag("p", attrs={"class": "form-requis"})
        note.append("Les champs marqués ")
        e = soup.new_tag("span", attrs={"class": "requis", "aria-hidden": "true"})
        e.string = "*"
        note.append(e)
        note.append(" sont obligatoires." if form.find_parent(attrs={"lang": "en"}) is None and "lang=\"en\"" not in str(root)[:400] else "")
        if note.get_text().endswith("*"):
            note.clear()
            note.append("Fields marked ")
            e2 = soup.new_tag("span", attrs={"class": "requis", "aria-hidden": "true"})
            e2.string = "*"
            note.append(e2)
            note.append(" are required.")
        form.insert(0, note)


def inner_html(el: Tag) -> str:
    return "".join(str(c) for c in el.contents).strip()


def unwrap_wrap(section: Tag) -> str:
    """Renvoie le HTML interne d'une section en retirant l'enveloppe .wrap."""
    wraps = [c for c in section.find_all(recursive=False) if isinstance(c, Tag) and "wrap" in (c.get("class") or [])]
    if len(wraps) == 1 and len([c for c in section.find_all(recursive=False) if isinstance(c, Tag)]) == 1:
        w = wraps[0]
        classes = [k for k in (w.get("class") or []) if k != "wrap"]
        if classes:
            w["class"] = classes
            return str(w)
        return inner_html(w)
    return inner_html(section)


# Allègement du 30/09/2026 : les longs tableaux de détail sont repliés (details.plier) sous un titre qui dit
# ce qu'ils contiennent ; une ancre qui vise une ligne ouvre le bloc (components/ouvrir-ancre.tsx).
# fichier de l'ancien site → [(sélecteur du bloc, titre, sous-titre)]
PLIER_BLOCS = {
    "problematiques.html": [(".table-wrap:has(> table.indic-table)", "Le tableau détaillé, domaine par domaine",
                             "34 lignes : constat, thématique, état de la connaissance, qui décide")],
    "plaidoyers.html": [(".table-wrap:has(> table.indic-table)", "Les indicateurs, dossier par dossier",
                         "22 indicateurs : valeur de départ, cible, échéance, moyen de vérification")],
}


def plier_sources(main: Tag) -> None:
    """Base de recherche : la présentation de chaque source se replie sous « Ce que contient cette source »."""
    for carte in main.select("article.source-card"):
        paras = [c for c in carte.find_all("p", recursive=False) if "source-meta" not in (c.get("class") or [])]
        if not paras or sum(len(text(x)) for x in paras) < 160:
            continue
        soup = BeautifulSoup("", "lxml")
        det = soup.new_tag("details", attrs={"class": "source-plus"})
        summ = soup.new_tag("summary")
        summ.string = "Ce que contient cette source"
        paras[0].insert_before(det)
        det.append(summ)
        for x in paras:
            det.append(x.extract())


def dedoublonner_recherche(main: Tag) -> None:
    """Base de recherche (30/09/2026) : les 40 références y figuraient deux fois (l'étagère de couvertures, puis
    les fiches), et une troisième sur la bibliothèque. La base garde les fiches ; l'étagère devient un renvoi
    vers la bibliothèque, qui range les mêmes références par type."""
    h = main.select_one("#shelf-title")
    sec = h.find_parent("section") if h else None
    if sec:
        wrap = sec.select_one(".wrap") or sec
        wrap.clear()
        wrap.append(BeautifulSoup(
            '<div class="section-head"><div><div class="eyebrow">La bibliothèque</div>'
            '<h2 id="shelf-title">Les mêmes références, rangées par type</h2>'
            '<p class="lede">Thèses, articles, ouvrages, rapports et archives, avec les publications de l’association, '
            'les chercheurs du pays bedjond et le dépôt d’un document : <a href="/bibliotheque">la bibliothèque</a>. '
            'Ici, chaque référence a sa fiche complète et sa citation à copier ; cherchez par titre, auteur ou mot-clé, '
            'ou filtrez par catégorie.</p></div></div>', "lxml").find("div"))
        sec["class"] = [c for c in (sec.get("class") or []) if c != "shelf-section"]


def plier_blocs(main: Tag, nom: str) -> None:
    if nom == "recherche.html":
        dedoublonner_recherche(main)
        plier_sources(main)
    for sel, titre, sous in PLIER_BLOCS.get(nom, []):
        for el in main.select(sel):
            soup = BeautifulSoup("", "lxml")
            det = soup.new_tag("details", attrs={"class": "plier plier--tableau"})
            summ = soup.new_tag("summary")
            st = soup.new_tag("strong"); st.string = titre
            sp = soup.new_tag("span"); sp.string = sous
            summ.append(st); summ.append(sp)
            el.wrap(det)
            det.insert(0, summ)


def parse_page(path: Path):
    html = lire_source(path)
    soup = BeautifulSoup(html, "lxml")
    base_dir = str(path.parent.relative_to(LEGACY)).replace(".", "")
    main = soup.find("main")
    head = soup.find("head")
    root_attrs = {k: v for k, v in main.attrs.items() if k.startswith("data-")}
    meta_desc = head.find("meta", attrs={"name": "description"})
    title_tag = head.find("title")
    forms = {}
    data = {
        "legacy": str(path.relative_to(LEGACY)),
        "lang": soup.html.get("lang", "fr") if soup.html else "fr",
        "documentTitle": text(title_tag),
        "description": (meta_desc.get("content") if meta_desc else "").strip(),
    }
    hero = main.select_one(".page-hero")
    if hero:
        crumbs = [text(li) for li in hero.select(".crumbs li")]
        eyebrow = hero.select_one(".eyebrow")
        h1 = hero.find("h1")
        lede = hero.select_one(".lede")
        pills = [text(p) for p in hero.select(".hero-pill")]
        kicker = hero.select_one(".hero-tile-kicker")
        meta = hero.select_one(".article-meta")
        art = {}
        if meta:
            t = meta.find("time")
            art["date"] = t.get("datetime") if t else ""
            art["dateLabel"] = text(t)
            rt = meta.select_one(".read-time")
            art["readTime"] = text(rt)
            by = meta.select_one(".article-byline")
            art["byline"] = text(by)
            tag = meta.select_one(".news-tag")
            art["tag"] = text(tag)
        data.update({
            "title": text(h1),
            "eyebrow": text(eyebrow),
            "lede": text(lede),
            "pills": pills,
            "kicker": text(kicker),
            "crumbs": crumbs,
            "parent": crumbs[-2] if len(crumbs) >= 2 else "",
            **art,
        })
        hero.decompose()
    else:
        h1 = main.find("h1")
        data.update({"title": text(h1), "eyebrow": "", "lede": "", "pills": [], "crumbs": [], "parent": ""})
    resume = main.select_one(".resume")
    if resume:
        data["resume"] = [text(li) for li in resume.select("li")]
        resume.decompose()
    sommaire = main.select_one("nav.sommaire, .sommaire")
    if sommaire:
        data["toc"] = [{"href": a.get("href", ""), "label": text(a)} for a in sommaire.select("a")]
        sommaire.decompose()
    # Article : corps
    body = main.select_one(".article-body")
    sections = []
    if body:
        clean_tree(main, base_dir, forms)
        plier_blocs(main, path.name)  # après la réécriture des liens : les liens ajoutés sont déjà des routes
        for child in [c for c in main.find_all(recursive=False) if isinstance(c, Tag)]:
            cls = child.get("class") or []
            if child.select_one(".article-body"):
                b = child.select_one(".article-body")
                classes = [k for k in (b.get("class") or []) if k not in ("wrap", "article-body")]
                sections.append({"id": "", "alt": False, "cls": " ".join(classes), "tag": "section", "html": inner_html(b)})
            elif child.name in ("section", "div", "aside", "figure") and "related" not in cls and text(child):
                sections.append({"id": child.get("id", "") or "", "alt": "alt" in cls, "cls": " ".join(k for k in cls if k != "alt"), "tag": child.name, "html": unwrap_wrap(child)})
    else:
        clean_tree(main, base_dir, forms)
        plier_blocs(main, path.name)  # après la réécriture des liens : les liens ajoutés sont déjà des routes
        for child in [c for c in main.find_all(recursive=False) if isinstance(c, Tag)]:
            cls = child.get("class") or []
            if child.name in ("section", "div", "nav", "aside", "figure", "article"):
                html_inner = unwrap_wrap(child)
                if not text(child) and not child.find(["img", "svg", "form"]):
                    continue
                sections.append({
                    "id": child.get("id", "") or "",
                    "alt": "alt" in cls,
                    "cls": " ".join(k for k in cls if k not in ("alt",)),
                    "tag": child.name,
                    "html": html_inner,
                })
    for sec in sections:
        sec["html"] = apply_updates(sec["html"])
    data["sections"] = sections
    plain = " ".join(re.sub(r"<[^>]+>", " ", s["html"]) for s in sections)
    data["words"] = len(plain.split())
    data["forms"] = sorted(forms.keys())
    data["hasMap"] = any("data-geo" in s["html"] for s in sections)
    data["scripts"] = PAGE_SCRIPTS.get(path.stem, []) if base_dir == "" else []
    data["rootAttrs"] = {k: (v if isinstance(v, str) else " ".join(v)) for k, v in root_attrs.items()}
    return data, forms


# ----------------------------------------------------------------------------
# Données structurées des hubs
# ----------------------------------------------------------------------------
ROMAN = {"pole-1": "I", "pole-2": "II", "pole-3": "III", "pole-4": "IV"}


# Direction des pôles (décision du 28/09/2026) : chaque pôle est dirigé par un directeur
# ou une directrice de pôle, au rang de chef de projet (project manager), qui anime les
# coordonnateurs de ses thématiques, tient le plan d'action et le calendrier, et rend
# compte au bureau. Nommer quelqu'un : DIRECTIONS_POLES["pole-2"] = "Prénom Nom, qualité".
# 30/09/2026 : direction du pôle I confiée au Dr Bé-Rammaj Miaro-II (déjà coordonnateur de Mémoire & héritage).
DIRECTIONS_POLES: dict[str, str | None] = {"pole-1": "Dr Bé-Rammaj Miaro-II", "pole-2": None, "pole-3": None, "pole-4": None}
DIRECTION_LABEL = "Directeur ou directrice de pôle"
DIRECTION_RANG = "rang de chef de projet"


def structure(soup_poles: BeautifulSoup, base_dir="") -> dict:
    main = soup_poles.find("main")
    poles, cellules = [], []
    for sec in main.find_all("section", recursive=False):
        if "pole-group" not in (sec.get("class") or []):
            continue
        h2 = sec.find("h2")
        eyebrow = text(sec.select_one(".eyebrow"))
        intro_p = sec.select_one(".section-head p, .pole-intro, .section-head + p")
        intro = ""
        sh = sec.select_one(".section-head")
        if sh:
            ps = sh.find_all("p")
            intro = " ".join(text(p) for p in ps if "eyebrow" not in (p.get("class") or []))
        cards = []
        for c in sec.select(".pole-card"):
            num = text(c.select_one(".pole-num"))
            status = text(c.select_one(".pole-status"))
            coord = text(c.select_one(".coord"))
            desc_p = None
            for p in c.find_all("p", recursive=False):
                if "coord" in (p.get("class") or []):
                    continue
                desc_p = p
                break
            desc_html = ""
            if desc_p:
                dp = copy(desc_p)
                for a in dp.find_all("a"):
                    a["href"] = rewrite_href(a.get("href", ""), base_dir)
                desc_html = inner_html(dp)
            tags = [text(t) for t in c.select(".pole-tags .tag")]
            odd = []
            for chip in c.select(".odd-chip"):
                odd.append({
                    "num": text(chip.select_one(".odd-num")),
                    "name": text(chip.select_one(".odd-name")),
                    "cible": text(chip.select_one(".odd-cible")),
                    "title": chip.get("title", ""),
                    "accent": (re.search(r"--odd-accent:(#[0-9A-Fa-f]{6})", chip.get("style", "")) or [None, ""])[1],
                    "ink": (re.search(r"--odd-ink:(#[0-9A-Fa-f]{6})", chip.get("style", "")) or [None, ""])[1],
                })
            links = [{"label": text(a), "href": rewrite_href(a.get("href", ""), base_dir)} for a in c.select(".pole-hub-links a")]
            m = re.search(r"(\d+)", num)
            cards.append({
                "id": c.get("id", ""),
                "number": m.group(1) if m else "",
                "kind": "cellule" if "CELLULE" in num.upper() else "thematique",
                "name": text(c.find("h3")),
                "status": status,
                "filled": status.lower().startswith("pourvu"),
                "coordinator": re.sub(r"^Coordonn(?:ateur|atrice)\s*:\s*", "", coord),
                "coordinatorLabel": coord.split(":")[0].strip() if ":" in coord else "",
                "description": desc_html,
                "descriptionText": text(desc_p) if desc_p else "",
                "tags": tags,
                "odd": odd,
                "links": links,
            })
        entry = {"id": sec.get("id", ""), "roman": ROMAN.get(sec.get("id", ""), ""), "eyebrow": eyebrow,
                 "name": text(h2), "intro": intro, "items": cards}
        if sec.get("id", "") in DIRECTIONS_POLES:
            qui = DIRECTIONS_POLES[sec.get("id", "")]
            entry["direction"] = {"label": DIRECTION_LABEL, "rang": DIRECTION_RANG, "name": qui or "à pourvoir", "filled": bool(qui)}
        if sec.get("id") == "cellules":
            cellules = entry
        else:
            poles.append(entry)
    return {"poles": poles, "cellules": cellules}


def plaidoyers(soup_plea: BeautifulSoup) -> list:
    out = []
    for c in soup_plea.select(".plea-card"):
        h3 = c.find("h3")
        a = h3.find("a") if h3 else None
        meta = {}
        for div in c.select(".plea-meta > div"):
            dt, dd = div.find("dt"), div.find("dd")
            if dt and dd:
                meta[text(dt)] = text(dd)
        pdf = c.select_one('a[href$=".pdf"]')
        theme = c.select_one(".plea-theme")
        out.append({
            "id": c.get("id", ""),
            "title": text(h3),
            "href": rewrite_href(a.get("href", ""), "") if a else "",
            "theme": text(theme),
            "themeHref": rewrite_href(theme.get("href", ""), "") if theme else "",
            "status": text(c.select_one(".plea-status")),
            "demand": text(c.select_one(".plea-demande")),
            "recipients": meta.get("Destinataires", ""),
            "published": meta.get("Publié", ""),
            "sent": meta.get("Envoyé", ""),
            "answer": meta.get("Réponse", ""),
            "pdf": rewrite_href(pdf.get("href", ""), "") if pdf else "",
        })
    return out


def documents(soup_docs: BeautifulSoup) -> list:
    out = []
    for c in soup_docs.select(".pole-card"):
        pdf = c.select_one('a[href$=".pdf"]')
        links = [{"label": text(a), "href": rewrite_href(a.get("href", ""), "")} for a in c.select("a") if not a.get("href", "").endswith(".pdf")]
        desc = ""
        for p in c.find_all("p"):
            if "coord" in (p.get("class") or []):
                continue
            desc = text(p)
            break
        out.append({
            "title": text(c.find("h3")),
            "status": text(c.select_one(".pole-status")),
            "meta": text(c.select_one(".coord")),
            "description": desc,
            "pdf": rewrite_href(pdf.get("href", ""), "") if pdf else "",
            "links": links,
        })
    return out


def history(soup_mission: BeautifulSoup) -> list:
    out = []
    for h in soup_mission.select(".history-item"):
        out.append({
            "year": text(h.select_one(".history-year")),
            "title": text(h.find(["h3", "h4"])),
            "text": text(h.find("p")),
        })
    return out


def journal_categories(soup_news: BeautifulSoup) -> tuple:
    cats = []
    for b in soup_news.select(".filter-tab"):
        cats.append({"slug": b.get("data-cat", ""), "label": text(b)})
    by_slug = {}
    for c in soup_news.select(".news-card"):
        a = c.select_one("h3 a")
        if not a:
            continue
        slug = a.get("href", "").split("/")[-1].replace(".html", "")
        by_slug[slug] = {
            "category": c.get("data-cat", ""),
            "summary": text(c.select_one(".news-body > p")),
            "tag": text(c.select_one(".news-tag")),
        }
    return cats, by_slug


# ----------------------------------------------------------------------------
# Formulaires Netlify : fichier statique de déclaration
# ----------------------------------------------------------------------------

# Répertoire des compétences de la diaspora (app/diaspora/page.tsx) : déclaré ici pour
# que public/__forms.html le garde à chaque import. Les cases à cocher ont chacune
# leur nom (domaine-*, offre-*) : Netlify ne fusionne pas les valeurs multiples.
FORMULAIRES_SITE = {
    "temoignage": (
        '<form name="temoignage"><input type="hidden" name="_honey">'
        '<select name="type"><option value="">Choisir</option><option value="Un ancien ou une ancienne raconte">Un ancien ou une ancienne raconte</option>'
        '<option value="Une femme qui fait bouger les choses">Une femme qui fait bouger les choses</option><option value="Un jeune talent">Un jeune talent</option>'
        '<option value="Une histoire de Bédjondo : un lieu, un événement, une tradition">Une histoire de Bédjondo : un lieu, un événement, une tradition</option>'
        '<option value="Un retour au pays, une vie de diaspora">Un retour au pays, une vie de diaspora</option>'
        '<option value="Une photo ou une série de photos, avec leur histoire">Une photo ou une série de photos, avec leur histoire</option><option value="Autre">Autre</option></select>'
        '<input type="text" name="titre"><textarea name="recit"></textarea><input type="file" name="fichier"><input type="text" name="lieu">'
        '<input type="text" name="nom"><input type="text" name="qualite"><input type="text" name="contact"><input type="text" name="localite">'
        '<select name="publication"><option value="">Choisir</option><option value="Publiable, avec mon nom">Publiable, avec mon nom</option>'
        '<option value="Publiable, sans mon nom">Publiable, sans mon nom</option><option value="Pour les archives de l’association seulement, sans publication">Pour les archives de l’association seulement, sans publication</option></select>'
        '<input type="checkbox" name="personnes"><input type="checkbox" name="mineurs"><input type="checkbox" name="consentement"></form>'
    ),
    "depot-document": (
        '<form name="depot-document"><input type="hidden" name="_honey"><input type="text" name="titre"><input type="text" name="auteurs"><input type="text" name="annee">'
        '<select name="type"><option value="">Choisir</option><option value="Thèse ou mémoire">Thèse ou mémoire</option><option value="Article ou étude scientifique">Article ou étude scientifique</option>'
        '<option value="Ouvrage, lexique ou recueil">Ouvrage, lexique ou recueil</option><option value="Rapport d’enquête, données, source institutionnelle">Rapport d’enquête, données, source institutionnelle</option>'
        '<option value="Archive, document historique, coupure de presse">Archive, document historique, coupure de presse</option><option value="Publication d’ADEB LONODJI ou d’une association bedjond">Publication d’ADEB LONODJI ou d’une association bedjond</option><option value="Autre">Autre</option></select>'
        '<input type="text" name="langue"><textarea name="resume"></textarea><input type="url" name="lien"><input type="file" name="fichier">'
        '<select name="droits"><option value="">Choisir</option><option value="Je suis l’auteur·e">Je suis l’auteur·e</option><option value="J’ai l’accord de l’auteur·e ou de l’éditeur">J’ai l’accord de l’auteur·e ou de l’éditeur</option><option value="Document public ou libre de droits">Document public ou libre de droits</option><option value="Je ne sais pas : à vérifier avec vous">Je ne sais pas : à vérifier avec vous</option></select>'
        '<select name="publication"><option value="">Choisir</option><option value="Publier le fichier en ligne dans la bibliothèque">Publier le fichier en ligne dans la bibliothèque</option><option value="Référencer seulement (titre, auteur, résumé), sans le fichier">Référencer seulement (titre, auteur, résumé), sans le fichier</option><option value="Le garder dans les archives de l’association, sans publication">Le garder dans les archives de l’association, sans publication</option></select>'
        '<input type="text" name="nom"><input type="text" name="contact"><textarea name="message"></textarea><input type="checkbox" name="consentement"></form>'
    ),
    "mot-nangnda": (
        '<form name="mot-nangnda"><input type="hidden" name="_honey"><input type="text" name="mot">'
        '<select name="categorie"><option value="">Choisir</option><option value="Un mot (nom, verbe, adjectif…)">Un mot (nom, verbe, adjectif…)</option><option value="Une expression">Une expression</option><option value="Un proverbe">Un proverbe</option>'
        '<option value="Une salutation, une formule de politesse">Une salutation, une formule de politesse</option><option value="Un nombre, une mesure, un temps">Un nombre, une mesure, un temps</option><option value="Un nom de lieu, de plante, d’animal, d’objet">Un nom de lieu, de plante, d’animal, d’objet</option><option value="Autre">Autre</option></select>'
        '<input type="text" name="sens"><input type="text" name="exemple"><input type="text" name="traduction"><input type="file" name="audio"><input type="text" name="variante"><input type="text" name="source">'
        '<input type="text" name="nom"><input type="text" name="contact"><select name="publication"><option value="">Choisir</option><option value="Publiable, avec mon nom comme contributeur">Publiable, avec mon nom comme contributeur</option><option value="Publiable, sans mon nom">Publiable, sans mon nom</option></select>'
        '<input type="checkbox" name="consentement"></form>'
    ),
    "proposition-projet": (
        '<form name="proposition-projet"><input type="hidden" name="_honey"><input type="text" name="projet"><input type="text" name="localite">'
        '<select name="domaine"><option value="">Choisir</option>' + "".join(f'<option value="{d}">{d}</option>' for d in ("Eau", "Électricité, énergie", "École, formation", "Santé", "Routes, ponts, transport", "Internet, réseau", "Agriculture, élevage", "Culture, patrimoine, langue", "Jeunesse, sport", "Autre")) + '</select>'
        '<textarea name="probleme"></textarea><textarea name="solution"></textarea><input type="text" name="cout"><input type="text" name="nom"><input type="text" name="qualite"><input type="text" name="contact">'
        '<select name="publication"><option value="">Choisir</option><option value="Il peut être publié ici avec mon nom comme proposant·e">Il peut être publié ici avec mon nom comme proposant·e</option><option value="Il peut être publié ici, sans mon nom">Il peut être publié ici, sans mon nom</option><option value="Il reste dans les échanges avec la thématique, sans publication">Il reste dans les échanges avec la thématique, sans publication</option></select>'
        '<input type="checkbox" name="consentement"></form>'
    ),
    "diaspora-competences": (
        '<form name="diaspora-competences"><input type="hidden" name="_honey">'
        '<input type="text" name="nom"><input type="email" name="email"><input type="text" name="telephone">'
        '<input type="text" name="pays"><input type="text" name="ville">'
        '<select name="lien"><option value="">Choisir</option><option value="Originaire de Bédjondo">Originaire de Bédjondo</option>'
        '<option value="Famille bedjond, autre canton">Famille bedjond, autre canton</option><option value="Conjoint·e, ami·e, allié·e">Conjoint·e, ami·e, allié·e</option>'
        '<option value="Autre">Autre</option></select>'
        '<input type="text" name="metier">'
        + "".join(f'<input type="checkbox" name="domaine-{d}">' for d in ("sante", "education", "ingenierie", "droit", "entreprise", "numerique", "agriculture", "communication", "administration", "autre"))
        + '<select name="experience"><option value="">Choisir</option><option value="Moins de 3 ans">Moins de 3 ans</option><option value="3 à 10 ans">3 à 10 ans</option><option value="Plus de 10 ans">Plus de 10 ans</option></select>'
        + "".join(f'<input type="checkbox" name="offre-{o}">' for o in ("conseil", "mentorat", "mission", "formation", "reseau", "financement"))
        + '<input type="text" name="thematique"><input type="text" name="langues">'
        '<select name="disponibilite"><option value="">Choisir</option><option value="Quelques heures par mois">Quelques heures par mois</option><option value="Une journée par mois">Une journée par mois</option><option value="Ponctuellement, sur demande">Ponctuellement, sur demande</option><option value="Une mission de plusieurs semaines sur place">Une mission de plusieurs semaines sur place</option></select>'
        '<textarea name="message"></textarea><input type="checkbox" name="consentement"><input type="checkbox" name="annuaire"></form>'
    ),
}


def forms_html(all_forms: dict) -> str:
    parts = ["<!doctype html><html lang=\"fr\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">"
             "<title>Merci — ADEB LONODJI</title>",
             "<meta name=\"robots\" content=\"noindex\">"
             "<style>body{margin:0;font:17px/1.6 system-ui,sans-serif;color:#10241e;background:#f4f6f1}"
             "main{max-width:560px;margin:12vh auto;padding:0 20px}h1{font-size:30px;line-height:1.15;margin:0 0 12px}"
             "a{display:inline-flex;align-items:center;min-height:44px;padding:0 18px;border-radius:99px;background:#173b2d;color:#fff;text-decoration:none;font-weight:600;margin:8px 8px 0 0}"
             "a.second{background:#fff;color:#173b2d;border:1px solid rgba(16,36,30,.2)}form{display:none}</style></head><body>",
             # page affichée si un formulaire est envoyé sans JavaScript (l'action des formulaires pointe ici)
             "<main><h1>Merci, votre envoi est bien parti.</h1>"
             "<p>Si vous avez laissé un moyen de vous joindre, vous recevrez un accusé de réception sous 48 heures ouvrées. "
             "<span lang=\"en\">Thank you, your message has been sent.</span></p>"
             "<p><a href=\"/\">Retour au site</a><a class=\"second\" href=\"https://wa.me/23566299403\">WhatsApp</a></p></main>",
             "<!-- Déclaration statique des formulaires pour Netlify Forms (site Next.js). Généré par scripts/import-legacy.py -->"]
    for name in sorted(all_forms):
        f = all_forms[name]
        fields = []
        seen = set()
        for el in f.find_all(["input", "textarea", "select"]):
            n = el.get("name")
            if not n or n in seen or n == "form-name":
                continue
            seen.add(n)
            t = el.get("type", "text") if el.name == "input" else el.name
            if el.name == "select":
                opts = "".join(f"<option value=\"{o.get('value', text(o))}\">{text(o)}</option>" for o in el.find_all("option"))
                fields.append(f"<select name=\"{n}\">{opts}</select>")
            elif el.name == "textarea":
                fields.append(f"<textarea name=\"{n}\"></textarea>")
            else:
                if t in ("submit", "button", "reset"):
                    continue
                t = "hidden" if n == "_honey" else t
                fields.append(f"<input type=\"{t}\" name=\"{n}\">")
        parts.append(f"<form name=\"{name}\" method=\"POST\" data-netlify=\"true\" netlify-honeypot=\"_honey\">"
                     f"<input type=\"hidden\" name=\"form-name\" value=\"{name}\">" + "".join(fields) + "</form>")
    parts.append("</body></html>")
    return "\n".join(parts)


# ----------------------------------------------------------------------------
# Mises à jour éditoriales postérieures au 24/09/2026 (faits devenus inexacts)
# ----------------------------------------------------------------------------
UPDATES = [
    # 28/09/2026 au soir : nouveau logo « Les Pas vers l'Avenir » ; la page d'identité précédente reçoit une note datée.
    ('<div class="eyebrow">Le logo</div>\n<h2>Un cercle, deux pas, deux mains</h2>',
     '<p class="form-note"><strong>Mise à jour du 28 septembre 2026\u00a0:</strong> l’association a adopté un nouveau logo, «\u00a0Les Pas vers l’Avenir\u00a0» — trois empreintes qui avancent vers un soleil levant —, commun à l’association et à son projet ODEB LONODJI\u00a0: voir <a href="/odeb/identite">l’identité visuelle</a>. Cette page décrit l’identité précédente (logo bleu, couleurs, signes), qui reste celle des documents publiés avant cette date.</p>\n<div class="eyebrow">Le logo</div>\n<h2>Un cercle, deux pas, deux mains</h2>'),
    # Le domaine lonodji.org est en service depuis le 27/09/2026 ; les adresses e-mail ne le sont pas encore.
    ("Le nom de domaine lonodji.org, que nous annoncions, n’est pas enregistré à ce jour\u00a0: les adresses qui y étaient rattachées ne reçoivent rien. Nous publierons ici les nouvelles adresses dès qu’elles fonctionneront.",
     "Le nom de domaine lonodji.org est en service depuis le 27 septembre 2026, mais aucune adresse électronique n’y est encore rattachée. Nous publierons ici les adresses dès qu’elles fonctionneront."),
    ("Le nom de domaine lonodji.org, que nous annoncions comme réservé, n’est pas enregistré à ce jour, et les adresses qui y étaient rattachées ne reçoivent rien\u00a0: nous publierons les nouvelles adresses ici dès qu’elles fonctionneront.",
     "Le nom de domaine lonodji.org héberge le site depuis le 27 septembre 2026, mais aucune adresse électronique n’y est encore rattachée\u00a0: nous publierons les adresses ici dès qu’elles fonctionneront."),
    # Projet d'application : la réserve sur l'aperçu partagé n'a plus lieu d'être ; l'état des applis du 24/09 est daté.
    ('<p class="form-note">Une réserve d’honnêteté\xa0: sur l’aperçu actuel du site, l’installation hors ligne est <strong>volontairement désactivée</strong>. Le site y est servi depuis un domaine partagé avec d’autres\xa0; y installer un cache serait s’approprier un espace qui n’est pas le nôtre, et l’aperçu doit montrer exactement le fichier publié. La lecture hors ligne s’activera d’elle-même le jour où le site vivra sur le nom de domaine de l’association — qui reste à acquérir.</p>',
     '<p class="form-note"><strong>Mise à jour du 28 septembre 2026\xa0:</strong> le site vit sur lonodji.org depuis le 27 septembre, et la lecture hors ligne y est active. Une première version d’essai de l’application Android (1.0.0) et le projet de l’application iPhone ont été préparés le 24 septembre 2026\xa0; leur publication sur Google Play et sur l’App Store attend, comme cette page le prévoit, le récépissé de l’association et l’ouverture des comptes en son nom.</p>'),
    # Plaidoyers : lettres de transmission préparées le 24/09, en attente de signature (note datée).
    ('<p class="form-note">Statuts\xa0: <span class="plea-status st-publie">Publié</span> le texte est en ligne · <span class="plea-status st-envoye">Envoyé</span> transmis officiellement aux destinataires · <span class="plea-status st-reponse">Réponse reçue</span> une réponse écrite est arrivée et publiée · <span class="plea-status st-obtenu">Obtenu</span> une décision ou un chantier concret a suivi. Cette page est mise à jour à chaque étape.</p>',
     '<p class="form-note">Statuts\xa0: <span class="plea-status st-publie">Publié</span> le texte est en ligne · <span class="plea-status st-envoye">Envoyé</span> transmis officiellement aux destinataires · <span class="plea-status st-reponse">Réponse reçue</span> une réponse écrite est arrivée et publiée · <span class="plea-status st-obtenu">Obtenu</span> une décision ou un chantier concret a suivi. Cette page est mise à jour à chaque étape.</p>\n<p class="form-note"><strong>Mise à jour du 28 septembre 2026\xa0:</strong> les lettres de transmission des huit plaidoyers — au ministre concerné, avec copie aux services, aux partenaires et aux autorités du Mandoul Occidental — ont été préparées le 24 septembre 2026 et attendent la signature du bureau. La date d’envoi de chaque dossier sera inscrite dans ce tableau dès la transmission.</p>'),
    # Redevabilité : politiques d'intégrité en projet (23/09), non adoptées (note datée).
    ('<p style="margin-top:1.3rem;">Une règle vaut pour tout ce qui précède, et c’est celle que nous appliquons depuis la première page de ce site\xa0: <strong>nous publions nos sources, et nous écrivons ce que nous ne savons pas</strong>. La transparence sur nos lacunes est la seule garantie sérieuse que nous ne racontons pas ce qui nous arrange.</p>',
     '<p style="margin-top:1.3rem;">Une règle vaut pour tout ce qui précède, et c’est celle que nous appliquons depuis la première page de ce site\xa0: <strong>nous publions nos sources, et nous écrivons ce que nous ne savons pas</strong>. La transparence sur nos lacunes est la seule garantie sérieuse que nous ne racontons pas ce qui nous arrange.</p>\n<p class="form-note"><strong>Mise à jour du 28 septembre 2026\xa0:</strong> cinq politiques d’intégrité écrites — conflits d’intérêts, fraude et corruption, données personnelles, achats et dépenses, exploitation et abus sexuels — ont été rédigées en projet le 23 septembre 2026 et sont soumises au bureau exécutif. Elles seront publiées sur cette page une fois adoptées\xa0; d’ici là, seules les règles ci-dessus engagent l’association.</p>'),
    # Mentions légales : seizième formulaire, le répertoire des compétences de la diaspora (28/09/2026).
    ("<p>Le site compte quinze formulaires. Ils ne servent pas tous à la même chose",
     "<p>Le site compte vingt formulaires. Ils ne servent pas tous à la même chose"),
    ('aria-label="Les quinze formulaires du site et le sort de vos données"',
     'aria-label="Les vingt formulaires du site et le sort de vos données"'),
    ("<p>Pour dix de ces formulaires, un compteur anonyme tient le nombre total d’envois\u00a0; pour le signalement des besoins, il retient aussi la localité, le type de besoin et l’urgence, quand vous acceptez la publication.",
     "<p>Pour quinze de ces formulaires, un compteur anonyme tient le nombre total d’envois, publié sur le <a href=\"/impact\">tableau de bord</a>\u00a0; pour le signalement des besoins, il retient aussi la localité, le type de besoin et l’urgence, quand vous acceptez la publication\u00a0; pour le répertoire des compétences, le nombre de pays et de domaines représentés, sans autre détail."),
    ('<tr><th scope="row"><a href="/dossiers/lieux-sacres#signalement">Lieu sacré menacé</a>',
     '<tr><th scope="row"><a href="/diaspora#inscription">Répertoire des compétences</a><span class="notice-page">Diaspora</span></th><td>Nom, e-mail, téléphone facultatif, pays et ville, lien avec Bédjondo, domaines et métier, expérience, ce que vous offrez, thématique, langues, disponibilité, message</td><td>Trouver la compétence qu’une thématique ou un plaidoyer attend, et vous proposer une mission</td><td>Tant que votre inscription est active, revue chaque année\u00a0; nom, métier et pays publiés dans l’annuaire seulement avec votre accord, le reste jamais</td></tr>'
     '<tr><th scope="row"><a href="/bibliotheque#deposer">Dépôt de document</a><span class="notice-page">Bibliothèque</span></th><td>Titre, auteurs, année, type, langue, résumé, lien, fichier (10 Mo au plus), droits déclarés, choix de publication, nom, contact, message</td><td>Vérifier la référence et les droits, puis l’ajouter à la bibliothèque selon votre choix</td><td>Conservé comme archive tant que vous ne le retirez pas\u00a0; votre nom n’est publié qu’avec votre accord</td></tr>'
     '<tr><th scope="row"><a href="/langue#dictionnaire">Un mot en nangnda</a><span class="notice-page">Langue</span></th><td>Mot, catégorie, sens, exemple et traduction, enregistrement (10 Mo au plus), variante, source, nom, contact facultatif, choix de publication</td><td>Vérifier le mot avec les linguistes et l’ajouter au dictionnaire numérique</td><td>Conservé comme source du dictionnaire\u00a0; publié avec ou sans votre nom selon votre choix, retrait possible</td></tr>'
     '<tr><th scope="row"><a href="/projets#proposer">Proposition de projet</a><span class="notice-page">Projets</span></th><td>Nom du projet, localité, domaine, besoin, proposition, ordre de grandeur du coût, nom, lien avec le projet, contact, choix de publication</td><td>Instruire la proposition avec la thématique concernée et vous répondre</td><td>Conservée le temps de l’instruction, puis comme archive du projet\u00a0; votre nom n’est publié qu’avec votre accord</td></tr>'
     '<tr><th scope="row"><a href="/temoignages#envoyer">Témoignage, photo ou enregistrement</a><span class="notice-page">Racontez Bédjondo</span></th><td>Type de récit, titre, récit, fichier joint (photo, son, vidéo, 10 Mo au plus), lieu et date, nom, qualité, contact, localité, choix de publication, accords (personnes citées, mineurs)</td><td>Vérifier le récit avec vous, le publier selon votre choix, constituer la banque d’images et les archives de l’association</td><td>Conservé comme archive tant que vous ne le retirez pas\u00a0; publié seulement après votre relecture, avec ou sans votre nom selon votre choix</td></tr>'
     '<tr><th scope="row"><a href="/dossiers/lieux-sacres#signalement">Lieu sacré menacé</a>'),
    # 28/09/2026 : le sigle ODEB se développe désormais « Organisation pour le Développement et l’Émergence
    # Bedjonde » (projet ODEB LONODJI, vision 2030) ; les trois pages qui citaient l'ancien développement renvoient au projet.
    ("vers <strong>ODEB</strong> (Organisation de Développement et d’Entraide des Bedjond). Aucun dossier n’est, à notre connaissance, déposé — voir <a href=\"#vers-ong\">Vers le statut d’ONG</a>.</p>",
     "vers <strong>ODEB LONODJI</strong> (Organisation pour le Développement et l’Émergence Bedjonde, développement retenu le 28 septembre 2026 — voir <a href=\"/odeb\">le projet ODEB LONODJI</a>). Aucun dossier n’est, à notre connaissance, déposé — voir <a href=\"#vers-ong\">Vers le statut d’ONG</a>.</p>"),
    ("vers <strong>ODEB</strong> (Organisation de Développement et d’Entraide des Bedjond). Aucun dossier n’est, à notre connaissance, déposé — voir <a href=\"/dossiers/demarches#vers-ong\">Vers le statut d’ONG</a>.</p>",
     "vers <strong>ODEB LONODJI</strong> (Organisation pour le Développement et l’Émergence Bedjonde, développement retenu le 28 septembre 2026 — voir <a href=\"/odeb\">le projet ODEB LONODJI</a>). Aucun dossier n’est, à notre connaissance, déposé — voir <a href=\"/dossiers/demarches#vers-ong\">Vers le statut d’ONG</a>.</p>"),
    ("l’association prendra alors le nom d’<strong>ODEB</strong> — Organisation de Développement et d’Entraide des Bedjond — en cohérence avec son nouveau statut. Le nom ADEB LONODJI reste, à ce jour, celui de l’association telle qu’elle existe\u00a0; ODEB est le nom prévu pour l’ONG à venir, pas encore effectif.</p>",
     "l’association prendra alors le nom d’<strong>ODEB LONODJI</strong> — Organisation pour le Développement et l’Émergence Bedjonde — en cohérence avec son nouveau statut. Le nom ADEB LONODJI reste, à ce jour, celui de l’association telle qu’elle existe\u00a0; ODEB est le nom prévu pour l’ONG à venir, pas encore effectif.</p>\n<p class=\"form-note\"><strong>Mise à jour du 28 septembre 2026\u00a0:</strong> le développement du sigle, que nous écrivions «\u00a0Organisation de Développement et d’Entraide des Bedjond\u00a0», est désormais «\u00a0Organisation pour le Développement et l’Émergence Bedjonde\u00a0», conformément au projet ODEB LONODJI présenté ce jour — vision 2030, six missions, cinq programmes et livre blanc en version de travail, sur <a href=\"/odeb\">sa page</a>. Le statut, lui, n’a pas changé\u00a0: aucun dossier déposé.</p>"),
    # Redevabilité : le nombre de formulaires (vingt au 28/09/2026)
    ("Le site compte quinze formulaires, dont les réponses sont enregistrées par Netlify", "Le site compte vingt formulaires, dont les réponses sont enregistrées par Netlify"),
    # Journal des corrections : le nom du coordonnateur de Culture & patrimoine vivant, mal orthographié le 28/09.
    ('seulement les cas où <strong>nous avons affirmé quelque chose d’inexact</strong>.</p>\n<article class="info-card">\n<p class="form-note">24 septembre 2026 · Identité',
     'seulement les cas où <strong>nous avons affirmé quelque chose d’inexact</strong>.</p>\n<article class="info-card">\n<p class="form-note">28 septembre 2026 · Nom · Relevé par l’intéressé, corrigé dans l’heure</p>\n<h3>Le nom du coordonnateur de Culture &amp; patrimoine vivant était mal orthographié</h3>\n<p><strong>Ce que nous écrivions\u00a0:</strong> en annonçant, le 28 septembre en fin de matinée, que la thématique Culture &amp; patrimoine vivant était confiée à un nouveau coordonnateur, nous avons écrit son nom «\u00a0Madjirabé\u00a0» sur la page Nos actions, le suivi, la page anglaise et l’outil «\u00a0Trouver ma thématique\u00a0».</p>\n<p><strong>Ce qui est exact\u00a0:</strong> le Dr Yaphete Madjiradé. Toutes les pages sont corrigées.</p>\n<p><strong>Comment nous nous en sommes aperçus\u00a0:</strong> par la comparaison, moins d’une heure après la mise en ligne, avec une liste de chercheurs du pays bedjond transmise à l’animation, où le nom est correctement écrit\u00a0; l’animation l’a confirmé.</p>\n</article>\n<article class="info-card">\n<p class="form-note">24 septembre 2026 · Identité'),
    # Journal des corrections : l'entrée du 23/09 reste telle quelle ; une mise à jour datée la complète.
    ("<p><strong>Comment nous nous en sommes aperçus\u00a0:</strong> un audit complet du site, le 23 septembre, qui a interrogé le registre du .org et l’annuaire RDAP, sans réponse pour lonodji.org, puis relu la notice à la lumière des formulaires réellement en service.</p>",
     "<p><strong>Comment nous nous en sommes aperçus\u00a0:</strong> un audit complet du site, le 23 septembre, qui a interrogé le registre du .org et l’annuaire RDAP, sans réponse pour lonodji.org, puis relu la notice à la lumière des formulaires réellement en service.</p>\n<p><strong>Mise à jour du 28 septembre 2026\u00a0:</strong> le nom de domaine lonodji.org a depuis été enregistré et héberge le site depuis le 27 septembre. Les adresses électroniques restent à créer\u00a0; le formulaire et WhatsApp demeurent les deux voies sûres.</p>"),
]


# Mises à jour de la source AVANT analyse (structure, scripts et pages) : décisions de
# l'association postérieures à l'export de l'ancien site, datées dans le texte.
UPDATES_SOURCE = [
    # 28/09/2026 : les pôles ont des directeurs (rang de chef de projet) ; le formulaire de contact les propose.
    ('<option data-objet="thematique">Rejoindre une thématique, ou la coordonner</option>',
     '<option data-objet="thematique">Rejoindre une thématique, la coordonner, ou diriger un pôle</option>'),
    ('<legend>Si vous voulez rejoindre une thématique</legend>',
     '<legend>Si vous voulez rejoindre une thématique ou diriger un pôle</legend>'),
    ('<label for="pole">Thématique</label>\n              <select id="pole" name="pole">\n                <option value="">Choisir une thématique (optionnel)</option>',
     '<label for="pole">Thématique, ou direction d’un pôle</label>\n              <select id="pole" name="pole">\n                <option value="">Choisir une thématique ou un pôle (optionnel)</option>\n'
     '                <optgroup label="Direction d’un pôle — rang de chef de projet">\n'
     '                  <option>Direction du pôle I — Mémoire, culture &amp; patrimoine</option>\n'
     '                  <option>Direction du pôle II — Développement humain &amp; moyens d’existence</option>\n'
     '                  <option>Direction du pôle III — Gouvernance, paix &amp; plaidoyer</option>\n'
     '                  <option>Direction du pôle IV — Numérique &amp; innovation</option>\n'
     '                </optgroup>'),
    ('<label for="coordo">Je candidate pour être coordonnateur de cette thématique</label>',
     '<label for="coordo">Je candidate pour coordonner cette thématique, ou pour diriger ce pôle</label>'),
    # 28/09/2026 : la coordination de Culture & patrimoine vivant est confiée au Dr Yaphete Madjiradé.
    ('<span class="coord-qui">Félix Mbété Nangmbatnan</span>', '<span class="coord-qui">Dr Yaphete Madjiradé</span>'),
    ('<p class="coord">Coordonnateur&nbsp;: Félix Mbété Nangmbatnan</p>', '<p class="coord">Coordonnateur&nbsp;: Dr Yaphete Madjiradé</p>'),
    ('<p class="coord">Coordinator: F&eacute;lix Mb&eacute;t&eacute; Nangmbatnan</p>', '<p class="coord">Coordinator: Dr Yaphete Madjirad&eacute;</p>'),
    ('"coord": "Coordonnateur : Félix Mbété Nangmbatnan",', '"coord": "Coordonnateur : Dr Yaphete Madjiradé",'),
    # 28/09/2026 : objet « Le projet ODEB LONODJI » dans le formulaire de contact (remarques sur le livre blanc)
    ('              <option data-objet="partenariat">Partenariat, presse ou recherche</option>\n',
     '              <option data-objet="odeb">Le projet ODEB LONODJI (livre blanc, remarques, contributions)</option>\n              <option data-objet="partenariat">Partenariat, presse ou recherche</option>\n'),
    # 28/09/2026 : la page anglaise renvoie au projet ODEB LONODJI et ne parle plus de « thirteen themes still open »
    ('      <div class="eyebrow">How to help</div>\n      <h2>Join, give, share your skills, spread the word</h2>\n',
     '      <div class="eyebrow">Vision 2030</div>\n      <h2>The ODEB LONODJI project</h2>\n      <p>On 28 September 2026, forty years after its founding reflections of 1986, the association launched the ODEB LONODJI reflection: a project to give the Bedjond country a permanent organisation for research, documentation, territorial development, innovation, heritage and diaspora mobilisation by 2030. Six missions, six programmes, a roadmap and a white paper (working draft, in French). <a href="odeb.html">Read the summary in English &rarr;</a></p>\n      <div class="eyebrow">How to help</div>\n      <h2>Join, give, share your skills, spread the word</h2>\n'),
    ('coordinate one of the thirteen themes still open,', 'coordinate one of the themes still open (see the list on the themes page), lead one of the pillars still without a Pillar Lead (programme-manager level; posts created on 28 September 2026, see the themes page),'),
    # 28/09/2026 : chiffres figés de l'ancien site devenus inexacts (inspection de cohérence)
    ('The full site, the journal (29 articles), the research base', 'The full site, the journal, the research base'),
    ('<p>The full site, the journal, the research base and all PDFs are in French: <a href="../index.html">visit the French site</a>.</p>',
     '<p>Also in English: <a href="villages.html">find your village</a> (fourteen units, 966 localities), <a href="projects.html">the projects and their stage</a>, <a href="impact.html">the impact dashboard</a>, <a href="sectors.html">our sectors (WASH, health, relief…)</a>, <a href="odeb.html">the ODEB project</a>, <a href="https://lonodji.org/en/governance">local governance: who decides what</a> and <a href="https://lonodji.org/en/commune">our proposals to the commune</a>. The full site, the journal, the research base and all PDFs are in French: <a href="../index.html">visit the French site</a>.</p>'),
    ('        <span class="bento-num">38</span>\n        <span class="bento-label">références réunies à ce jour</span>', '        <span class="bento-num">40</span>\n        <span class="bento-label">références réunies à ce jour</span>'),
    # nominations de coordonnateurs : générées depuis NOMINATIONS (voir plus bas), ajoutées à l'exécution
    # la tuile « à pourvoir » pointait vers la thématique 04, désormais pourvue
    ('<a class="bento-tile" href="#agriculture-elevage-securite-alimentaire" aria-label="13 thématiques', '<a class="bento-tile" href="#entrepreneuriat-finance-inclusive" aria-label="13 thématiques'),
    # suivi : Jeunesse & réussite a désormais sa coordination
    ('<p>Ces quatre thématiques ont des problématiques documentées <strong>et</strong> un plaidoyer déjà publié&nbsp;: <a href="poles.html#eau-energie-connectivite">Eau, énergie &amp; connectivité</a> &middot; <a href="poles.html#desenclavement-urbanisation">Désenclavement &amp; urbanisation</a> &middot; <a href="poles.html#jeunesse-reussite">Jeunesse &amp; réussite</a> &middot; <a href="poles.html#gouvernance-plaidoyer">Gouvernance &amp; plaidoyer</a>. Il ne leur manque qu&rsquo;un coordonnateur ou une coordonnatrice pour suivre les dossiers et relancer les destinataires.</p>',
     '<p>Ces deux thématiques ont des problématiques documentées <strong>et</strong> un plaidoyer déjà publié&nbsp;: <a href="poles.html#eau-energie-connectivite">Eau, énergie &amp; connectivité</a> &middot; <a href="poles.html#desenclavement-urbanisation">Désenclavement &amp; urbanisation</a>. Il ne leur manque qu&rsquo;un coordonnateur ou une coordonnatrice pour suivre les dossiers et relancer les destinataires. <a href="poles.html#jeunesse-reussite">Jeunesse &amp; réussite</a> et <a href="poles.html#gouvernance-plaidoyer">Gouvernance &amp; plaidoyer</a>, qui étaient dans le même cas, ont leur coordination depuis le 28 septembre 2026.</p>'),
    # comptes : quinze pourvues, quatre à pourvoir (28/09/2026)
    ('pas encore de coordonnateur pour quinze de ses dix-neuf th&eacute;matiques', 'pas encore de coordonnateur pour quatre de ses dix-neuf th&eacute;matiques'),
    ('aria-label="6 coordonnateurs en poste — voir les thématiques pourvues">\n        <span class="bento-num">6</span>',
     'aria-label="15 coordonnateurs en poste — voir les thématiques pourvues">\n        <span class="bento-num">15</span>'),
    ('Santé &amp; prévention, Protection sociale &amp; inclusion</span>', 'Agriculture, élevage &amp; sécurité alimentaire, Jeunesse &amp; réussite, Santé &amp; prévention, Protection sociale &amp; inclusion, Gouvernance &amp; plaidoyer, Paix &amp; cohésion, Réseau d&rsquo;experts &amp; diaspora, Justice &amp; droits humains, Transformation numérique &amp; services, Intelligence artificielle &amp; données, Compétences &amp; entrepreneuriat numérique</span>'),
    ('aria-label="13 thématiques encore à pourvoir — se porter volontaire">\n        <span class="bento-num">13</span>',
     'aria-label="4 thématiques encore à pourvoir — se porter volontaire">\n        <span class="bento-num">4</span>'),
    ('<p>Treize des dix-neuf thématiques d&rsquo;ADEB LONODJI n&rsquo;ont pas encore de coordon', '<p>Quatre des dix-neuf thématiques d&rsquo;ADEB LONODJI n&rsquo;ont pas encore de coordon'),
    ('<p>Treize thématiques attendent un coordonnateur ou une coordonnatrice.', '<p>Quatre thématiques attendent un coordonnateur ou une coordonnatrice.'),
    ('<p>Dix-neuf thématiques, et treize attendent encore leur coordonnateur.</p>', '<p>Dix-neuf thématiques, et quatre attendent encore leur coordonnateur.</p>'),
    ('pourvoir les treize thématiques encore sans coordonnateur', 'pourvoir les quatre thématiques encore sans coordonnateur'),
    ('<p class="lede">Treize des dix-neuf thématiques d&rsquo;ADEB LONODJI cherchent encore un coordonnateur', '<p class="lede">Quatre des dix-neuf thématiques d&rsquo;ADEB LONODJI cherchent encore un coordonnateur'),
    ('<p>Treize thématiques et deux cellules cherchent des coordonnateurs et des membres actifs.', '<p>Quatre thématiques et une cellule cherchent des coordonnateurs et des membres actifs.'),
    ('où vous seriez le plus utile. Treize attendent un coordonnateur."', 'où vous seriez le plus utile. Quatre attendent un coordonnateur."'),
    ('<p class="lede">Dix-neuf th&eacute;matiques, dont treize sans coordonnateur.', '<p class="lede">Dix-neuf th&eacute;matiques, dont quatre sans coordonnateur.'),
    ('<span class="hero-pill">Treize th&eacute;matiques &agrave; pourvoir</span>', '<span class="hero-pill">Quatre th&eacute;matiques &agrave; pourvoir</span>'),
]
# Nominations de coordonnateurs postérieures à l'export : une ligne par thématique.
# (ancre, nom FR (html), nom EN (html), nom dans trouver.js, pôle FR (html), coordonnateur FR, coordonnateur EN (html), note FR, note EN)
BIG = "Bignéro Moïalbéi LE MADANG"
BIG_EN = "Bign&eacute;ro Mo&iuml;alb&eacute;i LE MADANG"
NOTE_P4_FR = " <strong>Mise à jour du 28 septembre 2026&nbsp;:</strong> les trois thématiques du pôle Numérique &amp; innovation sont confiées à Bignéro Moïalbéi LE MADANG, animateur général de l&rsquo;association."
NOTE_P4_EN = " <strong>Update, 28 September 2026:</strong> the three themes of the Digital &amp; Innovation pole are now coordinated by " + BIG_EN + ", the association&rsquo;s general facilitator."
NOMINATIONS = [
    ("transformation-numerique-services", "Transformation numérique &amp; services", "Digital Transformation &amp; Services", "Transformation numérique & services", "Numérique &amp; innovation", BIG, BIG_EN, NOTE_P4_FR, NOTE_P4_EN),
    # 30/09/2026 : Bonheur Allahaddje succède à Bignéro Moïalbéi LE MADANG ; la note du 28/09 reste, datée.
    ("intelligence-artificielle-donnees", "Intelligence artificielle &amp; données", "Artificial Intelligence &amp; Data", "Intelligence artificielle & données", "Numérique &amp; innovation",
     "Bonheur Allahaddje", "Bonheur Allahaddje",
     NOTE_P4_FR + " <strong>Mise à jour du 30 septembre 2026&nbsp;:</strong> la coordination de cette thématique est confiée à Bonheur Allahaddje, qui succède à Bignéro Moïalbéi LE MADANG.",
     NOTE_P4_EN + " <strong>Update, 30 September 2026:</strong> this theme is now coordinated by Bonheur Allahaddje, who succeeds " + BIG_EN + "."),
    # 30/09/2026 : Rosine Mbaïnodoum succède à Bignéro Moïalbéi LE MADANG ; la note du 28/09 reste, datée.
    ("competences-entrepreneuriat-numerique", "Compétences &amp; entrepreneuriat numérique", "Digital Skills &amp; Entrepreneurship", "Compétences & entrepreneuriat numérique", "Numérique &amp; innovation",
     "Rosine Mbaïnodoum", "Rosine Mba&iuml;nodoum",
     NOTE_P4_FR + " <strong>Mise à jour du 30 septembre 2026&nbsp;:</strong> la coordination de cette thématique est confiée à Rosine Mbaïnodoum, qui succède à Bignéro Moïalbéi LE MADANG.",
     NOTE_P4_EN + " <strong>Update, 30 September 2026:</strong> this theme is now coordinated by Rosine Mba&iuml;nodoum, who succeeds " + BIG_EN + "."),
    ("agriculture-elevage-securite-alimentaire", "Agriculture, élevage &amp; sécurité alimentaire", "Agriculture, Livestock &amp; Food Security", "Agriculture, élevage & sécurité alimentaire", "Développement humain &amp; moyens d’existence",
     "Olivier Allaramadji Nomaye, ingénieur agroéconomiste", "Olivier Allaramadji Nomaye, agricultural economist",
     " <strong>Mise à jour du 28 septembre 2026&nbsp;:</strong> la coordination de la thématique est confiée à Olivier Allaramadji Nomaye, ingénieur agroéconomiste.",
     " <strong>Update, 28 September 2026:</strong> the theme is now coordinated by Olivier Allaramadji Nomaye, agricultural economist."),
    ("jeunesse-reussite", "Jeunesse &amp; réussite", "Youth &amp; Achievement", "Jeunesse & réussite", "Développement humain &amp; moyens d’existence",
     "Bruno Kodjadoum NGARTEL", "Bruno Kodjadoum NGARTEL",
     " <strong>Mise à jour du 28 septembre 2026&nbsp;:</strong> la coordination de la thématique est confiée à Bruno Kodjadoum NGARTEL.",
     " <strong>Update, 28 September 2026:</strong> the theme is now coordinated by Bruno Kodjadoum NGARTEL."),
    ("paix-cohesion", "Paix &amp; cohésion", "Peace &amp; Social Cohesion", "Paix & cohésion", "Gouvernance, paix &amp; plaidoyer",
     "Sa Majesté Moulbe Brahim Nadoumbeye, chef de canton de Bébopen", "His Majesty Moulbe Brahim Nadoumbeye, canton chief of B&eacute;bopen",
     " <strong>Mise à jour du 28 septembre 2026&nbsp;:</strong> la coordination de la thématique est confiée à Sa Majesté Moulbe Brahim Nadoumbeye, chef de canton de Bébopen.",
     " <strong>Update, 28 September 2026:</strong> the theme is now coordinated by His Majesty Moulbe Brahim Nadoumbeye, canton chief of B&eacute;bopen."),
    ("justice-droits-homme", "Justice &amp; droits humains", "Justice &amp; Human Rights", "Justice & droits humains", "Gouvernance, paix &amp; plaidoyer",
     "Dr Eugène Ngartebaye Le Yotha", "Dr Eug&egrave;ne Ngartebaye Le Yotha",
     " <strong>Mise à jour du 28 septembre 2026&nbsp;:</strong> la coordination de la thématique est confiée au Dr Eugène Ngartebaye Le Yotha.",
     " <strong>Update, 28 September 2026:</strong> the theme is now coordinated by Dr Eug&egrave;ne Ngartebaye Le Yotha."),
    ("gouvernance-plaidoyer", "Gouvernance &amp; plaidoyer", "Governance &amp; Advocacy", "Gouvernance & plaidoyer", "Gouvernance, paix &amp; plaidoyer",
     "Adoumbé Maoura, président de l’association", "Adoumb&eacute; Maoura, president of the association",
     " <strong>Mise à jour du 28 septembre 2026&nbsp;:</strong> la coordination de la thématique est confiée à Adoumbé Maoura, président de l&rsquo;association.",
     " <strong>Update, 28 September 2026:</strong> the theme is now coordinated by Adoumb&eacute; Maoura, president of the association."),
    ("reseau-experts-diaspora", "Réseau d&rsquo;experts &amp; diaspora", "Expert Network &amp; Diaspora", "Réseau d’experts & diaspora", "Gouvernance, paix &amp; plaidoyer",
     "Edgard Djerassem Djimhotengar", "Edgard Djerassem Djimhotengar",
     " <strong>Mise à jour du 28 septembre 2026&nbsp;:</strong> la coordination de la thématique est confiée à Edgard Djerassem Djimhotengar.",
     " <strong>Update, 28 September 2026:</strong> the theme is now coordinated by Edgard Djerassem Djimhotengar."),
    # 30/09/2026 : thématique 05, jusqu'ici à pourvoir
    ("entrepreneuriat-finance-inclusive", "Entrepreneuriat &amp; finance inclusive", "Entrepreneurship &amp; Inclusive Finance", "Entrepreneuriat & finance inclusive", "Développement humain &amp; moyens d’existence",
     "Tamar Neloum DOUMANBE", "Tamar Neloum DOUMANBE",
     " <strong>Mise à jour du 30 septembre 2026&nbsp;:</strong> la coordination de la thématique est confiée à Tamar Neloum DOUMANBE.",
     " <strong>Update, 30 September 2026:</strong> the theme is now coordinated by Tamar Neloum DOUMANBE."),
    # cellule transversale : mêmes gabarits (tableau, carte, page anglaise, trouver.js), pas de fiche de suivi
    ("cellule-communication-numerique", "Communication &amp; numérique", "Communication &amp; Digital", "Communication & numérique", "Un appui à toutes les thématiques",
     "Djimtebaye Mahamat Mamadou Banadji", "Djimtebaye Mahamat Mamadou Banadji",
     " <strong>Mise à jour du 28 septembre 2026&nbsp;:</strong> la coordination de la cellule est confiée à Djimtebaye Mahamat Mamadou Banadji.",
     " <strong>Update, 28 September 2026:</strong> the unit is now coordinated by Djimtebaye Mahamat Mamadou Banadji."),
]


# Coordinatrices parmi les NOMINATIONS : libellé « Coordonnatrice » (l'anglais « Coordinator » est neutre).
COORDINATRICES = {"competences-entrepreneuriat-numerique", "entrepreneuriat-finance-inclusive"}
def libelle_coord(anc: str) -> str:
    return "Coordonnatrice" if anc in COORDINATRICES else "Coordonnateur"


def nominations_source() -> list[tuple[str, str]]:
    """Remplacements de source pour chaque nomination : tableau, carte, suivi, page anglaise, trouver.js."""
    out = []
    for anc, fr, en, js, pole, qui, qui_en, _nf, _ne in NOMINATIONS:
        lib = libelle_coord(anc)
        out += [
            (f'<a class="coord-row" href="poles.html#{anc}"><span class="coord-etat">&Agrave; pourvoir</span><span class="coord-nom">{fr}</span><span class="coord-pole">{pole}</span><span class="coord-qui coord-qui--vide">&mdash;</span></a>',
             f'<a class="coord-row" href="poles.html#{anc}"><span class="coord-etat coord-etat--ok">Pourvu</span><span class="coord-nom">{fr}</span><span class="coord-pole">{pole}</span><span class="coord-qui">{qui}</span></a>'),
            (f'<span class="pole-status pole-status--vacant">À pourvoir</span>\n          <h3>{fr}</h3>\n          <p class="coord">Coordonnateur&nbsp;: à pourvoir</p>',
             f'<span class="pole-status pole-status--pourvu">Pourvu</span>\n          <h3>{fr}</h3>\n          <p class="coord">{lib}&nbsp;: {qui}</p>'),
            (f'<span class="pole-status pole-status--vacant">À pourvoir</span><h3><a href="poles.html#{anc}">{fr}</a></h3>',
             f'<span class="pole-status pole-status--pourvu">Pourvu</span><h3><a href="poles.html#{anc}">{fr}</a></h3><p class="coord">{lib}&nbsp;: {qui}</p>'),
            (f'<span class="pole-status pole-status--vacant">Open</span>\n          <h3>{en}</h3>\n          <p class="coord">Coordinator: to be appointed</p>',
             f'<span class="pole-status pole-status--pourvu">Coordinator in post</span>\n          <h3>{en}</h3>\n          <p class="coord">Coordinator: {qui_en}</p>'),
            (f'"name": "{js}",\n    "status": "open",\n    "coord": "Coordonnateur : à pourvoir",',
             f'"name": "{js}",\n    "status": "filled",\n    "coord": "{lib} : {qui}",'),
        ]
    return out


NOTES_COORDINATION = [
    # (marqueur dans la source, note ajoutée à la fin de la description de la carte, fichiers concernés)
    ('<p class="coord">Coordonnateur&nbsp;: Dr Yaphete Madjiradé</p>', " <strong>Mise à jour du 28 septembre 2026&nbsp;:</strong> la coordination de la thématique est confiée au Dr Yaphete Madjiradé, qui succède à Félix Mbété Nangmbatnan.", ("poles.html",)),
    ('<p class="coord">Coordinator: Dr Yaphete Madjirad&eacute;</p>', " <strong>Update, 28 September 2026:</strong> the theme is now coordinated by Dr Yaphete Madjirad&eacute;, who succeeds F&eacute;lix Mb&eacute;t&eacute; Nangmbatnan.", ("themes.html",)),
] + [(f'<h3>{fr}</h3>\n          <p class="coord">{libelle_coord(_a)}&nbsp;: {qui}</p>', nf, ("poles.html",)) for _a, fr, _en, _js, _p, qui, _qe, nf, _ne in NOMINATIONS] \
  + [(f'<h3>{en}</h3>\n          <p class="coord">Coordinator: {qui_en}</p>', ne, ("themes.html",)) for _a, _fr, en, _js, _p, _q, qui_en, _nf, ne in NOMINATIONS]


# ----------------------------------------------------------------------------
# 29/09/2026 : périmètres élargis (secteurs standards des ONG de développement et
# d'aide) et vingtième thématique « Urgences & risques » dans le pôle II.
# Les articles du journal, datés, restent tels qu'écrits ; tout le reste suit.
# ----------------------------------------------------------------------------
RENOMMAGES_29_09 = [
    # (ancien, nouveau) — HTML et texte brut (trouver.js), FR puis EN
    ("Eau, énergie &amp; connectivité", "Eau, assainissement, énergie &amp; connectivité"),
    ("Eau, énergie & connectivité", "Eau, assainissement, énergie & connectivité"),
    ("Eau, &eacute;nergie &amp; connectivit&eacute;", "Eau, assainissement, &eacute;nergie &amp; connectivit&eacute;"),
    ("Santé &amp; prévention", "Santé, nutrition &amp; prévention"),
    ("Santé & prévention", "Santé, nutrition & prévention"),
    ("Sant&eacute; &amp; pr&eacute;vention", "Sant&eacute;, nutrition &amp; pr&eacute;vention"),
    ("Environnement &amp; ressources naturelles", "Environnement, climat &amp; ressources naturelles"),
    ("Environnement & ressources naturelles", "Environnement, climat & ressources naturelles"),
    ("Protection sociale &amp; inclusion", "Protection sociale, enfance &amp; inclusion"),
    ("Protection sociale & inclusion", "Protection sociale, enfance & inclusion"),
    ("Water, Energy &amp; Connectivity", "Water, Sanitation, Energy &amp; Connectivity"),
    ("Health &amp; Prevention", "Health, Nutrition &amp; Prevention"),
    ("Environment &amp; Natural Resources", "Environment, Climate &amp; Natural Resources"),
    ("Social Protection &amp; Inclusion", "Social Protection, Children &amp; Inclusion"),
    # 29/09/2026, second temps : intitulés alignés sur les activités (07 WASH, 08 infrastructures, 09 éducation, 17 connectivité)
    ("Eau, assainissement, énergie &amp; connectivité", "Eau, assainissement &amp; hygiène"),
    ("Eau, assainissement, énergie & connectivité", "Eau, assainissement & hygiène"),
    ("Eau, assainissement, &eacute;nergie &amp; connectivit&eacute;", "Eau, assainissement &amp; hygi&egrave;ne"),
    ("Désenclavement &amp; urbanisation", "Énergie, routes &amp; urbanisme"),
    ("Désenclavement & urbanisation", "Énergie, routes & urbanisme"),
    ("D&eacute;senclavement &amp; urbanisation", "&Eacute;nergie, routes &amp; urbanisme"),
    ("Jeunesse &amp; réussite", "Éducation, jeunesse &amp; formation"),
    ("Jeunesse & réussite", "Éducation, jeunesse & formation"),
    ("Jeunesse &amp; r&eacute;ussite", "&Eacute;ducation, jeunesse &amp; formation"),
    ("Transformation numérique &amp; services", "Connectivité &amp; services numériques"),
    ("Transformation numérique & services", "Connectivité & services numériques"),
    ("Eau, &eacute;nergie &amp; connectivit&eacute;", "Eau, assainissement &amp; hygi&egrave;ne"),
    ("Transformation num&eacute;rique &amp; services", "Connectivit&eacute; &amp; services num&eacute;riques"),
    ("Water, Sanitation, Energy &amp; Connectivity", "Water, Sanitation &amp; Hygiene"),
    ("Road Access &amp; Urban Growth", "Energy, Roads &amp; Urban Planning"),
    ("Youth &amp; Achievement", "Education, Youth &amp; Training"),
    ("Digital Transformation &amp; Services", "Connectivity &amp; Digital Services"),
]
COMPTES_29_09 = [
    # vingt thématiques, cinq à pourvoir (les quatre d'avant + Urgences & risques)
    ("quatre de ses dix-neuf th&eacute;matiques", "cinq de ses vingt th&eacute;matiques"),
    ("Quatre des dix-neuf thématiques", "Cinq des vingt thématiques"),
    ("<p>Quatre thématiques attendent un coordonnateur", "<p>Cinq thématiques attendent un coordonnateur"),
    ("<p>Dix-neuf thématiques, et quatre attendent encore leur coordonnateur.</p>", "<p>Vingt thématiques, et cinq attendent encore leur coordonnateur.</p>"),
    ("pourvoir les quatre thématiques encore sans coordonnateur", "pourvoir les cinq thématiques encore sans coordonnateur"),
    ("Dix-neuf th&eacute;matiques, dont quatre sans coordonnateur.", "Vingt th&eacute;matiques, dont cinq sans coordonnateur."),
    ("Quatre th&eacute;matiques &agrave; pourvoir</span>", "Cinq th&eacute;matiques &agrave; pourvoir</span>"),
    ("<p>Quatre thématiques et une cellule cherchent", "<p>Cinq thématiques et une cellule cherchent"),
    ("où vous seriez le plus utile. Quatre attendent un coordonnateur.", "où vous seriez le plus utile. Cinq attendent un coordonnateur."),
    ('aria-label="4 thématiques encore à pourvoir — se porter volontaire">\n        <span class="bento-num">4</span>',
     'aria-label="5 thématiques encore à pourvoir — se porter volontaire">\n        <span class="bento-num">5</span>'),
    ("Thirteen of ADEB LONODJI&rsquo;s nineteen themes still have no coordinator.", "Five of ADEB LONODJI&rsquo;s twenty themes still have no coordinator."),
    ("<h2>Six coordinators out of nineteen</h2>", "<h2>Fifteen coordinators out of twenty</h2>"),
    ("thirteen of the nineteen themes have no coordinator today", "five of the twenty themes have no coordinator today"),
    # QA de cohérence du 29/09/2026 : chiffres figés de l'ancien site
    ("le nombre de th&eacute;matiques qui ont un coordonnateur&nbsp;: deux sur dix-neuf.", "le nombre de th&eacute;matiques qui ont un coordonnateur&nbsp;: quinze sur vingt au 29 septembre 2026."),
    ("<p>Dix-neuf fiches, une par thématique&nbsp;:", "<p>Une fiche par thématique (la vingtième, Urgences &amp; risques, créée le 29 septembre 2026, attend encore ses problématiques)&nbsp;:"),
    # 30/09/2026 : Entrepreneuriat & finance inclusive pourvue — seize pourvues, quatre à pourvoir
    ("cinq de ses vingt th&eacute;matiques", "quatre de ses vingt th&eacute;matiques"),
    ("Cinq des vingt thématiques", "Quatre des vingt thématiques"),
    ("<p>Cinq thématiques attendent un coordonnateur", "<p>Quatre thématiques attendent un coordonnateur"),
    ("<p>Vingt thématiques, et cinq attendent encore leur coordonnateur.</p>", "<p>Vingt thématiques, et quatre attendent encore leur coordonnateur.</p>"),
    ("pourvoir les cinq thématiques encore sans coordonnateur", "pourvoir les quatre thématiques encore sans coordonnateur"),
    ("Vingt th&eacute;matiques, dont cinq sans coordonnateur.", "Vingt th&eacute;matiques, dont quatre sans coordonnateur."),
    ("Cinq th&eacute;matiques &agrave; pourvoir</span>", "Quatre th&eacute;matiques &agrave; pourvoir</span>"),
    ("<p>Cinq thématiques et une cellule cherchent", "<p>Quatre thématiques et une cellule cherchent"),
    ("où vous seriez le plus utile. Cinq attendent un coordonnateur.", "où vous seriez le plus utile. Quatre attendent un coordonnateur."),
    ('aria-label="5 thématiques encore à pourvoir — se porter volontaire">\n        <span class="bento-num">5</span>',
     'aria-label="4 thématiques encore à pourvoir — se porter volontaire">\n        <span class="bento-num">4</span>'),
    ('<a class="bento-tile" href="#entrepreneuriat-finance-inclusive" aria-label="', '<a class="bento-tile" href="#environnement-ressources" aria-label="'),
    ('aria-label="15 coordonnateurs en poste — voir les thématiques pourvues">\n        <span class="bento-num">15</span>',
     'aria-label="16 coordonnateurs en poste — voir les thématiques pourvues">\n        <span class="bento-num">16</span>'),
    ("Five of ADEB LONODJI&rsquo;s twenty themes still have no coordinator.", "Four of ADEB LONODJI&rsquo;s twenty themes still have no coordinator."),
    ("<h2>Fifteen coordinators out of twenty</h2>", "<h2>Sixteen coordinators out of twenty</h2>"),
    ("five of the twenty themes have no coordinator today", "four of the twenty themes have no coordinator today"),
]
# « dix-neuf thématiques » et variantes, hors articles (regex, casse conservée)
COMPTES_RE_29_09 = [
    (r"\bdix-neuf(\s+th(?:é|&eacute;)matiques)", r"vingt\1"),
    (r"\bDix-neuf(\s+th(?:é|&eacute;)matiques)", r"Vingt\1"),
    (r"\b19(\s+th(?:é|&eacute;)matiques)", r"20\1"),
    (r"\bdix-neuf(\s+coordinations)", r"vingt\1"),
    (r"\bnineteen(\s+themes)", r"twenty\1"),
    (r"\bNineteen(\s+themes)", r"Twenty\1"),
]
NOTES_PERIMETRE_29_09 = [
    # (titre de la carte après renommage, note ajoutée à la fin de sa description) — poles.html
    ("Eau, assainissement &amp; hygiène",
     " <strong>Mise à jour du 29 septembre 2026&nbsp;:</strong> la thématique devient <strong>Eau, assainissement &amp; hygiène</strong>. L&rsquo;énergie rejoint la thématique 08, Énergie, routes &amp; urbanisme, et la connexion internet la thématique 17, Connectivité &amp; services numériques."),
    ("Énergie, routes &amp; urbanisme",
     " <strong>Mise à jour du 29 septembre 2026&nbsp;:</strong> la thématique, jusqu&rsquo;ici « Désenclavement &amp; urbanisation », réunit désormais les infrastructures&nbsp;: l&rsquo;<strong>énergie</strong> (électricité, solaire, venue de la thématique 07), les routes, les ponts et les pistes, et l&rsquo;urbanisme de Bédjondo."),
    ("Éducation, jeunesse &amp; formation",
     " <strong>Mise à jour du 29 septembre 2026&nbsp;:</strong> la thématique, jusqu&rsquo;ici « Jeunesse &amp; réussite », prend le nom de ce qu&rsquo;elle porte&nbsp;: l&rsquo;<strong>éducation</strong> — l&rsquo;école, le lycée, la formation professionnelle et les plaidoyers qui les concernent — et la jeunesse. Sa coordination ne change pas."),
    ("Connectivité &amp; services numériques",
     " <strong>Mise à jour du 29 septembre 2026&nbsp;:</strong> la thématique, jusqu&rsquo;ici « Transformation numérique &amp; services », reprend la <strong>connectivité</strong> — réseau mobile, haut débit, espace numérique — venue de la thématique 07. Sa coordination ne change pas."),
    ("Santé, nutrition &amp; prévention",
     " <strong>Mise à jour du 29 septembre 2026&nbsp;:</strong> la thématique s&rsquo;élargit à la <strong>nutrition</strong> — dépistage de la malnutrition des jeunes enfants, alimentation des femmes enceintes et allaitantes, lien avec les centres de santé et la thématique Agriculture, élevage &amp; sécurité alimentaire."),
    ("Environnement, climat &amp; ressources naturelles",
     " <strong>Mise à jour du 29 septembre 2026&nbsp;:</strong> la thématique s&rsquo;élargit à l&rsquo;<strong>adaptation au changement climatique</strong> — pratiques agricoles face aux pluies irrégulières, reboisement, protection des berges ; la préparation aux catastrophes relève de la thématique 20, Urgences &amp; risques."),
    ("Protection sociale, enfance &amp; inclusion",
     " <strong>Mise à jour du 29 septembre 2026&nbsp;:</strong> la thématique s&rsquo;élargit à la <strong>protection de l&rsquo;enfance</strong> — enregistrement des naissances, enfants hors de l&rsquo;école, mariages précoces, en lien avec la politique de protection de l&rsquo;association ; l&rsquo;aide d&rsquo;urgence en cas de catastrophe ou d&rsquo;épidémie passe à la thématique 20, Urgences &amp; risques."),
]
URGENCES_CARTE = """
        <article class="pole-card" id="urgences-risques">
          <div class="pole-head-row">
            <span class="pole-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 2.5 20h19z"/><path d="M12 10v4.5"/><path d="M12 17.5h.01"/></svg></span>
            <span class="pole-num">THÉMATIQUE 20</span>
          </div>
          <span class="pole-status pole-status--vacant">À pourvoir</span>
          <h3>Urgences &amp; risques</h3>
          <p class="coord">Coordonnateur&nbsp;: à pourvoir</p>
          <p>Préparer le pays bedjond aux crises plutôt que les subir&nbsp;: inondations de la saison des pluies, épidémies, sécheresse, feux de brousse, arrivée de familles déplacées. Pistes envisagées&nbsp;: cartographier avec les villages les zones inondables et les points d&rsquo;eau exposés&nbsp;; un plan de contingence simple par canton — qui prévenir, où se mettre à l&rsquo;abri, quelles réserves&nbsp;; un réseau d&rsquo;alerte par WhatsApp et par la radio communautaire, qui relaie les alertes officielles&nbsp;; et, quand la crise est là, informer, orienter et recenser les besoins pour les services de l&rsquo;État, la Croix-Rouge du Tchad et les agences humanitaires, plutôt que les doubler. L&rsquo;association ne collecte rien avant d&rsquo;avoir un compte à son nom&nbsp;: une aide d&rsquo;urgence ne passerait que par des circuits vérifiables et publiés. <strong>Thématique créée le 29 septembre 2026</strong>&nbsp;; elle reprend l&rsquo;aide d&rsquo;urgence jusqu&rsquo;ici rattachée à Protection sociale, enfance &amp; inclusion. Rien n&rsquo;est encore engagé.</p>
          <div class="pole-tags"><span class="tag">Urgences</span><span class="tag">Inondations</span><span class="tag">Épidémies</span><span class="tag">Alerte</span></div>
          <div class="pole-odd"><span class="odd-legend">ODD</span><a class="odd-chip" href="odd.html#odd-1" style="--odd-accent:#E5243B;--odd-ink:#ffffff" title="ODD 1 &mdash; Pas de pauvret&eacute; | cible 1.5 &mdash; r&eacute;silience des plus pauvres face aux catastrophes"><span class="odd-num">1</span><span class="odd-name">Pauvret&eacute;</span><span class="odd-cible">1.5</span></a><a class="odd-chip" href="odd.html#odd-11" style="--odd-accent:#FD9D24;--odd-ink:#10181f" title="ODD 11 &mdash; Villes et communaut&eacute;s durables | cible 11.5 &mdash; r&eacute;duire les d&eacute;c&egrave;s et les pertes dus aux catastrophes"><span class="odd-num">11</span><span class="odd-name">Villes</span><span class="odd-cible">11.5</span></a><a class="odd-chip" href="odd.html#odd-13" style="--odd-accent:#3F7E44;--odd-ink:#ffffff" title="ODD 13 &mdash; Lutte contre le changement climatique | cible 13.1 &mdash; r&eacute;silience face aux al&eacute;as climatiques"><span class="odd-num">13</span><span class="odd-name">Climat</span><span class="odd-cible">13.1</span></a></div>
          <div class="pole-hub-links">
          <a class="pole-hub-link" href="besoins.html">Signaler un besoin, localité par localité &rarr;</a>
          <a class="pole-hub-link pole-hub-link--join" href="contact.html?theme=20">Rejoindre cette th&eacute;matique &rarr;</a>
          </div>
        </article>
"""
URGENCES_EN = """
        <article class="pole-card">
          <div class="pole-head-row"><span class="pole-num">THEME 20</span></div>
          <span class="pole-status pole-status--vacant">Open</span>
          <h3>Emergencies &amp; Risks</h3>
          <p class="coord">Coordinator: to be appointed</p>
          <p>Preparing the Bedjond country for crises rather than suffering them: rainy-season floods, epidemics, drought, bush fires, displaced families. Ideas under consideration: mapping flood-prone areas with the villages, a simple contingency plan per canton, an alert network over WhatsApp and community radio, and, when a crisis hits, informing, guiding and recording needs for the State services, the Chad Red Cross and humanitarian agencies rather than duplicating them. Created on 29 September 2026; nothing is committed yet, and no money is collected before the association has an account in its name.</p>
          <div class="pole-hub-links">
          <a class="pole-hub-link" href="../poles.html#urgences-risques">Full description <span lang="fr">en fran&ccedil;ais</span> &rarr;</a>
          </div>
        </article>"""
URGENCES_JS = """  {
    "id": "urgences-risques",
    "num": "20",
    "key": "20",
    "pole": "Pôle II · Thématique 20",
    "name": "Urgences & risques",
    "status": "open",
    "coord": "Coordonnateur : à pourvoir",
    "desc": "Préparer le pays bedjond aux crises : inondations, épidémies, sécheresse ; cartographie des risques, plan de contingence par canton, réseau d’alerte, relais avec l’État et les agences humanitaires.",
    "page": [
      "besoins.html",
      "Carte des besoins"
    ],
    "suivi": false,
    "tier": 3
  },
"""


def structure_29_09(html: str, path: Path) -> str:
    """Applique les décisions du 29/09/2026 à un fichier de l'ancien site (hors articles)."""
    if "articles" in path.parts:
        return html
    for old, new in RENOMMAGES_29_09 + COMPTES_29_09:
        html = html.replace(old, new)
    if path.name != "actualites.html":  # les résumés d'articles, datés, restent tels qu'écrits
        for rx, rep in COMPTES_RE_29_09:
            html = re.sub(rx, rep, html)
    if path.name == "poles.html":
        for titre, note in NOTES_PERIMETRE_29_09:
            i = html.find(f"<h3>{titre}</h3>")
            if i < 0:
                continue
            j = html.find("<p>", i)
            k = html.find("</p>", j)
            if j > 0 and k > 0:
                html = html[:k] + note + html[k:]
        # la carte, après celle de Protection sociale (fin du pôle II)
        i = html.find('<article class="pole-card" id="solidarite-inclusion">')
        k = html.find("</article>", i)
        if i > 0 and k > 0 and 'id="urgences-risques"' not in html:
            html = html[:k + len("</article>")] + "\n" + URGENCES_CARTE.rstrip() + html[k + len("</article>"):]
        # la ligne du tableau des coordinations
        m = re.search(r'<a class="coord-row" href="poles\.html#solidarite-inclusion">.*?</a>', html)
        if m and "poles.html#urgences-risques" not in html[m.end():m.end() + 400]:
            ligne = ('\n        <a class="coord-row" href="poles.html#urgences-risques"><span class="coord-etat">&Agrave; pourvoir</span><span class="coord-nom">Urgences &amp; risques</span>'
                     '<span class="coord-pole">Développement humain &amp; moyens d’existence</span><span class="coord-qui coord-qui--vide">à pourvoir</span></a>')
            html = html[:m.end()] + ligne + html[m.end():]
    if path.name == "contact.html":
        html = html.replace("<option>12. Protection sociale, enfance &amp; inclusion</option>\n",
                            "<option>12. Protection sociale, enfance &amp; inclusion</option>\n                  <option>20. Urgences &amp; risques</option>\n")
    if path.name == "themes.html" and "THEME 20" not in html:
        i = html.find('<span class="pole-num">THEME 12</span>')
        k = html.find("</article>", i)
        if i > 0 and k > 0:
            html = html[:k + len("</article>")] + URGENCES_EN + html[k + len("</article>"):]
    if path.name == "trouver.js" and '"id": "urgences-risques"' not in html:
        html = html.replace("aide d’urgence en cas de catastrophe ou d’épidémie.", "protection de l’enfance (naissances, école, mariages précoces).")
        i = html.find('    "id": "gouvernance-plaidoyer",')
        i = html.rfind("  {", 0, i)
        if i > 0:
            html = html[:i] + URGENCES_JS + html[i:]
        for cle in ('"social"', '"sante"', '"envi"'):
            j = html.find(f"  {cle}: {{")
            s_ = html.find('"s": [', j)
            if j > 0 and s_ > 0:
                html = html[:s_ + len('"s": [')] + '\n      "urgences-risques",' + html[s_ + len('"s": ['):]
    return html


def lire_source(path: Path) -> str:
    """Lit un fichier de l'ancien site en y appliquant les mises à jour de source."""
    html = path.read_text(encoding="utf-8")
    for old, new in UPDATES_SOURCE + nominations_source():
        html = html.replace(old, new)
    # note datée à la fin de la description de la carte concernée (poles.html, en/themes.html)
    for coord, note, fichiers in NOTES_COORDINATION:
        i = html.find(coord)
        if i < 0 or path.name not in fichiers:
            continue
        j = html.find("<p>", i + len(coord) - 4)
        k = html.find("</p>", j)
        if j > 0 and k > 0:
            html = html[:k] + note + html[k:]
    return corrections_revue(structure_29_09(html, path), path)


# ---------------------------------------------------------------------------
# Revue du 29 septembre 2026 : corrections exactes, rangées par fichier source dans
# scripts/corrections_fr.py et scripts/corrections_en.py (CORRECTIONS = {"mission.html": [(ancien, nouveau), …]}).
# Chaque remplacement qui ne trouve plus son texte est signalé à l'import, pour ne rien perdre en silence.
def _charger_corrections() -> dict:
    import importlib.util
    tout: dict = {}
    for nom in ("corrections_fr", "corrections_en"):
        f = Path(__file__).with_name(nom + ".py")
        if not f.exists():
            continue
        spec = importlib.util.spec_from_file_location(nom, f)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        for cle, paires in getattr(mod, "CORRECTIONS", {}).items():
            tout.setdefault(cle, []).extend(paires)
    return tout


_CORRECTIONS = None
CORRECTIONS_MANQUEES: list = []


_LIEN = re.compile(r'(<a\b[^>]*\bhref="([^"]+)"[^>]*>)(.*?)(</a>)', re.S)


def fleches_coherentes(html: str) -> str:
    """Une seule convention de flèches : → page du site, ↗ autre site, ↓ téléchargement (PDF, ZIP)."""
    def rep(m):
        ouvre, href, texte, ferme = m.groups()
        h = href.lower().split("#")[0].split("?")[0]
        if h.endswith((".pdf", ".zip")):
            texte = texte.replace("&rarr;", "&darr;").replace("→", "↓").replace("&nearr;", "&darr;").replace("↗", "↓")
        elif href.startswith(("http://", "https://")) and "lonodji.org" not in href:
            texte = texte.replace("&rarr;", "&nearr;").replace("→", "↗")
        else:
            texte = texte.replace("&nearr;", "&rarr;").replace("↗", "→")
        return ouvre + texte + ferme
    return _LIEN.sub(rep, html)


def corrections_revue(html: str, path: Path) -> str:
    global _CORRECTIONS
    if _CORRECTIONS is None:
        _CORRECTIONS = _charger_corrections()
    try:
        cle = path.relative_to(LEGACY).as_posix()
    except (ValueError, NameError):
        cle = path.name
    html = fleches_coherentes(html)
    for ancien, nouveau in _CORRECTIONS.get(cle, []):
        if ancien in html:
            html = html.replace(ancien, nouveau)
        elif nouveau not in html:
            CORRECTIONS_MANQUEES.append((cle, ancien[:70]))
    return html


def apply_updates(html: str) -> str:
    for old, new in UPDATES:
        html = html.replace(old, new)
    return html


# ----------------------------------------------------------------------------
# Scripts interactifs : rendus ré-initialisables et liens réécrits
# ----------------------------------------------------------------------------

def adapt_script(name: str, init_name: str, find: str = "", replace: str = "", root_sel: str = ""):
    src = LEGACY / name
    if not src.exists():
        return
    js = lire_source(src)
    head = js.find("(function () {")
    tail = js.rfind("})();")
    if head < 0 or tail < 0:
        raise SystemExit(f"{name} : enveloppe IIFE introuvable")
    body = js[head + len("(function () {"):tail]
    if find:
        body = body.replace(find, replace)
    # liens de l'ancien site dans les chaînes JavaScript
    def repl(m):
        target = m.group(1)
        return "'" + rewrite_href(target, "") if m.group(0).startswith("'") else '"' + rewrite_href(target, "")
    # d'abord les préfixes ouverts (« poles.html# » + id, « contact.html?theme= » + clé), puis les liens complets
    body = re.sub(r"'([a-z0-9-]+)\.html\?theme='", lambda m: "'" + rewrite_href(m.group(1) + ".html", "").split("#")[0] + "?theme='", body)
    body = re.sub(r"'([a-z0-9-]+)\.html#'", lambda m: "'" + rewrite_href(m.group(1) + ".html", "").split("#")[0] + "#'", body)
    body = re.sub(r"'([a-z0-9-]+\.html(?:[#?][^']*)?)'", lambda m: "'" + rewrite_href(m.group(1), "") + "'", body)
    body = re.sub(r'"([a-z0-9-]+\.html(?:[#?][^"]*)?)"', lambda m: '"' + rewrite_href(m.group(1), "") + '"', body)
    # l'init d'origine s'exécute au chargement ; DOMContentLoaded est déjà passé quand Next l'injecte
    body = body.replace("if (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', init);\n  } else {\n    init();\n  }", "init();")
    guard = ""
    if root_sel:
        guard = ("\n  var __root = document.querySelector(" + json.dumps(root_sel) + ");"
                 "\n  if (!__root || __root.__inited) return;\n  __root.__inited = true;")
    m = re.match(r"(\s*'use strict';)", body)
    if m:
        body = m.group(1) + guard + body[m.end():]
    else:
        body = guard + body
    out = js[:head] + "window." + init_name + " = function () {" + body + "};\nwindow." + init_name + "();\n"
    (PUBLIC / name).write_text(out, encoding="utf-8")


# ----------------------------------------------------------------------------
# Programme principal
# ----------------------------------------------------------------------------

def main():
    (CONTENT / "pages").mkdir(parents=True, exist_ok=True)
    (CONTENT / "articles").mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(exist_ok=True)
    all_forms = {}
    index = {"pages": [], "articles": []}

    # Pages de fond
    for name in DOSSIERS + HUB_PAGES:
        p = LEGACY / f"{name}.html"
        if not p.exists():
            print("absent :", p)
            continue
        data, forms = parse_page(p)
        data["slug"] = name
        data["route"] = HUB_ROUTES.get(name, ROUTES_DOSSIERS.get(name, "/dossiers/" + name)).split("#")[0]
        data["kind"] = "hub" if name in HUB_PAGES else "dossier"
        all_forms.update(forms)
        (CONTENT / "pages" / f"{name}.json").write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
        index["pages"].append({k: data[k] for k in ("slug", "route", "kind", "title", "eyebrow", "lede", "description", "parent", "words", "hasMap")})
    # Pages anglaises
    for name in EN_PAGES:
        p = LEGACY / "en" / f"{name}.html"
        if not p.exists():
            continue
        data, forms = parse_page(p)
        data["slug"] = "en/" + name
        data["route"] = "/en/" + name
        data["kind"] = "en"
        all_forms.update(forms)
        (CONTENT / "pages" / f"en--{name}.json").write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
        index["pages"].append({k: data[k] for k in ("slug", "route", "kind", "title", "eyebrow", "lede", "description", "parent", "words", "hasMap")})

    # Articles
    news_soup = BeautifulSoup(lire_source(LEGACY / "actualites.html"), "lxml")
    cats, by_slug = journal_categories(news_soup)
    for p in sorted((LEGACY / "articles").glob("*.html")):
        data, forms = parse_page(p)
        slug = p.stem
        data["slug"] = slug
        data["route"] = "/journal/" + slug
        extra = by_slug.get(slug, {})
        data["category"] = extra.get("category", "")
        data["summary"] = extra.get("summary", data.get("description", ""))
        if not data.get("tag"):
            data["tag"] = extra.get("tag", "")
        all_forms.update(forms)
        (CONTENT / "articles" / f"{slug}.json").write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
        index["articles"].append({k: data.get(k, "") for k in ("slug", "route", "title", "date", "dateLabel", "tag", "category", "summary", "readTime", "words", "byline", "pills")})
    # Articles écrits dans l'espace de rédaction (scripts/publier-article.py) : conservés tels quels
    for f in sorted((CONTENT / "articles").glob("*.json")):
        try:
            d = json.loads(f.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            continue
        if d.get("source") == "redaction" and d.get("slug") not in {a["slug"] for a in index["articles"]}:
            index["articles"].append({k: d.get(k, "") for k in ("slug", "route", "title", "date", "dateLabel", "tag", "category", "summary", "readTime", "words", "byline", "pills")})
    for a in index["articles"]:  # l'étiquette suit le nom actuel de la rubrique ; le texte daté de l'article ne change pas
        for o, n in RENOMMAGES_29_09:
            if a.get("tag") == o:
                a["tag"] = n
    index["articles"].sort(key=lambda a: a["date"], reverse=True)
    index["journalCategories"] = cats

    # Données structurées
    poles_soup = BeautifulSoup(lire_source(LEGACY / "poles.html"), "lxml")
    index["structure"] = structure(poles_soup)
    plea_soup = BeautifulSoup(lire_source(LEGACY / "plaidoyers.html"), "lxml")
    index["plaidoyers"] = plaidoyers(plea_soup)
    docs_soup = BeautifulSoup(lire_source(LEGACY / "documents.html"), "lxml")
    index["documents"] = documents(docs_soup)
    mission_soup = BeautifulSoup(lire_source(LEGACY / "mission.html"), "lxml")
    index["history"] = history(mission_soup)
    index["generatedFrom"] = {"legacyVersion": "2026-09-24", "files": len(list(LEGACY.rglob("*"))) }

    (CONTENT / "index.json").write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding="utf-8")

    # Formulaires (le formulaire de pied de page vit hors <main> : déclaré ici)
    footer_form = BeautifulSoup('<form name="lettre-info-pied"><input type="hidden" name="_honey"><input type="email" name="email"><input type="checkbox" name="consentement"></form>', "lxml").find("form")
    all_forms.setdefault("lettre-info-pied", footer_form)
    # Formulaires des pages conçues hors de l'ancien site (app/diaspora) : mêmes noms de champs que dans la page.
    for name, html in FORMULAIRES_SITE.items():
        all_forms.setdefault(name, BeautifulSoup(html, "lxml").find("form"))
    (PUBLIC / "__forms.html").write_text(forms_html(all_forms), encoding="utf-8")

    # Ressources (pas public/og ni og-image.png : ce sont scripts/build-og.py qui les génère)
    # public/{documents,identite,kit,app} sont remplacés à l'identique par ceux de l'ancien site :
    # ne rien y ajouter à la main (les fichiers propres au site vont dans public/og, public/carte,
    # public/odeb, public/icones…).
    for d in ("documents", "identite", "kit", "app"):
        src = LEGACY / d
        if src.exists():
            dst = PUBLIC / d
            if dst.exists():
                shutil.rmtree(dst)
            shutil.copytree(src, dst)
    for f in ("favicon.svg",):
        if (LEGACY / f).exists():
            shutil.copy2(LEGACY / f, PUBLIC / f)
    adapt_script("geo.js", "__initGeo", "var figures = document.querySelectorAll('[data-geo]');",
                 "var figures = document.querySelectorAll('[data-geo]:not([data-geo-pret])');")
    # 30/09/2026 : la liste ne montre que les cellules à pourvoir (une seule aujourd'hui) — le titre suit leur nombre.
    adapt_script("trouver.js", "__initTrouver",
                 "'<div class=\"tm-group\"><h3>Et deux cellules qui appuient toutes les thématiques</h3>",
                 "'<div class=\"tm-group\"><h3>' + (cells.length > 1 ? 'Et ' + cells.length + ' cellules transversales à pourvoir' : 'Et une cellule transversale à pourvoir') + '</h3>",
                 root_sel="[data-tm]")
    adapt_script("genealogie.js", "__initGenealogie", root_sel="#gn-outil")
    print(f"pages : {len(index['pages'])} · articles : {len(index['articles'])} · formulaires : {len(all_forms)} · "
          f"thématiques : {sum(len(p['items']) for p in index['structure']['poles'])} · plaidoyers : {len(index['plaidoyers'])} · documents : {len(index['documents'])}")
    for cle, debut in sorted(set(CORRECTIONS_MANQUEES)):
        print(f"correction sans effet : {cle} · « {debut}… »")


if __name__ == "__main__":
    main()
