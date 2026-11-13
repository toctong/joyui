"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
} from "react";
import * as RemixIcons from "@remixicon/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { RiCheckLine, RiSearchLine } from "@remixicon/react";
import { toast, Toaster } from "@/components/base/toast/toast";
import { cx } from "@/utils/cx";

type IconComponent = ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;

type IconEntry = {
  name: string;
  short: string;
  Icon: IconComponent;
  style: "line" | "fill" | "other";
};

type StyleFilter = "all" | "line" | "fill";

function toShortName(name: string) {
  return name.replace(/^Ri/, "").replace(/(Line|Fill)$/, "");
}

const ALL_ICONS: IconEntry[] = Object.entries(RemixIcons)
  .filter(([name, value]) => name.startsWith("Ri") && typeof value === "function")
  .map(([name, value]) => {
    let style: IconEntry["style"] = "other";
    if (name.endsWith("Line")) style = "line";
    else if (name.endsWith("Fill")) style = "fill";
    return {
      name,
      short: toShortName(name),
      Icon: value as IconComponent,
      style,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const COLS_SM = 3;
const COLS_MD = 5;
const COLS_LG = 6;
const ROW_HEIGHT = 108;
const GAP = 10;

function useColumnCount() {
  const [cols, setCols] = useState(COLS_LG);
  useEffect(() => {
    const sync = () => {
      const w = window.innerWidth;
      if (w < 640) setCols(COLS_SM);
      else if (w < 1100) setCols(COLS_MD);
      else setCols(COLS_LG);
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);
  return cols;
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

/**
 * Remix Icon explorer for the docs Icons page — searchable virtual grid,
 * click a tile to copy the component name (or import snippet).
 */
export function IconsGallery() {
  const [query, setQuery] = useState("");
  const [style, setStyle] = useState<StyleFilter>("line");
  const [copied, setCopied] = useState<string | null>(null);
  const [copyMode, setCopyMode] = useState<"name" | "import">("name");
  const cols = useColumnCount();
  const parentRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/\s+/g, "");
    return ALL_ICONS.filter((icon) => {
      if (style !== "all" && icon.style !== style) return false;
      if (!q) return true;
      const compact = icon.name.toLowerCase();
      const short = icon.short.toLowerCase();
      return (
        compact.includes(q) ||
        compact.replace(/^ri/, "").includes(q) ||
        short.includes(q)
      );
    });
  }, [query, style]);

  const rowCount = Math.max(1, Math.ceil(filtered.length / cols));

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT + GAP,
    overscan: 6,
  });

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(null), 1400);
    return () => window.clearTimeout(id);
  }, [copied]);

  const onCopy = useCallback(
    async (name: string) => {
      const value =
        copyMode === "import"
          ? `import { ${name} } from "@remixicon/react";`
          : name;
      const ok = await copyText(value);
      if (!ok) {
        toast.error("复制失败", { description: "请检查剪贴板权限。" });
        return;
      }
      setCopied(name);
      toast.success(copyMode === "import" ? "已复制 import" : "已复制图标名", {
        description: value,
        duration: 2200,
      });
    },
    [copyMode],
  );

  return (
    <div className="not-prose flex w-full flex-col gap-3">
      <Toaster position="bottom-end" />

      <div className="flex flex-col gap-3">
        <div className="relative min-w-0">
          <RiSearchLine
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-foreground-icon-quaternary"
            aria-hidden
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索图标，例如 add / arrow / mail…"
            className={cx(
              "h-10 w-full rounded-xl border border-separator-border bg-background-full pe-3 ps-9",
              "text-body-regular text-text-primary placeholder:text-text-tertiary",
              "outline-none transition-[border-color,box-shadow]",
              "focus:border-accent-500 focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-accent-500)_18%,transparent)]",
            )}
            aria-label="搜索图标"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="inline-flex w-fit rounded-xl border border-separator-border bg-background-secondary-default p-1"
            role="group"
            aria-label="图标样式"
          >
            {(
              [
                ["line", "Line"],
                ["fill", "Fill"],
                ["all", "全部"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setStyle(id)}
                className={cx(
                  "h-8 rounded-lg px-3 text-caption-1-medium transition-colors",
                  style === id
                    ? "bg-background-full text-text-primary shadow-xs"
                    : "text-text-tertiary hover:text-text-secondary",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div
              className="inline-flex items-center gap-1 text-caption-1-medium text-text-tertiary"
              role="group"
              aria-label="复制模式"
            >
              <span>复制</span>
              {(
                [
                  ["name", "名称"],
                  ["import", "import"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setCopyMode(id)}
                  className={cx(
                    "rounded-md px-1.5 py-0.5 transition-colors",
                    copyMode === id
                      ? "bg-accent-50 text-accent-600 dark:bg-accent-900/30"
                      : "hover:text-text-secondary",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <p className="text-caption-1-regular text-text-tertiary">
              <span className="tabular-nums text-text-secondary">{filtered.length}</span>
              {style === "all" ? " 个图标" : style === "line" ? " 个 Line" : " 个 Fill"}
              {query ? " · 已筛选" : ""}
              {" · 点击复制"}
            </p>
          </div>
        </div>
      </div>

      <div
        ref={parentRef}
        className="h-[min(68vh,720px)] overflow-auto rounded-2xl border border-separator-border bg-background-full p-1.5 sm:p-2"
      >
        {filtered.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-body-regular text-text-secondary">
            没有匹配的图标
          </div>
        ) : (
          <div
            className="relative w-full"
            style={{ height: virtualizer.getTotalSize() }}
          >
            {virtualizer.getVirtualItems().map((row) => {
              const start = row.index * cols;
              const slice = filtered.slice(start, start + cols);
              return (
                <div
                  key={row.key}
                  className="absolute start-0 top-0 grid w-full"
                  style={
                    {
                      height: row.size,
                      transform: `translateY(${row.start}px)`,
                      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                      gap: GAP,
                      paddingBottom: GAP,
                    } as CSSProperties
                  }
                >
                  {slice.map((icon) => {
                    const isCopied = copied === icon.name;
                    const Icon = icon.Icon;
                    return (
                      <button
                        key={icon.name}
                        type="button"
                        title={icon.name}
                        onClick={() => onCopy(icon.name)}
                        className={cx(
                          "group flex h-[108px] flex-col items-center justify-center gap-2 rounded-xl px-2",
                          "text-foreground-icon-primary",
                          "transition-[background-color,color] duration-150 ease",
                          "hover:bg-background-secondary-default hover:text-text-primary",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
                          isCopied && "bg-accent-50 text-accent-600 dark:bg-accent-900/30",
                        )}
                      >
                        <span className="flex size-11 items-center justify-center">
                          {isCopied ? (
                            <RiCheckLine className="size-7" aria-hidden />
                          ) : (
                            <Icon className="size-7" aria-hidden />
                          )}
                        </span>
                        <span
                          className={cx(
                            "max-w-full truncate text-center text-[12px] leading-4",
                            isCopied
                              ? "text-accent-600"
                              : "text-text-secondary group-hover:text-text-primary",
                          )}
                        >
                          {icon.short}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
