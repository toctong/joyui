"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  RiAndroidLine,
  RiAppleLine,
  RiChromeLine,
  RiComputerLine,
  RiEdgeLine,
  RiFirefoxLine,
  RiSafariLine,
  RiSmartphoneLine,
  RiTabletLine,
  RiWindowsLine,
} from "@remixicon/react";

import { cx } from "../../../utils/cx";

export type BarListItem = {
  label: string;
  /** Absolute count — share is derived against the tab total. */
  value: number;
  icon?: ReactNode;
};

export type BarListTab = {
  id: string;
  label: string;
  items: BarListItem[];
};

export type BarListCardProps = {
  /** Tabbed breakdowns. Defaults to Devices / Browsers / OS / Screen sizes. */
  tabs?: BarListTab[];
  /** Single-list mode (no tabs). Ignored when `tabs` is set. */
  items?: BarListItem[];
  /** Heading when using a single list. */
  title?: string;
  /** Right-side metric caption (e.g. 访客). */
  metricLabel?: string;
  defaultTab?: string;
  onTabChange?: (id: string) => void;
  /** Cap visible rows; remainder collapses behind a show-more control. */
  limit?: number;
  /** Grey bars instead of the soft accent fill. */
  mono?: boolean;
  className?: string;
};

function DesktopIcon() {
  return <RiComputerLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />;
}
function PhoneIcon() {
  return <RiSmartphoneLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />;
}
function TabletIcon() {
  return <RiTabletLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />;
}

const DEFAULT_TABS: BarListTab[] = [
  {
    id: "devices",
    label: "设备",
    items: [
      { label: "桌面", value: 6100, icon: <DesktopIcon /> },
      { label: "手机", value: 3100, icon: <PhoneIcon /> },
      { label: "平板电脑", value: 800, icon: <TabletIcon /> },
    ],
  },
  {
    id: "browsers",
    label: "浏览器",
    items: [
      { label: "Chrome", value: 4200, icon: <RiChromeLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden /> },
      { label: "Safari", value: 2800, icon: <RiSafariLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden /> },
      { label: "Edge", value: 1900, icon: <RiEdgeLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden /> },
      { label: "Firefox", value: 1100, icon: <RiFirefoxLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden /> },
    ],
  },
  {
    id: "os",
    label: "操作系统",
    items: [
      { label: "Windows", value: 4500, icon: <RiWindowsLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden /> },
      { label: "macOS", value: 3200, icon: <RiAppleLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden /> },
      { label: "iOS", value: 1500, icon: <RiSmartphoneLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden /> },
      { label: "Android", value: 800, icon: <RiAndroidLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden /> },
    ],
  },
  {
    id: "screens",
    label: "屏幕尺寸",
    items: [
      { label: "1920×1080", value: 3800 },
      { label: "1366×768", value: 2400 },
      { label: "390×844", value: 2100 },
      { label: "Other", value: 1700 },
    ],
  },
];

/**
 * Bar List Card — ranked share rows with optional tabbed breakdowns.
 * Tabbed analytics breakdown: Devices / Browsers / OS / Screen sizes.
 */
export function BarListCard({
  tabs,
  items,
  title,
  metricLabel = "访客",
  defaultTab,
  onTabChange,
  limit,
  mono = false,
  className,
}: BarListCardProps = {}) {
  const resolvedTabs = tabs ?? (items
    ? [{ id: "list", label: title ?? "列表", items }]
    : DEFAULT_TABS);
  const single = !tabs && Boolean(items);
  const initial =
    defaultTab && resolvedTabs.some((t) => t.id === defaultTab)
      ? defaultTab
      : resolvedTabs[0]?.id;
  const [tabId, setTabId] = useState(initial);
  const [expanded, setExpanded] = useState(false);

  const active = useMemo(
    () => resolvedTabs.find((t) => t.id === tabId) ?? resolvedTabs[0],
    [resolvedTabs, tabId],
  );
  const rows = active?.items ?? [];
  const total = rows.reduce((sum, row) => sum + row.value, 0) || 1;
  const visible =
    limit && !expanded ? rows.slice(0, limit) : rows;
  const hidden = limit ? Math.max(0, rows.length - limit) : 0;

  return (
    <section
      className={cx(
        "flex min-w-0 flex-1 flex-col gap-3 rounded-2xl bg-background-secondary-default px-4 pt-3 pb-3",
        className,
      )}
    >
      <div className="flex w-full items-end justify-between gap-3 border-b border-separator-border">
        {single ? (
          <p className="pb-2.5 text-body-medium text-text-primary">{title}</p>
        ) : (
          <div
            role="tablist"
            aria-label="分类"
            className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto [scrollbar-width:none]"
          >
            {resolvedTabs.map((tab) => {
              const selected = tab.id === active?.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    setTabId(tab.id);
                    setExpanded(false);
                    onTabChange?.(tab.id);
                  }}
                  className={cx(
                    "relative shrink-0 pb-2.5 text-body-medium outline-none transition-colors",
                    "focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2",
                    selected
                      ? "text-status-orange-text"
                      : "text-text-secondary hover:text-text-primary",
                  )}
                >
                  {tab.label}
                  {selected ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-status-orange-text"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
        <p className="shrink-0 pb-2.5 text-caption-1-medium text-text-tertiary">
          {metricLabel}
        </p>
      </div>

      <ul className="flex flex-col gap-1.5">
        {visible.map((row) => {
          const share = Math.round((row.value / total) * 100);
          return (
            <li key={row.label} className="relative">
              <div
                aria-hidden
                className={cx(
                  "absolute inset-y-0 start-0 rounded-lg transition-[width] duration-500 ease-out",
                  mono ? "bg-background-tertiary-default" : "bg-accent-100",
                )}
                style={{ width: `${share}%` }}
              />
              <div className="relative flex items-center gap-2 px-2.5 py-2">
                {row.icon ? (
                  <span className="flex size-4 shrink-0 items-center justify-center">
                    {row.icon}
                  </span>
                ) : null}
                <span className="min-w-0 flex-1 truncate text-body-medium text-text-primary">
                  {row.label}
                </span>
                <span className="shrink-0 text-body-medium text-text-primary tabular-nums">
                  {share}%
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {hidden > 0 && !expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="self-start rounded-full bg-background-tertiary-default px-2.5 py-1 text-caption-1-medium text-text-secondary hover:bg-background-tertiary-hover"
        >
          显示其余 {hidden} 项
        </button>
      ) : null}
    </section>
  );
}
