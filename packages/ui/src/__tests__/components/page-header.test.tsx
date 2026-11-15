import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHeader } from "../../components/base/page-header/page-header";
import { Button } from "../../components/base/buttons/button";

describe("PageHeader", () => {
  it("renders title, description, and actions", () => {
    render(
      <PageHeader
        title="任务"
        description="管理转存与订阅"
        actions={<Button>新建</Button>}
      />,
    );
    expect(screen.getByRole("heading", { level: 1, name: "任务" })).toBeInTheDocument();
    expect(screen.getByText("管理转存与订阅")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "新建" })).toBeInTheDocument();
  });
});
