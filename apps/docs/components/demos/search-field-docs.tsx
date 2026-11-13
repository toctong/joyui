"use client";

import { useState } from "react";
import { SearchField } from "@/components/base/search-field/search-field";
import { cx } from "@/utils/cx";

export function SearchFieldShapePreview({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-md gap-4", className)} role="group" aria-label="搜索形状">
      <SearchField aria-label="胶囊搜索" placeholder="搜索（pill）" shape="pill" />
      <SearchField aria-label="圆角搜索" placeholder="搜索（rounded）" shape="rounded" />
    </div>
  );
}

export function SearchFieldLoadingPreview({ className }: { className?: string }) {
  return (
    <div className={cx("w-full max-w-md", className)}>
      <SearchField
        aria-label="加载中搜索"
        placeholder="正在搜索…"
        defaultValue="JoyUI"
        isLoading
      />
    </div>
  );
}

export function SearchFieldFilterScenario({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  return (
    <div
      className={cx(
        "flex w-full max-w-md flex-col gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <SearchField
        aria-label="筛选成员"
        placeholder="筛选成员…"
        value={query}
        onChange={setQuery}
        size="small"
      />
      <p className="text-caption-1-medium text-text-tertiary">
        {query ? `当前关键词：${query}` : "输入关键字过滤列表"}
      </p>
    </div>
  );
}
