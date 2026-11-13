"use client";

import { TextLink } from "@/components/base/text-link/text-link";
import { cx } from "@/utils/cx";

export function TextLinkTonePreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex flex-col items-center gap-3", className)}>
      <TextLink href="#docs" size="md">查看文档</TextLink>
      <TextLink href="#muted" size="sm" muted>次要链接</TextLink>
    </div>
  );
}
