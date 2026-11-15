/**
 * Copy shippable CSS into dist/ so exports can resolve from dist as well as src.
 * Keeps src/styles as source of truth; dist/styles is a publish mirror.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const srcDir = path.join(pkgRoot, "src/styles");
const distDir = path.join(pkgRoot, "dist/styles");

fs.mkdirSync(distDir, { recursive: true });

for (const name of ["theme.css", "typography.css", "components.css"]) {
  fs.copyFileSync(path.join(srcDir, name), path.join(distDir, name));
}

// Entry for dist/: @source points at sibling dist root (one level up).
const entry = `/**
 * JoyUI styles (dist mirror). Prefer:
 *   @import "@joyui/react/styles.css";
 *
 * Source of truth: packages/ui/src/styles/
 */
@source "..";

@import "./theme.css";
@import "./typography.css";

@custom-variant dark (&:where(.dark, .dark *));
@custom-variant rtl (&:dir(rtl));
@custom-variant ltr (&:dir(ltr));

@import "./components.css";
`;
fs.writeFileSync(path.join(distDir, "styles.css"), entry);
console.log("copied styles → dist/styles");
