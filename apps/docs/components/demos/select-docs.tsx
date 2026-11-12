"use client";

import { Select, SelectItem } from "@/components/base/select/select";
import { cx } from "@/utils/cx";

const REGIONS = [
  { id: "na", label: "North America" },
  { id: "eu", label: "Europe" },
  { id: "apac", label: "Asia Pacific" },
  { id: "latam", label: "Latin America" },
];

export function SelectSizePreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex flex-wrap items-end justify-center gap-6", className)}>
      <div className="flex flex-col gap-2">
        <Select label="地区 md" placeholder="选择地区" size="md" defaultSelectedKey="eu">
          {REGIONS.map((r) => (
            <SelectItem key={r.id} id={r.id}>
              {r.label}
            </SelectItem>
          ))}
        </Select>
        <span className="text-caption-1-medium text-text-tertiary">md</span>
      </div>
      <div className="flex flex-col gap-2">
        <Select label="地区 sm" placeholder="选择地区" size="sm" defaultSelectedKey="na">
          {REGIONS.map((r) => (
            <SelectItem key={r.id} id={r.id}>
              {r.label}
            </SelectItem>
          ))}
        </Select>
        <span className="text-caption-1-medium text-text-tertiary">sm</span>
      </div>
    </div>
  );
}

export function SelectFilterScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-md flex-wrap items-end gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <Select label="地区" placeholder="全部地区" defaultSelectedKey="eu" className="min-w-[160px]">
        {REGIONS.map((r) => (
          <SelectItem key={r.id} id={r.id}>
            {r.label}
          </SelectItem>
        ))}
      </Select>
      <Select label="阶段" placeholder="全部阶段" className="min-w-[160px]">
        <SelectItem id="discovery">Discovery</SelectItem>
        <SelectItem id="proposal">Proposal</SelectItem>
        <SelectItem id="won">Closed won</SelectItem>
      </Select>
    </div>
  );
}
