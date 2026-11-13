import { source } from "@/lib/source";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/mdx";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { getPageImageUrl, getPageMarkdownUrl, gitConfig } from "@/lib/shared";
import {
  DocsHeaderActions,
  DocsPageActionsProvider,
} from "@/components/docs-page-actions";
import { resolveDocsComponent } from "@/lib/docs-component";
import { DocsContentHeader } from "@/components/docs-content-header";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const markdownUrl = getPageMarkdownUrl(page).url;
  const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/apps/docs/content/docs/${encodeURI(page.path)}`;
  const component = resolveDocsComponent(page.slugs);

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      breadcrumb={{
        component: <DocsContentHeader includeRoot includePage />,
      }}
    >
      <DocsPageActionsProvider
        markdownUrl={markdownUrl}
        githubUrl={githubUrl}
        title={page.data.title}
        component={component}
      >
        <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
          <DocsTitle className="mb-0">{page.data.title}</DocsTitle>
          <DocsHeaderActions />
        </div>
        <DocsDescription className="mb-8 max-w-3xl text-pretty">
          {page.data.description}
        </DocsDescription>
        <DocsBody>
          <MDX
            components={getMDXComponents({
              a: createRelativeLink(source, page),
            })}
          />
        </DocsBody>
      </DocsPageActionsProvider>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImageUrl(page).url,
    },
  };
}
