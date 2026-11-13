import { createElement } from "react";
import { z } from "zod";
import { llms, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { statusBadgesPlugin } from "fumadocs-core/source/status-badges";
import { defineDocs } from "fumadocs-mdx/macro";
import { metaSchema, pageSchema as basePageSchema } from "fumadocs-core/source/schema";
import { DocsStatusBadge } from "@/components/docs-status-badge";
import { collapsibleSeparatorsPlugin } from "./collapsible-separators-plugin";
import { docsRoute } from "./shared";

const pageSchema = basePageSchema.extend({
  /** Sidebar status: `new` | `beta` | `experimental` | `deprecated` */
  status: z.string().optional(),
});

const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [
    lucideIconsPlugin(),
    statusBadgesPlugin({
      renderBadge: (status) => createElement(DocsStatusBadge, { status }),
    }),
    collapsibleSeparatorsPlugin(),
  ],
});

export const docsLlms = llms(source, {
  renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText("processed")}`,
});
