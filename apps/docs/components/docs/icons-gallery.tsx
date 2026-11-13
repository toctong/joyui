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
  Icon: IconComponent;
  style: "line" | "fill" | "other";
};

type StyleFilter = "all" | "line" | "fill";

const ALL_ICONS: IconEntry[] = Object.entries(RemixIcons)
  .filter(([name, value]) => name.startsWith("Ri") && typeof value === "function")
  .map(([name, value]) => {
    let style: IconEntry["style"] = "other";
    if (name.endsWith("Line")) style = "line";
    else if (name.endsWith("Fill")) style = "fill";
    return { name, Icon: value as IconComponent, style };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const COLS_SM = 4;
const COLS_MD = 6;
const COLS_LG = 8;
const ROW_HEIGHT = 96;
const GAP = 8;

function useColumnCount() {
  const [cols, setCols] = useState(COLS_LG);
  useEffect(() => {
    const sync = () => {
      const w = window.innerWidth;
      if (w < 640) setCols(COLS_SM);
      else if (w < 1024) setCols(COLS_MD);
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
      return compact.includes(q) || compact.replace(/^ri/, "").includes(q);
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
    <div className="not-prose flex w-full flex-col gap-4">
      <Toaster position="bottom-end" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1">
          <RiSearchLine
            className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-foreground-icon-quaternary"
            aria-hidden
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索图标，例如 add / arrow / mail…"
            className={cx(
              "h-10 w-full rounded-2lg bg-background-tertiary-default pe-3 ps-9",
              "text-body-regular text-text-primary placeholder:text-text-tertiary",
              "ring-2 ring-inset ring-transparent outline-none",
              "focus:ring-accent-500",
            )}
            aria-label="搜索图标"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
                "h-8 rounded-md px-2.5 text-caption-1-medium transition-colors",
                style === id
                  ? "bg-text-primary text-background-primary-default"
                  : "bg-background-tertiary-default text-text-secondary hover:text-text-primary",
              )}
            >
              {label}
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-border-secondary-default" aria-hidden />
          {(
            [
              ["name", "复制名称"],
              ["import", "复制 import"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setCopyMode(id)}
              className={cx(
                "h-8 rounded-md px-2.5 text-caption-1-medium transition-colors",
                copyMode === id
                  ? "bg-accent-500 text-white"
                  : "bg-background-tertiary-default text-text-secondary hover:text-text-primary",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-caption-1-medium text-text-secondary">
        共 <span className="tabular-nums text-text-primary">{filtered.length}</span> 个
        {style === "all" ? "" : style === "line" ? " Line" : " Fill"} 图标
        {query ? "（已筛选）" : ""} · 点击卡片复制
      </p>

      <div
        ref={parentRef}
        className={cx(
          "h-[min(68vh,720px)] overflow-auto rounded-2xl",
          "border border-border-secondary-default bg-background-secondary-default/40 p-2",
        )}
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
                          "group flex h-24 flex-col items-center justify-center gap-2 rounded-xl px-1",
                          "bg-background-primary-default text-foreground-icon-primary",
                          "ring-1 ring-border-secondary-default",
                          "transition-[background-color,box-shadow,color] duration-150 ease",
                          "hover:bg-background-tertiary-default hover:ring-border-button-active",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
                          isCopied && "ring-2 ring-accent-500",
                        )}
                      >
                        {isCopied ? (
                          <RiCheckLine className="size-6 text-notification-success-foreground" aria-hidden />
                        ) : (
                          <Icon className="size-6" aria-hidden />
                        )}
                        <span className="max-w-full truncate px-1 text-[10px] leading-3 text-text-tertiary group-hover:text-text-secondary">
                          {icon.name}
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
