"use client";

import { useState } from "react";
import { Pagination } from "@/components/base/pagination/pagination";
import { cx } from "@/utils/cx";

export function PaginationSiblingPreview({ className }: { className?: string }) {
  const [page, setPage] = useState(5);
  return (
    <div className={cx("grid w-full max-w-xl gap-6", className)}>
      <div>
        <p className="mb-2 text-caption-1-medium text-text-tertiary">siblingCount=1</p>
        <Pagination
          page={page}
          totalPages={20}
          onChange={setPage}
          siblingCount={1}
          previousLabel="上一页"
          nextLabel="下一页"
          aria-label="分页 sibling 1"
        />
      </div>
      <div>
        <p className="mb-2 text-caption-1-medium text-text-tertiary">siblingCount=2</p>
        <Pagination
          page={page}
          totalPages={20}
          onChange={setPage}
          siblingCount={2}
          previousLabel="上一页"
          nextLabel="下一页"
          aria-label="分页 sibling 2"
        />
      </div>
    </div>
  );
}

export function PaginationTableScenario({ className }: { className?: string }) {
  const [page, setPage] = useState(1);
  return (
    <div
      className={cx(
        "flex w-full max-w-xl flex-col gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <p className="text-body-medium text-text-primary">转存记录 · 第 {page} 页</p>
      <div className="h-20 rounded-xl bg-background-secondary-default/60" />
      <Pagination
        page={page}
        totalPages={8}
        onChange={setPage}
        previousLabel="上一页"
        nextLabel="下一页"
        aria-label="转存记录分页"
      />
    </div>
  );
}
