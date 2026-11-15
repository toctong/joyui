"use client";

import { useMemo, useRef, useState } from "react";
import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowUpLine,
  RiFolder3Line,
  RiGitBranchLine,
  RiMicLine,
  RiRefreshLine,
  RiSearchLine,
  RiStopFill,
} from "@remixicon/react";
import {
  Dropdown,
  DropdownPopover,
  DropdownTrigger,
} from "../../base/dropdown/dropdown";
import { cx } from "../../../utils/cx";
import {
  ComposerAttachmentStrip,
  type ComposerAttachment,
} from "./composer-attachment-strip";
import {
  ComposerRichInput,
  type ComposerRichInputHandle,
  type MentionItem,
} from "./composer-rich-input";
import { ProviderIcon, type ProviderId } from "./provider-icons";

type PanelModel = {
  id: string;
  name: string;
  provider: ProviderId;
  badge?: string;
};

const PROVIDERS: { id: ProviderId; label: string }[] = [
  { id: "openai", label: "OpenAI" },
  { id: "anthropic", label: "Anthropic" },
  { id: "google", label: "Google" },
  { id: "xai", label: "xAI" },
  { id: "meta", label: "Meta" },
  { id: "mistral", label: "Mistral" },
];

const MODELS: PanelModel[] = [
  { id: "gpt-5.6-mini", name: "GPT-5.6 Mini", provider: "openai", badge: "中" },
  { id: "gpt-5.6-terra", name: "GPT-5.6 Terra", provider: "openai" },
  { id: "gpt-5.6-sol", name: "GPT-5.6 Sol", provider: "openai" },
  { id: "gpt-5.5", name: "GPT-5.5", provider: "openai" },
  { id: "gpt-5.5-mini", name: "GPT-5.5 Mini", provider: "openai" },
  { id: "gpt-5.4", name: "GPT-5.4", provider: "openai" },
  { id: "sonnet-4", name: "Sonnet 4", provider: "anthropic" },
  { id: "opus-4", name: "Opus 4", provider: "anthropic" },
  { id: "gemini-2.5", name: "Gemini 2.5", provider: "google" },
];

/**
 * Style B — card panel: hanging status pills, multiline TipTap prompt,
 * permission chip, and a two-pane model menu (provider rail + searchable list).
 */
