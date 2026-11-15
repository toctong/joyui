"use client";

import {
  RiArrowUpLine,
  RiStopFill,
} from "@remixicon/react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type HTMLAttributes,
} from "react";
import { cx } from "../../../utils/cx";

/**
 * Lightweight chat input that ships with the AI kit (no TipTap).
 * Swap in `@joyui/react/composer` via `AiChat` `renderComposer` when you want
 * the full pill / panel surface.
 */
export function AiComposer({
  busy = false,
  placeholder = "有什么问题就问我",
  disabled = false,
  onSubmit,
  onStop,
  className,
  ...props
}: {
  busy?: boolean;
  placeholder?: string;
  disabled?: boolean;
  onSubmit: (text: string) => void;
  onStop?: () => void;
} & Omit<HTMLAttributes<HTMLFormElement>, "onSubmit">) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const empty = value.trim().length === 0;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 144)}px`;
  }, [value]);

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (busy) {
      onStop?.();
      return;
    }
    const text = value.trim();
    if (!text || disabled) return;
    onSubmit(text);
    setValue("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={submit}
      className={cx(
        "bui-composer-shell flex w-full items-end gap-2 rounded-[28px] p-2",
        "bg-background-primary-default transition-[box-shadow] duration-200",
        className,
      )}
      {...props}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        rows={1}
        disabled={disabled || busy}
        aria-label="AI 输入"
        className={cx(
          "max-h-36 min-h-[36px] min-w-0 flex-1 resize-none overflow-y-auto bg-transparent px-2 py-2",
          "text-body-regular leading-6 text-text-primary outline-none",
          "placeholder:text-text-tertiary",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
      />
      <button
        type="submit"
        aria-label={busy ? "停止生成" : "发送"}
        disabled={!busy && (empty || disabled)}
        className={cx(
          "mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-full",
          "transition-[background-color,color,transform,opacity] duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
          busy
            ? "cursor-pointer bg-button-primary text-white shadow-xs hover:opacity-90 active:scale-95"
            : empty || disabled
              ? "cursor-not-allowed bg-background-tertiary-default text-foreground-icon-quaternary"
              : "cursor-pointer bg-button-primary text-white shadow-xs hover:opacity-90 active:scale-95",
        )}
      >
        {busy ? (
          <RiStopFill className="size-4" aria-hidden />
        ) : (
          <RiArrowUpLine className="size-5" aria-hidden />
        )}
      </button>
    </form>
  );
}
