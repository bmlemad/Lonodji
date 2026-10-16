#!/usr/bin/env python3
"""Recette de l'hébergement OVH (export statique + .htaccess + scripts PHP).

    python3 scripts/qa/hebergement.py https://lonodji.org            # après la bascule
    python3 scripts/qa/hebergement.py https://xxx.hosting.ovh.net     # adresse technique, avant la bascule
    python3 scripts/qa/hebergement.py BASE --sitemap                  # en plus : toutes les adresses du sitemap

Vérifie ce que scripts/qa/controle.py ne voit pas : en-têtes réels d'Apache, redirections 301, barre finale,
page 404, scripts PHP joignables, fichiers privés refusés. Ne poste rien : les formulaires sont testés à la main.
Sortie : « PROBLÈMES : 0 » et code 0 si tout va bien."""
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

BASE = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "https://lonodji.org"
SITEMAP = "--sitemap" in sys.argv
HOTE = urllib.parse.urlparse(BASE).netloc
PROBLEMES: list[str] = []


def req(path: str, methode: str = "GET", entetes: dict | None = None, donnees: bytes | None = None):
    r = urllib.request.Request(BASE + path, method=methode, data=donnees, headers={"User-Agent": "lonodji-recette", **(entetes or {})})
    opener = urllib.request.build_opener(_SansRedirection)
    try:
        with opener.open(r, timeout=30) as resp:
            return resp.status, {k.lower(): v for k, v in resp.headers.items()}, resp.read(200000)
    except urllib.error.HTTPError as e:
        return e.code, {k.lower(): v for k, v in e.headers.items()}, e.read(200000)
    except Exception as e:  # réseau
        return 0, {}, str(e).encode()


