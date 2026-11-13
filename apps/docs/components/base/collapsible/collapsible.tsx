"use client";

import type { ReactNode } from "react";
import {
  Button as AriaButton,
  Disclosure as AriaDisclosure,
  DisclosurePanel as AriaDisclosurePanel,
  Heading as AriaHeading,
} from "react-aria-components";
import type { DisclosureProps as AriaDisclosureProps } from "react-aria-components";
import { RiArrowDownSLine } from "@remixicon/react";
import { cx } from "@/utils/cx";

/**
 * Single expand/collapse block — lighter than Accordion when you only need
 * one disclosure (advanced settings, filter panel, spoiler).
 */

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export interface CollapsibleProps extends Omit<AriaDisclosureProps, "className" | "children"> {
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function Collapsible({ title, children, className, ...props }: CollapsibleProps) {
  return (
    <AriaDisclosure
      className={cx(
        "rounded-xl border border-border-secondary-default bg-background-primary-default dark:bg-background-secondary-default",
        className,
      )}
      {...props}
    >
      {({ isExpanded }) => (
        <>
          <AriaHeading>
            <AriaButton
              slot="trigger"
              className={cx(
                "flex w-full items-center justify-between gap-3 px-4 py-3 text-start",
                "text-body-medium text-text-primary outline-none",
                "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring",
                "cursor-pointer hover:bg-background-primary-hover rounded-xl",
              )}
            >
              <span className="min-w-0 flex-1">{title}</span>
              <RiArrowDownSLine
                aria-hidden
                className={cx(
                  "size-5 shrink-0 text-foreground-icon-primary transition-transform duration-300",
                  EASE,
                  isExpanded && "rotate-180",
                )}
              />
            </AriaButton>
          </AriaHeading>
          <AriaDisclosurePanel
            className={cx(
              "overflow-hidden transition-[height,opacity] duration-300 motion-reduce:transition-none",
              EASE,
            )}
          >
            <div className="border-t border-border-secondary-default px-4 py-3 text-body-regular text-text-secondary">
              {children}
            </div>
          </AriaDisclosurePanel>
        </>
      )}
    </AriaDisclosure>
  );
}
