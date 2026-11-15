import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "../../components/base/table/table";

describe("Table", () => {
  it("applies bui-table class so published CSS can style cells", () => {
    const { container } = render(
      <Table aria-label="样例表">
        <TableHeader>
          <TableColumn isRowHeader>名称</TableColumn>
          <TableColumn>状态</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Alpha</TableCell>
            <TableCell>ok</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const table = container.querySelector("table");
    expect(table).toHaveClass("bui-table");
    expect(screen.getByRole("grid", { name: "样例表" })).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
  });

  it("supports compact size via bui-table-sm", () => {
    const { container } = render(
      <Table aria-label="紧凑表" size="sm">
        <TableHeader>
          <TableColumn isRowHeader>A</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(container.querySelector("table")).toHaveClass("bui-table-sm");
  });
});
