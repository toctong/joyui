# Releasing

发布流程对齐 [Changesets](https://github.com/changesets/changesets) + [Turborepo design-system](https://github.com/vercel/turborepo/tree/main/examples/design-system)。

## 包

| Package | 发布 |
|---------|------|
| `@joyui/react` | ✅ |
| `@joyui/cli` | ✅ |
| `@joyui/docs` | ❌（private，changeset ignore） |

## 本地准备

```bash
pnpm changeset          # 选择 bump + 写摘要 → .changeset/*.md
git add .changeset && git commit -m "chore: add changeset"
```

## 推荐：主分支手动发布

本仓库默认在 `main` 直接改与发布（不依赖 Version PR）。

```bash
pnpm install
pnpm typecheck && pnpm test
pnpm --filter @joyui/react build
pnpm --filter @joyui/cli build
# 有未消费的 .changeset 时：
pnpm version-packages
# 登录 npm 后发布（linked：react + cli 同版本）
pnpm release:publish
```

本地若 `.npmrc` 指向国内镜像，发布前可临时：

```bash
npm_config_registry=https://registry.npmjs.org pnpm release:publish
```

（`changeset publish` 不支持 `--registry` 参数。）CI 的 `release.yml` 会写入 `registry.npmjs.org` 的 auth，无需该 flag。

可选：配置 GitHub `NPM_TOKEN` + Actions 写权限后，`.github/workflows/release.yml` 也可自动 publish；未配置时请用上面的手动流程。

## 发布后核对

- https://www.npmjs.com/package/@joyui/react
- https://www.npmjs.com/package/@joyui/cli
- GitHub Releases 标签
