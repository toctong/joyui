"use client";

import { FileUpload } from "@/components/base/file-upload/file-upload";
import { cx } from "@/utils/cx";

export function FileUploadRestrictPreview({ className }: { className?: string }) {
  return (
    <div className={cx("w-full max-w-xl", className)}>
      <FileUpload
        allowedExtensions={["png", "jpg", "jpeg"]}
        maxBytes={2 * 1024 * 1024}
        onUploadComplete={(file) => console.log(file.name)}
      />
      <p className="mt-3 text-center text-caption-1-medium text-text-tertiary">
        仅 PNG / JPG · ≤ 2MB
      </p>
    </div>
  );
}
