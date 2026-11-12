"use client";

import * as React from "react";
import {
  Check,
  ChevronDown,
  Code2,
  Copy,
  ExternalLink,
  FileCode2,
  Sparkles,
  Terminal,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "fumadocs-ui/components/ui/popover";
import { cn } from "@/lib/cn";

const markdownCache = new Map<string, string>();

async function fetchText(url: string) {
  const cached = markdownCache.get(url);
  if (cached) return cached;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const text = await res.text();
  markdownCache.set(url, text);
  return text;
}

function toPascalCase(name: string) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function buildPrompt(pageUrl: string, title: string) {
  return `我正在查看 JoyUI「${title}」文档：${pageUrl}
请帮我理解如何使用。准备好解释概念、给出示例，或基于它帮我调试。`;
}

function buildUsageExample(component: string) {
  const exportName = toPascalCase(component);
  return `import { ${exportName} } from "@joyui/react";

export function Example() {
  return <${exportName} />;
}`;
}

function buildInstallCommand(component: string) {
  return `npx @joyui/cli add ${component} --yes`;
}

const MCP_JSON = `{
  "mcpServers": {
    "joyui": {
      "command": "npx",
      "args": ["-y", "@joyui/cli@latest", "mcp"]
    }
  }
}`;

function CursorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="#000"
        className="dark:fill-white"
        d="M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23"
      />
    </svg>
  );
}

function VscodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="#007ACC"
        d="M23.15 2.587 18.21.22a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.365A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448z"
      />
    </svg>
  );
}

function ChatGptIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="#10A37F" aria-hidden {...props}>
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

/** Claude spark (not Anthropic “A”). */
function ClaudeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="#D97757" aria-hidden {...props}>
      <path d="M12.75 2.25c.2 3.35 1.9 6.2 4.75 7.75-2.85 1.55-4.55 4.4-4.75 7.75-.2-3.35-1.9-6.2-4.75-7.75 2.85-1.55 4.55-4.4 4.75-7.75Z" />
      <path d="M5.5 5.25c.12 1.9 1.08 3.52 2.7 4.4-1.62.88-2.58 2.5-2.7 4.4-.12-1.9-1.08-3.52-2.7-4.4 1.62-.88 2.58-2.5 2.7-4.4Z" />
      <path d="M18.5 10c.1 1.55.88 2.88 2.2 3.6-1.32.72-2.1 2.05-2.2 3.6-.1-1.55-.88-2.88-2.2-3.6 1.32-.72 2.1-2.05 2.2-3.6Z" />
    </svg>
  );
}

function V0Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <rect width="24" height="24" rx="6" fill="#000" />
      <path
        fill="#fff"
        d="M14.338 10.377 9.606 16H6.066l4.73-5.623h3.542Zm-3.212-2.641L7.342 3.2H3.8l3.784 4.536h3.542Zm8.074 8.458h-3.54l-4.73 5.606h3.54l4.73-5.606Z"
        transform="translate(1.2 1.2) scale(0.9)"
      />
    </svg>
  );
}

type MenuRowProps = {
  icon: React.ReactNode;
  label: string;
  onSelect?: () => void | Promise<void>;
  href?: string;
  external?: boolean;
  /** Keep brand SVG fills (don't force muted currentColor). */
  branded?: boolean;
};

function MenuRow({
  icon,
  label,
  onSelect,
  href,
  external,
  branded,
}: MenuRowProps) {
  const className = cn(
    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-fd-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0",
    !branded && "[&_svg]:text-fd-muted-foreground",
  );
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={className}
      >
        {icon}
        <span className="flex-1 text-start">{label}</span>
        {external ? (
          <ExternalLink className="!size-3.5 text-fd-muted-foreground" />
        ) : null}
      </a>
    );
  }

  return (
    <button type="button" onClick={() => void onSelect?.()} className={className}>
      {icon}
      <span className="flex-1 text-start">{label}</span>
    </button>
  );
}

export type CopyPageMenuProps = {
  markdownUrl: string;
  title: string;
  component?: string;
  className?: string;
};

function PromptBrandStack() {
  return (
    <span className="flex items-center -space-x-1.5" aria-hidden>
      <span className="inline-flex size-5 items-center justify-center rounded-full bg-black ring-2 ring-fd-background dark:bg-zinc-100">
        <CursorIcon className="size-3 [&_path]:!fill-white dark:[&_path]:!fill-black" />
      </span>
      <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#D97757] ring-2 ring-fd-background">
        <ClaudeIcon className="size-3 [&_path]:!fill-white" />
      </span>
      <span className="inline-flex size-5 items-center justify-center rounded-full bg-black ring-2 ring-fd-background dark:bg-zinc-900">
        <ChatGptIcon className="size-3 [&_path]:!fill-white" />
      </span>
    </span>
  );
}

