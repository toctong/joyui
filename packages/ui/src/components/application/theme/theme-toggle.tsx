"use client";

import { useTemplateCopy } from "../../foundations/template-copy/template-copy";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { RiComputerLine, RiMoonLine, RiSunLine } from "@remixicon/react";
import { Switch as AriaSwitch } from "react-aria-components";
import { SwitchTrack } from "../../base/switch/switch";
import { cx } from "../../../utils/cx";

/** Resolved appearance applied to `<html class="dark">`. */
export type ThemeMode = "light" | "dark";
/** Stored preference — `system` follows `prefers-color-scheme`. */
export type ThemePreference = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "JoyUI:theme";
export const THEME_CHANGE_EVENT = "JoyUI:theme-change";

const THEME_TRANSITION_DURATION = 820;
const THEME_TRANSITION_EASING = "cubic-bezier(0.16, 1, 0.3, 1)";
const THEME_TRANSITION_STYLE_ID = "JoyUI-theme-transition-style";

type ThemeTransitionOrigin = { x: number; y: number };

type ViewTransition = {
  ready: Promise<void>;
  finished: Promise<void>;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => ViewTransition;
};

let themeTransitionRunning = false;
let mediaQueryListenerAttached = false;

function createBlurCircleMask() {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">',
    '<defs><filter id="blur" x="-50%" y="-50%" width="200%" height="200%">',
    '<feGaussianBlur stdDeviation="2" /></filter></defs>',
    '<circle cx="50" cy="50" r="42" fill="white" filter="url(#blur)" />',
    "</svg>",
  ].join("");

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function installThemeTransitionStyle(
  { x, y }: ThemeTransitionOrigin,
  radius: number,
  duration: number,
) {
  document.getElementById(THEME_TRANSITION_STYLE_ID)?.remove();

  const mask = createBlurCircleMask();
  const finalMaskSize = radius * 2.5;
  const finalMaskX = x - finalMaskSize / 2;
  const finalMaskY = y - finalMaskSize / 2;
  const style = document.createElement("style");
  style.id = THEME_TRANSITION_STYLE_ID;
  style.textContent = `
    ::view-transition-new(root) {
      -webkit-mask-image: ${mask};
      mask-image: ${mask};
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
      animation: JoyUI-theme-mask-reveal ${duration}ms ${THEME_TRANSITION_EASING} both;
      transform-origin: ${x}px ${y}px;
      will-change: -webkit-mask-size, -webkit-mask-position, mask-size, mask-position;
    }

    @keyframes JoyUI-theme-mask-reveal {
      from {
        -webkit-mask-position: ${x}px ${y}px;
        mask-position: ${x}px ${y}px;
        -webkit-mask-size: 0px 0px;
        mask-size: 0px 0px;
      }
      to {
        -webkit-mask-position: ${finalMaskX}px ${finalMaskY}px;
        mask-position: ${finalMaskX}px ${finalMaskY}px;
        -webkit-mask-size: ${finalMaskSize}px ${finalMaskSize}px;
        mask-size: ${finalMaskSize}px ${finalMaskSize}px;
      }
    }
  `;
  document.head.appendChild(style);
  return style;
}

function systemTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function parsePreference(raw: string | null): ThemePreference {
  if (raw === "dark" || raw === "system" || raw === "light") return raw;
  return "light";
}

export function storedThemePreference(): ThemePreference {
  if (typeof window === "undefined") return "light";
  try {
    return parsePreference(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return "light";
  }
}

/** @deprecated Prefer `storedThemePreference`. Kept for older call sites. */
export function storedTheme(): ThemeMode {
  const pref = storedThemePreference();
  return pref === "system" ? systemTheme() : pref;
}

export function resolveTheme(preference: ThemePreference): ThemeMode {
  return preference === "system" ? systemTheme() : preference;
}

function ensureSystemListener() {
  if (typeof window === "undefined" || mediaQueryListenerAttached) return;
  mediaQueryListenerAttached = true;
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    if (storedThemePreference() !== "system") return;
    applyResolvedTheme(systemTheme(), { persist: false, preference: "system" });
  };
  mq.addEventListener("change", onChange);
}

