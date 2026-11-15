# JoyUI monorepo — agent notes

## Packages

- `packages/ui` → npm `@joyui/react`（**源码与样式的权威** / utils / format / 内置 styles.css）
- `packages/cli` → npm `@joyui/cli`（init / list / add / mcp / skill）
- `apps/docs` → Fumadocs 文档站（demos / MDX；可发布组件通过 path 映射到 `packages/ui`）

## Product focus

自研 JoyUI：React + Tailwind CSS v4 + React Aria。

消费端默认路径：

```bash
pnpm add @joyui/react
```

```css
@import "tailwindcss";
@import "@joyui/react/styles.css";
```

```tsx
import { JoyUIProvider, Button, DataTable } from "@joyui/react";
```

CLI `npx @joyui/cli add <name>` 仅在需要把源码拷进业务仓库时使用。

## Source of truth

| 内容 | 编辑位置 |
|------|----------|
| 可发布组件 | `packages/ui/src/components/**` |
| Token / 字阶 / 组件 CSS | `packages/ui/src/styles/**` |
| Docs 专用壳（landing glass、html/body） | `apps/docs/styles/globals.css` |
| Docs demos / MDX / agent-chat 等 | `apps/docs/**`（非 shippable） |

改组件后：`pnpm --filter @joyui/react barrel`（或 `build`）。  
禁止再把 docs 组件 sync 进 package。

## Design rules

- Tokens: `text-text-primary` / `bg-background-*-default` / `border-border-*`
- Type: `text-title-2-medium` 等复合字阶，勿拆 `text-sm font-medium`
- Merge: `cx()` / `cn()` from `@joyui/react`
- Icons: `@remixicon/react` 传组件引用
- 深色：`.dark`；禁止 raw palette / hex

## Build

```bash
pnpm install
pnpm catalog:gen
pnpm --filter @joyui/react build
pnpm --filter @joyui/cli build
pnpm registry:build
pnpm --filter @joyui/docs dev
```

发版见 `RELEASING.md`；贡献见 `CONTRIBUTING.md`。CI：`.github/workflows/ci.yml` + Changesets `release.yml`。
