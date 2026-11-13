"use client";

import { useState } from "react";
import { Input } from "@/components/base/input/input";
import { PasswordStrength } from "@/components/base/password-strength/password-strength";
import { cx } from "@/utils/cx";

export function PasswordStrengthLivePreview({ className }: { className?: string }) {
  const [value, setValue] = useState("Joy");
  return (
    <div className={cx("flex w-full max-w-sm flex-col gap-3", className)}>
      <Input
        label="密码"
        type="password"
        value={value}
        onChange={setValue}
        placeholder="输入密码"
      />
      <PasswordStrength value={value} />
    </div>
  );
}

export function PasswordStrengthLevelPreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex w-full max-w-sm flex-col gap-4", className)}>
      {([1, 2, 3, 4] as const).map((level) => (
        <PasswordStrength key={level} level={level} />
      ))}
    </div>
  );
}
