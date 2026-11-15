import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Select, SelectItem } from "../../components/base/select/select";

describe("Select", () => {
  it("uses semantic border token on the trigger", () => {
    render(
      <Select label="账号" placeholder="请选择" aria-label="账号">
        <SelectItem id="a">主账号</SelectItem>
        <SelectItem id="b">备用</SelectItem>
      </Select>,
    );
    const trigger = screen.getByRole("button");
    expect(trigger.className).toContain("border-border-button-default");
  });

  it("opens and selects an option", async () => {
    const user = userEvent.setup();
    render(
      <Select label="账号" placeholder="请选择" aria-label="账号">
        <SelectItem id="a">主账号</SelectItem>
        <SelectItem id="b">备用</SelectItem>
      </Select>,
    );
    await user.click(screen.getByRole("button"));
    await user.click(await screen.findByRole("option", { name: "主账号" }));
    expect(screen.getByRole("button")).toHaveTextContent("主账号");
  });
});
