"use client";

import { RiMailLine, RiSearchLine } from "@remixicon/react";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";

export function InputStatesPreview({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-md gap-4", className)}>
      <Input label="邮箱" placeholder="you@company.com" leadingIcon={RiMailLine} />
      <Input label="搜索" placeholder="快速搜索" leadingIcon={RiSearchLine} hint="支持项目与文件名" />
      <Input label="工号" placeholder="必填" isRequired hint="工号用于登录" />
      <Input
        label="邮箱"
        defaultValue="not-an-email"
        isInvalid
        errorMessage="请输入有效邮箱"
        leadingIcon={RiMailLine}
      />
      <Input label="只读字段" defaultValue="不可编辑" isDisabled />
    </div>
  );
}

export function InputLoginScenario({ className }: { className?: string }) {
  return (
    <form
      className={cx(
        "flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-separator-border bg-background-primary-default p-5 shadow-xs",
        className,
      )}
      onSubmit={(e) => e.preventDefault()}
    >
      <div>
        <p className="text-title-2-medium text-text-primary">欢迎回来</p>
        <p className="mt-1 text-body-2-regular text-text-secondary">
          登录以继续上次的工作。
        </p>
      </div>
      <Input label="邮箱" type="email" placeholder="you@company.com" leadingIcon={RiMailLine} isRequired />
      <Input label="密码" type="password" placeholder="••••••••" isRequired />
    </form>
  );
}
