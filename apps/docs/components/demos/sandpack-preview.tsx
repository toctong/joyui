"use client";

import * as React from "react";
import {
  SandpackProvider,
  SandpackPreview,
  SandpackCodeEditor,
  SandpackLayout,
} from "@codesandbox/sandpack-react";
import { Code2, Eye } from "lucide-react";
import { cn } from "@/lib/cn";
import { DocsToolbarActions } from "@/components/docs-page-actions";
import { BASE_DEPENDENCIES, createSandboxFiles } from "./sandpack-files";

function useDocsTheme(): "light" | "dark" {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  React.useEffect(() => {
    const root = document.documentElement;
    const sync = () =>
      setTheme(root.classList.contains("dark") ? "dark" : "light");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

type Mode = "preview" | "code";

export type JoySandpackProps = {
  /** Content of /App.tsx (demo entry). */
  code: string;
  /** Extra virtual files, e.g. component sources. */
  files?: Record<string, string>;
  /** Extra npm dependencies for the sandbox. */
  dependencies?: Record<string, string>;
  className?: string;
  editorHeight?: number;
  previewHeight?: number;
};

function Toolbar({
  mode,
  onModeChange,
}: {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-fd-border bg-fd-secondary/30 px-2 py-1.5">
      <div className="inline-flex rounded-lg border border-fd-border bg-fd-background p-0.5 text-sm">
        <button
          type="button"
          onClick={() => onModeChange("preview")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-colors",
            mode === "preview"
              ? "bg-fd-accent text-fd-accent-foreground shadow-sm"
              : "text-fd-muted-foreground hover:text-fd-foreground",
          )}
        >
          <Eye className="size-3.5" />
          é˘č§
        </button>
        <button
          type="button"
          onClick={() => onModeChange("code")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-colors",
            mode === "code"
              ? "bg-fd-accent text-fd-accent-foreground shadow-sm"
              : "text-fd-muted-foreground hover:text-fd-foreground",
          )}
        >
          <Code2 className="size-3.5" />
          äťŁç 
        </button>
      </div>
      <DocsToolbarActions />
    </div>
  );
}

function SandpackBody({
  mode,
  editorHeight,
  previewHeight,
}: {
  mode: Mode;
  editorHeight: number;
  previewHeight: number;
}) {
  return (
    <SandpackLayout
      style={{
        border: "none",
        borderRadius: 0,
        background: "transparent",
      }}
    >
      <SandpackCodeEditor
        showLineNumbers
        showInlineErrors
        style={{
          height: editorHeight,
          flex: 1,
          display: mode === "code" ? "flex" : "none",
        }}
      />
      <SandpackPreview
        showOpenInCodeSandbox={false}
        showRefreshButton
        style={{
          height: previewHeight,
          flex: 1,
          display: mode === "preview" ? "flex" : "none",
        }}
      />
    </SandpackLayout>
  );
}

export function JoySandpack({
  code,
  files = {},
  dependencies = {},
  className,
  editorHeight = 280,
  previewHeight = 220,
}: JoySandpackProps) {
  const [mode, setMode] = React.useState<Mode>("preview");
  const theme = useDocsTheme();

  const sandpackFiles = React.useMemo(
    () => createSandboxFiles(code, files),
    [code, files],
  );

  return (
    <div
      className={cn(
        "joy-sandpack not-prose my-4 overflow-hidden rounded-xl border border-fd-border",
        className,
      )}
    >
      <SandpackProvider
        template="react-ts"
        theme={theme}
        files={sandpackFiles}
        customSetup={{
          dependencies: {
            ...BASE_DEPENDENCIES,
            ...dependencies,
          },
        }}
        options={{
          activeFile: "/src/App.tsx",
          visibleFiles: ["/src/App.tsx"],
          recompileMode: "delayed",
          recompileDelay: 400,
          classes: {
            "sp-wrapper": "!bg-transparent",
            "sp-layout": "!bg-transparent",
          },
        }}
      >
        <Toolbar mode={mode} onModeChange={setMode} />
        <SandpackBody
          mode={mode}
          editorHeight={editorHeight}
          previewHeight={previewHeight}
        />
      </SandpackProvider>
    </div>
  );
}

/** Turn import + JSX snippets into a complete React demo module. */
export function toReactDemoFile(source: string) {
  const trimmed = source.trim();
  // Full modules (`export function Example` / default) pass through.
  if (/export\s+default\s+function\s+\w+/.test(trimmed)) {
    return trimmed.endsWith("\n") ? trimmed : `${trimmed}\n`;
  }
  if (/export\s+function\s+\w+/.test(trimmed)) {
    const normalized = trimmed.replace(
      /export\s+function\s+(\w+)/,
      "export default function Demo",
    );
    return normalized.endsWith("\n") ? normalized : `${normalized}\n`;
  }

  let rest = trimmed;
  const imports: string[] = [];
  while (true) {
    const match = rest.match(/^import\s+[\s\S]*?from\s+["'][^"']+["']\s*;?\s*/);
    if (!match) break;
    imports.push(`${match[0].trim().replace(/;?\s*$/, "")};`);
    rest = rest.slice(match[0].length).trimStart();
  }

  const jsx = rest.trim() || "null";
  const indent = (text: string, spaces: number) => {
    const pad = " ".repeat(spaces);
    return text
      .split("\n")
      .map((line) => (line.length ? pad + line : line))
      .join("\n");
  };

  const importBlock = imports.length ? `${imports.join("\n")}\n\n` : "";

  return `"use client";

${importBlock}export default function Demo() {
  return (
    <>
${indent(jsx, 6)}
    </>
  );
}
`;
}

/**
 * Grows with the painted height of direct children so tall demos are not
 * clipped. Only direct children are measured — walking every descendant
 * falsely includes virtualized list spacers (e.g. DataGrid) and blows the
 * canvas up, which then vertically centers the real preview with a huge gap.
 */
function AutoSizePreviewCanvas({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [minHeight, setMinHeight] = React.useState<number | undefined>();

  React.useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const style = getComputedStyle(root);
        const padTop = Number.parseFloat(style.paddingTop) || 0;
        const padBottom = Number.parseFloat(style.paddingBottom) || 0;

        let contentH = 0;
        for (const child of root.children) {
          if (!(child instanceof HTMLElement)) continue;
          contentH = Math.max(contentH, child.offsetHeight);
        }

        const needed = Math.ceil(contentH + padTop + padBottom);
        if (needed > 0) {
          setMinHeight((prev) => (prev === needed ? prev : needed));
        }
      });
    };

    const ro = new ResizeObserver(measure);
    ro.observe(root);
    for (const child of root.children) {
      if (child instanceof HTMLElement) ro.observe(child);
    }
    const mo = new MutationObserver(() => {
      for (const child of root.children) {
        if (child instanceof HTMLElement) ro.observe(child);
      }
      measure();
    });
    mo.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    measure();
    const t1 = window.setTimeout(measure, 120);
    const t2 = window.setTimeout(measure, 400);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      mo.disconnect();
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [children]);

  return (
    <div
      ref={ref}
      className={cn(
        "flex min-h-40 items-center justify-center bg-fd-background p-6",
        className,
      )}
      style={minHeight ? { minHeight } : undefined}
    >
      {children}
    </div>
  );
}

