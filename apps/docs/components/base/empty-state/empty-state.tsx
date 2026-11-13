"use client";

import type { ComponentType, HTMLAttributes, ReactNode, Ref } from "react";
import { RiInbox2Line } from "@remixicon/react";
import { useTemplateCopy } from "@/components/foundations/template-copy/template-copy";
import { cx, sortCx } from "@/utils/cx";

/**
 * Placeholder when a list / table / panel has nothing to show.
 * Title is required; description and action (e.g. a Button) are optional.
 */

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  /** Remix Icon component reference. Defaults to inbox. */
  icon?: IconComponent;
  /** CTA slot under the copy — typically a Button. */
  action?: ReactNode;
  size?: "sm" | "md";
  ref?: Ref<HTMLDivElement>;
}

const styles = sortCx({
  root: "flex w-full flex-col items-center justify-center text-center",
  size: {
    sm: "gap-2 px-4 py-6",
    md: "gap-3 px-6 py-10",
  },
  iconWrap: {
    sm: "mb-0.5 flex size-9 items-center justify-center rounded-xl bg-background-secondary-default",
    md: "mb-1 flex size-11 items-center justify-center rounded-2xl bg-background-secondary-default",
  },
  icon: {
    sm: "size-4 text-foreground-icon-primary",
    md: "size-5 text-foreground-icon-primary",
  },
});

export function EmptyState({
  title,
  description,
  icon: Icon = RiInbox2Line,
  action,
  size = "md",
  className,
  ref,
  ...props
}: EmptyStateProps) {
  const localize = useTemplateCopy();
  return localize(
    <div ref={ref} className={cx(styles.root, styles.size[size], className)} {...props}>
      <span className={styles.iconWrap[size]}>
        <Icon className={styles.icon[size]} aria-hidden />
      </span>
      <div className="flex max-w-md flex-col gap-1">
        <p className="text-body-medium text-text-primary">{title}</p>
        {description ? (
          <p className="text-body-regular text-text-tertiary">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>,
  );
}
