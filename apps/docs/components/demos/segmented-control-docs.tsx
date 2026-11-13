"use client";

import { useState } from "react";
import type { Key } from "react-aria-components";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/base/segmented-control/segmented-control";
import { cx } from "@/utils/cx";

export function SegmentedVariantPreview({ className }: { className?: string }) {
  const [solid, setSolid] = useState<Iterable<Key>>(new Set(["day"]));
  const [plain, setPlain] = useState<Iterable<Key>>(new Set(["list"]));
  return (
    <div className={cx("flex flex-col items-center gap-6", className)}>
      <div className="flex flex-col items-center gap-2">
        <SegmentedControl
          aria-label="时间范围"
          selectedKeys={solid}
          onSelectionChange={setSolid}
          variant="solid"
        >
          <SegmentedControlItem id="day">日</SegmentedControlItem>
          <SegmentedControlItem id="week">周</SegmentedControlItem>
          <SegmentedControlItem id="month">月</SegmentedControlItem>
        </SegmentedControl>
        <span className="text-caption-1-medium text-text-tertiary">solid</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SegmentedControl
          aria-label="视图"
          selectedKeys={plain}
          onSelectionChange={setPlain}
          variant="plain"
        >
          <SegmentedControlItem id="list">列表</SegmentedControlItem>
          <SegmentedControlItem id="board">看板</SegmentedControlItem>
        </SegmentedControl>
        <span className="text-caption-1-medium text-text-tertiary">plain</span>
      </div>
    </div>
  );
}