export function ComposerPanel({
  className,
  defaultModelId = "gpt-5.6-mini",
  defaultMenuOpen = false,
  placeholder = "你好，今天需要什么？",
  branch = "主要",
  project = "项目海",
  modeLabel = "绕过所有",
  contextPct = 57,
  attachments,
  onRemoveAttachment,
  mentions,
  busy = false,
  onSubmit,
  onStop,
  onAttachPress,
  onMicPress,
}: {
  className?: string;
  defaultModelId?: string;
  defaultMenuOpen?: boolean;
  placeholder?: string;
  branch?: string;
  project?: string;
  modeLabel?: string;
  contextPct?: number;
  attachments?: ComposerAttachment[];
  onRemoveAttachment?: (id: string) => void;
  mentions?: MentionItem[];
  /** Streaming / submitted — send becomes stop. */
  busy?: boolean;
  onSubmit?: (text: string) => void;
  onStop?: () => void;
  onAttachPress?: () => void;
  onMicPress?: () => void;
}) {
  const inputRef = useRef<ComposerRichInputHandle>(null);
  const [modelId, setModelId] = useState(defaultModelId);
  const [provider, setProvider] = useState<ProviderId>("openai");
  const [menuOpen, setMenuOpen] = useState(defaultMenuOpen);
  const [query, setQuery] = useState("");
  const [empty, setEmpty] = useState(true);
  const [focused, setFocused] = useState(false);
  const [listening, setListening] = useState(false);

  const model = MODELS.find((m) => m.id === modelId) ?? MODELS[0];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MODELS.filter(
      (m) =>
        m.provider === provider &&
        (!q || m.name.toLowerCase().includes(q)),
    );
  }, [provider, query]);

  const submit = () => {
    if (busy) {
      onStop?.();
      return;
    }
    const text = inputRef.current?.getText().trim() ?? "";
    if (!text) return;
    onSubmit?.(text);
    inputRef.current?.clear();
    setEmpty(true);
  };

  const toggleMic = () => {
    setListening((prev) => !prev);
    onMicPress?.();
    if (!listening) inputRef.current?.focus();
  };

  return (
    <div className={cx("relative w-full max-w-xl pt-4", className)}>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center gap-1.5">
        <StatusPill icon={RiGitBranchLine} label={branch} />
        <StatusPill icon={RiFolder3Line} label={project} />
        <ContextPill value={contextPct} />
      </div>

      <div
        className={cx(
          "rounded-[24px] bg-background-primary-default p-3.5 pt-6 shadow-xs",
          "ring-1 ring-border-button-default/60",
          "transition-[box-shadow,ring-color] duration-200 ease-out",
          "hover:shadow-sm hover:ring-border-button-default/85",
          focused &&
            "shadow-md ring-2 ring-border-focus-ring/50 hover:ring-border-focus-ring/50",
        )}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setFocused(false);
          }
        }}
      >
        {attachments && attachments.length > 0 ? (
          <ComposerAttachmentStrip
            attachments={attachments}
            onRemove={onRemoveAttachment}
          />
        ) : null}

        <ComposerRichInput
          ref={inputRef}
          placeholder={placeholder}
          mentions={mentions}
          className="mb-3"
          onSubmit={submit}
          onEmptyChange={setEmpty}
        />

        <div
          className="flex items-center justify-between gap-2"
          role="toolbar"
          aria-label="AI 输入工具栏"
        >
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              aria-label="添加附件"
              onClick={onAttachPress}
              className={cx(
                "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full",
                "bg-ai-chat-composer-add-background text-foreground-icon-primary",
                "transition-[background-color,transform] duration-150",
                "hover:bg-ai-chat-composer-add-hover-background active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              )}
            >
              <RiAddLine className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              className={cx(
                "inline-flex max-w-[14ch] items-center gap-1.5 rounded-full px-2.5 py-1.5",
                "bg-background-tertiary-default text-body-2-medium text-text-secondary",
                "transition-colors duration-150 hover:bg-background-secondary-hover hover:text-text-primary",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              )}
            >
              <RiRefreshLine className="size-3.5 shrink-0" aria-hidden />
              <span className="truncate">{modeLabel}</span>
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Dropdown isOpen={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownTrigger
                aria-label="选择模型"
                className={cx(
                  "inline-flex h-8 max-w-[11rem] cursor-pointer items-center gap-0.5 rounded-full px-2.5",
                  "text-body-2-medium text-text-secondary outline-none",
                  "transition-colors duration-150",
                  "hover:bg-background-secondary-default hover:text-text-primary",
                  "focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  menuOpen && "bg-background-secondary-default text-text-primary",
                )}
              >
                <span className="truncate">{model?.name}</span>
                <RiArrowDownSLine
                  className={cx(
                    "size-4 shrink-0 transition-transform duration-200",
                    menuOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </DropdownTrigger>
              <DropdownPopover
                aria-label="型号"
                placement="top end"
                offset={12}
                className="w-[320px] overflow-hidden rounded-2xl p-0 shadow-lg"
                dialogClassName="gap-0"
              >
                <div className="flex min-h-[300px]">
                  <aside
                    aria-label="提供商"
                    className="flex w-12 shrink-0 flex-col items-center gap-1 border-e border-separator-border bg-background-secondary-default py-2.5"
                  >
                    {PROVIDERS.map((p) => {
                      const active = p.id === provider;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          title={p.label}
                          aria-label={p.label}
                          aria-pressed={active}
                          onClick={() => setProvider(p.id)}
                          className={cx(
                            "flex size-8 cursor-pointer items-center justify-center rounded-lg outline-none transition-colors",
                            active
                              ? "bg-background-primary-default text-text-primary shadow-xs"
                              : "text-foreground-icon-tertiary hover:bg-background-secondary-hover hover:text-text-secondary",
                          )}
                        >
                          <ProviderIcon id={p.id} />
                        </button>
                      );
                    })}
                  </aside>

                  <div className="flex min-w-0 flex-1 flex-col p-2.5">
                    <div className="mb-2 flex items-center justify-between gap-2 px-1">
                      <span className="text-caption-1-medium text-text-tertiary">
                        型号
                      </span>
                      <label className="inline-flex items-center gap-1 text-caption-1-medium text-text-tertiary">
                        <RiSearchLine className="size-3.5" aria-hidden />
                        <input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="快速搜索"
                          className="w-[4.5rem] bg-transparent outline-none placeholder:text-text-tertiary"
                        />
                      </label>
                    </div>

                    <ul className="flex flex-col gap-0.5" role="listbox">
                      {filtered.length === 0 ? (
                        <li className="px-2 py-3 text-body-2-medium text-text-tertiary">
                          无匹配型号
                        </li>
                      ) : (
                        filtered.map((item) => {
                          const selected = item.id === modelId;
                          return (
                            <li key={item.id}>
                              <button
                                type="button"
                                role="option"
                                aria-selected={selected}
                                onClick={() => setModelId(item.id)}
                                className={cx(
                                  "flex w-full cursor-pointer items-center gap-2.5 rounded-2lg px-2 py-2 text-start outline-none transition-colors",
                                  selected
                                    ? "bg-background-secondary-hover"
                                    : "hover:bg-background-secondary-hover/70",
                                )}
                              >
                                <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
                                  <ProviderIcon
                                    id={item.provider}
                                    className="size-3.5"
                                  />
                                </span>
                                <span className="min-w-0 flex-1 truncate text-body-medium text-text-primary">
                                  {item.name}
                                </span>
                                {item.badge ? (
                                  <span className="rounded-md bg-background-tertiary-default px-1.5 py-0.5 text-caption-1-medium text-text-secondary">
                                    {item.badge} ›
                                  </span>
                                ) : null}
                                <span
                                  className={cx(
                                    "inline-flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                                    selected
                                      ? "border-accent-500"
                                      : "border-border-button-default",
                                  )}
                                  aria-hidden
                                >
                                  {selected ? (
                                    <span className="size-2 rounded-full bg-accent-500" />
                                  ) : null}
                                </span>
                              </button>
                            </li>
                          );
                        })
                      )}
                    </ul>
                  </div>
                </div>
              </DropdownPopover>
            </Dropdown>

            <button
              type="button"
              aria-label={listening ? "停止语音输入" : "语音输入"}
              aria-pressed={listening}
              onClick={toggleMic}
              className={cx(
                "flex size-9 cursor-pointer items-center justify-center rounded-full",
                "transition-[background-color,color,transform] duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                "active:scale-95",
                listening
                  ? "bg-accent-500/12 text-accent-500 hover:bg-accent-500/18"
                  : "text-foreground-icon-secondary hover:bg-background-secondary-default hover:text-foreground-icon-primary",
              )}
            >
              {listening ? (
                <span className="flex h-4 items-end gap-[3px]" aria-hidden>
                  {[0.35, 0.55, 0.85, 0.5].map((delay, i) => (
                    <span
                      key={i}
                      className="bui-composer-mic-bar w-[2.5px] origin-bottom rounded-full bg-current"
                      style={{
                        height: 14,
                        animationDelay: `${delay}s`,
                        animationDuration: `${0.75 + i * 0.08}s`,
                      }}
                    />
                  ))}
                </span>
              ) : (
                <RiMicLine className="size-5" aria-hidden />
              )}
            </button>
            <button
              type="button"
              aria-label={busy ? "停止生成" : "发送"}
              onClick={submit}
              disabled={!busy && empty}
              className={cx(
                "flex size-9 items-center justify-center rounded-full",
                "transition-[background-color,color,transform,box-shadow,opacity] duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                busy
                  ? "cursor-pointer bg-button-primary text-white shadow-xs hover:opacity-90 active:scale-95"
                  : empty
                    ? "cursor-not-allowed bg-background-tertiary-default text-foreground-icon-quaternary"
                    : "cursor-pointer bg-button-primary text-white shadow-xs hover:opacity-90 active:scale-95",
              )}
            >
              {busy ? (
                <RiStopFill className="size-4" aria-hidden />
              ) : (
                <RiArrowUpLine className="size-5" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({
  icon: Icon,
  label,
}: {
  icon: typeof RiGitBranchLine;
  label: string;
}) {
  return (
    <span
      className={cx(
        "pointer-events-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1",
        "border border-border-button-default/80 bg-background-primary-default",
        "text-caption-1-medium text-text-secondary shadow-xs",
        "transition-[box-shadow,transform] duration-150",
        "hover:-translate-y-px hover:shadow-sm",
      )}
    >
      <Icon className="size-3.5 text-foreground-icon-secondary" aria-hidden />
      {label}
    </span>
  );
}

function ContextPill({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = 5.5;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - clamped / 100);

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-border-button-default bg-background-primary-default px-2.5 py-1 text-caption-1-medium text-text-secondary shadow-xs tabular-nums"
      title={`上下文 ${clamped}%`}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
        <circle
          cx="7"
          cy="7"
          r={r}
          fill="none"
          stroke="var(--color-border-button-default)"
          strokeWidth="1.75"
        />
        <circle
          cx="7"
          cy="7"
          r={r}
          fill="none"
          stroke="var(--color-accent-500)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform="rotate(-90 7 7)"
        />
      </svg>
      {clamped}%
    </span>
  );
}
