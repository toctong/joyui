"use client";

import type { ComponentProps, ReactNode, Ref } from "react";
import {
  RiFileCodeLine,
  RiFileTextLine,
  RiFolder3Line,
  RiFolderOpenLine,
  RiSearchLine,
} from "@remixicon/react";
import { TreeView, TreeViewItem } from "@/components/base/tree-view/tree-view";
import { cx } from "@/utils/cx";

/**
 * File-explorer chrome around TreeView — toolbar, path crumb, icon defaults.
 *
 *   <TreeViewFiles path="src / components" aria-label="项目文件">
 *     <TreeViewFiles.Folder id="src" label="src">
 *       <TreeViewFiles.File id="button" label="button.tsx" />
 *     </TreeViewFiles.Folder>
 *   </TreeViewFiles>
 */

export interface TreeViewFilesProps
  extends Omit<ComponentProps<typeof TreeView>, "children"> {
  /** Breadcrumb / path shown above the tree. */
  path?: ReactNode;
  /** Optional leading toolbar actions (search, new file…). */
  toolbar?: ReactNode;
  /** Panel title beside the path. */
  title?: ReactNode;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function TreeViewFiles({
  path,
  toolbar,
  title = "资源管理器",
  className,
  children,
  size = "sm",
  showGuides = true,
  ...props
}: TreeViewFilesProps) {
  return (
    <div
      className={cx(
        "flex w-full flex-col overflow-hidden rounded-3xl border border-border-button-default bg-background-primary-default",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-separator-border px-3 py-2.5">
        <div className="min-w-0">
          <p className="text-caption-1-medium text-text-tertiary">{title}</p>
          {path ? (
            <p className="truncate text-body-2-regular text-text-secondary">{path}</p>
          ) : null}
        </div>
        {toolbar ?? (
          <span className="flex size-8 items-center justify-center rounded-xl text-foreground-icon-secondary">
            <RiSearchLine className="size-4" aria-hidden />
          </span>
        )}
      </div>
      <TreeView
        {...props}
        size={size}
        showGuides={showGuides}
        className="rounded-none border-0"
      >
        {children}
      </TreeView>
    </div>
  );
}

export interface TreeViewFilesFolderProps
  extends Omit<ComponentProps<typeof TreeViewItem>, "icon" | "expandedIcon"> {
  icon?: ComponentProps<typeof TreeViewItem>["icon"];
  expandedIcon?: ComponentProps<typeof TreeViewItem>["expandedIcon"];
}

export function TreeViewFilesFolder({
  icon = RiFolder3Line,
  expandedIcon = RiFolderOpenLine,
  iconClassName = "text-chart-8-active",
  ...props
}: TreeViewFilesFolderProps) {
  return (
    <TreeViewItem
      {...props}
      icon={icon}
      expandedIcon={expandedIcon}
      iconClassName={iconClassName}
    />
  );
}

export interface TreeViewFilesFileProps
  extends Omit<ComponentProps<typeof TreeViewItem>, "icon" | "children"> {
  /** Prefer code glyph for .ts/.tsx/.js; text otherwise. */
  kind?: "code" | "text";
}

export function TreeViewFilesFile({
  kind,
  label,
  iconClassName,
  ...props
}: TreeViewFilesFileProps) {
  const inferred =
    kind ??
    (/\.(tsx?|jsx?|mjs|cjs|css|json)$/i.test(String(label)) ? "code" : "text");
  const Icon = inferred === "code" ? RiFileCodeLine : RiFileTextLine;
  return (
    <TreeViewItem
      {...props}
      label={label}
      icon={Icon}
      iconClassName={
        iconClassName ??
        (inferred === "code" ? "text-accent-700" : "text-chart-1-active")
      }
    />
  );
}

Object.assign(TreeViewFiles, {
  Folder: TreeViewFilesFolder,
  File: TreeViewFilesFile,
});
