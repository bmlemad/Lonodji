import type { Metadata } from "next";
import Link from "@/components/lien";
import { SectionHead, Stats } from "@/components/blocks";
import { OdebHero } from "@/components/odeb-marque";
import { ogFor } from "@/lib/content";
import { feuilleDeRoute, ODEB, PROGRAMMES, routeProgramme } from "@/lib/odeb";
import { chiffresOdeb, thematiquesParId } from "@/lib/odeb-chiffres";
import Partager from "@/components/partager";

export const metadata: Metadata = {
  title: "The ODEB LONODJI project — Vision 2030 (in English)",
  description: "ODEB LONODJI, the Organisation for the Development and Emergence of the Bedjond people: a project led by ADEB LONODJI to give the Bedjond country a permanent institution by 2030. Six missions, six programmes, a roadmap, a white paper.",
  alternates: { canonical: "/en/odeb", languages: { fr: "/odeb", en: "/en/odeb" } },
  openGraph: { ...ogFor("/en/odeb", "en"), title: "The ODEB LONODJI project — Vision 2030", description: "A project led by ADEB LONODJI to give the Bedjond country a permanent institution by 2030: six missions, six programmes, a roadmap, a white paper." },
};

const MISSIONS_EN: [string, string][] = [
  ["Research", "Produce and gather verified knowledge about the Bedjond country: history, language, territory, society."],
  ["Documentation", "Keep, classify, date and make accessible documents, data and testimonies."],
  ["Territorial development", "Diagnose, prioritise, advocate and follow up, village by village, what is missing and what is moving."],
  ["Innovation", "Put digital tools, data and artificial intelligence at the service of the territory, the language and young people."],
  ["Heritage preservation", "Protect and pass on the Nangnda language, the places, the genealogies and the memory of the elders."],
  ["Diaspora mobilisation", "Connect the skills, means and attention of the diaspora with the needs of the Bedjond country."],
];
const PROGRAMMES_EN: Record<string, [string, string]> = {
  "memoire-patrimoine": ["Memory and Heritage", "History of the Bedjond peoples, heritage atlas, digital library."],
  recherche: ["Research", "Documentation centre, scientific base, publications."],
  "developpement-territorial": ["Territorial development", "Observatory, data, diagnostics."],
  "jeunesse-innovation": ["Youth and Innovation", "Digital academy, artificial intelligence, skills."],
  diaspora: ["Diaspora", "Experts, investment, mentoring."],
  "economie-sociale": ["Social economy and revenue", "Businesses whose profits fund development: hotel, boarding school, transport and logistics, and more."],
};
const REPERES_EN = [
  "the digital memory of the Bedjond people",
  "the main mobilisation platform of the Bedjond diaspora",
  "a citizens’ observatory of Mandoul Occidental",
  "a community skills centre",
  "an African reference for community-led territorial development",
];

