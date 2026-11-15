import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "../../components/base/buttons/button";

describe("Button", () => {
  it("renders children and fires click", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>保存</Button>);
    await user.click(screen.getByRole("button", { name: "保存" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("honors isDisabled / disabled", () => {
    render(
      <Button isDisabled variant="primary">
        禁用
      </Button>,
    );
    expect(screen.getByRole("button", { name: "禁用" })).toBeDisabled();
  });

  it("applies variant class hooks for primary", () => {
    render(<Button variant="primary">主按钮</Button>);
    expect(screen.getByRole("button", { name: "主按钮" })).toHaveClass(
      "bg-button-primary",
    );
  });
});
