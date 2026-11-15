"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ComponentType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { RiSideBarFill } from "@remixicon/react";
import { Badge } from "../../base/badges/badge";
import { cx, sortCx } from "../../../utils/cx";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

/**
 * Visual shell.
 * - `floating` / `inset` / `rail` — vertical
 * - `horizontal` — top navigation bar
 */
export type SidebarVariant = "floating" | "inset" | "rail" | "horizontal";

type SidebarContextValue = {
  variant: SidebarVariant;
  horizontal: boolean;
  collapsed: boolean;
  setCollapsed: (next: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("Sidebar components must be used within <Sidebar>.");
  }
  return ctx;
}

const shellStyles = sortCx({
  base: "flex shrink-0 overflow-hidden",
  variant: {
    floating:
      "h-full flex-col rounded-3xl border border-border-button-white bg-background-secondary-default shadow-sidebar transition-[width] duration-300 ease-in-out",
    inset:
      "h-full flex-col border-e border-separator-border bg-background-primary-default transition-[width] duration-300 ease-in-out",
    rail:
      "h-full flex-col rounded-3xl border border-border-button-white bg-background-secondary-default shadow-sidebar transition-[width] duration-300 ease-in-out",
    horizontal:
      "min-h-14 h-14 w-full flex-row items-center gap-3 border-b border-separator-border bg-background-primary-default px-4",
  },
});

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  variant?: SidebarVariant;
  /** Controlled collapse (vertical only). */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  children?: ReactNode;
}

/**
 * Composable app sidebar / top-nav shell.
 *
 * Variants:
 * - `floating` — rounded card with elevation
 * - `inset` — flush edge, hairline separator
 * - `rail` — icon-only 60px column
 * - `horizontal` — top navigation bar
 */
export function Sidebar({
  variant = "floating",
  collapsed: collapsedProp,
  defaultCollapsed,
  onCollapsedChange,
  className,
  children,
  ...props
}: SidebarProps) {
  const horizontal = variant === "horizontal";
  const initial = defaultCollapsed ?? variant === "rail";
  const [uncontrolled, setUncontrolled] = useState(initial);
  const collapsed = horizontal ? false : (collapsedProp ?? uncontrolled);
  const setCollapsed = useCallback(
    (next: boolean) => {
      if (horizontal) return;
      onCollapsedChange?.(next);
      if (collapsedProp === undefined) setUncontrolled(next);
    },
    [collapsedProp, horizontal, onCollapsedChange],
  );

  const effectiveVariant: SidebarVariant = horizontal
    ? "horizontal"
    : collapsed && variant !== "inset"
      ? "rail"
      : variant;

  const sizeClass = horizontal
    ? undefined
    : collapsed
      ? "w-[60px] px-[11px] py-3"
      : variant === "inset"
        ? "w-[260px] px-3 py-4"
        : "w-[260px] p-3";

  const value = useMemo<SidebarContextValue>(
    () => ({
      variant: effectiveVariant,
      horizontal,
      collapsed,
      setCollapsed,
    }),
    [effectiveVariant, horizontal, collapsed, setCollapsed],
  );

  return (
    <SidebarContext.Provider value={value}>
      <aside
        data-variant={effectiveVariant}
        data-orientation={horizontal ? "horizontal" : "vertical"}
        data-collapsed={collapsed || undefined}
        className={cx(
          shellStyles.base,
          shellStyles.variant[horizontal ? "horizontal" : variant === "rail" ? "rail" : variant],
          sizeClass,
          className,
        )}
        {...props}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  );
}

