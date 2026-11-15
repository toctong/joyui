---
"@joyui/react": patch
---

Publish component CSS (Table, Skeleton, AgentThinking, charts, effects, etc.) via `@joyui/react/styles.css`. Styles previously lived only in the docs `globals.css`, so npm consumers got unstyled tables and missing animations. Sync now copies `apps/docs/styles/components.css` into the package and regenerates the styles entry.
