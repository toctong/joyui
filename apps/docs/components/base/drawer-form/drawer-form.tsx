"use client";

import { useState, type ReactNode } from "react";
import type { DialogRenderProps } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  type DrawerPlacement,
  type DrawerProps,
  type DrawerSize,
} from "@/components/base/drawer/drawer";
import { SpinnerGlyph } from "@/components/base/spinner/spinner";
import { cx } from "@/utils/cx";

/**
 * DrawerForm — side drawer preset for edit flows: sticky header, scrollable
 * body, sticky footer with 取消 / 保存. Reuses Drawer's placement motion and
 * Modal's header / body / footer scroll-fade behaviour.
 *
 *   <DrawerFormTrigger>
 *     <Button>编辑资料</Button>
 *     <DrawerForm
 *       title="编辑资料"
 *       description="保存后立即生效。"
 *       onSave={async () => { await api.save(); }}
 *     >
 *       <Input label="显示名" />
 *     </DrawerForm>
 *   </DrawerFormTrigger>
 */

export type DrawerFormPlacement = Extract<DrawerPlacement, "start" | "end">;

export interface DrawerFormRenderProps extends DialogRenderProps {
  /** True while an async `onSave` is in flight. */
  pending: boolean;
}

export interface DrawerFormProps
  extends Omit<DrawerProps, "children" | "placement" | "size" | "aria-label"> {
  title: ReactNode;
  description?: ReactNode;
  /** Side edge. Default `end`. */
  placement?: DrawerFormPlacement;
  /** Width: 320 / 400 / 600. Default `md`. */
  size?: DrawerSize;
  cancelLabel?: ReactNode;
  saveLabel?: ReactNode;
  /** Label on the save button while `onSave` is pending. */
  pendingLabel?: ReactNode;
  /** Runs on save. Return a promise to keep the drawer open until it settles. */
  onSave?: () => void | Promise<unknown>;
  onCancel?: () => void;
  /** Disable the save action (e.g. until the form is valid). */
  isSaveDisabled?: boolean;
  /** Accessible name when `title` is not a string. */
  "aria-label"?: string;
  className?: string;
  children: ReactNode | ((renderProps: DrawerFormRenderProps) => ReactNode);
}

function PendingGlyph({ className }: { className?: string }) {
  return <SpinnerGlyph size="sm" className={cx(className, "text-current")} />;
}

export function DrawerForm({
  title,
  description,
  placement = "end",
  size = "md",
  cancelLabel = "取消",
  saveLabel = "保存",
  pendingLabel,
  onSave,
  onCancel,
  isSaveDisabled = false,
  "aria-label": ariaLabel,
  className,
  children,
  ...props
}: DrawerFormProps) {
  const [pending, setPending] = useState(false);

  return (
    <Drawer
      {...props}
      placement={placement}
      size={size}
      aria-label={ariaLabel}
      isDismissable={props.isDismissable !== false && !pending}
      isKeyboardDismissDisabled={pending || props.isKeyboardDismissDisabled}
      className={className}
    >
      {(renderProps) => {
        const { close } = renderProps;

        const save = async () => {
          if (pending) return;
          const result = onSave?.();
          if (!result || typeof result.then !== "function") {
            close();
            return;
          }
          setPending(true);
          try {
            await result;
            close();
          } catch {
            // Stay open: the caller reports the failure.
          } finally {
            setPending(false);
          }
        };

        return (
          <>
            <DrawerHeader title={title} description={description} />
            <DrawerBody>
              {typeof children === "function"
                ? children({ ...renderProps, pending })
                : children}
            </DrawerBody>
            <DrawerFooter>
              <Button
                variant="secondary"
                disabled={pending}
                onClick={() => {
                  onCancel?.();
                  close();
                }}
              >
                {cancelLabel}
              </Button>
              <Button
                variant="primary"
                disabled={isSaveDisabled}
                aria-busy={pending || undefined}
                leadingIcon={pending ? PendingGlyph : undefined}
                onClick={save}
              >
                {pending && pendingLabel ? pendingLabel : saveLabel}
              </Button>
            </DrawerFooter>
          </>
        );
      }}
    </Drawer>
  );
}

export { DrawerTrigger as DrawerFormTrigger };
export type { DrawerTriggerProps as DrawerFormTriggerProps } from "@/components/base/drawer/drawer";
