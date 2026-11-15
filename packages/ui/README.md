# @joyui/react

JoyUI — React + Tailwind CSS v4 组件库。主题与组件 CSS **内置**，业务项目一次安装即可用。

## Install

```bash
pnpm add @joyui/react
```

Peer：`react` / `react-dom`。另需宿主安装 **Tailwind CSS v4**（optional peer，未装时样式管线会缺）。

可选 peer（按需安装，不装则对应组件不可用）：

| 能力 | 包 |
|------|-----|
| Composer（`@joyui/react/composer`） | `@tiptap/*`、`tippy.js` |
| Charts | `recharts` |
| Barcode / QR | `jsbarcode`、`qrcode` |

## Styles（必做一次）

```css
@import "tailwindcss";
@import "@joyui/react/styles.css";
```

`styles.css` 含 design tokens、复合字阶、组件规则，并用 `@source` 扫描包内 `dist`，无需再配置 content 路径。

详见 [vercel/components.build — CSS and Tailwind](https://github.com/vercel/components.build)：Tailwind 默认不扫 `node_modules`，包内 `@source` 就是为了解决这件事。

## Usage

```tsx
import { JoyUIProvider, Button, Input, DataTable } from "@joyui/react";

export function App() {
  return (
    <JoyUIProvider locale="zh-CN">
      <Button variant="primary">保存</Button>
      <Input label="邮箱" placeholder="you@company.com" />
    </JoyUIProvider>
  );
}
```

Composer（TipTap）走子路径：

```tsx
import { Composer } from "@joyui/react/composer";
```

## Optional：源码拷贝（shadcn 风格）

```bash
npx @joyui/cli@latest init --yes
npx @joyui/cli add button --yes
# 或
npx shadcn@latest add @joyui/button
```

## Tokens

- Text：`text-text-primary` / `text-text-secondary`
- Surfaces：`bg-background-primary-default` / `bg-background-full`
- Type：`text-title-2-medium` / `text-body-regular`（勿拆 `text-sm font-medium`）
- Dark：`<html class="dark">`

## Links

- Docs：https://joyui.dev
- Repo：https://github.com/toctong/joyui
- CLI：[`@joyui/cli`](https://www.npmjs.com/package/@joyui/cli)
