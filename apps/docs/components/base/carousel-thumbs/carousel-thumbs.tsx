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
import { IconButton } from "@/components/base/buttons/icon-button";
import { cx } from "@/utils/cx";

/**
 * Stage + thumbnail strip — product galleries, lookbooks, media pickers.
 *
 *   <CarouselThumbs
 *     aria-label="商品图"
 *     slides={[{ id: "1", content: <img … />, thumb: <img … /> }]}
 *   />
 */

export type CarouselThumbsSlide = {
  id: string;
  content: ReactNode;
  /** Thumbnail; falls back to a scaled `content` if omitted. */
  thumb?: ReactNode;
  label?: string;
};

export interface CarouselThumbsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  slides: CarouselThumbsSlide[];
  "aria-label": string;
  aspectRatio?: number | string;
  autoplay?: boolean;
  interval?: number;
  showArrows?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export function CarouselThumbs({
  slides,
  aspectRatio = "4 / 3",
  autoplay = false,
  interval = 4800,
  showArrows = true,
  className,
  ref,
  "aria-label": ariaLabel,
  ...props
}: CarouselThumbsProps) {
  const count = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

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
              aria-label={slide.label ?? `${index + 1} of ${count}`}
              aria-hidden={!on}
              className={cx(
                "absolute inset-0 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                on
                  ? "z-10 translate-x-0 opacity-100"
                  : index < active
                    ? "z-0 -translate-x-3 opacity-0"
                    : "z-0 translate-x-3 opacity-0",
              )}
            >
              {slide.content}
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
      </div>

      {count > 1 ? (
        <div
          className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="缩略图"
        >
          {slides.map((slide, index) => {
            const on = index === active;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={on}
                aria-label={slide.label ?? `Slide ${index + 1}`}
                onClick={() => go(index)}
                className={cx(
                  "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg",
                  "border bg-background-secondary-default",
                  "transition-[border-color,box-shadow,opacity] duration-200 ease",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
                  on
                    ? "border-accent-500 opacity-100 shadow-2xs"
                    : "border-border-secondary-default opacity-70 hover:opacity-100",
                )}
              >
                <div className="size-full [&_img]:size-full [&_img]:object-cover">
                  {slide.thumb ?? slide.content}
                </div>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
