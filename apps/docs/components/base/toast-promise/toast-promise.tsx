"use client";

import type { ReactNode } from "react";
import { SpinnerGlyph } from "@/components/base/spinner/spinner";
import {
  toast,
  type ToastId,
  type ToastOptions,
} from "@/components/base/toast/toast";
import { cx } from "@/utils/cx";

/**
 * toastPromise — fire a loading toast, then morph it to success / error when
 * the promise settles. Built on the imperative `toast` + `toast.update` API.
 *
 *   await toastPromise(saveProfile(), {
 *     loading: "正在保存…",
 *     success: "已保存更改",
 *     error: (err) => err instanceof Error ? err.message : "保存失败",
 *   });
 */

type IconComponent = typeof SpinnerGlyph;

function LoadingGlyph({ className }: { className?: string }) {
  return <SpinnerGlyph size="sm" className={cx(className, "text-current")} />;
}

export type ToastPromiseMessages<T> = {
  loading: ReactNode;
  success: ReactNode | ((data: T) => ReactNode);
  error: ReactNode | ((error: unknown) => ReactNode);
};

export type ToastPromiseOptions = Omit<ToastOptions, "status" | "title" | "icon"> & {
  /** Leading icon while loading. Defaults to a spinner glyph. */
  loadingIcon?: IconComponent;
  /** Id reused across the loading → settled morph. */
  id?: ToastId;
};

export function toastPromise<T>(
  input: Promise<T> | (() => Promise<T>),
  messages: ToastPromiseMessages<T>,
  options: ToastPromiseOptions = {},
): Promise<T> {
  const { loadingIcon = LoadingGlyph, duration, id, ...rest } = options;
  const toastId = toast(messages.loading, {
    ...rest,
    id,
    status: "information",
    icon: loadingIcon,
    duration: Infinity,
  });

  const promise = typeof input === "function" ? input() : input;

  return promise.then(
    (data) => {
      const title =
        typeof messages.success === "function" ? messages.success(data) : messages.success;
      toast.update(toastId, {
        ...rest,
        title,
        status: "success",
        icon: undefined,
        duration: duration ?? 4000,
      });
      return data;
    },
    (error) => {
      const title =
        typeof messages.error === "function" ? messages.error(error) : messages.error;
      toast.update(toastId, {
        ...rest,
        title,
        status: "error",
        icon: undefined,
        duration: duration ?? 5000,
      });
      throw error;
    },
  );
}

/** Alias matching common sonner-style naming. */
toastPromise.promise = toastPromise;