export default function OdebEn() {
  const c = chiffresOdeb();
  const th = thematiquesParId();
  const phases = feuilleDeRoute(c);
  const tous = phases.flatMap((p) => p.chantiers);
  const faits = tous.filter((x) => x.etat === "fait").length;
  return (
    <main id="main-content" className="hub-page od-page" lang="en">
      <OdebHero
        eyebrow="ODEB LONODJI project · Vision 2030 · in English"
        title="Organisation for the Development"
        em="and Emergence of the Bedjond people."
        lead="ODEB LONODJI is a strategic project led by ADEB LONODJI, aiming to establish, in time, a reference organisation dedicated to sustainable development, research, heritage and the emergence of the Bedjond country (Mandoul Occidental, Chad). It was launched on 28 September 2026, the day the association celebrated forty years since its founding reflections of 1986."
        crumbs={[{ label: "In English", href: "/en/index" }, { label: "ODEB project" }]}
        pills={["Led by ADEB LONODJI", "Launched 28 September 2026", "Six missions, six programmes", "White paper: working draft, in French"]}
      />

      <Stats items={[
        { value: "6", label: "permanent missions", note: "research, documentation, territorial development, innovation, heritage, diaspora" },
        { value: "6", label: "programmes", note: "memory and heritage, research, territorial development, youth and innovation, diaspora, social economy and revenue" },
        { value: `${faits}/${tous.length}`, label: "roadmap items completed", note: "as verified on the site, 2026–2030 in three phases" },
        { value: `${c.pourvues}/${c.total}`, label: "themes with a coordinator", note: `${c.vacantes} still open; a skill from the diaspora can make the difference` },
      ]} />

      <section className="hub-section" id="why">
        <SectionHead eyebrow="Why create ODEB" title="An association acts;" em="a territory needs a permanent tool." text="Recognised in 1995 and revived in 2026, ADEB LONODJI works through volunteer themes. In a few weeks it published advocacy briefs, a diagnosis of 34 issues, a map of 1,259 localities, 966 village pages and a library of 40 references. Keeping all this alive for years is the job of an organisation, not of a campaign. ODEB is the name the association has chosen for its future NGO status; the project gives that name a content before the status. Nothing is decided yet: no statute, no budget, no staff." />
        <ol className="od-missions">
          {MISSIONS_EN.map(([nom, texte], i) => <li key={nom}><span className="od-num">0{i + 1}</span><div><h3>{nom}</h3><p>{texte}</p></div></li>)}
        </ol>
      </section>

      <section className="hub-section" id="programmes">
        <SectionHead eyebrow="Six programmes" title="Programmes," em="not promises." text="Each programme has three strands, relies on named themes of the association and states, on its French page, what already exists and what it would build by 2030 — in the conditional, because nothing is funded. The sixth, added on the evening of 28 September 2026, proposes income-generating businesses — a hotel, a boarding school from year 7, a transport company — whose profits would fund the development and welfare projects." />
        <div className="od-programmes">
          {PROGRAMMES.map((p) => {
            const [nom, texte] = PROGRAMMES_EN[p.slug];
            const ths = p.thematiques.map((id) => th[id]).filter(Boolean);
            return (
              <Link className="od-programme" href={routeProgramme(p)} key={p.slug} hrefLang="fr">
                <span className="od-num">{p.numero}</span>
                <strong>{nom}</strong>
                <span className="od-accroche">{texte}</span>
                <small>{ths.length} {ths.length > 1 ? "themes" : "theme"} · {ths.filter((t) => t.filled).length} with a coordinator · in French <b aria-hidden="true">→</b></small>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="hub-section" id="2030">
        <SectionHead eyebrow="By 2030" title="What ODEB" em="should have become." />
        <ol className="od-reperes">
          {REPERES_EN.map((r, i) => <li key={r}><span className="od-num">0{i + 1}</span><strong>{r.charAt(0).toUpperCase() + r.slice(1)}</strong></li>)}
        </ol>
      </section>

      <section className="hub-section" id="roadmap">
        <SectionHead eyebrow="Roadmap 2026–2030" title="Three phases," em="with the real state of each item." text="Phase 1 (0–6 months): a live dashboard, community mapping, a members’ area. Phase 2 (6–18 months): the diaspora skills register, a project platform, the Bedjond digital library. Phase 3 (18–36 months): the Mandoul Occidental observatory, living heritage in sound and images, a digital academy, a full mobile app. Then the 2028 review and, by 2029–2030, the organisation itself." />
        <div className="link-list">
          {phases.map((p) => {
            const f = p.chantiers.filter((x) => x.etat === "fait").length;
            return <Link href={`/odeb/feuille-de-route#${p.id}`} key={p.id} hrefLang="fr"><small>{p.periode}</small><strong>{p.titre}</strong><span>{f} of {p.chantiers.length} items completed · details in French</span></Link>;
          })}
        </div>
      </section>

      <section className="hub-section" id="take-part">
        <SectionHead eyebrow="Take part" title="From the diaspora," em="four ways to help." />
        <div className="link-list">
          <Link href="/diaspora"><small>Skills register</small><strong>Register your skills</strong><span>Doctor, teacher, engineer, lawyer, developer: five minutes, and you are only contacted for what you said you could do. Nothing is published without your consent.</span></Link>
          <Link href="/participer?coordo=1#contact"><small>Coordination</small><strong>Take one of the {c.vacantes} open themes</strong><span>Entrepreneurship and inclusive finance, environment, water-energy-connectivity, roads and urban planning.</span></Link>
          <Link href="/odeb/livre-blanc" hrefLang="fr"><small>White paper (French)</small><strong>Read and comment on the white paper</strong><span>Working draft no. 1 of 28 September 2026, online and as a PDF; comments through the contact form, subject “Le projet ODEB LONODJI”.</span></Link>
          <Link href="/projets" hrefLang="fr"><small>Projects</small><strong>Propose or support a project</strong><span>Each project with its stage, what is missing and how to contribute. No money is collected until the association has a bank account in its name.</span></Link>
        </div>
        <Partager route="/en/odeb" titre="The ODEB LONODJI project" texte="ODEB LONODJI, the Organisation for the Development and Emergence of the Bedjond people: a project led by ADEB LONODJI to give the Bedjond country a permanent institution by 2030. Six missions, six programmes, a roadmap, a white paper." lang="en" />
        <p className="lg-footnote">This page summarises, in English, the French pages of the ODEB LONODJI project: <Link href="/odeb" hrefLang="fr">vision</Link>, <Link href="/odeb/programmes" hrefLang="fr">programmes</Link>, <Link href="/odeb/feuille-de-route" hrefLang="fr">roadmap</Link> and <Link href="/odeb/livre-blanc" hrefLang="fr">white paper</Link>. Figures are those of the site at publication; the white paper is a working draft, not yet adopted by the association. Official contact: the association’s president, <a href="tel:+23566299403">+235 66 29 94 03</a> (calls and WhatsApp). {ODEB.sigle} · {ODEB.nom}.</p>
      </section>
    </main>
  );
}
