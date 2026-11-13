"use client";

import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type Ref,
} from "react";
import { cx } from "../../../utils/cx";

/**
 * Rolling counter for KPIs and hero stats — Bencho / dashboard energy
 * without a heavy animation library. Counts from `from` to `value` once
 * the element enters the viewport (or immediately when `startOnView` is false).
 *
 *   <NumberTicker value={1280} suffix="+" />
 */

export interface NumberTickerProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  value: number;
  from?: number;
  /** Animation length in ms. */
  duration?: number;
  /** Decimal places. */
  precision?: number;
  prefix?: string;
  suffix?: string;
  /** Start when scrolled into view. Default true. */
  startOnView?: boolean;
  /** Locale for `toLocaleString`. */
  locale?: string;
  ref?: Ref<HTMLSpanElement>;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

export function NumberTicker({
  value,
  from = 0,
  duration = 1400,
  precision = 0,
  prefix = "",
  suffix = "",
  startOnView = true,
  locale,
  className,
  ref,
  ...props
}: NumberTickerProps) {
  const localRef = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(from);
  const [started, setStarted] = useState(!startOnView);

  useEffect(() => {
    if (!startOnView) {
      setStarted(true);
      return;
    }
    const el = localRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!started) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const next = from + (value - from) * easeOutCubic(t);
      setDisplay(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, from, started, value]);

  const formatted = Number(display.toFixed(precision)).toLocaleString(locale, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });

  return (
    <span
      ref={(node) => {
        localRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      className={cx("tabular-nums tracking-tight text-text-primary", className)}
      {...props}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
