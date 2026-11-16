"use client";

import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "../../../utils/cx";

/**
 * Admin / console chrome: floating sidebar + top header + scrollable content.
 *
 *   <AppShell
 *     sidebar={<DashboardSidebar … />}
 *     header={<AppHeader leading={…} trailing={…} />}
 *   >
 *     <PageHeader title="…" />
 *     …
 *   </AppShell>
 *
 * Matches the JoyUI admin template spacing (padded canvas, rounded sidebar
 * gap) without baking a specific nav tree — pass your own sidebar.
 */

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  /** Left rail — typically `DashboardSidebar` or a custom `Sidebar`. */
  sidebar: ReactNode;
  /** Sticky top bar inside the main column. Prefer `AppHeader`. */
  header?: ReactNode;
  /** Main page body. Scrolls independently of the sidebar. */
  children: ReactNode;
  /** Constrain content width. Default `1300px`. Pass `false` for fluid. */
  contentMaxWidth?: number | false;
  ref?: Ref<HTMLDivElement>;
}

export function AppShell({
  sidebar,
  header,
  children,
  contentMaxWidth = 1300,
  className,
  ref,
  ...props
}: AppShellProps) {
  return (
    <div
      ref={ref}
      className={cx(
        "flex h-full min-h-0 gap-3 overflow-hidden bg-background-full p-2.5",
        className,
      )}
      {...props}
    >
      {sidebar}
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {header ? <div className="shrink-0 px-1 pb-2 pt-0.5">{header}</div> : null}
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto pr-1 pb-3">
          <div
            className="mx-auto flex w-full flex-col gap-3"
            style={
              contentMaxWidth === false
                ? undefined
                : { maxWidth: contentMaxWidth }
            }
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export type AppHeaderVariant = "flat" | "panel";

export interface AppHeaderProps extends HTMLAttributes<HTMLElement> {
  /** Left cluster — breadcrumb, page context, or title. */
  leading?: ReactNode;
  /** Optional center cluster (rare; e.g. global search). */
  center?: ReactNode;
  /** Right cluster — search, filters, NotificationBell, avatar. */
  trailing?: ReactNode;
  /**
   * `flat` (default) — quiet bar, no card chrome.
   * `panel` — bordered secondary surface (legacy card look).
   */
  variant?: AppHeaderVariant;
  ref?: Ref<HTMLElement>;
}

/**
 * Persistent top bar for admin consoles. Distinct from `PageHeader`, which is
 * the in-page title row under this chrome.
 */
export function AppHeader({
  leading,
  center,
  trailing,
  variant = "flat",
  className,
  ref,
  ...props
}: AppHeaderProps) {
  return (
    <header
      ref={ref}
      className={cx(
        "flex min-h-11 flex-wrap items-center justify-between gap-3 px-1 py-1.5",
        variant === "panel" &&
          "rounded-2xl border border-separator-border bg-background-secondary-default px-3 py-2 shadow-xs",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">{leading}</div>
      {center ? (
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
          {center}
        </div>
      ) : null}
      {trailing ? (
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {trailing}
        </div>
      ) : null}
    </header>
  );
}
