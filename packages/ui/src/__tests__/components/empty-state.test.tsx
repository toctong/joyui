import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "../../components/base/empty-state/empty-state";
import { Button } from "../../components/base/buttons/button";

describe("EmptyState", () => {
  it("renders title, description, and action", () => {
    render(
      <EmptyState
        title="还没有任务"
        description="先新建一个转存任务"
        action={<Button>新建</Button>}
      />,
    );
    expect(screen.getByText("还没有任务")).toBeInTheDocument();
    expect(screen.getByText("先新建一个转存任务")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "新建" })).toBeInTheDocument();
  });
});
