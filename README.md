# JoyUI

React + Tailwind CSS v4 组件库。[文档](https://joyui.dev) · [GitHub](https://github.com/toctong/joyui)

安装思路对齐 [shadcn/ui Installation](https://ui.shadcn.com/docs/installation) / [Monorepo](https://ui.shadcn.com/docs/monorepo)：清晰路径 + registry；**默认是 npm 整库**（样式打进包）。

| Package | Role |
|---------|------|
| [`@joyui/react`](./packages/ui) | 整库组件 / utils / format / **内置 styles.css** |
| [`@joyui/cli`](./packages/cli) | init / list / add / mcp / skill |
| `apps/docs` | Fumadocs 文档站 |

## 业务项目安装

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

可选：`npx @joyui/cli@latest init --yes`（写入样式入口、agent rules、`components.json`）。

## 本仓库开发

权威源码在 `packages/ui`（见 [CONTRIBUTING.md](./CONTRIBUTING.md)）。

```bash
pnpm install
pnpm catalog:gen
pnpm --filter @joyui/react build
pnpm --filter @joyui/cli build
pnpm registry:build
pnpm --filter @joyui/docs dev
```

## 发版

Changesets + GitHub Actions。详见 [RELEASING.md](./RELEASING.md)。

```bash
pnpm changeset
```

## License

MIT
