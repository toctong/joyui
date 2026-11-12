"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { EditorContent, ReactRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Mention from "@tiptap/extension-mention";
import type {
  SuggestionKeyDownProps,
  SuggestionProps,
} from "@tiptap/suggestion";
import {
  RiFileLine,
  RiFolder3Line,
  RiImageLine,
  RiUser3Line,
} from "@remixicon/react";
import tippy, { type Instance as TippyInstance } from "tippy.js";
import "tippy.js/dist/tippy.css";
import { cx } from "../../../utils/cx";

export type MentionKind = "file" | "image" | "folder" | "user";

export type MentionItem = {
  id: string;
  label: string;
  description?: string;
  kind: MentionKind;
};

export type ComposerRichInputHandle = {
  clear: () => void;
  focus: () => void;
  getText: () => string;
};

const KIND_ICON = {
  file: RiFileLine,
  image: RiImageLine,
  folder: RiFolder3Line,
  user: RiUser3Line,
} as const;

export const DEFAULT_MENTIONS: MentionItem[] = [
  { id: "brief", label: "brief.pdf", description: "docs / brief", kind: "file" },
  { id: "mock", label: "mock.png", description: "assets / mock", kind: "image" },
  { id: "notes", label: "notes.md", description: "docs / notes", kind: "file" },
  {
    id: "payroll",
    label: "payroll.docx",
    description: "finance / payroll",
    kind: "file",
  },
  { id: "cat", label: "cat.jpg", description: "uploads / cat", kind: "image" },
  { id: "src", label: "src", description: "项目文件夹", kind: "folder" },
];

type MentionListProps = {
  items: MentionItem[];
  command: (item: MentionItem) => void;
};

type MentionListHandle = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

