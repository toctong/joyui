"use client";

import { useEffect, useSyncExternalStore } from "react";
import { RiCheckLine } from "@remixicon/react";
import { cx } from "../../../utils/cx";
import {
  ACCENT_CHANGE_EVENT,
  ACCENT_PRESETS,
  ACCENT_STORAGE_KEY,
  applyStoredAccent,
  getAccent,
  setAccent,
  type AccentId,
} from "./accent";

function subscribe(onStoreChange: () => void) {
  const onAccent = () => onStoreChange();
  const onStorage = (event: StorageEvent) => {
    if (event.key !== ACCENT_STORAGE_KEY) return;
    onStoreChange();
  };
  window.addEventListener(ACCENT_CHANGE_EVENT, onAccent);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(ACCENT_CHANGE_EVENT, onAccent);
    window.removeEventListener("storage", onStorage);
  };
}

export function useAccent(): AccentId {
  return useSyncExternalStore(subscribe, getAccent, () => "blue" as AccentId);
}

export type AccentSwitcherAppearance = "plain" | "cards";

export interface AccentSwitcherProps {
  className?: string;
  /** Swatch size for `plain`. Ignored by `cards`. */
  size?: "small" | "medium";
  /**
   * `plain` — compact swatch row (docs header).
   * `cards` — settings grid: swatch + Chinese label (default for admin settings).
   */
  appearance?: AccentSwitcherAppearance;
  /** Prefer Chinese labels. Default true for `cards`, false for `plain`. */
  locale?: "zh" | "en";
}

/** Accent control that retints `--color-accent-*` via `data-accent`. */
export function AccentSwitcher({
  className,
  size = "medium",
  appearance = "plain",
  locale,
}: AccentSwitcherProps) {
  const accent = useAccent();
  const resolvedLocale = locale ?? (appearance === "cards" ? "zh" : "en");

  useEffect(() => {
    applyStoredAccent();
  }, []);

  if (appearance === "cards") {
    return (
      <div
        role="radiogroup"
        aria-label={resolvedLocale === "zh" ? "主题色" : "Accent color"}
        className={cx(
          "grid w-full grid-cols-2 gap-2 sm:grid-cols-3",
          className,
        )}
      >
        {ACCENT_PRESETS.map((preset) => {
          const selected = accent === preset.id;
          const name = resolvedLocale === "zh" ? preset.labelZh : preset.label;
          return (
            <button
              key={preset.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={name}
              onClick={() => setAccent(preset.id)}
              className={cx(
                "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-start outline-none",
                "transition-[border-color,background-color,box-shadow] duration-150 ease",
                "focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2",
                selected
                  ? "border-accent-500 bg-accent-50 shadow-xs dark:bg-accent-950/40"
                  : "border-separator-border bg-background-primary-default hover:border-border-secondary-default hover:bg-background-secondary-default",
              )}
            >
              <span
                aria-hidden
                className="size-8 shrink-0 rounded-full ring-1 ring-inset ring-black/10 dark:ring-white/15"
                style={{ backgroundColor: preset.swatch }}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-body-medium text-text-primary">{name}</span>
                <span className="block text-caption-1-regular text-text-tertiary">
                  {preset.id}
                </span>
              </span>
              <span
                aria-hidden
                className={cx(
                  "grid size-5 shrink-0 place-items-center rounded-full border",
                  selected
                    ? "border-accent-500 bg-accent-500 text-white"
                    : "border-border-secondary-default text-transparent",
                )}
              >
                <RiCheckLine className="size-3" />
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  const compact = size === "small";

  return (
    <div
      role="radiogroup"
      aria-label={resolvedLocale === "zh" ? "主题色" : "Accent color"}
      className={cx(
        "inline-flex max-w-full flex-wrap items-center",
        compact ? "gap-1.5" : "gap-2",
        className,
      )}
    >
      {ACCENT_PRESETS.map((preset) => {
        const selected = accent === preset.id;
        const name = resolvedLocale === "zh" ? preset.labelZh : preset.label;
        return (
          <button
            key={preset.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={name}
            title={name}
            onClick={() => setAccent(preset.id)}
            className={cx(
              "relative grid shrink-0 cursor-pointer place-items-center rounded-full outline-none",
              "transition-opacity duration-150 ease",
              "focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2",
              compact ? "size-6" : "size-7",
              selected ? "opacity-100" : "opacity-70 hover:opacity-100",
            )}
          >
            <span
              aria-hidden
              className={cx(
                "absolute inset-[2px] rounded-full",
                !selected && "ring-1 ring-inset ring-black/10 dark:ring-white/15",
              )}
              style={{ backgroundColor: preset.swatch }}
            />
            {selected ? (
              <>
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full ring-2 ring-inset ring-white/90"
                />
                <RiCheckLine
                  aria-hidden
                  className={cx(
                    "relative z-10 text-white drop-shadow-sm",
                    compact ? "size-3" : "size-3.5",
                  )}
                />
              </>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
