"use client";

import type { ComponentProps, ReactNode } from "react";
import { RiCloseLine, RiSearchLine, RiSideBarFill } from "@remixicon/react";
import {
  SidebarCollapseTrigger,
  SidebarContent as SidebarContentBase,
  SidebarDrawerContent,
  SidebarDrawerOverlay,
  SidebarFolder as SidebarFolderBase,
  SidebarFolderContent as SidebarFolderContentBase,
  SidebarFolderLink as SidebarFolderLinkBase,
  SidebarFolderTrigger as SidebarFolderTriggerBase,
  SidebarItem as SidebarItemBase,
  SidebarSeparator as SidebarSeparatorBase,
  SidebarTrigger,
  SidebarViewport,
  useFolder,
  useFolderDepth,
} from "fumadocs-ui/components/sidebar/base";
import { createPageTreeRenderer } from "fumadocs-ui/components/sidebar/page-tree";
import { useDocsLayout } from "fumadocs-ui/layouts/docs";
import type { SidebarProps } from "fumadocs-ui/layouts/docs/slots/sidebar";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { NavBrand } from "@/components/foundations/brand/logo";
import { Kbd } from "@/components/base/kbd/kbd";
import { cx } from "@/utils/cx";

/**
 * Docs-adapted JoyUI sidebar shell for fumadocs `slots.sidebar.root`.
 * Brand + page tree + status badges; no team/account chrome.
 */

const itemClass = cx(
  "relative flex w-full flex-row items-center gap-2 rounded-2lg p-2 text-start text-body-medium wrap-anywhere",
  "text-text-secondary transition-colors [&_svg]:size-4 [&_svg]:shrink-0",
  "hover:bg-background-secondary-hover",
  "data-[active=true]:bg-linear-to-b data-[active=true]:from-accent-500 data-[active=true]:to-accent-600",
  "data-[active=true]:text-white data-[active=true]:shadow-nav-selected",
  "data-[active=true]:hover:bg-transparent",
);

function offsetStyle(depth: number): { paddingInlineStart: string } {
  return { paddingInlineStart: `calc(${2 + 3 * depth} * var(--spacing))` };
}

function DocsSidebarItem({
  className,
  style,
  children,
  ...props
}: ComponentProps<typeof SidebarItemBase>) {
  const depth = useFolderDepth();
  return (
    <SidebarItemBase
      className={cx(itemClass, className)}
      style={{ ...offsetStyle(depth), ...style }}
      {...props}
    >
      {children}
    </SidebarItemBase>
  );
}

function DocsSidebarFolder(props: ComponentProps<typeof SidebarFolderBase>) {
  return <SidebarFolderBase {...props} />;
}

function DocsSidebarFolderTrigger({
  className,
  style,
  ...props
}: ComponentProps<typeof SidebarFolderTriggerBase>) {
  const folder = useFolder();
  const depth = (folder?.depth ?? 1) - 1;
  return (
    <SidebarFolderTriggerBase
      className={(state) =>
        cx(
          itemClass,
          "w-full",
          typeof className === "function" ? className(state) : className,
        )
      }
      style={{ ...offsetStyle(depth), ...style }}
      {...props}
    />
  );
}

function DocsSidebarFolderLink({
  className,
  style,
  ...props
}: ComponentProps<typeof SidebarFolderLinkBase>) {
  const depth = useFolderDepth() - 1;
  return (
    <SidebarFolderLinkBase
      className={cx(itemClass, "w-full", className)}
      style={{ ...offsetStyle(depth), ...style }}
      {...props}
    />
  );
}

function DocsSidebarFolderContent({
  className,
  ...props
}: ComponentProps<typeof SidebarFolderContentBase>) {
  const depth = useFolderDepth();
  return (
    <SidebarFolderContentBase
      className={(state) =>
        cx(
          "relative flex flex-col gap-0.5 pt-0.5",
          depth === 1 &&
            "before:absolute before:inset-y-1 before:inset-s-2.5 before:w-px before:bg-border-secondary-default before:content-['']",
          typeof className === "function" ? className(state) : className,
        )
      }
      {...props}
    />
  );
}

