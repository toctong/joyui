# Optional peers

`@joyui/react` keeps TipTap / charts / barcode / QR as **optional peerDependencies** so a Button-only app stays light.

Install peers only when you import those surfaces.

## Composer (TipTap)

```bash
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-mention @tiptap/extension-placeholder @tiptap/suggestion @tiptap/pm tippy.js
```

```tsx
import { Composer, ComposerPanel } from "@joyui/react/composer";
```

Do **not** import Composer from the root `@joyui/react` barrel.

## Charts (recharts)

```bash
pnpm add recharts
```

Used by dashboard chart cards (`AreaChartCard`, `RevenueChartCard`, `ComboChartCard`, …).

## Barcode / QR

```bash
pnpm add jsbarcode   # <Barcode />
pnpm add qrcode      # <QrCode />
```

## Tailwind

Tailwind CSS v4 is an optional peer of the package but **required** in the app CSS pipeline:

```css
@import "tailwindcss";
@import "@joyui/react/styles.css";
```
