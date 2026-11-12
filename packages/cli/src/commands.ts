import { cp, mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CATALOG, getComponent, resolveRegistryUrl } from "./catalog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function cmdList() {
  for (const item of CATALOG) {
    console.log(`${item.name.padEnd(14)} ${item.type.padEnd(10)} ${item.description}`);
  }
}

export async function cmdInit(cwd: string, yes: boolean) {
  const utilsDir = path.join(cwd, "lib");
  const stylesDir = path.join(cwd, "styles");
  const rulesDir = path.join(cwd, ".cursor", "rules");
  await mkdir(utilsDir, { recursive: true });
  await mkdir(stylesDir, { recursive: true });
  await mkdir(rulesDir, { recursive: true });

  await writeFile(
    path.join(utilsDir, "utils.ts"),
    `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const cx = cn
`,
  );

  await writeFile(
    path.join(stylesDir, "joyui.css"),
    `/* Import JoyUI tokens after Tailwind is set up:
 * @import "tailwindcss";
 * @import "./joyui-tokens.css";
 *
 * Or: import "@joyui/react/styles.css"
 */
`,
  );

  await writeFile(path.join(rulesDir, "joyui.mdc"), RULES_MDC);
  await appendAgents(cwd);

  if (!yes) {
    console.log("Init complete. Pass --yes in agent/non-interactive shells.");
  }
  console.log("JoyUI initialized: lib/utils.ts, styles/, .cursor/rules/joyui.mdc, AGENTS.md");
}

export async function cmdAdd(names: string[], cwd: string, yes: boolean) {
  const unknown = names.filter((n) => !getComponent(n));
  if (unknown.length) {
    console.error(`Unknown components: ${unknown.join(", ")}`);
    process.exitCode = 1;
    return;
  }

  for (const name of names) {
    const url = resolveRegistryUrl(name);
    console.log(`Fetching ${name} from ${url}`);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const item = (await res.json()) as {
        files?: Array<{ path: string; content: string }>;
        dependencies?: string[];
      };
      for (const file of item.files ?? []) {
        const target = path.join(cwd, file.path.replace(/^\//, ""));
        await mkdir(path.dirname(target), { recursive: true });
        await writeFile(target, file.content, "utf8");
        console.log(`  wrote ${file.path}`);
      }
      if (item.dependencies?.length) {
        console.log(
          `  deps: ${item.dependencies.join(", ")} — install with your package manager`,
        );
      }
    } catch (err) {
      console.warn(
        `  remote fetch failed (${err instanceof Error ? err.message : err}).`,
      );
      console.warn(
        `  Ensure registry is deployed, or use: npx shadcn@latest add @joyui/${name}`,
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
  if (opts.dest) target = path.resolve(opts.dest);
  else if (opts.global)
    target = path.join(process.env.HOME || process.env.USERPROFILE || "", ".claude", "skills", "joyui");
  else if (opts.client === "codex")
    target = path.join(process.env.HOME || process.env.USERPROFILE || "", ".agents", "skills", "joyui");
  else target = path.join(opts.cwd, ".claude", "skills", "joyui");

  await mkdir(target, { recursive: true });
  await cp(skillRoot, target, { recursive: true, force: opts.force ?? true });
  console.log(`JoyUI skill installed → ${target}`);
  console.log("Restart the agent / open a new chat so the skill loads.");
}

async function appendAgents(cwd: string) {
  const agentsPath = path.join(cwd, "AGENTS.md");
  const block = `\n\n## JoyUI\n\n${AGENTS_SNIPPET}\n`;
  try {
    const existing = await readFile(agentsPath, "utf8");
    if (existing.includes("## JoyUI")) return;
    await writeFile(agentsPath, existing + block);
  } catch {
    await writeFile(agentsPath, `# AGENTS\n${block}`);
  }
}

const AGENTS_SNIPPET = `Use JoyUI components instead of hand-built lookalikes.
Prefer \`pnpm add @joyui/react\` and \`import { Button } from "@joyui/react"\` (whole library).
Optional source copy: \`npx @joyui/cli@latest add <name> --yes\`.
Style with semantic tokens only (\`bg-background-primary-default\`, \`text-text-primary\`, \`border-border-*\`, …).
Merge classes with \`cn\`/\`cx\`. Dark mode uses the \`.dark\` class — no raw \`dark:\` palette overrides.`;

const RULES_MDC = `---
description: JoyUI design system rules for agents
globs: **/*.{tsx,ts,jsx,js,css}
alwaysApply: true
---

# JoyUI rules

- Prefer \`pnpm add @joyui/react\` and import from \`@joyui/react\` over reinventing UI.
- Optional source copy: \`npx @joyui/cli add <name> --yes\`.
- Use semantic tokens: text-text-primary, bg-background-*-default, border-border-*.
- Merge classes with cn()/cx() from @joyui/react.
- Dark mode via .dark class; do not hardcode hex colors.
`;
