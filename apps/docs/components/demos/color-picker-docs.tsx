"use client";

import { useState } from "react";
import { parseColor } from "react-aria-components";
import {
  ColorPicker,
  ColorWell,
} from "@/components/base/color-picker/color-picker";
import { cx } from "@/utils/cx";

const PRESETS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#6366f1",
  "#d946ef",
];

export function ColorPickerBasicPreview({ className }: { className?: string }) {
  const [color, setColor] = useState(parseColor("#6366f1"));
  return (
    <div className={cx("flex justify-center", className)}>
      <ColorPicker value={color} onChange={setColor} swatches={PRESETS} />
    </div>
  );
}

export function ColorPickerAlphaPreview({ className }: { className?: string }) {
  const [color, setColor] = useState(parseColor("rgba(99, 102, 241, 0.6)"));
  return (
    <div className={cx("flex justify-center", className)}>
      <ColorPicker value={color} onChange={setColor} showAlpha swatches={PRESETS} />
    </div>
  );
}

export function ColorWellScenario({ className }: { className?: string }) {
  const [brand, setBrand] = useState(parseColor("#6366f1"));
  const [label, setLabel] = useState(parseColor("#22c55e"));
  const [chart, setChart] = useState(parseColor("#f97316"));

  return (
    <div
      className={cx(
        "flex w-full max-w-md flex-col gap-4 rounded-2xl border border-separator-border bg-background-primary-default p-5 shadow-xs",
        className,
      )}
    >
      <p className="text-body-medium text-text-primary">主题色</p>
      <div className="flex flex-col gap-3">
        <label className="flex items-center justify-between gap-3 text-body-2-medium text-text-secondary">
          品牌色
          <ColorWell
            aria-label="品牌色"
            value={brand}
            onChange={setBrand}
            swatches={PRESETS}
            wellClassName="size-6"
          />
        </label>
        <label className="flex items-center justify-between gap-3 text-body-2-medium text-text-secondary">
          标签色
          <ColorWell
            aria-label="标签色"
            value={label}
            onChange={setLabel}
            swatches={PRESETS}
            wellClassName="size-6"
          />
        </label>
        <label className="flex items-center justify-between gap-3 text-body-2-medium text-text-secondary">
          图表系列
          <ColorWell
            aria-label="图表系列"
            value={chart}
            onChange={setChart}
            swatches={PRESETS}
            wellClassName="size-6"
          />
        </label>
      </div>
    </div>
  );
}

export const COLOR_PICKER_BASIC_CODE = `import { useState } from "react";
import { parseColor } from "react-aria-components";
import { ColorPicker } from "@/components/base/color-picker/color-picker";

export function Example() {
  const [color, setColor] = useState(parseColor("#6366f1"));
  return (
    <ColorPicker
      value={color}
      onChange={setColor}
      swatches={["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#6366f1", "#d946ef"]}
    />
  );
}`;

export const COLOR_PICKER_WELL_CODE = `import { useState } from "react";
import { parseColor } from "react-aria-components";
import { ColorWell } from "@/components/base/color-picker/color-picker";

const presets = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#6366f1", "#d946ef"];

export function Example() {
  const [color, setColor] = useState(parseColor("#6366f1"));
  return (
    <ColorWell
      aria-label="Bug color"
      value={color}
      onChange={setColor}
      swatches={presets}
      wellClassName="size-6"
    />
  );
}`;

export const COLOR_PICKER_ALPHA_CODE = `import { useState } from "react";
import { parseColor } from "react-aria-components";
import { ColorPicker } from "@/components/base/color-picker/color-picker";

export function Example() {
  const [color, setColor] = useState(parseColor("rgba(99, 102, 241, 0.6)"));
  return <ColorPicker value={color} onChange={setColor} showAlpha />;
}`;
