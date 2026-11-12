import { Command } from "commander";
import { cmdAdd, cmdInit, cmdList, cmdSkill } from "./commands.js";
import { startMcpServer } from "./mcp.js";

const program = new Command();

program
  .name("joyui")
  .description("JoyUI CLI — components, MCP, and agent skill")
  .version("0.1.0");

program
  .command("list")
  .description("List installable components")
  .action(async () => {
    await cmdList();
  });

program
  .command("init")
  .description("Initialize JoyUI tokens, utils, and agent rules")
  .option("-y, --yes", "Non-interactive (required for agents)", false)
  .action(async (opts: { yes?: boolean }) => {
    await cmdInit(process.cwd(), Boolean(opts.yes));
  });

program
  .command("add")
  .description("Add components from the JoyUI registry")
  .argument("<names...>", "Component names")
  .option("-y, --yes", "Non-interactive", false)
  .action(async (names: string[], opts: { yes?: boolean }) => {
    await cmdAdd(names, process.cwd(), Boolean(opts.yes));
  });

program
  .command("mcp")
  .description("Start the JoyUI MCP server (stdio)")
  .action(async () => {
    await startMcpServer();
  });

program
  .command("skill")
  .description("Install the JoyUI agent skill")
  .option("-g, --global", "Install to ~/.claude/skills/joyui")
  .option("-c, --client <client>", "codex → ~/.agents/skills/joyui")
  .option("-p, --path <dir>", "Custom install directory")
  .option("-f, --force", "Overwrite existing skill", true)
  .action(
    async (opts: {
      global?: boolean;
      client?: string;
      path?: string;
      force?: boolean;
    }) => {
      await cmdSkill({
        cwd: process.cwd(),
        global: opts.global,
        client: opts.client,
        dest: opts.path,
        force: opts.force,
      });
    },
  );

program.parse();
