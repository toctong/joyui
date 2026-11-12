"use client";

import { useMemo, useState } from "react";

import { Chip } from "@/components/base/badges/chip";
import { useCountUp } from "@/hooks/use-count-up";
import { cx } from "@/utils/cx";

/**
 * Sankey Chart Card: tracked-time sources on the left flow into activity
 * targets on the right. Links are approximate cubic ribbons (not a full
 * sankey physics layout) tinted by their target, with hover isolation.
 */

type SankeyNode = {
  id: string;
  label: string;
  value: number;
  color: string;
};

type SankeyLink = {
  source: string;
  target: string;
  value: number;
};

const SOURCES: SankeyNode[] = [
  { id: "focus", label: "焦点", value: 32, color: "var(--color-chart-7-active)" },
  { id: "meeting", label: "会议", value: 18, color: "var(--color-chart-5-active)" },
  { id: "rest", label: "休息", value: 12, color: "var(--color-chart-8-active)" },
  { id: "admin", label: "管理员", value: 14, color: "var(--color-chart-6-active)" },
  { id: "learn", label: "学习", value: 10, color: "var(--color-chart-3-active)" },
];

const TARGETS: SankeyNode[] = [
  { id: "browse", label: "浏览", value: 22, color: "var(--color-chart-7-active)" },
  { id: "write", label: "写作", value: 18, color: "var(--color-chart-5-active)" },
  { id: "message", label: "消息", value: 13, color: "var(--color-chart-4-active)" },
  { id: "prod", label: "生产力", value: 12, color: "var(--color-chart-2-active)" },
  { id: "email", label: "邮箱", value: 8, color: "var(--color-chart-6-active)" },
  { id: "video", label: "视频", value: 14, color: "var(--color-chart-3-active)" },
  { id: "other", label: "其他", value: 13, color: "var(--color-chart-neutral)" },
];

/** Approximate flows that roughly respect source hours and target shares. */
const LINKS: SankeyLink[] = [
  { source: "focus", target: "browse", value: 8 },
  { source: "focus", target: "write", value: 10 },
  { source: "focus", target: "prod", value: 7 },
  { source: "focus", target: "video", value: 4 },
  { source: "focus", target: "other", value: 3 },
  { source: "meeting", target: "message", value: 6 },
  { source: "meeting", target: "email", value: 4 },
  { source: "meeting", target: "browse", value: 4 },
  { source: "meeting", target: "other", value: 4 },
  { source: "rest", target: "video", value: 6 },
  { source: "rest", target: "browse", value: 4 },
  { source: "rest", target: "other", value: 2 },
  { source: "admin", target: "email", value: 3 },
  { source: "admin", target: "message", value: 4 },
  { source: "admin", target: "prod", value: 3 },
  { source: "admin", target: "browse", value: 2 },
  { source: "admin", target: "other", value: 2 },
  { source: "learn", target: "write", value: 4 },
  { source: "learn", target: "browse", value: 3 },
  { source: "learn", target: "video", value: 2 },
  { source: "learn", target: "message", value: 1 },
];

const TRACKED = SOURCES.reduce((sum, node) => sum + node.value, 0);
const SVG_W = 520;
const SVG_H = 220;
const NODE_W = 8;
const LEFT_X = 118;
const RIGHT_X = 400;

function layoutNodes(nodes: SankeyNode[], x: number) {
  const total = nodes.reduce((sum, n) => sum + n.value, 0);
  const gap = 8;
  const usable = SVG_H - gap * (nodes.length - 1);
  let y = 0;
  return nodes.map((node) => {
    const h = (node.value / total) * usable;
    const item = { ...node, x, y, h };
    y += h + gap;
    return item;
  });
}

function ribbonPath(
  x0: number,
  y0: number,
  h0: number,
  x1: number,
  y1: number,
  h1: number,
) {
  const mid = (x0 + x1) / 2;
  const y0b = y0 + h0;
  const y1b = y1 + h1;
  return [
    `M ${x0} ${y0}`,
    `C ${mid} ${y0}, ${mid} ${y1}, ${x1} ${y1}`,
    `L ${x1} ${y1b}`,
    `C ${mid} ${y1b}, ${mid} ${y0b}, ${x0} ${y0b}`,
    "Z",
  ].join(" ");
}

