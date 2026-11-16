"use client";

import type { ReactNode } from "react";
import {
  COMPONENT_SECTIONS,
  type Entry,
} from "@/components/application/docs/components-index";
import {
  FREE_COMPONENT_PREVIEWS,
  FREE_PREVIEW_OPTIONS,
  Scaled,
  TEMPLATE_CARD,
  TemplateFrame,
} from "@/components/application/docs/component-previews-free";
import type { PreviewHref } from "@/components/application/docs/component-preview-hrefs";
import { PREVIEW_IMAGE_SLUGS } from "@/components/application/docs/preview-images";
import { ShowcaseCard } from "@/components/application/docs/showcase-card";
import { GENERATED_DOC_PREVIEWS } from "@/components/demos/component-doc-previews.generated";
import { JoyProPreview } from "@/components/demos/joy-pro-preview";
import { cx } from "@/utils/cx";

const SECTION_KEY = {
  base: "Base",
  ai: "AI",
  compounds: "Blocks",
  charts: "Charts",
  templates: "Templates",
} as const;

const SITE = "https://joyui.dev";

/**
 * Pro blocks with a dedicated local mock in JoyProPreview (no vendored source /
 * capture available offline). Prefer these over joyui.dev/previews/*.webp —
 * that host often fails to resolve in local docs.
 */
const PRO_MOCK_SLUGS = new Set([
  "agent-progress",
  "agent-limits-card",
  "agent-creator",
  "task-list",
  "web-search",
  "calendar",
  "questionnaire",
]);

/** Pro templates that frame an embed route on joyui.dev. */
const TEMPLATE_EMBEDS: Record<string, string> = {
  "ai-chat": "chat",
  "ai-image-generation": "image",
  "ai-profile": "profile",
  "home-dashboard": "analytics",
  // Pro vertical template (not the OSS profile-cards family)
  "medical-profile": "healthcare",
  "marketing-dashboard": "marketing",
  "finance-dashboard": "finance",
  "hr-management": "hr",
};

/** Catalogue href → preview map key (`/components/...`). */
function previewHref(entry: Entry): PreviewHref {
  return entry.href.replace(/^\/docs\b/, "/components") as PreviewHref;
}

/** Catalogue href → local docs page. */
function docsHref(entry: Entry) {
  return entry.href.replace(/^\/components\b/, "/docs");
}

function slugOf(entry: Entry) {
  return previewHref(entry).replace("/components/", "");
}

function livePreview(entry: Entry) {
  return FREE_COMPONENT_PREVIEWS[previewHref(entry)];
}

function docPreview(entry: Entry) {
  return GENERATED_DOC_PREVIEWS[slugOf(entry)];
}

function hasImage(entry: Entry) {
  const slug = slugOf(entry);
  return (
    entry.status === "shipped" &&
    (Boolean(livePreview(entry)) ||
      Boolean(docPreview(entry)) ||
      Boolean(TEMPLATE_EMBEDS[slug]) ||
      PRO_MOCK_SLUGS.has(slug) ||
      PREVIEW_IMAGE_SLUGS.has(slug))
  );
}

function TemplateEmbed({ id, title }: { id: string; title: string }) {
  return (
    <TemplateFrame>
      <iframe
        src={`${SITE}/embed/templates/${id}`}
        title={`${title} preview`}
        loading="lazy"
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none size-full border-0"
      />
    </TemplateFrame>
  );
}

/** Doc-page demos / Pro mocks are full-size; scale into the showcase pane. */
function ScaledPane({ children }: { children: ReactNode }) {
  return (
    <Scaled width={330} insetRight>
      {children}
    </Scaled>
  );
}

const OSS_TEMPLATE_SLUGS = new Set([
  "admin-dashboard",
  "ai-chat-template",
  "ai-assistant-template",
  "ai-image-template",
  "ai-video-template",
  "ai-playground-template",
  "ai-agent-template",
  "auth-template",
  "workspace-template",
]);

function templatePreviewHref(slug: string) {
  return `/templates/preview/${slug}`;
}

