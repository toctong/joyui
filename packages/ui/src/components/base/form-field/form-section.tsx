import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cx } from "../../../utils/cx";

/**
 * Settings / form block: title + description + field grid.
 * Light border only — no nested shadow cards.
 *
 *   <FormSection title="站点" description="基础信息" columns={2}>
 *     <Input label="名称" />
 *     <Input label="邮箱" />
 *   </FormSection>
 */

export type FormSectionColumns = 1 | 2;

export interface FormSectionProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  description?: ReactNode;
  /** Field grid columns. Default `1`; `2` becomes two columns from `md`. */
  columns?: FormSectionColumns;
  /** Trailing actions (e.g. Save) aligned with the section header. */
  actions?: ReactNode;
  children: ReactNode;
  ref?: Ref<HTMLElement>;
}

export function FormSection({
  title,
  description,
  columns = 1,
  actions,
  children,
  className,
  ref,
  ...props
}: FormSectionProps) {
  return (
    <section
      ref={ref}
      className={cx(
        "rounded-2xl border border-separator-border bg-background-primary-default p-4",
        className,
      )}
      {...props}
    >
      {title || description || actions ? (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            {title ? (
              <h2 className="text-title-3-medium text-text-primary">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-0.5 text-body-medium text-text-secondary">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex flex-wrap items-center gap-2">{actions}</div>
          ) : null}
        </div>
      ) : null}
      <div
        className={cx(
          "grid gap-4",
          columns === 2 && "md:grid-cols-2",
        )}
      >
        {children}
      </div>
    </section>
  );
}