export function SankeyChartCard({
  className,
  axisLabels = ["Tracked time", "Share of tracked time"],
}: {
  className?: string;
  axisLabels?: [string, string];
} = {}) {
  const [hover, setHover] = useState<string | null>(null);
  const display = useCountUp(TRACKED);

  const left = useMemo(() => layoutNodes(SOURCES, LEFT_X), []);
  const right = useMemo(() => layoutNodes(TARGETS, RIGHT_X), []);

  const ribbons = useMemo(() => {
    const sourceCursor = Object.fromEntries(left.map((n) => [n.id, n.y]));
    const targetCursor = Object.fromEntries(right.map((n) => [n.id, n.y]));
    const sourceMap = Object.fromEntries(left.map((n) => [n.id, n]));
    const targetMap = Object.fromEntries(right.map((n) => [n.id, n]));

    return LINKS.map((link, index) => {
      const source = sourceMap[link.source];
      const target = targetMap[link.target];
      if (!source || !target) return null;
      const sourceScale = source.h / source.value;
      const targetScale = target.h / target.value;
      const h0 = link.value * sourceScale;
      const h1 = Math.max(2, (link.value / TRACKED) * 100 * (target.h / target.value));
      const y0 = sourceCursor[link.source];
      const y1 = targetCursor[link.target];
      sourceCursor[link.source] += h0;
      targetCursor[link.target] += Math.min(h1, target.h * 0.35);
      return {
        key: `${link.source}-${link.target}-${index}`,
        sourceId: link.source,
        targetId: link.target,
        color: target.color,
        d: ribbonPath(source.x + NODE_W, y0, h0, target.x, y1, Math.min(h1, 14)),
      };
    }).filter(Boolean) as {
      key: string;
      sourceId: string;
      targetId: string;
      color: string;
      d: string;
    }[];
  }, [left, right]);

  const dimmed = (id: string) => hover !== null && hover !== id;

  return (
    <section
      className={cx(
        "flex min-h-[360px] min-w-0 flex-1 flex-col gap-4 rounded-2xl bg-background-secondary-default px-4 pt-4 pb-3",
        className,
      )}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-body-medium text-text-secondary">Tracked time</p>
          <div className="flex items-center gap-2">
            <p className="animate-number-fade text-title-1-medium text-text-primary tabular-nums">
              {display}h
            </p>
            <Chip variant="bold" color="soft">
              本周
            </Chip>
          </div>
        </div>
      </div>

      <div className="relative min-h-0 w-full flex-1">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="h-full w-full overflow-visible"
          role="img"
          aria-label="Tracked time sankey"
        >
          {ribbons.map((ribbon) => {
            const active =
              hover === null ||
              hover === ribbon.sourceId ||
              hover === ribbon.targetId;
            return (
              <path
                key={ribbon.key}
                d={ribbon.d}
                fill={ribbon.color}
                opacity={active ? 0.35 : 0.06}
                className="transition-opacity duration-200"
                onMouseEnter={() => setHover(ribbon.sourceId)}
                onMouseLeave={() => setHover(null)}
              />
            );
          })}

          {left.map((node) => (
            <g
              key={node.id}
              onMouseEnter={() => setHover(node.id)}
              onMouseLeave={() => setHover(null)}
              className="cursor-default"
              opacity={dimmed(node.id) ? 0.25 : 1}
            >
              <rect
                x={node.x}
                y={node.y}
                width={NODE_W}
                height={node.h}
                rx={4}
                fill={node.color}
              />
              <text
                x={node.x - 10}
                y={node.y + node.h / 2}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-text-secondary"
                style={{ fontSize: 12, fontWeight: 500 }}
              >
                {node.label}
                <tspan className="fill-text-tertiary" dx={4}>
                  {node.value}h
                </tspan>
              </text>
            </g>
          ))}

          {right.map((node) => (
            <g
              key={node.id}
              onMouseEnter={() => setHover(node.id)}
              onMouseLeave={() => setHover(null)}
              className="cursor-default"
              opacity={dimmed(node.id) ? 0.25 : 1}
            >
              <rect
                x={node.x}
                y={node.y}
                width={NODE_W}
                height={node.h}
                rx={4}
                fill={node.color}
              />
              <text
                x={node.x + NODE_W + 10}
                y={node.y + node.h / 2}
                dominantBaseline="middle"
                className="fill-text-secondary"
                style={{ fontSize: 12, fontWeight: 500 }}
              >
                {node.label}
                <tspan className="fill-text-tertiary" dx={4}>
                  {node.value}%
                </tspan>
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex items-center justify-between gap-3 pt-1 text-body-2-medium text-text-tertiary">
        <span>{axisLabels[0]}</span>
        <span>{axisLabels[1]}</span>
      </div>
    </section>
  );
}
