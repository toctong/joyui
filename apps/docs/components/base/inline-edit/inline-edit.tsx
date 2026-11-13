"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { RiCheckLine, RiCloseLine, RiPencilLine } from "@remixicon/react";
import { cx } from "@/utils/cx";

/**
 * Click-to-edit text — display as body text, edit in an Input-like shell.
 *
 *   <InlineEdit value={name} onSave={setName} />
 */

export interface InlineEditProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "onSave"> {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  /** Called when the user confirms (Enter / check). */
  onSave?: (value: string) => void;
  /** Called when the user cancels (Escape / close). */
  onCancel?: () => void;
  isDisabled?: boolean;
  emptyLabel?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function InlineEdit({
  value,
  defaultValue = "",
  placeholder = "点击编辑",
  onSave,
  onCancel,
  isDisabled = false,
  emptyLabel = "未设置",
  className,
  ref,
  ...props
}: InlineEditProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState(false);
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = value ?? uncontrolled;
  const [draft, setDraft] = useState(current);

  useEffect(() => {
    if (editing) {
      setDraft(current);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
    }
  }, [editing, current]);

  const save = () => {
    const next = draft.trim();
    if (value === undefined) setUncontrolled(next);
    onSave?.(next);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(current);
    onCancel?.();
    setEditing(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      save();
    } else if (event.key === "Escape") {
      event.preventDefault();
      cancel();
    }
  };

  return (
    <div
      ref={ref}
      className={cx("inline-flex max-w-full items-center gap-1", className)}
      {...props}
    >
      {editing ? (
        <>
          <input
            ref={inputRef}
            id={inputId}
            value={draft}
            placeholder={placeholder}
            disabled={isDisabled}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            className={cx(
              "h-8 min-w-[10rem] flex-1 rounded-2lg px-2",
              "bg-background-tertiary-default text-body-regular text-text-primary",
              "ring-2 ring-inset ring-accent-500 outline-none",
              "placeholder:text-text-tertiary",
            )}
          />
          <button
            type="button"
            aria-label="保存"
            onClick={save}
            className={cx(
              "inline-flex size-8 items-center justify-center rounded-2lg",
              "text-notification-success-foreground",
              "hover:bg-background-tertiary-default",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
            )}
          >
            <RiCheckLine className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="取消"
            onClick={cancel}
            className={cx(
              "inline-flex size-8 items-center justify-center rounded-2lg",
              "text-foreground-icon-quaternary",
              "hover:bg-background-tertiary-default hover:text-text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
            )}
          >
            <RiCloseLine className="size-4" aria-hidden />
          </button>
        </>
      ) : (
        <button
          type="button"
          disabled={isDisabled}
          onClick={() => !isDisabled && setEditing(true)}
          className={cx(
            "group inline-flex max-w-full items-center gap-1.5 rounded-md px-1 py-0.5",
            "text-left text-body-regular text-text-primary",
            "transition-[background-color] duration-200 ease",
            "hover:bg-background-tertiary-default",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        >
          <span className={cx("truncate", !current && "text-text-tertiary")}>
            {current || emptyLabel}
          </span>
          <RiPencilLine
            className="size-3.5 shrink-0 text-foreground-icon-quaternary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            aria-hidden
          />
        </button>
      )}
    </div>
  );
}
