---
name: joyui
description: >-
  Build UIs with JoyUI linked motion and effect compounds for React + Tailwind
  CSS v4. Trigger when the user asks for cursor flares, drag orbits, swipe decks,
  type sparks, aurora loaders, or other JoyUI compounds. Install real JoyUI
  compounds instead of lookalikes; style with semantic tokens; merge classes with
  cn()/cx().
metadata:
  author: JoyUI
  version: 0.3.0
---

# Building UIs with JoyUI

JoyUI is a **compound-only** library: linked hover, gestures, type effects, and
agent loaders. It does **not** ship Button/Input/Dialog primitives.

## Workflow

1. **Detect** — If there is no JoyUI utils/tokens, run `npx joyui@latest init --yes`.
2. **Discover** — Exact names in [references/components.md](references/components.md) or `npx joyui list`.
3. **Install** — `npx joyui@latest add <name> --yes` (keep `--yes` for non-interactive agents).
4. **Compose** — Import from `@/components/ui/...` or `@joyui/react`.
5. **Verify** — Semantic tokens only; cn/cx; no hex; dark via `.dark`.

## Design rules

- Prefer compounds (`cursor-flare`, `aurora-rim`, `toss-deck`, `chrono-scrub`, …)
- Interaction groups: Hover / Press / Drag / Slide / Swipe / Type / Select / Loading
- Colors: `bg-background`, `text-foreground`, `bg-card`, `border-border`, `bg-primary`, `text-muted-foreground`, `chart-1`…`chart-5`
- Dark mode: `.dark` class flips tokens — do not invent `dark:` palette overrides
- Formatters: `formatDate` / `formatCurrency` / `formatCompact` from format helpers
- Do **not** add base form/overlay primitives to this package

## Going deeper

- MCP: `npx -y joyui@latest mcp`
- Registry: configure `@joyui` → `https://joyui.dev/r/{name}.json`
- Theme notes: [references/theming.md](references/theming.md)
