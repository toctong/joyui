import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "../../../utils/cx";

/**
 * Standard page chrome: title, optional description, optional trailing
 * actions (buttons / search). Used at the top of dashboard routes.
 */

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  /** Right-side actions — Button, Input, SegmentedControl, etc. */
  actions?: ReactNode;
  ref?: Ref<HTMLElement>;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
  ref,
  ...props
}: PageHeaderProps) {
  return (
    <header
      ref={ref}
      className={cx(
        "flex flex-wrap items-end justify-between gap-3 px-1",
        className,
      )}
      {...props}
    >
      <div className="min-w-0">
        <h1 className="text-title-1-semibold text-text-primary">{title}</h1>
        {description ? (
          <p className="mt-1 text-body-1-regular text-text-secondary">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}
