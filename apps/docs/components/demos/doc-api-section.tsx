import { DocsDataTable } from "@/components/docs-data-table";
import { DocsPropsTable } from "@/components/docs-props-table";
import { getDocsApi } from "@/lib/docs-api/registry";

/** Renders API (+ optional data schema) for a docs slug. */
export function DocApiSection({ slug }: { slug: string }) {
  const entry = getDocsApi(slug);
  if (!entry) {
    return (
      <p className="text-body-regular text-text-secondary">
        该组件的 API 表尚未录入，请先阅读源码中的 props 类型。
      </p>
    );
  }

  return (
    <>
      <DocsPropsTable caption={entry.caption} rows={entry.props} />
      {entry.data ? (
        <DocsDataTable caption={entry.data.caption} rows={entry.data.fields} />
      ) : null}
    </>
  );
}
