#!/usr/bin/env python3
"""Silhouette du pays bedjond (public/carte/territoire.svg) pour l'accueil.

Tirée des mêmes tracés que la carte (public/carte/donnees.json) : les sept
unités du cœur en aplat, les autres en contour, Bédjondo marquée d'un point.
Décorative : la page la charge en image, cachée aux lecteurs d'écran.

    python3 scripts/build-territoire-svg.py
"""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "carte" / "donnees.json"
OUT = ROOT / "public" / "carte" / "territoire.svg"
W = 1000  # largeur de la boîte ; la hauteur suit la géographie
MARGE = 24

STYLES = {
    "coeur": 'fill="#173b2d" fill-opacity=".12" stroke="#173b2d" stroke-opacity=".55" stroke-width="1.6"',
    "sud": 'fill="#5b7a3a" fill-opacity=".07" stroke="#5b7a3a" stroke-opacity=".5" stroke-width="1.3"',
    "signale": 'fill="none" stroke="#8c8a3c" stroke-opacity=".5" stroke-width="1.2" stroke-dasharray="6 5"',
    "diaspora": 'fill="none" stroke="#b5532e" stroke-opacity=".45" stroke-width="1.2" stroke-dasharray="3 5"',
}


def rings(g):
    if g["type"] == "Polygon":
        yield from g["coordinates"]
    else:
        for poly in g["coordinates"]:
            yield from poly


def main() -> None:
    d = json.loads(SRC.read_text("utf8"))
    pts = [(x, y) for u in d["unites"] for r in rings(u["geometrie"]) for x, y in r]
    minx, maxx = min(p[0] for p in pts), max(p[0] for p in pts)
    miny, maxy = min(p[1] for p in pts), max(p[1] for p in pts)
    k = math.cos(math.radians((miny + maxy) / 2))  # équirectangulaire corrigée
    sx = (W - 2 * MARGE) / ((maxx - minx) * k)
    H = int((maxy - miny) * sx + 2 * MARGE)

    def proj(x, y):
        return (MARGE + (x - minx) * k * sx, MARGE + (maxy - y) * sx)

    paths = []
    ordre = {"diaspora": 0, "signale": 1, "sud": 2, "coeur": 3}
    for u in sorted(d["unites"], key=lambda u: ordre[u["groupe"]]):
        dd = []
        for r in rings(u["geometrie"]):
            seg = " ".join(f"{px:.1f},{py:.1f}" for px, py in (proj(x, y) for x, y in r))
            dd.append(f"M{seg}Z")
        paths.append(f'<path d="{" ".join(dd)}" {STYLES[u["groupe"]]}><title>{u["nom"]}</title></path>')
    bx, by = proj(*d["unites"][[u["id"] for u in d["unites"]].index("bedjondo")]["centre"])
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-label="Silhouette du pays bedjond">\n'
        f'<desc>Les quatorze unités du pays bedjond, tracées d’après la carte du territoire (GADM 4.1). Bédjondo est marquée d’un point.</desc>\n'
        + "\n".join(paths)
        + f'\n<circle cx="{bx:.1f}" cy="{by:.1f}" r="16" fill="#b6cf45" fill-opacity=".35"/>'
        f'<circle cx="{bx:.1f}" cy="{by:.1f}" r="6" fill="#173b2d"/>'
        f'<text x="{bx + 16:.1f}" y="{by - 12:.1f}" font-family="DM Sans, system-ui, sans-serif" font-size="22" font-weight="600" letter-spacing=".08em" fill="#173b2d">BÉDJONDO</text>\n</svg>\n'
    )
    OUT.write_text(svg, "utf8")
    print(f"{OUT.relative_to(ROOT)} : {W}×{H}, {len(paths)} unités, {OUT.stat().st_size // 1024} Ko")


if __name__ == "__main__":
    main()
