import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "@/utils/cx";

/**
 * In-page section chrome under `PageHeader`: title, optional description,
 * optional trailing actions. Used for "Running", "Recent transfers", etc.
 */

export interface SectionHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Heading level. Defaults to 2. */
  level?: 2 | 3 | 4;
  ref?: Ref<HTMLElement>;
}

export function SectionHeader({
  title,
  description,
  actions,
  level = 2,
  className,
  ref,
  ...props
}: SectionHeaderProps) {
  const HeadingTag = (`h${level}` as "h2" | "h3" | "h4");
  return (
    <header
      ref={ref}
      className={cx("flex flex-wrap items-end justify-between gap-2 px-1", className)}
      {...props}
    >
      <div className="min-w-0">
        <HeadingTag className="text-title-3-medium text-text-primary">{title}</HeadingTag>
        {description ? (
          <p className="mt-0.5 text-body-2-regular text-text-tertiary">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}
