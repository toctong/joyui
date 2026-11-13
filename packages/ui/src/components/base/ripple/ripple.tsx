"use client";

import {
  useCallback,
  useRef,
  useState,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from "react";
import { cx } from "../../../utils/cx";

/**
 * Press ripple — Libraries.dev / Material energy on buttons and cards,
 * tinted with currentColor (set text-accent-500 on the host).
 *
 *   <Ripple className="text-accent-500">
 *     <Button>Ripple</Button>
 *   </Ripple>
 */

type RippleWave = { id: number; x: number; y: number; size: number };

export interface RippleProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Disable the effect. */
  disabled?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export function Ripple({
  children,
  disabled = false,
  className,
  onPointerDown,
  ref,
  ...props
}: RippleProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [waves, setWaves] = useState<RippleWave[]>([]);
  const seq = useRef(0);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      hostRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const spawn = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const el = hostRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const id = ++seq.current;
    setWaves((prev) => [
      ...prev,
      {
        id,
        x: event.clientX - rect.left - size / 2,
        y: event.clientY - rect.top - size / 2,
        size,
      },
    ]);
    window.setTimeout(() => {
      setWaves((prev) => prev.filter((w) => w.id !== id));
    }, 520);
  };

  return (
    <div
      ref={setRefs}
      className={cx("bui-ripple relative isolate overflow-hidden", className)}
      onPointerDown={(event) => {
        spawn(event);
        onPointerDown?.(event);
      }}
      {...props}
    >
      {children}
      <span aria-hidden className="pointer-events-none absolute inset-0">
        {waves.map((wave) => (
          <span
            key={wave.id}
            className="bui-ripple-wave absolute rounded-full bg-current"
            style={{
              left: wave.x,
              top: wave.y,
              width: wave.size,
              height: wave.size,
            }}
          />
        ))}
      </span>
    </div>
  );
}
