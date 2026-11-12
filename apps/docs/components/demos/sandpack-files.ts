/** Shared virtual files for Sandpack demos (CDN can't resolve workspace packages). */

export const UTILS_FILE = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cx = cn;
`;

export const TOKENS_CSS = `:root {
  --joy-background: oklch(0.99 0.002 247);
  --joy-foreground: oklch(0.22 0.02 255);
  --joy-card: oklch(1 0 0);
  --joy-card-foreground: oklch(0.22 0.02 255);
  --joy-popover: oklch(1 0 0);
  --joy-popover-foreground: oklch(0.22 0.02 255);
  --joy-primary: oklch(0.45 0.12 250);
  --joy-primary-foreground: oklch(0.99 0 0);
  --joy-secondary: oklch(0.95 0.01 250);
  --joy-secondary-foreground: oklch(0.3 0.03 250);
  --joy-muted: oklch(0.96 0.008 250);
  --joy-muted-foreground: oklch(0.5 0.02 255);
  --joy-accent: oklch(0.94 0.02 200);
  --joy-accent-foreground: oklch(0.28 0.04 220);
  --joy-destructive: oklch(0.55 0.2 25);
  --joy-border: oklch(0.9 0.01 250);
  --joy-input: oklch(0.9 0.01 250);
  --joy-ring: oklch(0.55 0.1 250);
  --joy-radius: 0.625rem;
  font-family: ui-sans-serif, system-ui, sans-serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background: var(--joy-background);
  color: var(--joy-foreground);
}

#root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.demo-stack {
  display: flex;
  width: 100%;
  max-width: 24rem;
  flex-direction: column;
  gap: 0.75rem;
}

.demo-label {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.joy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  border-radius: calc(var(--joy-radius) - 2px);
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s, border-color 0.15s, opacity 0.15s;
}

.joy-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--joy-background), 0 0 0 4px var(--joy-ring);
}

.joy-btn:disabled {
  pointer-events: none;
  opacity: 0.5;
}

.joy-btn-default {
  background: var(--joy-primary);
  color: var(--joy-primary-foreground);
}
.joy-btn-default:hover {
  filter: brightness(0.92);
}

.joy-btn-secondary {
  background: var(--joy-secondary);
  color: var(--joy-secondary-foreground);
}
.joy-btn-secondary:hover {
  filter: brightness(0.96);
}

.joy-btn-outline {
  border-color: var(--joy-border);
  background: var(--joy-background);
  color: var(--joy-foreground);
}
.joy-btn-outline:hover {
  background: var(--joy-accent);
  color: var(--joy-accent-foreground);
}

.joy-btn-ghost {
  background: transparent;
  color: var(--joy-foreground);
}
.joy-btn-ghost:hover {
  background: var(--joy-accent);
  color: var(--joy-accent-foreground);
}

.joy-btn-destructive {
  background: var(--joy-destructive);
  color: #fff;
}
.joy-btn-destructive:hover {
  filter: brightness(0.92);
}

.joy-btn-link {
  background: transparent;
  color: var(--joy-primary);
  text-decoration: underline;
  text-underline-offset: 4px;
}

.joy-btn-md {
  height: 2.25rem;
  padding: 0.5rem 1rem;
}
.joy-btn-sm {
  height: 2rem;
  padding: 0 0.75rem;
  font-size: 0.75rem;
}
.joy-btn-lg {
  height: 2.5rem;
  padding: 0 1.5rem;
}
.joy-btn-icon {
  height: 2.25rem;
  width: 2.25rem;
  padding: 0;
}

.joy-badge {
  display: inline-flex;
  align-items: center;
  border-radius: calc(var(--joy-radius) - 2px);
  border: 1px solid transparent;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.joy-badge-default {
  background: var(--joy-primary);
  color: var(--joy-primary-foreground);
}
.joy-badge-secondary {
  background: var(--joy-secondary);
  color: var(--joy-secondary-foreground);
}
.joy-badge-outline {
  border-color: var(--joy-border);
  color: var(--joy-foreground);
}
.joy-badge-success {
  background: color-mix(in oklab, oklch(0.7 0.17 150) 15%, transparent);
  color: oklch(0.45 0.14 150);
}
.joy-badge-warning {
  background: color-mix(in oklab, oklch(0.75 0.15 75) 15%, transparent);
  color: oklch(0.5 0.14 75);
}
.joy-badge-destructive {
  background: color-mix(in oklab, var(--joy-destructive) 15%, transparent);
  color: var(--joy-destructive);
}

.joy-input {
  display: flex;
  height: 2.25rem;
  width: 100%;
  border-radius: calc(var(--joy-radius) - 2px);
  border: 1px solid var(--joy-input);
  background: transparent;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  color: var(--joy-foreground);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.04);
}

