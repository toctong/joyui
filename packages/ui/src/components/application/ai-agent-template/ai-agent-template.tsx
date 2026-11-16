"use client";

import { useState, type ReactNode } from "react";
import {
  RiCheckboxCircleLine,
  RiCpuLine,
  RiFileList3Line,
  RiSparklingLine,
  RiTerminalBoxLine,
} from "@remixicon/react";
import { cx } from "../../../utils/cx";
import { IconButton } from "../../base/buttons/icon-button";
import { AiComposer } from "../ai-kit/ai-composer";
import { ChatMessage } from "../chat-message/chat-message";
import { ReasoningBlock } from "../reasoning-block/reasoning-block";
import { ToolCall } from "../tool-call/tool-call";
import { AgentThinking } from "../agent-thinking/agent-thinking";
import { LogRow, WorkingRow, useLogMotion } from "../agent-log/agent-log";
import { PromptSuggestions } from "../../base/prompt-suggestions/prompt-suggestions";

export type AiAgentMessage = {
  id: string;
  role: "user" | "assistant";
  content: ReactNode;
};

export type AiAgentTemplateProps = {
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
  messages?: AiAgentMessage[];
  busy?: boolean;
  onSubmit?: (prompt: string) => void;
  onStop?: () => void;
  suggestions?: string[];
  /** Replace the default demo transcript. */
  children?: ReactNode;
  panelTitle?: ReactNode;
  panel?: ReactNode;
  headerActions?: ReactNode;
  placeholder?: string;
};

const DEMO_MESSAGES: AiAgentMessage[] = [
  {
    id: "u1",
    role: "user",
    content: "查一下 packages/ui 里 ImageGeneration 的导出，并总结用法。",
  },
  {
    id: "a1",
    role: "assistant",
    content: (
      <div className="flex flex-col gap-3">
        <ReasoningBlock title="规划步骤" status="done" defaultOpen>
          <p className="text-body-2-regular text-text-secondary">
            1) 定位导出入口 → 2) 阅读组件 props → 3) 归纳接入方式
          </p>
        </ReasoningBlock>
        <ToolCall
          name="grep"
          status="done"
          summary="export.*ImageGeneration"
          defaultOpen
        >
          <pre className="overflow-x-auto text-caption-1-regular text-text-secondary">
            {`packages/ui/src/index.ts
→ ImageGeneration  ← ".../image-generation"`}
          </pre>
        </ToolCall>
        <ToolCall name="read_file" status="done" summary="image-generation.tsx">
          <pre className="overflow-x-auto text-caption-1-regular text-text-secondary">
            {`function ImageGeneration(props: ImageGenerationProps) { … }`}
          </pre>
        </ToolCall>
        <p className="text-body-medium text-text-primary">
          ImageGeneration 从 @joyui/react / @joyui/react/ai
          导出。用 onSubmit(prompt, meta) 接生图 API，再回填 messages /
          gallery；画幅走 aspect，风格侧栏可用 styles 自定义。
        </p>
      </div>
    ),
  },
];

/**
 * Agentic workspace (assistant-ui / Cursor-style):
 * transcript with reasoning + tool calls, plus a live agent log rail.
 */
