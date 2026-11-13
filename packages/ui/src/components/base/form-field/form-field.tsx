"use client";

import type { HTMLAttributes, ReactNode, Ref } from "react";
import { HintText } from "../input/hint-text";
import { Label } from "../input/label";
import { cx } from "../../../utils/cx";

/**
 * Form row shell — Label + control + hint/error. Use when composing fields
 * that are not already wrapped (Input / Select already include Label).
 *
 *   <FormField label="名称" hint="对外名" isRequired>
 *     <InputBase … />
 *   </FormField>
 */

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  hint?: ReactNode;
  errorMessage?: ReactNode;
  isRequired?: boolean;
  isInvalid?: boolean;
  /** Associates label with a control id. */
  htmlFor?: string;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function FormField({
  label,
  hint,
  errorMessage,
  isRequired = false,
  isInvalid = false,
  htmlFor,
  children,
  className,
  ref,
  ...props
}: FormFieldProps) {
  const showError = Boolean(errorMessage) || isInvalid;
  const caption = showError && errorMessage ? errorMessage : hint;

  return (
    <div
      ref={ref}
      className={cx("flex w-full flex-col gap-1.5", className)}
      {...props}
    >
      {label ? (
        <Label htmlFor={htmlFor} isRequired={isRequired} isInvalid={showError}>
          {label}
        </Label>
      ) : null}
      {children}
      {caption ? <HintText isInvalid={showError}>{caption}</HintText> : null}
    </div>
  );
}
