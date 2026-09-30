"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const NavTools = dynamic(() => import("@/components/nav-tools"), { ssr: false });
const Palette = dynamic(() => import("@/components/palette"), { ssr: false });
const SectionRail = dynamic(() => import("@/components/section-rail"), { ssr: false });
const FeuillePartage = dynamic(() => import("@/components/partager").then((m) => m.FeuillePartage), { ssr: false });

export default function DeferredChrome() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const run = () => setReady(true);
    const w = window as Window & { requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(run, { timeout: 700 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(run, 350);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) return null;
  return (
    <>
      <NavTools />
      <Palette />
      <FeuillePartage />
      <SectionRail />
    </>
  );
}
