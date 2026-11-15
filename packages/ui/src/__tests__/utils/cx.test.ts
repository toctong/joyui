import { describe, expect, it } from "vitest";
import { cx } from "../../utils/cx";

describe("cx", () => {
  it("merges conflicting Tailwind utilities with last-write-wins", () => {
    expect(cx("p-2", "p-4")).toBe("p-4");
    expect(cx("text-text-primary", "text-text-secondary")).toContain(
      "text-text-secondary",
    );
  });

  it("keeps JoyUI typography tokens alongside text color utilities", () => {
    const merged = cx("text-body-medium", "text-text-primary");
    expect(merged).toContain("text-body-medium");
    expect(merged).toContain("text-text-primary");
  });
});
