# Contributing

感谢参与 JoyUI。仓库是 pnpm + Turborepo monorepo。

## 结构

| 路径 | 说明 |
|------|------|
| `packages/ui` | **权威**：`@joyui/react` 组件 + 内置 CSS |
| `packages/cli` | `@joyui/cli`（init / add / mcp / skill） |
| `apps/docs` | 文档站（demos / MDX；可发布组件映射到 `packages/ui`） |

对齐 [shadcn monorepo](https://ui.shadcn.com/docs/monorepo)：可发布 UI 在 `packages/ui`，应用侧只消费。

## 开发

```bash
pnpm install
pnpm catalog:gen
pnpm --filter @joyui/react build
pnpm --filter @joyui/docs dev
```

改组件 / token：

1. 编辑 `packages/ui/src/components/**` 或 `packages/ui/src/styles/**`
2. `pnpm --filter @joyui/react barrel`（或 `build`）
3. 需要 registry 时：`pnpm registry:build`

## 检查

```bash
pnpm typecheck
pnpm test
pnpm --filter @joyui/react build
pnpm --filter @joyui/cli build
```

## 发版

用 Changesets（见 [RELEASING.md](./RELEASING.md)）：

```bash
pnpm changeset
```

提交 PR 时附带 changeset；合并到 `main` 后由维护者按 [RELEASING.md](./RELEASING.md) **本地手动**发版（CI 不自动 publish）。文档站由 Vercel workflow 部署。

## 设计约定

- 语义 token：`text-text-primary`、`bg-background-*-default`、`border-border-*`
- 复合字阶：`text-title-2-medium` 等，勿拆 `text-sm font-medium`
- 合并 class：`cn` / `cx`
- 深色：`.dark`，禁止 raw palette / hex
