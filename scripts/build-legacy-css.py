#!/usr/bin/env python3
"""Construit app/legacy.css : la feuille de style des composants de l'ancien site,
réduite aux règles réellement utilisées par le contenu importé, préfixée par `.legacy`
et raccordée aux jetons de couleur du site moderne.

Usage : python3 scripts/build-legacy-css.py /chemin/vers/ancien-site
"""
import glob
import json
import re
import sys
from pathlib import Path

import tinycss2

LEGACY = Path(sys.argv[1] if len(sys.argv) > 1 else "/home/claude/lonodji").resolve()
ROOT = Path(__file__).resolve().parents[1]

# --- inventaire des classes présentes dans le contenu importé -----------------
classes = set()
for f in glob.glob(str(ROOT / "content" / "pages" / "*.json")) + glob.glob(str(ROOT / "content" / "articles" / "*.json")):
    d = json.load(open(f, encoding="utf-8"))
    for s in d["sections"]:
        for c in re.findall(r'class="([^"]*)"', s["html"]):
            classes.update(c.split())
# classes produites par le rendu React (résumé, sommaire, formulaires…)
classes.update({"prose", "form-note", "info-card", "field", "btn", "btn-primary", "btn-ghost", "table-wrap",
                "plea-table", "indic-table", "check", "form-row", "sr-only", "fi", "resume", "resume-carte",
                "resume-titre", "resume-liste", "sommaire", "sommaire-titre", "sommaire-liste", "geo", "geo-cadre",
                "geo-svg", "geo-outils", "geo-btn", "geo-legende", "geo-panneau", "geo-liste", "geo-choix", "geo-fiche",
                "tag", "alt", "num", "h4", "lede", "eyebrow", "section-head"})

# --- sélecteurs à exclure (chrome de l'ancien site) --------------------------
EXCLUDE_PREFIXES = (
    "html", "body", "header", "footer", ".site-header", ".site-footer", ".nav", ".mega", ".menu", ".hero",
    ".page-hero", ".skip", ".cursor", ".toc", ".share", ".search", ".crumbs", ".tri-bar", ".app-", ".vt-", ".sw-",
    ".newsletter", ".retour", ".filter", ".journal-search", ".result-count", ".brand", ".lang", ".theme-toggle",
    ".mobile", ".burger", ".hero-", ".home-", ".accueil", ".ticker", ".aurora", ".cue", ".halo", ".footer-",
    ".article-share", ".related", ".article-back", ".back-to-top", ".kit-actions", ".cta-band", ".join-band",
    ".pwa", ".install", ".offline", ".glass-nav", "#header", "#footer", ".btn-top", ".scroll", ".news-grid",
    ".article-meta", "main", ".wrap", ".page", ".section", "section", ".site-", ".carte-", ".reveal", ".magnet",
)
DARK_MARKERS = ('[data-theme="dark"]', "[data-theme=dark]", "prefers-color-scheme: dark", "prefers-color-scheme:dark")


def serialize(tokens):
    return tinycss2.serialize(tokens).strip()


def keep_selector(sel: str) -> bool:
    s = sel.strip()
    if not s:
        return False
    if any(m in s for m in DARK_MARKERS):
        return False
    if s.startswith(":root"):
        return False
    low = s.lower()
    if any(low.startswith(p) for p in EXCLUDE_PREFIXES):
        # ".section-head" doit rester : on distingue par la liste des classes autorisées
        if not any(low.startswith("." + c) for c in ("section-head", "news-card", "news-thumb", "news-body", "news-date",
                                                      "news-foot", "news-tag", "news-more", "hero-pill")):
            return False
    cls_in_sel = re.findall(r"\.([A-Za-z0-9_-]+)", s)
    if cls_in_sel and not any(c in classes for c in cls_in_sel):
        return False
    return True


def prefix_selector(sel: str) -> str:
    s = sel.strip()
    return ".legacy " + s


