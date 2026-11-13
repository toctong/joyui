"use client";

import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from "react";
import { cx } from "../../../utils/cx";

/**
 * Soft magnetic pull toward the cursor — Libraries.dev Magnetic UI energy
 * for icon buttons, CTAs, and dock items.
 *
 *   <Magnetic>
 *     <IconButton icon={RiAddLine} aria-label="Add" />
 *   </Magnetic>
 */

export interface MagneticProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Max pull distance in px. Default 12. */
  strength?: number;
  /** How far the pointer can be and still pull (px). Default 80. */
  radius?: number;
  ref?: Ref<HTMLDivElement>;
}

export function Magnetic({
  children,
  className,
  strength = 12,
  radius = 80,
  style,
  onMouseMove,
  onMouseLeave,
  ref,
  ...props
}: MagneticProps) {
  const localRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const el = localRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const cx0 = rect.left + rect.width / 2;
      const cy0 = rect.top + rect.height / 2;
      const dx = event.clientX - cx0;
      const dy = event.clientY - cy0;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        const t = 1 - dist / radius;
        setOffset({
          x: (dx / (dist || 1)) * strength * t,
          y: (dy / (dist || 1)) * strength * t,
        });
      } else {
        setOffset({ x: 0, y: 0 });
      }
    }
    onMouseMove?.(event);
  };

  const handleLeave = (event: MouseEvent<HTMLDivElement>) => {
    setOffset({ x: 0, y: 0 });
    onMouseLeave?.(event);
  };

  return (
    <div
      ref={setRefs}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cx("bui-magnetic inline-flex will-change-transform", className)}
      style={
        {
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
}
