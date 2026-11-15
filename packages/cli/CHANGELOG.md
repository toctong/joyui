# @joyui/cli

## 0.2.0

### Minor Changes

- Make JoyUI npm-first with built-in CSS and a clearer consumer path. Move shippable component + style ownership to `packages/ui`, rewrite CLI/MCP/skill for whole-library install, ship a full registry with source payloads, add CI/Changesets release workflows, and harden theme font fallbacks for non-Next consumers.
- Harden `add`/`init` writes (cwd jail + https-only registry); emit typography-aware `cn`/`cx`; `--version` reads package.json.
