"use client";

import {
  ComboBox,
  ComboBoxItem,
  ComboBoxSection,
} from "@/components/base/combobox/combobox";
import { cx } from "@/utils/cx";

export function ComboboxBasicPreview({ className }: { className?: string }) {
  return (
    <div className={cx("w-full max-w-sm", className)}>
      <ComboBox label="负责人" placeholder="搜索成员" defaultSelectedKey="maya">
        <ComboBoxItem id="maya" textValue="Maya Chen">
          Maya Chen
        </ComboBoxItem>
        <ComboBoxItem id="leo" textValue="Leo Park">
          Leo Park
        </ComboBoxItem>
        <ComboBoxItem id="aria" textValue="Aria Kim">
          Aria Kim
        </ComboBoxItem>
      </ComboBox>
    </div>
  );
}

export function ComboboxSectionPreview({ className }: { className?: string }) {
  return (
    <div className={cx("w-full max-w-sm", className)}>
      <ComboBox label="时区" placeholder="搜索时区" defaultSelectedKey="sha">
        <ComboBoxSection title="亚洲">
          <ComboBoxItem id="sha" textValue="上海">
            上海 · UTC+8
          </ComboBoxItem>
          <ComboBoxItem id="tky" textValue="东京">
            东京 · UTC+9
          </ComboBoxItem>
        </ComboBoxSection>
        <ComboBoxSection title="美洲">
          <ComboBoxItem id="sfo" textValue="旧金山">
            旧金山 · UTC-7
          </ComboBoxItem>
        </ComboBoxSection>
      </ComboBox>
    </div>
  );
}

export function ComboboxAssignScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <p className="text-body-medium text-text-primary">指派任务</p>
      <ComboBox
        aria-label="指派人"
        placeholder="搜索同事…"
        size="small"
        emptyMessage="没有匹配的成员"
      >
        <ComboBoxItem id="lin" textValue="林晓">
          林晓
        </ComboBoxItem>
        <ComboBoxItem id="chen" textValue="陈可">
          陈可
        </ComboBoxItem>
      </ComboBox>
    </div>
  );
}
