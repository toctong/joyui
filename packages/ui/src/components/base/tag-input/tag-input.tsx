"use client";

import {
  useCallback,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { RiCloseLine } from "@remixicon/react";
import { HintText } from "../input/hint-text";
import { Label } from "../input/label";
import { cx } from "../../../utils/cx";

/**
 * Multi-value tag field — type + Enter / comma to add, Backspace removes the
 * last tag. Shell matches Input (tertiary fill, 2lg radius).
 *
 *   <TagInput label="标签" value={tags} onChange={setTags} placeholder="添加标签" />
 */

export interface TagInputProps {
  label?: ReactNode;
  hint?: ReactNode;
  placeholder?: string;
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  /** Delimiters that commit the draft. Default Enter + comma. */
  delimiters?: string[];
  maxTags?: number;
  isDisabled?: boolean;
  isInvalid?: boolean;
  isRequired?: boolean;
  size?: "medium" | "small";
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

function normalize(raw: string) {
  return raw.trim().replace(/\s+/g, " ");
}

export function TagInput({
  label,
  hint,
  placeholder = "添加…",
  value,
  defaultValue = [],
  onChange,
  delimiters = [",", "Enter"],
  maxTags,
  isDisabled = false,
  isInvalid = false,
  isRequired = false,
  size = "medium",
  className,
  ref,
}: TagInputProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState("");
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const tags = value ?? uncontrolled;

  const commit = useCallback(
    (next: string[]) => {
      if (value === undefined) setUncontrolled(next);
      onChange?.(next);
    },
    [onChange, value],
  );

  const addTag = (raw: string) => {
    const text = normalize(raw);
    if (!text || isDisabled) return;
    if (maxTags != null && tags.length >= maxTags) return;
    if (tags.some((t) => t.toLowerCase() === text.toLowerCase())) {
      setDraft("");
      return;
    }
    commit([...tags, text]);
    setDraft("");
  };

  const removeAt = (index: number) => {
    if (isDisabled) return;
    commit(tags.filter((_, i) => i !== index));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (delimiters.includes(event.key)) {
      event.preventDefault();
      addTag(draft);
      return;
    }
    if (event.key === "Backspace" && !draft && tags.length > 0) {
      removeAt(tags.length - 1);
    }
  };

  return (
    <div ref={ref} className={cx("flex w-full flex-col gap-1.5", className)}>
      {label ? (
        <Label htmlFor={inputId} isRequired={isRequired} isInvalid={isInvalid}>
          {label}
        </Label>
      ) : null}
      <div
        data-disabled={isDisabled || undefined}
        data-invalid={isInvalid || undefined}
        onClick={() => inputRef.current?.focus()}
        className={cx(
          "flex w-full flex-wrap items-center gap-1.5 rounded-2lg",
          "bg-background-tertiary-default text-foreground-icon-tertiary",
          "ring-2 ring-inset ring-transparent",
          "transition-[background-color,box-shadow] duration-[var(--input-transition-ms)] ease",
          "focus-within:ring-accent-500",
          "data-invalid:ring-notification-error-foreground",
          "data-disabled:cursor-not-allowed data-disabled:opacity-60",
          size === "medium" ? "min-h-9 p-2" : "min-h-8 px-1.5 py-1.5",
        )}
      >
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className={cx(
              "inline-flex max-w-full items-center gap-0.5 rounded-md",
              "bg-background-primary-default px-1.5 py-0.5",
              "text-caption-1-medium text-text-primary shadow-2xs",
            )}
          >
            <span className="truncate">{tag}</span>
            <button
              type="button"
              tabIndex={-1}
              aria-label={`移除 ${tag}`}
              disabled={isDisabled}
              onClick={(e) => {
                e.stopPropagation();
                removeAt(index);
              }}
              className={cx(
                "inline-flex size-4 items-center justify-center rounded-sm",
                "text-foreground-icon-quaternary",
                "hover:bg-background-tertiary-default hover:text-text-primary",
                "disabled:pointer-events-none",
              )}
            >
              <RiCloseLine className="size-3" aria-hidden />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          id={inputId}
          value={draft}
          disabled={isDisabled || (maxTags != null && tags.length >= maxTags)}
          placeholder={tags.length === 0 ? placeholder : undefined}
          aria-invalid={isInvalid || undefined}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            if (draft.trim()) addTag(draft);
          }}
          className={cx(
            "min-w-[7rem] flex-1 border-0 bg-transparent p-0 outline-none",
            "font-sans text-body-regular text-text-primary",
            "placeholder:text-text-tertiary",
            "disabled:cursor-not-allowed",
          )}
        />
      </div>
      {hint ? <HintText isInvalid={isInvalid}>{hint}</HintText> : null}
    </div>
  );
}