function DocsSidebarSeparator({
  className,
  style,
  ...props
}: ComponentProps<typeof SidebarSeparatorBase>) {
  const depth = useFolderDepth();
  return (
    <SidebarSeparatorBase
      className={cx(
        "mb-1 mt-5 inline-flex items-center gap-2 px-2 text-caption-1-semibold tracking-wide text-text-tertiary uppercase empty:mb-0 first:mt-0",
        className,
      )}
      style={{ ...offsetStyle(depth), ...style }}
      {...props}
    />
  );
}

const SidebarPageTree = createPageTreeRenderer({
  SidebarFolder: DocsSidebarFolder,
  SidebarFolderContent: DocsSidebarFolderContent,
  SidebarFolderLink: DocsSidebarFolderLink,
  SidebarFolderTrigger: DocsSidebarFolderTrigger,
  SidebarItem: DocsSidebarItem,
  SidebarSeparator: DocsSidebarSeparator,
});

function BrandHeader({
  collapsible,
  mobile = false,
}: {
  collapsible: boolean;
  mobile?: boolean;
}) {
  const { slots, props: layoutProps } = useDocsLayout();
  const NavTitle = slots.navTitle;

  return (
    <div className="flex items-center gap-2">
      <div className="me-auto min-w-0">
        {NavTitle ? (
          <NavTitle className="inline-flex items-center gap-2 text-body-medium font-medium text-text-primary" />
        ) : (
          <a
            href={layoutProps.nav?.url ?? "/"}
            className="inline-flex min-w-0 items-center gap-2 text-body-medium font-medium text-text-primary"
          >
            <NavBrand size={22} />
          </a>
        )}
      </div>
      {layoutProps.nav?.children}
      {collapsible ? (
        <SidebarCollapseTrigger className="cursor-pointer text-foreground-icon-secondary transition-transform duration-300 ease-in-out">
          <RiSideBarFill className="size-5 -scale-x-100 rtl:scale-x-100" aria-hidden />
        </SidebarCollapseTrigger>
      ) : null}
      {mobile ? (
        <SidebarTrigger className="cursor-pointer text-foreground-icon-secondary">
          <RiCloseLine className="size-5" aria-hidden />
        </SidebarTrigger>
      ) : null}
    </div>
  );
}

function DocsSearchTrigger({ className }: { className?: string }) {
  const { enabled, hotKey, setOpenSearch } = useSearchContext();
  if (!enabled) return null;

  return (
    <button
      type="button"
      data-search-full=""
      onClick={() => setOpenSearch(true)}
      className={cx(
        "flex w-full cursor-pointer items-center gap-2 rounded-full bg-background-tertiary-default p-2",
        "text-body-medium text-text-secondary transition-colors",
        "hover:bg-background-tertiary-hover/55",
        className,
      )}
    >
      <RiSearchLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
      <span className="min-w-0 flex-1 truncate text-start">Search docs…</span>
      <span className="ms-auto inline-flex shrink-0 gap-0.5">
        {hotKey.map((k, i) => (
          <Kbd key={i}>{k.display}</Kbd>
        ))}
      </span>
    </button>
  );
}

function PanelBody({
  banner,
  footer,
  components,
  collapsible,
  mobile = false,
}: {
  banner?: ReactNode;
  footer?: ReactNode;
  components?: SidebarProps["components"];
  collapsible: boolean;
  mobile?: boolean;
}) {
  return (
    <>
      <div className="flex flex-col gap-3 p-3 pb-2">
        <BrandHeader collapsible={collapsible && !mobile} mobile={mobile} />
        <DocsSearchTrigger />
        {banner}
      </div>

      <SidebarViewport className="min-h-0 flex-1 **:data-[slot=scroll-area-viewport]:p-2">
        <nav className="flex flex-col gap-0.5 px-0.5">
          <SidebarPageTree {...components} />
        </nav>
      </SidebarViewport>

      {footer ? (
        <div className="flex flex-col gap-2 border-t border-border-secondary-default p-3 pt-2">{footer}</div>
      ) : null}
    </>
  );
}

