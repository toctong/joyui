import { DocsDataTable } from "@/components/docs-data-table";
import { DocsPropsTable } from "@/components/docs-props-table";
import { getDocsApi } from "@/lib/docs-api";

/** Renders API (+ optional data-item) tables for a docs slug. */
export function DocApiSection({ slug }: { slug: string }) {
  const entry = getDocsApi(slug);

  return (
    <>
      <DocsPropsTable caption={entry.caption} rows={entry.props} />
      {entry.data ? (
        <DocsDataTable caption={entry.data.caption} rows={entry.data.fields} />
      ) : null}
    </>
  );
}
