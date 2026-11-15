---
name: joyui
description: >-
  Build UIs with JoyUI (React + Tailwind CSS v4). Trigger when the user asks for
  JoyUI components, design tokens, charts, dashboards, or agent UI. Prefer the
  npm package @joyui/react with built-in CSS; install real JoyUI components
  instead of lookalikes; style with semantic tokens; merge classes with cn()/cx().
metadata:
  author: JoyUI
  version: "0.2.0"
---

# Building UIs with JoyUI

JoyUI is a **full component library** shipped as `@joyui/react`:
Button, Input, Select, Modal, DataTable, chart cards, templates, and more.
Theme + component CSS are **built into** `@joyui/react/styles.css`.

## Workflow (npm first)

1. **Install** — `pnpm add @joyui/react`
2. **CSS** — after Tailwind: `@import "@joyui/react/styles.css";`
3. **Provider** — wrap with `<JoyUIProvider locale="zh-CN">`
4. **Import** — `import { Button, Input, DataTable } from "@joyui/react"`
5. **Verify** — semantic tokens only; cn/cx; no hex; dark via `.dark`

Optional (shadcn-style source copy into the app):
`npx @joyui/cli@latest add <name> --yes`

Exact names: [references/components.md](references/components.md) or MCP `search_components`.

## Optional peers

Some surfaces need extra packages (not installed with `@joyui/react` by default):

| Surface | Import | Peers |
|---------|--------|-------|
| Composer | `@joyui/react/composer` | `@tiptap/*`, `tippy.js` |
| Charts | `@joyui/react` | `recharts` |
| Barcode / QR | `@joyui/react` | `jsbarcode` / `qrcode` |

Details: [references/peers.md](references/peers.md)

## Design rules

- Colors: `text-text-primary`, `bg-background-primary-default`, `bg-background-full`, `border-border-button-default`, `border-separator-border`, `accent-*`, `chart-1`…`chart-5`
- Status: `bg-status-*-background`, `bg-status-dot-*`, `bg-badge-count`, `bg-heatmap-1`…`4`
- Type: composite only — `text-title-2-medium`, `text-body-regular` (never stack `text-sm font-medium`)
- Dark mode: `.dark` class flips tokens — do not invent `dark:` palette overrides
- Icons: `@remixicon/react` as **component references** (`leadingIcon={RiAddLine}`)
- Formatters: `formatDate` / `formatCurrency` / `formatCompact` from `@joyui/react`

Pitfalls: [references/pitfalls.md](references/pitfalls.md)

## Going deeper

- MCP: `npx -y @joyui/cli@latest mcp` — use `search_components`, `get_component`, `get_usage_examples`
- Theme notes: [references/theming.md](references/theming.md)
- Init agent rules: `npx @joyui/cli@latest init --yes`
