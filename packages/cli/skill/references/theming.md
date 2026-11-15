# Theming

JoyUI tokens ship inside `@joyui/react/styles.css` (theme + typography + component rules).

```css
@import "tailwindcss";
@import "@joyui/react/styles.css";
```

Consumers do **not** need to copy token files. The package entry also `@source`s its `dist/` so Tailwind v4 scans component class names automatically.

## Token families

| Role | Examples |
|------|----------|
| Text | `text-text-primary`, `text-text-secondary`, `text-text-tertiary`, `text-text-placeholder`, `text-text-error-primary` |
| Surfaces | `bg-background-primary-default`, `bg-background-secondary-default`, `bg-background-tertiary-default`, `bg-background-full` |
| Borders | `border-border-button-default`, `border-separator-border`, `border-border-table`, `border-border-error-default`, `ring-border-focus-ring` |
| Accent | `accent-50` … `accent-950` |
| Charts | `chart-1` … `chart-5` |
| Type | `text-title-1-medium`, `text-title-2-medium`, `text-body-regular`, `text-caption-1-semibold` |

Light defaults live on `:root`; dark overrides under `.dark` on `<html>`.

Prefer semantic utilities over raw palette classes (`text-gray-500`, hex, oklch literals).
