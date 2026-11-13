import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { Children, cloneElement, isValidElement } from "react";
import type { AvatarProps } from "@/components/base/avatar/avatar";
import { cx, sortCx } from "@/utils/cx";

/**
 * Stacked avatars for teammates / assignees — the collaboration pattern
 * beUI and Watermelon use on boards and chat headers.
 *
 *   <AvatarGroup max={3}>
 *     <Avatar initials="A" />
 *     <Avatar initials="B" />
 *     <Avatar initials="C" />
 *     <Avatar initials="D" />
 *   </AvatarGroup>
 */

export type AvatarGroupSize = NonNullable<AvatarProps["size"]>;

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** How many faces to show before +N. Default 3. */
  max?: number;
  size?: AvatarGroupSize;
  ref?: Ref<HTMLDivElement>;
}

const ring = sortCx({
  base: "relative inline-flex items-center",
  size: {
    xs: "-space-x-1.5",
    sm: "-space-x-2",
    md: "-space-x-2.5",
    lg: "-space-x-3",
  },
});

const overflow = sortCx({
  base: "relative z-10 inline-flex shrink-0 items-center justify-center rounded-full border-2 border-background-primary-default bg-background-tertiary-default text-text-secondary",
  size: {
    xs: "size-5 text-[9px] font-semibold",
    sm: "size-6 text-caption-1-semibold",
    md: "size-8 text-caption-1-semibold",
    lg: "size-9 text-body-2-semibold",
  },
});

export function AvatarGroup({
  children,
  max = 3,
  size = "md",
  className,
  ref,
  ...props
}: AvatarGroupProps) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<AvatarProps>[];
  const visible = items.slice(0, Math.max(0, max));
  const rest = Math.max(0, items.length - visible.length);

  return (
    <div
      ref={ref}
      role="group"
      className={cx(ring.base, ring.size[size], className)}
      {...props}
    >
      {visible.map((child, i) =>
        cloneElement(child, {
          size: child.props.size ?? size,
          className: cx(
            "relative border-2 border-background-primary-default",
            child.props.className,
          ),
          style: { zIndex: visible.length - i, ...child.props.style },
        }),
      )}
      {rest > 0 ? (
        <span className={cx(overflow.base, overflow.size[size])} style={{ zIndex: 0 }}>
          +{rest}
        </span>
      ) : null}
    </div>
  );
}
