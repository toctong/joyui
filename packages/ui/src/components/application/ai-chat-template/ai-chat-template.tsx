"use client";

import type { ReactNode } from "react";
import { AiChat, type AiChatProps } from "../ai-kit/ai-chat";
import { cx } from "../../../utils/cx";

export type AiChatTemplateProps = AiChatProps & {
  title?: ReactNode;
  description?: ReactNode;
};

/**
 * Full-page AI chat shell: transcript + composer wired to AI SDK `useChat`.
 */
export function AiChatTemplate({
  title = "AI 对话",
  description = "内置 useChat · 可换 TipTap Composer",
  className,
  ...chatProps
}: AiChatTemplateProps) {
  return (
    <div
      className={cx(
        "flex h-full min-h-[560px] w-full flex-col overflow-hidden rounded-[20px] border border-border-button-default bg-background-primary-default shadow-xs",
        className,
      )}
    >
      <header className="flex shrink-0 flex-col gap-0.5 border-b border-separator-border px-5 py-4">
        <h2 className="text-title-2-medium text-text-primary">{title}</h2>
        {description ? (
          <p className="text-body-2-regular text-text-secondary">{description}</p>
        ) : null}
      </header>
      <AiChat
        className="min-h-0 flex-1 border-0 bg-transparent shadow-none"
        emptyTitle="开始提问"
        emptyLabel="试试下面的建议，或直接输入。"
        {...chatProps}
      />
    </div>
  );
}
