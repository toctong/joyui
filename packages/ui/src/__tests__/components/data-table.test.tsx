import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  DataTable,
  type DataTableColumn,
} from "../../components/application/data-table/data-table-view";

type Row = { id: string; name: string; status: string };

const rows: Row[] = [
  { id: "1", name: "任务甲", status: "running" },
  { id: "2", name: "任务乙", status: "idle" },
];

const columns: DataTableColumn<Row>[] = [
  {
    id: "name",
    header: "名称",
    accessorKey: "name",
    meta: { isRowHeader: true },
  },
  { id: "status", header: "状态", accessorKey: "status" },
];

describe("DataTable", () => {
  it("renders headers and rows with semantic shell border", () => {
    const { container } = render(
      <DataTable
        aria-label="任务列表"
        data={rows}
        columns={columns}
        getRowId={(row) => row.id}
      />,
    );

    expect(screen.getByRole("grid", { name: "任务列表" })).toBeInTheDocument();
    expect(screen.getByText("名称")).toBeInTheDocument();
    expect(screen.getByText("任务甲")).toBeInTheDocument();
    expect(screen.getByText("任务乙")).toBeInTheDocument();

    const shell = container.querySelector("section");
    expect(shell?.className).toContain("border-border-secondary-default");
    expect(container.querySelector("table.bui-table")).toBeTruthy();
  });

  it("shows empty state when data is empty without collapsing headers", () => {
    const { container } = render(
      <DataTable
        aria-label="空表"
        data={[]}
        columns={columns}
        getRowId={(row) => row.id}
        emptyState="暂无数据"
      />,
    );
    expect(screen.getByText("暂无数据")).toBeInTheDocument();
    expect(screen.getByText("名称")).toBeInTheDocument();
    expect(screen.getByText("状态")).toBeInTheDocument();
    const headers = container.querySelectorAll("thead th");
    expect(headers.length).toBe(columns.length);
  });

  it("supports sorting by column header button", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        aria-label="可排序"
        data={rows}
        columns={columns}
        getRowId={(row) => row.id}
      />,
    );
    const grid = screen.getByRole("grid", { name: "可排序" });
    await user.click(
      grid.querySelector("th button") ??
        screen.getByRole("button", { name: "名称" }),
    );
    expect(screen.getByText("任务甲")).toBeInTheDocument();
  });
});
