"use client";

import { useState } from "react";
import {
  RiFolder3Line,
  RiHome5Line,
  RiSearchLine,
  RiSettings3Line,
} from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import {
  CommandPalette,
  CommandPaletteItem,
  CommandPaletteSection,
} from "@/components/base/command-palette/command-palette";
import { cx } from "@/utils/cx";

export function CommandPaletteTriggerPreview({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cx("flex flex-col items-center gap-3", className)}>
      <Button variant="secondary" size="small" onClick={() => setOpen(true)}>
        打开命令面板
      </Button>
      <CommandPalette
        isOpen={open}
        onOpenChange={setOpen}
        shortcut={false}
        placeholder="搜索页面或命令…"
        aria-label="命令面板"
        emptyState="没有匹配结果"
      >
        <CommandPaletteSection title="导航">
          <CommandPaletteItem id="home" icon={RiHome5Line}>
            仪表盘
          </CommandPaletteItem>
          <CommandPaletteItem id="settings" icon={RiSettings3Line} description="偏好与账号">
            设置
          </CommandPaletteItem>
        </CommandPaletteSection>
        <CommandPaletteSection title="操作">
          <CommandPaletteItem id="search" icon={RiSearchLine} shortcut="⌘F">
            全局搜索
          </CommandPaletteItem>
          <CommandPaletteItem id="files" icon={RiFolder3Line}>
            打开文件
          </CommandPaletteItem>
        </CommandPaletteSection>
      </CommandPalette>
    </div>
  );
}

export function CommandPaletteEmptyPreview({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cx("flex flex-col items-center gap-3", className)}>
      <Button variant="secondary" size="small" onClick={() => setOpen(true)}>
        演示空状态
      </Button>
      <CommandPalette
        isOpen={open}
        onOpenChange={setOpen}
        shortcut={false}
        inputValue="zzzz-no-match"
        emptyState="没有匹配「zzzz-no-match」的命令"
        aria-label="空状态命令面板"
        footer={false}
      >
        <CommandPaletteSection title="导航">
          <CommandPaletteItem id="home" icon={RiHome5Line}>
            仪表盘
          </CommandPaletteItem>
        </CommandPaletteSection>
      </CommandPalette>
    </div>
  );
}
