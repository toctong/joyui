"use client";

import type { ReactNode } from "react";
import { AuthCard, type AuthCardProps } from "../auth/auth-card";
import { cx } from "../../../utils/cx";

export type AuthTemplateProps = AuthCardProps & {
  frameClassName?: string;
  mediaSlot?: ReactNode;
  /** When true, uses `media` or `mediaSlot` for the split pane. */
  withMedia?: boolean;
};

/** Full-viewport auth page: centered or media-split AuthCard. */
export function AuthTemplate({
  frameClassName,
  className,
  withMedia = false,
  mediaSlot,
  media,
  mode = "signin",
  layout = "inline",
  ...cardProps
}: AuthTemplateProps) {
  // AuthMediaCarousel requires `slides` — pass `media` / `mediaSlot` yourself
  // when you want the split layout (see AuthCard docs).
  const resolvedMedia = media ?? (withMedia ? mediaSlot : undefined);

  return (
    <div
      className={cx(
        "flex min-h-[640px] w-full items-center justify-center bg-background-secondary-default p-4 sm:p-8",
        frameClassName,
      )}
    >
      <AuthCard
        mode={mode}
        layout={layout}
        media={resolvedMedia}
        className={className}
        {...cardProps}
      />
    </div>
  );
}
