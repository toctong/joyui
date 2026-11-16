# Releasing

npm 发布为**本地手动**流程（不走 GitHub Actions）。文档站由 Vercel workflows 部署：

- `vercel-production.yml` — `main` 推送后更新生产文档站
- `vercel-preview.yml` — PR 预览

## 包

| Package | 发布 |
|---------|------|
| `@joyui/react` | ✅ 手动 |
| `@joyui/cli` | ✅ 手动 |
| `@joyui/docs` | ❌（private；走 Vercel） |

## 本地准备

```bash
pnpm changeset          # 选择 bump + 写摘要 → .changeset/*.md
git add .changeset && git commit -m "chore: add changeset"
```

## 主分支手动发布

```bash
pnpm install
pnpm typecheck && pnpm test
pnpm --filter @joyui/react build
pnpm --filter @joyui/cli build
# 有未消费的 .changeset 时：
pnpm version-packages
git add packages/*/package.json packages/*/CHANGELOG.md .changeset
git commit -m "chore: release"
```

然后任选一种发布方式：

```bash
# 方式 A：changeset（推荐）
npm_config_registry=https://registry.npmjs.org pnpm exec changeset publish

# 方式 B：直接 npm（需 OTP 时加 --otp=******）
cd packages/ui && npm publish --access public
cd ../cli && npm publish --access public
```

`changeset publish` 不支持 `--registry`；本地若 `.npmrc` 指向国内镜像，用上面的 `npm_config_registry=...` 或临时改 registry。

发布后：`git push origin main --follow-tags`

## 发布后核对

- https://www.npmjs.com/package/@joyui/react
- https://www.npmjs.com/package/@joyui/cli
- 文档站 Vercel 生产部署