function DocsSidebarContent({
  className,
  children,
  ...props
}: ComponentProps<"aside"> & { children: ReactNode }) {
  return (
    <SidebarContentBase>
      {({ collapsed, hovered, ref, onPointerEnter, onPointerLeave }) => (
        <>
          <div
            data-sidebar-placeholder=""
            className={cx(
              "sticky top-(--fd-docs-row-1) z-20 [grid-area:sidebar] max-md:hidden",
              "pointer-events-none h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] *:pointer-events-auto",
              "md:layout:[--fd-sidebar-width:284px]",
            )}
          >
            {collapsed ? (
              <div
                className="absolute inset-y-0 inset-s-0 w-4"
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
              />
            ) : null}
            <aside
              id="nd-sidebar"
              ref={ref}
              data-collapsed={collapsed}
              data-hovered={collapsed && hovered}
              inert={collapsed && !hovered ? true : undefined}
              className={cx(
                "absolute inset-y-3 inset-s-3 flex w-[260px] flex-col overflow-hidden",
                "rounded-3xl border border-border-button-white bg-background-secondary-default shadow-sidebar",
                "text-sm duration-250",
                collapsed && [
                  "transition-transform",
                  hovered
                    ? "translate-x-0 shadow-lg"
                    : "-translate-x-[calc(100%+12px)] rtl:translate-x-[calc(100%+12px)]",
                ],
                className,
              )}
              onPointerEnter={onPointerEnter}
              onPointerLeave={onPointerLeave}
              {...props}
            >
              {children}
            </aside>
          </div>

          <div
            data-sidebar-panel=""
            className={cx(
              "fixed inset-s-4 top-[calc(--spacing(4)+var(--fd-docs-row-3))] z-10 flex rounded-xl border border-border-secondary-default bg-background-secondary-default p-0.5 text-text-secondary shadow-lg transition-opacity",
              (!collapsed || hovered) && "pointer-events-none opacity-0",
            )}
            inert={!collapsed || hovered ? true : undefined}
          >
            <SidebarCollapseTrigger className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-foreground-icon-secondary hover:bg-background-secondary-hover">
              <RiSideBarFill className="size-5" aria-hidden />
            </SidebarCollapseTrigger>
          </div>
        </>
      )}
    </SidebarContentBase>
  );
}

export function DocsSidebar({
  footer,
  banner,
  collapsible = true,
  components,
  className,
  ...rest
}: SidebarProps) {
  const panel = (
    <PanelBody
      banner={banner}
      footer={footer}
      components={components}
      collapsible={collapsible}
    />
  );

  return (
    <>
      <DocsSidebarContent className={className} {...rest}>
        {panel}
      </DocsSidebarContent>

      <SidebarDrawerOverlay className="fixed inset-0 z-40 backdrop-blur-xs data-[state=closed]:animate-fd-fade-out data-[state=open]:animate-fd-fade-in" />
      <SidebarDrawerContent
        className={cx(
          "fixed inset-y-0 inset-e-0 z-40 flex w-[85%] max-w-[380px] flex-col",
          "border-s border-border-button-white bg-background-secondary-default shadow-lg",
          "data-[state=closed]:animate-fd-sidebar-out data-[state=open]:animate-fd-sidebar-in",
        )}
      >
        <PanelBody
          banner={banner}
          footer={footer}
          components={components}
          collapsible={false}
          mobile
        />
      </SidebarDrawerContent>
    </>
  );
}
