"use client";

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import type { ChatStatus, UIMessage } from "ai";
import { PromptSuggestions } from "../../base/prompt-suggestions/prompt-suggestions";
import {
  AgentThinking,
  type AgentThinkingVariant,
} from "../agent-thinking/agent-thinking";
import { cx } from "../../../utils/cx";
import { AiMessage } from "./ai-message";
import { isChatBusy, shouldShowThinking } from "./message-parts";

export interface AiConversationProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  messages: UIMessage[];
  status?: ChatStatus;
  error?: Error | null;
  /** Empty-state chips; selecting one calls `onSend`. */
  suggestions?: string[];
  emptyLabel?: ReactNode;
  emptyTitle?: ReactNode;
  onSend?: (text: string) => void;
  onRegenerate?: () => void;
  onClearError?: () => void;
  thinkingVariant?: AgentThinkingVariant;
  thinkingLabel?: string;
  /** Auto-scroll to bottom when messages / status change. Default true. */
  autoScroll?: boolean;
  children?: ReactNode;
}

/**
 * Transcript surface for `@ai-sdk/react` `useChat` — maps `UIMessage[]` to
 * JoyUI `AiMessage`, shows thinking while waiting for text, and an empty state.
 */
export function AiConversation({
  messages,
  status = "ready",
  error,
  suggestions,
  emptyLabel = "试着问我",
  emptyTitle = "今天想聊点什么？",
  onSend,
  onRegenerate,
  onClearError,
  thinkingVariant = "wave",
  thinkingLabel = "Thinking",
  autoScroll = true,
  className,
  children,
  ...props
}: AiConversationProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const busy = isChatBusy(status);
  const showThinking = shouldShowThinking(messages, status);

  useEffect(() => {
    if (!autoScroll) return;
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [messages, status, autoScroll, showThinking]);

  return (
    <div
      ref={scrollRef}
      className={cx(
        "flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto scroll-smooth",
        className,
      )}
      {...props}
    >
      {messages.length === 0 ? (
        <div className="flex min-h-[12rem] flex-1 flex-col items-center justify-center gap-4 px-2 text-center">
          <div className="flex flex-col gap-1">
            <h2 className="text-title-2-medium text-text-primary">{emptyTitle}</h2>
            {typeof emptyLabel === "string" ? (
              <p className="text-body-regular text-text-secondary">{emptyLabel}</p>
            ) : (
              emptyLabel
            )}
          </div>
          {suggestions && suggestions.length > 0 && onSend ? (
            <PromptSuggestions
              className="items-center"
              suggestions={suggestions}
              onSelect={onSend}
            />
          ) : null}
        </div>
      ) : (
        messages.map((message, index) => (
          <AiMessage
            key={message.id}
            message={message}
            streaming={
              busy &&
              index === messages.length - 1 &&
              message.role === "assistant"
            }
            onRegenerate={
              index === messages.length - 1 && message.role === "assistant"
                ? onRegenerate
                : undefined
            }
          />
        ))
      )}

      {showThinking ? (
        <AgentThinking
          variant={thinkingVariant}
          label={thinkingLabel}
          className="px-1"
        />
      ) : null}

      {error ? (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-2 rounded-xl border border-separator-border bg-background-secondary-default px-3 py-2"
        >
          <p className="min-w-0 flex-1 text-body-regular text-text-secondary">
            {error.message || "请求失败，请稍后重试。"}
          </p>
          <div className="flex shrink-0 items-center gap-1">
            {onClearError ? (
              <button
                type="button"
                onClick={onClearError}
                className="rounded-lg px-2 py-1 text-caption-1-medium text-text-tertiary transition-colors hover:bg-background-secondary-hover hover:text-text-primary"
              >
                关闭
              </button>
            ) : null}
            {onRegenerate ? (
              <button
                type="button"
                onClick={onRegenerate}
                className="rounded-lg bg-background-primary-default px-2.5 py-1 text-caption-1-medium text-text-primary shadow-xs transition-colors hover:bg-background-secondary-hover"
              >
                重试
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {children}
    </div>
  );
}
