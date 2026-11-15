import { createRequire } from "node:module";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  CATALOG,
  getComponent,
  importSnippet,
  resolveRegistryUrl,
} from "./catalog.js";
import { getUsageExample } from "./examples.js";
import {
  enrichComponent,
  optionalPeersFor,
  searchComponents,
} from "./meta.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };

function text(payload: string, isError = false) {
  return {
    content: [{ type: "text" as const, text: payload }],
    ...(isError ? { isError: true } : {}),
  };
}

function json(payload: unknown, isError = false) {
  return text(JSON.stringify(payload, null, 2), isError);
}

function runner(pm: string) {
  if (pm === "npm") return "npx";
  if (pm === "yarn") return "yarn dlx";
  if (pm === "bun") return "bunx";
  return "pnpm dlx";
}

function pmAdd(pm: string) {
  if (pm === "npm") return "npm install";
  if (pm === "yarn") return "yarn add";
  if (pm === "bun") return "bun add";
  return "pnpm add";
}

function agentSetupCommands(opts?: {
  global?: boolean;
  client?: "codex";
  yes?: boolean;
}) {
  const yes = opts?.yes !== false;
  const skillFlags = [
    opts?.global ? "--global" : "",
    opts?.client ? `--client ${opts.client}` : "",
    "--force",
  ]
    .filter(Boolean)
    .join(" ");
  return [
    "Agent setup (rules + skill):",
    `  npx @joyui/cli@latest init${yes ? " --yes" : ""}`,
    `  npx @joyui/cli@latest skill ${skillFlags}`.trim(),
    "",
    "Restart the agent / open a new chat so the skill loads.",
    "Skill ships catalog + design rules (npm-first @joyui/react).",
  ].join("\n");
}

