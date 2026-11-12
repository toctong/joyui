"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  RiArrowDownSLine,
  RiLightbulbLine,
  RiRefreshLine,
  RiSearchLine,
} from "@remixicon/react";
import { motion } from "motion/react";
import {
  LogRow,
  ShimmerText,
  WorkingRow,
  useLogMotion,
  useRevealTicker,
} from "@/components/application/agent-log/agent-log";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

export type WebSearchSource = {
  id: string;
  label: string;
  /** Brand tint for the favicon disc */
  color: string;
  mark: string;
};

export type WebSearchStep = {
  id: string;
  /** lightbulb | site mark letter */
  kind: "query" | "x" | "reddit" | "read";
  label: string;
  resultLabel?: string;
  sources?: WebSearchSource[];
};

const DEFAULT_STEPS: WebSearchStep[] = [
  {
    id: "q1",
    kind: "query",
    label: "搜索团队在组件库中实际支付的费用",
    resultLabel: "5 个结果",
    sources: [
      { id: "reddit", label: "Reddit", color: "#FF4500", mark: "R" },
      { id: "linkedin", label: "LinkedIn", color: "#0A66C2", mark: "in" },
      { id: "github", label: "GitHub", color: "#24292F", mark: "⌘" },
      { id: "producthunt", label: "Product Hunt", color: "#DA552F", mark: "P" },
      { id: "notion", label: "Notion", color: "#000000", mark: "N" },
    ],
  },
  {
    id: "q2",
    kind: "x",
    label: "搜索 X 为 component library OR design system pricing",
    resultLabel: "7 帖子",
  },
  {
    id: "q3",
    kind: "reddit",
    label: "在 Reddit 上搜索 r/reactjs worth paying for",
    resultLabel: "12 线程",
  },
  {
    id: "q4",
    kind: "read",
    label: "阅读最强三线程",
  },
];

function StepIcon({ kind }: { kind: WebSearchStep["kind"] }) {
  if (kind === "x") {
    return (
      <span className="inline-flex size-4 items-center justify-center text-[11px] font-semibold text-text-secondary">
        𝕏
      </span>
    );
  }
  if (kind === "reddit") {
    return (
      <span className="inline-flex size-4 items-center justify-center rounded-full bg-[#FF4500] text-[9px] font-bold text-white">
        r
      </span>
    );
  }
  return (
    <RiLightbulbLine
      aria-hidden
      className="size-4 shrink-0 text-foreground-icon-tertiary"
    />
  );
}

function SourceStack({
  sources,
  open,
  onToggle,
}: {
  sources: WebSearchSource[];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mt-1.5 flex flex-col gap-1.5 ps-0.5">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-2 text-start outline-none"
      >
        <span className="text-caption-1-medium text-text-tertiary">来源</span>
        <span className="flex items-center -space-x-1.5">
          {sources.map((source) => (
            <span
              key={source.id}
              title={source.label}
              className="inline-flex size-4 items-center justify-center rounded-full ring-2 ring-background-primary-default text-[8px] font-bold text-white"
              style={{ backgroundColor: source.color }}
            >
              {source.mark.slice(0, 1)}
            </span>
          ))}
        </span>
        <RiArrowDownSLine
          aria-hidden
          className={cx(
            "size-3.5 text-foreground-icon-quaternary transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <ul className="space-y-1 ps-1">
          {sources.map((source) => (
            <li
              key={source.id}
              className="flex items-center gap-2 text-caption-1-medium text-text-secondary"
            >
              <span
                className="inline-flex size-3.5 items-center justify-center rounded-full text-[7px] font-bold text-white"
                style={{ backgroundColor: source.color }}
              >
                {source.mark.slice(0, 1)}
              </span>
              {source.label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function WebSearchRun({
  steps,
  className,
  onReplay,
}: {
  steps: WebSearchStep[];
  className?: string;
  onReplay: () => void;
}) {
  const reduce = useLogMotion();
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [done, setDone] = useState(false);

  const total = steps.length;
  const revealed = useRevealTicker({
    total,
    run: !done,
    startDelay: 280,
    stepInterval: 900,
    onComplete: () => setDone(true),
  });

  useEffect(() => {
    if (done) return;
    const started = performance.now();
    const id = window.setInterval(() => {
      setElapsed((performance.now() - started) / 1000);
    }, 100);
    return () => window.clearInterval(id);
  }, [done]);

  const visible = useMemo(() => steps.slice(0, revealed), [steps, revealed]);
  const searchCount = Math.min(
    3,
    Math.max(1, visible.filter((s) => s.kind !== "read").length || 1),
  );

  return (
    <div
      className={cx(
        "w-full max-w-xl text-body-regular text-text-secondary",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="mb-1 flex items-center gap-2 text-text-secondary">
        <RiSearchLine
          aria-hidden
          className="size-4 text-foreground-icon-tertiary"
        />
        {revealed > 0 ? (
          <span>跑了 {searchCount} 次搜索</span>
        ) : (
          <ShimmerText>正在搜索…</ShimmerText>
        )}
      </div>

      <ul className="flex flex-col">
        {visible.map((step, index) => {
          const first = index === 0;
          const last = index === visible.length - 1 && done;
          return (
            <LogRow
              key={step.id}
              first={first}
              last={last}
              reduce={reduce}
              className="py-1.5"
            >
              <div className="flex items-start gap-2 pe-1">
                <StepIcon kind={step.kind} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-body-medium text-text-secondary">
                      {step.label}
                    </p>
                    {step.resultLabel ? (
                      <span className="shrink-0 text-caption-1-medium text-text-tertiary">
                        {step.resultLabel}
                      </span>
                    ) : null}
                  </div>
                  {step.sources ? (
                    <SourceStack
                      sources={step.sources}
                      open={sourcesOpen}
                      onToggle={() => setSourcesOpen((v) => !v)}
                    />
                  ) : null}
                </div>
              </div>
            </LogRow>
          );
        })}
      </ul>

      {!done ? (
        <WorkingRow
          reduce={reduce}
          label={`工作 ${elapsed.toFixed(1)}s`}
          className="mt-1"
        />
      ) : (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-3"
        >
          <Button
            variant="secondary"
            size="small"
            leadingIcon={RiRefreshLine}
            onClick={onReplay}
          >
            再次运行
          </Button>
        </motion.div>
      )}
    </div>
  );
}

export function WebSearch({
  steps = DEFAULT_STEPS,
  className,
}: {
  steps?: WebSearchStep[];
  className?: string;
  autoPlay?: boolean;
}) {
  const [runKey, setRunKey] = useState(0);
  const replay = useCallback(() => setRunKey((k) => k + 1), []);

  return (
    <WebSearchRun
      key={runKey}
      steps={steps}
      className={className}
      onReplay={replay}
    />
  );
}