.joy-input::placeholder {
  color: var(--joy-muted-foreground);
}

.joy-input:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--joy-background), 0 0 0 4px var(--joy-ring);
}

.joy-input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.joy-switch {
  display: inline-flex;
  height: 1.25rem;
  width: 2.25rem;
  flex-shrink: 0;
  cursor: pointer;
  align-items: center;
  border-radius: 9999px;
  border: 2px solid transparent;
  background: var(--joy-input);
  transition: background-color 0.15s;
}

.joy-switch[data-state="checked"] {
  background: var(--joy-primary);
}

.joy-switch:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--joy-background), 0 0 0 4px var(--joy-ring);
}

.joy-switch:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.joy-switch-thumb {
  display: block;
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  background: var(--joy-background);
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
  transition: transform 0.15s;
  transform: translateX(0);
}

.joy-switch[data-state="checked"] .joy-switch-thumb {
  transform: translateX(1rem);
}

.joy-checkbox {
  display: inline-flex;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  border: 1px solid var(--joy-primary);
  background: transparent;
  color: var(--joy-primary-foreground);
  cursor: pointer;
}

.joy-checkbox[data-state="checked"] {
  background: var(--joy-primary);
}

.joy-checkbox:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--joy-background), 0 0 0 4px var(--joy-ring);
}

.joy-checkbox:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.joy-checkbox-icon {
  width: 0.875rem;
  height: 0.875rem;
}
`;

export const INDEX_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>JoyUI Sandpack</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;

export const INDEX_TSX = `import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./src/styles.css";
import App from "./src/App";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`;

/** CRA / Sandpack: baseUrl src + @/* → project-style imports. */
export const TSCONFIG = `{
  "include": ["src"],
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "lib": ["dom", "es2015"],
    "jsx": "react-jsx",
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
`;

export const BUTTON_FILE = `import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("joy-btn", {
  variants: {
    variant: {
      default: "joy-btn-default",
      secondary: "joy-btn-secondary",
      outline: "joy-btn-outline",
      ghost: "joy-btn-ghost",
      destructive: "joy-btn-destructive",
      link: "joy-btn-link",
    },
    size: {
      default: "joy-btn-md",
      sm: "joy-btn-sm",
      lg: "joy-btn-lg",
      icon: "joy-btn-icon",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";
`;

export const BADGE_FILE = `import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("joy-badge", {
  variants: {
    variant: {
      default: "joy-badge-default",
      secondary: "joy-badge-secondary",
      outline: "joy-badge-outline",
      success: "joy-badge-success",
      warning: "joy-badge-warning",
      destructive: "joy-badge-destructive",
    },
  },
  defaultVariants: { variant: "default" },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
`;

export const INPUT_FILE = `import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input type={type} className={cn("joy-input", className)} ref={ref} {...props} />
));
Input.displayName = "Input";
`;

export const SWITCH_FILE = `import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root className={cn("joy-switch", className)} {...props} ref={ref}>
    <SwitchPrimitives.Thumb className="joy-switch-thumb" />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;
`;

export const CHECKBOX_FILE = `import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root ref={ref} className={cn("joy-checkbox", className)} {...props}>
    <CheckboxPrimitive.Indicator>
      <svg viewBox="0 0 24 24" className="joy-checkbox-icon" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
`;

export const BASE_DEPENDENCIES: Record<string, string> = {
  clsx: "^2.1.1",
  "tailwind-merge": "^3.3.1",
  "class-variance-authority": "^0.7.1",
  "@radix-ui/react-slot": "^1.2.3",
  "@radix-ui/react-switch": "^1.2.5",
  "@radix-ui/react-checkbox": "^1.3.2",
};

type SandboxFile = string | { code: string; hidden?: boolean; active?: boolean };

export function createSandboxFiles(
  appCode: string,
  extraFiles: Record<string, string> = {},
): Record<string, SandboxFile> {
  const hiddenExtras = Object.fromEntries(
    Object.entries(extraFiles).map(([filePath, code]) => [
      filePath.startsWith("/src/") ? filePath : `/src${filePath}`,
      { code, hidden: true },
    ]),
  );

  return {
    "/public/index.html": { code: INDEX_HTML, hidden: true },
    "/index.tsx": { code: INDEX_TSX, hidden: true },
    "/tsconfig.json": { code: TSCONFIG, hidden: true },
    "/jsconfig.json": { code: TSCONFIG, hidden: true },
    "/src/styles.css": { code: TOKENS_CSS, hidden: true },
    "/src/lib/utils.ts": { code: UTILS_FILE, hidden: true },
    "/src/App.tsx": { code: appCode.trim() + "\n", active: true },
    ...hiddenExtras,
  };
}
