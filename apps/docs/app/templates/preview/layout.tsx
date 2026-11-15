import type { ReactNode } from "react";

/** Full-bleed template preview — no docs chrome. */
export default function TemplatePreviewLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="min-h-dvh bg-background-full text-text-primary">{children}</div>;
}
