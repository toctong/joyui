"use client";

import { FormField } from "@/components/base/form-field/form-field";
import { InputBase } from "@/components/base/input/input";
import { cx } from "@/utils/cx";

export function FormFieldStatesPreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex w-full max-w-md flex-col gap-5", className)}>
      <FormField label="项目名称" hint="对外显示名" isRequired htmlFor="proj-ok">
        <InputBase id="proj-ok" placeholder="MarHub" defaultValue="JoyUI" />
      </FormField>
      <FormField
        label="回调地址"
        errorMessage="请输入合法的 https URL"
        isInvalid
        isRequired
        htmlFor="proj-err"
      >
        <InputBase id="proj-err" placeholder="https://" defaultValue="ftp://bad" />
      </FormField>
    </div>
  );
}
