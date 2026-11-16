"use client";

import { useState, type ReactNode } from "react";
import {
  RiFlashlightLine,
  RiPlayFill,
  RiSaveLine,
  RiShareForwardLine,
} from "@remixicon/react";
import { cx } from "../../../utils/cx";
import { Button } from "../../base/buttons/button";
import { IconButton } from "../../base/buttons/icon-button";
import { ModelSelect } from "../../base/model-select/model-select";
import { Slider } from "../../base/slider/slider";
import { Switch } from "../../base/switch/switch";
import { AgentThinking } from "../agent-thinking/agent-thinking";

export type AiPlaygroundModel = {
  id: string;
  label: string;
  description?: string;
};

export type AiPlaygroundValues = {
  modelId: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  systemPrompt: string;
  userPrompt: string;
  stream: boolean;
};

export type AiPlaygroundTemplateProps = {
  className?: string;
  title?: ReactNode;
  description?: ReactNode;
  models?: AiPlaygroundModel[];
  value?: Partial<AiPlaygroundValues>;
  defaultValue?: Partial<AiPlaygroundValues>;
  onChange?: (next: AiPlaygroundValues) => void;
  onRun?: (values: AiPlaygroundValues) => void | Promise<void>;
  /** Simulated or real completion text shown in the output pane. */
  output?: ReactNode;
  busy?: boolean;
  headerActions?: ReactNode;
  settingsExtra?: ReactNode;
};

const DEFAULT_MODELS: AiPlaygroundModel[] = [
  { id: "fast", label: "Fast", description: "低延迟 · 日常草稿" },
  { id: "smart", label: "Smart", description: "更强推理 · 复杂任务" },
  { id: "code", label: "Code", description: "代码与技术写作" },
];

const DEFAULTS: AiPlaygroundValues = {
  modelId: "smart",
  temperature: 0.7,
  maxTokens: 1024,
  topP: 1,
  systemPrompt: "你是简洁、专业的助手。用中文回答，优先给出可执行建议。",
  userPrompt:
    "为 JoyUI 写一段 80 字以内的产品介绍，突出 React Aria 与 Tailwind v4。",
  stream: true,
};

/**
 * OpenAI / shadcn Playground style console:
 * settings rail (model · temp · tokens · system) + prompt / output panes.
 */
