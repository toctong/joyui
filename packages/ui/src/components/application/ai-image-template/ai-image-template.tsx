"use client";

import type { ReactNode } from "react";
import {
  ImageGeneration,
  type ImageGenerationProps,
} from "../ai-kit/image-generation";
import { cx } from "../../../utils/cx";

export type AiImageTemplateProps = ImageGenerationProps & {
  /** Optional page chrome above the studio. */
  eyebrow?: ReactNode;
  heading?: ReactNode;
  description?: ReactNode;
};

/**
 * Full-page AI image studio template (Vercel chatbot / creative-suite style).
 * Wraps `ImageGeneration` with optional page chrome.
 */
export function AiImageTemplate({
  eyebrow = "Creative",
  heading = "图像生成",
  description = "提示词对话 · 画廊 · 风格侧栏",
  className,
  ...studioProps
}: AiImageTemplateProps) {
  return (
    <div
      className={cx(
        "flex h-full min-h-[640px] w-full flex-col gap-3 overflow-hidden",
        className,
      )}
    >
      {(eyebrow || heading || description) && (
        <header className="shrink-0 space-y-1 px-1">
          {eyebrow ? (
            <p className="text-caption-1-medium text-text-tertiary">{eyebrow}</p>
          ) : null}
          {heading ? (
            <h2 className="text-title-1-medium text-text-primary">{heading}</h2>
          ) : null}
          {description ? (
            <p className="text-body-2-regular text-text-secondary">{description}</p>
          ) : null}
        </header>
      )}
      <ImageGeneration
        className="min-h-0 flex-1 shadow-xs"
        title={typeof heading === "string" ? heading : "图像生成"}
        {...studioProps}
      />
    </div>
  );
}
