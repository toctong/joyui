import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "../../components/base/card/card";

describe("Card", () => {
  it("uses semantic secondary border token (not bare border-only)", () => {
    render(
      <Card data-testid="card">
        <p>内容</p>
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card.className).toContain("border-border-secondary-default");
    expect(card.className).toMatch(/\bborder\b/);
  });
});
