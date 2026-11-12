import Link from "next/link";
import {
  COMPONENT_SECTIONS,
  type Entry,
} from "@/components/application/docs/components-index";

const SECTION_KEY = {
  base: "Base",
  compounds: "Blocks",
  charts: "Charts",
  templates: "Templates",
} as const;

function docsHref(entry: Entry) {
  return entry.href.replace(/^\/components\b/, "/docs");
}

export function SectionCatalog({
  section,
}: {
  section: keyof typeof SECTION_KEY;
}) {
  const title = SECTION_KEY[section];
  const group = COMPONENT_SECTIONS.find((s) => s.title === title);
  if (!group) return null;

  return (
    <div
      className={
        group.wide
          ? "not-prose grid gap-3 sm:grid-cols-2"
          : "not-prose grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      }
    >
      {group.entries.map((entry) => (
        <Link
          key={entry.href}
          href={docsHref(entry)}
          className="rounded-2lg border border-separator-border bg-background-secondary-default p-4 transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-xs"
        >
          <div className="flex items-center gap-2">
            <span className="text-title-3-medium text-text-primary">
              {entry.name}
            </span>
            {entry.tier === "pro" ? (
              <span className="rounded-full bg-background-tertiary-default px-2 py-0.5 text-caption-1-medium text-text-secondary">
                Pro
              </span>
            ) : null}
          </div>
          <p className="mt-1.5 text-body-1-regular text-text-secondary">
            {entry.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
