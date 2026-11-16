"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowUpLine,
  RiCheckDoubleLine,
  RiFolderLine,
  RiMicLine,
  RiSparklingLine,
  RiStopFill,
} from "@remixicon/react";
import { cx } from "../../../utils/cx";
import {
  Dropdown,
  DropdownPopover,
  DropdownTrigger,
} from "../../base/dropdown/dropdown";

export type MediaComposerModel = {
  id: string;
  name: string;
};

export type MediaComposerProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onSubmit" | "onChange"
> & {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (text: string) => void;
  onStop?: () => void;
  onAttachPress?: () => void;
  onMicPress?: () => void;
  onModelChange?: (modelId: string) => void;
  busy?: boolean;
  disabled?: boolean;
  /** Clear the field after a successful submit. Default true. */
  clearOnSubmit?: boolean;
  placeholder?: string;
  modelLabel?: string;
  models?: MediaComposerModel[];
  /** Controlled model id. */
  modelId?: string;
  defaultModelId?: string;
  /** Soft toolbar above the shell (chips, filters, …). */
  toolbar?: ReactNode;
  /** Replace the default `+` control. */
  leading?: ReactNode;
  /** Extra controls between the model menu and the send button. */
  actions?: ReactNode;
  /** Replace the entire meta footer. */
  footer?: ReactNode;
  footerLeading?: ReactNode;
  footerTrailing?: ReactNode;
  showAttach?: boolean;
  showMic?: boolean;
  showModel?: boolean;
  showFooter?: boolean;
  showContextMeter?: boolean;
  agentLabel?: string;
  contextPercent?: number;
  branchLabel?: string;
  projectLabel?: string;
  modelMenuLabel?: string;
  attachLabel?: string;
  micLabel?: string;
  sendLabel?: string;
  stopLabel?: string;
};

/**
 * Soft-rim media prompt bar (no TipTap) — matches AI Composer shell tokens.
 * Used by ImageGeneration / VideoGeneration footers; also usable standalone.
 */
