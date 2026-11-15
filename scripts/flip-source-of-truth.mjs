/**
 * Flip shippable UI SoT to packages/ui:
 * 1. Ensure styles live in packages/ui (already synced)
 * 2. Point docs tsconfig paths at packages/ui for base/foundations/shipped app
 * 3. Remove duplicated shippable trees from apps/docs
 *
 * Run: node ./scripts/flip-source-of-truth.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const docsRoot = path.join(root, "apps/docs");
const pkgRoot = path.join(root, "packages/ui");

const SHIPPED_APPLICATION = [
  "admin",
  "agent-log",
  "agent-thinking",
  "auth",
  "composer",
  "composer-loader",
  "composer-panel",
  "dashboard",
  "data-grid",
  "data-table",
  "medical",
  "notification-center",
  "settings",
  "theme",
  "web-search",
];

function rimraf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function writeDocsGlobals() {
  const globalsPath = path.join(docsRoot, "styles/globals.css");
  let globals = fs.readFileSync(globalsPath, "utf8");

  // Replace local shippable imports with package imports
  globals = globals.replace(
    `@import "tailwindcss";
@import "./theme.css";
@import "./typography.css";`,
    `@import "tailwindcss";
/* Shippable tokens + type — SoT is @joyui/react (packages/ui/src/styles). */
@import "@joyui/react/theme.css";
@import "@joyui/react/typography.css";`,
  );

  globals = globals.replace(
    `/* Shippable component CSS (also published via @joyui/react/styles.css). */
@import "./components.css";`,
    `/* Shippable component CSS — SoT is @joyui/react/components.css. */
@import "@joyui/react/components.css";`,
  );

  fs.writeFileSync(globalsPath, globals);
  console.log("updated apps/docs/styles/globals.css → import from @joyui/react");
}

function stubDocsStyleFiles() {
  const stubs = {
    "theme.css": `/* Re-export — edit packages/ui/src/styles/theme.css instead. */
@import "@joyui/react/theme.css";
`,
    "typography.css": `/* Re-export — edit packages/ui/src/styles/typography.css instead. */
@import "@joyui/react/typography.css";
`,
    "components.css": `/* Re-export — edit packages/ui/src/styles/components.css instead. */
@import "@joyui/react/components.css";
`,
  };
  for (const [name, body] of Object.entries(stubs)) {
    fs.writeFileSync(path.join(docsRoot, "styles", name), body);
    console.log(`stubbed apps/docs/styles/${name}`);
  }

  // Update package styles header to claim SoT
  const componentsCss = path.join(pkgRoot, "src/styles/components.css");
  let css = fs.readFileSync(componentsCss, "utf8");
  if (css.includes("Source of truth for Table")) {
    css = css.replace(
      /Source of truth for Table[\s\S]*?never published\.\n \*\//,
      `JoyUI shippable component CSS (source of truth).
 *
 * Published via @joyui/react/styles.css / components.css.
 * Docs imports these files; do not re-introduce copies under apps/docs/styles.
 */`,
    );
    fs.writeFileSync(componentsCss, css);
  }
}

function updateTsconfig() {
  const tsconfigPath = path.join(docsRoot, "tsconfig.json");
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));
  tsconfig.compilerOptions.paths = {
    "@/components/base/*": ["../../packages/ui/src/components/base/*"],
    "@/components/foundations/*": [
      "../../packages/ui/src/components/foundations/*",
    ],
    "@/components/application/admin/*": [
      "../../packages/ui/src/components/application/admin/*",
    ],
    "@/components/application/agent-log/*": [
      "../../packages/ui/src/components/application/agent-log/*",
    ],
    "@/components/application/agent-thinking/*": [
      "../../packages/ui/src/components/application/agent-thinking/*",
    ],
    "@/components/application/auth/*": [
      "../../packages/ui/src/components/application/auth/*",
    ],
    "@/components/application/composer/*": [
      "../../packages/ui/src/components/application/composer/*",
    ],
    "@/components/application/composer-loader/*": [
      "../../packages/ui/src/components/application/composer-loader/*",
    ],
    "@/components/application/composer-panel/*": [
      "../../packages/ui/src/components/application/composer-panel/*",
    ],
    "@/components/application/dashboard/*": [
      "../../packages/ui/src/components/application/dashboard/*",
    ],
    "@/components/application/data-grid/*": [
      "../../packages/ui/src/components/application/data-grid/*",
    ],
    "@/components/application/data-table/*": [
      "../../packages/ui/src/components/application/data-table/*",
    ],
    "@/components/application/medical/*": [
      "../../packages/ui/src/components/application/medical/*",
    ],
    "@/components/application/notification-center/*": [
      "../../packages/ui/src/components/application/notification-center/*",
    ],
    "@/components/application/settings/*": [
      "../../packages/ui/src/components/application/settings/*",
    ],
    "@/components/application/theme/*": [
      "../../packages/ui/src/components/application/theme/*",
    ],
    "@/components/application/web-search/*": [
      "../../packages/ui/src/components/application/web-search/*",
    ],
    "@/utils/cx": ["../../packages/ui/src/utils/cx.ts"],
    "@/utils/directional-icon": [
      "../../packages/ui/src/utils/directional-icon.ts",
    ],
    "@/utils/scroll-direction": [
      "../../packages/ui/src/utils/scroll-direction.ts",
    ],
    "@/utils/use-dismiss-on-outside-press": [
      "../../packages/ui/src/utils/use-dismiss-on-outside-press.ts",
    ],
    "@/hooks/use-count-up": ["../../packages/ui/src/hooks/use-count-up.ts"],
    "@/*": ["./*"],
    "@joyui/react": ["../../packages/ui/src/index.ts"],
    "@joyui/react/*": ["../../packages/ui/src/*"],
  };
  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2) + "\n");
  console.log("updated apps/docs/tsconfig.json paths → packages/ui");
}

function removeDuplicates() {
  const base = path.join(docsRoot, "components/base");
  const foundations = path.join(docsRoot, "components/foundations");
  rimraf(base);
  rimraf(foundations);
  console.log("removed apps/docs/components/base + foundations");

  for (const folder of SHIPPED_APPLICATION) {
    const dir = path.join(docsRoot, "components/application", folder);
    rimraf(dir);
    console.log(`removed apps/docs/components/application/${folder}`);
  }

  // Keep docs app-shell (full) — package only ships notification-bell.
  // Optionally copy notification-bell from package is already via path... 
  // Docs app-shell stays local and imports remapped base components.
}

function main() {
  // Ensure package styles exist
  for (const name of ["theme.css", "typography.css", "components.css", "styles.css"]) {
    const p = path.join(pkgRoot, "src/styles", name);
    if (!fs.existsSync(p)) {
      throw new Error(`Missing package style: ${p}. Run sync once first.`);
    }
  }

  writeDocsGlobals();
  stubDocsStyleFiles();
  updateTsconfig();
  removeDuplicates();
  console.log("\nDone. packages/ui is now the shippable source of truth.");
}

main();
