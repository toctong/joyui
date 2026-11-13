"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  RiCloseLine,
  RiFileExcel2Line,
  RiFileImageLine,
  RiFileTextLine,
  RiUploadCloud2Line,
} from "@remixicon/react";
import { cx } from "@/utils/cx";

/**
 * Multi-file upload with a thumbnail / file preview grid.
 *
 *   <FileUploadGallery
 *     onChange={(files) => console.log(files)}
 *     maxFiles={8}
 *   />
 */

const DEFAULT_MAX_BYTES = 8 * 1024 * 1024;
const DEFAULT_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "xlsx", "webp"] as const;

export interface FileUploadGalleryProps {
  /** Controlled file list. */
  value?: File[];
  /** Uncontrolled initial files. */
  defaultValue?: File[];
  onChange?: (files: File[]) => void;
  /** Accepted filename extensions without dots. */
  allowedExtensions?: readonly string[];
  /** Maximum accepted file size in bytes. */
  maxBytes?: number;
  /** Cap on how many files can be kept. */
  maxFiles?: number;
  /** Drop-zone title. */
  title?: ReactNode;
  /** Drop-zone hint under the title. */
  description?: ReactNode;
  className?: string;
}

function extensionFor(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    const mb = bytes / (1024 * 1024);
    return `${mb >= 10 ? Math.round(mb) : Math.round(mb * 10) / 10} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function FileGlyph({ file }: { file: File }) {
  const extension = extensionFor(file.name);
  const Icon = extension === "xlsx"
    ? RiFileExcel2Line
    : ["jpg", "jpeg", "png", "webp"].includes(extension)
      ? RiFileImageLine
      : RiFileTextLine;
  return <Icon className="size-6 text-foreground-icon-secondary" aria-hidden />;
}

function isImage(file: File) {
  return file.type.startsWith("image/") || ["jpg", "jpeg", "png", "webp"].includes(extensionFor(file.name));
}

export function FileUploadGallery({
  value,
  defaultValue = [],
  onChange,
  allowedExtensions = DEFAULT_EXTENSIONS,
  maxBytes = DEFAULT_MAX_BYTES,
  maxFiles = 8,
  title = "拖放或点击上传",
  description,
  className,
}: FileUploadGalleryProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uncontrolled, setUncontrolled] = useState<File[]>(defaultValue);
  const [dragOver, setDragOver] = useState(false);
  const [rejection, setRejection] = useState<string | null>(null);
  const files = value ?? uncontrolled;

  const allowedLabel = allowedExtensions
    .filter((extension) => extension.toLowerCase() !== "jpeg")
    .map((extension) => extension.toUpperCase())
    .join(", ");

  const commit = (next: File[]) => {
    if (value === undefined) setUncontrolled(next);
    onChange?.(next);
  };

  const reject = (message: string) => {
    setRejection(message);
    window.setTimeout(() => setRejection(null), 2600);
  };

  const addFiles = (incoming: FileList | File[]) => {
    const list = Array.from(incoming);
    if (!list.length) return;

    const next = [...files];
    for (const file of list) {
      if (next.length >= maxFiles) {
        reject(`最多上传 ${maxFiles} 个文件`);
        break;
      }
      const extension = extensionFor(file.name);
      if (!allowedExtensions.map((v) => v.toLowerCase()).includes(extension)) {
        reject(`仅支持 ${allowedLabel}`);
        continue;
      }
      if (file.size > maxBytes) {
        reject(`文件超过 ${formatFileSize(maxBytes)}`);
        continue;
      }
      next.push(file);
    }
    commit(next);
  };

  const removeAt = (index: number) => {
    commit(files.filter((_, i) => i !== index));
  };

  const previewUrls = useMemo(
    () =>
      files.map((file) => (isImage(file) ? URL.createObjectURL(file) : null)),
    [files],
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  return (
    <div className={cx("flex w-full flex-col gap-3", className)}>
      <div
        role="button"
        tabIndex={0}
        aria-label="上传多个文件"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          if (event.dataTransfer.files?.length) addFiles(event.dataTransfer.files);
        }}
        className={cx(
          "flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-center outline-none transition-colors",
          "bg-background-secondary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-offset-2",
          dragOver
            ? "border-border-button-active"
            : "border-border-checkbox-default hover:border-border-button-active",
        )}
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-file-upload-icon-background p-2.5">
          <RiUploadCloud2Line
            className="size-6 text-file-upload-icon-foreground"
            aria-hidden
          />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-body-medium text-text-primary">{title}</p>
          <p className="text-body-2-regular text-text-tertiary">
            {description ?? `${allowedLabel} · 单文件 ≤ ${formatFileSize(maxBytes)} · 最多 ${maxFiles} 个`}
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          aria-label="选择多个文件"
          accept={allowedExtensions.map((extension) => `.${extension}`).join(",")}
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            if (event.target.files?.length) addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>

      {rejection ? (
        <p className="text-body-2-regular text-notification-error-foreground" role="status">
          {rejection}
        </p>
      ) : null}

      {files.length > 0 ? (
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4" aria-label="已选文件">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${index}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-separator-border bg-background-primary-default"
            >
              <div className="flex aspect-square items-center justify-center bg-background-secondary-default">
                {previewUrls[index] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrls[index]!}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <FileGlyph file={file} />
                )}
              </div>
              <div className="flex flex-col gap-0.5 p-2">
                <p className="truncate text-caption-1-medium text-text-primary">{file.name}</p>
                <p className="text-caption-1-regular text-text-tertiary">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                aria-label={`移除 ${file.name}`}
                onClick={() => removeAt(index)}
                className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-background-primary-default/90 text-text-secondary opacity-0 shadow-xs outline-none transition-opacity hover:text-text-primary focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-border-focus-ring group-hover:opacity-100"
              >
                <RiCloseLine className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
