import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cx, sortCx } from "@/utils/cx";

/**
 * Stacked list shell + row. Use for settings rows, search hits, log lines —
 * anything that was previously a hand-rolled `divide-y` border box.
 */

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  /** Draw hairlines between rows (default true). */
  divided?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLUListElement>;
}

const listStyles = sortCx({
  base: "overflow-hidden rounded-2xl border border-border-secondary-default bg-background-primary-default dark:bg-background-secondary-default",
  divided: "divide-y divide-border-secondary-default",
});

export function List({
  divided = true,
  className,
  ref,
  children,
  ...props
}: ListProps) {
  return (
    <ul
      ref={ref}
      className={cx(listStyles.base, divided && listStyles.divided, className)}
      {...props}
    >
      {children}
    </ul>
  );
}

export interface ListItemProps extends Omit<HTMLAttributes<HTMLLIElement>, "title"> {
  title: ReactNode;
  description?: ReactNode;
  /** Leading icon / avatar / status. */
  leading?: ReactNode;
  /** Trailing meta / actions. */
  trailing?: ReactNode;
  /** Makes the row feel pressable (hover + cursor). */
  interactive?: boolean;
  ref?: Ref<HTMLLIElement>;
}

export function ListItem({
  title,
  description,
  leading,
  trailing,
  interactive = false,
  className,
  ref,
  onClick,
  ...props
}: ListItemProps) {
  const pressable = interactive || typeof onClick === "function";
  return (
    <li
      ref={ref}
      className={cx(
        "flex items-start gap-3 px-4 py-3 text-start",
        pressable &&
          "cursor-pointer transition-colors hover:bg-background-primary-hover",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {leading ? <div className="mt-0.5 shrink-0">{leading}</div> : null}
      <div className="min-w-0 flex-1">
        <div className="text-body-medium text-text-primary">{title}</div>
        {description ? (
          <div className="mt-0.5 text-body-regular text-text-tertiary">{description}</div>
        ) : null}
      </div>
      {trailing ? <div className="shrink-0 self-center">{trailing}</div> : null}
    </li>
  );
}
