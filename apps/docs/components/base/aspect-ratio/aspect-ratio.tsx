import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "@/utils/cx";

/**
 * Locks a box to a width:height ratio — media tiles, embeds, skeletons.
 * Bencho / Watermelon media layouts without hand-rolled padding hacks.
 *
 *   <AspectRatio ratio={16 / 9}>
 *     <img src="…" alt="" className="size-full object-cover" />
 *   </AspectRatio>
 */

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /** Width / height. Default 16/9. */
  ratio?: number;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function AspectRatio({
  ratio = 16 / 9,
  children,
  className,
  style,
  ref,
  ...props
}: AspectRatioProps) {
  return (
    <div
      ref={ref}
      className={cx("relative w-full overflow-hidden", className)}
      style={{ aspectRatio: String(ratio), ...style } as CSSProperties}
      {...props}
    >
      <div className="absolute inset-0 size-full">{children}</div>
    </div>
  );
}
