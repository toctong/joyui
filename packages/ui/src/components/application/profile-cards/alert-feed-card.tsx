"use client";

import { useTemplateCopy } from "../../foundations/template-copy/template-copy";

import { useState, type ComponentType } from "react";
import {
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiInformationFill,
  RiNotification3Fill,
} from "@remixicon/react";
import { WeekRangePill } from "../../base/week-range-pill/week-range-pill";
import { cx } from "../../../utils/cx";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export type AlertFeedItem = {
  icon: IconComponent;
  iconBg: string;
  title: string;
  description: string;
  date: string;
};

export type AlertFeedCardProps = {
  title?: string;
  countLabel?: string;
  count?: number;
  rangeLabel?: string;
  onPrevRange?: () => void;
  onNextRange?: () => void;
  items?: AlertFeedItem[];
  className?: string;
};

const DEFAULT_ITEMS: AlertFeedItem[] = [
  {
    icon: RiErrorWarningFill,
    iconBg: "bg-notification-error-foreground",
    title: "构建失败",
    description: "main 分支 CI 在 typecheck 步骤失败，已通知相关负责人。",
    date: "今天",
  },
  {
    icon: RiInformationFill,
    iconBg: "bg-chart-6",
    title: "依赖更新",
    description: "@joyui/react 有新的补丁版本可用，建议在本周内升级。",
    date: "昨天",
  },
  {
    icon: RiCheckboxCircleFill,
    iconBg: "bg-chart-7-active",
    title: "发布成功",
    description: "docs 站点已部署到生产环境，预览链接已写入变更说明。",
    date: "周一",
  },
  {
    icon: RiNotification3Fill,
    iconBg: "bg-chart-5",
    title: "审批待处理",
    description: "有 2 条设计评审仍在等待你的反馈。",
    date: "周日",
  },
];

/**
 * Scrollable alert / activity feed with an optional week-range header.
 * Formerly ImportantAlertsCard — content is injectable for any vertical.
 */
export function AlertFeedCard({
  title = "重要动态",
  countLabel = "本周",
  count = 12,
  rangeLabel = "本周",
  onPrevRange,
  onNextRange,
  items = DEFAULT_ITEMS,
  className,
}: AlertFeedCardProps = {}) {
  const localize = useTemplateCopy();
  const [scrolled, setScrolled] = useState(false);

  return localize((
    <section
      className={cx(
        "flex h-[330px] w-full min-w-0 flex-col gap-4 overflow-hidden rounded-[20px] border border-border-button-default bg-background-secondary-default px-2.5 pt-2.5 shadow-xs",
        className,
      )}
    >
      <div className="flex w-full items-start justify-between gap-2 px-1.5 pt-1.5">
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-body-medium text-text-secondary">{title}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-title-1-medium whitespace-nowrap text-text-primary tabular-nums">
              {count}
            </p>
            <span className="text-caption-1-medium whitespace-nowrap text-text-secondary">
              {countLabel}
            </span>
          </div>
        </div>
        <WeekRangePill label={rangeLabel} onPrev={onPrevRange} onNext={onNextRange} />
      </div>

      <div className="relative min-h-0 w-full flex-1">
        <div
          className="flex h-full w-full flex-col gap-2.5 overflow-y-auto overscroll-contain pb-2.5"
          onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 0)}
        >
          {items.length === 0 ? (
            <p className="px-2 py-6 text-center text-body-2-regular text-text-tertiary">
              暂无动态
            </p>
          ) : (
            items.map((alert, index) => (
              <div
                key={`${alert.title}-${index}`}
                className="relative flex w-full shrink-0 gap-2.5 rounded-2lg bg-background-inner-default p-2.5 pe-16"
              >
                <span
                  className={cx(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                    alert.iconBg,
                  )}
                >
                  <alert.icon className="size-[18px] text-text-white" aria-hidden />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="text-body-medium text-text-primary">{alert.title}</p>
                  <p className="text-body-2-regular text-text-secondary">{alert.description}</p>
                </div>
                <span className="absolute top-2.5 end-2.5 rounded-md bg-background-secondary-default px-1.5 py-px text-caption-1-medium whitespace-nowrap text-text-secondary">
                  {alert.date}
                </span>
              </div>
            ))
          )}
        </div>
        <div
          aria-hidden
          className={cx(
            "pointer-events-none absolute inset-x-0 top-0 h-10 bg-linear-to-b from-background-secondary-default to-transparent",
            "transition-opacity duration-200 ease-out",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        />
      </div>
    </section>
  ));
}

