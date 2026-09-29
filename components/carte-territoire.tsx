"use client";

import Link from "@/components/lien";
import { useEffect, useMemo, useRef, useState } from "react";
import type * as Leaflet from "leaflet";

/* Carte du territoire bedjond : les 14 unités du pays bedjond (contours GADM),
   les localités et équipements présents dans OpenStreetMap, et pour chaque
   unité ce que le site en dit (plaidoyers, dossiers, articles). Les données
   sont assemblées par scripts/build-carte.py dans public/carte/donnees.json. */

type Unite = {
  id: string; nom: string; groupe: "coeur" | "sud" | "signale" | "diaspora"; dep: string; prov: string; notice: string; approx: boolean; origine: string;
  gadm: { nom: string; type: string; departement: string; province: string }; geometrie: GeoJSON.Geometry; boite: number[]; centre: number[];
};
type Village = [number, number, string, string, string, string, string, string]; // lon, lat, nom, type, unité, osm, population, slug de la fiche
type Equipement = { famille: string; nom: string; coords: number[]; unite: string; osm: string; jeu: string; detail: Record<string, string> };
type Lien = { type: string; titre: string; route: string };
type Donnees = {
  genere: string; sources: Record<string, string>; unites: Unite[]; comptes: Record<string, { villages: number; nommes: number; equipements: number }>;
  familles: Record<string, number>; villages: Village[]; equipements: Equipement[]; liens: Record<string, Lien[]>;
};
type Selection = { genre: "unite"; unite: Unite } | { genre: "village"; village: Village } | { genre: "equipement"; equipement: Equipement } | null;

const GROUPES: Record<Unite["groupe"], { label: string; couleur: string; fond: number }> = {
  coeur: { label: "Mandoul Occidental, cœur du pays bedjond", couleur: "#173b2d", fond: 0.22 },
  sud: { label: "Logone Oriental, présence attestée", couleur: "#5b7a3a", fond: 0.16 },
  signale: { label: "Logone Oriental, présence signalée", couleur: "#8c8a3c", fond: 0.12 },
  diaspora: { label: "Diaspora agricole, présence signalée", couleur: "#b5532e", fond: 0.1 },
};
const FAMILLES: Record<string, { label: string; couleur: string }> = {
  ecole: { label: "École", couleur: "#0F6FE5" },
  sante: { label: "Santé", couleur: "#c0392b" },
  eau: { label: "Eau", couleur: "#12A594" },
  marche: { label: "Marché", couleur: "#C98A2B" },
  culte: { label: "Lieu de culte", couleur: "#7a4b12" },
  energie: { label: "Énergie", couleur: "#e67e22" },
  telecom: { label: "Télécom", couleur: "#4d6ea8" },   // assombri (5,1:1 avec le blanc)
  administration: { label: "Administration", couleur: "#2B2118" },
  finance: { label: "Services financiers", couleur: "#6c5ce7" },
};

/* Pictogrammes des familles d'équipements (tracés 24×24, trait courant) : plus de lettres
   ambiguës (É école / E eau). Les mêmes sur la carte, la légende et les listes. */
