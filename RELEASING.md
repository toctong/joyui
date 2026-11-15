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

## CI 自动发布

1. 合并含 changeset 的 PR 到 `main`
2. **Release** workflow（`.github/workflows/release.yml`）会：
   - 开 **Version Packages** PR（升版本 + CHANGELOG），或
   - 在 Version PR 合并后执行 `pnpm release:publish` 发到 npm

### Secrets

| Secret | 说明 |
|--------|------|
| `NPM_TOKEN` | npm **Automation** token（不要用 Publish，会要 OTP） |
| `GITHUB_TOKEN` | Actions 自带，用于开 PR / GitHub Release |

在 GitHub → Settings → Actions → General，开启 **Allow GitHub Actions to create and approve pull requests**。

## 手动发布（应急）

```bash
pnpm install
pnpm catalog:gen
pnpm --filter @joyui/react build
pnpm --filter @joyui/cli build
pnpm version-packages
# 确认 CHANGELOG / package.json 版本
pnpm release:publish
```

`release:publish` 使用官方 `registry.npmjs.org`（与本地 `.npmrc` 镜像无关）。

## 发布后核对

- https://www.npmjs.com/package/@joyui/react
- https://www.npmjs.com/package/@joyui/cli
- GitHub Releases 标签
