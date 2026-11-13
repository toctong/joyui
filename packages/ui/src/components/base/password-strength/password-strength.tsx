"use client";

import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cx, sortCx } from "../../../utils/cx";

/**
 * Segmented password strength meter — Bencho Password strength pattern,
 * tokenized for JoyUI forms under an Input.
 *
 *   <PasswordStrength value={password} />
 */

export type PasswordStrengthLevel = 0 | 1 | 2 | 3 | 4;

export interface PasswordStrengthProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Raw password (scored client-side; never send elsewhere). */
  value?: string;
  /** Override scored level 0–4. */
  level?: PasswordStrengthLevel;
  /** Show label under the bars. Default true. */
  showLabel?: boolean;
  labels?: [string, string, string, string, string];
  ref?: Ref<HTMLDivElement>;
}

const DEFAULT_LABELS: [string, string, string, string, string] = [
  "输入密码",
  "弱",
  "一般",
  "较强",
  "很强",
];

const barTone = sortCx({
  idle: "bg-border-button-default",
  1: "bg-status-rose-text",
  2: "bg-status-orange-text",
  3: "bg-status-yellow-text",
  4: "bg-status-lime-text",
});

/** Lightweight heuristic — length + character classes. */
export function scorePassword(value: string): PasswordStrengthLevel {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score += 1;
  if (value.length >= 12) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  if (score <= 1) return value.length > 0 ? 1 : 0;
  if (score === 2) return 2;
  if (score === 3) return 3;
  return 4;
}

export function PasswordStrength({
  value = "",
  level,
  showLabel = true,
  labels = DEFAULT_LABELS,
  className,
  ref,
  ...props
}: PasswordStrengthProps) {
  const resolved = level ?? scorePassword(value);
  const label: ReactNode = labels[resolved] ?? labels[0];

  return (
    <div ref={ref} className={cx("flex w-full flex-col gap-1.5", className)} {...props}>
      <div className="flex gap-1" role="meter" aria-valuemin={0} aria-valuemax={4} aria-valuenow={resolved} aria-label="密码强度">
        {([1, 2, 3, 4] as const).map((i) => (
          <span
            key={i}
            aria-hidden
            className={cx(
              "h-1.5 flex-1 rounded-full transition-colors duration-200",
              resolved >= i ? barTone[resolved === 0 ? 1 : resolved] : barTone.idle,
            )}
          />
        ))}
      </div>
      {showLabel ? (
        <span className="text-caption-1-medium text-text-secondary">{label}</span>
      ) : null}
    </div>
  );
}
