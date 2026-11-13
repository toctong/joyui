"use client";

import { Tag, TagGroup } from "@/components/base/tag-group/tag-group";
import { cx } from "@/utils/cx";

export function TagGroupSizePreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex flex-col items-center gap-6", className)}>
      <TagGroup aria-label="中尺寸标签" size="medium" selectionMode="multiple" defaultSelectedKeys={["react"]}>
        <Tag id="react" color="cyan">React</Tag>
        <Tag id="aria" color="purple">Aria</Tag>
        <Tag id="tw" color="lime">Tailwind</Tag>
      </TagGroup>
      <TagGroup aria-label="小尺寸标签" size="small" selectionMode="multiple" defaultSelectedKeys={["docs"]}>
        <Tag id="docs" color="blue">文档</Tag>
        <Tag id="cli" color="orange">CLI</Tag>
      </TagGroup>
    </div>
  );
}

export function TagGroupRemovePreview({ className }: { className?: string }) {
  return (
    <TagGroup
      aria-label="可移除标签"
      className={cx("max-w-md", className)}
      selectionMode="none"
      onRemove={() => undefined}
    >
      <Tag id="design" color="rose">设计</Tag>
      <Tag id="eng" color="cyan">工程</Tag>
      <Tag id="ops" color="neutral">运维</Tag>
    </TagGroup>
  );
}
