"use client";

import { useState } from "react";
import {
  DataGrid,
  type DataGridColumn,
} from "@/components/application/data-grid/data-grid";
import { cx } from "@/utils/cx";

type Renewal = {
  id: string;
  account: string;
  seats: number;
  plan: string;
  arr: number;
};

const SEED: Renewal[] = [
  { id: "r1", account: "北辰科技", seats: 40, plan: "Pro", arr: 48000 },
  { id: "r2", account: "青禾医疗", seats: 12, plan: "Team", arr: 14400 },
  { id: "r3", account: "云栈软件", seats: 85, plan: "Enterprise", arr: 204000 },
  { id: "r4", account: "星河传媒", seats: 22, plan: "Pro", arr: 26400 },
];

const COLUMNS: DataGridColumn<Renewal>[] = [
  { key: "account", header: "客户", width: 160, editable: true },
  { key: "seats", header: "席位", type: "number", width: 100, editable: true, filterable: true },
  {
    key: "plan",
    header: "套餐",
    type: "select",
    options: ["Team", "Pro", "Enterprise"],
    width: 140,
    editable: true,
    filterable: true,
  },
  {
    key: "arr",
    header: "ARR",
    type: "number",
    width: 120,
    editable: true,
    align: "end",
    summary: "sum",
    format: (v) => `$${Number(v).toLocaleString("en-US")}`,
  },
];

export function DataGridEditablePreview({ className }: { className?: string }) {
  const [rows, setRows] = useState(SEED);
  return (
    <div className={cx("w-full min-w-0", className)}>
      <DataGrid
        aria-label="续约表"
        data={rows}
        columns={COLUMNS}
        getRowId={(row) => row.id}
        onDataChange={setRows}
        height={320}
        exportFileName="renewals.csv"
      />
    </div>
  );
}

export function DataGridReadonlyPreview({ className }: { className?: string }) {
  return (
    <div className={cx("w-full min-w-0", className)}>
      <DataGrid
        aria-label="只读续约表"
        data={SEED}
        columns={COLUMNS.map((col) => ({ ...col, editable: false }))}
        getRowId={(row) => row.id}
        height={280}
      />
    </div>
  );
}

export function DataGridWorkbenchScenario({ className }: { className?: string }) {
  const [rows, setRows] = useState(SEED);
  return (
    <div
      className={cx(
        "flex w-full flex-col gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <div>
        <p className="text-body-medium text-text-primary">销售续约工作台</p>
        <p className="text-caption-1-medium text-text-tertiary">
          编辑后经 `onDataChange` 写回；可导出 CSV。
        </p>
      </div>
      <DataGrid
        aria-label="续约工作台"
        data={rows}
        columns={COLUMNS}
        getRowId={(row) => row.id}
        onDataChange={setRows}
        height={300}
        exportFileName="renewals.csv"
      />
    </div>
  );
}
