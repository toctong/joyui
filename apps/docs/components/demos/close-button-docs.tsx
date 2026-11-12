"use client";

import {
  CLOSE_BUTTON_SIZES,
  CloseButton,
  type CloseButtonSize,
} from "@/components/base/buttons/close-button";
import { cx } from "@/utils/cx";

const SIZE_META: Record<
  CloseButtonSize,
  { label: string; px: number; stroke: string }
> = {
  "2xs": { label: "2xs", px: 16, stroke: "1.6px" },
  xs: { label: "xs", px: 20, stroke: "2px" },
  sm: { label: "SM", px: 24, stroke: "2px" },
  md: { label: "MD", px: 32, stroke: "2.5px" },
};

/**
 * Hero preview — same `CloseButton`, four `size` values. Labels mirror
 * JoyUI so the prop reads as configurable, not four hardcoded glyphs.
 */
export function CloseButtonSizePreview({
  sizes = CLOSE_BUTTON_SIZES,
  className,
}: {
  sizes?: readonly CloseButtonSize[];
  className?: string;
}) {
  return (
    <div
      className={cx(
        "flex flex-wrap items-end justify-center gap-8 py-2",
        className,
      )}
      role="group"
      aria-label="关闭按钮尺寸"
    >
      {sizes.map((size) => {
        const meta = SIZE_META[size];
        return (
          <div
            key={size}
            className="flex flex-col items-center gap-3"
          >
            <CloseButton size={size} aria-label={`关闭（${meta.label}）`} />
            <span className="text-caption-1-medium uppercase tracking-wide text-text-tertiary">
              {meta.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** Compact modal-header recipe using the configurable `size="md"`. */
export function CloseButtonModalHeaderPreview({
  title = "模态标题",
  closeLabel = "关闭模态框",
  className,
}: {
  title?: string;
  closeLabel?: string;
  className?: string;
}) {
  return (
    <header
      className={cx(
        "flex w-full max-w-sm items-center justify-between rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <p className="text-body-medium text-text-primary">{title}</p>
      <CloseButton size="md" aria-label={closeLabel} />
    </header>
  );
}
