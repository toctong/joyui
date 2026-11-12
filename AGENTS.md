# JoyUI monorepo — agent notes

## Packages

- `packages/ui` → npm `@joyui/react`（整库组件 / utils / format / tokens）
- `packages/cli` → npm `joyui`（init / add / mcp）
- `apps/docs` → Fumadocs 文档站（演示 JoyUI 组件）

## Product focus

自研 JoyUI 组件与文档：React + Tailwind CSS v4 + React Aria。

文档分区：

1. **快速入门** — 整库 npm / CLI / MCP
2. **基础规范** — color · typography · semantic tokens
3. **基础组件** — button · input · select · modal…
4. **组合组件** — agent / sidebar / data-grid…
5. **图表** — stat-cards · revenue · orders…
6. **模板** — 后台管理等完整页

禁止 raw palette / hex；深色靠 `.dark`。

## Design rules（docs / ui）

- Tokens: `text-text-primary` / `bg-background-*-default` / `border-border-*`
- Type: `text-title-2-medium` 等复合字阶，勿拆 `text-sm font-medium`
- Merge: `cx()` from `@joyui/react`（或 `@/utils/cx`）
- Icons: `@remixicon/react` 传组件引用

## Consumer install（推荐）

```bash
pnpm add @joyui/react react-aria-components @remixicon/react
```

```tsx
import "@joyui/react/styles.css";
import { Button, DataTable } from "@joyui/react";
```

CLI `npx joyui add <name>` 仅在需要把源码拷进业务仓库时使用。

## Build

```bash
pnpm install
pnpm --filter @joyui/react build
pnpm registry:build
pnpm --filter @joyui/docs dev
```
