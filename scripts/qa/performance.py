#!/usr/bin/env python3
"""Mesure de référence de la performance (chantier C2 du plan de développement).

    python3 scripts/qa/performance.py [base] [--json fichier]

Mesures reproductibles, indépendantes de la machine autant que possible : poids transféré par type (HTML, CSS,
JS, polices, images, données), nombre de requêtes, JavaScript exécuté et tâches longues sous processeur ralenti
4 fois (Chromium via Playwright), pour six pages représentatives. Ne remplace pas Lighthouse pour LCP/CLS, mais
donne des chiffres comparables d'une fois sur l'autre. Les valeurs de référence sont dans
docs/plan-developpement.md (chantier C2) ; le script échoue si une page dépasse les plafonds ci-dessous."""
import gzip
import json
import sys
from collections import Counter, defaultdict

from playwright.sync_api import sync_playwright

base = (sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("--") else "http://127.0.0.1:3100").rstrip("/")
sortie = sys.argv[sys.argv.index("--json") + 1] if "--json" in sys.argv else None
PAGES = ["/", "/participer", "/villages/bedjondo", "/journal", "/mission", "/en/index"]
# plafonds (octets compressés estimés par gzip, et millisecondes sous CPU ×4) : une page qui les dépasse fait échouer le script
PLAFONDS = {"css": 70_000, "js": 220_000, "html": 80_000, "polices": 90_000, "total": 600_000, "js_ms": 1500, "tache_max_ms": 800}

TYPES = {"document": "html", "stylesheet": "css", "script": "js", "font": "polices", "image": "images", "fetch": "donnees", "xhr": "donnees", "other": "autres", "manifest": "autres"}


def gz(b: bytes) -> int:
    return len(gzip.compress(b, 6))


def mesurer(pg, cdp, url: str) -> dict:
    poids = defaultdict(int)
    brut = defaultdict(int)
    n = Counter()
    corps = {}

    def reponse(r):
        try:
            if not r.url.startswith(base) or r.status != 200:
                return
            t = TYPES.get(r.request.resource_type, "autres")
            b = r.body()
            brut[t] += len(b)
            poids[t] += gz(b) if t in ("html", "css", "js", "donnees", "autres") else len(b)
            n[t] += 1
        except Exception:
            pass

    pg.on("response", reponse)
    cdp.send("Profiler.start")
    pg.goto(url, wait_until="networkidle")
    pg.wait_for_timeout(1500)
    prof = cdp.send("Profiler.stop")["profile"]
    pg.remove_listener("response", reponse)
    nodes = {x["id"]: x for x in prof["nodes"]}
    js_us = 0
    for s, dt in zip(prof["samples"], prof["timeDeltas"]):
        f = nodes[s]["callFrame"]["functionName"]
        if f not in ("(idle)", "(program)", "(garbage collector)", "(root)"):
            js_us += dt
    taches = pg.evaluate("""() => new Promise(r => { const o = []; new PerformanceObserver(l => o.push(...l.getEntries().map(e => Math.round(e.duration)))).observe({type: 'longtask', buffered: true}); setTimeout(() => r(o), 300); })""")
    return {
        "poids": dict(poids), "brut": dict(brut), "requetes": sum(n.values()), "total": sum(poids.values()),
        "js_ms": round(js_us / 1000), "taches_longues": taches, "tache_max_ms": max(taches, default=0),
    }


resultats = {}
problemes = []
with sync_playwright() as pw:
    b = pw.chromium.launch()
    for p in PAGES:
        ctx = b.new_context(viewport={"width": 390, "height": 844})
        pg = ctx.new_page()
        cdp = ctx.new_cdp_session(pg)
        cdp.send("Emulation.setCPUThrottlingRate", {"rate": 4})
        cdp.send("Profiler.enable")
        r = mesurer(pg, cdp, base + p)
        resultats[p] = r
        ctx.close()
        po = r["poids"]
        print(f"{p:20} {r['requetes']:3} req | html {po.get('html', 0) // 1024:3} css {po.get('css', 0) // 1024:3} js {po.get('js', 0) // 1024:3} polices {po.get('polices', 0) // 1024:3} images {po.get('images', 0) // 1024:3} ko (compressé) | total {r['total'] // 1024:4} ko | JS {r['js_ms']:4} ms | tâche max {r['tache_max_ms']:4} ms")
        for cle, plafond in PLAFONDS.items():
            v = r.get(cle, po.get(cle, 0))
            if v > plafond:
                problemes.append(f"{p} : {cle} = {v} > {plafond}")
    b.close()

if sortie:
    json.dump(resultats, open(sortie, "w"), indent=1)
print(f"\nPROBLÈMES : {len(problemes)}")
for x in problemes:
    print(" -", x)
sys.exit(1 if problemes else 0)
