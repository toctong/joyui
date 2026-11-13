"use client";

import type { Ref } from "react";
import { CopyButton } from "../copy-button/copy-button";
import { Input, type InputProps } from "../input/input";
import { cx } from "../../../utils/cx";

/**
 * Field with a trailing copy control — Bencho Copy field / share-link pattern.
 *
 *   <CopyField label="分享链接" value="https://joyui.top" />
 */

export interface CopyFieldProps
  extends Omit<InputProps, "trailingIcon" | "trailingAddon" | "ref"> {
  value: string;
  /** Make the field read-only. Default true. */
  isReadOnly?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
  onCopied?: (value: string) => void;
  ref?: Ref<HTMLInputElement>;
}

export function CopyField({
  value,
  isReadOnly = true,
  copyLabel,
  copiedLabel,
  onCopied,
  className,
  ref,
  ...props
}: CopyFieldProps) {
  return (
    <Input
      ref={ref}
      value={value}
      isReadOnly={isReadOnly}
      className={cx(className)}
      trailingAddon={
        <CopyButton
          value={value}
          size="small"
          aria-label={copyLabel}
          copiedLabel={copiedLabel}
          onCopied={onCopied}
          className="-me-1"
        />
      }
      {...props}
    />
  );
}
