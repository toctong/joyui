import { cp, mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  CATALOG,
  getComponent,
  importSnippet,
  resolveRegistryUrl,
} from "./catalog.js";
import { resolveInsideCwd } from "./fs-safe.js";
import { UTILS_TS } from "./utils-template.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function cmdList() {
  console.log("JoyUI components (prefer: pnpm add @joyui/react)\n");
  for (const item of CATALOG) {
    console.log(
      `${item.name.padEnd(28)} ${item.layer.padEnd(12)} ${item.description}`,
    );
  }
  console.log(`\n${CATALOG.length} items. Import from @joyui/react after npm install.`);
}

export async function cmdInit(cwd: string, yes: boolean) {
  const stylesDir = resolveInsideCwd(cwd, "styles");
  const rulesDir = resolveInsideCwd(cwd, ".cursor/rules");
  await mkdir(stylesDir, { recursive: true });
  await mkdir(rulesDir, { recursive: true });

  await writeFile(
    path.join(stylesDir, "joyui.css"),
    `/**
 * JoyUI entry for consumer apps.
 *
 * 1. pnpm add @joyui/react
 * 2. Import this file (or paste the two lines below into your global CSS)
 *
 * Requires Tailwind CSS v4 in the same pipeline.
 */
@import "tailwindcss";
@import "@joyui/react/styles.css";
`,
  );

  await writeFile(path.join(rulesDir, "joyui.mdc"), RULES_MDC);
  await writeComponentsJson(cwd);
  await appendAgents(cwd);

  if (!yes) {
    console.log("Init complete. Pass --yes in agent/non-interactive shells.");
  }
  console.log("");
  console.log("JoyUI initialized:");
  console.log("  styles/joyui.css          ← import this (or copy its contents)");
  console.log("  components.json           ← shadcn-compatible registry hint");
  console.log("  .cursor/rules/joyui.mdc   ← agent design rules");
  console.log("  AGENTS.md                 ← appended JoyUI section");
  console.log("");
  console.log("Next:");
  console.log("  pnpm add @joyui/react");
  console.log('  import { JoyUIProvider, Button } from "@joyui/react"');
}

