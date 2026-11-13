"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { Pagination } from "../../base/pagination/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  type TableSize,
} from "../../base/table/table";
import { EmptyState } from "../../base/empty-state/empty-state";
import { cx } from "../../../utils/cx";

/**
 * Configurable data table — JoyUI `Table` driven by `@tanstack/react-table`.
 * Pass your own columns + rows; use `DataTableExample` only for the marketing demo.
 */

export type DataTableColumn<T extends object> = {
  id: string;
  header: ReactNode;
  /** Field key; omit when using a custom `cell`. */
  accessorKey?: keyof T & string;
  cell?: (row: T) => ReactNode;
  enableSorting?: boolean;
  meta?: { className?: string; isRowHeader?: boolean };
};

export interface DataTableProps<T extends object> {
  "aria-label": string;
  data: readonly T[];
  columns: readonly DataTableColumn<T>[];
  getRowId: (row: T) => string;
  size?: TableSize;
  pageSize?: number;
  emptyState?: ReactNode;
  className?: string;
  containerClassName?: string;
}

export function DataTable<T extends object>({
  "aria-label": label,
  data,
  columns,
  getRowId,
  size = "md",
  pageSize = 10,
  emptyState = "No results.",
  className,
  containerClassName,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const columnDefs = useMemo<ColumnDef<T>[]>(
    () =>
      columns.map((col) => ({
        id: col.id,
        accessorKey: col.accessorKey,
        header: () => col.header,
        cell: (ctx) =>
          col.cell
            ? col.cell(ctx.row.original)
            : col.accessorKey
              ? String(ctx.row.original[col.accessorKey] ?? "")
              : null,
        enableSorting: col.enableSorting ?? Boolean(col.accessorKey),
        meta: col.meta,
      })),
    [columns],
  );

  const table = useReactTable({
    data: data as T[],
    columns: columnDefs,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => getRowId(row),
  });

  const rows = table.getRowModel().rows;
  const headers = table.getHeaderGroups()[0]?.headers ?? [];
  const totalPages = Math.max(1, table.getPageCount());

  return (
    <section
      className={cx(
        "overflow-hidden rounded-2xl border border-border-secondary-default bg-background-primary-default dark:bg-background-secondary-default",
        className,
      )}
    >
      <Table
        aria-label={label}
        size={size}
        selectionMode="none"
        containerClassName={containerClassName}
      >
        <TableHeader>
          {headers.map((header) => {
            const meta = header.column.columnDef.meta as
              | { className?: string; isRowHeader?: boolean }
              | undefined;
            const canSort = header.column.getCanSort();
            const labelNode = flexRender(
              header.column.columnDef.header,
              header.getContext(),
            );
            return (
              <TableColumn
                key={header.id}
                id={header.id}
                isRowHeader={meta?.isRowHeader}
                className={meta?.className}
              >
                {canSort ? (
                  <button
                    type="button"
                    onClick={header.column.getToggleSortingHandler()}
                    className="flex cursor-pointer items-center gap-0.5"
                  >
                    {labelNode}
                  </button>
                ) : (
                  labelNode
                )}
              </TableColumn>
            );
          })}
        </TableHeader>
        <TableBody
          renderEmptyState={() =>
            typeof emptyState === "string" ? (
              <EmptyState size="sm" title={emptyState} />
            ) : (
              emptyState
            )
          }
        >
          {rows.map((row) => (
            <TableRow key={row.id} id={row.id}>
              {row.getVisibleCells().map((cell) => {
                const meta = cell.column.columnDef.meta as
                  | { className?: string }
                  | undefined;
                return (
                  <TableCell key={cell.id} className={meta?.className}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {data.length > pageSize ? (
        <div className="border-t border-separator-border px-3 py-3">
          <Pagination
            page={pagination.pageIndex + 1}
            totalPages={totalPages}
            onChange={(p) => table.setPageIndex(p - 1)}
          />
        </div>
      ) : null}
    </section>
  );
}
