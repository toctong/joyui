import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "../../components/base/card/card";
import { List, ListItem } from "../../components/base/list/list";

describe("Card", () => {
  it("uses semantic border token (not raw black border)", () => {
    const { container } = render(
      <Card>
        <p>内容</p>
      </Card>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("border-border-secondary-default");
    expect(root.className).toContain("rounded");
  });
});

describe("List", () => {
  it("renders items with semantic shell border", () => {
    const { container } = render(
      <List aria-label="账号">
        <ListItem title="admin" description="primary" />
        <ListItem title="backup" description="secondary" />
      </List>,
    );
    expect(screen.getByText("admin")).toBeInTheDocument();
    expect(screen.getByText("backup")).toBeInTheDocument();
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain("border-border-secondary-default");
  });
});
