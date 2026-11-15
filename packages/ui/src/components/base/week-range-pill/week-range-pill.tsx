"use client";

import { useTemplateCopy } from "../../foundations/template-copy/template-copy";

import { useEffect, useState } from "react";
import { ChevronLeft16, ChevronRight16 } from "../date-picker/shared";
import { cx } from "../../../utils/cx";

const NAV_BUTTON = cx(
  "flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[3px] text-text-secondary outline-none",
  "transition-colors duration-150 ease hover:bg-background-secondary-hover",
  "focus-visible:ring-2 focus-visible:ring-border-focus-ring",
);

function AnimatedLabel({ label }: { label: string }) {
  const localize = useTemplateCopy();
  const [current, setCurrent] = useState(label);
  const [previous, setPrevious] = useState<string | null>(null);

  useEffect(() => {
    if (label !== current) {
      setPrevious(current);
      setCurrent(label);
    }
  }, [label, current]);

  useEffect(() => {
    if (previous === null) return;
    const t = setTimeout(() => setPrevious(null), 240);
    return () => clearTimeout(t);
  }, [previous]);

  return localize((
    <span className="relative flex-1 overflow-hidden text-center text-body-medium whitespace-nowrap text-text-primary">
      <span className="invisible">{current}</span>
      {previous !== null && (
        <span
          key={`out-${previous}`}
          className="animate-label-out absolute inset-0 flex items-center justify-center"
        >
          {previous}
        </span>
      )}
      <span
        key={`in-${current}`}
        className={cx(
          "absolute inset-0 flex items-center justify-center",
          previous !== null && "animate-label-in",
        )}
      >
        {current}
      </span>
    </span>
  ));
}

export type WeekRangePillProps = {
  label: string;
  onPrev?: () => void;
  onNext?: () => void;
  className?: string;
};

/** Compact week / month range chrome with optional prev/next controls. */
export function WeekRangePill({
  label,
  onPrev,
  onNext,
  className,
}: WeekRangePillProps) {
  const localize = useTemplateCopy();
  const interactive = !!(onPrev || onNext);
  return localize((
    <div
      className={cx(
        "flex h-8 min-w-[151px] shrink-0 items-center justify-between gap-1 rounded-2lg border border-border-button-default bg-background-primary-default px-1 py-1 shadow-xs",
        className,
      )}
    >
      {interactive ? (
        <button type="button" aria-label="Previous" onClick={onPrev} className={NAV_BUTTON}>
          <ChevronLeft16 />
        </button>
      ) : (
        <span className="flex size-4 shrink-0 items-center justify-center text-text-secondary" aria-hidden>
          <ChevronLeft16 />
        </span>
      )}
      {interactive ? (
        <AnimatedLabel label={label} />
      ) : (
        <span className="flex-1 text-center text-body-medium whitespace-nowrap text-text-primary">
          {label}
        </span>
      )}
      {interactive ? (
        <button type="button" aria-label="Next" onClick={onNext} className={NAV_BUTTON}>
          <ChevronRight16 />
        </button>
      ) : (
        <span className="flex size-4 shrink-0 items-center justify-center text-text-secondary" aria-hidden>
          <ChevronRight16 />
        </span>
      )}
    </div>
  ));
}