function applyResolvedTheme(
  theme: ThemeMode,
  {
    persist = true,
    preference,
  }: { persist?: boolean; preference?: ThemePreference } = {},
) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  const stored = preference ?? theme;
  if (persist) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, stored);
    } catch {
      // storage blocked
    }
  }
  window.dispatchEvent(
    new CustomEvent(THEME_CHANGE_EVENT, {
      detail: { theme, preference: stored },
    }),
  );
}

/**
 * Apply a resolved light/dark class. Prefer `applyThemePreference` when the
 * user may choose `system`.
 */
export function applyTheme(theme: ThemeMode, { persist = true }: { persist?: boolean } = {}) {
  applyResolvedTheme(theme, { persist, preference: theme });
}

export function applyThemePreference(
  preference: ThemePreference,
  { persist = true }: { persist?: boolean } = {},
) {
  ensureSystemListener();
  applyResolvedTheme(resolveTheme(preference), { persist, preference });
}

function elementCenter(element: HTMLElement | null): ThemeTransitionOrigin {
  if (!element) {
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  }
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

function normalizedOrigin(
  origin: ThemeTransitionOrigin | null,
  element: HTMLElement | null,
): ThemeTransitionOrigin {
  const fallback = elementCenter(element);
  const x = origin?.x ?? fallback.x;
  const y = origin?.y ?? fallback.y;
  return {
    x: Math.min(Math.max(x, 0), window.innerWidth),
    y: Math.min(Math.max(y, 0), window.innerHeight),
  };
}

export async function applyThemeWithTransition(
  theme: ThemeMode,
  {
    origin = null,
    element = null,
    duration = THEME_TRANSITION_DURATION,
  }: {
    origin?: ThemeTransitionOrigin | null;
    element?: HTMLElement | null;
    duration?: number;
  } = {},
) {
  if (typeof document === "undefined" || currentTheme() === theme) return;

  const transitionDocument = document as ViewTransitionDocument;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!transitionDocument.startViewTransition || reduceMotion) {
    applyTheme(theme);
    return;
  }
  if (themeTransitionRunning) return;

  const { x, y } = normalizedOrigin(origin, element);
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  themeTransitionRunning = true;
  document.documentElement.classList.add("theme-transitioning");
  const transitionStyle = installThemeTransitionStyle({ x, y }, radius, duration);
  try {
    const transition = transitionDocument.startViewTransition(() => {
      flushSync(() => applyTheme(theme));
    });

    await transition.ready;
    await transition.finished;
  } catch {
    if (currentTheme() !== theme) applyTheme(theme);
  } finally {
    transitionStyle.remove();
    document.documentElement.classList.remove("theme-transitioning");
    themeTransitionRunning = false;
  }
}

export async function applyThemePreferenceWithTransition(
  preference: ThemePreference,
  {
    origin = null,
    element = null,
    duration = THEME_TRANSITION_DURATION,
  }: {
    origin?: ThemeTransitionOrigin | null;
    element?: HTMLElement | null;
    duration?: number;
  } = {},
) {
  if (typeof document === "undefined") return;
  const next = resolveTheme(preference);
  if (currentThemePreference() === preference && currentTheme() === next) return;

  const transitionDocument = document as ViewTransitionDocument;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!transitionDocument.startViewTransition || reduceMotion) {
    applyThemePreference(preference);
    return;
  }
  if (themeTransitionRunning) return;

  const { x, y } = normalizedOrigin(origin, element);
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  themeTransitionRunning = true;
  document.documentElement.classList.add("theme-transitioning");
  const transitionStyle = installThemeTransitionStyle({ x, y }, radius, duration);
  try {
    const transition = transitionDocument.startViewTransition(() => {
      flushSync(() => applyThemePreference(preference));
    });
    await transition.ready;
    await transition.finished;
  } catch {
    applyThemePreference(preference);
  } finally {
    transitionStyle.remove();
    document.documentElement.classList.remove("theme-transitioning");
    themeTransitionRunning = false;
  }
}

