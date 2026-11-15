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

/** Visual shell. `rail` forces icon-only width. */
export type SidebarVariant = "floating" | "inset" | "rail";

type SidebarContextValue = {
  variant: SidebarVariant;
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
  base: "flex h-full shrink-0 flex-col overflow-hidden transition-[width] duration-300 ease-in-out",
  variant: {
    floating:
      "rounded-3xl border border-border-button-white bg-background-secondary-default shadow-sidebar",
    inset:
      "border-e border-separator-border bg-background-primary-default",
    rail:
      "rounded-3xl border border-border-button-white bg-background-secondary-default shadow-sidebar",
  },
});

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  variant?: SidebarVariant;
  /** Controlled collapse. Omit for uncontrolled (starts expanded unless variant is rail). */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  children?: ReactNode;
}

/**
 * Composable app sidebar shell.
 *
 * Variants:
 * - `floating` — rounded card with elevation (dashboard default)
 * - `inset` — flush edge, hairline separator
 * - `rail` — icon-only 60px column
 *
 * Compose with `SidebarHeader` / `SidebarContent` / `SidebarFooter`,
 * `SidebarSection`, and `SidebarItem`.
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
  const initial = defaultCollapsed ?? variant === "rail";
  const [uncontrolled, setUncontrolled] = useState(initial);
  const collapsed = collapsedProp ?? uncontrolled;
  const setCollapsed = useCallback(
    (next: boolean) => {
      onCollapsedChange?.(next);
      if (collapsedProp === undefined) setUncontrolled(next);
    },
    [collapsedProp, onCollapsedChange],
  );

  const effectiveVariant: SidebarVariant =
    collapsed && variant !== "inset" ? "rail" : variant;

  const widthClass = collapsed
    ? "w-[60px] px-[11px] py-3"
    : variant === "inset"
      ? "w-[260px] px-3 py-4"
      : "w-[260px] p-3";

  const value = useMemo<SidebarContextValue>(
    () => ({
      variant: effectiveVariant,
      collapsed,
      setCollapsed,
    }),
    [effectiveVariant, collapsed, setCollapsed],
  );

  return (
    <SidebarContext.Provider value={value}>
      <aside
        data-variant={effectiveVariant}
        data-collapsed={collapsed || undefined}
        className={cx(
          shellStyles.base,
          shellStyles.variant[variant === "rail" ? "rail" : variant],
          widthClass,
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
  const { collapsed } = useSidebar();
  return (
    <div
      className={cx(
        "flex w-full shrink-0",
        collapsed
          ? "flex-col items-center gap-2"
          : "flex-row items-center justify-between gap-2",
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
  return (
    <div
      className={cx(
        "flex min-h-0 w-full flex-1 flex-col gap-3 overflow-y-auto py-3 [scrollbar-width:none]",
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
  return (
    <div
      className={cx("mt-auto flex w-full shrink-0 flex-col gap-2", className)}
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
  const { collapsed } = useSidebar();
  return (
    <div
      className={cx(
        "flex min-w-0 items-center gap-2 overflow-hidden px-1",
        collapsed && "justify-center px-0",
        className,
      )}
    >
      {Icon ? (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-accent-500 text-text-white shadow-xs">
          <Icon className="size-4" aria-hidden />
        </span>
      ) : null}
      {!collapsed ? (
        <span className="truncate text-title-3-medium text-text-primary">
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
  const { collapsed, setCollapsed } = useSidebar();
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
  const { collapsed } = useSidebar();
  return (
    <div className={cx("flex w-full flex-col gap-1", className)}>
      {title && !collapsed ? (
        <p className="px-2 pb-1 text-caption-1-semibold tracking-wide text-text-tertiary uppercase">
          {title}
        </p>
      ) : null}
      <nav className="flex w-full flex-col gap-1">{children}</nav>
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
  className?: string,
) {
  return cx(
    "flex items-center overflow-hidden rounded-2lg p-2 text-start transition-[width,background-color] duration-300 ease-in-out",
    collapsed ? "w-9 justify-center" : "w-full justify-between gap-2",
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
}: {
  icon?: IconComponent;
  label: string;
  badge?: string | number;
  selected: boolean;
  collapsed: boolean;
}) {
  return (
    <>
      <span
        className={cx(
          "flex min-w-0 items-center",
          collapsed ? "justify-center" : "gap-2",
        )}
      >
        {Icon ? (
          <Icon
            className={cx(
              "size-5 shrink-0",
              selected ? "text-text-white" : "text-foreground-icon-secondary",
            )}
            aria-hidden
          />
        ) : null}
        {!collapsed ? (
          <span
            className={cx(
              "truncate text-body-medium",
              selected ? "text-text-white" : "text-text-secondary",
            )}
          >
            {label}
          </span>
        ) : null}
      </span>
      {!collapsed && badge !== undefined ? (
        <Badge color={selected ? "primary" : "neutral"}>{badge}</Badge>
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
  const { collapsed } = useSidebar();
  const shared = {
    "aria-current": selected ? ("page" as const) : undefined,
    "aria-label": label,
    title: collapsed ? label : undefined,
    className: sidebarItemClass(collapsed, selected, className),
  };
  const inner = (
    <SidebarItemInner
      icon={icon}
      label={label}
      badge={badge}
      selected={selected}
      collapsed={collapsed}
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
  return (
    <nav className={cx("flex w-full flex-col gap-1", className)}>
      {items.map((item) => (
        <SidebarItem
          key={item.key}
          icon={item.icon}
          label={item.label}
          href={item.href}
          badge={item.badge}
          selected={selected === item.key}
          onClick={
            onSelect
              ? () => onSelect(item.key)
              : undefined
          }
        />
      ))}
    </nav>
  );
}
