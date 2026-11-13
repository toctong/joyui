import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cx, sortCx } from "@/utils/cx";

/**
 * Key / value detail list for settings summaries, account cards, and
 * transfer metadata. Prefer this over hand-rolled two-column grids.
 */

export type DescriptionListColumns = 1 | 2;

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  columns?: DescriptionListColumns;
  children?: ReactNode;
  ref?: Ref<HTMLDListElement>;
}

export interface DescriptionTermProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  ref?: Ref<HTMLElement>;
}

export interface DescriptionDetailsProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  ref?: Ref<HTMLElement>;
}

const styles = sortCx({
  list: {
    1: "grid grid-cols-1 gap-x-6 gap-y-3",
    2: "grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2",
  },
});

export function DescriptionList({
  columns = 1,
  className,
  ref,
  children,
  ...props
}: DescriptionListProps) {
  return (
    <dl ref={ref} className={cx(styles.list[columns], className)} {...props}>
      {children}
    </dl>
  );
}

export function DescriptionTerm({
  className,
  ref,
  children,
  ...props
}: DescriptionTermProps) {
  return (
    <dt
      ref={ref}
      className={cx("text-caption-1-medium text-text-tertiary", className)}
      {...props}
    >
      {children}
    </dt>
  );
}

export function DescriptionDetails({
  className,
  ref,
  children,
  ...props
}: DescriptionDetailsProps) {
  return (
    <dd
      ref={ref}
      className={cx("mt-0.5 text-body-medium text-text-primary break-words", className)}
      {...props}
    >
      {children}
    </dd>
  );
}

/** Convenience row: term + details as one visual unit. */
export function DescriptionItem({
  term,
  children,
  className,
}: {
  term: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("min-w-0", className)}>
      <DescriptionTerm>{term}</DescriptionTerm>
      <DescriptionDetails>{children}</DescriptionDetails>
    </div>
  );
}
