"use client";

import { useEffect, useState, type HTMLAttributes, type Ref } from "react";
import { cx } from "../../../utils/cx";

/**
 * Typewriter reveal for hero lines and AI demos — Bencho / agent landing
 * energy without a heavy animation library.
 *
 *   <TypingText text="Build with JoyUI" />
 */

export interface TypingTextProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  text: string;
  /** Delay between characters (ms). Default 42. */
  speed?: number;
  /** Start delay (ms). */
  delay?: number;
  /** Loop after a pause. */
  loop?: boolean;
  /** Pause before deleting / restarting when loop (ms). */
  loopDelay?: number;
  /** Show blinking caret. Default true. */
  caret?: boolean;
  ref?: Ref<HTMLSpanElement>;
}

export function TypingText({
  text,
  speed = 42,
  delay = 0,
  loop = false,
  loopDelay = 1600,
  caret = true,
  className,
  ref,
  ...props
}: TypingTextProps) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"idle" | "type" | "hold" | "delete">("idle");

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setCount(text.length);
      setPhase("hold");
      return;
    }

    let timer = 0;
    if (phase === "idle") {
      timer = window.setTimeout(() => setPhase("type"), delay);
    } else if (phase === "type") {
      if (count >= text.length) {
        timer = window.setTimeout(() => setPhase(loop ? "hold" : "hold"), 0);
      } else {
        timer = window.setTimeout(() => setCount((c) => c + 1), speed);
      }
    } else if (phase === "hold") {
      if (!loop) return;
      timer = window.setTimeout(() => setPhase("delete"), loopDelay);
    } else if (phase === "delete") {
      if (count <= 0) {
        timer = window.setTimeout(() => setPhase("type"), speed);
      } else {
        timer = window.setTimeout(() => setCount((c) => c - 1), Math.max(16, speed / 2));
      }
    }
    return () => window.clearTimeout(timer);
  }, [count, delay, loop, loopDelay, phase, speed, text.length]);

  useEffect(() => {
    setCount(0);
    setPhase("idle");
  }, [text]);

  return (
    <span
      ref={ref}
      className={cx("inline text-body-medium text-text-primary", className)}
      {...props}
    >
      {text.slice(0, count)}
      {caret ? (
        <span
          aria-hidden
          className="bui-typing-caret ms-0.5 inline-block h-[1em] w-[2px] translate-y-[0.1em] bg-current align-baseline"
        />
      ) : null}
    </span>
  );
}
