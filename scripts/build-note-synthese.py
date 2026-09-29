#!/usr/bin/env python3
"""Note de synthèse des huit dossiers de plaidoyer, en PDF A4 (pièce jointe des courriers aux bailleurs).

Source : content/notes/note-synthese-bedjondo.md (texte relu, chiffres repris des plaidoyers publiés).
Sortie : public/notes/note-synthese-bedjondo.pdf (dossier non effacé par l'import de l'ancien site).

  python3 scripts/build-note-synthese.py
"""
from pathlib import Path

import markdown
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "content" / "notes" / "note-synthese-bedjondo.md"
SORTIE = ROOT / "public" / "notes" / "note-synthese-bedjondo.pdf"
LOGO = ROOT / "public" / "icones" / "logo-motif-verre.svg"

CSS = """
@page { size: A4; margin: 14mm 13mm 16mm; }
* { box-sizing: border-box; }
body { font-family: "DejaVu Sans", Arial, sans-serif; color: #10241e; font-size: 8.6pt; line-height: 1.42; margin: 0; }
header { display: flex; align-items: center; gap: 12px; border-bottom: 2px solid #b6cf45; padding-bottom: 8px; margin-bottom: 10px; }
header .logo svg { width: 40px; height: 45px; display: block; }
header .org { font-weight: 700; letter-spacing: .08em; font-size: 9pt; }
header .sub { color: #526159; font-size: 7.6pt; }
h1 { font-size: 15pt; line-height: 1.15; margin: 0 0 4px; letter-spacing: -.01em; }
h1 + p { color: #526159; margin: 0 0 8px; font-size: 8pt; }
h2 { font-size: 10.5pt; margin: 12px 0 5px; color: #173b2d; border-left: 3px solid #b6cf45; padding-left: 7px; }
p { margin: 0 0 6px; }
table { width: 100%; border-collapse: collapse; margin: 4px 0 8px; font-size: 7.5pt; page-break-inside: auto; }
th { text-align: left; background: #173b2d; color: #fff; font-weight: 700; padding: 4px 5px; }
td { border-bottom: 1px solid #d7ded3; padding: 4px 5px; vertical-align: top; }
tr { page-break-inside: avoid; }
tr:nth-child(even) td { background: #f4f7ef; }
ul, ol { margin: 0 0 6px 16px; padding: 0; }
li { margin: 0 0 2px; }
a { color: #173b2d; }
"""


def main() -> None:
    texte = SOURCE.read_text(encoding="utf-8")
    corps = markdown.markdown(texte, extensions=["tables"])
    html = f"""<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<header><span class="logo">{LOGO.read_text(encoding="utf-8")}</span><div><div class="org">ADEB LONODJI</div>
<div class="sub">Association de Développement et d’Entraide de Bédjondo · Mandoul Occidental, Tchad · lonodji.org</div></div></header>
{corps}
</body></html>"""
    tmp = SORTIE.with_suffix(".html")
    SORTIE.parent.mkdir(parents=True, exist_ok=True)
    tmp.write_text(html, encoding="utf-8")
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page()
        pg.goto(tmp.as_uri())
        pg.pdf(path=str(SORTIE), format="A4", print_background=True, prefer_css_page_size=True, display_header_footer=True,
               header_template="<span></span>",
               footer_template='<div style="font:7px DejaVu Sans,Arial;color:#526159;width:100%;padding:0 13mm;display:flex;justify-content:space-between">'
                               '<span>ADEB LONODJI · Note de synthèse, 29 septembre 2026 · lonodji.org/actions</span>'
                               '<span>page <span class="pageNumber"></span> / <span class="totalPages"></span></span></div>')
        b.close()
    tmp.unlink()
    print(f"note de synthèse → {SORTIE.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
