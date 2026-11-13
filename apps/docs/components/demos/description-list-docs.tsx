"use client";

import {
  DescriptionItem,
  DescriptionList,
} from "@/components/base/description-list/description-list";
import { cx } from "@/utils/cx";

export function DescriptionListColumnsPreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex w-full max-w-2xl flex-col gap-8", className)}>
      <div className="flex flex-col gap-2">
        <DescriptionList columns={1}>
          <DescriptionItem term="计划">Pro</DescriptionItem>
          <DescriptionItem term="席位">12</DescriptionItem>
        </DescriptionList>
        <p className="text-center text-caption-1-medium text-text-tertiary">columns=1</p>
      </div>
      <div className="flex flex-col gap-2">
        <DescriptionList columns={2}>
          <DescriptionItem term="区域">亚太</DescriptionItem>
          <DescriptionItem term="计费周期">按月</DescriptionItem>
          <DescriptionItem term="联系人">ops@joyui.top</DescriptionItem>
          <DescriptionItem term="状态">活跃</DescriptionItem>
        </DescriptionList>
        <p className="text-center text-caption-1-medium text-text-tertiary">columns=2</p>
      </div>
    </div>
  );
}