const pillClass =
  "inline-flex h-8 items-center gap-2 rounded-full border border-fd-border bg-fd-secondary/60 px-3 text-sm text-fd-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground";

export function CopyPageMenu({
  markdownUrl,
  title,
  component,
  className,
}: CopyPageMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [copiedKind, setCopiedKind] = React.useState<"prompt" | "markdown" | null>(
    null,
  );

  const pageUrl =
    typeof window === "undefined" ? "" : window.location.href;

  async function copyText(text: string, kind?: "prompt" | "markdown") {
    await navigator.clipboard.writeText(text);
    if (kind) {
      setCopiedKind(kind);
      window.setTimeout(() => setCopiedKind(null), 1500);
    }
    setOpen(false);
  }

  async function copyMarkdown() {
    const text = await fetchText(markdownUrl);
    await copyText(text, "markdown");
  }

  async function copyPrompt() {
    const url = pageUrl || markdownUrl;
    await copyText(buildPrompt(url, title), "prompt");
  }

  async function copyUsage() {
    if (!component) return;
    await copyText(buildUsageExample(component));
  }

  async function copySource() {
    if (!component) return;
    const item = (await fetchText(`/r/${component}.json`).then((t) =>
      JSON.parse(t),
    )) as { files?: { content?: string }[] };
    const source = item.files?.[0]?.content;
    if (!source) throw new Error("No source in registry item");
    await copyText(source);
  }

  async function copyInstall() {
    if (!component) return;
    await copyText(buildInstallCommand(component));
  }

  async function copyMcp() {
    await copyText(MCP_JSON);
  }

  const prompt = buildPrompt(pageUrl || markdownUrl, title);
  const chatgptUrl = `https://chatgpt.com/?${new URLSearchParams({
    prompt,
    hints: "search",
  })}`;
  const claudeUrl = `https://claude.ai/new?${new URLSearchParams({ q: prompt })}`;
  const v0Url = `https://v0.dev/chat?${new URLSearchParams({ q: prompt })}`;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <button type="button" onClick={() => void copyPrompt()} className={pillClass}>
        <PromptBrandStack />
        {copiedKind === "prompt" ? "已复制" : "复制提示词"}
      </button>

      <div className="inline-flex h-8 overflow-hidden rounded-full border border-fd-border bg-fd-secondary/60">
        <button
          type="button"
          onClick={() => void copyMarkdown()}
          className="inline-flex items-center gap-1.5 px-3 text-sm text-fd-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          {copiedKind === "markdown" ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
          {copiedKind === "markdown" ? "已复制" : "复制页面"}
        </button>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            className={cn(
              "inline-flex items-center border-l border-fd-border px-2 text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground",
              open && "bg-fd-accent text-fd-accent-foreground",
            )}
            aria-label="更多复制选项"
          >
            <ChevronDown className="size-3.5" />
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-64 gap-0 overflow-hidden rounded-xl border border-fd-border bg-fd-popover p-1.5 shadow-lg"
          >
            <div className="flex flex-col">
              <MenuRow
                icon={<FileCode2 />}
                label="复制 Markdown"
                onSelect={copyMarkdown}
              />
              <MenuRow
                icon={<Sparkles />}
                label="复制提示词"
                onSelect={copyPrompt}
              />
              {component ? (
                <>
                  <MenuRow
                    icon={<Copy />}
                    label="复制使用示例"
                    onSelect={copyUsage}
                  />
                  <MenuRow
                    icon={<Code2 />}
                    label="复制组件源码"
                    onSelect={copySource}
                  />
                  <MenuRow
                    icon={<Terminal />}
                    label="复制安装命令"
                    onSelect={copyInstall}
                  />
                </>
              ) : null}
            </div>

            <div className="my-1.5 h-px bg-fd-border" />

            <div className="flex flex-col">
              <MenuRow
                branded
                icon={<CursorIcon />}
                label="将 MCP 添加到 Cursor"
                onSelect={copyMcp}
              />
              <MenuRow
                branded
                icon={<VscodeIcon />}
                label="将 MCP 添加到 VS Code"
                onSelect={copyMcp}
              />
            </div>

            <div className="my-1.5 h-px bg-fd-border" />

            <div className="flex flex-col">
              <MenuRow
                branded
                icon={<ChatGptIcon />}
                label="在 ChatGPT 中打开"
                href={chatgptUrl}
                external
              />
              <MenuRow
                branded
                icon={<ClaudeIcon />}
                label="在 Claude 中打开"
                href={claudeUrl}
                external
              />
              <MenuRow
                branded
                icon={<V0Icon />}
                label="在 v0 中打开"
                href={v0Url}
                external
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
