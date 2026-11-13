"use client";

import type { ReactNode } from "react";
import { Avatar, type AvatarProps } from "../avatar/avatar";
import { HoverCard, type HoverCardProps } from "../hover-card/hover-card";
import { cx } from "../../../utils/cx";

/**
 * Profile hover card — HoverCard + Avatar composition for mentions and assignees.
 *
 *   <HoverCardProfile name="林晓" role="产品设计" handle="@linxiao" initials="林" color="lime">
 *     <Avatar initials="林" color="lime" />
 *   </HoverCardProfile>
 */

export interface HoverCardProfileProps
  extends Pick<HoverCardProps, "openDelay" | "closeDelay" | "className" | "contentClassName"> {
  name: string;
  role?: string;
  handle?: string;
  initials?: string;
  color?: AvatarProps["color"];
  /** Trigger element (usually an Avatar or mention chip). */
  children: ReactNode;
}

export function HoverCardProfile({
  name,
  role,
  handle,
  initials,
  color = "neutral",
  children,
  openDelay,
  closeDelay,
  className,
  contentClassName,
}: HoverCardProfileProps) {
  const resolvedInitials =
    initials ??
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  return (
    <HoverCard
      openDelay={openDelay}
      closeDelay={closeDelay}
      className={className}
      contentClassName={contentClassName}
      content={
        <div className={cx("flex items-center gap-3")}>
          <Avatar size="lg" color={color} initials={resolvedInitials} />
          <div className="min-w-0">
            <p className="truncate text-body-medium text-text-primary">{name}</p>
            {(role || handle) && (
              <p className="truncate text-body-2-regular text-text-secondary">
                {[role, handle].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </div>
      }
    >
      {children}
    </HoverCard>
  );
}
