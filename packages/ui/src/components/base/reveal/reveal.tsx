"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { cx, sortCx } from "../../../utils/cx";

/**
 * Mount / scroll reveal — fade + slight rise, Progress ease. Respects
 * prefers-reduced-motion (instant show).
 *
 *   <Reveal><Card>…</Card></Reveal>
 */

export type RevealFrom = "up" | "down" | "left" | "right" | "none";

export interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Delay before animating in (ms). */
  delay?: number;
  /** Animation duration (ms). */
  duration?: number;
  from?: RevealFrom;
  /** Distance of the entrance offset (px). */
  offset?: number;
  /** Observe once and stay visible. Default true. */
  once?: boolean;
  /** Root margin for IntersectionObserver. */
  rootMargin?: string;
  ref?: Ref<HTMLDivElement>;
}

const styles = sortCx({
  root: "bui-reveal",
  visible: "bui-reveal-visible",
});

export function Reveal({
  children,
  delay = 0,
  duration = 480,
  from = "up",
  offset = 12,
  once = true,
  rootMargin = "0px 0px -8% 0px",
  className,
  style,
  ref,
  ...props
}: RevealProps) {
  const localRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  const setRefs = (node: HTMLDivElement | null) => {
    localRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          if (once) io.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { rootMargin, threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, rootMargin]);

  const axis: CSSProperties = (() => {
    switch (from) {
      case "up":
        return { "--bui-reveal-x": "0px", "--bui-reveal-y": `${offset}px` } as CSSProperties;
      case "down":
        return { "--bui-reveal-x": "0px", "--bui-reveal-y": `-${offset}px` } as CSSProperties;
      case "left":
        return { "--bui-reveal-x": `${offset}px`, "--bui-reveal-y": "0px" } as CSSProperties;
      case "right":
        return { "--bui-reveal-x": `-${offset}px`, "--bui-reveal-y": "0px" } as CSSProperties;
      default:
        return { "--bui-reveal-x": "0px", "--bui-reveal-y": "0px" } as CSSProperties;
    }
  })();

  return (
    <div
      ref={setRefs}
      className={cx(styles.root, visible && styles.visible, className)}
      style={
        {
          ...axis,
          "--bui-reveal-delay": `${delay}ms`,
          "--bui-reveal-duration": `${duration}ms`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}
