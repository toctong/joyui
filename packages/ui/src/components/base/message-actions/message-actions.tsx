"use client";

import type { ComponentType, HTMLAttributes, ReactNode } from "react";
import { cx } from "../../../utils/cx";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export interface MessageActionItem {
  id: string;
  label: string;
  icon: IconComponent;
  onPress?: () => void;
  disabled?: boolean;
}

/**
 * Hover / focus-visible action row under an assistant message.
 * Always mounted (opacity-gated) so keyboard users can reach it.
 *
 *   <div className="group/message">
 *     …
 *     <MessageActions
 *       actions={[
 *         { id: "copy", label: "Copy", icon: RiFileCopyLine, onPress },
 *         { id: "regen", label: "Regenerate", icon: RiRefreshLine, onPress },
 *       ]}
 *     />
 *   </div>
 */

export interface MessageActionsProps extends HTMLAttributes<HTMLDivElement> {
  actions: MessageActionItem[];
  /** Hide while streaming (still in DOM). */
  hidden?: boolean;
  trailing?: ReactNode;
}

export function MessageActions({
  actions,
  hidden = false,
  trailing,
  className,
  ...props
}: MessageActionsProps) {
  return (
    <div
      className={cx(
        "flex items-center gap-0.5 transition-opacity duration-150",
        hidden
          ? "pointer-events-none opacity-0"
          : "opacity-0 group-hover/message:opacity-100 focus-within:opacity-100",
        className,
      )}
      {...props}
    >
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            type="button"
            disabled={action.disabled}
            aria-label={action.label}
            title={action.label}
            onClick={action.onPress}
            className={cx(
              "flex size-7 cursor-pointer items-center justify-center rounded-md",
              "text-foreground-icon-tertiary transition-colors",
              "hover:bg-background-secondary-hover hover:text-foreground-icon-secondary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              "disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            <Icon className="size-4" aria-hidden />
          </button>
        );
      })}
      {trailing ? (
        <div className="ms-1 text-caption-1-regular text-text-tertiary">
          {trailing}
        </div>
      ) : null}
    </div>
  );
}
