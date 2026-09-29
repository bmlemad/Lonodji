import RootShell, { metadataEn } from "@/components/root-shell";
export { viewport } from "@/components/root-shell";

export const metadata = metadataEn;

export default function EnLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootShell lang="en">{children}</RootShell>;
}
