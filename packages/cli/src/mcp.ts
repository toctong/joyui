import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  CATALOG,
  getComponent,
  importSnippet,
  resolveRegistryUrl,
} from "./catalog.js";
import { EXAMPLES } from "./examples.js";

export async function startMcpServer() {
  const server = new McpServer({
    name: "joyui",
    version: "0.2.0",
  });

  server.tool(
    "get_started",
    "Overview of JoyUI and the recommended agent workflow (npm install → import → compose).",
    {},
    async () => ({
      content: [
        {
          type: "text",
          text: [
            "JoyUI is a React + Tailwind CSS v4 component library.",
            "It ships Button / Input / Dialog / charts / templates via npm `@joyui/react`.",
            "Theme + component CSS are built into `@joyui/react/styles.css`.",
            "",
            "Recommended workflow:",
            "1. pnpm add @joyui/react",
            '2. @import "@joyui/react/styles.css" after Tailwind',
            "3. Wrap app in <JoyUIProvider>",
            "4. import { Button, Input, DataTable } from \"@joyui/react\"",
            "5. Style with JoyUI semantic tokens only; merge classes with cn/cx",
            "",
            "Optional (shadcn-style source copy): npx @joyui/cli add <name> --yes",
            "Skill: npx @joyui/cli skill",
          ].join("\n"),
        },
      ],
    }),
  );

  server.tool(
    "list_components",
    "List every JoyUI component with name, layer, and exports.",
    {
      type: z
        .enum(["component", "lib", "base", "application", "foundation", "all"])
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
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              items.map((c) => ({
                name: c.name,
                title: c.title,
                layer: c.layer,
                type: c.type,
                importFrom: c.importFrom,
                exports: c.exports,
              })),
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.tool(
    "get_component",
    "Get description, exports, import path, and usage notes for one component.",
    {
      name: z.string().describe("Exact component name, e.g. button"),
    },
    async ({ name }) => {
      const item = getComponent(name);
      if (!item) {
        return {
          content: [
            {
              type: "text",
              text: `Unknown component "${name}". Call list_components for exact names.`,
            },
          ],
          isError: true,
        };
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                ...item,
                npm: "pnpm add @joyui/react",
                styles: '@import "@joyui/react/styles.css"',
                usage: importSnippet(item),
                optionalSourceCopy: `npx @joyui/cli@latest add ${item.name} --yes`,
                registryUrl: resolveRegistryUrl(item.name),
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.tool(
    "get_usage_examples",
    "Return a short usage example for a JoyUI component.",
    {
      name: z.string(),
    },
    async ({ name }) => {
      const item = getComponent(name);
      const example =
        EXAMPLES[name] ??
        (item
          ? `${importSnippet(item)}\n\n// See docs for full API: https://joyui.dev/docs/${item.name}`
          : `// Unknown "${name}". Call list_components.`);
      return { content: [{ type: "text", text: example }] };
    },
  );

  server.tool(
    "install_components",
    "Return the recommended install path for components (npm whole-library first).",
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
        return {
          content: [
            {
              type: "text",
              text: `Unknown: ${unknown.join(", ")}. Use list_components.`,
            },
          ],
          isError: true,
        };
      }
      const imports = names
        .map((n) => getComponent(n)!)
        .map((item) => importSnippet(item))
        .join("\n");
      return {
        content: [
          {
            type: "text",
            text: [
              "Recommended (whole library — CSS included):",
              `${pmAdd(packageManager)} @joyui/react`,
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
            ].join("\n"),
          },
        ],
      };
    },
  );

  server.tool(
    "init_joyui",
    "Return the one-time JoyUI setup commands for a consumer project.",
    {
      yes: z.boolean().optional().default(true),
    },
    async ({ yes = true }) => ({
      content: [
        {
          type: "text",
          text: [
            "1. Install the library:",
            "   pnpm add @joyui/react",
            "",
            "2. Add CSS after Tailwind:",
            '   @import "tailwindcss";',
            '   @import "@joyui/react/styles.css";',
            "",
            "3. Write agent rules / utils helpers:",
            `   npx @joyui/cli@latest init${yes ? " --yes" : ""}`,
            "",
            "4. Wrap the app:",
            '   import { JoyUIProvider } from "@joyui/react"',
          ].join("\n"),
        },
      ],
    }),
  );

  server.tool(
    "install_rules",
    "Return commands to install always-on JoyUI agent design rules.",
    {},
    async () => ({
      content: [
        {
          type: "text",
          text: "npx @joyui/cli@latest init --yes\n# skill (catalog + design rules):\nnpx @joyui/cli@latest skill --force",
        },
      ],
    }),
  );

  server.tool(
    "get_skill",
    "Explain the JoyUI agent skill and where it installs.",
    {},
    async () => ({
      content: [
        {
          type: "text",
          text: [
            "JoyUI Agent Skill (SKILL.md) loads catalog + design rules.",
            "Install: npx @joyui/cli@latest skill",
            "Flags: --global, --client codex, --path <dir>, --force",
            "Restart the agent session after installing.",
          ].join("\n"),
        },
      ],
    }),
  );

  server.tool(
    "install_skill",
    "Return the command to install the JoyUI agent skill into the project.",
    {
      global: z.boolean().optional(),
      client: z.enum(["codex"]).optional(),
    },
    async ({ global: g, client }) => {
      const flags = [g ? "--global" : "", client ? `--client ${client}` : ""]
        .filter(Boolean)
        .join(" ");
      return {
        content: [
          {
            type: "text",
            text: `npx @joyui/cli@latest skill ${flags}`.trim(),
          },
        ],
      };
    },
  );

  server.tool(
    "get_theme",
    "Describe JoyUI semantic tokens and dark mode.",
    {},
    async () => ({
      content: [
        {
          type: "text",
          text: [
            'Import once: @import "@joyui/react/styles.css" (includes theme + typography + component CSS).',
            "Semantic tokens (not shadcn bg-background / text-foreground):",
            "- Text: text-text-primary, text-text-secondary, text-text-tertiary, text-text-placeholder",
            "- Surfaces: bg-background-primary-default, bg-background-secondary-default, bg-background-full",
            "- Borders: border-border-button-default, border-separator-border, border-border-error-default",
            "- Type: text-title-2-medium, text-body-regular, text-caption-1-semibold (composite — do not stack text-sm font-medium)",
            "- Charts: chart-1 … chart-5",
            "- Accent: accent-50 … accent-950",
            "Dark mode: add .dark on <html>. Never hardcode hex or invent dark: palette overrides.",
            "Merge classes with cn() / cx() from @joyui/react.",
          ].join("\n"),
        },
      ],
    }),
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
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
