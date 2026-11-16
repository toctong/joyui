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
        "flex flex-wrap items-center justify-between gap-3 px-1",
        className,
      )}
      {...props}
    >
      <div className="min-w-0">
        <h1 className="text-title-2-semibold text-text-primary">{title}</h1>
        {description ? (
          <p className="mt-0.5 text-body-medium text-text-secondary">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}

/**
 * Quiet filter/search row under `PageHeader` — no bordered card chrome.
 * Prefer `SearchField shape="pill" size="small"` for list pages.
 */
export interface PageToolbarProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function PageToolbar({
  children,
  className,
  ref,
  ...props
}: PageToolbarProps) {
  return (
    <div
      ref={ref}
      className={cx(
        "flex flex-wrap items-center gap-2 rounded-xl bg-background-secondary-default/60 px-2.5 py-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