export function AiPlaygroundTemplate({
  className,
  title = "AI Playground",
  description = "调参 · 系统提示 · 一键试跑",
  models = DEFAULT_MODELS,
  value,
  defaultValue,
  onChange,
  onRun,
  output,
  busy: busyProp,
  headerActions,
  settingsExtra,
}: AiPlaygroundTemplateProps) {
  const [local, setLocal] = useState<AiPlaygroundValues>({
    ...DEFAULTS,
    ...defaultValue,
  });
  const [busyLocal, setBusyLocal] = useState(false);
  const [demoOutput, setDemoOutput] = useState<string | null>(null);

  const values: AiPlaygroundValues = {
    ...local,
    ...value,
  };

  const patch = (partial: Partial<AiPlaygroundValues>) => {
    const next = { ...values, ...partial };
    if (value === undefined) setLocal(next);
    onChange?.(next);
  };

  const busy = busyProp ?? busyLocal;

  const run = async () => {
    if (busy) return;
    setDemoOutput(null);
    if (onRun) {
      setBusyLocal(true);
      try {
        await onRun(values);
      } finally {
        setBusyLocal(false);
      }
      return;
    }
    setBusyLocal(true);
    await new Promise((r) => setTimeout(r, 900));
    setDemoOutput(
      `【${models.find((m) => m.id === values.modelId)?.label ?? values.modelId} · temp ${values.temperature.toFixed(1)}】\n\nJoyUI 是面向产品与后台的 React 组件库：React Aria 无障碍底座、Tailwind CSS v4 设计令牌，开箱即用的 AI 与数据视图，帮团队更快搭出一致、可扩展的界面。`,
    );
    setBusyLocal(false);
  };

  return (
    <div
      className={cx(
        "flex h-full min-h-[640px] w-full flex-col overflow-hidden rounded-[20px] border border-border-secondary-default bg-background-primary-default shadow-xs",
        className,
      )}
    >
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-separator-border px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-title-2-medium text-text-primary">{title}</h2>
          {description ? (
            <p className="text-body-2-regular text-text-secondary">
              {description}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {headerActions}
          <IconButton aria-label="保存预设" icon={RiSaveLine} size="small" />
          <IconButton
            aria-label="分享"
            icon={RiShareForwardLine}
            size="small"
          />
          <Button
            size="small"
            leadingIcon={RiPlayFill}
            onClick={() => void run()}
            isDisabled={busy || values.userPrompt.trim().length === 0}
          >
            {busy ? "运行中…" : "运行"}
          </Button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_17.5rem]">
        <div className="flex min-h-0 min-w-0 flex-col gap-3 overflow-y-auto p-4">
          <label className="flex min-h-0 flex-1 flex-col gap-1.5">
            <span className="text-caption-1-medium text-text-tertiary">
              用户提示
            </span>
            <textarea
              value={values.userPrompt}
              onChange={(e) => patch({ userPrompt: e.target.value })}
              rows={8}
              className={cx(
                "min-h-40 flex-1 resize-y rounded-2xl border border-separator-border bg-background-secondary-default/40 px-3.5 py-3",
                "text-body-regular text-text-primary outline-none",
                "placeholder:text-text-tertiary",
                "focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              )}
              placeholder="输入要完成的提示词…"
            />
          </label>

          <div className="flex min-h-48 flex-col gap-1.5">
            <span className="text-caption-1-medium text-text-tertiary">
              输出
            </span>
            <div
              className={cx(
                "min-h-48 flex-1 overflow-y-auto rounded-2xl border border-separator-border bg-background-secondary-default/25 px-3.5 py-3",
                "text-body-regular whitespace-pre-wrap text-text-primary",
              )}
            >
              {busy ? (
                <AgentThinking variant="wave" label="生成中" />
              ) : output !== undefined ? (
                output
              ) : demoOutput ? (
                demoOutput
              ) : (
                <span className="text-text-tertiary">
                  运行后结果会出现在这里。接上 `onRun` 即可打你的推理 API。
                </span>
              )}
            </div>
          </div>
        </div>

        <aside className="flex min-h-0 flex-col gap-4 overflow-y-auto border-t border-separator-border bg-background-secondary-default/30 p-4 lg:border-s lg:border-t-0">
          <div className="space-y-2">
            <p className="text-caption-1-medium text-text-tertiary">模型</p>
            <ModelSelect
              aria-label="模型"
              value={values.modelId}
              onChange={(id) => patch({ modelId: id })}
              options={models.map((m) => ({
                id: m.id,
                label: m.label,
                description: m.description,
              }))}
              className="w-full justify-stretch [&>button]:flex-1"
            />
            {models.find((m) => m.id === values.modelId)?.description ? (
              <p className="text-caption-2-regular text-text-tertiary">
                {models.find((m) => m.id === values.modelId)?.description}
              </p>
            ) : null}
          </div>

          <div className="space-y-3">
            <Slider
              label="Temperature"
              minValue={0}
              maxValue={2}
              step={0.1}
              value={values.temperature}
              onChange={(v) =>
                patch({ temperature: typeof v === "number" ? v : v[0] })
              }
              formatValue={(v) => v.toFixed(1)}
            />
            <Slider
              label="Max tokens"
              minValue={64}
              maxValue={4096}
              step={64}
              value={values.maxTokens}
              onChange={(v) =>
                patch({ maxTokens: typeof v === "number" ? v : v[0] })
              }
            />
            <Slider
              label="Top P"
              minValue={0}
              maxValue={1}
              step={0.05}
              value={values.topP}
              onChange={(v) =>
                patch({ topP: typeof v === "number" ? v : v[0] })
              }
              formatValue={(v) => v.toFixed(2)}
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 text-caption-1-medium text-text-secondary">
              <RiFlashlightLine className="size-3.5" aria-hidden />
              流式输出
            </span>
            <Switch
              aria-label="流式输出"
              isSelected={values.stream}
              onChange={(stream) => patch({ stream })}
            />
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-caption-1-medium text-text-tertiary">
              系统提示
            </span>
            <textarea
              value={values.systemPrompt}
              onChange={(e) => patch({ systemPrompt: e.target.value })}
              rows={6}
              className={cx(
                "resize-y rounded-2xl border border-separator-border bg-background-primary-default px-3 py-2.5",
                "text-caption-1-regular text-text-primary outline-none",
                "focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              )}
            />
          </label>

          {settingsExtra}
        </aside>
      </div>
    </div>
  );
}
