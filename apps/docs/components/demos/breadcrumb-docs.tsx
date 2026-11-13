"use client";

import { RiFolder3Line, RiHomeLine, RiSettings3Line } from "@remixicon/react";
import { Breadcrumb, BreadcrumbItem } from "@/components/base/breadcrumb/breadcrumb";
import { cx } from "@/utils/cx";

export function BreadcrumbIconPreview({ className }: { className?: string }) {
  return (
    <Breadcrumb aria-label="带图标面包屑" className={className}>
      <BreadcrumbItem icon={RiHomeLine} href="#">
        工作区
      </BreadcrumbItem>
      <BreadcrumbItem icon={RiFolder3Line} href="#">
        项目
      </BreadcrumbItem>
      <BreadcrumbItem icon={RiSettings3Line} current>
        设置
      </BreadcrumbItem>
    </Breadcrumb>
  );
}

export function BreadcrumbDeepPreview({ className }: { className?: string }) {
  return (
    <Breadcrumb aria-label="深层路径" className={className}>
      <BreadcrumbItem href="#">首页</BreadcrumbItem>
      <BreadcrumbItem href="#">发现</BreadcrumbItem>
      <BreadcrumbItem href="#">电影</BreadcrumbItem>
      <BreadcrumbItem current>星际穿越</BreadcrumbItem>
    </Breadcrumb>
  );
}

export function BreadcrumbPageScenario({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex w-full max-w-lg flex-col gap-3 rounded-2xl border border-separator-border bg-background-primary-default p-4 shadow-xs",
        className,
      )}
    >
      <Breadcrumb aria-label="设置路径">
        <BreadcrumbItem href="#">设置</BreadcrumbItem>
        <BreadcrumbItem href="#">账号</BreadcrumbItem>
        <BreadcrumbItem current>夸克 Cookie</BreadcrumbItem>
      </Breadcrumb>
      <p className="text-body-2-regular text-text-secondary">
        更新 Cookie 后，未完成的转存会自动重试。
      </p>
    </div>
  );
}
