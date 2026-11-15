"use client";

import { useRef, useState } from "react";
import {
  RiAddLine,
  RiArrowUpLine,
  RiArrowDownSLine,
  RiFolder3Line,
  RiGitBranchLine,
  RiInfinityLine,
  RiMicLine,
  RiStopFill,
} from "@remixicon/react";
import {
  Dropdown,
  DropdownPopover,
  DropdownTrigger,
} from "../../base/dropdown/dropdown";
import { VoiceRing } from "../../base/voice-ring/voice-ring";
import {
  ComposerRichInput,
  type ComposerRichInputHandle,
} from "../composer-panel/composer-rich-input";
import { cx } from "../../../utils/cx";
import {
  EFFORT_LEVELS,
  EffortSlider,
  type EffortLevel,
} from "./effort-slider";

export type ComposerModel = {
  id: string;
  name: string;
};

const DEFAULT_MODELS: ComposerModel[] = [
  { id: "composer-2.5", name: "Composer 2.5" },
  { id: "gpt-5.6-sol", name: "GPT-5.6 Sol" },
  { id: "fable-5", name: "Fable 5" },
  { id: "sonnet-5", name: "Sonnet 5" },
];

/**
 * Style A — soft pill composer: grows with the prompt, focus ring lifts the
 * shell, send wakes only when there is text, mic can flip into a listening
 * equalizer. Status row stays underneath (branch · project · agent · context).
 */
