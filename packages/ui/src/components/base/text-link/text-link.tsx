import type { AnchorHTMLAttributes, ReactNode, Ref } from "react";
import { cx, sortCx } from "../../../utils/cx";

/**
 * Inline text link with brand colour and underline-on-hover.
 * Prefer this over bare `<a className="text-text-brand-primary">`.
 */

export type TextLinkSize = "sm" | "md";

export interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: TextLinkSize;
  children?: ReactNode;
  /** Soften the link (secondary text colour, brand on hover). */
  muted?: boolean;
  ref?: Ref<HTMLAnchorElement>;
}

const styles = sortCx({
  base: "inline underline-offset-2 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring rounded-sm",
  size: {
    sm: "text-body-2-regular",
    md: "text-body-regular",
  },
  tone: {
    default: "text-text-brand-primary",
    muted: "text-text-secondary hover:text-text-brand-primary",
  },
});

export function TextLink({
  size = "md",
  muted = false,
  className,
  ref,
  children,
  ...props
}: TextLinkProps) {
  return (
    <a
      ref={ref}
      className={cx(
        styles.base,
        styles.size[size],
        muted ? styles.tone.muted : styles.tone.default,
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