const PICTOS: Record<string, string> = {
  ecole: "M3 9 12 5l9 4-9 4-9-4Z M7 11v4c0 1.5 2.2 3 5 3s5-1.5 5-3v-4",
  sante: "M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6Z",
  eau: "M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11Z",
  marche: "M4 9h16l-1.5 10h-13Z M8 9l4-5 4 5",
  culte: "M12 3v4 M10 5h4 M6 21V11l6-4 6 4v10 M10 21v-4h4v4",
  energie: "M13 3 5 14h6l-1 7 8-11h-6Z",
  telecom: "M12 10v11 M8 21h8 M8.5 6.5a5 5 0 0 1 7 0 M6 4a8.5 8.5 0 0 1 12 0 M12 10a1 1 0 1 0 0-.01",
  administration: "M4 21h16 M5 10h14 M12 3 4 7v3h16V7Z M7 10v8 M12 10v8 M17 10v8",
  finance: "M3 7h18v10H3Z M12 12a2 2 0 1 0 0-.01 M6 10v4 M18 10v4",
};
function picto(k: string, taille = 14): string {
  const d = PICTOS[k] || "M12 12a3 3 0 1 0 0-.01";
  return `<svg width="${taille}" height="${taille}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
}
const Picto = ({ k, taille = 13 }: { k: string; taille?: number }) => <span className="ct-picto" dangerouslySetInnerHTML={{ __html: picto(k, taille) }} />;

/* Encre lisible sur une pastille de couleur : blanc sur les couleurs sombres,
   vert nuit (#10241e) sur les claires (eau, marché, énergie) — contraste ≥ 4,5:1. */
function encre(fond: string): string {
  const h = fond.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((k) => { const c = parseInt(h.slice(k, k + 2), 16) / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return 1.05 / (l + 0.05) >= (l + 0.05) / 0.0647 ? "#fff" : "#10241e";   // 0,0647 : luminance de #10241e + 0,05
}
const TYPES: Record<string, string> = { city: "Ville", town: "Bourg", village: "Village", hamlet: "Hameau" };

function sansAccents(s: string) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(); }
function nomPropre(s: string) { return s.replace(/[؀-ۿ]+/g, "").replace(/\s+/g, " ").trim(); }

export default function CarteTerritoire() {
  const boite = useRef<HTMLDivElement>(null);
  const carte = useRef<Leaflet.Map | null>(null);
  const couches = useRef<{ unites?: Leaflet.GeoJSON; villages?: Leaflet.LayerGroup; equipements?: Leaflet.LayerGroup; L?: typeof Leaflet }>({});
  const [donnees, setDonnees] = useState<Donnees | null>(null);
  const [erreur, setErreur] = useState("");
  const [selection, setSelection] = useState<Selection>(null);
  const [visibles, setVisibles] = useState({ unites: true, villages: true, equipements: true });
  const [requete, setRequete] = useState("");
  const [pret, setPret] = useState(false);

  // données
  useEffect(() => {
    fetch("/carte/donnees.json").then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); }).then(setDonnees).catch(() => setErreur("Les données de la carte n’ont pas pu être chargées. Réessayez quand le réseau revient."));
  }, []);

  // carte
  useEffect(() => {
    if (!donnees || !boite.current || carte.current) return;
    let annule = false;
    (async () => {
      const L = (await import("leaflet")).default as unknown as typeof Leaflet;
      await import("leaflet/dist/leaflet.css");
      if (annule || !boite.current) return;
      const m = L.map(boite.current, { preferCanvas: true, zoomControl: false, attributionControl: true, scrollWheelZoom: false, tap: true } as Leaflet.MapOptions);
      L.control.zoom({ position: "topright", zoomInTitle: "Zoomer", zoomOutTitle: "Dézoomer" }).addTo(m);
      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        maxZoom: 18, subdomains: "abc",
        attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> · style <a href="https://www.hotosm.org/" target="_blank" rel="noopener">HOT</a> · limites GADM 4.1',
      }).addTo(m);
      m.attributionControl.setPrefix("");
      m.on("focus", () => m.scrollWheelZoom.enable());
      m.on("blur", () => m.scrollWheelZoom.disable());

      const canvas = L.canvas({ padding: 0.4 });
      const collection: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: donnees.unites.map((u) => ({ type: "Feature" as const, properties: { id: u.id }, geometry: u.geometrie })) };
      const unitesCouche = L.geoJSON(
        collection,
        {
          style: (f) => { const u = donnees.unites.find((x) => x.id === f?.properties.id)!; const g = GROUPES[u.groupe]; return { color: g.couleur, weight: 1.4, fillColor: g.couleur, fillOpacity: g.fond, dashArray: u.groupe === "signale" || u.groupe === "diaspora" ? "5 4" : undefined }; },
          onEachFeature: (f, layer) => {
            const u = donnees.unites.find((x) => x.id === f.properties.id)!;
            layer.bindTooltip(u.nom, { sticky: true, direction: "top", className: "ct-info" });
            layer.on("click", () => { setSelection({ genre: "unite", unite: u }); });
            layer.on("mouseover", () => (layer as Leaflet.Path).setStyle({ weight: 2.6, fillOpacity: GROUPES[u.groupe].fond + 0.12 }));
            layer.on("mouseout", () => unitesCouche.resetStyle(layer as Leaflet.Path));
          },
        },
      ).addTo(m);

      const villagesCouche = L.layerGroup().addTo(m);
      const rayon: Record<string, number> = { city: 7, town: 6, village: 3.5, hamlet: 2.5 };
      for (const v of donnees.villages) {
        const u = donnees.unites.find((x) => x.id === v[4]);
        const couleur = u ? GROUPES[u.groupe].couleur : "#607069";
        const c = L.circleMarker([v[1], v[0]], { renderer: canvas, radius: rayon[v[3]] || 3, color: "#fff", weight: v[3] === "village" || v[3] === "hamlet" ? 0.8 : 1.5, fillColor: couleur, fillOpacity: 0.9 });
        const nom = nomPropre(v[2]);
        if (nom) c.bindTooltip(`${nom} · ${TYPES[v[3]] || v[3]}`, { direction: "top", offset: [0, -4], className: "ct-info" });
        c.on("click", () => setSelection({ genre: "village", village: v }));
        c.addTo(villagesCouche);
      }

      const equipementsCouche = L.layerGroup().addTo(m);
      for (const e of donnees.equipements) {
        const fam = FAMILLES[e.famille] || { label: e.famille, couleur: "#607069" };
        const ic = L.divIcon({ className: "ct-eq", html: `<span style="background:${fam.couleur};color:${encre(fam.couleur)}" title="${fam.label}">${picto(e.famille)}</span>`, iconSize: [24, 24], iconAnchor: [12, 12] });
        const mk = L.marker([e.coords[1], e.coords[0]], { icon: ic, keyboard: true, alt: `${fam.label} : ${e.nom || "sans nom"}` });
        mk.bindTooltip(`${fam.label} · ${e.nom || "sans nom"}`, { direction: "top", offset: [0, -10], className: "ct-info" });
        mk.on("click", () => setSelection({ genre: "equipement", equipement: e }));
        mk.addTo(equipementsCouche);
      }

      couches.current = { L, unites: unitesCouche, villages: villagesCouche, equipements: equipementsCouche };
      carte.current = m;
      m.fitBounds(unitesCouche.getBounds().pad(0.05));
      // sur petit écran, on cadre le cœur (Mandoul Occidental)
      if (window.innerWidth < 700) {
        const coeur = donnees.unites.filter((u) => u.groupe === "coeur");
        const b = coeur.reduce((acc, u) => [Math.min(acc[0], u.boite[0]), Math.min(acc[1], u.boite[1]), Math.max(acc[2], u.boite[2]), Math.max(acc[3], u.boite[3])], [999, 999, -999, -999]);
        m.fitBounds([[b[1], b[0]], [b[3], b[2]]]);
      }
      setPret(true);
    })();
    return () => { annule = true; };
  }, [donnees]);

  useEffect(() => () => { carte.current?.remove(); carte.current = null; }, []);

  // ?village=<unité>/<slug> ou ?unite=<id> (depuis les fiches des villages) : ouvre la fiche à l'arrivée
  const ouvertDepuisAdresse = useRef(false);
  useEffect(() => {
    if (!donnees || !carte.current || ouvertDepuisAdresse.current) return;
    ouvertDepuisAdresse.current = true;
    const q = new URLSearchParams(window.location.search);
    const village = q.get("village"); const unite = q.get("unite");
    if (village) {
      const [uid, slug] = village.split("/");
      const v = donnees.villages.find((x) => x[4] === uid && x[7] === slug);
      if (v) { setTimeout(() => { aller([v[1], v[0]], 13, { genre: "village", village: v }); boite.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 300); return; }
    }
    if (unite) {
      const u = donnees.unites.find((x) => x.id === unite);
      if (u) setTimeout(() => { aller([u.centre[1], u.centre[0]], 11, { genre: "unite", unite: u }); boite.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 300);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donnees, pret]);

  // couches affichées / masquées
  useEffect(() => {
    const m = carte.current; const c = couches.current;
    if (!m || !c.unites) return;
    (Object.keys(visibles) as (keyof typeof visibles)[]).forEach((k) => {
      const couche = c[k]; if (!couche) return;
      if (visibles[k]) { if (!m.hasLayer(couche)) couche.addTo(m); } else if (m.hasLayer(couche)) m.removeLayer(couche);
    });
  }, [visibles]);

  const resultats = useMemo(() => {
    if (!donnees || requete.trim().length < 2) return [];
    const q = sansAccents(requete.trim());
    const r: { nom: string; type: string; unite: string; coords: [number, number]; village?: Village; unit?: Unite }[] = [];
    for (const u of donnees.unites) if (sansAccents(u.nom).includes(q)) r.push({ nom: u.nom, type: u.gadm.type === "Sub-prefecture" ? "Sous-préfecture" : u.gadm.type, unite: u.dep, coords: [u.centre[1], u.centre[0]], unit: u });
    for (const v of donnees.villages) {
      const nom = nomPropre(v[2]); if (!nom || !sansAccents(nom).includes(q)) continue;
      const u = donnees.unites.find((x) => x.id === v[4]);
      r.push({ nom, type: TYPES[v[3]] || v[3], unite: u?.nom || "", coords: [v[1], v[0]], village: v });
      if (r.length > 30) break;
    }
    return r.slice(0, 30);
  }, [donnees, requete]);

  const aller = (coords: [number, number], zoom = 12, sel?: Selection) => {
    carte.current?.flyTo(coords, zoom, { duration: 0.8 });
    if (sel !== undefined) setSelection(sel);
    setRequete("");
  };

  const unitePour = (id: string) => donnees?.unites.find((u) => u.id === id);

  return (
    <div className="ct">
      <div className="ct-outils">
        <label className="ct-recherche">
          <span className="sr-only">Chercher une localité ou une unité</span>
          <input type="search" placeholder="Chercher un village, un canton…" value={requete} onChange={(e) => setRequete(e.target.value)} aria-controls={requete.trim().length >= 2 ? "ct-resultats" : undefined} autoComplete="off" />
        </label>
        {resultats.length ? (
          <ul className="ct-resultats" id="ct-resultats" role="listbox" aria-label="Résultats">
            {resultats.map((r, i) => (
              <li key={i}><button type="button" onClick={() => aller(r.coords, r.unit ? 10 : 13, r.unit ? { genre: "unite", unite: r.unit } : r.village ? { genre: "village", village: r.village } : null)}><strong>{r.nom}</strong> <span>{r.type}{r.unite ? ` · ${r.unite}` : ""}</span></button></li>
            ))}
          </ul>
        ) : requete.trim().length >= 2 && donnees ? <p className="ct-vide" id="ct-resultats">Aucun lieu de ce nom dans les données ouvertes. Vous le connaissez ? <Link href={`/territoire/besoins?localite=${encodeURIComponent(requete.trim())}`}>Signalez-le-nous</Link>.</p> : null}
        <fieldset className="ct-couches">
          <legend className="sr-only">Couches</legend>
          <label><input type="checkbox" checked={visibles.unites} onChange={(e) => setVisibles({ ...visibles, unites: e.target.checked })} /> Unités du pays bedjond</label>
          <label><input type="checkbox" checked={visibles.villages} onChange={(e) => setVisibles({ ...visibles, villages: e.target.checked })} /> Localités <small>{donnees ? donnees.villages.length.toLocaleString("fr-FR") : ""}</small></label>
          <label><input type="checkbox" checked={visibles.equipements} onChange={(e) => setVisibles({ ...visibles, equipements: e.target.checked })} /> Équipements <small>{donnees ? donnees.equipements.length : ""}</small></label>
        </fieldset>
      </div>

      <div className="ct-corps">
        <div className="ct-carte" ref={boite} role="region" aria-label="Carte interactive du territoire bedjond" tabIndex={0}>
          {!donnees && !erreur ? <p className="ct-chargement">Chargement de la carte…</p> : null}
          {erreur ? <p className="ct-chargement" role="alert">{erreur}</p> : null}
        </div>

        <aside className="ct-fiche" aria-live="polite">
          {!selection ? (
            <div>
              <p className="eyebrow">Fiche</p>
              <h2>Touchez une unité, un village ou un équipement</h2>
              <p>Chaque point ouvre sa fiche : ce que les données ouvertes en disent, ce que le site en dit, et un bouton pour signaler un besoin à cet endroit.</p>
              <ul className="ct-legende">
                {(Object.keys(GROUPES) as Unite["groupe"][]).map((g) => <li key={g}><i style={{ background: GROUPES[g].couleur, opacity: 0.35 + GROUPES[g].fond }} /> {GROUPES[g].label}</li>)}
                {Object.entries(FAMILLES).filter(([k]) => donnees?.familles[k]).map(([k, f]) => <li key={k}><i className="ct-legende-eq" style={{ background: f.couleur, color: encre(f.couleur) }}><Picto k={k} /></i> {f.label} <small>{donnees?.familles[k]}</small></li>)}
              </ul>
            </div>
          ) : selection.genre === "unite" ? (
            <UniteFiche u={selection.unite} donnees={donnees!} aller={aller} fermer={() => setSelection(null)} />
          ) : selection.genre === "village" ? (
            <div>
              <p className="eyebrow">{TYPES[selection.village[3]] || "Localité"} · {unitePour(selection.village[4])?.nom}</p>
              <h2>{nomPropre(selection.village[2]) || "Localité sans nom"}</h2>
              <p>{unitePour(selection.village[4])?.gadm.departement.replace(/([a-z])([A-Z])/g, "$1 $2")}, {unitePour(selection.village[4])?.prov}. Position OpenStreetMap : {selection.village[1].toFixed(4)}, {selection.village[0].toFixed(4)}.{selection.village[6] ? ` Population indiquée : ${selection.village[6]}.` : ""}</p>
              <p className="ct-note">Aucune école, aucun centre de santé, aucun forage n’est rattaché à ce lieu dans les données ouvertes : ce silence est une information, pas une réalité. Aidez-nous à le combler.</p>
              <div className="ct-actions">
                {selection.village[7] ? <Link className="button primary" href={`/villages/${selection.village[4]}/${selection.village[7]}`}>La fiche du village <span aria-hidden="true">→</span></Link> : null}
                <Link className={selection.village[7] ? "button secondary" : "button primary"} href={`/territoire/besoins?localite=${encodeURIComponent(nomPropre(selection.village[2]))}`}>Signaler un besoin ici <span aria-hidden="true">→</span></Link>
                <a className="text-link" href={`https://www.openstreetmap.org/?mlat=${selection.village[1]}&mlon=${selection.village[0]}#map=15/${selection.village[1]}/${selection.village[0]}`} target="_blank" rel="noopener noreferrer">Voir sur OpenStreetMap ↗</a>
                <button type="button" className="text-link" onClick={() => setSelection(null)}>Fermer la fiche</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="eyebrow">{FAMILLES[selection.equipement.famille]?.label || selection.equipement.famille} · {unitePour(selection.equipement.unite)?.nom}</p>
              <h2>{selection.equipement.nom || "Équipement sans nom"}</h2>
              <dl className="ct-detail">
                {Object.entries(selection.equipement.detail).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                <div><dt>source</dt><dd>OpenStreetMap, export HOT « {selection.equipement.jeu.replace(/_/g, " ")} »</dd></div>
              </dl>
              <div className="ct-actions">
                <Link className="button primary" href={`/territoire/besoins?localite=${encodeURIComponent((selection.equipement.nom || unitePour(selection.equipement.unite)?.nom || "").slice(0, 80))}`}>Signaler un besoin ici <span aria-hidden="true">→</span></Link>
                <a className="button secondary" href={`https://www.openstreetmap.org/?mlat=${selection.equipement.coords[1]}&mlon=${selection.equipement.coords[0]}#map=16/${selection.equipement.coords[1]}/${selection.equipement.coords[0]}`} target="_blank" rel="noopener noreferrer">Voir sur OpenStreetMap</a>
                <button type="button" className="text-link" onClick={() => setSelection(null)}>Fermer la fiche</button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function UniteFiche({ u, donnees, aller, fermer }: { u: Unite; donnees: Donnees; aller: (c: [number, number], z?: number, s?: Selection) => void; fermer: () => void }) {
  const c = donnees.comptes[u.id];
  const liens = donnees.liens[u.id] || [];
  const eq = donnees.equipements.filter((e) => e.unite === u.id);
  const type = u.gadm.type === "Sub-prefecture" ? "Sous-préfecture" : u.gadm.type;
  return (
    <div>
      <p className="eyebrow">{type} · {GROUPES[u.groupe].label}</p>
      <h2>{u.nom}</h2>
      <p>{u.notice}</p>
      <div className="ct-chiffres">
        <div><strong>{c.villages}</strong><span>localité{c.villages > 1 ? "s" : ""} sur OpenStreetMap</span></div>
        <div><strong>{c.equipements}</strong><span>équipement{c.equipements > 1 ? "s" : ""} cartographié{c.equipements > 1 ? "s" : ""}</span></div>
      </div>
      {c.equipements === 0 ? <p className="ct-note">Aucune école, aucun centre de santé, aucun forage de cette unité n’est encore dans les données ouvertes. Ce n’est pas qu’il n’y en a pas : c’est que personne ne les a encore cartographiés. C’est à notre portée.</p> : null}
      {eq.length ? <ul className="ct-liste">{eq.map((e, i) => <li key={i}><button type="button" onClick={() => aller([e.coords[1], e.coords[0]], 15, { genre: "equipement", equipement: e })}><i style={{ background: FAMILLES[e.famille]?.couleur, color: FAMILLES[e.famille] ? encre(FAMILLES[e.famille].couleur) : undefined }}><Picto k={e.famille} /></i>{e.nom || FAMILLES[e.famille]?.label}</button></li>)}</ul> : null}
      {liens.length ? (
        <>
          <p className="eyebrow" style={{ marginTop: 22 }}>Sur le site</p>
          <ul className="ct-liens">{liens.map((l) => <li key={l.route}><Link href={l.route}><small>{l.type}</small>{l.titre}</Link></li>)}</ul>
        </>
      ) : null}
      <p className="ct-source">Contour : GADM 4.1 (« {u.gadm.nom} », {u.gadm.departement.replace(/([a-z])([A-Z])/g, "$1 $2")}, {u.gadm.province.replace(/([a-z])([A-Z])/g, "$1 $2")}). {u.approx ? "Position du chef-lieu approchée. " : ""}{u.origine ? `Repère : ${u.origine}.` : ""}</p>
      <div className="ct-actions">
        <Link className="button primary" href={`/villages/${u.id}`}>Les villages de {u.nom} <span aria-hidden="true">→</span></Link>
        <Link className="button secondary" href={`/territoire/besoins?localite=${encodeURIComponent(u.nom)}`}>Signaler un besoin ici <span aria-hidden="true">→</span></Link>
        <button type="button" className="text-link" onClick={() => aller([u.centre[1], u.centre[0]], 11)}>Centrer la carte</button>
        <button type="button" className="text-link" onClick={fermer}>Fermer la fiche</button>
      </div>
    </div>
  );
}
