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
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { IconButton } from "../buttons/icon-button";
import { cx } from "../../../utils/cx";

/**
 * Coverflow carousel — perspective stage with side slides scaled / rotated.
 * Marketing / product showcase energy (Apple-style), without a heavy slider lib.
 *
 *   <CarouselCoverflow
 *     aria-label="作品"
 *     slides={[{ id: "1", content: <img … /> }, …]}
 *   />
 */

export type CarouselCoverflowSlide = {
  id: string;
  content: ReactNode;
};

export interface CarouselCoverflowProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  slides: CarouselCoverflowSlide[];
  "aria-label": string;
  /** Visible side peeks (each side). Default 2. */
  peek?: number;
  /** Slide width in px. Default 280. */
  slideWidth?: number;
  /** Slide height in px. Default 360. */
  slideHeight?: number;
  autoplay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export function CarouselCoverflow({
  slides,
  peek = 2,
  slideWidth = 280,
  slideHeight = 360,
  autoplay = false,
  interval = 4500,
  showArrows = true,
  showDots = true,
  className,
  ref,
  "aria-label": ariaLabel,
  ...props
}: CarouselCoverflowProps) {
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const drag = useRef<{ x: number; active: number } | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(active - 1);
    } else if (event.key === "ArrowRight") {
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
    if (Math.abs(dx) > 40) go(drag.current.active + (dx < 0 ? 1 : -1));
    drag.current = null;
  };

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={cx("flex w-full flex-col gap-4", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      {...props}
    >
      {showArrows && count > 1 ? (
        <div className="flex items-center justify-end gap-2">
          <IconButton
            icon={RiArrowLeftSLine}
            size="small"
            aria-label="Previous slide"
            onClick={() => go(active - 1)}
          />
          <IconButton
            icon={RiArrowRightSLine}
            size="small"
            aria-label="Next slide"
            onClick={() => go(active + 1)}
          />
        </div>
      ) : null}

      <div
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          drag.current = null;
        }}
        className={cx(
          "bui-coverflow relative w-full touch-pan-y outline-none",
          "focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2",
        )}
        style={{ height: slideHeight + 24, perspective: 1200 }}
      >
        <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
          {slides.map((slide, index) => {
            let offset = index - active;
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;
            const abs = Math.abs(offset);
            const hidden = abs > peek;
            const rotate = reduceMotion ? 0 : offset * -42;
            const translateX = offset * (slideWidth * 0.52);
            const translateZ = reduceMotion ? 0 : -abs * 72;
            const scale = reduceMotion ? (abs === 0 ? 1 : 0.88) : 1 - abs * 0.12;

            return (
              <button
                key={slide.id}
                type="button"
                tabIndex={abs === 0 ? 0 : -1}
                aria-label={`${index + 1} of ${count}`}
                aria-current={abs === 0}
                disabled={hidden}
                onClick={() => go(index)}
                className={cx(
                  "absolute overflow-hidden rounded-2xl border border-border-secondary-default",
                  "bg-background-primary-default shadow-xs",
                  "transition-[transform,opacity,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
                  hidden && "pointer-events-none opacity-0",
                  abs === 0 ? "z-20 cursor-default" : "z-10 cursor-pointer",
                )}
                style={{
                  width: slideWidth,
                  height: slideHeight,
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotate}deg) scale(${scale})`,
                  opacity: hidden ? 0 : Math.max(0.35, 1 - abs * 0.28),
                  filter: abs === 0 ? "none" : "brightness(0.82)",
                }}
              >
                <div className="size-full">{slide.content}</div>
              </button>
            );
          })}
        </div>
      </div>

      {showDots && count > 1 ? (
        <div className="flex items-center justify-center gap-1.5">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === active}
              onClick={() => go(index)}
              className={cx(
                "h-1.5 cursor-pointer rounded-full transition-all duration-200 ease-out",
                index === active
                  ? "w-4 bg-text-primary"
                  : "w-1.5 bg-background-tertiary-default hover:bg-border-button-active",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
