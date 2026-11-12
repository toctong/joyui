import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type DataFieldRow = {
  name: string;
  description: string;
  type: string;
  required?: boolean;
  example?: string;
};

/** Schema table for configurable demo / component data items. */
export function DocsDataTable({
  rows,
  className,
  caption,
}: {
  rows: DataFieldRow[];
  className?: string;
  caption?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "not-prose my-4 overflow-x-auto rounded-xl border border-fd-border",
        className,
      )}
    >
      {caption ? (
        <div className="border-b border-fd-border bg-fd-secondary/30 px-4 py-2 text-sm font-medium text-fd-foreground">
          {caption}
        </div>
      ) : null}
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead className="bg-fd-secondary/40 text-fd-muted-foreground">
          <tr>
            <th className="px-4 py-2.5 font-medium">字段</th>
            <th className="px-4 py-2.5 font-medium">说明</th>
            <th className="px-4 py-2.5 font-medium">类型</th>
            <th className="px-4 py-2.5 font-medium">必填</th>
            <th className="px-4 py-2.5 font-medium">示例</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.name}
              className="border-t border-fd-border align-top text-fd-foreground"
            >
              <td className="px-4 py-2.5 font-mono text-xs">{row.name}</td>
              <td className="px-4 py-2.5 text-fd-muted-foreground">
                {row.description}
              </td>
              <td className="px-4 py-2.5 font-mono text-xs text-fd-muted-foreground">
                {row.type}
              </td>
              <td className="px-4 py-2.5 font-mono text-xs text-fd-muted-foreground">
                {row.required ? "是" : "否"}
              </td>
              <td className="px-4 py-2.5 font-mono text-xs text-fd-muted-foreground">
                {row.example ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
