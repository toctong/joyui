"use client";

import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "@/utils/cx";

/**
 * Illustrated empty state — large visual slot, title, description, and dual CTAs.
 *
 *   <EmptyStateIllustrated
 *     illustration={<img src="/empty/inbox.svg" alt="" />}
 *     title="还没有任务"
 *     description="创建第一个任务，开始自动转存。"
 *     primaryAction={<Button>新建任务</Button>}
 *     secondaryAction={<Button variant="ghost">查看文档</Button>}
 *   />
 */

export interface EmptyStateIllustratedProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Large illustration / SVG / image slot above the copy. */
  illustration: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Primary CTA (typically a Button). */
  primaryAction?: ReactNode;
  /** Secondary CTA beside the primary. */
  secondaryAction?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function EmptyStateIllustrated({
  illustration,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  ref,
  ...props
}: EmptyStateIllustratedProps) {
  const hasActions = Boolean(primaryAction || secondaryAction);

  return (
    <div
      ref={ref}
      className={cx(
        "flex w-full flex-col items-center justify-center gap-5 px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      <div className="flex max-h-48 w-full max-w-xs items-center justify-center [&_img]:max-h-48 [&_img]:w-auto [&_svg]:max-h-48">
        {illustration}
      </div>
      <div className="flex max-w-md flex-col gap-1.5">
        <p className="text-title-3-medium text-text-primary">{title}</p>
        {description ? (
          <p className="text-body-regular text-text-tertiary">{description}</p>
        ) : null}
      </div>
      {hasActions ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {secondaryAction}
          {primaryAction}
        </div>
      ) : null}
    </div>
  );
}
