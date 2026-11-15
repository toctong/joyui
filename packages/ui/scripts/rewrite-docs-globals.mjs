/**
 * Rewrite apps/docs/styles/globals.css to import components.css and keep only
 * docs-app chrome (variants shell, html/body, landing glass, showcase cards).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const globalsPath = path.join(repoRoot, "apps/docs/styles/globals.css");

const src = fs.readFileSync(globalsPath, "utf8");

const landingStart = src.indexOf("/* Liquid glass");
const landingEnd = src.indexOf("/* Split-flap");
if (landingStart < 0 || landingEnd < 0) {
  throw new Error("Could not locate liquid-glass block in globals.css");
}
const landing = src.slice(landingStart, landingEnd).trim();

const showcaseStart = src.indexOf("/* Showcase card");
const showcaseEnd = src.indexOf("/* BorderBeam");
if (showcaseStart < 0 || showcaseEnd < 0) {
  throw new Error("Could not locate showcase-card block in globals.css");
}
const showcase = src.slice(showcaseStart, showcaseEnd).trim();

const out = `@import "tailwindcss";
@import "./theme.css";
@import "./typography.css";

/* ---------------------------------------------------------------------------
 * Dark mode strategy
 *
 * We use a class-based dark variant. Toggle dark mode by adding the \`.dark\`
 * class to <html> (a theme provider like \`next-themes\` can do this later).
 *
 *   <html class="dark">  →  every \`dark:*\` utility activates
 *
 * Components should NOT use \`dark:\` prefixes directly. Instead they reference
 * semantic color tokens (e.g. \`bg-bg-primary\`, \`text-text-primary\`) that flip
 * under \`.dark\` in styles/theme.css.
 * --------------------------------------------------------------------------- */
@custom-variant dark (&:where(.dark, .dark *));

/* Resolve the nearest direction boundary, including nested LTR regions.
 * Tailwind's ancestor-based defaults also match inside an opposing region. */
@custom-variant rtl (&:dir(rtl));
@custom-variant ltr (&:dir(ltr));

/* Shippable component CSS (also published via @joyui/react/styles.css). */
@import "./components.css";

/* The next theme is revealed by ThemeToggle from the exact interaction point.
 * Native view-transition crossfades are disabled so only the soft circular
 * clip-path animation runs; unsupported browsers simply ignore these rules. */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

/* Reset + base (docs app shell — not published). */
html,
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-variant-ligatures: contextual;
  font-kerning: normal;
}

html {
  color-scheme: light;
  background-color: var(--color-background-full);
}
html.dark {
  color-scheme: dark;
}
body {
  background-color: var(--color-background-full);
  color: var(--color-text-primary);
}

${landing}

${showcase}
`;

fs.writeFileSync(globalsPath, out);
console.log(`rewrote ${path.relative(repoRoot, globalsPath)} (${out.split(/\n/).length} lines)`);
