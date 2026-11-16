"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  RiAddLine,
  RiChat3Line,
  RiDeleteBinLine,
  RiMore2Fill,
  RiSearchLine,
  RiSideBarLine,
} from "@remixicon/react";
import { cx } from "../../../utils/cx";
import { IconButton } from "../../base/buttons/icon-button";
import { Button } from "../../base/buttons/button";
import { AiChat, type AiChatProps } from "../ai-kit/ai-chat";

export type AiAssistantThread = {
  id: string;
  title: string;
  preview?: string;
  updatedAt?: string;
};

export type AiAssistantTemplateProps = Omit<AiChatProps, "children"> & {
  title?: ReactNode;
  threads?: AiAssistantThread[];
  activeThreadId?: string;
  defaultActiveThreadId?: string;
  onActiveThreadChange?: (id: string) => void;
  onNewThread?: () => void;
  onDeleteThread?: (id: string) => void;
  sidebarOpen?: boolean;
  defaultSidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  sidebarHeader?: ReactNode;
  sidebarFooter?: ReactNode;
  headerActions?: ReactNode;
};

const DEMO_THREADS: AiAssistantThread[] = [
  {
    id: "t1",
    title: "产品发布文案",
    preview: "帮我写三段发布说明…",
    updatedAt: "今天",
  },
  {
    id: "t2",
    title: "报错排查",
    preview: "TypeError: Cannot read…",
    updatedAt: "昨天",
  },
  {
    id: "t3",
    title: "周会纪要",
    preview: "把录音整理成要点…",
    updatedAt: "周一",
  },
];

/**
 * ChatGPT / vercel/chatbot style assistant shell:
 * collapsible thread rail + AiChat main pane.
 */
export function AiAssistantTemplate({
  title = "AI 助手",
  threads: threadsProp,
  activeThreadId: activeProp,
  defaultActiveThreadId,
  onActiveThreadChange,
  onNewThread,
  onDeleteThread,
  sidebarOpen: sidebarOpenProp,
  defaultSidebarOpen = true,
  onSidebarOpenChange,
  sidebarHeader,
  sidebarFooter,
  headerActions,
  className,
  ...chatProps
}: AiAssistantTemplateProps) {
  const [threadsLocal] = useState(DEMO_THREADS);
  const threads = threadsProp ?? threadsLocal;
  const [activeLocal, setActiveLocal] = useState(
    defaultActiveThreadId ?? threads[0]?.id ?? "t1",
  );
  const [sidebarLocal, setSidebarLocal] = useState(defaultSidebarOpen);
  const [query, setQuery] = useState("");

  const activeId = activeProp ?? activeLocal;
  const setActive = (id: string) => {
    if (activeProp === undefined) setActiveLocal(id);
    onActiveThreadChange?.(id);
  };

  const sidebarOpen = sidebarOpenProp ?? sidebarLocal;
  const setSidebarOpen = (open: boolean) => {
    if (sidebarOpenProp === undefined) setSidebarLocal(open);
    onSidebarOpenChange?.(open);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.preview?.toLowerCase().includes(q) ?? false),
    );
  }, [threads, query]);

  const active = threads.find((t) => t.id === activeId);

  return (
    <div
      className={cx(
        "flex h-full min-h-[640px] w-full overflow-hidden rounded-[20px] border border-border-secondary-default bg-background-primary-default shadow-xs",
        className,
      )}
    >
      {sidebarOpen ? (
        <aside className="flex w-[min(100%,17.5rem)] shrink-0 flex-col border-e border-separator-border bg-background-secondary-default/35">
          <div className="flex items-center justify-between gap-2 px-3 py-3">
            {sidebarHeader ?? (
              <p className="truncate text-body-medium text-text-primary">
                {title}
              </p>
            )}
            <IconButton
              aria-label="收起侧栏"
              icon={RiSideBarLine}
              size="small"
              onClick={() => setSidebarOpen(false)}
            />
          </div>

          <div className="px-3 pb-2">
            <Button
              variant="secondary"
              size="small"
              leadingIcon={RiAddLine}
              className="w-full justify-start"
              onClick={() => {
                onNewThread?.();
                if (!threadsProp) {
                  /* demo: just focus first */
                  setActive(threads[0]?.id ?? "t1");
                }
              }}
            >
              新对话
            </Button>
          </div>

          <label className="mx-3 mb-2 flex items-center gap-2 rounded-2lg bg-background-primary-default px-2.5 py-1.5 ring-1 ring-inset ring-separator-border">
            <RiSearchLine
              className="size-3.5 shrink-0 text-foreground-icon-tertiary"
              aria-hidden
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索对话"
              className="min-w-0 flex-1 bg-transparent text-caption-1-regular text-text-primary outline-none placeholder:text-text-tertiary"
            />
          </label>

          <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
            {filtered.length === 0 ? (
              <p className="px-2 py-6 text-center text-caption-1-regular text-text-tertiary">
                没有匹配的对话
              </p>
            ) : (
              filtered.map((thread) => {
                const selected = thread.id === activeId;
                return (
                  <div
                    key={thread.id}
                    className={cx(
                      "group flex items-start gap-1 rounded-2lg px-2 py-2 transition-colors",
                      selected
                        ? "bg-background-secondary-hover"
                        : "hover:bg-background-secondary-hover/70",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setActive(thread.id)}
                      className="min-w-0 flex-1 text-start outline-none"
                    >
                      <span className="flex items-center gap-1.5">
                        <RiChat3Line
                          className="size-3.5 shrink-0 text-foreground-icon-tertiary"
                          aria-hidden
                        />
                        <span className="truncate text-caption-1-medium text-text-primary">
                          {thread.title}
                        </span>
                      </span>
                      {thread.preview ? (
                        <span className="mt-0.5 line-clamp-1 ps-5 text-caption-2-regular text-text-tertiary">
                          {thread.preview}
                        </span>
                      ) : null}
                    </button>
                    <IconButton
                      aria-label="删除对话"
                      icon={RiDeleteBinLine}
                      size="small"
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => onDeleteThread?.(thread.id)}
                    />
                  </div>
                );
              })
            )}
          </div>

          {sidebarFooter ? (
            <div className="border-t border-separator-border px-3 py-2">
              {sidebarFooter}
            </div>
          ) : null}
        </aside>
      ) : null}

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-separator-border px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            {!sidebarOpen ? (
              <IconButton
                aria-label="打开侧栏"
                icon={RiSideBarLine}
                size="small"
                onClick={() => setSidebarOpen(true)}
              />
            ) : null}
            <div className="min-w-0">
              <h2 className="truncate text-title-3-medium text-text-primary">
                {active?.title ?? title}
              </h2>
              {active?.updatedAt ? (
                <p className="text-caption-1-regular text-text-tertiary">
                  {active.updatedAt}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {headerActions}
            <IconButton aria-label="更多" icon={RiMore2Fill} size="small" />
          </div>
        </header>

        <AiChat
          key={activeId}
          className="min-h-0 flex-1 border-0 bg-transparent px-4 py-4 shadow-none"
          emptyTitle="开始新对话"
          emptyLabel="从侧栏新建，或直接输入问题。"
          {...chatProps}
        />
      </section>
    </div>
  );
}
