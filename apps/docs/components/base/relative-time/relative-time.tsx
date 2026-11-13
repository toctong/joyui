"use client";

import { useEffect, useMemo, useState, type Ref, type TimeHTMLAttributes } from "react";
import { cx } from "@/utils/cx";

/**
 * Live relative timestamp for logs, feeds, and activity rows.
 * Uses `Intl.RelativeTimeFormat` — no dayjs in the component tree.
 *
 *   <RelativeTime date={row.createdAt} />
 */

export type RelativeTimeDate = string | number | Date;

export interface RelativeTimeProps
  extends Omit<TimeHTMLAttributes<HTMLTimeElement>, "dateTime" | "children"> {
  date: RelativeTimeDate;
  /** BCP 47 locale. Defaults to runtime language. */
  locale?: string;
  /** Refresh interval in ms. Default 60s. */
  refreshMs?: number;
  /** Absolute tooltip / title. Default true. */
  showAbsoluteTitle?: boolean;
  ref?: Ref<HTMLTimeElement>;
}

const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

function toDate(value: RelativeTimeDate): Date {
  return value instanceof Date ? value : new Date(value);
}

export function formatRelativeTime(
  date: RelativeTimeDate,
  locale?: string,
  now = Date.now(),
): string {
  const d = toDate(date);
  if (Number.isNaN(d.getTime())) return "";
  let duration = (d.getTime() - now) / 1000;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return rtf.format(Math.round(duration), "year");
}

export function RelativeTime({
  date,
  locale,
  refreshMs = 60_000,
  showAbsoluteTitle = true,
  className,
  ref,
  ...props
}: RelativeTimeProps) {
  const [now, setNow] = useState(() => Date.now());
  const resolvedLocale =
    locale ?? (typeof navigator !== "undefined" ? navigator.language : "zh-CN");

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), refreshMs);
    return () => window.clearInterval(id);
  }, [refreshMs]);

  const d = useMemo(() => toDate(date), [date]);
  const label = formatRelativeTime(d, resolvedLocale, now);
  const absolute = Number.isNaN(d.getTime()) ? undefined : d.toLocaleString(resolvedLocale);

  return (
    <time
      ref={ref}
      dateTime={Number.isNaN(d.getTime()) ? undefined : d.toISOString()}
      title={showAbsoluteTitle ? absolute : props.title}
      className={cx("text-caption-1-medium text-text-secondary tabular-nums", className)}
      {...props}
    >
      {label || absolute || "—"}
    </time>
  );
}
