"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { Reveal, type RevealFrom, type RevealProps } from "@/components/base/reveal/reveal";
import { cx } from "@/utils/cx";

/**
 * Staggered reveal for a list of children — each child mounts with an
 * incremental delay. Prefer this over hand-rolling `delay` on every Reveal.
 *
 *   <RevealStagger stagger={80}>
 *     <Card>一</Card>
 *     <Card>二</Card>
 *     <Card>三</Card>
 *   </RevealStagger>
 */

export interface RevealStaggerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Delay between consecutive children (ms). */
  stagger?: number;
  /** Initial delay before the first child (ms). */
  delay?: number;
  duration?: number;
  from?: RevealFrom;
  offset?: number;
  once?: boolean;
  rootMargin?: string;
  /** Layout direction of the stack. */
  gap?: string;
  ref?: Ref<HTMLDivElement>;
}

export function RevealStagger({
  children,
  stagger = 80,
  delay = 0,
  duration = 480,
  from = "up",
  offset = 12,
  once = true,
  rootMargin,
  gap = "0.75rem",
  className,
  style,
  ref,
  ...props
}: RevealStaggerProps) {
  const items = Children.toArray(children);

  return (
    <div
      ref={ref}
      className={cx("flex w-full flex-col", className)}
      style={{ gap, ...style }}
      {...props}
    >
      {items.map((child, index) => {
        const childDelay = delay + index * stagger;

        if (isValidElement(child) && child.type === Reveal) {
          const reveal = child as ReactElement<RevealProps>;
          return cloneElement(reveal, {
            key: reveal.key ?? index,
            delay: reveal.props.delay ?? childDelay,
            duration: reveal.props.duration ?? duration,
            from: reveal.props.from ?? from,
            offset: reveal.props.offset ?? offset,
            once: reveal.props.once ?? once,
            rootMargin: reveal.props.rootMargin ?? rootMargin,
          });
        }

        return (
          <Reveal
            key={isValidElement(child) && child.key != null ? child.key : index}
            delay={childDelay}
            duration={duration}
            from={from}
            offset={offset}
            once={once}
            rootMargin={rootMargin}
          >
            {child}
          </Reveal>
        );
      })}
    </div>
  );
}
