"use client";

import type { ReactNode } from "react";
import {
  VideoGeneration,
  type VideoGenerationProps,
} from "../ai-kit/video-generation";
import { cx } from "../../../utils/cx";

export type AiVideoTemplateProps = VideoGenerationProps & {
  eyebrow?: ReactNode;
  heading?: ReactNode;
  description?: ReactNode;
};

/**
 * Full-page AI video studio template — aspect / duration chips + gallery.
 */
export function AiVideoTemplate({
  eyebrow = "Motion",
  heading = "视频生成",
  description = "镜头提示词 · 画幅时长 · 运动风格",
  className,
  ...studioProps
}: AiVideoTemplateProps) {
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
      <VideoGeneration
        className="min-h-0 flex-1 shadow-xs"
        title={typeof heading === "string" ? heading : "视频生成"}
        {...studioProps}
      />
    </div>
  );
}
