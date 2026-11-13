"use client";

import { Button } from "@/components/base/buttons/button";
import { Notification } from "@/components/base/notification/notification";
import { toast, Toaster } from "@/components/base/toast/toast";
import { cx } from "@/utils/cx";

export function ToastStatusPreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex w-full max-w-sm flex-col gap-3", className)}>
      <Notification status="information" title="正在同步账号" description="请稍候。" />
      <Notification status="success" title="已保存更改" />
      <Notification status="error" title="上传失败" description="文件超过 20MB。" />
      <Notification status="neutral" title="今晚 23:00 维护" />
    </div>
  );
}

export function ToastTriggersPreview({ className }: { className?: string }) {
  return (
    <div className={cx("flex flex-wrap items-center justify-center gap-2", className)}>
      <Toaster />
      <Button variant="secondary" onClick={() => toast.info("已加入队列")}>
        信息
      </Button>
      <Button onClick={() => toast.success("已保存更改")}>成功</Button>
      <Button
        variant="danger"
        onClick={() =>
          toast.error("上传失败", { description: "文件超过 20MB。" })
        }
      >
        错误
      </Button>
    </div>
  );
}
