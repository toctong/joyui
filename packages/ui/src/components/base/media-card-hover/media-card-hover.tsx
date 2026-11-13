"use client";

import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "../../../utils/cx";

/**
 * Media card with cover zoom + footer / action reveal on hover.
 * Discovery grids that need a light “peek” without leaving the poster layout.
 *
 *   <MediaCardHover title="Severance" src="…" action={<Button>Add</Button>} />
 */

export interface MediaCardHoverProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Cover image URL. */
  src?: string | null;
  alt?: string;
  /** Aspect ratio class, default portrait 2/3. */
  aspectClassName?: string;
  /** Overlay content revealed at the bottom of the cover on hover. */
  footer?: ReactNode;
  /** Trailing action revealed under the titles on hover. */
  action?: ReactNode;
  /** Cover scale on hover. Default 1.06. */
  zoom?: number;
  interactive?: boolean;
  ref?: Ref<HTMLElement>;
}

export function MediaCardHover({
  title,
  subtitle,
  src,
  alt = "",
  aspectClassName = "aspect-[2/3]",
  footer,
  action,
  zoom = 1.06,
  interactive = false,
  className,
  ref,
  onClick,
  style,
  ...props
}: MediaCardHoverProps) {
  const pressable = interactive || typeof onClick === "function";
  return (
    <article
      ref={ref}
      className={cx(
        "group/media-hover flex min-w-0 flex-col gap-2",
        className,
      )}
      onClick={onClick}
      style={
        {
          "--bui-media-hover-zoom": String(zoom),
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <div
        className={cx(
          "relative overflow-hidden rounded-xl bg-background-secondary-default",
          aspectClassName,
          pressable && "cursor-pointer",
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="size-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover/media-hover:scale-[var(--bui-media-hover-zoom)] group-focus-within/media-hover:scale-[var(--bui-media-hover-zoom)]"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className="size-full bg-background-secondary-default transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover/media-hover:scale-[var(--bui-media-hover-zoom)]"
            aria-hidden
          />
        )}
        {footer ? (
          <div
            className={cx(
              "absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 via-black/35 to-transparent p-2.5 pt-10",
              "translate-y-1 opacity-0 transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none",
              "group-hover/media-hover:translate-y-0 group-hover/media-hover:opacity-100",
              "group-focus-within/media-hover:translate-y-0 group-focus-within/media-hover:opacity-100",
            )}
          >
            {footer}
          </div>
        ) : null}
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-body-medium text-text-primary">{title}</h3>
        {subtitle ? (
          <div className="mt-0.5 truncate text-caption-1-regular text-text-tertiary">
            {subtitle}
          </div>
        ) : null}
        {action ? (
          <div
            className={cx(
              "mt-2 grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "grid-rows-[0fr] opacity-0",
              "motion-reduce:grid-rows-[1fr] motion-reduce:opacity-100 motion-reduce:transition-none",
              "group-hover/media-hover:grid-rows-[1fr] group-hover/media-hover:opacity-100",
              "group-focus-within/media-hover:grid-rows-[1fr] group-focus-within/media-hover:opacity-100",
            )}
          >
            <div className="min-h-0 overflow-hidden">{action}</div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