/** Unified frame for local (non-Sandpack) demos — same chrome as JoySandpack. */
export function DemoFrame({
  children,
  code,
  className,
  canvasClassName,
  fileName = "demo.tsx",
}: {
  children: React.ReactNode;
  code?: string;
  className?: string;
  canvasClassName?: string;
  /** Shown above the code panel (React file example). */
  fileName?: string;
}) {
  const [mode, setMode] = React.useState<Mode>("preview");
  const demoSource = code ? toReactDemoFile(code) : undefined;

  return (
    <div
      className={cn(
        // Keep overflow visible so portaled-in-place overlays (Tooltip / Popover
        // arrows) are not clipped by the rounded frame.
        "not-prose my-4 overflow-visible rounded-xl border border-fd-border",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 overflow-hidden rounded-t-xl border-b border-fd-border bg-fd-secondary/30 px-2 py-1.5">
        <div className="inline-flex rounded-lg border border-fd-border bg-fd-background p-0.5 text-sm">
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-colors",
              mode === "preview"
                ? "bg-fd-accent text-fd-accent-foreground shadow-sm"
                : "text-fd-muted-foreground hover:text-fd-foreground",
            )}
          >
            <Eye className="size-3.5" />
            预览
          </button>
          <button
            type="button"
            onClick={() => setMode("code")}
            disabled={!demoSource}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-colors disabled:opacity-40",
              mode === "code"
                ? "bg-fd-accent text-fd-accent-foreground shadow-sm"
                : "text-fd-muted-foreground hover:text-fd-foreground",
            )}
          >
            <Code2 className="size-3.5" />
            代码
          </button>
        </div>
        <DocsToolbarActions />
      </div>
      {mode === "preview" ? (
        <AutoSizePreviewCanvas className={cn("overflow-visible rounded-b-xl", canvasClassName)}>
          {children}
        </AutoSizePreviewCanvas>
      ) : (
        <div className="overflow-hidden rounded-b-xl bg-fd-secondary/40">
          <div className="border-b border-fd-border px-4 py-2 font-mono text-xs text-fd-muted-foreground">
            {fileName}
          </div>
          <pre className="max-h-[420px] overflow-auto p-4 text-sm text-fd-foreground">
            <code>{demoSource}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
