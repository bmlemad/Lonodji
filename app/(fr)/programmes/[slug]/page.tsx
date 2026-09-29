import { rubrique } from "@/components/page-rubrique";

/* Pages de fond de la rubrique, reprises de l'ancien site (voir components/page-rubrique.tsx). */
const r = rubrique("/programmes");
export const dynamicParams = true; // adresse inconnue : notFound() dans la page
export const generateStaticParams = r.generateStaticParams;
export const generateMetadata = r.generateMetadata;
export default r.Page;
