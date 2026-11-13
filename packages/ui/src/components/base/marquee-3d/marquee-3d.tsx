"use client";

import {
  Children,
  useEffect,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";
import { cx } from "../../../utils/cx";

/**
 * Horizontal marquee with subtle perspective tilt — items rotateY
 * based on distance from the viewport center.
 *
 *   <Marquee3d>
 *     <Chip>React</Chip>
 *     <Chip>Tailwind</Chip>
 *   </Marquee3d>
 */

export interface Marquee3dProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Seconds for one full pass of the duplicated track. */
  duration?: number;
  /** Reverse direction. */
  reverse?: boolean;
  /** Pause the loop while hovered. */
  pauseOnHover?: boolean;
  /** Fade the start/end edges. */
  fade?: boolean;
  /** How many times to repeat children for a seamless loop (min 2). */
  repeat?: number;
  /** Gap between items (CSS length). Default `1rem`. */
  gap?: string | number;
  /** Max rotateY in degrees at the far edge. Default 28. */
  maxTilt?: number;
  ref?: Ref<HTMLDivElement>;
}

export function Marquee3d({
  children,
  className,
  duration = 28,
  reverse = false,
  pauseOnHover = true,
  fade = true,
  repeat = 2,
  gap = "1rem",
  maxTilt = 28,
  style,
  ref,
  ...props
}: Marquee3dProps) {
  const copies = Math.max(2, repeat);
  const gapValue = typeof gap === "number" ? `${gap}px` : gap;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const applyTilt = () => {
      if (mq.matches) {
        for (const el of itemRefs.current) {
          if (!el) continue;
          el.style.transform = "rotateY(0deg)";
        }
        return;
      }

      const rootRect = root.getBoundingClientRect();
      const centerX = rootRect.left + rootRect.width / 2;
      const half = Math.max(rootRect.width / 2, 1);

      for (const el of itemRefs.current) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        const t = Math.max(-1, Math.min(1, (itemCenter - centerX) / half));
        el.style.transform = `rotateY(${t * -maxTilt}deg)`;
      }
    };

    const loop = () => {
      applyTilt();
      frame = window.requestAnimationFrame(loop);
    };

    frame = window.requestAnimationFrame(loop);
    mq.addEventListener("change", applyTilt);

    return () => {
      window.cancelAnimationFrame(frame);
      mq.removeEventListener("change", applyTilt);
    };
  }, [maxTilt]);

  const setRootRef = (node: HTMLDivElement | null) => {
    rootRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  itemRefs.current = [];
  let itemIndex = 0;

  const wrapItems = (nodes: ReactNode) =>
    Children.map(nodes, (child) => {
      const idx = itemIndex++;
      return (
        <span
          key={idx}
          ref={(node) => {
            itemRefs.current[idx] = node;
          }}
          className="bui-marquee-3d-item inline-flex shrink-0"
          style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        >
          {child}
        </span>
      );
    });

  return (
    <div
      ref={setRootRef}
      className={cx(
        "bui-marquee bui-marquee-3d group relative flex w-full overflow-hidden",
        fade && "bui-marquee-fade",
        pauseOnHover && "bui-marquee-pause",
        className,
      )}
      style={
        {
          "--bui-marquee-duration": `${duration}s`,
          "--bui-marquee-gap": gapValue,
          perspective: 900,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {Array.from({ length: copies }, (_, i) => (
        <div
          key={i}
          aria-hidden={i > 0 || undefined}
          className={cx(
            "bui-marquee-track flex shrink-0 items-center",
            reverse && "bui-marquee-reverse",
          )}
          style={{
            gap: gapValue,
            paddingInlineEnd: gapValue,
            transformStyle: "preserve-3d",
          }}
        >
          {wrapItems(children)}
        </div>
      ))}
    </div>
  );
}
