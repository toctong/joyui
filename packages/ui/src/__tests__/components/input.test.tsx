import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Input } from "../../components/base/input/input";

describe("Input", () => {
  it("renders labeled field and notifies onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input label="邮箱" placeholder="you@company.com" onChange={onChange} />);
    const field = screen.getByLabelText("邮箱");
    await user.type(field, "a@b.c");
    expect(onChange).toHaveBeenCalled();
    expect(field).toHaveAttribute("placeholder", "you@company.com");
  });
});
