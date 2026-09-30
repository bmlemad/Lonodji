#!/usr/bin/env python3
"""Contrôle du site (local ou en ligne) : statut des pages clés, tous les liens
et ancres internes qu'elles portent, fichiers téléchargeables, erreurs de
console, accessibilité (axe-core, WCAG 2 A/AA) ; en option, contrôle visuel à
trois largeurs (débordements, images cassées, textes minuscules, doublons
d'identifiants) et poids des pages transférées.

    python3 scripts/qa/controle.py                       # http://127.0.0.1:3100 (npm run qa le lance)
    python3 scripts/qa/controle.py https://lonodji.org    # le site en ligne
    options : --visuel  --poids  --sans-axe  --json rapport.json

Sortie : un résumé et la liste des problèmes ; code de retour 1 s'il y en a."""
from __future__ import annotations

import argparse
import collections
import json
import sys
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PAGES = ["/", "/mission", "/histoire", "/programmes", "/programmes/fiches-de-mission", "/secteurs", "/en/sectors", "/actions", "/impact", "/projets", "/observatoire", "/villages", "/villages/bedjondo", "/villages/bedjondo/bedjondo", "/carte", "/journal", "/lettre",
         "/bibliotheque", "/langue", "/diaspora", "/temoignages", "/documents", "/transparence", "/transparence/decisions", "/participer", "/presse", "/accessibilite", "/mentions-legales", "/plan-du-site", "/archives", "/recherche?q=odeb",
         "/odeb", "/odeb/livre-blanc", "/odeb/feuille-de-route", "/odeb/programmes", "/odeb/programmes/economie-sociale", "/odeb/programmes/memoire-patrimoine", "/odeb/identite",
         "/dossiers", "/territoire", "/territoire/propositions-commune", "/en/commune", "/territoire/gouvernance-locale", "/patrimoine", "/territoire/diagnostic", "/patrimoine/base-de-recherche", "/projets/bedjondo-transport-logistique", "/programmes/handicap", "/bailleurs", "/en/donors", "/territoire/besoins", "/association/ancienne-identite-visuelle", "/association/demarches", "/patrimoine/lieux-sacres",
         "/journal/2026-09-28-lettre-information-02", "/journal/2026-09-28-directions-de-pole",
         "/en/index", "/en/odeb", "/en/villages", "/en/projects", "/en/impact", "/en/contact"]
FICHIERS = (".pdf", ".jpg", ".jpeg", ".png", ".svg", ".json", ".js", ".xml", ".txt", ".zip", ".docx", ".pptx", ".html", ".ics")

CHECK_VISUEL = """() => {
  const out = {h1: document.querySelectorAll('main h1').length, dupIds: 0, brokenImg: [], tiny: 0, overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth, clipped: [], nan: [], emptyLinks: 0, offscreen: []};
  const ids = [...document.querySelectorAll('[id]')].map(e => e.id); out.dupIds = ids.length - new Set(ids).size;
  for (const im of document.images) if (im.complete && im.naturalWidth === 0 && im.getAttribute('src')) out.brokenImg.push(im.getAttribute('src'));
  const vw = document.documentElement.clientWidth;
  for (const el of document.querySelectorAll('main *, footer *, .nav *')) {
    const cs = getComputedStyle(el);
    if (el.childElementCount === 0 && el.textContent.trim() && parseFloat(cs.fontSize) < 10 && cs.display !== 'none' && cs.visibility !== 'hidden' && !el.closest('.legacy')) out.tiny++;
    if (cs.overflow === 'hidden' && el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 40 && !el.closest('.ob-table-wrap, .od-table-wrap, .table-wrap, .links, .mobile-menu, .leaflet-container, pre, .legacy svg, .geo-liste, .program-card, .shelf')) out.clipped.push((el.className||el.tagName).toString().slice(0,60));
    const r = el.getBoundingClientRect();
    if (r.width > 0 && (r.right > vw + 2) && cs.position !== 'fixed' && !el.closest('.ob-table-wrap, .od-table-wrap, .table-wrap, .leaflet-container, .links, .mega, pre, .legacy svg, .geo-liste, .shelf, .kanban-board, [style*="overflow"]')) out.offscreen.push((el.className||el.tagName).toString().slice(0,60));
  }
  for (const a of document.querySelectorAll('main a[href]')) if (!a.textContent.trim() && !a.getAttribute('aria-label') && !a.querySelector('img[alt]')) out.emptyLinks++;
  const t = document.body.innerText; for (const k of ['undefined','NaN','[object','null ']) if (t.includes(k)) out.nan.push(k);
  out.clipped = [...new Set(out.clipped)].slice(0,5); out.offscreen = [...new Set(out.offscreen)].slice(0,5);
  return out;
}"""