const MentionList = forwardRef<MentionListHandle, MentionListProps>(
  function MentionList({ items, command }, ref) {
    const [selected, setSelected] = useState(0);

    useEffect(() => {
      setSelected(0);
    }, [items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === "ArrowUp") {
          setSelected(
            (i) => (i + items.length - 1) % Math.max(items.length, 1),
          );
          return true;
        }
        if (event.key === "ArrowDown") {
          setSelected((i) => (i + 1) % Math.max(items.length, 1));
          return true;
        }
        if (event.key === "Enter" || event.key === "Tab") {
          const item = items[selected];
          if (item) command(item);
          return true;
        }
        return false;
      },
    }));

    if (items.length === 0) {
      return (
        <div className="rounded-2xl border border-border-button-default bg-background-primary-default px-3 py-2.5 text-body-2-medium text-text-tertiary shadow-lg">
          没有匹配的附件或文件
        </div>
      );
    }

    return (
      <div
        className={cx(
          "w-[280px] overflow-hidden rounded-2xl border border-border-button-default",
          "bg-background-primary-default p-1.5 shadow-lg",
        )}
        role="listbox"
        aria-label="@ 提及"
      >
        <p className="px-2 pb-1 pt-0.5 text-caption-1-medium text-text-tertiary">
          提及附件 · 图片 · 文件
        </p>
        <ul className="flex max-h-56 flex-col gap-0.5 overflow-y-auto">
          {items.map((item, index) => {
            const Icon = KIND_ICON[item.kind];
            const active = index === selected;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setSelected(index)}
                  onClick={() => command(item)}
                  className={cx(
                    "flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2 py-2 text-start outline-none transition-colors",
                    active
                      ? "bg-background-secondary-hover"
                      : "hover:bg-background-secondary-hover/70",
                  )}
                >
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-background-tertiary-default text-foreground-icon-secondary">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-body-2-medium text-text-primary">
                      {item.label}
                    </span>
                    {item.description ? (
                      <span className="block truncate text-caption-1-medium text-text-tertiary">
                        {item.description}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
);

function createMentionSuggestion(items: MentionItem[]) {
  return {
    char: "@",
    allowSpaces: false,
    items: ({ query }: { query: string }) => {
      const q = query.trim().toLowerCase();
      return items
        .filter(
          (item) =>
            !q ||
            item.label.toLowerCase().includes(q) ||
            item.description?.toLowerCase().includes(q),
        )
        .slice(0, 8);
    },
    render: () => {
      let component: ReactRenderer<MentionListHandle> | null = null;
      let popup: TippyInstance[] | null = null;

      return {
        onStart: (props: SuggestionProps<MentionItem>) => {
          component = new ReactRenderer(MentionList, {
            props: {
              items: props.items,
              command: (item: MentionItem) => {
                props.command({ id: item.id, label: item.label });
              },
            },
            editor: props.editor,
          });

          if (!props.clientRect) return;

          popup = tippy("body", {
            getReferenceClientRect: props.clientRect as () => DOMRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "top-start",
            offset: [0, 8],
            arrow: false,
            animation: false,
            maxWidth: "none",
            onCreate(instance) {
              const box = instance.popper.querySelector(
                ".tippy-box",
              ) as HTMLElement | null;
              if (box) {
                box.style.background = "transparent";
                box.style.boxShadow = "none";
              }
              const content = instance.popper.querySelector(
                ".tippy-content",
              ) as HTMLElement | null;
              if (content) content.style.padding = "0";
            },
          });
        },
        onUpdate: (props: SuggestionProps<MentionItem>) => {
          component?.updateProps({
            items: props.items,
            command: (item: MentionItem) => {
              props.command({ id: item.id, label: item.label });
            },
          });
          popup?.[0]?.setProps({
            getReferenceClientRect: props.clientRect as () => DOMRect,
          });
        },
        onKeyDown: (props: SuggestionKeyDownProps) => {
          if (props.event.key === "Escape") {
            popup?.[0]?.hide();
            return true;
          }
          return component?.ref?.onKeyDown(props) ?? false;
        },
        onExit: () => {
          popup?.[0]?.destroy();
          component?.destroy();
          popup = null;
          component = null;
        },
      };
    },
  };
}

/**
 * TipTap AI rich input: multiline prompt with atomic `@` mention chips for
 * files, images and folders — drop-in replacement for a plain textarea.
 */
export const ComposerRichInput = forwardRef<
  ComposerRichInputHandle,
  {
    placeholder?: string;
    mentions?: MentionItem[];
    className?: string;
    onSubmit?: (text: string) => void;
    onEmptyChange?: (empty: boolean) => void;
  }
>(function ComposerRichInput(
  {
    placeholder = "输入消息，用 @ 提及附件或图片…",
    mentions = DEFAULT_MENTIONS,
    className,
    onSubmit,
    onEmptyChange,
  },
  ref,
) {
  const onSubmitRef = useRef(onSubmit);
  const onEmptyChangeRef = useRef(onEmptyChange);
  onSubmitRef.current = onSubmit;
  onEmptyChangeRef.current = onEmptyChange;

  const suggestion = useMemo(
    () => createMentionSuggestion(mentions),
    [mentions],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Placeholder.configure({ placeholder }),
      Mention.configure({
        HTMLAttributes: {
          class:
            "mention inline-flex items-baseline rounded-md bg-background-tertiary-default px-1.5 py-0.5 text-body-2-medium text-text-primary ring-1 ring-border-button-default/60",
        },
        deleteTriggerWithBackspace: true,
        suggestion,
      }),
    ],
    editorProps: {
      attributes: {
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": "AI 输入",
        class: cx(
          "max-h-40 min-h-[48px] w-full overflow-y-auto px-1 outline-none",
          "text-body-regular text-text-primary",
          "[&_.is-editor-empty:first-child::before]:pointer-events-none",
          "[&_.is-editor-empty:first-child::before]:float-left",
          "[&_.is-editor-empty:first-child::before]:h-0",
          "[&_.is-editor-empty:first-child::before]:text-text-tertiary",
          "[&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
          "[&_p]:m-0 [&_p]:leading-6",
        ),
      },
      handleKeyDown: (view, event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          const mentionOpen = document.querySelector('[aria-label="@ 提及"]');
          if (mentionOpen) return false;
          event.preventDefault();
          const text = view.state.doc.textContent.trim();
          if (text) onSubmitRef.current?.(text);
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor: ed }) => {
      onEmptyChangeRef.current?.(ed.isEmpty);
    },
  });

  useEffect(() => {
    if (!editor) return;
    onEmptyChangeRef.current?.(editor.isEmpty);
  }, [editor]);

  useImperativeHandle(
    ref,
    () => ({
      clear: () => editor?.commands.clearContent(true),
      focus: () => editor?.commands.focus(),
      getText: () => editor?.getText() ?? "",
    }),
    [editor],
  );

  return (
    <div className={cx("relative w-full", className)} data-composer-rich>
      <EditorContent editor={editor} />
    </div>
  );
});
