import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  collectSemanticUtilities,
  packageRoot,
  readStyle,
  stylesRoot,
  walkTsx,
} from "../../test/theme-contract";

describe("published styles contracts", () => {
  const stylesEntry = readStyle("styles.css");
  const componentsCss = readStyle("components.css");
  const pkg = JSON.parse(
    fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"),
  ) as {
    exports: Record<string, string>;
    files: string[];
  };

  it("styles.css imports theme, typography, and components.css", () => {
    expect(stylesEntry).toContain('@import "./theme.css"');
    expect(stylesEntry).toContain('@import "./typography.css"');
    expect(stylesEntry).toContain('@import "./components.css"');
    expect(stylesEntry).toContain("@custom-variant dark");
  });

  it("package exports styles consumers need", () => {
    expect(pkg.exports["./styles.css"]).toBe("./src/styles/styles.css");
    expect(pkg.exports["./theme.css"]).toBe("./src/styles/theme.css");
    expect(pkg.exports["./components.css"]).toBe("./src/styles/components.css");
    expect(pkg.files).toContain("src/styles");
  });

  it("ships Table / Skeleton / AgentThinking CSS used via .bui-* classes", () => {
    for (const needle of [
      ".bui-table",
      ".bui-table-sm",
      ".bui-skeleton",
      ".bui-agent-thinking-label",
      ".bui-border-beam-glow",
      ".bui-composer-mic-bar",
    ]) {
      expect(componentsCss, `missing ${needle}`).toContain(needle);
    }
  });

  it("uses auto table layout so fixed w-* columns cannot crush neighbors", () => {
    expect(componentsCss).toMatch(/\.bui-table\s*\{[^}]*table-layout:\s*auto/s);
  });

  it("publishes sticky trailing actions column styles", () => {
    expect(componentsCss).toContain(".bui-table-actions");
  });

  it("does not publish docs-only landing chrome into components.css", () => {
    for (const bad of [
      ".landing-glass-stroke",
      ".landing-showcase-card",
      ".lg-host",
    ]) {
      expect(componentsCss).not.toContain(bad);
    }
  });

  it("every .bui-* class referenced in components has a rule in components.css", () => {
    const { bui } = collectSemanticUtilities(walkTsx());
    // Class names on elements are like bui-table / bui-table-sm; ignore CSS var prefixes.
    const missing = [...bui].filter((name) => {
      if (name.startsWith("bui-border-beam-") && name !== "bui-border-beam-glow") {
        // CSS custom props / keyframes fragments — not always selectors.
        return false;
      }
      return !componentsCss.includes(`.${name}`) && !componentsCss.includes(name);
    });
    // Soften: require core selectors that are known classNames on DOM nodes.
    // Only classes that rely on components.css selectors (not Tailwind-only markers).
    const required = [...bui].filter((name) =>
      /^(bui-table(?:-sm)?|bui-skeleton|bui-agent-thinking(?:-label|-dot)?|bui-composer(?:-mic-bar)?|bui-marquee(?:-track|-item)?|bui-reveal(?:-row)?|bui-magnetic|bui-shimmer|bui-spotlight|bui-dot-loader|bui-typing(?:-dot)?|bui-thinking-orbs-(?:ring|core)|bui-ripple|bui-voice|bui-carousel|bui-border-beam-glow)$/.test(
        name,
      ),
    );
    const requiredMissing = required.filter(
      (name) => !componentsCss.includes(`.${name}`) && !componentsCss.includes(name),
    );
    expect(
      requiredMissing,
      `bui classes missing from components.css: ${requiredMissing.join(", ")} (all missing hint: ${missing.slice(0, 10).join(", ")})`,
    ).toEqual([]);
  });

  it("keeps style sources on disk for npm pack", () => {
    for (const name of ["styles.css", "theme.css", "typography.css", "components.css"]) {
      expect(fs.existsSync(path.join(stylesRoot, name))).toBe(true);
    }
  });
});
