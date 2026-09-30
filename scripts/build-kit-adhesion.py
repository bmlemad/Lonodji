#!/usr/bin/env python3
"""Met à jour le kit d'adhésion (PDF statique du 17 septembre 2026, sans source HTML).

Le kit d'origine ne disait pas que la collecte est suspendue depuis le 23 septembre 2026,
faisait déclarer avoir lu des statuts et un règlement intérieur non publiés, et renvoyait
vers une messagerie personnelle. Ce script repart toujours de l'original (ancien site) et :
  - ajoute en bas de chaque page un avertissement « collecte suspendue » ;
  - remplace l'adresse de messagerie par lonodji.org/participer (même fond, même taille) ;
  - réécrit le paragraphe « Engagement » du bulletin.
L'adresse et l'ancien engagement sont retirés de la couche texte (caviardage), pas seulement recouverts.
scripts/import-legacy.py lance ce script juste après avoir recopié public/documents ; scripts/qa/documents.py
vérifie les PDF publiés (aucune messagerie personnelle, ni ancien engagement, avertissement présent).

Le carnet d'enquête de terrain donnait la même adresse : il reçoit le même remplacement (et rien d'autre).

  python3 scripts/build-kit-adhesion.py [<ancien-site>]   (lancé par scripts/import-legacy.py)
"""
import io
import subprocess
import sys
import tempfile
from pathlib import Path

import pdfplumber
import pymupdf  # pip install pymupdf : caviardage réel du texte d'origine
from PIL import Image
from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import Color, HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph

ROOT = Path(__file__).resolve().parent.parent
LEGACY_DOCS = Path(sys.argv[1] if len(sys.argv) > 1 else "/home/claude/lonodji") / "documents"
NOM = "kit-adhesion-adeb-lonodji-2026.pdf"
CARNET = "carnet-enquete-terrain-adeb-lonodji-2026.pdf"   # même adresse personnelle, remplacée de la même façon

