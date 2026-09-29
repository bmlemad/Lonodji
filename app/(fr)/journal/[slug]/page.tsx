import type { Metadata } from "next";
import Link from "@/components/lien";
import Partager from "@/components/partager";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/blocks";
import { LegacySections, Resume, splitTitle } from "@/components/legacy-content";
import { getArticle, getIndex, listArticleSlugs, metaDescription, ogFor, ogImage, ORG } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return listArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!listArticleSlugs().includes(slug)) return {};
  const a = getArticle(slug);
  return {
    title: a.title,
    description: metaDescription(a.description || a.summary),
    alternates: { canonical: `/journal/${slug}` },
    openGraph: { ...ogFor(`/journal/${slug}`), type: "article", title: a.title, description: metaDescription(a.description || a.summary), publishedTime: a.date, authors: [a.byline || ORG.name] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!listArticleSlugs().includes(slug)) notFound();
  const a = getArticle(slug);
  const idx = getIndex();
  const pos = idx.articles.findIndex((x) => x.slug === slug);
  const newer = pos > 0 ? idx.articles[pos - 1] : null;
  const older = pos < idx.articles.length - 1 ? idx.articles[pos + 1] : null;
  const related = idx.articles.filter((x) => x.slug !== slug && x.category === a.category).slice(0, 3);
  const url = `${ORG.url}/journal/${slug}`;
  const [main, ...rest] = splitTitle(a.title);
  const ld = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: a.title,
    description: a.description || a.summary,
    datePublished: a.date,
    dateModified: a.date,
    image: [`https://lonodji.org${ogImage(`/journal/${slug}`)[0].url}`],
    inLanguage: "fr-FR",
    author: { "@type": "Organization", name: ORG.name },
    publisher: { "@type": "Organization", name: ORG.name, url: ORG.url, logo: { "@type": "ImageObject", url: "https://lonodji.org/odeb/identite/odeb-lonodji-embleme-1024.png" } },
    mainEntityOfPage: url,
  };
  return (
    <main id="main-content" className="hub-page article-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <div className="article-head">
        <nav className="lg-crumbs" aria-label="Fil d’Ariane"><ol><li><Link href="/">Accueil</Link></li><li><Link href="/journal">Le journal</Link></li><li aria-current="page">{a.tag || "Article"}</li></ol></nav>
        <p className="eyebrow">{a.tag || "Le journal"}</p>
        <h1>{main}{rest.length ? <><br /><em>{rest.join(" ")}</em></> : null}</h1>
        {a.lede ? <p className="detail-lead">{a.lede}</p> : null}
        <p className="article-facts">
          <time dateTime={a.date}>{a.dateLabel}</time>
          {a.readTime ? <span>· {a.readTime}</span> : null}
          {a.byline ? <span>· {a.byline}</span> : null}
        </p>
      </div>
      <div className="legacy">
        <Resume items={a.resume} />
        <LegacySections sections={a.sections} />
      </div>
      <Partager route={`/journal/${slug}`} titre={a.title} texte={a.description || a.summary} />
      <nav className="article-nav" aria-label="Autres articles">
        {newer ? <Link href={newer.route}><small>Article suivant</small>{newer.title}</Link> : null}
        {older ? <Link href={older.route}><small>Article précédent</small>{older.title}</Link> : null}
      </nav>
      {related.length ? (
        <section className="hub-section">
          <h2 className="eyebrow">À lire aussi · {a.tag}</h2>
          <div className="art-grid">{related.map((r) => <ArticleCard key={r.slug} a={r} />)}</div>
        </section>
      ) : null}
      <p className="lg-footnote"><Link href="/journal">← Tous les articles</Link> · Une erreur de fait ? <Link href="/transparence#corrections">Signalez-la</Link> : elle sera corrigée et datée.</p>
    </main>
  );
}
