---
"@joyui/react": patch
---

Add missing `--color-border-secondary-default` and `--color-text-brand-primary` theme tokens. Card / List / DataTable used `border-border-secondary-default` without a token, so borders fell back to currentColor (looked like a black outline in consumer apps).
