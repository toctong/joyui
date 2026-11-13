"use client";

import type { ReactNode } from "react";
import { Modal as AriaModal, ModalOverlay as AriaModalOverlay } from "react-aria-components";
import type { DialogRenderProps, ModalOverlayProps } from "react-aria-components";
import {
  ModalBody,
  ModalDialog,
  ModalFooter,
  ModalHeader,
  ModalTrigger,
} from "../modal/modal";
import { useDirection } from "../../foundations/direction/direction";
import { cx, sortCx } from "../../../utils/cx";

/**
 * ModalSheet — mobile-friendly bottom sheet. Same focus trap / dismiss
 * semantics as Modal, but the panel docks to the bottom edge, slides up on
 * the iOS sheet curve, and optionally shows a drag handle.
 *
 *   <ModalSheetTrigger>
 *     <Button>筛选</Button>
 *     <ModalSheet showHandle>
 *       {({ close }) => (
 *         <>
 *           <ModalSheetHeader title="筛选" />
 *           <ModalSheetBody>…</ModalSheetBody>
 *           <ModalSheetFooter>…</ModalSheetFooter>
 *         </>
 *       )}
 *     </ModalSheet>
 *   </ModalSheetTrigger>
 */

export type ModalSheetSize = "sm" | "md" | "lg" | "full";

const styles = sortCx({
  overlay: [
    "group/modal-sheet fixed inset-x-0 top-0 z-100 flex h-(--visual-viewport-height)",
    "items-end justify-center p-0 sm:p-3 sm:pb-3",
  ].join(" "),
  backdrop: [
    "absolute inset-0 bg-black/70",
    "transition-opacity duration-300 ease-out",
    "group-data-[entering]/modal-sheet:opacity-0 group-data-[exiting]/modal-sheet:opacity-0",
  ].join(" "),
  modal: [
    "relative flex w-full flex-col outline-none",
    "transform-gpu transition-[translate,filter,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
    "motion-safe:data-[entering]:translate-y-[calc(100%+24px)] motion-safe:data-[entering]:blur-[4px]",
    "motion-safe:data-[exiting]:translate-y-[calc(100%+24px)] motion-safe:data-[exiting]:blur-[4px]",
    "motion-reduce:data-[entering]:opacity-0 motion-reduce:data-[exiting]:opacity-0",
  ].join(" "),
  dialog: [
    "flex max-h-[min(92dvh,920px)] min-h-0 flex-col gap-4 overflow-clip pb-6 outline-none",
    "rounded-t-3xl border border-separator-border bg-background-full shadow-xs sm:rounded-3xl",
  ].join(" "),
  handle: "mx-auto mt-3 mb-1 h-1 w-10 shrink-0 rounded-full bg-border-secondary-default",
  size: {
    sm: "max-w-[400px]",
    md: "max-w-[480px]",
    lg: "max-w-[640px]",
    full: "max-w-none sm:max-w-[720px]",
  },
});

export interface ModalSheetProps extends Omit<ModalOverlayProps, "children" | "className" | "style"> {
  /** Panel max-width on larger screens. Default `md`. */
  size?: ModalSheetSize;
  /** Show the top drag handle affordance. Default true. */
  showHandle?: boolean;
  /** Accessible name when content has no ModalSheetHeader title. */
  "aria-label"?: string;
  /** Classes on the panel surface. */
  className?: string;
  /** Classes on the full-screen overlay. */
  overlayClassName?: string;
  children: ReactNode | ((renderProps: DialogRenderProps) => ReactNode);
}

export function ModalSheet({
  size = "md",
  showHandle = true,
  "aria-label": ariaLabel,
  className,
  overlayClassName,
  isDismissable = true,
  children,
  ...props
}: ModalSheetProps) {
  const direction = useDirection();

  return (
    <AriaModalOverlay
      {...props}
      dir={direction}
      isDismissable={isDismissable}
      className={cx(styles.overlay, overlayClassName)}
    >
      <div aria-hidden className={styles.backdrop} />
      <AriaModal className={cx(styles.modal, styles.size[size])}>
        <ModalDialog
          aria-label={ariaLabel}
          className={cx(styles.dialog, !showHandle && "pt-6", className)}
        >
          {(renderProps) => (
            <>
              {showHandle ? <div aria-hidden className={styles.handle} /> : null}
              {typeof children === "function" ? children(renderProps) : children}
            </>
          )}
        </ModalDialog>
      </AriaModal>
    </AriaModalOverlay>
  );
}

export {
  ModalBody as ModalSheetBody,
  ModalFooter as ModalSheetFooter,
  ModalHeader as ModalSheetHeader,
  ModalTrigger as ModalSheetTrigger,
};
export type {
  ModalBodyProps as ModalSheetBodyProps,
  ModalHeaderProps as ModalSheetHeaderProps,
  ModalTriggerProps as ModalSheetTriggerProps,
} from "../modal/modal";