function currentTheme(): ThemeMode {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function currentThemePreference(): ThemePreference {
  return storedThemePreference();
}

function subscribe(onStoreChange: () => void) {
  ensureSystemListener();
  const onThemeChange = () => onStoreChange();
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    applyThemePreference(parsePreference(event.newValue), { persist: false });
  };
  window.addEventListener(THEME_CHANGE_EVENT, onThemeChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** Resolved light/dark currently on `<html>`. */
export function useThemeMode(): ThemeMode {
  return useSyncExternalStore(subscribe, currentTheme, () => "light");
}

/** Stored preference including `system`. */
export function useThemePreference(): ThemePreference {
  return useSyncExternalStore(subscribe, currentThemePreference, () => "light");
}

export interface ThemeToggleProps {
  collapsed?: boolean;
  appearance?: "sidebar" | "segmented" | "sidebar-segmented" | "glass-segmented";
  className?: string;
  size?: "small" | "medium";
  transitionDuration?: number;
  /**
   * When true (default for segmented appearances), show light / system / dark.
   * Sidebar switch stays a binary dark-mode toggle of the resolved theme.
   */
  showSystem?: boolean;
}

/** Light / dark / system control with optional circular view-transition. */
export function ThemeToggle({
  collapsed = false,
  appearance = "sidebar",
  className,
  size = "medium",
  transitionDuration = THEME_TRANSITION_DURATION,
  showSystem = true,
}: ThemeToggleProps) {
  const localize = useTemplateCopy();
  const theme = useThemeMode();
  const preference = useThemePreference();
  const dark = theme === "dark";
  const switchRef = useRef<HTMLLabelElement | null>(null);
  const pointerOriginRef = useRef<ThemeTransitionOrigin | null>(null);

  useEffect(() => {
    applyThemePreference(storedThemePreference(), { persist: false });
  }, []);

  if (
    appearance === "segmented" ||
    appearance === "sidebar-segmented" ||
    appearance === "glass-segmented"
  ) {
    const glass = appearance === "glass-segmented";
    const small = size === "small" && !glass;
    const sidebarSurface = appearance === "sidebar-segmented";
    const options = showSystem
      ? ([
          { mode: "light" as const, label: "Use light mode", Icon: RiSunLine },
          { mode: "system" as const, label: "Use system theme", Icon: RiComputerLine },
          { mode: "dark" as const, label: "Use dark mode", Icon: RiMoonLine },
        ] as const)
      : ([
          { mode: "light" as const, label: "Use light mode", Icon: RiSunLine },
          { mode: "dark" as const, label: "Use dark mode", Icon: RiMoonLine },
        ] as const);

    const selectedIndex = Math.max(
      0,
      options.findIndex((o) => o.mode === preference),
    );
    const step = small ? 26 : glass ? 32 : 36;

    return localize((
      <div
        role="group"
        aria-label="Theme"
        className={cx(
          "relative inline-flex w-fit items-center gap-1 rounded-full p-1",
          glass && "p-0.5 sm:p-1",
          small && "gap-0.5 p-0.5",
          glass
            ? "z-10 bg-transparent"
            : sidebarSurface
              ? "bg-theme-toggle-sidebar-background"
              : "bg-background-secondary-default",
          className,
        )}
      >
        <span
          aria-hidden
          className={cx(
            "pointer-events-none absolute top-1 start-1 size-8 rounded-full",
            "shadow-xs transition-transform duration-200 ease",
            glass && "top-0.5 start-0.5 size-7 sm:top-1 sm:start-1 sm:size-8",
            small && "top-0.5 start-0.5 size-6",
            glass
              ? "bg-white dark:bg-[#2e2e33]"
              : sidebarSurface
                ? "bg-theme-toggle-sidebar-selected-background"
                : "bg-background-primary-default",
          )}
          style={{
            transform: `translateX(${selectedIndex * step}px)`,
          }}
        />
        {options.map(({ mode, label, Icon }) => {
          const selected = preference === mode;
          return (
            <button
              key={mode}
              type="button"
              aria-label={label}
              aria-pressed={selected}
              title={mode === "system" ? "System" : mode === "light" ? "Light mode" : "Dark mode"}
              onClick={(event) => {
                if (selected) return;
                const pointerOrigin =
                  event.clientX === 0 && event.clientY === 0
                    ? null
                    : { x: event.clientX, y: event.clientY };
                void applyThemePreferenceWithTransition(mode, {
                  origin: pointerOrigin,
                  element: event.currentTarget,
                  duration: transitionDuration,
                });
              }}
              className={cx(
                "relative z-10 grid size-8 cursor-pointer place-items-center rounded-full outline-none",
                glass && "size-7 sm:size-8",
                small && "size-6",
                "transition-colors duration-150 ease",
                "focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                glass
                  ? selected
                    ? "text-black dark:text-white"
                    : "text-black/45 hover:text-black/70 dark:text-white/45 dark:hover:text-white/70"
                  : selected
                    ? "text-foreground-icon-primary"
                    : "text-foreground-icon-secondary hover:text-foreground-icon-primary",
              )}
            >
              <Icon className={small ? "size-3.5" : "size-4"} aria-hidden />
            </button>
          );
        })}
      </div>
    ));
  }

  if (collapsed) {
    const Icon = dark ? RiSunLine : RiMoonLine;
    return localize((
      <button
        type="button"
        aria-label={dark ? "Use light mode" : "Use dark mode"}
        aria-pressed={dark}
        title={dark ? "Light mode" : "Dark mode"}
        onClick={(event) => {
          const pointerOrigin =
            event.clientX === 0 && event.clientY === 0
              ? null
              : { x: event.clientX, y: event.clientY };
          void applyThemePreferenceWithTransition(dark ? "light" : "dark", {
            origin: pointerOrigin,
            element: event.currentTarget,
            duration: transitionDuration,
          });
        }}
        className={cx(
          "flex size-9 cursor-pointer items-center justify-center rounded-2lg",
          "text-foreground-icon-secondary transition-colors duration-150 ease",
          "hover:bg-background-secondary-hover hover:text-foreground-icon-primary",
          "outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
          className,
        )}
      >
        <Icon className="size-5" aria-hidden />
      </button>
    ));
  }

  return localize((
    <AriaSwitch
      ref={switchRef}
      isSelected={dark}
      onPointerDown={(event) => {
        pointerOriginRef.current = { x: event.clientX, y: event.clientY };
      }}
      onChange={(selected) => {
        const origin = pointerOriginRef.current;
        pointerOriginRef.current = null;
        void applyThemePreferenceWithTransition(selected ? "dark" : "light", {
          origin,
          element: switchRef.current,
          duration: transitionDuration,
        });
      }}
      aria-label="Dark mode"
      className={({ isFocusVisible }) =>
        cx(
          "flex w-full cursor-pointer items-center justify-between rounded-2lg p-2",
          "transition-colors duration-150 ease hover:bg-background-secondary-hover",
          isFocusVisible && "ring-2 ring-inset ring-border-focus-ring",
          className,
        )
      }
    >
      {(state) => (
        <>
          <span className="flex min-w-0 items-center gap-2">
            <RiMoonLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
            <span className="text-body-medium text-text-secondary">Dark mode</span>
          </span>
          <SwitchTrack state={state} size="sm" shape="pill" />
        </>
      )}
    </AriaSwitch>
  ));
}
