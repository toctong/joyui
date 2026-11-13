import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "fumadocs-ui/layouts/docs/slots/sidebar";
import { baseOptions } from "@/lib/layout.shared";
import { DocsSidebar } from "@/components/docs/docs-sidebar";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      slots={{
        sidebar: {
          provider: SidebarProvider,
          root: DocsSidebar,
          trigger: SidebarTrigger,
          useSidebar,
        },
      }}
    >
      {children}
    </DocsLayout>
  );
}
