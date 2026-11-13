"use client";

import { Alert } from "@/components/base/alert/alert";
import { cx } from "@/utils/cx";

const TONES = [
  { id: "info" as const, title: "同步已暂停", body: "上游接口限流，将在 5 分钟后自动重试。" },
  { id: "success" as const, title: "设置已保存", body: "命名规则与过滤条件已立即生效。" },
  { id: "warning" as const, title: "Cookie 即将过期", body: "请在设置中重新登录夸克账号。" },
  { id: "error" as const, title: "转存失败", body: "分享链接无效或已失效，请检查后重试。" },
];

export function AlertTonePreview({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-lg gap-3", className)} role="group" aria-label="提示条语气">
      {TONES.map((t) => (
        <Alert key={t.id} tone={t.id} title={t.title}>
          {t.body}
        </Alert>
      ))}
    </div>
  );
}

export function AlertScenarioPreview({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-lg flex-col gap-4 rounded-2xl border border-separator-border bg-background-primary-default p-5 shadow-xs",
        className,
      )}
    >
      <div>
        <p className="text-title-2-medium text-text-primary">新建任务</p>
        <p className="mt-1 text-body-2-regular text-text-secondary">填写分享链接后开始转存。</p>
      </div>
      <Alert tone="error" title="无法解析分享链接" role="alert">
        请确认链接完整，且未设置提取码限制。
      </Alert>
      <div className="h-9 rounded-lg border border-border-secondary-default bg-background-secondary-default/50" />
    </div>
  );
}
