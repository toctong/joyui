"use client";

import {
  RiDeleteBinLine,
  RiEditLine,
  RiFolderTransferLine,
  RiShareLine,
} from "@remixicon/react";
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSubmenu,
  ContextMenuTrigger,
} from "@/components/base/context-menu/context-menu";
import { cx } from "@/utils/cx";

function Target({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      tabIndex={0}
      className={cx(
        "flex w-full max-w-xs cursor-default items-center justify-center rounded-xl border border-dashed border-border-button-default bg-background-secondary-default px-4 py-8 text-body-2-regular text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
        className,
      )}
    >
      {label}
    </div>
  );
}

export function ContextMenuBasicPreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex w-full justify-center", className)}>
      <ContextMenuTrigger>
        <Target label="右键 / 长按 / Shift+F10" />
        <ContextMenu aria-label="文件操作">
          <ContextMenuItem id="rename" icon={RiEditLine} shortcut="⌘R">
            重命名
          </ContextMenuItem>
          <ContextMenuItem id="share" icon={RiShareLine}>
            分享
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem id="delete" icon={RiDeleteBinLine} variant="danger">
            删除
          </ContextMenuItem>
        </ContextMenu>
      </ContextMenuTrigger>
    </div>
  );
}

export function ContextMenuSubmenuPreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex w-full justify-center", className)}>
      <ContextMenuTrigger>
        <Target label="含子菜单的操作" />
        <ContextMenu aria-label="移动菜单">
          <ContextMenuItem id="rename" icon={RiEditLine}>
            重命名
          </ContextMenuItem>
          <ContextMenuSubmenu label="移动到" icon={RiFolderTransferLine}>
            <ContextMenuItem id="inbox">收件箱</ContextMenuItem>
            <ContextMenuItem id="archive">归档</ContextMenuItem>
          </ContextMenuSubmenu>
        </ContextMenu>
      </ContextMenuTrigger>
    </div>
  );
}

export function ContextMenuFileScenario({ className }: { className?: string }) {
  return (
    <div className={cx("flex w-full max-w-sm justify-center", className)}>
      <ContextMenuTrigger>
        {({ isOpen }) => (
          <>
            <div
              tabIndex={0}
              className={cx(
                "flex w-full items-center justify-between gap-3 rounded-2xl border bg-background-primary-default p-4 shadow-xs outline-none",
                isOpen
                  ? "border-accent-500"
                  : "border-separator-border",
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-body-medium text-text-primary">季度报告.pdf</p>
                <p className="text-caption-1-medium text-text-secondary">右键打开菜单</p>
              </div>
            </div>
            <ContextMenu aria-label="文件操作">
              <ContextMenuItem id="rename" icon={RiEditLine} shortcut="⌘R">
                重命名
              </ContextMenuItem>
              <ContextMenuItem id="share" icon={RiShareLine}>
                分享
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem id="delete" icon={RiDeleteBinLine} variant="danger">
                删除
              </ContextMenuItem>
            </ContextMenu>
          </>
        )}
      </ContextMenuTrigger>
    </div>
  );
}
