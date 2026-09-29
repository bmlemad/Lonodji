import RootShell, { metadataFr } from "@/components/root-shell";
export { viewport } from "@/components/root-shell";

export const metadata = metadataFr;

export default function FrLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootShell lang="fr">{children}</RootShell>;
}
