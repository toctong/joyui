"use client";

import { useEffect, useSyncExternalStore } from "react";
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

export interface AccentSwitcherProps {
  className?: string;
  /** Visual density of the swatch row. */
  size?: "small" | "medium";
}

/** Compact row of accent swatches for docs shells and settings panels. */
export function AccentSwitcher({
  className,
  size = "medium",
}: AccentSwitcherProps) {
  const accent = useAccent();

  useEffect(() => {
    applyStoredAccent();
  }, []);

  const swatchSize = size === "small" ? "size-5" : "size-6";

  return (
    <div
      role="radiogroup"
      aria-label="Accent color"
      className={cx("inline-flex items-center gap-1.5", className)}
    >
      {ACCENT_PRESETS.map((preset) => {
        const selected = accent === preset.id;
        return (
          <button
            key={preset.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={preset.label}
            title={preset.label}
            onClick={() => setAccent(preset.id)}
            className={cx(
              "relative grid shrink-0 cursor-pointer place-items-center rounded-full outline-none",
              "transition-[box-shadow,transform] duration-150 ease",
              "focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2",
              "hover:scale-105 active:scale-95",
              swatchSize,
              selected
                ? "shadow-[0_0_0_2px_var(--color-background-primary-default),0_0_0_4px_var(--color-accent-500)]"
                : "shadow-[0_0_0_1px_var(--color-border-button-default)]",
            )}
            style={{ backgroundColor: preset.swatch }}
          />
        );
      })}
    </div>
  );
}
