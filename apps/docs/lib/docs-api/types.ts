import type { PropRow } from "@/components/docs-props-table";
import type { DataFieldRow } from "@/components/docs-data-table";

export type { PropRow, DataFieldRow };

export type DocsApiEntry = {
  caption: string;
  props: PropRow[];
  data?: {
    caption: string;
    fields: DataFieldRow[];
  };
};
