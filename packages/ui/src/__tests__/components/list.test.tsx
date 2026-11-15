import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { List, ListItem } from "../../components/base/list/list";

describe("List", () => {
  it("renders items and keeps semantic border on shell", () => {
    const { container } = render(
      <List aria-label="账号">
        <ListItem title="primary" description="夸克主账号" />
        <ListItem title="backup" description="备用" />
      </List>,
    );
    expect(screen.getByText("primary")).toBeInTheDocument();
    expect(screen.getByText("备用")).toBeInTheDocument();
    expect(container.firstElementChild?.className).toContain(
      "border-border-secondary-default",
    );
  });
});