pdfmetrics.registerFont(TTFont("DV", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("DVB", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))

AVERTISSEMENT = ("<b>Collecte suspendue depuis le 23 septembre 2026.</b> Ne rien encaisser, ni en espèces ni par Mobile Money, "
                 "avant l'autorisation de l'association, le vote de la grille par l'assemblée générale et l'ouverture d'un compte "
                 "à son nom, à double signature. Ce kit prépare l'ouverture des adhésions. Contact : lonodji.org/participer · "
                 "WhatsApp +235 66 29 94 03 (président). Mise à jour du 29 septembre 2026.")
ENGAGEMENT = ("<b>Engagement.</b> Je demande mon adhésion à ADEB LONODJI, m'engage à prendre connaissance de ses statuts et de son "
              "règlement intérieur dès leur publication, et m'engage à respecter sa règle de non-appartenance partisane. J'autorise "
              "l'inscription de mes coordonnées au registre des adhérents ; je sais qu'il n'est ni publié ni transmis, et je peux "
              "demander leur retrait à tout moment.")


def couleur_fond(img: Image.Image, x0: float, top: float, x1: float, bottom: float) -> tuple[int, int, int]:
    """Couleur la plus fréquente sur le pourtour d'un mot (image rendue à 72 ppp : 1 px = 1 pt)."""
    from collections import Counter
    pts = [(int(x), int(y)) for x in range(int(x0), int(x1) + 1, 2) for y in (int(top) - 2, int(bottom) + 2)]
    return Counter(img.getpixel(p)[:3] for p in pts).most_common(1)[0][0]


def zones(pp, kit: bool) -> list[tuple[float, float, float, float]]:
    """Zones à caviarder sur une page (repère pdfplumber : origine en haut à gauche, comme PyMuPDF) :
    chaque adresse de messagerie et, dans le kit, le paragraphe « Engagement » d'origine."""
    z = [(m["x0"], m["top"], m["x1"], m["bottom"]) for m in pp.extract_words() if "gmail" in m["text"]]
    lignes = pp.extract_text_lines() if kit else []
    for ligne in lignes:
        if ligne["text"].startswith("Engagement."):
            haut = ligne["top"] - 2
            fin = [l for l in lignes if haut < l["top"] < haut + 40]
            z.append((ligne["x0"] - 1, haut, max(l["x1"] for l in fin) + 3, max(l["bottom"] for l in fin) + 2))
    return z


def caviarder(original: Path, dest: Path, plumb, kit: bool) -> None:
    """Retire du texte de l'original ce que les surimpressions recouvrent. Sans cela, l'adresse personnelle et
    l'ancien engagement restent dans la couche texte du PDF (copier-coller, recherche, moteurs) sous le cache.
    Seul le texte est retiré : fonds, filets et images restent intacts."""
    doc = pymupdf.open(str(original))
    for i, page in enumerate(doc):
        for x0, top, x1, bottom in zones(plumb.pages[i], kit):
            page.add_redact_annot(pymupdf.Rect(x0, top, x1, bottom), fill=False)
        page.apply_redactions(images=pymupdf.PDF_REDACT_IMAGE_NONE, graphics=pymupdf.PDF_REDACT_LINE_ART_NONE)
        # Pas de clean_contents() : il retrace les filets du bulletin. PyMuPDF ôte en revanche le saut de ligne
        # final du flux : la fusion pypdf collerait alors « Q » à « EMC » (opérateur inconnu).
        for x in page.get_contents():
            flux = doc.xref_stream(x)
            if not flux.endswith(b"\n"):
                doc.update_stream(x, flux + b"\n")
    doc.save(str(dest), garbage=3, deflate=True)
    doc.close()


def couleur_texte(mot: dict) -> Color | None:
    """Couleur du premier caractère du mot, si le PDF la donne en RVB ou en gris."""
    coul = (mot.get("chars") or [{}])[0].get("non_stroking_color")
    if isinstance(coul, (list, tuple)) and len(coul) == 3:
        return Color(*coul)
    if isinstance(coul, (list, tuple)) and len(coul) == 1:
        return Color(coul[0], coul[0], coul[0])
    return None


def traiter(nom: str, titre: str, kit: bool) -> None:
    original, sortie = LEGACY_DOCS / nom, ROOT / "public" / "documents" / nom
    if not original.exists():
        sys.exit(f"original introuvable : {original}")
    ecrivain = PdfWriter()
    with tempfile.TemporaryDirectory() as d, pdfplumber.open(str(original)) as plumb:
        caviarde = Path(d) / "caviarde.pdf"
        caviarder(original, caviarde, plumb, kit)
        lecteur = PdfReader(str(caviarde))
        subprocess.run(["pdftoppm", "-r", "72", "-png", str(original), f"{d}/p"], check=True)
        images = sorted(Path(d).glob("p-*.png"))
        for i, page in enumerate(lecteur.pages):
            w, h = float(page.mediabox.width), float(page.mediabox.height)
            pp = plumb.pages[i]
            mots = [m for m in pp.extract_words(extra_attrs=["size"], return_chars=True) if "gmail" in m["text"]]
            if not kit and not mots:
                ecrivain.add_page(page)
                continue
            img = Image.open(images[i]).convert("RGB")
            tampon = io.BytesIO()
            c = canvas.Canvas(tampon, pagesize=(w, h))
            # 1. adresse de messagerie personnelle → site (la ponctuation qui suit l'adresse est gardée)
            for mot in mots:
                fond = couleur_fond(img, mot["x0"], mot["top"], mot["x1"], mot["bottom"])
                clair = sum(fond) / 3 > 140
                c.setFillColorRGB(*(v / 255 for v in fond))
                c.rect(mot["x0"] - 1, h - mot["bottom"] - 1.2, mot["x1"] - mot["x0"] + 2, mot["bottom"] - mot["top"] + 2.4, stroke=0, fill=1)
                if kit:
                    c.setFillColor(HexColor("#5a6780") if clair else Color(1, 1, 1))
                else:
                    c.setFillColor(couleur_texte(mot) or Color(0, 0, 0))
                c.setFont("DV", mot["size"])
                suite = mot["text"].split("gmail.com", 1)[-1]
                # le kit garde son placement d'origine ; ailleurs, la ligne de base réelle du mot (matrice du 1er caractère)
                base = h - mot["bottom"] + 0.6 if kit else mot["chars"][0]["matrix"][5]
                c.drawString(mot["x0"], base, "lonodji.org/participer" + suite)
            if kit:
                # 2. paragraphe « Engagement » du bulletin
                for ligne in pp.extract_text_lines():
                    if ligne["text"].startswith("Engagement."):
                        haut = ligne["top"] - 2
                        fin = [l for l in pp.extract_text_lines() if haut < l["top"] < haut + 40]
                        bas = max(l["bottom"] for l in fin) + 2
                        x0, x1 = ligne["x0"], max(l["x1"] for l in fin)
                        c.setFillColorRGB(1, 1, 1)
                        c.rect(x0 - 1, h - bas, x1 - x0 + 4, bas - haut, stroke=0, fill=1)
                        style = ParagraphStyle("e", fontName="DV", fontSize=6.6, leading=8.6, textColor=HexColor("#10241e"))
                        par = Paragraph(ENGAGEMENT.replace("<b>", '<font name="DVB">').replace("</b>", "</font>"), style)
                        _, ph = par.wrap(x1 - x0 + 2, bas - haut)
                        par.drawOn(c, x0, h - haut - ph)
                # 3. avertissement en bas de page
                style = ParagraphStyle("a", fontName="DV", fontSize=6.6, leading=8.4, textColor=HexColor("#7a2e00"))
                par = Paragraph(AVERTISSEMENT.replace("<b>", '<font name="DVB">').replace("</b>", "</font>"), style)
                largeur = w - 44
                _, ph = par.wrap(largeur - 14, 60)
                y = 16
                c.setFillColor(HexColor("#fff4e5"))
                c.setStrokeColor(HexColor("#d9822b"))
                c.roundRect(22, y, largeur, ph + 10, 4, stroke=1, fill=1)
                par.drawOn(c, 29, y + 5)
            c.save()
            tampon.seek(0)
            page.merge_page(PdfReader(tampon).pages[0])
            ecrivain.add_page(page)
    ecrivain.add_metadata({"/Title": titre})
    with open(sortie, "wb") as f:
        ecrivain.write(f)
    print(f"{nom} mis à jour → {sortie.relative_to(ROOT)}")


def main() -> None:
    traiter(NOM, "Kit d'adhésion — ADEB LONODJI (mis à jour le 29 septembre 2026)", kit=True)
    traiter(CARNET, "Carnet d'enquête de terrain — ADEB LONODJI", kit=False)


if __name__ == "__main__":
    main()
