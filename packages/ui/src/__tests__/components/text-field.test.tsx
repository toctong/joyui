import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Label } from "../../components/base/input/label";
import {
  Input,
  InputBase,
  TextField,
} from "../../components/base/input/input";

describe("TextField / Input composition", () => {
  it("Input with label associates the control (preferred API)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Input label="Cookie" placeholder="粘贴 cookie" onChange={onChange} />,
    );
    const field = screen.getByLabelText("Cookie");
    await user.type(field, "abc");
    expect(onChange).toHaveBeenCalled();
  });

  it("TextField + Label + InputBase wires label for= to the input id", () => {
    render(
      <TextField>
        <Label>账号</Label>
        <InputBase placeholder="name" />
      </TextField>,
    );
    const field = screen.getByLabelText("账号");
    expect(field.tagName).toBe("INPUT");
  });

  it("does not nest Input inside TextField (Input already wraps TextField)", () => {
    const { container } = render(
      <TextField>
        <Label>Cookie</Label>
        <Input placeholder="粘贴 cookie" />
      </TextField>,
    );
    // Nested TextField shells — documents the footgun; prefer Input alone
    // or TextField + InputBase.
    const shells = container.querySelectorAll("[data-input-size]");
    expect(shells.length).toBeGreaterThan(1);
    expect(() => screen.getByLabelText("Cookie")).toThrow();
  });
});