export function MediaComposer({
  value: valueProp,
  defaultValue = "",
  onChange,
  onSubmit,
  onStop,
  onAttachPress,
  onMicPress,
  onModelChange,
  busy = false,
  disabled = false,
  clearOnSubmit = true,
  placeholder = "描述你想生成的内容…",
  modelLabel = "Fable 5",
  models,
  modelId: modelIdProp,
  defaultModelId,
  toolbar,
  leading,
  actions,
  footer,
  footerLeading,
  footerTrailing,
  showAttach = true,
  showMic = true,
  showModel = true,
  showFooter = true,
  showContextMeter = true,
  agentLabel = "智能体",
  contextPercent = 57,
  branchLabel = "主要",
  projectLabel = "项目",
  modelMenuLabel = "型号",
  attachLabel = "添加参考",
  micLabel = "语音输入",
  sendLabel = "发送",
  stopLabel = "停止生成",
  className,
  ...props
}: MediaComposerProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : uncontrolled;
  const [focused, setFocused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const modelOptions =
    models && models.length > 0
      ? models
      : [{ id: "default", name: modelLabel }];
  const [modelLocal, setModelLocal] = useState(
    defaultModelId ?? modelOptions[0]?.id ?? "default",
  );
  const modelId = modelIdProp ?? modelLocal;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const empty = value.trim().length === 0;
  const expanded = focused || !empty || Boolean(toolbar);
  const activeModel =
    modelOptions.find((m) => m.id === modelId) ?? modelOptions[0];

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 144)}px`;
  }, [value]);

  const setValue = (next: string) => {
    if (!controlled) setUncontrolled(next);
    onChange?.(next);
  };

  const selectModel = (id: string) => {
    if (modelIdProp === undefined) setModelLocal(id);
    onModelChange?.(id);
    setMenuOpen(false);
  };

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (busy) {
      onStop?.();
      return;
    }
    const text = value.trim();
    if (!text || disabled) return;
    onSubmit?.(text);
    if (clearOnSubmit) setValue("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  const defaultFooter = (
    <div className="flex items-center justify-between gap-2 px-1 text-caption-1-regular text-text-tertiary">
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1">
          <RiCheckDoubleLine className="size-3.5" aria-hidden />
          {branchLabel}
        </span>
        <span className="inline-flex items-center gap-1">
          <RiFolderLine className="size-3.5" aria-hidden />
          {projectLabel}
        </span>
        {footerLeading}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {footerTrailing ?? (
          <>
            <span className="inline-flex items-center gap-1">
              <RiSparklingLine className="size-3.5" aria-hidden />
              {agentLabel}
            </span>
            {showContextMeter ? (
              <span
                className="grid size-8 place-items-center rounded-full border border-separator-border text-caption-2-medium text-text-secondary"
                aria-label={`上下文 ${contextPercent}%`}
              >
                {contextPercent}%
              </span>
            ) : null}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className={cx("flex w-full flex-col gap-2.5", className)} {...props}>
      {toolbar ? <div className="flex flex-col gap-2">{toolbar}</div> : null}

      <form
        className={cx(
          "bui-composer-shell group/media-composer flex w-full items-end gap-1.5 p-2",
          "bg-background-primary-default transition-[border-radius,box-shadow] duration-200 ease-out",
          expanded ? "rounded-[28px]" : "rounded-full",
        )}
        data-focused={focused || undefined}
        onSubmit={submit}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setFocused(false);
          }
        }}
      >
        {leading !== undefined ? (
          leading
        ) : showAttach ? (
          <button
            type="button"
            aria-label={attachLabel}
            onClick={onAttachPress}
            className={cx(
              "mb-0.5 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full",
              "bg-ai-chat-composer-add-background text-foreground-icon-primary",
              "transition-[background-color,transform] duration-150",
              "hover:bg-ai-chat-composer-add-hover-background active:scale-95",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
            )}
          >
            <RiAddLine className="size-5" aria-hidden />
          </button>
        ) : null}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled || (busy && !onStop)}
          aria-label="媒体提示词"
          className={cx(
            "max-h-36 min-h-[36px] min-w-0 flex-1 resize-none overflow-y-auto bg-transparent px-1 py-2",
            "text-body-regular leading-6 text-text-primary outline-none",
            "placeholder:text-text-tertiary",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        />

        <div className="mb-0.5 flex shrink-0 items-center gap-0.5">
          {showModel ? (
            <Dropdown isOpen={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownTrigger
                aria-label="选择模型"
                className={cx(
                  "inline-flex h-8 max-w-[10rem] cursor-pointer items-center gap-0.5 rounded-full px-2.5",
                  "text-body-2-medium text-text-secondary outline-none",
                  "transition-colors duration-150",
                  "hover:bg-background-secondary-default hover:text-text-primary",
                  "focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                  menuOpen && "bg-background-secondary-default text-text-primary",
                )}
              >
                <span className="truncate">{activeModel?.name}</span>
                <RiArrowDownSLine
                  className={cx(
                    "size-4 shrink-0 text-foreground-icon-tertiary transition-transform duration-200",
                    menuOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </DropdownTrigger>
              <DropdownPopover
                aria-label={modelMenuLabel}
                placement="top end"
                offset={10}
                className="w-[240px] rounded-2xl p-1.5 shadow-lg"
                dialogClassName="gap-0"
              >
                <p className="px-2 pb-1 pt-0.5 text-caption-1-medium text-text-tertiary">
                  {modelMenuLabel}
                </p>
                <ul className="flex flex-col gap-0.5" role="listbox">
                  {modelOptions.map((item) => {
                    const selected = item.id === activeModel?.id;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={selected}
                          onClick={() => selectModel(item.id)}
                          className={cx(
                            "flex w-full cursor-pointer items-center gap-2.5 rounded-2lg px-2.5 py-2 text-start",
                            "text-body-medium outline-none transition-colors",
                            selected
                              ? "bg-background-secondary-hover text-text-primary"
                              : "text-text-secondary hover:bg-background-secondary-hover/70",
                          )}
                        >
                          <span
                            className={cx(
                              "inline-flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                              selected
                                ? "border-accent-500"
                                : "border-border-button-default",
                            )}
                            aria-hidden
                          >
                            {selected ? (
                              <span className="size-2 rounded-full bg-accent-500" />
                            ) : null}
                          </span>
                          {item.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </DropdownPopover>
            </Dropdown>
          ) : null}

          {actions}

          {showMic ? (
            <button
              type="button"
              aria-label={micLabel}
              onClick={onMicPress}
              className={cx(
                "flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full",
                "text-foreground-icon-secondary transition-[background-color,color,transform] duration-150",
                "hover:bg-background-secondary-default hover:text-foreground-icon-primary",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                "active:scale-95",
              )}
            >
              <RiMicLine className="size-5" aria-hidden />
            </button>
          ) : null}

          <button
            type="submit"
            aria-label={busy ? stopLabel : sendLabel}
            disabled={!busy && (empty || disabled)}
            className={cx(
              "flex size-9 shrink-0 items-center justify-center rounded-full",
              "transition-[background-color,color,transform,opacity] duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              busy
                ? "cursor-pointer bg-button-primary text-text-white shadow-xs hover:opacity-90 active:scale-95"
                : empty || disabled
                  ? "cursor-not-allowed bg-background-tertiary-default text-foreground-icon-quaternary"
                  : "cursor-pointer bg-button-primary text-text-white shadow-xs hover:opacity-90 active:scale-95",
            )}
          >
            {busy ? (
              <RiStopFill className="size-4" aria-hidden />
            ) : (
              <RiArrowUpLine className="size-5" aria-hidden />
            )}
          </button>
        </div>
      </form>

      {showFooter ? (footer !== undefined ? footer : defaultFooter) : null}
    </div>
  );
}
