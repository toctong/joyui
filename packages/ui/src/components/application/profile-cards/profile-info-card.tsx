"use client";

import { useTemplateCopy } from "../../foundations/template-copy/template-copy";

import {
  RiAddLine,
  RiBriefcaseLine,
  RiMailLine,
  RiMapPinLine,
  RiUserLine,
} from "@remixicon/react";
import type { ComponentType, ReactNode } from "react";
import { Avatar } from "../../base/avatar/avatar";
import { Button } from "../../base/buttons/button";
import { cx } from "../../../utils/cx";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export type ProfileInfoDetail = {
  icon: IconComponent;
  label: string;
  value: string;
};

export type ProfileInfoCardProps = {
  name?: string;
  initials?: string;
  avatarSrc?: string;
  details?: ProfileInfoDetail[];
  onAddPhoto?: () => void;
  /** Extra node under the name (role badge, etc.). */
  subtitle?: ReactNode;
  className?: string;
};

const DEFAULT_DETAILS: ProfileInfoDetail[] = [
  { icon: RiUserLine, label: "角色", value: "产品设计师" },
  { icon: RiBriefcaseLine, label: "团队", value: "Growth" },
  { icon: RiMailLine, label: "邮箱", value: "alex@joyui.dev" },
  { icon: RiMapPinLine, label: "地点", value: "上海" },
];

/**
 * Generic profile card: avatar, name, and a stack of label/value rows.
 * Formerly PatientInfoCard — data is injectable for HR / CRM / health demos.
 */
export function ProfileInfoCard({
  name = "Alex Chen",
  initials = "AC",
  avatarSrc,
  details = DEFAULT_DETAILS,
  onAddPhoto,
  subtitle,
  className,
}: ProfileInfoCardProps = {}) {
  const localize = useTemplateCopy();
  return localize((
    <section
      className={cx(
        "flex h-[330px] w-full min-w-0 flex-col items-center gap-[15px] rounded-[20px] border border-border-button-default bg-background-secondary-default px-2.5 pt-6 pb-2.5 shadow-xs",
        className,
      )}
    >
      <div className="relative">
        <Avatar
          size="lg"
          initials={initials}
          src={avatarSrc}
          className="size-[66px] text-[24.75px]"
        />
        <Button
          variant="secondary"
          size="xs"
          iconOnly
          leadingIcon={RiAddLine}
          aria-label="Add profile photo"
          onClick={onAddPhoto}
          className="absolute -top-0.5 -end-0.5 rounded-full"
        />
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <p className="text-title-2-medium whitespace-nowrap text-text-primary">{name}</p>
        {subtitle ? (
          <div className="text-caption-1-medium text-text-secondary">{subtitle}</div>
        ) : null}
      </div>
      <div className="flex w-full flex-1 flex-col gap-2.5 overflow-y-auto">
        {details.length === 0 ? (
          <p className="px-2 text-center text-body-2-regular text-text-tertiary">暂无资料</p>
        ) : (
          details.map((detail) => (
            <div
              key={detail.label}
              className="flex w-full items-center gap-2 rounded-2lg bg-background-inner-default px-2.5 py-2"
            >
              <div className="flex min-w-0 flex-1 items-center gap-1.5">
                <detail.icon className="size-4 shrink-0 text-text-secondary" aria-hidden />
                <span className="truncate text-body-regular text-text-secondary">
                  {detail.label}
                </span>
              </div>
              <span className="max-w-[45%] shrink-0 truncate text-end text-body-medium text-text-primary">
                {detail.value}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  ));
}

