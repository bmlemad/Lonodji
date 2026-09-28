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
# Pages portées telles quelles sous /dossiers/<slug>
DOSSIERS = [
    "agriculteurs-eleveurs", "agriculture-securite-alimentaire", "air-bedjondo", "application",
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
    if n in DOSSIERS:
        return "/dossiers/" + n
    return "/dossiers/" + n


ANCHOR_MAP = {
    "/journal#formulaire-newsletter": "/participer#newsletter",
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
        # les formulaires sans nom sont des outils locaux (cahier généalogique) : conservés tels quels
    # les attributs `style` avec variables ODD sont conservés ; on retire les data-* d'interactivité inutiles
    for el in root.find_all(True):
        for attr in list(el.attrs):
            if attr in ("data-search", "data-need-loc", "data-plea"):
                del el[attr]


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
    parts = ["<!doctype html><html lang=\"fr\"><head><meta charset=\"utf-8\"><title>Formulaires ADEB LONODJI</title>",
             "<meta name=\"robots\" content=\"noindex\"></head><body>",
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
     "<p>Le site compte dix-sept formulaires. Ils ne servent pas tous à la même chose"),
    ('aria-label="Les quinze formulaires du site et le sort de vos données"',
     'aria-label="Les dix-sept formulaires du site et le sort de vos données"'),
    ("<p>Pour dix de ces formulaires, un compteur anonyme tient le nombre total d’envois\u00a0; pour le signalement des besoins, il retient aussi la localité, le type de besoin et l’urgence, quand vous acceptez la publication.",
     "<p>Pour douze de ces formulaires, un compteur anonyme tient le nombre total d’envois, publié sur le <a href=\"/impact\">tableau de bord</a>\u00a0; pour le signalement des besoins, il retient aussi la localité, le type de besoin et l’urgence, quand vous acceptez la publication\u00a0; pour le répertoire des compétences, le nombre de pays et de domaines représentés, sans autre détail."),
    ('<tr><th scope="row"><a href="/dossiers/lieux-sacres#signalement">Lieu sacré menacé</a>',
     '<tr><th scope="row"><a href="/diaspora#inscription">Répertoire des compétences</a><span class="notice-page">Diaspora</span></th><td>Nom, e-mail, téléphone facultatif, pays et ville, lien avec Bédjondo, domaines et métier, expérience, ce que vous offrez, thématique, langues, disponibilité, message</td><td>Trouver la compétence qu’une thématique ou un plaidoyer attend, et vous proposer une mission</td><td>Tant que votre inscription est active, revue chaque année\u00a0; nom, métier et pays publiés dans l’annuaire seulement avec votre accord, le reste jamais</td></tr>'
     '<tr><th scope="row"><a href="/temoignages#envoyer">Témoignage, photo ou enregistrement</a><span class="notice-page">Racontez Bédjondo</span></th><td>Type de récit, titre, récit, fichier joint (photo, son, vidéo, 10 Mo au plus), lieu et date, nom, qualité, contact, localité, choix de publication, accords (personnes citées, mineurs)</td><td>Vérifier le récit avec vous, le publier selon votre choix, constituer la banque d’images et les archives de l’association</td><td>Conservé comme archive tant que vous ne le retirez pas\u00a0; publié seulement après votre relecture, avec ou sans votre nom selon votre choix</td></tr>'
     '<tr><th scope="row"><a href="/dossiers/lieux-sacres#signalement">Lieu sacré menacé</a>'),
    # Journal des corrections : l'entrée du 23/09 reste telle quelle ; une mise à jour datée la complète.
    ("<p><strong>Comment nous nous en sommes aperçus\u00a0:</strong> un audit complet du site, le 23 septembre, qui a interrogé le registre du .org et l’annuaire RDAP, sans réponse pour lonodji.org, puis relu la notice à la lumière des formulaires réellement en service.</p>",
     "<p><strong>Comment nous nous en sommes aperçus\u00a0:</strong> un audit complet du site, le 23 septembre, qui a interrogé le registre du .org et l’annuaire RDAP, sans réponse pour lonodji.org, puis relu la notice à la lumière des formulaires réellement en service.</p>\n<p><strong>Mise à jour du 28 septembre 2026\u00a0:</strong> le nom de domaine lonodji.org a depuis été enregistré et héberge le site depuis le 27 septembre. Les adresses électroniques restent à créer\u00a0; le formulaire et WhatsApp demeurent les deux voies sûres.</p>"),
]


# Mises à jour de la source AVANT analyse (structure, scripts et pages) : décisions de
# l'association postérieures à l'export de l'ancien site, datées dans le texte.
UPDATES_SOURCE = [
    # 28/09/2026 : la coordination de Culture & patrimoine vivant est confiée au Dr Yaphete Madjirabé.
    ('<span class="coord-qui">Félix Mbété Nangmbatnan</span>', '<span class="coord-qui">Dr Yaphete Madjirabé</span>'),
    ('<p class="coord">Coordonnateur&nbsp;: Félix Mbété Nangmbatnan</p>', '<p class="coord">Coordonnateur&nbsp;: Dr Yaphete Madjirabé</p>'),
    ('<p class="coord">Coordinator: F&eacute;lix Mb&eacute;t&eacute; Nangmbatnan</p>', '<p class="coord">Coordinator: Dr Yaphete Madjirab&eacute;</p>'),
    ('"coord": "Coordonnateur : Félix Mbété Nangmbatnan",', '"coord": "Coordonnateur : Dr Yaphete Madjirabé",'),
]
NOTE_CULTURE_FR = " <strong>Mise à jour du 28 septembre 2026&nbsp;:</strong> la coordination de la thématique est confiée au Dr Yaphete Madjirabé, qui succède à Félix Mbété Nangmbatnan."
NOTE_CULTURE_EN = " <strong>Update, 28 September 2026:</strong> the theme is now coordinated by Dr Yaphete Madjirab&eacute;, who succeeds F&eacute;lix Mb&eacute;t&eacute; Nangmbatnan."


def lire_source(path: Path) -> str:
    """Lit un fichier de l'ancien site en y appliquant les mises à jour de source."""
    html = path.read_text(encoding="utf-8")
    for old, new in UPDATES_SOURCE:
        html = html.replace(old, new)
    # note datée à la fin de la description de la thématique 02 (poles.html, en/themes.html)
    for coord, note in (('<p class="coord">Coordonnateur&nbsp;: Dr Yaphete Madjirabé</p>', NOTE_CULTURE_FR), ('<p class="coord">Coordinator: Dr Yaphete Madjirab&eacute;</p>', NOTE_CULTURE_EN)):
        i = html.find(coord)
        if i < 0 or path.name not in ("poles.html", "themes.html"):
            continue
        j = html.find("<p>", i)
        k = html.find("</p>", j)
        if j > 0 and k > 0:
            html = html[:k] + note + html[k:]
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
        data["route"] = HUB_ROUTES.get(name, "/dossiers/" + name).split("#")[0]
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
    footer_form = BeautifulSoup('<form name="lettre-info-pied"><input type="email" name="email"><input type="checkbox" name="consentement"></form>', "lxml").find("form")
    all_forms.setdefault("lettre-info-pied", footer_form)
    # Formulaires des pages conçues hors de l'ancien site (app/diaspora) : mêmes noms de champs que dans la page.
    for name, html in FORMULAIRES_SITE.items():
        all_forms.setdefault(name, BeautifulSoup(html, "lxml").find("form"))
    (PUBLIC / "__forms.html").write_text(forms_html(all_forms), encoding="utf-8")

    # Ressources (pas public/og ni og-image.png : ce sont scripts/build-og.py qui les génère)
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
    adapt_script("trouver.js", "__initTrouver", root_sel="[data-tm]")
    adapt_script("genealogie.js", "__initGenealogie", root_sel="#gn-outil")
    print(f"pages : {len(index['pages'])} · articles : {len(index['articles'])} · formulaires : {len(all_forms)} · "
          f"thématiques : {sum(len(p['items']) for p in index['structure']['poles'])} · plaidoyers : {len(index['plaidoyers'])} · documents : {len(index['documents'])}")


if __name__ == "__main__":
    main()