def axe_source() -> str | None:
    for c in (ROOT / "node_modules" / "axe-core" / "axe.min.js", Path.home() / "qa" / "node_modules" / "axe-core" / "axe.min.js"):
        if c.exists():
            return c.read_text(encoding="utf-8")
    return None


def main() -> int:
    from playwright.sync_api import sync_playwright

    ap = argparse.ArgumentParser()
    ap.add_argument("base", nargs="?", default="http://127.0.0.1:3100")
    ap.add_argument("--visuel", action="store_true")
    ap.add_argument("--poids", action="store_true")
    ap.add_argument("--sans-axe", action="store_true")
    ap.add_argument("--json", help="écrire le rapport dans ce fichier")
    a = ap.parse_args()
    base = a.base.rstrip("/")
    en_ligne = base.startswith("https://")
    axe = None if a.sans_axe else axe_source()
    if not a.sans_axe and not axe:
        print("axe-core introuvable (npm i -D axe-core) : accessibilité non contrôlée")
    problemes: list[str] = []
    statut: dict[str, int] = {}
    console: list[tuple[str, str]] = []
    liens: "collections.OrderedDict[str, str]" = collections.OrderedDict()
    rapport: dict = {"base": base, "pages": statut, "problemes": problemes}
    with sync_playwright() as p:
        b = p.chromium.launch()
        ctx = b.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()
        page.on("console", lambda m: console.append((m.type, m.text)) if m.type in ("error", "warning") else None)
        page.on("pageerror", lambda e: console.append(("pageerror", str(e))))
        for chemin in PAGES:
            try:
                r = page.goto(base + chemin, wait_until="load" if en_ligne else "networkidle", timeout=60000)
            except Exception as e:  # noqa: BLE001
                statut[chemin] = 0
                problemes.append(f"{chemin} injoignable : {str(e)[:80]}")
                continue
            statut[chemin] = r.status if r else 0
            if not r or r.status != 200:
                problemes.append(f"{chemin} -> {statut[chemin]}")
                continue
            for h in page.evaluate("() => [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'))"):
                if h and not h.startswith(("http", "mailto:", "tel:", "javascript:", "#")):
                    liens.setdefault(h, chemin)
            if axe:
                page.evaluate(axe)
                res = page.evaluate("async () => { const r = await axe.run(document, {runOnly:{type:'tag', values:['wcag2a','wcag2aa','best-practice']}}); return r.violations.map(v => ({id:v.id, impact:v.impact, n:v.nodes.length, html:v.nodes[0].html.slice(0,120)})); }")
                res = [v for v in res if v["id"] not in ("region",)]
                if res:
                    problemes.append(f"axe {chemin}: {json.dumps(res, ensure_ascii=False)[:600]}")
        # liens internes : statut et ancres
        ancres: dict[str, tuple[int, set[str]]] = {}
        verifies = 0
        for h, origine in liens.items():
            u = urllib.parse.urlsplit(h)
            cible = u.path or origine.split("#")[0].split("?")[0]
            if cible.lower().endswith(FICHIERS):
                r = page.request.head(base + cible)
                if r.status != 200:
                    problemes.append(f"fichier {h} ({origine}) -> {r.status}")
                verifies += 1
                continue
            if cible not in ancres:
                try:
                    r = page.goto(base + cible, wait_until="domcontentloaded", timeout=60000)
                    ancres[cible] = (r.status if r else 0, set(page.evaluate("() => [...document.querySelectorAll('[id]')].map(e => e.id)")))
                except Exception as e:  # noqa: BLE001
                    ancres[cible] = (0, set())
                    problemes.append(f"lien {h} ({origine}) injoignable : {str(e)[:60]}")
            st, ids = ancres[cible]
            verifies += 1
            if st != 200:
                problemes.append(f"lien {h} ({origine}) -> {st}")
            elif u.fragment and u.fragment not in ids:
                problemes.append(f"ancre manquante {h} ({origine})")
        rapport["liens"] = {"verifies": verifies, "cibles": len(ancres)}
        # visuel
        if a.visuel:
            anomalies = {}
            for w, hh, tag in ((1440, 900, "d"), (900, 1100, "t"), (390, 844, "m")):
                c2 = b.new_context(viewport={"width": w, "height": hh}, is_mobile=(w < 500), has_touch=(w < 500))
                pg = c2.new_page()
                for chemin in PAGES:
                    if "?" in chemin:
                        continue
                    pg.goto(base + chemin, wait_until="load" if en_ligne else "networkidle", timeout=60000)
                    res = pg.evaluate(CHECK_VISUEL)
                    if res["h1"] != 1 or res["dupIds"] or res["brokenImg"] or res["overflowX"] > 0 or res["clipped"] or res["nan"] or res["emptyLinks"] or res["offscreen"]:
                        anomalies[f"{tag} {chemin}"] = {k: v for k, v in res.items() if v and not (k == "h1" and v == 1)}
                c2.close()
            rapport["visuel"] = anomalies
            for k, v in anomalies.items():
                problemes.append(f"visuel {k}: {json.dumps(v, ensure_ascii=False)[:300]}")
        # poids
        if a.poids:
            poids = {}
            c3 = b.new_context(viewport={"width": 390, "height": 844})
            for chemin in ["/", "/villages", "/odeb", "/journal"]:
                pg = c3.new_page()
                cdp = c3.new_cdp_session(pg)
                cdp.send("Network.enable")
                total = {"n": 0}
                cdp.on("Network.loadingFinished", lambda e: total.__setitem__("n", total["n"] + e.get("encodedDataLength", 0)))
                pg.goto(base + chemin, wait_until="networkidle", timeout=60000)
                pg.wait_for_timeout(500)
                poids[chemin] = round(total["n"] / 1024)
                pg.close()
            c3.close()
            rapport["poids_ko"] = poids
            for chemin, ko in poids.items():
                if ko > 600:
                    problemes.append(f"poids {chemin} : {ko} ko transférés (seuil 600)")
        b.close()
    console = [c for c in console if "favicon" not in c[1] and "third-party cookie" not in c[1].lower()]
    rapport["console"] = console[:20]
    for c in console[:10]:
        problemes.append(f"console {c[0]} : {c[1][:160]}")
    print("base :", base)
    print("pages :", {k: v for k, v in statut.items() if v != 200} or f"toutes 200 ({len(statut)})")
    print("liens vérifiés :", verifies, "| cibles :", len(ancres))
    if a.poids:
        print("poids (ko transférés, téléphone) :", rapport["poids_ko"])
    print("PROBLÈMES :", len(problemes))
    for x in problemes:
        print(" -", x)
    if a.json:
        Path(a.json).write_text(json.dumps(rapport, ensure_ascii=False, indent=1), encoding="utf-8")
    return 1 if problemes else 0


if __name__ == "__main__":
    sys.exit(main())
