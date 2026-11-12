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
} from "@remixicon/react";
import {
  Dropdown,
  DropdownPopover,
  DropdownTrigger,
} from "@/components/base/dropdown/dropdown";
import {
  ComposerRichInput,
  type ComposerRichInputHandle,
} from "@/components/application/composer-panel/composer-rich-input";
import { cx } from "@/utils/cx";
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
 * Style A — pill composer: single-row prompt with + / model / mic / send,
 * status row underneath (branch · project · agent · context), and a compact
 * model menu with radio list + liquid effort slider.
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
  defaultModelMenuOpen = true,
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
  /** Docs preview opens the model menu by default to match the reference. */
  defaultModelMenuOpen?: boolean;
}) {
  const inputRef = useRef<ComposerRichInputHandle>(null);
  const [modelId, setModelId] = useState(defaultModelId);
  const [effort, setEffort] = useState<EffortLevel>(defaultEffort);
  const [menuOpen, setMenuOpen] = useState(defaultModelMenuOpen);

  const model = models.find((m) => m.id === modelId) ?? models[0];
  const effortLabel = EFFORT_LEVELS[effort]?.label ?? "最大";

  const submit = () => {
    const text = inputRef.current?.getText().trim() ?? "";
    if (!text) return;
    inputRef.current?.clear();
  };

  return (
    <div className={cx("relative w-full max-w-xl", className)}>
      <div className="flex w-full flex-col gap-2.5">
        <form
          className={cx(
            "flex h-[52px] w-full items-center gap-2 rounded-full p-2",
            "bg-background-primary-default shadow-xs",
            "ring-1 ring-border-button-default/60",
          )}
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <button
            type="button"
            aria-label="添加附件"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-ai-chat-composer-add-background text-foreground-icon-primary transition-colors hover:bg-ai-chat-composer-add-hover-background"
          >
            <RiAddLine className="size-5" aria-hidden />
          </button>

          <ComposerRichInput
            ref={inputRef}
            placeholder={placeholder}
            className={cx(
              "min-w-0 flex-1 overflow-hidden",
              "[&_[role=textbox]]:max-h-5 [&_[role=textbox]]:min-h-5",
              "[&_[role=textbox]]:overflow-hidden [&_p]:truncate",
            )}
            onSubmit={submit}
          />

          <Dropdown isOpen={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownTrigger
              aria-label="选择模型"
              className={cx(
                "inline-flex h-8 shrink-0 cursor-pointer items-center gap-1 rounded-xl px-2",
                "text-body-2-medium text-text-secondary outline-none",
                "hover:bg-background-secondary-default",
                "focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              )}
            >
              <span className="max-w-[12ch] truncate">{model?.name}</span>
              <RiArrowDownSLine
                className={cx(
                  "size-4 text-foreground-icon-tertiary transition-transform",
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

          <button
            type="button"
            aria-label="语音输入"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground-icon-secondary transition-colors hover:bg-background-secondary-default"
          >
            <RiMicLine className="size-5" aria-hidden />
          </button>

          <button
            type="submit"
            aria-label="发送"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-button-primary text-white shadow-xs"
          >
            <RiArrowUpLine className="size-5" aria-hidden />
          </button>
        </form>

        {/* Status lives under the pill — part of this style, not hanging pills */}
        <div className="flex h-[26px] w-full items-center justify-between gap-3 px-1">
          <div className="flex min-w-0 items-center gap-3">
            <StatusChip icon={RiGitBranchLine} label={branch} />
            <StatusChip icon={RiFolder3Line} label={project} chevron />
          </div>
          <div className="flex shrink-0 items-center gap-3">
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
    <span className="inline-flex max-w-[12ch] items-center gap-1 text-body-2-medium text-text-secondary">
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
    </span>
  );
}

function ContextMeter({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = 7;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - clamped / 100);

  return (
    <span
      className="inline-flex items-center gap-1.5 text-body-2-medium text-text-secondary tabular-nums"
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
          transform="rotate(-90 9 9)"
        />
      </svg>
      {clamped}%
    </span>
  );
}
