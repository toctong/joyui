"use client";

import { useState } from "react";
import { Button } from "@/components/base/buttons/button";
import {
  SettingsModal,
  type SettingsPage,
} from "@/components/application/settings/settings-modal";
import { cx } from "@/utils/cx";

function OpenSettingsDemo({
  defaultPage,
  label,
  className,
}: {
  defaultPage?: SettingsPage;
  label: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cx("flex flex-col items-center gap-3", className)}>
      <Button onClick={() => setOpen(true)}>{label}</Button>
      <SettingsModal
        isOpen={open}
        onClose={() => setOpen(false)}
        defaultPage={defaultPage}
        planArtSrc="/templates/settings-plan-art.png"
      />
    </div>
  );
}

export function SettingsModalGeneralPreview({ className }: { className?: string }) {
  return (
    <OpenSettingsDemo
      className={className}
      defaultPage="general"
      label="打开设置 · 通用"
    />
  );
}

export function SettingsModalProfilePreview({ className }: { className?: string }) {
  return (
    <OpenSettingsDemo
      className={className}
      defaultPage="profile"
      label="打开设置 · 资料"
    />
  );
}

export function SettingsModalToolsPreview({ className }: { className?: string }) {
  return (
    <OpenSettingsDemo
      className={className}
      defaultPage="tools"
      label="打开设置 · 工具"
    />
  );
}
