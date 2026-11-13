"use client";

import * as React from "react";
import {
  getComponentDocCode,
  getFallbackDocCode,
} from "@/components/demos/component-doc-codes";
import { GENERATED_DOC_PREVIEWS } from "@/components/demos/component-doc-previews.generated";
import {
  getProDocCode,
  JoyProPreview,
} from "@/components/demos/joy-pro-preview";
import { DemoFrame } from "@/components/demos/sandpack-preview";
import { cx } from "@/utils/cx";

/**
 * Docs DemoFrame: preview and「代码」tab share one source
 * (`scripts/gen-doc-codes.mjs` → codes + GENERATED_DOC_PREVIEWS).
 * Landing showcase cards keep FREE_COMPONENT_PREVIEWS separately.
 */
export function ComponentDocPreview({
  slug,
  className,
  code,
}: {
  /** Docs slug, e.g. `button` or `data-grid` */
  slug: string;
  className?: string;
  /** Override source shown in the「代码」tab */
  code?: string;
}) {
  const Preview = GENERATED_DOC_PREVIEWS[slug];
  const demoCode =
    code ?? getComponentDocCode(slug) ?? getFallbackDocCode(slug);

  if (!Preview) {
    return (
      <DemoFrame
        code={demoCode}
        fileName={`${slug}-demo.tsx`}
        className={className}
        canvasClassName="min-h-40 items-center justify-center p-0 sm:p-0"
      >
        <div className="flex w-full min-h-40 items-center justify-center bg-background-primary-default p-6">
          <JoyProPreview slug={slug} name={slug} />
        </div>
      </DemoFrame>
    );
  }

  return (
    <DemoFrame
      code={demoCode}
      fileName={`${slug}-demo.tsx`}
      className={className}
      canvasClassName="relative items-center justify-center p-0 sm:p-0"
    >
      <div
        className={cx(
          // overflow-x-clip was clipping Tooltip / Popover carets that render
          // beside the preview; keep x overflow visible for overlay chrome.
          "relative flex w-full min-w-0 items-center justify-center overflow-x-visible bg-background-primary-default p-6",
        )}
      >
        <Preview />
      </div>
    </DemoFrame>
  );
}

export function ProComponentDoc({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  // Prefer the generated preview when the component is vendored locally so
  //「预览」and「代码」stay on the same snippet (charts, composer, …).
  const hasPreview = Object.hasOwn(GENERATED_DOC_PREVIEWS, slug);
  const Preview = hasPreview ? GENERATED_DOC_PREVIEWS[slug] : undefined;
  const demoCode =
    getComponentDocCode(slug) ??
    getProDocCode(slug, name) ??
    getFallbackDocCode(slug, name);

  if (!Preview) {
    return (
      <DemoFrame
        code={demoCode}
        fileName={`${slug}-demo.tsx`}
        canvasClassName="relative min-h-40 items-center justify-center bg-background-full p-0 sm:p-0"
      >
        <div className="relative flex min-h-40 w-full min-w-0 items-center justify-center overflow-x-clip bg-background-full p-6">
          <JoyProPreview slug={slug} name={name} />
        </div>
      </DemoFrame>
    );
  }

  return (
    <DemoFrame
      code={demoCode}
      fileName={`${slug}-demo.tsx`}
      canvasClassName="relative items-center justify-center p-0 sm:p-0"
    >
      <div className="relative flex w-full min-w-0 items-center justify-center overflow-x-clip bg-background-primary-default p-6">
        <Preview />
      </div>
    </DemoFrame>
  );
}