export async function startMcpServer() {
  const server = new McpServer({
    name: "joyui",
    version,
  });

  server.tool(
    "get_started",
    "Overview of JoyUI and the recommended agent workflow (npm install → import → compose).",
    {},
    async () =>
      text(
        [
          "JoyUI is a React + Tailwind CSS v4 component library.",
          "Ship via npm `@joyui/react` — theme + component CSS are built into `@joyui/react/styles.css`.",
          "",
          "Recommended workflow:",
          "1. pnpm add @joyui/react",
          '2. @import "@joyui/react/styles.css" after Tailwind',
          "3. Wrap app in <JoyUIProvider locale=\"zh-CN\">",
          "4. import { Button, Input, DataTable } from \"@joyui/react\"",
          "5. Style with semantic tokens only; merge with cn/cx",
          "",
          "Optional peers (install only when needed):",
          "- Composer (`@joyui/react/composer`): TipTap + tippy.js",
          "- Charts: recharts",
          "- Barcode / QR: jsbarcode / qrcode",
          "",
          "Discover: search_components / list_components / get_component / get_usage_examples",
          "Optional source copy: npx @joyui/cli@latest add <name> --yes",
          "Agent skill: setup_agent (or install_skill)",
        ].join("\n"),
      ),
  );

  server.tool(
    "list_components",
    "List JoyUI components. Filter by type (component|lib) or layer (base|application|foundation).",
    {
      type: z
        .enum([
          "component",
          "lib",
          "base",
          "application",
          "foundation",
          "all",
        ])
        .optional()
        .describe("Filter by type or layer"),
    },
    async ({ type = "all" }) => {
      const items =
        type === "all"
          ? CATALOG
          : type === "component" || type === "lib"
            ? CATALOG.filter((c) => c.type === type)
            : CATALOG.filter((c) => c.layer === type);
      return json(
        items.map((c) => ({
          name: c.name,
          title: c.title,
          layer: c.layer,
          type: c.type,
          importFrom: c.importFrom,
          exports: c.exports,
        })),
      );
    },
  );

  server.tool(
    "search_components",
    "Fuzzy-search JoyUI components by name, title, or export (use when the exact slug is unknown).",
    {
      query: z.string().describe("Search text, e.g. chart, modal, table"),
      limit: z.number().int().min(1).max(50).optional().default(15),
    },
    async ({ query, limit = 15 }) => {
      const hits = searchComponents(query, limit);
      if (!hits.length) {
        return text(
          `No matches for "${query}". Try list_components or a shorter query.`,
          true,
        );
      }
      return json({ query, count: hits.length, results: hits });
    },
  );

  server.tool(
    "get_component",
    "Get description, exports, import path, optional peers, pitfalls, and usage notes.",
    {
      name: z.string().describe("Exact component name, e.g. button"),
    },
    async ({ name }) => {
      const item = getComponent(name);
      if (!item) {
        const suggestions = searchComponents(name, 5);
        return json(
          {
            error: `Unknown component "${name}"`,
            suggestions,
            hint: "Use search_components or list_components for exact names.",
          },
          true,
        );
      }
      return json({
        ...enrichComponent(item),
        usage: importSnippet(item),
        optionalSourceCopy: `npx @joyui/cli@latest add ${item.name} --yes`,
        registryUrl: resolveRegistryUrl(item.name),
      });
    },
  );

  server.tool(
    "get_usage_examples",
    "Return a usage example for a JoyUI component (npm imports + peer/pitfall notes).",
    {
      name: z.string(),
    },
    async ({ name }) => text(getUsageExample(name)),
  );

  server.tool(
    "install_components",
    "Return the recommended install path for components (npm whole-library first, plus optional peers).",
    {
      names: z.array(z.string()).describe("Component names"),
      packageManager: z
        .enum(["pnpm", "npm", "yarn", "bun"])
        .optional()
        .default("pnpm"),
    },
    async ({ names, packageManager = "pnpm" }) => {
      const unknown = names.filter((n) => !getComponent(n));
      if (unknown.length) {
        return text(
          `Unknown: ${unknown.join(", ")}. Use search_components.`,
          true,
        );
      }
      const items = names.map((n) => getComponent(n)!);
      const imports = items.map((item) => importSnippet(item)).join("\n");
      const peers = [
        ...new Set(
          items.flatMap((item) => optionalPeersFor(item.name)?.packages ?? []),
        ),
      ];

      return text(
        [
          "Recommended (whole library — CSS included):",
          `${pmAdd(packageManager)} @joyui/react`,
          peers.length
            ? `\nOptional peers for selected components:\n${pmAdd(packageManager)} ${peers.join(" ")}`
            : "",
          "",
          "CSS (once per app):",
          '@import "tailwindcss";',
          '@import "@joyui/react/styles.css";',
          "",
          "Then import:",
          imports,
          "",
          "Optional source copy into the project:",
          `${runner(packageManager)} @joyui/cli@latest add ${names.join(" ")} --yes`,
        ]
          .filter(Boolean)
          .join("\n"),
      );
    },
  );

  server.tool(
    "init_joyui",
    "Return one-time JoyUI setup commands (library CSS + agent rules).",
    {
      yes: z.boolean().optional().default(true),
    },
    async ({ yes = true }) =>
      text(
        [
          "1. Install the library:",
          "   pnpm add @joyui/react",
          "",
          "2. Add CSS after Tailwind:",
          '   @import "tailwindcss";',
          '   @import "@joyui/react/styles.css";',
          "",
          "3. Write agent rules / skill:",
          `   npx @joyui/cli@latest init${yes ? " --yes" : ""}`,
          "   npx @joyui/cli@latest skill --force",
          "",
          "4. Wrap the app:",
          '   import { JoyUIProvider } from "@joyui/react"',
        ].join("\n"),
      ),
  );

  server.tool(
    "setup_agent",
    "Return commands to install JoyUI Cursor rules + agent skill (preferred over install_rules/install_skill).",
    {
      global: z.boolean().optional(),
      client: z.enum(["codex"]).optional(),
      yes: z.boolean().optional().default(true),
    },
    async (opts) => text(agentSetupCommands(opts)),
  );

  // Back-compat thin wrappers
  server.tool(
    "install_rules",
    "Return commands to install always-on JoyUI agent design rules (alias of setup_agent).",
    {},
    async () => text(agentSetupCommands({ yes: true })),
  );

  server.tool(
    "get_skill",
    "Explain the JoyUI agent skill and where it installs.",
    {},
    async () =>
      text(
        [
          "JoyUI Agent Skill (SKILL.md) loads catalog + design rules + peer/pitfall notes.",
          "Preferred: call setup_agent",
          "Or: npx @joyui/cli@latest skill",
          "Flags: --global, --client codex, --path <dir>, --force",
          "Restart the agent session after installing.",
        ].join("\n"),
      ),
  );

  server.tool(
    "install_skill",
    "Return the command to install the JoyUI agent skill (alias of setup_agent).",
    {
      global: z.boolean().optional(),
      client: z.enum(["codex"]).optional(),
    },
    async (opts) => text(agentSetupCommands(opts)),
  );

  server.tool(
    "get_theme",
    "Describe JoyUI semantic tokens and dark mode.",
    {},
    async () =>
      text(
        [
          'Import once: @import "@joyui/react/styles.css" (theme + typography + component CSS).',
          "Semantic tokens (not shadcn bg-background / text-foreground):",
          "- Text: text-text-primary, text-text-secondary, text-text-tertiary, text-text-placeholder, text-text-error-primary, text-text-white",
          "- Surfaces: bg-background-primary-default, bg-background-secondary-default, bg-background-full",
          "- Borders: border-border-button-default, border-separator-border, border-border-error-default, border-border-secondary-default",
          "- Status: bg-status-*-background / text-status-*-text, bg-status-dot-*, bg-status-presence-*, bg-badge-count",
          "- Heatmap: bg-heatmap-1 … bg-heatmap-4",
          "- Type: text-title-2-medium, text-body-regular, text-caption-1-semibold (composite — never stack text-sm font-medium)",
          "- Charts: chart-1 … chart-5 (+ chart-*-active)",
          "- Accent: accent-50 … accent-950",
          "Dark mode: add .dark on <html>. Never hardcode hex or invent dark: palette overrides.",
          "Merge classes with cn() / cx() from @joyui/react.",
        ].join("\n"),
      ),
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
