"use client";

import { Chip } from "@/components/base/badges/chip";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/application/data-table/data-table-view";
import { cx } from "@/utils/cx";

type Transfer = {
  id: string;
  name: string;
  status: "running" | "success" | "failed";
  owner: string;
  size: string;
};

const TRANSFERS: Transfer[] = [
  { id: "1", name: "Severance S01E01.mkv", status: "running", owner: "柳晓", size: "4.2 GB" },
  { id: "2", name: "Cookie bundle.zip", status: "success", owner: "阿真", size: "18 MB" },
  { id: "3", name: "quota-report.csv", status: "failed", owner: "小可", size: "220 KB" },
  { id: "4", name: "assets-pack.tar", status: "success", owner: "柳晓", size: "1.1 GB" },
  { id: "5", name: "logs-2026-11.ndjson", status: "running", owner: "阿真", size: "86 MB" },
];

const STATUS_CHIP: Record<Transfer["status"], { label: string; color: "blue" | "lime" | "rose" }> = {
  running: { label: "运行中", color: "blue" },
  success: { label: "成功", color: "lime" },
  failed: { label: "失败", color: "rose" },
};

const COLUMNS: DataTableColumn<Transfer>[] = [
  { id: "name", header: "名称", accessorKey: "name", meta: { isRowHeader: true } },
  {
    id: "status",
    header: "状态",
    cell: (row) => {
      const chip = STATUS_CHIP[row.status];
      return (
        <Chip variant="bold" color={chip.color}>
          {chip.label}
        </Chip>
      );
    },
  },
  { id: "owner", header: "负责人", accessorKey: "owner" },
  { id: "size", header: "大小", accessorKey: "size" },
];

export function DataTableSizePreview({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full gap-6", className)}>
      {(["sm", "md"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <DataTable
            aria-label={`转存表 ${size}`}
            size={size}
            pageSize={3}
            data={TRANSFERS}
            columns={COLUMNS}
            getRowId={(row) => row.id}
          />
          <p className="text-center text-caption-1-medium text-text-tertiary">{size}</p>
        </div>
      ))}
    </div>
  );
}

export function DataTableEmptyPreview({ className }: { className?: string }) {
  return (
    <div className={cx("w-full", className)}>
      <DataTable
        aria-label="空转存表"
        data={[]}
        columns={COLUMNS}
        getRowId={(row) => row.id}
        emptyState="暂无转存任务"
      />
    </div>
  );
}

export function DataTableTransfersScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full flex-col gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-body-medium text-text-primary">Transfers</p>
          <p className="text-caption-1-medium text-text-tertiary">筛选 / 排序 / 分页已接好。</p>
        </div>
      </div>
      <DataTable
        aria-label="转存列表"
        size="sm"
        pageSize={4}
        data={TRANSFERS}
        columns={COLUMNS}
        getRowId={(row) => row.id}
      />
    </div>
  );
}
