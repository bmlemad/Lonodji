/* Typographie française des titres (3 octobre 2026) : espace insécable avant « : ; ! ? » et à l'intérieur des
   guillemets, pour qu'un signe ne parte jamais seul en début de ligne (constaté sur téléphone) ; et un trait d'union
   ne coupe plus un mot composé (« vice-présidences », « vingt-deux ») : un liant invisible suit le trait. */
export function insecables(s: string): string {
  return s.replace(/ ([:;!?»])/g, "\u00a0$1").replace(/« /g, "«\u00a0").replace(/(\p{L})-(\p{L})/gu, "$1-\u2060$2");
}
