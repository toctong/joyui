import type { ComponentType, HTMLAttributes, ReactNode, Ref } from "react";
import {
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiInformationFill,
} from "@remixicon/react";
import { cx, sortCx } from "../../../utils/cx";

/**
 * Inline feedback banner for forms and page-level messages.
 * Prefer Toast for transient success; Alert stays in layout until dismissed
 * or the condition clears.
 */

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export type AlertTone = "info" | "success" | "warning" | "error";

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: AlertTone;
  title?: ReactNode;
  children?: ReactNode;
  icon?: IconComponent;
  ref?: Ref<HTMLDivElement>;
}

const ICONS: Record<AlertTone, IconComponent> = {
  info: RiInformationFill,
  success: RiCheckboxCircleFill,
  warning: RiErrorWarningFill,
  error: RiErrorWarningFill,
};

const styles = sortCx({
  root: "flex w-full gap-2.5 rounded-xl border px-3.5 py-3 text-start",
  tone: {
    info: "border-border-secondary-default bg-background-secondary-default text-text-primary",
    success: "border-status-lime-background bg-status-lime-background text-status-lime-text",
    warning: "border-status-yellow-background bg-status-yellow-background text-status-yellow-text",
    error: "border-status-rose-background bg-status-rose-background text-status-rose-text",
  },
  icon: "size-5 shrink-0",
});

export function Alert({
  tone = "info",
  title,
  children,
  icon,
  className,
  ref,
  role = "status",
  ...props
}: AlertProps) {
  const Icon = icon ?? ICONS[tone];
  return (
    <div
      ref={ref}
      role={role}
      className={cx(styles.root, styles.tone[tone], className)}
      {...props}
    >
      <Icon className={styles.icon} aria-hidden />
      <div className="min-w-0 flex-1 flex flex-col gap-0.5">
        {title ? <p className="text-body-medium">{title}</p> : null}
        {children ? <div className="text-body-regular opacity-90">{children}</div> : null}
      </div>
    </div>
  );
}