export async function cmdAdd(names: string[], cwd: string, yes: boolean) {
  const unknown = names.filter((n) => !getComponent(n));
  if (unknown.length) {
    console.error(`Unknown components: ${unknown.join(", ")}`);
    console.error("Run: npx @joyui/cli list");
    process.exitCode = 1;
    return;
  }

  console.log(
    "Tip: whole-library install is recommended — pnpm add @joyui/react\n",
  );

  for (const name of names) {
    const item = getComponent(name)!;
    console.log(`${name}:`);
    console.log(`  npm:    ${importSnippet(item)}`);
    let url: string;
    try {
      url = resolveRegistryUrl(name);
    } catch (err) {
      console.error(`  ${err instanceof Error ? err.message : err}`);
      process.exitCode = 1;
      continue;
    }
    console.log(`  fetch:  ${url}`);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const payload = (await res.json()) as {
        files?: Array<{ path: string; content: string }>;
        dependencies?: string[];
      };
      const files = payload.files ?? [];
      if (!files.length) {
        console.log(
          "  registry has no source payload — prefer npm whole-library install",
        );
        console.log(`  then:  ${importSnippet(item)}`);
      } else {
        const needsUtils = files.some((f) =>
          (f.content ?? "").includes("@/lib/utils"),
        );
        if (needsUtils) {
          const utilsPath = resolveInsideCwd(cwd, "lib/utils.ts");
          try {
            await readFile(utilsPath, "utf8");
          } catch {
            await mkdir(path.dirname(utilsPath), { recursive: true });
            await writeFile(utilsPath, UTILS_TS);
            console.log("  wrote  lib/utils.ts");
          }
        }
      }
      for (const file of files) {
        if (!file.content) continue;
        if (
          !file.path ||
          file.path.includes("..") ||
          path.isAbsolute(file.path)
        ) {
          console.warn(`  skip   unsafe path: ${file.path}`);
          continue;
        }
        const target = resolveInsideCwd(cwd, file.path.replace(/^\//, ""));
        await mkdir(path.dirname(target), { recursive: true });
        await writeFile(target, file.content, "utf8");
        console.log(`  wrote  ${file.path}`);
      }
      if (payload.dependencies?.length) {
        console.log(
          `  deps:  ${payload.dependencies.join(", ")} — install with your package manager`,
        );
      }
    } catch (err) {
      console.warn(
        `  remote registry unavailable (${err instanceof Error ? err.message : err}).`,
      );
      console.warn(
        `  Use npm instead: pnpm add @joyui/react && ${importSnippet(item)}`,
      );
      if (!yes) process.exitCode = 1;
    }
  }
}

export async function cmdSkill(opts: {
  cwd: string;
  global?: boolean;
  client?: string;
  dest?: string;
  force?: boolean;
}) {
  const skillRoot = path.resolve(__dirname, "../skill");
  let target: string;
  if (opts.dest) {
    const abs = path.resolve(opts.dest);
    const rel = path.relative(path.resolve(opts.cwd), abs);
    target = resolveInsideCwd(opts.cwd, rel || "joyui-skill");
  } else if (opts.global)
    target = path.join(
      process.env.HOME || process.env.USERPROFILE || "",
      ".claude",
      "skills",
      "joyui",
    );
  else if (opts.client === "codex")
    target = path.join(
      process.env.HOME || process.env.USERPROFILE || "",
      ".agents",
      "skills",
      "joyui",
    );
  else target = resolveInsideCwd(opts.cwd, ".claude/skills/joyui");

  await mkdir(target, { recursive: true });
  await cp(skillRoot, target, { recursive: true, force: opts.force ?? true });
  console.log(`JoyUI skill installed → ${target}`);
  console.log("Restart the agent / open a new chat so the skill loads.");
}

async function writeComponentsJson(cwd: string) {
  const target = resolveInsideCwd(cwd, "components.json");
  try {
    await readFile(target, "utf8");
    return;
  } catch {
    // create
  }
  await writeFile(
    target,
    JSON.stringify(
      {
        $schema: "https://ui.shadcn.com/schema.json",
        style: "joyui",
        rsc: false,
        tsx: true,
        tailwind: {
          config: "",
          css: "styles/joyui.css",
          baseColor: "neutral",
          cssVariables: true,
        },
        iconLibrary: "remixicon",
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
          ui: "@/components/ui",
          lib: "@/lib",
          hooks: "@/hooks",
        },
        registries: {
          "@joyui": "https://joyui.dev/r/{name}.json",
        },
      },
      null,
      2,
    ),
  );
}

async function appendAgents(cwd: string) {
  const agentsPath = resolveInsideCwd(cwd, "AGENTS.md");
  const block = `\n\n## JoyUI\n\n${AGENTS_SNIPPET}\n`;
  try {
    const existing = await readFile(agentsPath, "utf8");
    if (existing.includes("## JoyUI")) return;
    await writeFile(agentsPath, existing + block);
  } catch {
    await writeFile(agentsPath, `# AGENTS\n${block}`);
  }
}

const AGENTS_SNIPPET = `Prefer \`pnpm add @joyui/react\` and \`import { Button } from "@joyui/react"\`.
CSS is built-in: \`@import "@joyui/react/styles.css"\` after Tailwind.
Wrap the app in \`JoyUIProvider\`. Optional source copy: \`npx @joyui/cli@latest add <name> --yes\`.
Tokens: \`text-text-primary\`, \`bg-background-*-default\`, \`border-border-*\`, composite type \`text-title-2-medium\`.
Merge classes with \`cn\`/\`cx\`. Dark mode uses the \`.dark\` class — no raw \`dark:\` palette overrides.`;

const RULES_MDC = `---
description: JoyUI design system rules for agents
globs: **/*.{tsx,ts,jsx,js,css}
alwaysApply: true
---

# JoyUI rules

- Install: \`pnpm add @joyui/react\` then \`import { … } from "@joyui/react"\`.
- CSS (required once): \`@import "@joyui/react/styles.css"\` after \`@import "tailwindcss"\`.
- Provider: wrap with \`JoyUIProvider\` (locale / RTL / copy).
- Optional source copy: \`npx @joyui/cli add <name> --yes\` (shadcn-style).
- Tokens: text-text-primary, bg-background-*-default, border-border-*, chart-1…5, accent-*.
- Type: composite utilities only (text-title-2-medium, text-body-regular) — never stack text-sm font-medium.
- Merge classes with cn()/cx() from @joyui/react.
- Icons: @remixicon/react as component references (leadingIcon={RiAddLine}).
- Dark mode via .dark class; do not hardcode hex colors.
`;
