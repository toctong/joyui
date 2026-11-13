"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "@/utils/cx";

/**
 * Hover / focus preview card — beUI Profile hover card on JoyUI Popover chrome
 * (`rounded-[20px]`, `border-button`, `shadow-dropdown`).
 *
 *   <HoverCard content={<div>…profile…</div>}>
 *     <Avatar initials="JL" />
 *   </HoverCard>
 */

export interface HoverCardProps {
  children: ReactNode;
  content: ReactNode;
  /** Delay before open (ms). */
  openDelay?: number;
  /** Delay before close (ms). */
  closeDelay?: number;
  className?: string;
  contentClassName?: string;
}

export function HoverCard({
  children,
  content,
  openDelay = 160,
  closeDelay = 120,
  className,
  contentClassName,
}: HoverCardProps) {
  const id = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [open]);

  const clear = () => {
    if (timer.current != null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const place = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({
      top: rect.bottom + 8 + window.scrollY,
      left: rect.left + window.scrollX,
    });
  };

  const scheduleOpen = () => {
    clear();
    timer.current = window.setTimeout(() => {
      place();
      setOpen(true);
    }, openDelay);
  };

  const scheduleClose = () => {
    clear();
    timer.current = window.setTimeout(() => setOpen(false), closeDelay);
  };

  useEffect(() => () => clear(), []);

  return (
    <>
      <span
        ref={triggerRef}
        className={cx("inline-flex", className)}
        aria-describedby={open ? id : undefined}
        onMouseEnter={scheduleOpen}
        onMouseLeave={scheduleClose}
        onFocus={scheduleOpen}
        onBlur={scheduleClose}
      >
        {children}
      </span>
      {mounted && open
        ? createPortal(
            <div
              ref={panelRef}
              id={id}
              role="tooltip"
              className={cx(
                // Same surface recipe as Popover.
                "z-110 w-72 max-w-[calc(100vw-32px)] rounded-[20px] border border-border-button-default bg-background-primary-default p-1.5 shadow-dropdown",
                "transition-[opacity,transform,filter] duration-150 ease-out",
                visible
                  ? "opacity-100 scale-100 blur-0"
                  : "opacity-0 scale-95 blur-[2px] motion-reduce:scale-100 motion-reduce:blur-0",
                contentClassName,
              )}
              style={{ position: "absolute", top: coords.top, left: coords.left }}
              onMouseEnter={clear}
              onMouseLeave={scheduleClose}
            >
              <div className="rounded-[14px] p-2.5">{content}</div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
