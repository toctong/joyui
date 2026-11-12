"use client";

import { useEffect, useRef, useState } from "react";
import {
  RiCloseLine,
  RiFileExcel2Line,
  RiFileImageLine,
  RiFileLine,
  RiFileWord2Line,
} from "@remixicon/react";
import { motion } from "motion/react";
import { cx } from "@/utils/cx";

export type ComposerAttachmentKind =
  | "image"
  | "document"
  | "spreadsheet"
  | "file";

export type ComposerAttachment = {
  id: string;
  name: string;
  kind: ComposerAttachmentKind;
  /** Thumbnail for images (optional; success card still uses the type icon). */
  src?: string;
  /** 0–100. While below 100 the perimeter ring draws; at 100 shows 上传成功. */
  progress?: number;
};

const KIND_ICON = {
  image: RiFileImageLine,
  document: RiFileWord2Line,
  spreadsheet: RiFileExcel2Line,
  file: RiFileLine,
} as const;

/** Rounded-rect path starting at top-center, clockwise — same recipe as FileUpload. */
function ringPath(width: number, height: number, inset: number, radius: number) {
  const x0 = inset;
  const y0 = inset;
  const x1 = width - inset;
  const y1 = height - inset;
  const arc = (endX: number, endY: number) =>
    `A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;

  return [
    `M ${width / 2} ${y0}`,
    `H ${x1 - radius}`,
    arc(x1, y0 + radius),
    `V ${y1 - radius}`,
    arc(x1 - radius, y1),
    `H ${x0 + radius}`,
    arc(x0, y1 - radius),
    `V ${y0 + radius}`,
    arc(x0 + radius, y0),
    "Z",
  ].join(" ");
}

function AttachmentTile({
  file,
  onRemove,
  delay = 0,
}: {
  file: ComposerAttachment;
  onRemove?: (id: string) => void;
  delay?: number;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ width: 200, height: 148 });
  const [progress, setProgress] = useState(
    file.progress === 0 ? 0 : (file.progress ?? 100),
  );
  const Icon = KIND_ICON[file.kind];
  const done = progress >= 100;
  const path = ringPath(box.width, box.height, 1, 15);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setBox({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (file.progress !== 0 && file.progress !== undefined) {
      setProgress(file.progress);
      return;
    }
    if (file.progress === 0) {
      setProgress(0);
      let raf = 0;
      const start = window.setTimeout(() => {
        const began = performance.now();
        const duration = 900 + delay * 180;
        const tick = (now: number) => {
          const t = Math.min(1, (now - began) / duration);
          setProgress(Math.round(t * 100));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      }, delay * 120);
      return () => {
        window.clearTimeout(start);
        cancelAnimationFrame(raf);
      };
    }
  }, [file.progress, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay * 0.08, duration: 0.28, ease: "easeOut" }}
      className="group relative pt-[9.5px]"
    >
      <div
        ref={boxRef}
        className={cx(
          "relative flex h-[148px] w-[200px] flex-col items-center justify-center gap-3.5",
          "rounded-2xl bg-background-primary-default px-3",
        )}
      >
        <svg
          aria-hidden
          viewBox={`0 0 ${box.width} ${box.height}`}
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <rect
            x={1}
            y={1}
            width={box.width - 2}
            height={box.height - 2}
            rx={15}
            fill="none"
            stroke="var(--color-border-button-default)"
            strokeWidth={2}
          />
          <path
            d={path}
            fill="none"
            stroke={done ? "var(--color-yellow-400)" : "var(--color-accent-400)"}
            strokeWidth={2}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${done ? 102 : progress} 200`}
            className="transition-[stroke-dasharray] duration-200 ease-linear"
          />
        </svg>

        <div
          aria-hidden
          className={cx(
            "absolute -top-[9.5px] left-1/2 z-10 -translate-x-1/2 rounded-md px-1.5 py-0.5",
            "text-caption-1-medium whitespace-nowrap text-white tabular-nums",
            done ? "bg-yellow-400" : "bg-accent-400",
          )}
        >
          {progress}%
        </div>

        <span className="relative flex size-10 items-center justify-center rounded-full border border-border-button-default bg-background-primary-default p-2">
          <Icon
            className="size-6 shrink-0 text-foreground-icon-secondary"
            aria-hidden
          />
        </span>

        <div className="relative flex max-w-full flex-col items-center gap-1 text-center">
          <p className="max-w-full truncate text-body-medium text-text-primary">
            {file.name}
          </p>
          <p className="text-body-2-regular text-text-secondary">
            {done ? "上传成功！" : "上传中…"}
          </p>
        </div>

        {onRemove ? (
          <button
            type="button"
            aria-label={`移除 ${file.name}`}
            onClick={() => onRemove(file.id)}
            className={cx(
              "absolute -end-1.5 -top-1.5 z-20 flex size-5 cursor-pointer items-center justify-center rounded-full",
              "bg-background-primary-default text-foreground-icon-secondary shadow-xs",
              "ring-1 ring-border-button-default opacity-0 transition-opacity group-hover:opacity-100",
            )}
          >
            <RiCloseLine className="size-3.5" aria-hidden />
          </button>
        ) : null}
      </div>
    </motion.div>
  );
}

/** Attachment strip that sits inside the AI composer card. */
export function ComposerAttachmentStrip({
  attachments,
  onRemove,
  className,
}: {
  attachments: ComposerAttachment[];
  onRemove?: (id: string) => void;
  className?: string;
}) {
  if (attachments.length === 0) return null;

  return (
    <div
      className={cx(
        "mb-3 flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
      aria-label="附件"
    >
      {attachments.map((file, i) => (
        <AttachmentTile
          key={file.id}
          file={file}
          delay={i}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
