"use client";

import { AuthCard } from "@/components/application/auth/auth-card";
import { cx } from "@/utils/cx";

export function AuthCardModesPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-5xl flex-wrap items-start justify-center gap-6",
        className,
      )}
    >
      <AuthCard mode="signin" className="max-w-[360px]" />
      <AuthCard mode="signup" className="max-w-[360px]" />
    </div>
  );
}

export function AuthCardVerifyPreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex w-full justify-center", className)}>
      <AuthCard mode="verify" email="you@joyui.dev" className="max-w-[400px]" />
    </div>
  );
}

export function AuthCardMediaPreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex w-full justify-center", className)}>
      <AuthCard
        mode="signin"
        layout="inline"
        providers={["google", "github", "apple"]}
        media={
          <div className="flex size-full items-end bg-linear-to-br from-accent-500 to-accent-800 p-6">
            <p className="text-title-2-medium text-white">Welcome back</p>
          </div>
        }
      />
    </div>
  );
}