export function AiAgentTemplate({
  className,
  title = "AI Agent",
  description = "推理 · 工具调用 · 任务轨迹",
  messages: messagesProp,
  busy = false,
  onSubmit,
  onStop,
  suggestions = [
    "检查构建错误并给出修复步骤",
    "为 MediaStudio 写一段接入文档",
    "列出可扩展的 AI 模板",
  ],
  children,
  panelTitle = "运行轨迹",
  panel,
  headerActions,
  placeholder = "描述任务，Agent 会拆解并调用工具…",
}: AiAgentTemplateProps) {
  const reduceMotion = useLogMotion();
  const [demoMessages, setDemoMessages] = useState(DEMO_MESSAGES);
  const messages = messagesProp ?? demoMessages;
  const controlled = messagesProp !== undefined;

  const submit = (text: string) => {
    const prompt = text.trim();
    if (!prompt || busy) return;
    onSubmit?.(prompt);
    if (controlled) return;
    const id = `local-${Date.now()}`;
    setDemoMessages((prev) => [
      ...prev,
      { id: `${id}-u`, role: "user", content: prompt },
      {
        id: `${id}-a`,
        role: "assistant",
        content: (
          <div className="flex flex-col gap-3">
            <AgentThinking variant="wave" label="拆解任务" />
            <p className="text-body-medium text-text-secondary">
              演示模式：接上 `onSubmit` 后由你的 Agent 后端流式回填消息。
            </p>
          </div>
        ),
      },
    ]);
  };

  return (
    <div
      className={cx(
        "flex h-full min-h-[640px] w-full overflow-hidden rounded-[20px] border border-border-secondary-default bg-background-primary-default shadow-xs",
        className,
      )}
    >
      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-separator-border px-4 py-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-2lg bg-accent-500/12 text-accent-600 dark:text-accent-300">
                <RiCpuLine className="size-4" aria-hidden />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-title-3-medium text-text-primary">
                  {title}
                </h2>
                {description ? (
                  <p className="truncate text-caption-1-regular text-text-tertiary">
                    {description}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">{headerActions}</div>
        </header>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5">
          {children ??
            (messages.length === 0 ? (
              <div className="flex h-full min-h-48 flex-col items-center justify-center gap-4 text-center">
                <span className="grid size-14 place-items-center rounded-2xl bg-background-secondary-default text-foreground-icon-secondary">
                  <RiSparklingLine className="size-6" aria-hidden />
                </span>
                <div className="space-y-1">
                  <p className="text-title-3-medium text-text-primary">
                    交给 Agent 处理
                  </p>
                  <p className="max-w-md text-body-medium text-text-secondary">
                    支持推理块、工具调用与侧栏任务轨迹，适合接 LangGraph /
                    AI SDK tools。
                  </p>
                </div>
                <PromptSuggestions
                  className="max-w-xl items-center"
                  label="试试这些"
                  suggestions={suggestions}
                  onSelect={submit}
                />
              </div>
            ) : (
              messages.map((message) => (
                <ChatMessage key={message.id} role={message.role}>
                  {message.content}
                </ChatMessage>
              ))
            ))}
          {busy ? (
            <div className="max-w-xl rounded-2xl border border-separator-border bg-background-secondary-default/50 px-3 py-4">
              <AgentThinking variant="stars" label="Agent 工作中" />
            </div>
          ) : null}
        </div>

        <div className="shrink-0 px-4 pb-4 pt-1">
          <AiComposer
            busy={busy}
            placeholder={placeholder}
            onSubmit={submit}
            onStop={onStop}
          />
        </div>
      </section>

      <aside className="hidden w-[min(36%,18rem)] shrink-0 flex-col border-s border-separator-border bg-background-secondary-default/35 md:flex">
        <div className="flex items-center justify-between gap-2 border-b border-separator-border px-3 py-2.5">
          <p className="inline-flex items-center gap-1.5 text-caption-1-medium text-text-primary">
            <RiFileList3Line className="size-3.5" aria-hidden />
            {panelTitle}
          </p>
          <IconButton
            aria-label="终端"
            icon={RiTerminalBoxLine}
            size="small"
          />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {panel ?? (
            <ul className="space-y-0">
              <LogRow first last={false} reduce={reduceMotion}>
                <span className="inline-flex items-center gap-1.5 text-caption-1-regular text-text-secondary">
                  <RiCheckboxCircleLine
                    className="size-3.5 text-status-lime-text"
                    aria-hidden
                  />
                  已定位 ImageGeneration 导出
                </span>
              </LogRow>
              <LogRow first={false} last={false} reduce={reduceMotion}>
                <span className="inline-flex items-center gap-1.5 text-caption-1-regular text-text-secondary">
                  <RiCheckboxCircleLine
                    className="size-3.5 text-status-lime-text"
                    aria-hidden
                  />
                  已读取组件 props 与用法
                </span>
              </LogRow>
              <LogRow first={false} last={!busy} reduce={reduceMotion}>
                <span className="inline-flex items-center gap-1.5 text-caption-1-regular text-text-secondary">
                  <RiCheckboxCircleLine
                    className="size-3.5 text-status-lime-text"
                    aria-hidden
                  />
                  已生成用法摘要
                </span>
              </LogRow>
              {busy ? (
                <WorkingRow label="等待下一工具结果…" reduce={reduceMotion} />
              ) : null}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}
