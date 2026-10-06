"""Projection du référentiel du 6 octobre sur les données importées.
Rejouée par import-legacy.py ; conserve les articles et les notes historiques.
"""
import copy
import html
import json
import re
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
ARCHITECTURE = json.loads((ROOT / 'content/architecture.json').read_text())
NOMS = {
    'Mémoire, culture & patrimoine': ARCHITECTURE['piliers'][0]['nom'],
    'Services essentiels': ARCHITECTURE['piliers'][1]['nom'],
    'Gouvernance, paix & plaidoyer': ARCHITECTURE['piliers'][5]['nom'],
    'Numérique & innovation': 'Numérique et innovation — leviers transversaux',
    'Économie & ressources naturelles': ARCHITECTURE['piliers'][3]['nom'],
    'Infrastructures, territoire & risques': ARCHITECTURE['piliers'][2]['nom'],
    'Memory, Culture & Heritage': ARCHITECTURE['piliers'][0]['nomEn'],
    'Essential Services': ARCHITECTURE['piliers'][1]['nomEn'],
    'Governance, Peace & Advocacy': ARCHITECTURE['piliers'][5]['nomEn'],
    'Digital & Innovation': 'Digital and innovation — cross-cutting tools',
    'Economy & Natural Resources': ARCHITECTURE['piliers'][3]['nomEn'],
    'Infrastructure, Territory & Risks': ARCHITECTURE['piliers'][2]['nomEn'],
}

def libelles(texte):
    protections = {f'__ARCHITECTURE_{i}__': nom for i, nom in enumerate(set(NOMS.values()))}
    for token, nom in protections.items(): texte = texte.replace(nom, token)
    for ancien, nouveau in NOMS.items():
        texte = texte.replace(ancien, nouveau)
    for token, nom in protections.items(): texte = texte.replace(token, nom)
    return re.sub(r'\bpôles?\b', lambda m: 'piliers' if m[0].endswith('s') else 'pilier',
                  re.sub(r'\bPôles?\b', lambda m: 'Piliers' if m[0].endswith('s') else 'Pilier', texte))

def appliquer_structure(structure):
    if structure.get('architectureDate') == ARCHITECTURE['date']:
        return structure
    anciens = {p['roman']: p for p in structure['poles']}
    themes = {t['id']: t for p in structure['poles'] for t in p['items']}
    attendus = [t for p in ARCHITECTURE['piliers'] for t in p['thematiques']]
    assert len(attendus) == len(set(attendus)) and set(attendus) == set(themes), 'Rattachement incomplet ou doublonné'
    result = copy.deepcopy(structure)
    result['poles'] = []
    for numero, pilier in enumerate(ARCHITECTURE['piliers'], 1):
        direction = copy.deepcopy(anciens[pilier['ancienPoleDirection']]['direction'])
        direction['label'] = 'Vice-président délégué ou vice-présidente déléguée du pilier'
        result['poles'].append({'id': f'pole-{numero}', 'roman': pilier['roman'],
            'eyebrow': f"Pilier stratégique {pilier['roman']}", 'name': pilier['nom'],
            'intro': pilier['mission'], 'items': [copy.deepcopy(themes[t]) for t in pilier['thematiques']],
            'direction': direction})
    result['architectureDate'] = ARCHITECTURE['date']
    return result

def sommaire(data):
    for item in data.get('toc', []):
        match = re.fullmatch(r'#pole-([1-6])', item.get('href', ''))
        item['label'] = ARCHITECTURE['piliers'][int(match[1])-1]['nom'] if match else libelles(item['label'])
    return data

def references_courantes(data):
    route = data.get('route', '')
    if route.startswith('/journal/') or route in ('/transparence', '/transparence/decisions'): return data
    corrections = {
        'Pilier IV — Numérique et innovation — leviers transversaux': 'Piliers II et III — compétences et connectivité',
        'du Pilier III.': 'du Pilier VI.',
        'trois thématiques du Pilier II portent': 'les piliers II et III portent',
        '— dont un pilier spécialisé Numérique et innovation — leviers transversaux, créé en septembre 2026': '— le numérique et l’innovation contribuent à plusieurs piliers',
    }
    if route == '/projets/drones-innovation':
        corrections['Pilier IV — Numérique et innovation — leviers transversaux'] = 'Pilier VI — Gouvernance, paix et partenariats'
    if route == '/projets/espace-numerique':
        corrections['Pilier IV'] = 'Piliers II et III'
    for key in ('lede', 'description'):
        if isinstance(data.get(key), str):
            for ancien, nouveau in corrections.items(): data[key] = data[key].replace(ancien, nouveau)
    for section in data.get('sections', []):
        soup = BeautifulSoup(section['html'], 'html.parser')
        for node in list(soup.find_all(string=True)):
            parent = node.find_parent(['p', 'li', 'blockquote'])
            if parent and re.search(r'Mise à jour du|Update,|décidé le|décision du|1er octobre 2026', parent.get_text(), re.I): continue
            texte = str(node)
            for ancien, nouveau in corrections.items(): texte = texte.replace(ancien, nouveau)
            if texte != str(node): node.replace_with(texte)
        if route == '/projets/espace-numerique':
            for a in soup.select('a[href="/programmes#pole-4"]'): a['href'] = '/association/architecture'
        section['html'] = str(soup)
    return data

