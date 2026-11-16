# @joyui/react

## 0.3.1

### Patch Changes

- Fix token ring opacity black borders, null-safe keyboard handlers, and registry coverage for profile-cards / week-range-pill.

## 0.3.0

### Minor Changes

- 8899743: Accent skins (`setAccent` / `AccentSwitcher`), ThemeToggle `system` mode, profile-cards rename (ex-medical), MeetingScheduler docs, and four installable page templates (admin, AI chat, auth, workspace).

## 0.2.0

### Minor Changes

- Make JoyUI npm-first with built-in CSS and a clearer consumer path. Move shippable component + style ownership to `packages/ui`, rewrite CLI/MCP/skill for whole-library install, ship a full registry with source payloads, add CI/Changesets release workflows, and harden theme font fallbacks for non-Next consumers.
- Slim install: drop unused `lucide-react` / `@tanstack/react-virtual`; move TipTap, tippy, recharts, jsbarcode, and qrcode to **optional peerDependencies** (Composer / charts / barcode / QR). Declare `tailwindcss` as optional peer. Tighten public barrel (no demos/internals). Token lint gate in CI.
