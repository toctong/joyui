import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "@/utils/cx";

/**
 * Poster / cover card for discovery grids (TV, movies). Image is optional —
 * without `src` a muted placeholder plane is shown.
 */

export interface MediaCardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Cover image URL. */
  src?: string | null;
  alt?: string;
  /** Aspect ratio class, default portrait 2/3. */
  aspectClassName?: string;
  /** Optional badge / chip overlaid at the bottom of the media (not floating). */
  footer?: ReactNode;
  /** Trailing action under the titles. */
  action?: ReactNode;
  interactive?: boolean;
  ref?: Ref<HTMLElement>;
}

export function MediaCard({
  title,
  subtitle,
  src,
  alt = "",
  aspectClassName = "aspect-[2/3]",
  footer,
  action,
  interactive = false,
  className,
  ref,
  onClick,
  ...props
}: MediaCardProps) {
  const pressable = interactive || typeof onClick === "function";
  return (
    <article
      ref={ref}
      className={cx("flex min-w-0 flex-col gap-2", className)}
      onClick={onClick}
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
            className="size-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="size-full bg-background-secondary-default" aria-hidden />
        )}
        {footer ? (
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-2 pt-8">
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
        {action ? <div className="mt-2">{action}</div> : null}
      </div>
    </article>
  );
}
