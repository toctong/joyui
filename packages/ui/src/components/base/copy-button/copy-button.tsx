"use client";

import { useCallback, useEffect, useState, type Ref } from "react";
import { RiCheckLine, RiFileCopyLine } from "@remixicon/react";
import { IconButton, type IconButtonProps } from "../buttons/icon-button";
import { useTemplateCopy } from "../../foundations/template-copy/template-copy";

/**
 * Icon button that copies `value` to the clipboard and briefly shows a check.
 */

export interface CopyButtonProps
  extends Omit<IconButtonProps, "icon" | "aria-label" | "onClick"> {
  value: string;
  /** Accessible name before copy. */
  "aria-label"?: string;
  /** Accessible name after a successful copy. */
  copiedLabel?: string;
  /** How long the check stays (ms). */
  resetMs?: number;
  onCopied?: (value: string) => void;
  ref?: Ref<HTMLButtonElement>;
}

export function CopyButton({
  value,
  "aria-label": ariaLabel = "Copy",
  copiedLabel = "Copied",
  resetMs = 1600,
  onCopied,
  disabled,
  ref,
  ...props
}: CopyButtonProps) {
  const localize = useTemplateCopy();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), resetMs);
    return () => window.clearTimeout(id);
  }, [copied, resetMs]);

  const onClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopied?.(value);
    } catch {
      setCopied(false);
    }
  }, [onCopied, value]);

  return localize(
    <IconButton
      ref={ref}
      icon={copied ? RiCheckLine : RiFileCopyLine}
      aria-label={copied ? copiedLabel : ariaLabel}
      disabled={disabled}
      onClick={onClick}
      {...props}
    />,
  );
}
