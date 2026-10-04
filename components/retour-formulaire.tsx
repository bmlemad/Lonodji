"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* Après une réponse, le message devient le point de reprise du clavier et reste
   visible sur téléphone, même lorsqu'un formulaire long vient de disparaître. */
export default function RetourFormulaire({ children, className = "form-note form-success", role = "status" }: {
  children: ReactNode;
  className?: string;
  role?: "status" | "alert";
}) {
  const message = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    message.current?.focus({ preventScroll: true });
    message.current?.scrollIntoView({ block: "center", behavior: "instant" });
  }, []);
  return <p ref={message} className={className} role={role} tabIndex={-1}>{children}</p>;
}
