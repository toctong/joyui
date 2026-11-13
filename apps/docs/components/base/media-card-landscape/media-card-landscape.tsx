import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "@/utils/cx";

/**
 * Wide landscape media row — episode stills, continue-watching, related clips.
 * Image sits left; titles / meta / action stack on the right.
 *
 *   <MediaCardLandscape
 *     title="S01E01 · Good News About Hell"
 *     subtitle="53 min"
 *     src="…"
 *   />
 */

export interface MediaCardLandscapeProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Still / thumb image URL. */
  src?: string | null;
  alt?: string;
  /** Thumb aspect; default 16/9 landscape. */
  aspectClassName?: string;
  /** Thumb width utility class. Default w-40 sm:w-48. */
  mediaClassName?: string;
  /** Optional badge / chip overlaid at the bottom of the still. */
  footer?: ReactNode;
  /** Trailing action under the titles. */
  action?: ReactNode;
  /** Leading meta (episode index, progress, etc.). */
  meta?: ReactNode;
  interactive?: boolean;
  ref?: Ref<HTMLElement>;
}

export function MediaCardLandscape({
  title,
  subtitle,
  src,
  alt = "",
  aspectClassName = "aspect-video",
  mediaClassName = "w-40 shrink-0 sm:w-48",
  footer,
  action,
  meta,
  interactive = false,
  className,
  ref,
  onClick,
  ...props
}: MediaCardLandscapeProps) {
  const pressable = interactive || typeof onClick === "function";
  return (
    <article
      ref={ref}
      className={cx(
        "flex min-w-0 items-stretch gap-3 rounded-2xl border border-border-secondary-default bg-background-primary-default p-2 dark:bg-background-secondary-default",
        pressable &&
          "cursor-pointer transition-colors hover:bg-background-primary-hover",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      <div
        className={cx(
          "relative overflow-hidden rounded-xl bg-background-secondary-default",
          aspectClassName,
          mediaClassName,
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="size-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="size-full bg-background-secondary-default" aria-hidden />
        )}
        {footer ? (
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-1.5 pt-6">
            {footer}
          </div>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 py-0.5 pr-1">
        {meta ? (
          <div className="text-caption-1-regular text-text-tertiary">{meta}</div>
        ) : null}
        <h3 className="line-clamp-2 text-body-medium text-text-primary">{title}</h3>
        {subtitle ? (
          <div className="truncate text-caption-1-regular text-text-tertiary">
            {subtitle}
          </div>
        ) : null}
        {action ? <div className="mt-1.5">{action}</div> : null}
      </div>
    </article>
  );
}
