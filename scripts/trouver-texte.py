#!/usr/bin/env python3
"""Trouver d'où vient un texte affiché sur le site, et vérifier les corrections des pages héritées.

    python3 scripts/trouver-texte.py "citation telle qu'affichée"   [--ancien /chemin/ancien-site]
    python3 scripts/trouver-texte.py --verifier                      (corrections sans effet, sans rien écrire)

Pour une citation : cherche dans le code du site (app, lib, components, scripts, content/projets.json…) et dans
le HTML de l'ancien site tel que le voient les corrections (scripts/corrections_*.py, après les réécritures de
structure). Affiche la clé du fichier et l'extrait EXACT du HTML à remplacer (entités et balises comprises) :
c'est ce qu'il faut recopier comme « ancien » dans une paire de correction.
Comparaison tolérante : espaces (insécables compris) et apostrophes ’/' sont confondus, balises ignorées.
"""
import html as H
import importlib.util
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
args = [a for a in sys.argv[1:]]
ancien = Path("/home/claude/lonodji")
if "--ancien" in args:
    i = args.index("--ancien"); ancien = Path(args[i + 1]); del args[i:i + 2]

# import-legacy.py lit l'ancien site dans sys.argv[1]
sys.argv = [sys.argv[0], str(ancien)]
spec = importlib.util.spec_from_file_location("import_legacy", ROOT / "scripts" / "import-legacy.py")
IL = importlib.util.module_from_spec(spec)
spec.loader.exec_module(IL)

ETAPE: dict = {}
_orig = IL.corrections_revue


def _capture(html, path):
    # le texte tel que le voient les corrections, toutes celles qui existent déjà appliquées
    # (une nouvelle paire, dans un fichier corrections_revue_*.py, s'applique à ce texte-là)
    ETAPE[path] = _orig(html, path)
    return ETAPE[path]


IL.corrections_revue = _capture
FICHIERS = sorted(p for p in ancien.rglob("*.html") if "documents" not in p.parts)


def charger():
    for p in FICHIERS:
        IL.lire_source(p)


def normaliser_avec_carte(raw: str):
    """Texte visible normalisé + pour chaque caractère, sa position de début et de fin dans raw."""
    out, debut, fin = [], [], []
    i, n = 0, len(raw)
    while i < n:
        c = raw[i]
        if c == "<":
            j = raw.find(">", i)
            if j < 0:
                break
            i = j + 1
            continue
        if c == "&":
            m = re.match(r"&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);", raw[i:])
            if m:
                ch = H.unescape(m.group(0)); a, b = i, i + len(m.group(0)); i = b
            else:
                ch = c; a, b = i, i + 1; i += 1
        else:
            ch = c; a, b = i, i + 1; i += 1
        for x in ch:
            x = norm_car(x)
            if x == " " and out and out[-1] == " ":
                fin[-1] = b
                continue
            out.append(x); debut.append(a); fin.append(b)
    return "".join(out), debut, fin


def norm_car(x):
    if x in "    \n\t\r ":
        return " "
    if x in "’‘":
        return "'"
    return x


def norm(s: str) -> str:
    return re.sub(" +", " ", "".join(norm_car(x) for x in H.unescape(s))).strip()


def chercher(citation: str):
    q = norm(citation)
    print(f"— citation normalisée : « {q[:120]} »\n")
    # 1. code du site
    motif = q[:60]
    cmd = ["grep", "-rlF", "--include=*.ts", "--include=*.tsx", "--include=*.py", "--include=*.js", "--include=*.json",
           motif, "app", "lib", "components", "scripts", "content/projets.json", "content/lettres.json"]
    r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
    vus = [l for l in r.stdout.split() if l]
    # recherche tolérante (apostrophes) dans les fichiers sources
    if not vus:
        for f in list((ROOT / "app").rglob("*.tsx")) + list((ROOT / "lib").rglob("*.ts")) + list((ROOT / "components").rglob("*.tsx")) \
                + list((ROOT / "scripts").glob("*.py")) + [ROOT / "content" / "projets.json"]:
            try:
                if q[:50] in norm(f.read_text()):
                    vus.append(str(f.relative_to(ROOT)))
            except Exception:
                pass
    print("CODE DU SITE :", ", ".join(vus) if vus else "rien")
    # 2. ancien site, étape des corrections
    charger()
    trouve = False
    for p, raw in ETAPE.items():
        t, d, f = normaliser_avec_carte(raw)
        k = t.find(q)
        while k >= 0:
            trouve = True
            cle = p.relative_to(ancien).as_posix()
            extrait = raw[d[k]:f[k + len(q) - 1]]
            nb = raw.count(extrait)
            print(f"\nANCIEN SITE : {cle}  (l'extrait apparaît {nb} fois dans ce fichier)")
            print("EXTRAIT EXACT :")
            print(repr(extrait))
            k = t.find(q, k + 1)
    if not trouve:
        print("\nANCIEN SITE : rien à l'étape des corrections (texte ajouté plus tard : structure_30_09, comptes_courants,"
              " UPDATES de import-legacy.py, ou texte calculé par le site)")


def verifier():
    charger()
    from collections import Counter
    manq = sorted(set(IL.CORRECTIONS_MANQUEES))
    for cle, debut in manq:
        print(f"correction sans effet : {cle} · « {debut}… »")
    print("corrections sans effet :", len(manq))
    return 1 if manq else 0


if __name__ == "__main__":
    if not args:
        print(__doc__); sys.exit(2)
    if args[0] == "--verifier":
        sys.exit(verifier())
    chercher(" ".join(args))
