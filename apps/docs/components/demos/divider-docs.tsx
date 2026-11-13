"use client";

import { Divider } from "@/components/base/divider/divider";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

export function DividerVariantPreview({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-md gap-6", className)} role="group" aria-label="分割线变体">
      <div>
        <p className="mb-2 text-caption-1-medium text-text-tertiary">single</p>
        <Divider variant="single" />
      </div>
      <div>
        <p className="mb-2 text-caption-1-medium text-text-tertiary">double</p>
        <Divider variant="double" />
      </div>
      <div>
        <p className="mb-2 text-caption-1-medium text-text-tertiary">fill</p>
        <Divider variant="fill" />
      </div>
    </div>
  );
}

export function DividerContentPreview({ className }: { className?: string }) {
  return (
    <div className={cx("grid w-full max-w-md gap-6", className)} role="group" aria-label="带内容分割线">
      <Divider variant="single" align="center">
        或
      </Divider>
      <Divider variant="single" align="start">
        更多选项
      </Divider>
      <Divider variant="fill" align="center">
        <Button variant="ghost" size="xs">
          展开全部
        </Button>
      </Divider>
    </div>
  );
}
