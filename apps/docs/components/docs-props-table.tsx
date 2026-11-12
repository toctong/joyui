import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type PropRow = {
  name: string;
  description: string;
  type: string;
  options?: string;
  defaultValue?: string;
};

export function DocsPropsTable({
  rows,
  className,
  caption,
}: {
  rows: PropRow[];
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
            <th className="px-4 py-2.5 font-medium">参数</th>
            <th className="px-4 py-2.5 font-medium">说明</th>
            <th className="px-4 py-2.5 font-medium">类型</th>
            <th className="px-4 py-2.5 font-medium">可选值</th>
            <th className="px-4 py-2.5 font-medium">默认值</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.name}
              className="border-t border-fd-border align-top text-fd-foreground"
            >
              <td className="px-4 py-2.5 font-mono text-xs text-fd-foreground">
                {row.name}
              </td>
              <td className="px-4 py-2.5 text-fd-muted-foreground">
                {row.description}
              </td>
              <td className="px-4 py-2.5 font-mono text-xs text-fd-muted-foreground">
                {row.type}
              </td>
              <td className="px-4 py-2.5 font-mono text-xs text-fd-muted-foreground">
                {row.options ?? "—"}
              </td>
              <td className="px-4 py-2.5 font-mono text-xs text-fd-muted-foreground">
                {row.defaultValue ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
