"use client";

import { TreeView, TreeViewItem } from "@/components/base/tree-view/tree-view";
import { cx } from "@/utils/cx";

export function TreeViewSizePreview({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-3xl gap-4 md:grid-cols-2", className)}>
      <div className="flex flex-col gap-2">
        <TreeView aria-label="小尺寸树" size="sm" defaultExpandedKeys={["src"]} className="max-w-full">
          <TreeViewItem id="src" label="src">
            <TreeViewItem id="a" label="button.tsx" />
          </TreeViewItem>
        </TreeView>
        <p className="text-center text-caption-1-medium text-text-tertiary">sm</p>
      </div>
      <div className="flex flex-col gap-2">
        <TreeView aria-label="中尺寸树" size="md" defaultExpandedKeys={["src"]} className="max-w-full">
          <TreeViewItem id="src" label="src">
            <TreeViewItem id="a" label="button.tsx" />
          </TreeViewItem>
        </TreeView>
        <p className="text-center text-caption-1-medium text-text-tertiary">md</p>
      </div>
    </div>
  );
}

export function TreeViewGuidesPreview({ className }: { className?: string }) {
  return (
    <TreeView
      aria-label="无引导线树"
      showGuides={false}
      defaultExpandedKeys={["docs"]}
      className={cx("max-w-sm", className)}
    >
      <TreeViewItem id="docs" label="docs">
        <TreeViewItem id="intro" label="intro.mdx" />
        <TreeViewItem id="api" label="api.mdx" />
      </TreeViewItem>
    </TreeView>
  );
}
