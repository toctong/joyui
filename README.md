# JoyUI

文档站分区：快速入门 · 基础规范 · 基础组件 · 组合组件 · 图表 · 模板。

| Package | Role |
|---------|------|
| `@joyui/react` | 整库组件 / utils / format / tokens |
| `@joyui/cli` | init / add（可选源码拷贝）/ mcp |
| `apps/docs` | Fumadocs + JoyUI 组件演示 |

## 业务项目安装

```bash
pnpm add @joyui/react
```

表格、图表、图标、动画、日期、Composer（TipTap）等已作为包内 dependencies 随库安装；只需再提供 `react` / `react-dom` 与 Tailwind CSS v4。

```css
@import "tailwindcss";
@import "@joyui/react/styles.css";
```

```tsx
import { Button, DataTable, AdminDashboard } from "@joyui/react";
```

## 本仓库开发

```bash
pnpm install
pnpm --filter @joyui/docs dev
```

构建组件包：

```bash
pnpm --filter @joyui/react build
```

## License

MIT
