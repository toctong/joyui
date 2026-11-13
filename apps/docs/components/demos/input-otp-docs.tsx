"use client";

import { InputOtp } from "@/components/base/input-otp/input-otp";
import { cx } from "@/utils/cx";

export function InputOtpLengthPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex w-full max-w-md flex-col items-center gap-6", className)}
      role="group"
      aria-label="OTP 位数"
    >
      <InputOtp aria-label="六位验证码" length={6} />
      <InputOtp aria-label="四位验证码" length={4} />
    </div>
  );
}

export function InputOtpGroupPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx("flex w-full max-w-md flex-col items-center gap-6", className)}
      role="group"
      aria-label="OTP 分组与校验"
    >
      <InputOtp aria-label="分组验证码" length={6} groupEvery={3} />
      <InputOtp aria-label="无效验证码" length={6} isInvalid defaultValue="12" />
    </div>
  );
}

export function InputOtpVerifyScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-separator-border bg-background-primary-default p-5 shadow-xs",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <p className="text-title-3-semibold text-text-primary">验证邮箱</p>
        <p className="text-body-regular text-text-secondary">
          我们已向 <span className="text-text-primary">you@company.com</span> 发送 6 位验证码。
        </p>
      </div>
      <InputOtp aria-label="邮箱验证码" length={6} groupEvery={3} />
    </div>
  );
}
