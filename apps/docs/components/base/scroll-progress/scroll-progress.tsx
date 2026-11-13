"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type Ref,
  type RefObject,
} from "react";
import { cx } from "@/utils/cx";

/**
 * Thin reading progress bar pinned to the top of the viewport (or a
 * container). Bencho / docs-site energy for long articles.
 *
 *   <ScrollProgress />
 */

export interface ScrollProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Scroll container; defaults to `window`. */
  target?: RefObject<HTMLElement | null>;
  /** Track thickness. Default 2. */
  height?: number;
  ref?: Ref<HTMLDivElement>;
}

export function ScrollProgress({
  target,
  height = 2,
  className,
  style,
  ref,
  ...props
}: ScrollProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const read = () => {
      const el = target?.current;
      if (el) {
        const max = el.scrollHeight - el.clientHeight;
        setProgress(max <= 0 ? 0 : el.scrollTop / max);
        return;
      }
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max <= 0 ? 0 : window.scrollY / max);
    };

    read();
    const el = target?.current;
    if (el) {
      el.addEventListener("scroll", read, { passive: true });
      return () => el.removeEventListener("scroll", read);
    }
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [target]);

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-label="阅读进度"
      className={cx(
        "pointer-events-none inset-x-0 top-0 z-50 bg-border-button-default",
        // Default fixed for app chrome; pass `absolute` + a relative parent for demos.
        !className?.includes("absolute") && "fixed",
        className,
      )}
      style={{ height, ...style } as CSSProperties}
      {...props}
    >
      <div
        className="h-full origin-left transition-transform duration-75 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{
          transform: `scaleX(${Math.min(1, Math.max(0, progress))})`,
          backgroundImage: "var(--gradient-button-primary-default)",
        }}
      />
    </div>
  );
}