function PreviewCard({
  entry,
  openInNewWindow = false,
}: {
  entry: Entry;
  openInNewWindow?: boolean;
}) {
  const href = previewHref(entry);
  const Preview = FREE_COMPONENT_PREVIEWS[href];
  const slug = slugOf(entry);
  const DocPreview = GENERATED_DOC_PREVIEWS[slug];
  const embed = TEMPLATE_EMBEDS[slug];
  const useDoc = !Preview && Boolean(DocPreview);
  const useEmbed = !Preview && !useDoc && Boolean(embed);
  // Local mock beats remote captures — joyui.dev/previews often 404 offline.
  const useProMock = !Preview && !useDoc && !useEmbed;
  const cardHref =
    openInNewWindow && OSS_TEMPLATE_SLUGS.has(slug)
      ? templatePreviewHref(slug)
      : openInNewWindow && embed
        ? `${SITE}/embed/templates/${embed}`
        : docsHref(entry);

  return (
    <ShowcaseCard
      href={cardHref}
      external={openInNewWindow}
      title={entry.name}
      description={entry.description}
      {...(Preview ? (FREE_PREVIEW_OPTIONS[href] ?? {}) : {})}
      {...(useDoc || useProMock ? { fade: true } : {})}
      {...(useEmbed ? TEMPLATE_CARD : {})}
    >
      {Preview ? (
        <Preview />
      ) : useDoc ? (
        <ScaledPane>
          <DocPreview />
        </ScaledPane>
      ) : useEmbed ? (
        <TemplateEmbed id={embed!} title={entry.name} />
      ) : useProMock ? (
        <ScaledPane>
          <JoyProPreview slug={slug} name={entry.name} />
        </ScaledPane>
      ) : null}
    </ShowcaseCard>
  );
}

/** Text-only fallback when no live preview or capture exists. */
function TextCard({
  entry,
  openInNewWindow = false,
}: {
  entry: Entry;
  openInNewWindow?: boolean;
}) {
  const slug = slugOf(entry);
  const href =
    openInNewWindow && OSS_TEMPLATE_SLUGS.has(slug)
      ? templatePreviewHref(slug)
      : docsHref(entry);
  return (
    <a
      href={href}
      {...(openInNewWindow
        ? { target: "_blank", rel: "noreferrer noopener" }
        : {})}
      className={cx(
        "group relative flex flex-col gap-1 rounded-[28px] border border-border-button-default bg-background-primary-default p-5",
        "transition-[background-color,box-shadow] duration-150 ease",
        "hover:bg-background-primary-hover hover:shadow-xs",
        "outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2",
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-headline-medium text-text-primary">{entry.name}</span>
        {entry.tier === "pro" ? (
          <span className="rounded-sm bg-background-tertiary-default px-1 py-px text-[10px] leading-4 font-semibold tracking-wide text-text-secondary uppercase">
            Pro
          </span>
        ) : null}
      </div>
      <span className="line-clamp-2 text-headline-regular text-text-secondary">
        {entry.description}
      </span>
    </a>
  );
}

export function SectionCatalog({
  section,
}: {
  section: keyof typeof SECTION_KEY;
}) {
  const title = SECTION_KEY[section];
  const group = COMPONENT_SECTIONS.find((s) => s.title === title);
  if (!group) return null;

  const withPreview = group.entries.filter(hasImage);
  const withoutPreview = group.entries.filter((entry) => !hasImage(entry));

  return (
    <div className="not-prose flex w-full flex-col gap-5">
      <div
        className={cx(
          "grid w-full grid-cols-1 gap-x-5 gap-y-3 sm:gap-5",
          group.wide
            ? "sm:grid-cols-2 xl:grid-cols-[repeat(2,minmax(0,1fr))]"
            : "sm:grid-cols-2 xl:grid-cols-3",
        )}
      >
        {withPreview.map((entry) => (
          <PreviewCard
            key={entry.href}
            entry={entry}
            openInNewWindow={section === "templates"}
          />
        ))}
      </div>
      {withoutPreview.length > 0 ? (
        <div
          className={cx(
            "grid gap-3",
            group.wide ? "sm:grid-cols-2" : "sm:grid-cols-2 xl:grid-cols-3",
          )}
        >
          {withoutPreview.map((entry) => (
            <TextCard
              key={entry.href}
              entry={entry}
              openInNewWindow={section === "templates"}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
