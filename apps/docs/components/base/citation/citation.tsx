"use client";

import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode, Ref } from "react";
import { RiExternalLinkLine } from "@remixicon/react";
import { cx, sortCx } from "@/utils/cx";

/**
 * RAG / AI source chip — index + title, optional link. Matches Chip radius
 * and caption type; sits under agent answers next to Composer.
 *
 *   <Citation index={1} title="JoyUI docs" href="https://www.joyui.top" />
 */

export interface CitationProps
  extends Omit<HTMLAttributes<HTMLElement>, "children" | "title"> {
  index?: number | string;
  title: ReactNode;
  href?: string;
  /** Show external-link glyph when `href` is set. Default true. */
  showIcon?: boolean;
  ref?: Ref<HTMLElement>;
}

const styles = sortCx({
  root: [
    "inline-flex max-w-full items-center gap-1.5",
    "rounded-md bg-background-secondary-default px-1.5 py-1",
    "text-caption-1-medium text-text-secondary",
    "transition-[background-color,color,box-shadow] duration-200 ease",
    "hover:bg-background-tertiary-default hover:text-text-primary",
  ].join(" "),
  index: [
    "inline-flex size-4 shrink-0 items-center justify-center",
    "rounded-sm bg-background-tertiary-default",
    "text-[10px] font-semibold leading-none text-text-tertiary",
  ].join(" "),
  title: "min-w-0 truncate",
  icon: "size-3 shrink-0 text-foreground-icon-quaternary",
});

export function Citation({
  index,
  title,
  href,
  showIcon = true,
  className,
  ref,
  ...props
}: CitationProps) {
  const content = (
    <>
      {index != null ? (
        <span aria-hidden className={styles.index}>
          {index}
        </span>
      ) : null}
      <span className={styles.title}>{title}</span>
      {href && showIcon ? (
        <RiExternalLinkLine className={styles.icon} aria-hidden />
      ) : null}
    </>
  );

  if (href) {
    const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={cx(styles.root, "no-underline", className)}
        {...anchorProps}
      >
        {content}
      </a>
    );
  }

  return (
    <span
      ref={ref as Ref<HTMLSpanElement>}
      className={cx(styles.root, className)}
      {...props}
    >
      {content}
    </span>
  );
}
