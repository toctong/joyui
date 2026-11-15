# @joyui/cli

JoyUI CLI — init、list、add（可选源码拷贝）、MCP、Agent Skill。

**推荐业务项目优先**：`pnpm add @joyui/react`（样式内置）。本 CLI 用于 agent 规则、registry 拷贝与 MCP。

## Commands

```bash
npx @joyui/cli@latest init --yes     # styles/joyui.css + components.json + rules
npx @joyui/cli@latest list           # 组件目录
npx @joyui/cli@latest add button --yes
npx @joyui/cli@latest mcp            # MCP stdio
npx @joyui/cli@latest skill          # 安装 Agent Skill
```

## MCP (Cursor / VS Code)

```json
{
  "mcpServers": {
    "joyui": {
      "command": "npx",
      "args": ["-y", "@joyui/cli@latest", "mcp"]
    }
  }
}
```

常用工具：`search_components`、`get_component`、`get_usage_examples`、`install_components`、`setup_agent`、`get_theme`。

Composer / charts / barcode / QR 为 **optional peers**；MCP 会在 `get_component` / `install_components` 中提示。

## Registry

配置 shadcn registry 后可：

```bash
npx shadcn@latest add @joyui/button
```

`components.json`：

```json
{
  "registries": {
    "@joyui": "https://joyui.dev/r/{name}.json"
  }
}
```
