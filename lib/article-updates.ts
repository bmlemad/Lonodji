/* Notes de lecture ajoutées après publication : le texte historique reste intact.
   Module partagé par les cartes du journal et les pages d’articles, sans accès au disque. */
type ArticleUpdate = { date: string; dateLabel: string; texte: string; href: string; label: string };

export const ARTICLE_UPDATES: Record<string, ArticleUpdate> = {
  "2026-10-01-cinq-poles-sept-priorites": {
    date: "2026-10-04", dateLabel: "4 octobre 2026",
    texte: "Une décision publiée l’après-midi du 1er octobre complète l’organisation décrite dans cet article. Le texte ci-dessous conserve l’état annoncé à sa publication ; consultez la décision suivante et la structure actuelle pour vous orienter.",
    href: "/journal/2026-10-01-six-poles-vingt-deux-thematiques", label: "Lire la décision suivante",
  },
  "2026-10-01-election-vice-presidences": {
    date: "2026-10-04", dateLabel: "4 octobre 2026",
    texte: "La réorganisation publiée l’après-midi du 1er octobre étend le périmètre de l’élection. Cet article conserve l’annonce initiale ; la page de l’élection présente les postes ouverts et le calendrier en vigueur.",
    href: "/association/election-vice-presidences", label: "Consulter l’élection en vigueur",
  },
};
