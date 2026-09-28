#!/usr/bin/env python3
"""Version PDF du livre blanc du projet ODEB LONODJI (public/odeb/…pdf).

Rend la page /odeb/livre-blanc du site construit (feuille de style d'impression
de app/site.css) avec Playwright, en A4, avec la pagination en pied de page.
Le PDF est produit à partir de la page : pas de texte à tenir à double.

    npm run build && python3 scripts/build-livre-blanc.py

Le script lance `next start` sur un port libre le temps du rendu, puis l'arrête.
À relancer après toute modification de la page (les chiffres y sont ceux du site).
"""
from __future__ import annotations

import os
import signal
import socket
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "odeb" / "livre-blanc-odeb-lonodji-2026.pdf"
ROUTE = "/odeb/livre-blanc"


def port_libre() -> int:
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def attendre(url: str, delai: float = 60) -> None:
    fin = time.time() + delai
    while time.time() < fin:
        try:
            with urllib.request.urlopen(url, timeout=3) as r:
                if r.status == 200:
                    return
        except Exception:
            time.sleep(0.5)
    raise SystemExit(f"le site ne répond pas sur {url} : lancer npm run build d'abord")


def main() -> None:
    from playwright.sync_api import sync_playwright

    if not (ROOT / ".next" / "BUILD_ID").exists():
        raise SystemExit("aucune construction : lancer npm run build d'abord")
    port = port_libre()
    serveur = subprocess.Popen(["npx", "next", "start", "-p", str(port)], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, preexec_fn=os.setsid)
    try:
        attendre(f"http://127.0.0.1:{port}{ROUTE}")
        OUT.parent.mkdir(parents=True, exist_ok=True)
        with sync_playwright() as p:
            b = p.chromium.launch()
            page = b.new_page(viewport={"width": 1000, "height": 1400})
            page.goto(f"http://127.0.0.1:{port}{ROUTE}", wait_until="networkidle")
            page.emulate_media(media="print")
            page.pdf(
                path=str(OUT),
                format="A4",
                print_background=True,
                margin={"top": "18mm", "bottom": "18mm", "left": "16mm", "right": "16mm"},
                display_header_footer=True,
                header_template="<div></div>",
                footer_template=(
                    "<div style='width:100%;font-family:DM Sans,Helvetica,Arial,sans-serif;font-size:8px;color:#607069;"
                    "padding:0 16mm;display:flex;justify-content:space-between;'>"
                    "<span>ADEB LONODJI · Livre blanc du projet ODEB LONODJI · version de travail n° 1 · lonodji.org/odeb/livre-blanc</span>"
                    "<span>page <span class='pageNumber'></span> / <span class='totalPages'></span></span></div>"
                ),
            )
            b.close()
        print(f"{OUT.relative_to(ROOT)} : {OUT.stat().st_size // 1024} Ko")
    finally:
        os.killpg(os.getpgid(serveur.pid), signal.SIGTERM)
        try:
            serveur.wait(timeout=10)
        except subprocess.TimeoutExpired:
            os.killpg(os.getpgid(serveur.pid), signal.SIGKILL)


if __name__ == "__main__":
    sys.exit(main())
