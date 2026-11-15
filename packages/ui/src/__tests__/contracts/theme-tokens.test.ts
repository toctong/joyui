import { describe, expect, it } from "vitest";
import {
  collectSemanticUtilities,
  readStyle,
  themeDefinesColor,
  walkTsx,
} from "../../test/theme-contract";

/**
 * Regression: consumer apps saw black Card/DataTable borders because
 * `border-border-secondary-default` was used in components but never defined
 * in theme.css (utility fell back to currentColor).
 */
describe("theme token contracts", () => {
  const theme = readStyle("theme.css");
  const files = walkTsx();
  const { border, text, background } = collectSemanticUtilities(files);

  it("defines every border-border-* token referenced by components", () => {
    const missing = [...border].filter(
      (token) => !theme.includes(`--color-border-${token}`),
    );
    expect(missing, `missing border tokens: ${missing.join(", ")}`).toEqual([]);
  });

  it("defines every text-text-* token referenced by components", () => {
    const missing = [...text].filter(
      (token) => !theme.includes(`--color-text-${token}`),
    );
    expect(missing, `missing text tokens: ${missing.join(", ")}`).toEqual([]);
  });

  it("defines every bg-background-* token referenced by components", () => {
    const missing = [...background].filter(
      (token) => !theme.includes(`--color-background-${token}`),
    );
    expect(missing, `missing background tokens: ${missing.join(", ")}`).toEqual(
      [],
    );
  });

  it("exports critical consumer tokens that previously caused black borders", () => {
    expect(themeDefinesColor(theme, "secondary-default")).toBe(true);
    expect(theme.includes("--color-border-secondary-default")).toBe(true);
    expect(theme.includes("--color-text-brand-primary")).toBe(true);
    // Must appear in both light (:root) and dark (.dark) + @theme inline.
    expect(theme.match(/--color-border-secondary-default/g)?.length).toBeGreaterThanOrEqual(3);
  });

  it("scans a non-trivial component surface (sanity)", () => {
    expect(files.length).toBeGreaterThan(50);
    expect(border.has("secondary-default")).toBe(true);
  });
});
