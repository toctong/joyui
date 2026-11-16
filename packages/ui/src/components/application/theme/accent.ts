/**
 * Accent (brand hue) engine. Overrides the `--color-accent-*` ramp via
 * `data-accent` on `<html>` so every accent-token surface retints together.
 *
 * Defaults to blue (same as theme.css @theme). Call `setAccent("violet")` or
 * mount `<AccentSwitcher />` — consumers never edit CSS variables by hand.
 */

export type AccentId = "blue" | "violet" | "teal" | "orange" | "rose" | "mono";

export const ACCENT_STORAGE_KEY = "JoyUI:accent";
export const ACCENT_CHANGE_EVENT = "JoyUI:accent-change";

export type AccentPreset = {
  id: AccentId;
  /** English label (docs / a11y fallback). */
  label: string;
  /** Chinese label for settings / admin surfaces. */
  labelZh: string;
  /** Swatch for the switcher UI (≈ accent-500). */
  swatch: string;
};

/** Public preset list — keep in sync with `[data-accent]` rules in theme.css. */
const ACCENT_PRESETS_LIST: AccentPreset[] = [
  { id: "blue", label: "Blue", labelZh: "蓝色", swatch: "#3b82f6" },
  { id: "violet", label: "Violet", labelZh: "紫色", swatch: "#8b5cf6" },
  { id: "teal", label: "Teal", labelZh: "青色", swatch: "#14b8a6" },
  { id: "orange", label: "Orange", labelZh: "橙色", swatch: "#f97316" },
  { id: "rose", label: "Rose", labelZh: "玫红", swatch: "#f43f5e" },
  { id: "mono", label: "Mono", labelZh: "灰色", swatch: "#71717a" },
];

export { ACCENT_PRESETS_LIST as ACCENT_PRESETS };

const ACCENT_IDS = new Set<string>(ACCENT_PRESETS_LIST.map((p) => p.id));

export function isAccentId(value: string | null | undefined): value is AccentId {
  return !!value && ACCENT_IDS.has(value);
}

export function getAccent(): AccentId {
  if (typeof document === "undefined") return "blue";
  const fromDom = document.documentElement.getAttribute("data-accent");
  if (isAccentId(fromDom)) return fromDom;
  try {
    const stored = window.localStorage.getItem(ACCENT_STORAGE_KEY);
    if (isAccentId(stored)) return stored;
  } catch {
    // storage blocked
  }
  return "blue";
}

export function setAccent(
  id: AccentId,
  { persist = true }: { persist?: boolean } = {},
) {
  if (typeof document === "undefined") return;
  if (id === "blue") {
    document.documentElement.removeAttribute("data-accent");
  } else {
    document.documentElement.setAttribute("data-accent", id);
  }
  if (persist) {
    try {
      window.localStorage.setItem(ACCENT_STORAGE_KEY, id);
    } catch {
      // storage blocked
    }
  }
  window.dispatchEvent(new CustomEvent(ACCENT_CHANGE_EVENT, { detail: id }));
}

/** Restore accent from localStorage before paint (call from a boot script). */
export function applyStoredAccent() {
  if (typeof document === "undefined") return;
  try {
    const stored = window.localStorage.getItem(ACCENT_STORAGE_KEY);
    if (isAccentId(stored)) {
      setAccent(stored, { persist: false });
      return;
    }
  } catch {
    // storage blocked
  }
  setAccent("blue", { persist: false });
}
