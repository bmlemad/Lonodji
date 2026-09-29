"""Inspection de cohérence : chiffres et formulations à travers toutes les pages construites (.next), à lancer après npm run build.

    python3 scripts/qa/coherence.py"""
import re, json, collections, html
from pathlib import Path
ROOT = Path(__file__).resolve().parents[2]
BUILT = ROOT / ".next" / "server" / "app"
idx = json.load(open(ROOT / "content" / "index.json", encoding="utf-8"))
ind = json.load(open(ROOT / "content" / "indicateurs.json", encoding="utf-8"))
them = [t for p in idx["structure"]["poles"] for t in p["items"]]
pourvues = sum(1 for t in them if t["filled"]); vacantes = len(them) - pourvues
cellules = idx["structure"]["cellules"]["items"]; cel_vac = sum(1 for c in cellules if not c["filled"])
forms = open(ROOT / "public" / "__forms.html", encoding="utf-8").read().count("<form ")
print("état réel :", f"{pourvues}/{len(them)} pourvues, {vacantes} à pourvoir, cellules vacantes {cel_vac}, formulaires {forms}, articles {len(idx['articles'])}, PDF {ind['contenu']['documentsPdf']}, plaidoyers {ind['contenu']['plaidoyers']['publies']}, pages EN {sum(1 for p in idx['pages'] if p['kind']=='en')}+1")

def text_of(f):
    h = f.read_text(encoding="utf-8")
    m = re.search(r"<main[^>]*>(.*?)</main>", h, re.S)
    body = m.group(1) if m else h
    body = re.sub(r"<script[^>]*>.*?</script>", " ", body, flags=re.S)
    t = html.unescape(re.sub(r"<[^>]+>", " ", body))
    return re.sub(r"\s+", " ", t)

# motifs à vérifier : (regex, commentaire, attendu)
MOTIFS = [
    (r"\b(treize|quatorze|douze|onze|dix|neuf|huit|sept|six|cinq|quatre|trois)\s+(des dix-neuf\s+)?thématiques\s+(attendent|cherchent|restent|encore|sans|à pourvoir|et deux cellules|et une cellule)", "thématiques à pourvoir", f"{vacantes}"),
    (r"\b(\d+|treize|quatorze|quinze|seize)\s*(thématiques|coordinations)\s+(pourvues|sur dix-neuf|sur 19)", "pourvues", f"{pourvues}"),
    (r"\b(\d+)/(19|20)\b", "x/20", f"{pourvues}"),
    (r"\b(quinze|seize|dix-sept|dix-huit|dix-neuf|vingt|vingt et un)\s+formulaires", "formulaires (total)", f"{forms}"),
    (r"Pour (\w+) de ces formulaires", "formulaires comptés", "quinze"),
    (r"\b(sept|huit|neuf)\s+(plaidoyers|dossiers de plaidoyer)", "plaidoyers", "huit"),
    (r"\b(\d+)\s+articles", "articles", f"{len(idx['articles'])}"),
    (r"\b(\d+)\s+(PDF|documents PDF)", "PDF", f"{ind['contenu']['documentsPdf']}"),
    (r"\b(deux cellules|une cellule)\b", "cellules", "—"),
    (r"\b(six|seven|Six|Seven)\s+pages", "pages EN", "7"),
    (r"\bthirteen themes still open\b", "EN thirteen", "0"),
    (r"\b(\d+)\s+corrections", "corrections", f"{ind['contenu']['corrections']}"),
    (r"\b(\d[\d\s ]*)\s+localités", "localités", "1 259 / 966"),
    (r"\b(\d+)\s+références", "références", "40"),
    (r"Madjirabé", "ancienne graphie", "seulement journal des corrections"),
    (r"Organisation de Développement et d’Entraide des Bedjond", "ancien sigle", "seulement la note datée"),
]
hits = collections.defaultdict(list)
for f in sorted(BUILT.rglob("*.html")):
    route = "/" + f.relative_to(BUILT).with_suffix("").as_posix()
    if route.startswith("/villages/") and route.count("/") > 2:
        continue  # 966 fiches identiques en structure
    t = text_of(f)
    for rx, nom, attendu in MOTIFS:
        for m in re.finditer(rx, t):
            ctx = t[max(0, m.start()-60): m.end()+60]
            hits[(nom, attendu)].append((route, m.group(0), ctx))
for (nom, attendu), lst in hits.items():
    vals = collections.Counter(m for _, m, _ in lst)
    print(f"\n== {nom} (attendu : {attendu}) — {len(lst)} occurrences : {dict(vals)}")
    seen = set()
    for route, m, ctx in lst:
        key = (route, m)
        if key in seen: continue
        seen.add(key)
        print(f"   {route:45s} | {m} | …{ctx}…")
