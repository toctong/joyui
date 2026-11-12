import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import duration from "dayjs/plugin/duration.js";
import localizedFormat from "dayjs/plugin/localizedFormat.js";
import relativeTime from "dayjs/plugin/relativeTime.js";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";
import "dayjs/locale/zh-cn.js";

dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);

export type DateInput = string | number | Date | dayjs.Dayjs | null | undefined;

export function toDayjs(value: DateInput, locale = "zh-cn") {
  return dayjs(value ?? undefined).locale(locale);
}

/** Format a date. Default pattern mirrors common dashboard tables. */
export function formatDate(
  value: DateInput,
  pattern = "YYYY-MM-DD HH:mm",
  locale = "zh-cn",
) {
  const d = toDayjs(value, locale);
  return d.isValid() ? d.format(pattern) : "";
}

export function fromNow(value: DateInput, locale = "zh-cn") {
  const d = toDayjs(value, locale);
  return d.isValid() ? d.fromNow() : "";
}

export function toNativeDate(value: DateInput) {
  const d = toDayjs(value);
  return d.isValid() ? d.toDate() : undefined;
}

export function formatNumber(
  value: number,
  locale = "zh-CN",
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat(locale, options).format(value);
}

export function formatPercent(
  value: number,
  locale = "zh-CN",
  fractionDigits = 1,
) {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatCurrency(
  value: number,
  currency = "CNY",
  locale = "zh-CN",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompact(value: number, locale = "zh-CN") {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

const BYTE_UNITS = ["B", "KB", "MB", "GB", "TB"] as const;

export function formatBytes(bytes: number, fractionDigits = 1) {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes === 0) return "0 B";
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    BYTE_UNITS.length - 1,
  );
  const n = bytes / 1024 ** i;
  return `${n.toFixed(fractionDigits)} ${BYTE_UNITS[i]}`;
}

export { dayjs };
