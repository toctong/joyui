"use client";

import {
  useCallback,
  useRef,
  useState,
  type HTMLAttributes,
  type PointerEvent,
  type Ref,
} from "react";
import { RiArrowRightLine, RiCheckLine } from "@remixicon/react";
import { cx } from "../../../utils/cx";

/**
 * Drag the thumb across the track to confirm a destructive / irreversible
 * action — Bencho “Slide to confirm”, drawn like JoyUI Switch (track + thumb).
 *
 *   <SlideToConfirm label="滑动确认删除" onConfirm={deleteRow} />
 */

export interface SlideToConfirmProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  label?: string;
  confirmedLabel?: string;
  disabled?: boolean;
  /** Fraction of track (0–1) that counts as confirmed. Default 0.92. */
  threshold?: number;
  onConfirm?: () => void;
  /** Reset after confirm (ms). `0` keeps confirmed state. Default 1600. */
  resetMs?: number;
  ref?: Ref<HTMLDivElement>;
}

const THUMB = 36;
const PAD = 4;
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export function SlideToConfirm({
  label = "滑动确认",
  confirmedLabel = "已确认",
  disabled = false,
  threshold = 0.92,
  onConfirm,
  resetMs = 1600,
  className,
  ref,
  ...props
}: SlideToConfirmProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [done, setDone] = useState(false);
  const confirmedRef = useRef(false);
  const offsetRef = useRef(0);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      trackRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const maxOffset = () => {
    const el = trackRef.current;
    if (!el) return 0;
    return Math.max(0, el.clientWidth - THUMB - PAD * 2);
  };

  const setOffsetSafe = (value: number) => {
    const next = Math.min(maxOffset(), Math.max(0, value));
    offsetRef.current = next;
    setOffset(next);
    return next;
  };

  const finish = (value: number) => {
    const max = maxOffset();
    const ratio = max === 0 ? 0 : value / max;
    if (ratio >= threshold && !confirmedRef.current) {
      confirmedRef.current = true;
      setDone(true);
      setOffsetSafe(max);
      onConfirm?.();
      if (resetMs > 0) {
        window.setTimeout(() => {
          confirmedRef.current = false;
          setDone(false);
          setOffsetSafe(0);
        }, resetMs);
      }
    } else if (!confirmedRef.current) {
      setOffsetSafe(0);
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (disabled || done) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setOffsetSafe(event.clientX - rect.left - PAD - THUMB / 2);
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dragging || disabled || done) return;
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setOffsetSafe(event.clientX - rect.left - PAD - THUMB / 2);
  };

  const onPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;
    setDragging(false);
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
    finish(offsetRef.current);
  };

  const ratio = maxOffset() === 0 ? 0 : offset / maxOffset();
  const fill = done ? 1 : ratio;

  return (
    <div
      ref={setRefs}
      role="group"
      aria-disabled={disabled || undefined}
      className={cx(
        // Switch-off track: tertiary fill, no hard outline.
        "relative flex h-11 w-full max-w-sm select-none items-center overflow-hidden rounded-full bg-background-tertiary-default",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className={cx(
          "absolute inset-y-0 start-0 rounded-full transition-[width] duration-150 motion-reduce:transition-none",
          EASE,
          done ? "shadow-checkbox-selected" : "",
        )}
        style={{
          width: `${Math.max(fill * 100, 0)}%`,
          backgroundImage: "var(--gradient-button-primary-default)",
          opacity: fill === 0 ? 0 : 0.22 + fill * 0.78,
        }}
      />
      <span
        className={cx(
          "pointer-events-none absolute inset-0 flex items-center justify-center px-12 text-body-medium text-text-secondary transition-opacity duration-150",
          ratio > 0.12 || done ? "opacity-0" : "opacity-100",
        )}
      >
        {label}
      </span>
      <span
        className={cx(
          "pointer-events-none absolute inset-0 flex items-center justify-center text-body-medium text-white transition-opacity duration-150",
          done ? "opacity-100" : "opacity-0",
        )}
      >
        {confirmedLabel}
      </span>
      <button
        type="button"
        aria-label={done ? confirmedLabel : label}
        disabled={disabled || done}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={cx(
          // Switch thumb: white disc + contact shadow.
          "absolute top-1 z-10 flex size-9 items-center justify-center rounded-full touch-none",
          "bg-background-primary-default text-foreground-icon-primary shadow-xs",
          "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus-ring",
          !dragging && cx("transition-transform duration-150", EASE),
          done && "text-accent-600",
        )}
        style={{
          left: PAD,
          transform: `translateX(${offset}px)`,
        }}
      >
        {done ? (
          <RiCheckLine className="size-5" aria-hidden />
        ) : (
          <RiArrowRightLine className="size-5" aria-hidden />
        )}
      </button>
    </div>
  );
}
