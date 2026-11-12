"use client";

import { useState } from "react";
import { ComposerPanel } from "./composer-panel";
import type { ComposerAttachment } from "./composer-attachment-strip";

export type {
  ComposerAttachment,
  ComposerAttachmentKind,
} from "./composer-attachment-strip";
export { ComposerAttachmentStrip } from "./composer-attachment-strip";

const DEMO_ATTACHMENTS: ComposerAttachment[] = [
  {
    id: "demo-png",
    name: "freepro-demo-resized.png",
    kind: "image",
    progress: 0,
  },
  { id: "payroll", name: "payroll.docx", kind: "document", progress: 0 },
  { id: "timetable", name: "timetable.xlsx", kind: "spreadsheet", progress: 0 },
];

/**
 * Full AI input bar with attachments: status tab + tiles + TipTap rich prompt.
 */
export function ComposerWithAttachments({
  attachments = DEMO_ATTACHMENTS,
  className,
  ...panelProps
}: {
  attachments?: ComposerAttachment[];
  className?: string;
} & Omit<
  React.ComponentProps<typeof ComposerPanel>,
  "attachments" | "className" | "onRemoveAttachment"
>) {
  const [files, setFiles] = useState(attachments);

  return (
    <ComposerPanel
      className={className}
      attachments={files}
      onRemoveAttachment={(id) =>
        setFiles((prev) => prev.filter((f) => f.id !== id))
      }
      defaultMenuOpen={false}
      {...panelProps}
    />
  );
}
