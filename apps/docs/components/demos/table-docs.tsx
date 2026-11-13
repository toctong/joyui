"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/base/table/table";
import { cx } from "@/utils/cx";

const rows = [
  { id: "1", name: "转存任务", status: "运行中", owner: "柳晓" },
  { id: "2", name: "Cookie 刷新", status: "成功", owner: "阿真" },
  { id: "3", name: "配额检查", status: "失败", owner: "小可" },
];

export function TableSizePreview({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full gap-6", className)}>
      {(["sm", "md"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <Table aria-label={`任务表 ${size}`} size={size}>
            <TableHeader>
              <TableColumn isRowHeader>名称</TableColumn>
              <TableColumn>状态</TableColumn>
              <TableColumn>负责人</TableColumn>
            </TableHeader>
            <TableBody items={rows}>
              {(row) => (
                <TableRow id={row.id}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.owner}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <p className="text-center text-caption-1-medium text-text-tertiary">{size}</p>
        </div>
      ))}
    </div>
  );
}
