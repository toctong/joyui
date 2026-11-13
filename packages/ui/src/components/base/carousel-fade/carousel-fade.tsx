"use client";

import {
  useCallback,
  useEffect,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { IconButton } from "../buttons/icon-button";
import { cx } from "../../../utils/cx";

/**
 * Crossfade hero carousel — slides stack and dissolve. Ideal for landing
 * heroes and ambient product shots where a hard slide feels cheap.
 *
 *   <CarouselFade
 *     aria-label="英雄图"
 *     slides={[{ id: "1", content: <img … />, caption: "Sunrise" }]}
 *   />
 */

export type CarouselFadeSlide = {
  id: string;
  content: ReactNode;
  caption?: ReactNode;
};

export interface CarouselFadeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  slides: CarouselFadeSlide[];
  "aria-label": string;
  /** Aspect ratio of the stage. Default 16/9. */
  aspectRatio?: number | string;
  autoplay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  /** Ken Burns slow zoom on the active slide. */
  kenBurns?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export function CarouselFade({
  slides,
  aspectRatio = "16 / 9",
  autoplay = true,
  interval = 5000,
  showArrows = true,
  showDots = true,
  kenBurns = true,
  className,
  ref,
  "aria-label": ariaLabel,
  ...props
}: CarouselFadeProps) {
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const go = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActive(((index % count) + count) % count);
      setProgress(0);
    },
    [count],
  );

  useEffect(() => {
    if (!autoplay || count < 2 || paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    let started = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / interval);
      setProgress(t);
      if (t >= 1) {
        go(active + 1);
        started = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
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

  const current = slides[active];

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={cx("flex w-full flex-col gap-3", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      {...props}
    >
      <div
        tabIndex={0}
        onKeyDown={onKeyDown}
        className={cx(
          "relative w-full overflow-hidden rounded-2xl",
          "border border-border-secondary-default bg-background-secondary-default",
          "outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2",
        )}
        style={{ aspectRatio }}
      >
        {slides.map((slide, index) => {
          const on = index === active;
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}`}
              aria-hidden={!on}
              className={cx(
                "absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                on ? "z-10 opacity-100" : "z-0 opacity-0",
              )}
            >
              <div
                className={cx(
                  "size-full",
                  kenBurns && on && "bui-carousel-kenburns",
                )}
              >
                {slide.content}
              </div>
            </div>
          );
        })}

        {showArrows && count > 1 ? (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 justify-between px-3">
            <span className="pointer-events-auto">
              <IconButton
                icon={RiArrowLeftSLine}
                size="small"
                aria-label="Previous slide"
                onClick={() => go(active - 1)}
              />
            </span>
            <span className="pointer-events-auto">
              <IconButton
                icon={RiArrowRightSLine}
                size="small"
                aria-label="Next slide"
                onClick={() => go(active + 1)}
              />
            </span>
          </div>
        ) : null}

        {current?.caption ? (
          <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/55 to-transparent px-4 pb-3 pt-10">
            <p className="text-body-medium text-white">{current.caption}</p>
          </div>
        ) : null}
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
                "relative h-1.5 cursor-pointer overflow-hidden rounded-full transition-all duration-200 ease-out",
                index === active
                  ? "w-6 bg-background-tertiary-default"
                  : "w-1.5 bg-background-tertiary-default hover:bg-border-button-active",
              )}
            >
              {index === active ? (
                <span
                  aria-hidden
                  className="absolute inset-y-0 start-0 rounded-full bg-text-primary"
                  style={{ width: `${(autoplay ? progress : 1) * 100}%` }}
                />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
