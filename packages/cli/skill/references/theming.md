# Theming

JoyUI tokens ship inside `@joyui/react/styles.css` (theme + typography + component rules).

```css
@import "tailwindcss";
@import "@joyui/react/styles.css";
```

Consumers do **not** need to copy token files. The package entry also `@source`s its `dist/` so Tailwind v4 scans component class names automatically.

## Light / dark / system

```tsx
import { ThemeToggle, applyThemePreference } from "@joyui/react";

// Segmented control: light · system · dark
<ThemeToggle appearance="segmented" />

// Programmatic
applyThemePreference("system");
```

Preference is stored under `JoyUI:theme`. `system` follows `prefers-color-scheme` and updates live.

Boot before paint (optional anti-FOUC):

```html
<script>
  (function () {
    try {
      var t = localStorage.getItem("JoyUI:theme");
      var dark =
        t === "dark" ||
        (t === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", dark);
    } catch (e) {}
  })();
</script>
```

## Accent (brand hue)

Accent surfaces (`button-primary`, focus ring, selected nav, etc.) read `--color-accent-*`. Switch the whole ramp with presets:

```tsx
import { setAccent, AccentSwitcher, ACCENT_PRESETS } from "@joyui/react";

setAccent("violet"); // blue | violet | teal | orange | rose | mono

<AccentSwitcher />
```

`setAccent` writes `data-accent` on `<html>` (omitted for default blue) and persists `JoyUI:accent`.

## Token families

| Role | Examples |
|------|----------|
| Text | `text-text-primary`, `text-text-secondary`, `text-text-tertiary`, `text-text-placeholder`, `text-text-error-primary`, `text-text-white` |
| Surfaces | `bg-background-primary-default`, `bg-background-secondary-default`, `bg-background-tertiary-default`, `bg-background-full` |
| Borders | `border-border-button-default`, `border-border-secondary-default`, `border-separator-border`, `border-border-table`, `border-border-error-default`, `ring-border-focus-ring` |
| Status | `bg-status-lime-background` / `text-status-lime-text`, `bg-status-dot-green`, `bg-status-presence-online`, `bg-badge-count` |
| Heatmap | `bg-heatmap-1` … `bg-heatmap-4` |
| Accent | `accent-50` … `accent-950` |
| Charts | `chart-1` … `chart-5` (+ `chart-*-active`) |
| Type | `text-title-1-medium`, `text-title-2-medium`, `text-body-regular`, `text-caption-1-semibold` |

Light defaults live on `:root`; dark overrides under `.dark` on `<html>`.

Prefer semantic utilities over raw palette classes (`text-gray-500`, hex, oklch literals).

Optional fonts: set `--font-inter` / `--font-mono-source` (e.g. via next/font). Without them, system stacks are used.
