"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../../utils/cx";

/**
 * One transcript turn — user bubble vs assistant column.
 *
 *   <ChatMessage role="user">Summarize this PR</ChatMessage>
 *   <ChatMessage role="assistant" streaming>
 *     <ReasoningBlock … />
 *     <p>…</p>
 *     <MessageActions … />
 *   </ChatMessage>
 */

export type ChatMessageRole = "user" | "assistant" | "system";

export interface ChatMessageProps extends HTMLAttributes<HTMLElement> {
  role: ChatMessageRole;
  /** Soften actions / hide caret while tokens arrive. */
  streaming?: boolean;
  children?: ReactNode;
}

export function ChatMessage({
  role,
  streaming = false,
  className,
  children,
  ...props
}: ChatMessageProps) {
  if (role === "user") {
    return (
      <div
        data-role="user"
        data-streaming={streaming || undefined}
        className={cx(
          "ms-auto flex w-fit max-w-[min(75%,36rem)] flex-col",
          "rounded-2xl bg-background-primary-default px-3 py-2.5",
          "text-start text-body-regular break-words whitespace-pre-wrap text-text-primary shadow-card",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (role === "system") {
    return (
      <div
        data-role="system"
        data-streaming={streaming || undefined}
        className={cx(
          "mx-auto max-w-md rounded-xl border border-separator-border bg-background-secondary-default px-3 py-2",
          "text-center text-caption-1-medium text-text-tertiary",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      data-role="assistant"
      data-streaming={streaming || undefined}
      className={cx(
        "group/message flex w-full max-w-3xl flex-col gap-2 px-1",
        "text-body-regular break-words text-text-primary",
        className,
      )}
      {...props}
    >
      {children}
      {streaming ? (
        <span
          aria-hidden
          className="bui-typing-caret inline-block h-[1em] w-[2px] translate-y-[0.1em] bg-accent-500 align-baseline"
        />
      ) : null}
    </div>
  );
}