class _SansRedirection(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


def attendu(condition: bool, message: str):
    if not condition:
        PROBLEMES.append(message)


def titre(t: str):
    print(f"\n== {t}")


titre("Pages")
for p in ["/", "/participer", "/association/election-vice-presidences", "/villages/bedjondo", "/en/index", "/journal", "/recherche", "/redaction"]:
    c, h, corps = req(p)
    attendu(c == 200, f"{p} → {c} (attendu 200)")
    attendu(b"<html" in corps[:300].lower(), f"{p} : pas une page HTML")
    print(f"{c} {p}")

titre("Fichiers servis")
for p, ct in [("/sitemap.xml", "xml"), ("/robots.txt", "text/plain"), ("/manifest.webmanifest", "manifest"), ("/sw.js", "javascript"),
              ("/search-index.json", "json"), ("/carte/donnees.json", "json"), ("/partage/election-vice-presidences.png", "image/png"), ("/404.html", "html")]:
    c, h, _ = req(p)
    attendu(c == 200, f"{p} → {c}")
    attendu(ct in h.get("content-type", ""), f"{p} : Content-Type {h.get('content-type')!r} (attendu {ct})")
    print(f"{c} {p} {h.get('content-type', '')}")

titre("Adresses : barre finale, .html, 404")
c, h, _ = req("/participer/")
attendu(c in (301, 308) and h.get("location", "").rstrip("/").endswith("/participer"), f"/participer/ → {c} {h.get('location')} (attendu 301 vers /participer)")
c, h, corps = req("/page-qui-n-existe-pas")
attendu(c == 404, f"/page-qui-n-existe-pas → {c} (attendu 404)")
attendu(b"<html" in corps[:300].lower(), "404 : la page 404.html n'est pas servie")
c, h, _ = req("/villages")
attendu(c == 200, f"/villages (dossier et page) → {c}")
print("barre finale, 404, dossier+page : vérifiés")

titre("Redirections 301 (next.config.mjs)")
for src, dst in [("/dossiers/mission", "/mission"), ("/poles", "/programmes"), ("/articles/2026-09-28-lettre-information-02", "/journal/2026-09-28-lettre-information-02"),
                 ("/en/index.html", "/en/index"), ("/thematiques", "/programmes"), ("/don", "/participer#soutenir")]:
    c, h, _ = req(src)
    loc = h.get("location", "")
    attendu(c in (301, 308) and loc.endswith(dst), f"{src} → {c} {loc} (attendu 301 vers {dst})")
    print(f"{c} {src} → {loc}")

titre("HTTPS et domaine")
if HOTE == "lonodji.org":
    for url in ["http://lonodji.org/participer", "https://www.lonodji.org/participer"]:
        r = urllib.request.Request(url, headers={"User-Agent": "lonodji-recette"})
        try:
            with urllib.request.build_opener(_SansRedirection).open(r, timeout=30) as resp:
                c, loc = resp.status, resp.headers.get("Location", "")
        except urllib.error.HTTPError as e:
            c, loc = e.code, e.headers.get("Location", "")
        except Exception as e:
            c, loc = 0, str(e)
        attendu(c == 301 and loc == "https://lonodji.org/participer", f"{url} → {c} {loc} (attendu 301 vers https://lonodji.org/participer)")
        print(f"{c} {url} → {loc}")
else:
    print("adresse technique : redirections HTTPS/www non testées")

titre("En-têtes de sécurité et de cache")
c, h, _ = req("/participer")
for cle, attendu_dans in [("content-security-policy", "default-src 'self'"), ("strict-transport-security", "max-age=31536000"), ("x-content-type-options", "nosniff"),
                          ("x-frame-options", "DENY"), ("referrer-policy", "strict-origin"), ("permissions-policy", "camera=()"), ("cross-origin-opener-policy", "same-origin")]:
    attendu(attendu_dans in h.get(cle, ""), f"/participer : en-tête {cle} = {h.get(cle)!r}")
attendu("must-revalidate" in h.get("cache-control", ""), f"/participer : Cache-Control {h.get('cache-control')!r} (attendu must-revalidate)")
attendu("x-powered-by" not in h, "/participer : X-Powered-By présent")
print("CSP, HSTS, nosniff, X-Frame, Referrer, Permissions, COOP :", "ok" if not [p for p in PROBLEMES if "/participer : en-tête" in p] else "voir problèmes")
_, _, corps = req("/")
m = re.search(rb'src="(/_next/static/chunks/[^"]+\.js)"', corps)
if m:
    p = m.group(1).decode()
    c, h, _ = req(p)
    attendu(c == 200 and "immutable" in h.get("cache-control", ""), f"{p} : {c} Cache-Control {h.get('cache-control')!r} (attendu immutable)")
    print(f"{c} {p} {h.get('cache-control')}")
else:
    attendu(False, "aucun script /_next/static trouvé sur l'accueil")
for p in ["/search-index.json", "/carte/donnees.json"]:
    c, h, _ = req(p)
    attendu("must-revalidate" in h.get("cache-control", ""), f"{p} : Cache-Control {h.get('cache-control')!r} (attendu must-revalidate)")
c, h, _ = req("/sw.js")
attendu("no-cache" in h.get("cache-control", ""), f"/sw.js : Cache-Control {h.get('cache-control')!r} (attendu no-cache)")
c, h, _ = req("/redaction")
attendu("no-store" in h.get("cache-control", "") and "noindex" in h.get("x-robots-tag", ""), f"/redaction : Cache-Control {h.get('cache-control')!r}, X-Robots-Tag {h.get('x-robots-tag')!r}")
c, h, _ = req("/odeb/identite/signature-e-mail-adeb-lonodji.html")
attendu(c == 200 and "noindex" in h.get("x-robots-tag", ""), f"signature e-mail : {c}, X-Robots-Tag {h.get('x-robots-tag')!r} (attendu 200 + noindex)")
print("caches (immutable, must-revalidate, no-cache, no-store) : vérifiés")

titre("Scripts serveur")
c, h, corps = req("/formulaires.php")
attendu(c == 405, f"GET /formulaires.php → {c} (attendu 405)")
c, h, corps = req("/formulaires.php", "POST", {"Content-Type": "application/x-www-form-urlencoded", "Origin": "https://lonodji.org"}, b"form-name=inconnu")
attendu(c == 400, f"POST formulaire inconnu → {c} (attendu 400)")
c, h, corps = req("/__forms.html", "POST", {"Content-Type": "application/x-www-form-urlencoded", "Origin": "https://lonodji.org"}, b"form-name=inconnu")
attendu(c == 400, f"POST /__forms.html (réécriture) → {c} (attendu 400 depuis formulaires.php)")
c, h, corps = req("/api/redaction")
attendu(c == 200 and b'"existe"' in corps, f"GET /api/redaction → {c} {corps[:80]!r} (attendu JSON existe)")
attendu("no-store" in h.get("cache-control", ""), f"/api/redaction : Cache-Control {h.get('cache-control')!r}")
print("formulaires.php (405/400), réécriture __forms.html, redaction.php : vérifiés")

titre("Fichiers privés")
for p in ["/.user.ini", "/.ovhconfig", "/.htaccess", "/config.exemple.php", "/LISEZMOI.md"]:
    c, _, _ = req(p)
    attendu(c in (403, 404), f"{p} → {c} (attendu 403 ou 404)")
print("fichiers de configuration : refusés")

if SITEMAP:
    titre("Sitemap complet")
    _, _, corps = req("/sitemap.xml")
    urls = re.findall(rb"<loc>https://lonodji.org([^<]*)</loc>", corps)
    import concurrent.futures
    with concurrent.futures.ThreadPoolExecutor(8) as ex:
        codes = list(ex.map(lambda u: req(u.decode(), "HEAD")[0], urls))
    mauvais = [(u.decode(), c) for u, c in zip(urls, codes) if c != 200]
    attendu(not mauvais, f"sitemap : {len(mauvais)} adresses non 200 : {mauvais[:10]}")
    print(f"{len(urls)} adresses, {len(mauvais)} non 200")

print(f"\nPROBLÈMES : {len(PROBLEMES)}")
for p in PROBLEMES:
    print(" -", p)
sys.exit(1 if PROBLEMES else 0)