def formulaire_piliers(data, structure):
    for section in data.get('sections', []):
        soup = BeautifulSoup(section['html'], 'html.parser')
        select = soup.select_one('select[name="pole"]')
        if not select: continue
        options = {re.match(r'^(\d+)\.', o.get_text()).group(1): str(o) for o in select.select('option') if re.match(r'^(\d+)\.', o.get_text())}
        cellules = select.find('optgroup', label='Cellules transversales')
        cellule_html = str(cellules) if cellules else ''
        chunks = ['<option value="">Choisir une thématique ou un pilier (optionnel)</option>', '<optgroup label="Vice-présidence d’un pilier — fonction élue">']
        for pilier in ARCHITECTURE['piliers']:
            chunks.append('<option>' + html.escape(f"Vice-présidence du pilier {pilier['roman']} — {pilier['nom']}") + '</option>')
        chunks.append('</optgroup>')
        for pilier, groupe in zip(ARCHITECTURE['piliers'], structure['poles']):
            chunks.append('<optgroup label="' + html.escape(f"Pilier {pilier['roman']} — {pilier['nom']}", quote=True) + '">')
            chunks.extend(options[str(t['number']).zfill(2)] for t in groupe['items'])
            chunks.append('</optgroup>')
        select.clear()
        select.append(BeautifulSoup(''.join(chunks) + cellule_html, 'html.parser'))
        section['html'] = str(soup)
    return data

def appliquer_page(data, structure):
    if data.get('architectureDate') == ARCHITECTURE['date']:
        return references_courantes(formulaire_piliers(sommaire(copy.deepcopy(data)), structure))
    route = data.get('route', '')
    if route.startswith('/journal/') or route in ('/transparence', '/transparence/decisions'):
        return data
    result = copy.deepcopy(data)
    for key in ('title', 'eyebrow', 'lede', 'description'):
        if isinstance(result.get(key), str): result[key] = libelles(result[key])
    for section in result['sections']:
        soup = BeautifulSoup(section['html'], 'html.parser')
        for node in list(soup.find_all(string=True)):
            parent = node.find_parent(['p', 'li', 'blockquote'])
            if parent and re.search(r'Mise à jour du|Update,|décidé le|décision du|1er octobre 2026', parent.get_text(), re.I):
                continue
            if node.parent.name not in ('script', 'style'):
                node.replace_with(libelles(str(node)))
        section['html'] = str(soup)
    # Recomposer les groupes hérités à partir des cartes thématiques, sans modifier leur contenu.
    if route in ('/programmes', '/impact', '/en/themes'):
        en = route.startswith('/en/')
        cartes, groupes = {}, []
        for section in result['sections']:
            soup = BeautifulSoup(section['html'], 'html.parser')
            found = [card for card in soup.select('.pole-card[id]') if not str(card.get('id', '')).startswith('cellule')]
            if found:
                groupes.append(section)
                for card in found: cartes[card['id']] = str(card)
        if groupes:
            rebuilt = []
            for index, pilier in enumerate(ARCHITECTURE['piliers'], 1):
                items = structure['poles'][index-1]['items']
                keys = [f"theme-{t['number']}" if en else t['id'] for t in items]
                assert all(key in cartes for key in keys), (route, keys)
                label = f"Strategic pillar {pilier['roman']}" if en else f"Pilier stratégique {pilier['roman']}"
                nom = pilier['nomEn'] if en else pilier['nom']
                intro = '' if en else f"<p>{html.escape(pilier['mission'])}</p>"
                rebuilt.append({'id': f'pole-{index}', 'alt': False, 'cls': 'pole-group', 'tag': 'section',
                    'html': f'<div class="section-head"><div><div class="eyebrow">{label}</div><h2>{html.escape(nom)}</h2>{intro}</div></div><div class="pole-grid">' + ''.join(cartes[key] for key in keys) + '</div>'})
            start = result['sections'].index(groupes[0])
            result['sections'] = [s for s in result['sections'] if s not in groupes]
            result['sections'][start:start] = rebuilt
    result['architectureDate'] = ARCHITECTURE['date']
    return references_courantes(formulaire_piliers(sommaire(result), structure))

def main():
    chemin = ROOT / 'content/index.json'
    index = json.loads(chemin.read_text())
    index['structure'] = appliquer_structure(index['structure'])
    for file in (ROOT / 'content/pages').glob('*.json'):
        original = json.loads(file.read_text())
        updated = appliquer_page(original, index['structure'])
        if updated != original:
            file.write_text(json.dumps(updated, ensure_ascii=False, indent=1))
    for page in index['pages']:
        for key in ('title', 'eyebrow', 'lede', 'description'):
            if isinstance(page.get(key), str): page[key] = libelles(page[key])
    for page in index["pages"]: references_courantes(page)
    chemin.write_text(json.dumps(index, ensure_ascii=False, indent=1))
    print('Architecture : six piliers, rattachements uniques, responsabilités conservées, pages courantes régénérées.')

if __name__ == '__main__': main()
