"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from "react";
import { cx } from "../../../utils/cx";

/**
 * Stacked / fan card carousel — next cards peek behind with scale + rotate.
 * Onboarding, feature decks, “swipe to next” storytelling.
 *
 *   <CarouselStacked
 *     aria-label="特性"
 *     slides={[{ id: "1", content: <Card>…</Card> }]}
 *   />
 */

export type CarouselStackedSlide = {
  id: string;
  content: ReactNode;
};

export interface CarouselStackedProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  slides: CarouselStackedSlide[];
  "aria-label": string;
  /** Card width. Default 320. */
  width?: number;
  /** Card height. Default 380. */
  height?: number;
  /** How many cards peek behind. Default 2. */
  depth?: number;
  autoplay?: boolean;
  interval?: number;
  ref?: Ref<HTMLDivElement>;
}

export function CarouselStacked({
  slides,
  width = 320,
  height = 380,
  depth = 2,
  autoplay = false,
  interval = 4200,
  className,
  ref,
  "aria-label": ariaLabel,
  ...props
}: CarouselStackedProps) {
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef<{ x: number; active: number } | null>(null);

  const go = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActive(((index % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (!autoplay || count < 2 || paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => go(active + 1), interval);
    return () => window.clearInterval(id);
  }, [active, autoplay, count, go, interval, paused]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      go(active - 1);
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      go(active + 1);
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = { x: event.clientX, active };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x;
    if (Math.abs(dx) > 48) go(drag.current.active + (dx < 0 ? 1 : -1));
    drag.current = null;
  };

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={cx("flex w-full flex-col items-center gap-4", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      {...props}
    >
      <div
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          drag.current = null;
        }}
        className={cx(
          "relative touch-pan-y outline-none",
          "focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2",
        )}
        style={{ width, height: height + 28 }}
      >
        {slides.map((slide, index) => {
          let offset = index - active;
          if (offset < 0) offset += count;
          const behind = offset;
          const visible = behind <= depth;
          const scale = 1 - behind * 0.06;
          const y = behind * 14;
          const rotate = behind === 0 ? 0 : behind % 2 === 0 ? -3.5 : 3.5;
          const z = count - behind;

          return (
            <button
              key={slide.id}
              type="button"
              tabIndex={behind === 0 ? 0 : -1}
              aria-label={`${index + 1} of ${count}`}
              aria-current={behind === 0}
              disabled={!visible}
              onClick={() => {
                if (behind === 0) go(active + 1);
                else go(index);
              }}
              className={cx(
                "absolute start-0 top-0 overflow-hidden rounded-2xl",
                "border border-border-secondary-default bg-background-primary-default shadow-xs",
                "origin-bottom transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
                !visible && "pointer-events-none opacity-0",
                behind === 0 ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
              )}
              style={{
                width,
                height,
                zIndex: z,
                transform: `translateY(${y}px) scale(${scale}) rotate(${rotate}deg)`,
                opacity: visible ? 1 - behind * 0.12 : 0,
              }}
            >
              <div className="size-full">{slide.content}</div>
            </button>
          );
        })}
      </div>

      <p className="text-caption-1-medium text-text-secondary tabular-nums">
        {active + 1} / {count}
      </p>
    </div>
  );
}
