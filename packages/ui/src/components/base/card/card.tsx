import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cx, sortCx } from "../../../utils/cx";

/**
 * Surface container for grouped content — settings blocks, list shells,
 * form panels. Prefer this over hand-rolled `rounded-* border` boxes so
 * radius / border / background stay on JoyUI tokens.
 */

export type CardPadding = "none" | "sm" | "md" | "lg";
export type CardVariant = "outline" | "soft" | "ghost";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

const styles = sortCx({
  base: "min-w-0 rounded-2xl",
  variant: {
    outline:
      "border border-border-secondary-default bg-background-primary-default dark:bg-background-secondary-default",
    soft: "border border-border-secondary-default bg-background-secondary-default/40",
    ghost: "bg-transparent",
  },
  padding: {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6 sm:p-8",
  },
});

export function Card({
  variant = "outline",
  padding = "md",
  className,
  ref,
  children,
  ...props
}: CardProps) {
  return (
    <div
      ref={ref}
      className={cx(styles.base, styles.variant[variant], styles.padding[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
}
