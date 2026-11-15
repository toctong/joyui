"use client";

import { useChat, type UseChatOptions } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  type ChatStatus,
  type ChatTransport,
  type UIMessage,
} from "ai";
import type { HTMLAttributes, ReactNode } from "react";
import type { AgentThinkingVariant } from "../agent-thinking/agent-thinking";
import { cx } from "../../../utils/cx";
import { AiComposer } from "./ai-composer";
import { AiConversation } from "./ai-conversation";
import { isChatBusy } from "./message-parts";

export type AiChatProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Prefer a custom transport; otherwise DefaultChatTransport({ api }). */
  transport?: ChatTransport<UIMessage>;
  api?: string;
  /** Forwarded into `useChat` (id, messages, onFinish, …). */
  chatOptions?: UseChatOptions<UIMessage>;
  suggestions?: string[];
  emptyTitle?: ReactNode;
  emptyLabel?: ReactNode;
  placeholder?: string;
  thinkingVariant?: AgentThinkingVariant;
  thinkingLabel?: string;
  composerClassName?: string;
  conversationClassName?: string;
  /**
   * Replace the built-in lightweight composer. Use TipTap Composer here:
   *
   *   import { Composer, ComposerLoader } from "@joyui/react/composer";
   *   renderComposer={({ busy, send, stop }) => (
   *     <ComposerLoader active={busy}>
   *       <Composer busy={busy} onStop={stop} onSubmit={send} />
   *     </ComposerLoader>
   *   )}
   */
  renderComposer?: (ctx: {
    status: ChatStatus;
    busy: boolean;
    send: (text: string) => void;
    stop: () => void;
  }) => ReactNode;
  children?: ReactNode;
};

/**
 * End-to-end JoyUI chat wired to `@ai-sdk/react` `useChat`.
 * `ai` + `@ai-sdk/react` ship with `@joyui/react` — no extra install.
 *
 *   import { AiChat } from "@joyui/react";
 *   <AiChat api="/api/chat" />
 */
export function AiChat({
  transport,
  api = "/api/chat",
  chatOptions,
  suggestions = [
    "解释这段报错",
    "把这段总结成三条要点",
    "帮我起五个产品名",
  ],
  emptyTitle,
  emptyLabel,
  placeholder,
  thinkingVariant,
  thinkingLabel,
  composerClassName,
  conversationClassName,
  renderComposer,
  className,
  children,
  ...props
}: AiChatProps) {
  const hasExternalChat = Boolean(
    chatOptions && "chat" in chatOptions && chatOptions.chat,
  );

  const {
    messages,
    sendMessage,
    status,
    stop,
    error,
    regenerate,
    clearError,
  } = useChat(
    hasExternalChat
      ? chatOptions
      : {
          ...chatOptions,
          transport: transport ?? new DefaultChatTransport({ api }),
        },
  );

  const busy = isChatBusy(status);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    clearError();
    void sendMessage({ text: trimmed });
  };

  const retry = () => {
    clearError();
    void regenerate();
  };

  return (
    <div
      className={cx(
        "flex h-full min-h-[28rem] w-full flex-col gap-3",
        className,
      )}
      {...props}
    >
      <AiConversation
        className={cx("px-1", conversationClassName)}
        messages={messages}
        status={status}
        error={error}
        suggestions={suggestions}
        emptyTitle={emptyTitle}
        emptyLabel={emptyLabel}
        thinkingVariant={thinkingVariant}
        thinkingLabel={thinkingLabel}
        onSend={send}
        onClearError={clearError}
        onRegenerate={retry}
      />

      <div className={cx("mx-auto w-full max-w-3xl shrink-0", composerClassName)}>
        {renderComposer ? (
          renderComposer({ status, busy, send, stop })
        ) : (
          <AiComposer
            busy={busy}
            placeholder={placeholder}
            onStop={stop}
            onSubmit={send}
          />
        )}
      </div>

      {children}
    </div>
  );
}
