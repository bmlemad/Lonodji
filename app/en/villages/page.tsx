import type { Metadata } from "next";
import Link from "@/components/lien";
import { PageHeader, SectionHead, Stats } from "@/components/blocks";
import { ogFor } from "@/lib/content";
import { alternatesLangues } from "@/lib/langues";
import { getVillages } from "@/lib/villages";
import Partager from "@/components/partager";

export const metadata: Metadata = {
  title: "Find your village — the Bedjond country, unit by unit",
  description: "Fourteen administrative units in and around Mandoul Occidental, 966 named localities, one page per village: what open data knows, what the site says, what is still to document.",
  alternates: { canonical: "/en/villages", languages: alternatesLangues("/en/villages") },
  openGraph: { ...ogFor("/en/villages", "en"), title: "Find your village — the Bedjond country, unit by unit", description: "Fourteen units, 966 named localities, one page per village." },
};

const GROUPES: Record<string, string> = { coeur: "Heart of the Bedjond country", sud: "Southern neighbours", signale: "Reported by members", diaspora: "Diaspora towns" };
const nf = new Intl.NumberFormat("en-GB");
const df = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const date = (iso: string) => { const d = new Date(iso.slice(0, 10) + "T12:00:00Z"); return Number.isNaN(d.getTime()) ? iso : df.format(d); };
const equipements = (n: number) => `${n} known ${n === 1 ? "facility" : "facilities"}`;

export default function VillagesEn() {
  const v = getVillages();
  const unites = Object.values(v.unites);
  const nommees = unites.reduce((n, u) => n + u.comptes.nommes, 0);
  const total = unites.reduce((n, u) => n + u.comptes.villages, 0);
  const groupes = ["coeur", "sud", "signale", "diaspora"].map((g) => ({ id: g, nom: GROUPES[g], unites: unites.filter((u) => u.groupe === g) })).filter((g) => g.unites.length);
  return (
    <main id="main-content" className="hub-page" lang="en">
      <PageHeader
        eyebrow="Territory · in English"
        title="Find your village,"
        em="your neighbourhood, your canton."
        lead={`The Bedjond country is mapped unit by unit: ${unites.length} units, ${nf.format(total)} localities from open data, ${nf.format(nommees)} of them named, and one page per village saying what the data knows, what the site says and what is still to document. The village pages are in French; the names, the numbers and the map speak for themselves.`}
        crumbs={[{ label: "Villages" }]}
        lang="en"
        pills={[`${unites.length} units`, `${nf.format(nommees)} named localities`, `data as of ${date(v.genere)}`, "Sources: GADM 4.1, OpenStreetMap, GeoNames"]}
      />
      <Stats items={[
        { value: String(unites.length), label: "units", note: "sub-prefectures and neighbouring units, from the heart of the country to the diaspora towns" },
        { value: nf.format(nommees), label: "named localities", note: "villages, hamlets, neighbourhoods, one page each" },
        { value: nf.format(unites.reduce((n, u) => n + u.comptes.equipements, 0)), label: "known facilities", note: "schools, health posts, water points, markets: what open data has, which is little" },
        { value: "1", label: "form", note: "to tell us what your village has and lacks — in French, but a few words are enough" },
      ]} />

      {groupes.map((g) => (
        <section className="hub-section" id={g.id} key={g.id}>
          <SectionHead eyebrow={g.nom} title={`${g.unites.length} ${g.unites.length > 1 ? "units" : "unit"},`} em={g.id === "coeur" ? "where the Bedjond people live." : g.id === "sud" ? "just across the boundary." : g.id === "signale" ? "named by members, to be confirmed." : "where the diaspora gathers."} />
          <div className="link-list">
            {g.unites.sort((a, b) => a.kmBedjondo - b.kmBedjondo).map((u) => (
              <Link href={`/villages/${u.id}`} key={u.id} hrefLang="fr">
                <small>{u.dep} · {u.prov}{u.kmBedjondo ? ` · ${Math.round(u.kmBedjondo)} km from Bédjondo` : ""}</small>
                <strong>{u.nom}</strong>
                <span>{nf.format(u.comptes.nommes)} named localities of {nf.format(u.comptes.villages)} · {equipements(u.comptes.equipements)} · unit page in French</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section className="hub-section" id="help">
        <SectionHead eyebrow="From the diaspora" title="Three ways" em="to complete the map." />
        <div className="link-list">
          <Link href="/villages" hrefLang="fr"><small>Search</small><strong>Look up a village by name</strong><span>Type at least two letters of its name on the French page; the results show its unit, its neighbours and its page.</span></Link>
          <Link href="/dossiers/besoins" hrefLang="fr"><small>Report</small><strong>Report a need, locality by locality</strong><span>Water, school, health post, road: the form takes the name of the place, the kind of need and its urgency.</span></Link>
          <Link href="/en/contact"><small>Write to us</small><strong>Correct a name, a position, a boundary</strong><span>Every correction is published and dated in the corrections log.</span></Link>
        </div>
        <Partager route="/en/villages" titre="Find your village" texte="Fourteen administrative units in and around Mandoul Occidental, 966 named localities, one page per village: what open data knows, what the site says, what is still to document." lang="en" />
        <p className="lg-footnote">Counts as of {date(v.genere)}; boundaries from GADM 4.1, localities from OpenStreetMap and GeoNames, all approximate. Sacred sites and graves are never shown on the map: the association keeps that register with the chiefs. French page: <Link href="/villages" hrefLang="fr">Les villages</Link>.</p>
      </section>
    </main>
  );
}