export function Composer({
  models = DEFAULT_MODELS,
  defaultModelId = "fable-5",
  defaultEffort = 5,
  placeholder = "有什么问题就问我",
  branch = "主要",
  project = "项目海",
  agentMode = "智能体",
  contextPct = 57,
  className,
  defaultModelMenuOpen = false,
  busy = false,
  onSubmit,
  onStop,
  onAttachPress,
  onMicPress,
}: {
  models?: ComposerModel[];
  defaultModelId?: string;
  defaultEffort?: EffortLevel;
  placeholder?: string;
  branch?: string;
  project?: string;
  agentMode?: string;
  contextPct?: number;
  className?: string;
  /** Docs can open the model menu to showcase it; product default is closed. */
  defaultModelMenuOpen?: boolean;
  /** When true, the primary control becomes Stop (AI SDK streaming). */
  busy?: boolean;
  onSubmit?: (text: string) => void;
  onStop?: () => void;
  onAttachPress?: () => void;
  onMicPress?: () => void;
}) {
  const inputRef = useRef<ComposerRichInputHandle>(null);
  const [modelId, setModelId] = useState(defaultModelId);
  const [effort, setEffort] = useState<EffortLevel>(defaultEffort);
  const [menuOpen, setMenuOpen] = useState(defaultModelMenuOpen);
  const [empty, setEmpty] = useState(true);
  const [focused, setFocused] = useState(false);
  const [listening, setListening] = useState(false);

  const model = models.find((m) => m.id === modelId) ?? models[0];
  const effortLabel = EFFORT_LEVELS[effort]?.label ?? "最大";
  const expanded = focused || !empty || listening;

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
    setListening((prev) => {
      const next = !prev;
      onMicPress?.();
      return next;
    });
    if (!listening) inputRef.current?.focus();
  };

  return (
    <div className={cx("relative w-full max-w-xl", className)}>
      <div className="flex w-full flex-col gap-2.5">
        <form
          className={cx(
            "group/composer flex w-full items-end gap-1.5 p-2",
            "bg-background-primary-default transition-[border-radius,box-shadow,ring-color] duration-200 ease-out",
            expanded ? "rounded-[28px]" : "rounded-full",
            "ring-1 ring-border-button-default/55 shadow-xs",
            "hover:shadow-sm hover:ring-border-button-default/80",
            focused &&
              "shadow-md ring-2 ring-border-focus-ring/55 hover:ring-border-focus-ring/55",
          )}
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setFocused(false);
            }
          }}
        >
          <button
            type="button"
            aria-label="添加附件"
            onClick={onAttachPress}
            className={cx(
              "mb-0.5 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full",
              "bg-ai-chat-composer-add-background text-foreground-icon-primary",
              "transition-[background-color,transform] duration-150",
              "hover:bg-ai-chat-composer-add-hover-background active:scale-95",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
            )}
          >
            <RiAddLine className="size-5" aria-hidden />
          </button>

          <ComposerRichInput
            ref={inputRef}
            placeholder={placeholder}
            onEmptyChange={setEmpty}
            onSubmit={submit}
            className={cx(
              "min-w-0 flex-1 self-center py-1",
              "[&_[role=textbox]]:max-h-36 [&_[role=textbox]]:min-h-[22px]",
              "[&_[role=textbox]]:overflow-y-auto [&_[role=textbox]]:px-0.5",
              "[&_p]:leading-6",
            )}
          />

          <div className="mb-0.5 flex shrink-0 items-center gap-0.5">
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
                    "size-4 shrink-0 text-foreground-icon-tertiary transition-transform duration-200",
                    menuOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </DropdownTrigger>
              <DropdownPopover
                aria-label="型号"
                placement="top end"
                offset={10}
                className="w-[268px] rounded-2xl p-1.5 shadow-lg"
                dialogClassName="gap-0"
              >
                <p className="px-2 pb-1 pt-0.5 text-caption-1-medium text-text-tertiary">
                  型号
                </p>
                <ul className="flex flex-col gap-0.5" role="listbox">
                  {models.map((item) => {
                    const selected = item.id === modelId;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => setModelId(item.id)}
                          className={cx(
                            "flex w-full cursor-pointer items-center gap-2.5 rounded-2lg px-2.5 py-2 text-start",
                            "text-body-medium outline-none transition-colors",
                            selected
                              ? "bg-background-secondary-hover text-text-primary"
                              : "text-text-secondary hover:bg-background-secondary-hover/70",
                          )}
                        >
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
                          {item.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-1.5 border-t border-separator-border px-1.5 pt-3 pb-1">
                  <div className="mb-2 flex items-center justify-between px-0.5">
                    <span className="text-caption-1-medium text-text-tertiary">
                      努力
                    </span>
                    <span className="text-caption-1-medium text-text-secondary">
                      {effortLabel}
                    </span>
                  </div>
                  <EffortSlider value={effort} onChange={setEffort} />
                </div>
              </DropdownPopover>
            </Dropdown>

            <VoiceRing active={listening}>
              <button
                type="button"
                aria-label={listening ? "停止语音输入" : "语音输入"}
                aria-pressed={listening}
                onClick={toggleMic}
                className={cx(
                  "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full",
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
            </VoiceRing>

            <button
              type="submit"
              aria-label={busy ? "停止生成" : "发送"}
              disabled={!busy && empty}
              className={cx(
                "flex size-9 shrink-0 items-center justify-center rounded-full",
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
        </form>

        <div className="flex h-[26px] w-full items-center justify-between gap-3 px-1">
          <div className="flex min-w-0 items-center gap-1">
            <StatusChip icon={RiGitBranchLine} label={branch} />
            <StatusChip icon={RiFolder3Line} label={project} chevron />
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <StatusChip icon={RiInfinityLine} label={agentMode} chevron />
            <ContextMeter value={contextPct} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusChip({
  icon: Icon,
  label,
  chevron,
}: {
  icon: typeof RiGitBranchLine;
  label: string;
  chevron?: boolean;
}) {
  return (
    <button
      type="button"
      className={cx(
        "inline-flex max-w-[12ch] cursor-pointer items-center gap-1 rounded-full px-1.5 py-0.5",
        "text-body-2-medium text-text-secondary",
        "transition-colors duration-150",
        "hover:bg-background-secondary-default hover:text-text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
      )}
    >
      <Icon
        className="size-4 shrink-0 text-foreground-icon-secondary"
        aria-hidden
      />
      <span className="truncate">{label}</span>
      {chevron ? (
        <RiArrowDownSLine
          className="size-3.5 shrink-0 text-foreground-icon-quaternary"
          aria-hidden
        />
      ) : null}
    </button>
  );
}

function ContextMeter({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = 7;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - clamped / 100);

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-1.5 py-0.5 text-body-2-medium text-text-secondary tabular-nums"
      title={`上下文 ${clamped}%`}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
        <circle
          cx="9"
          cy="9"
          r={r}
          fill="none"
          stroke="var(--color-border-button-default)"
          strokeWidth="2"
        />
        <circle
          cx="9"
          cy="9"
          r={r}
          fill="none"
          stroke="var(--color-accent-500)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
          transform="rotate(-90 9 9)"
        />
      </svg>
      {clamped}%
    </span>
  );
}
