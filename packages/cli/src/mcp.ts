import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { CATALOG, getComponent, resolveRegistryUrl } from "./catalog.js";

export async function startMcpServer() {
  const server = new McpServer({
    name: "joyui",
    version: "0.1.0",
  });

  server.tool(
    "get_started",
    "Overview of JoyUI and the recommended agent workflow (detect → discover → install → compose).",
    {},
    async () => ({
      content: [
        {
          type: "text",
          text: [
            "JoyUI is a React + Tailwind CSS v4 library of linked motion / effect compounds.",
            "It does not ship Button/Input/Dialog primitives.",
            "",
            "Workflow:",
            "1. init_joyui if the project has no JoyUI tokens/utils",
            "2. list_components / get_component to discover exact compound names",
            "3. install_components (never hand-build lookalikes)",
            "4. Style with semantic tokens only (bg-background, text-foreground, …)",
            "5. Merge classes with cn/cx",
            "",
            "Also available: shadcn MCP with registries.@joyui pointing at the registry JSON.",
            "Install skill with install_skill for always-on catalog knowledge.",
          ].join("\n"),
        },
      ],
    }),
  );

  server.tool(
    "list_components",
    "List every JoyUI installable item with name, type, and description.",
    {
      type: z
        .enum(["compound", "lib", "all"])
        .optional()
        .describe("Filter by layer"),
    },
    async ({ type = "all" }) => {
      const items =
        type === "all" ? CATALOG : CATALOG.filter((c) => c.type === type);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(items, null, 2),
          },
        ],
      };
    },
  );

  server.tool(
    "get_component",
    "Get description, dependencies, registry URL, and usage notes for one component.",
    {
      name: z.string().describe("Exact component name, e.g. cursor-flare"),
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
                install: `npx joyui@latest add ${item.name} --yes`,
                shadcn: `npx shadcn@latest add @joyui/${item.name}`,
                registryUrl: resolveRegistryUrl(item.name),
                usage:
                  item.name === "format"
                    ? `import { formatDate, formatCurrency } from "@/lib/format"`
                    : `import { ${toExportName(item.name)} } from "@/components/ui/${item.name}"`,
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
      const example = EXAMPLES[name] ?? `// See docs for ${name}`;
      return { content: [{ type: "text", text: example }] };
    },
  );

  server.tool(
    "install_components",
    "Print the install commands for the given components (agent should run them with --yes).",
    {
      names: z.array(z.string()).describe("Component names to install"),
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
      const cmd = `${runner(packageManager)} joyui@latest add ${names.join(" ")} --yes`;
      return {
        content: [
          {
            type: "text",
            text: [
              "Run this in the project root:",
              cmd,
              "",
              "Or via shadcn (after configuring @joyui registry):",
              `${runner(packageManager)} shadcn@latest add ${names.map((n) => `@joyui/${n}`).join(" ")}`,
            ].join("\n"),
          },
        ],
      };
    },
  );

  server.tool(
    "init_joyui",
    "Return the one-time JoyUI init command for a consumer project.",
    {
      yes: z.boolean().optional().default(true),
    },
    async ({ yes = true }) => ({
      content: [
        {
          type: "text",
          text: `npx joyui@latest init${yes ? " --yes" : ""}\n\nThis writes tokens CSS, utils, AGENTS.md rules, and .cursor/rules/joyui.mdc.`,
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
          text: "npx joyui@latest init --yes\n# or re-run rules only:\nnpx joyui@latest skill --force",
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
            "JoyUI Agent Skill (SKILL.md open standard) gives always-loaded catalog + design rules.",
            "Install: npx joyui@latest skill",
            "Flags: --global (~/.claude/skills), --client codex (~/.agents/skills), --path <dir>, --force",
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
      const flags = [
        g ? "--global" : "",
        client ? `--client ${client}` : "",
      ]
        .filter(Boolean)
        .join(" ");
      return {
        content: [
          {
            type: "text",
            text: `npx joyui@latest skill ${flags}`.trim(),
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
            "Import: @joyui/react/styles.css (or copy tokens via joyui init).",
            "Use semantic Tailwind tokens: bg-background, text-foreground, bg-card, border-border, bg-primary, text-muted-foreground, chart-1..5.",
            "Dark mode flips via .dark on <html>. Never hardcode hex or dark: palette overrides.",
            "Merge classes with cn() / cx().",
          ].join("\n"),
        },
      ],
    }),
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

function toExportName(name: string) {
  return name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

function runner(pm: string) {
  if (pm === "npm") return "npx";
  if (pm === "yarn") return "yarn dlx";
  if (pm === "bun") return "bunx";
  return "pnpm dlx";
}

const EXAMPLES: Record<string, string> = {
  format: `import { formatDate, formatCurrency, fromNow } from "@/lib/format"

formatDate(new Date(), "YYYY-MM-DD")
formatCurrency(1999, "CNY")
fromNow("2026-01-01")`,
  utils: `import { cn, cx } from "@/lib/utils"

cn("px-2", condition && "bg-muted")`,
};
