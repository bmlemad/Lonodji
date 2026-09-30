#!/usr/bin/env python3
"""Dossier imprimable « Nos propositions à la commune de Bédjondo » (A4), à remettre au maire, au préfet
et aux chefs de canton. Tiré de la version imprimable de la page (/territoire/propositions-commune/dossier), qui lit les mêmes
données : le PDF dit exactement ce que dit la page (dix projets, démarche, mesures, apports).

  (serveur local lancé : npx next start -p 3100)
  python3 scripts/build-propositions-pdf.py
Sortie : public/notes/propositions-commune-bedjondo.pdf (dossier non effacé par l'import).
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SORTIE = ROOT / "public" / "notes" / "propositions-commune-bedjondo.pdf"
URL = "http://localhost:3100/territoire/propositions-commune/dossier"

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.goto(URL, wait_until="networkidle")
    pg.emulate_media(media="print")
    SORTIE.parent.mkdir(parents=True, exist_ok=True)
    pg.pdf(path=str(SORTIE), format="A4", print_background=True, margin={"top": "12mm", "bottom": "14mm", "left": "11mm", "right": "11mm"},
           display_header_footer=True, header_template="<span></span>",
           footer_template='<div style="font:7px Arial;color:#526159;width:100%;padding:0 12mm;display:flex;justify-content:space-between">'
                           '<span>ADEB LONODJI · Nos propositions à la commune de Bédjondo · lonodji.org/territoire/propositions-commune</span>'
                           '<span>page <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>')
    b.close()
print(f"dossier → {SORTIE.relative_to(ROOT)} ({SORTIE.stat().st_size // 1024} Ko)")