def process_rules(rules, depth=0):
    out = []
    for rule in rules:
        if rule.type == "qualified-rule":
            prelude = serialize(rule.prelude)
            selectors = [x.strip() for x in prelude.split(",")]
            kept = [prefix_selector(x) for x in selectors if keep_selector(x)]
            if not kept:
                continue
            body = serialize(rule.content)
            out.append(", ".join(kept) + "{" + body + "}")
        elif rule.type == "at-rule":
            name = rule.lower_at_keyword
            prelude = serialize(rule.prelude)
            if name in ("font-face", "import", "charset"):
                continue
            if name == "keyframes":
                out.append(f"@keyframes {prelude}{{{serialize(rule.content)}}}")
                continue
            if name in ("media", "supports", "container", "layer"):
                if any(m in prelude for m in DARK_MARKERS):
                    continue
                # pas de rendu différé ni d'animations liées au défilement : tout doit être visible d'emblée
                if name == "supports" and ("content-visibility" in prelude or "animation-timeline" in prelude):
                    continue
                inner = process_rules(tinycss2.parse_rule_list(rule.content, skip_whitespace=True, skip_comments=True), depth + 1)
                if inner:
                    out.append(f"@{name} {prelude}{{" + "\n".join(inner) + "}")
                continue
        # commentaires et erreurs ignorés
    return out


css_text = (LEGACY / "style.css").read_text(encoding="utf-8") + "\n" + (LEGACY / "geo.css").read_text(encoding="utf-8")
rules = tinycss2.parse_stylesheet(css_text, skip_whitespace=True, skip_comments=True)
body = process_rules(rules)

TOKENS = """/* Jetons de l'ancien site, raccordés à la palette du site moderne. Généré par scripts/build-legacy-css.py */
.legacy{
  --fs-2xs:.72rem; --fs-xs:.78rem; --fs-sm:.86rem; --fs-md:.94rem;
  --fs-base:1rem; --fs-lg:1.12rem; --fs-xl:1.25rem; --fs-2xl:1.35rem;
  --fs-3xl:1.55rem; --fs-4xl:1.75rem; --fs-5xl:2.05rem;
  --r-xs:4px; --r-sm:10px; --r-md:16px; --r-lg:22px; --r-pill:999px;
  --ground:#f4f6f1; --ink:#10241e; --ink-soft:#4f5f58;
  --terre:#173b2d; --terre-dim:#10241e; --savane:#2e7d5b; --feuille:#5c7a3a; --feuille-ink:#4f6a32;
  --or:#8a6a2f; --or-dim:#6e5324; --sable:#edf2e8; --sable-line:#d6dfd2; --rule:#d8e0d4; --focus:#b6cf45;
  --glass-bg:rgba(255,255,255,.62); --glass-bg-strong:rgba(255,255,255,.78); --glass-bg-solid:rgba(255,255,255,.94);
  --glass-border:rgba(255,255,255,.95);
  --glass-shadow:0 1px 0 rgba(255,255,255,.9) inset, 0 18px 44px rgba(16,36,30,.07), 0 3px 10px rgba(16,36,30,.04);
  --shadow-lift:0 1px 0 rgba(255,255,255,.95) inset, 0 28px 60px rgba(16,36,30,.12), 0 6px 18px rgba(16,36,30,.07);
  --blob-terre:rgba(23,59,45,.10); --blob-savane:rgba(46,125,91,.10); --blob-feuille:rgba(92,122,58,.10);
  --terre-glass:rgba(23,59,45,.88); --terre-dim-glass:rgba(16,36,30,.9);
  --laterite:#B5532E; --laterite-ink:#A64B29; --laterite-dim:#9A4526;
  --mil:#C98A2B; --sorgho:#5C7A3A; --sorgho-ink:#4F6A32;
  --argile:#F6EFE3; --argile-2:#FBF7F0; --argile-line:#E5D6BF; --argile-soft:#6B5A48; --encre-chaude:#2B2118;
  --blob-laterite:rgba(181,83,46,.10); --blob-mil:rgba(201,138,43,.10);
  --geo-hach:repeating-linear-gradient(45deg, rgba(46,125,91,.28) 0 2px, transparent 2px 6px);
  --font-serif:var(--font-playfair),Georgia,serif; --font-sans:var(--font-dm),system-ui,sans-serif;
}
"""
out = TOKENS + "\n".join(body)
# Les polices de l'ancien site sont remplacées par celles du site moderne
out = re.sub(r'"Fraunces"[^;}]*', "var(--font-playfair),Georgia,serif", out)
out = re.sub(r'"Work Sans"[^;}]*', "var(--font-dm),system-ui,sans-serif", out)
out = re.sub(r'"Space Mono"[^;}]*', "var(--font-dm),system-ui,sans-serif", out)  # le registre « mono » de l'ancien site rejoint la police du site
(ROOT / "app" / "legacy.css").write_text(out, encoding="utf-8")
print(f"legacy.css : {len(out)//1024} Ko, {len(body)} règles, {len(classes)} classes en inventaire")
