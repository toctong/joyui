import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Chip } from "../../components/base/badges/chip";

describe("Chip", () => {
  it("renders status label", () => {
    render(
      <Chip color="rose" variant="subtle">
        失败
      </Chip>,
    );
    expect(screen.getByText("失败")).toBeInTheDocument();
  });
});