export function SidebarHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { collapsed, horizontal } = useSidebar();
  return (
    <div
      className={cx(
        "flex shrink-0",
        horizontal
          ? "items-center gap-2"
          : collapsed
            ? "w-full flex-col items-center gap-2"
            : "w-full flex-row items-center justify-between gap-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { horizontal } = useSidebar();
  return (
    <div
      className={cx(
        "flex min-w-0",
        horizontal
          ? "flex-1 flex-row items-center gap-1 overflow-x-auto [scrollbar-width:none]"
          : "min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto py-3 [scrollbar-width:none]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const { horizontal } = useSidebar();
  return (
    <div
      className={cx(
        "flex shrink-0",
        horizontal
          ? "ms-auto flex-row items-center gap-2"
          : "mt-auto w-full flex-col gap-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarBrand({
  icon: Icon,
  label,
  className,
}: {
  icon?: IconComponent;
  label: string;
  className?: string;
}) {
  const { collapsed, horizontal } = useSidebar();
  const showLabel = horizontal || !collapsed;
  return (
    <div
      className={cx(
        "flex min-w-0 items-center gap-2 overflow-hidden",
        horizontal ? "px-0" : "px-1",
        !horizontal && collapsed && "justify-center px-0",
        className,
      )}
    >
      {Icon ? (
        <span
          className={cx(
            "flex shrink-0 items-center justify-center rounded-xl bg-accent-500 text-text-white shadow-xs",
            horizontal ? "size-7" : "size-8",
          )}
        >
          <Icon className={horizontal ? "size-3.5" : "size-4"} aria-hidden />
        </span>
      ) : null}
      {showLabel ? (
        <span
          className={cx(
            "truncate text-text-primary",
            horizontal ? "text-body-medium" : "text-title-3-medium",
          )}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}

export function SidebarCollapseButton({
  className,
}: {
  className?: string;
}) {
  const { collapsed, setCollapsed, horizontal } = useSidebar();
  if (horizontal) return null;
  return (
    <button
      type="button"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-expanded={!collapsed}
      onClick={() => setCollapsed(!collapsed)}
      className={cx(
        "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-2lg text-foreground-icon-secondary transition-colors hover:bg-background-secondary-hover",
        className,
      )}
    >
      <RiSideBarFill
        className={cx(
          "size-5 transition-transform duration-300 ease-in-out",
          collapsed
            ? "rtl:-scale-x-100"
            : "-scale-x-100 rtl:scale-x-100",
        )}
        aria-hidden
      />
    </button>
  );
}

export function SidebarSection({
  title,
  children,
  className,
}: {
  title?: string;
  children?: ReactNode;
  className?: string;
}) {
  const { collapsed, horizontal } = useSidebar();
  return (
    <div
      className={cx(
        "flex",
        horizontal
          ? "flex-row items-center gap-1"
          : "w-full flex-col gap-1",
        className,
      )}
    >
      {title && !collapsed && !horizontal ? (
        <p className="px-2 pb-1 text-caption-1-semibold tracking-wide text-text-tertiary uppercase">
          {title}
        </p>
      ) : null}
      {title && horizontal ? (
        <>
          <span className="mx-1 hidden h-4 w-px shrink-0 bg-separator-border first:hidden sm:block" aria-hidden />
          <span className="me-1 hidden shrink-0 text-caption-1-medium text-text-tertiary sm:inline">
            {title}
          </span>
        </>
      ) : null}
      <nav
        className={cx(
          "flex",
          horizontal ? "flex-row items-center gap-1" : "w-full flex-col gap-1",
        )}
      >
        {children}
      </nav>
    </div>
  );
}

export interface SidebarItemProps {
  icon?: IconComponent;
  label: string;
  badge?: string | number;
  selected?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

function sidebarItemClass(
  collapsed: boolean,
  selected: boolean,
  horizontal: boolean,
  className?: string,
) {
  return cx(
    "flex items-center overflow-hidden rounded-2lg text-start transition-[width,background-color] duration-300 ease-in-out",
    horizontal
      ? "h-9 w-auto shrink-0 gap-1.5 px-2.5"
      : collapsed
        ? "w-9 justify-center p-2"
        : "w-full justify-between gap-2 p-2",
    selected
      ? "bg-linear-to-b from-accent-500 to-accent-600 shadow-nav-selected"
      : "hover:bg-background-secondary-hover",
    className,
  );
}

function SidebarItemInner({
  icon: Icon,
  label,
  badge,
  selected,
  collapsed,
  horizontal,
}: {
  icon?: IconComponent;
  label: string;
  badge?: string | number;
  selected: boolean;
  collapsed: boolean;
  horizontal: boolean;
}) {
  const showLabel = horizontal || !collapsed;
  return (
    <>
      <span
        className={cx(
          "flex min-w-0 items-center",
          !horizontal && collapsed ? "justify-center" : "gap-2",
        )}
      >
        {Icon ? (
          <Icon
            className={cx(
              "shrink-0",
              horizontal ? "size-4" : "size-5",
              selected ? "text-text-white" : "text-foreground-icon-secondary",
            )}
            aria-hidden
          />
        ) : null}
        {showLabel ? (
          <span
            className={cx(
              "truncate",
              horizontal ? "text-body-2-medium" : "text-body-medium",
              selected ? "text-text-white" : "text-text-secondary",
            )}
          >
            {label}
          </span>
        ) : null}
      </span>
      {showLabel && badge !== undefined ? (
        <Badge
          color={selected ? "primary" : "neutral"}
          className={selected ? "bg-white/25 text-text-white" : undefined}
        >
          {badge}
        </Badge>
      ) : null}
    </>
  );
}

export function SidebarItem({
  icon,
  label,
  badge,
  selected = false,
  href = "#",
  onClick,
  className,
}: SidebarItemProps) {
  const { collapsed, horizontal } = useSidebar();
  const shared = {
    "aria-current": selected ? ("page" as const) : undefined,
    "aria-label": label,
    title: !horizontal && collapsed ? label : undefined,
    className: sidebarItemClass(collapsed, selected, horizontal, className),
  };
  const inner = (
    <SidebarItemInner
      icon={icon}
      label={label}
      badge={badge}
      selected={selected}
      collapsed={collapsed}
      horizontal={horizontal}
    />
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} {...shared}>
        {inner}
      </button>
    );
  }

  return (
    <a href={href} {...shared}>
      {inner}
    </a>
  );
}

/** Convenience data shape for building nav lists. */
export interface SidebarNavItem {
  key: string;
  label: string;
  icon?: IconComponent;
  href?: string;
  badge?: string | number;
}

export function SidebarNav({
  items,
  selected,
  onSelect,
  className,
}: {
  items: SidebarNavItem[];
  selected?: string;
  onSelect?: (key: string) => void;
  className?: string;
}) {
  const { horizontal } = useSidebar();
  return (
    <nav
      className={cx(
        "flex",
        horizontal ? "flex-row items-center gap-1" : "w-full flex-col gap-1",
        className,
      )}
    >
      {items.map((item) => (
        <SidebarItem
          key={item.key}
          icon={item.icon}
          label={item.label}
          href={item.href}
          badge={item.badge}
          selected={selected === item.key}
          onClick={onSelect ? () => onSelect(item.key) : undefined}
        />
      ))}
    </nav>
  );
}
