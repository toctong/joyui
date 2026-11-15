"use client";

import {
  RiFileCopyLine,
  RiRefreshLine,
} from "@remixicon/react";
import { useEffect, useState, type HTMLAttributes, type ReactNode } from "react";
import type { UIMessage } from "ai";
import { Citation } from "../../base/citation/citation";
import { MessageActions } from "../../base/message-actions/message-actions";
import { ChatMessage } from "../chat-message/chat-message";
import { ReasoningBlock } from "../reasoning-block/reasoning-block";
import { ToolCall } from "../tool-call/tool-call";
import { cx } from "../../../utils/cx";
import {
  formatToolOutput,
  getToolName,
  getUIMessageSources,
  getUIMessageText,
  isReasoningUIPart,
  isToolUIPart,
  mapToolStateToStatus,
  summarizeToolInput,
} from "./message-parts";

export interface AiMessageProps
  extends Omit<HTMLAttributes<HTMLElement>, "children" | "role"> {
  message: UIMessage;
  /** Last assistant turn still receiving tokens. */
  streaming?: boolean;
  onRegenerate?: () => void;
  /** Extra content after built-in parts (custom data parts, etc.). */
  children?: ReactNode;
}

/**
 * Renders one AI SDK `UIMessage` with JoyUI transcript primitives:
 * ChatMessage + ReasoningBlock + ToolCall + Citation + MessageActions.
 */
export function AiMessage({
  message,
  streaming = false,
  onRegenerate,
  className,
  children,
  ...props
}: AiMessageProps) {
  const text = getUIMessageText(message);
  const sources = getUIMessageSources(message);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  const fileParts = message.parts.filter((part) => part.type === "file");

  if (message.role === "user") {
    if (!text && fileParts.length === 0) return null;
    return (
      <ChatMessage role="user" className={className} {...props}>
        {fileParts.map((part, index) => (
          <FilePartView key={`file-${index}`} part={part} />
        ))}
        {text}
      </ChatMessage>
    );
  }

  if (message.role === "system") {
    if (!text) return null;
    return (
      <ChatMessage role="system" className={className} {...props}>
        {text}
      </ChatMessage>
    );
  }

  const hasBody =
    message.parts.some(
      (part) =>
        part.type === "text" ||
        part.type === "file" ||
        isReasoningUIPart(part) ||
        isToolUIPart(part) ||
        part.type === "source-url" ||
        part.type === "source-document",
    ) || Boolean(children);

  if (!hasBody && !streaming) return null;

  return (
    <ChatMessage
      role="assistant"
      streaming={streaming && text.length === 0}
      className={cx("gap-2.5", className)}
      {...props}
    >
      {message.parts.map((part, index) => {
        if (isReasoningUIPart(part)) {
          const streamingReason = part.state === "streaming";
          return (
            <ReasoningBlock
              key={part.id ?? `reasoning-${index}`}
              status={streamingReason ? "streaming" : "done"}
              defaultOpen={streamingReason}
              title={streamingReason ? undefined : "Thought"}
            >
              {part.text}
            </ReasoningBlock>
          );
        }

        if (isToolUIPart(part)) {
          const name = getToolName(part);
          const status = mapToolStateToStatus(part.state);
          const error =
            part.state === "output-error" ? part.errorText : undefined;
          const body =
            part.state === "output-available"
              ? formatToolOutput(part.output)
              : part.state === "input-streaming" ||
                  part.state === "input-available" ||
                  part.state === "approval-requested" ||
                  part.state === "approval-responded"
                ? formatToolOutput(part.input)
                : undefined;

          return (
            <ToolCall
              key={part.toolCallId}
              name={name}
              status={status}
              summary={summarizeToolInput(
                "input" in part ? part.input : undefined,
              )}
              error={error}
              defaultOpen={status === "error" || status === "running"}
            >
              {body}
            </ToolCall>
          );
        }

        if (part.type === "file") {
          return <FilePartView key={`file-${index}`} part={part} />;
        }

        if (part.type === "text" && part.text) {
          const lastText =
            message.parts.map((p, i) => (p.type === "text" ? i : -1)).filter((i) => i >= 0).at(-1) ===
            index;
          return (
            <p
              key={`text-${index}`}
              className="text-body-regular whitespace-pre-wrap break-words text-text-primary"
            >
              {part.text}
              {streaming && lastText ? (
                <span
                  aria-hidden
                  className="bui-typing-caret ms-0.5 inline-block h-[1em] w-[2px] translate-y-[0.1em] bg-accent-500 align-baseline"
                />
              ) : null}
            </p>
          );
        }

        return null;
      })}

      {sources.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {sources.map((source, index) => (
            <Citation
              key={source.id}
              index={index + 1}
              title={source.title}
              href={source.href}
            />
          ))}
        </div>
      ) : null}

      {children}

      {text || onRegenerate ? (
        <MessageActions
          hidden={streaming}
          actions={[
            ...(text
              ? [
                  {
                    id: "copy",
                    label: copied ? "已复制" : "复制",
                    icon: RiFileCopyLine,
                    onPress: async () => {
                      try {
                        await navigator.clipboard.writeText(text);
                        setCopied(true);
                      } catch {
                        // Clipboard may be blocked.
                      }
                    },
                  },
                ]
              : []),
            ...(onRegenerate
              ? [
                  {
                    id: "regen",
                    label: "重新生成",
                    icon: RiRefreshLine,
                    onPress: onRegenerate,
                    disabled: streaming,
                  },
                ]
              : []),
          ]}
        />
      ) : null}
    </ChatMessage>
  );
}

function FilePartView({
  part,
}: {
  part: { type: "file"; mediaType: string; url: string; filename?: string };
}) {
  const isImage =
    part.mediaType === "image" || part.mediaType.startsWith("image/");

  if (isImage) {
    return (
      <img
        src={part.url}
        alt={part.filename ?? "attachment"}
        className="max-h-56 max-w-full rounded-xl border border-separator-border object-contain"
      />
    );
  }

  return (
    <a
      href={part.url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-separator-border bg-background-secondary-default px-2.5 py-1.5 text-caption-1-medium text-text-secondary transition-colors hover:bg-background-secondary-hover hover:text-text-primary"
    >
      <span className="truncate">{part.filename ?? part.mediaType}</span>
    </a>
  );
}
