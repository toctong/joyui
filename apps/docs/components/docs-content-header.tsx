"use client";

import * as React from "react";
import { ChevronDown, Languages } from "lucide-react";
import { PageBreadcrumb } from "fumadocs-ui/layouts/docs/page";
import {
  LanguageSelect,
  LanguageSelectText,
} from "fumadocs-ui/layouts/shared/slots/language-select";
import { ThemeSwitch } from "fumadocs-ui/layouts/shared/slots/theme-switch";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/foundations/brand/logo";
import { appName, gitConfig } from "@/lib/shared";
import type { ComponentProps } from "react";
import type { BreadcrumbOptions } from "fumadocs-core/breadcrumb";

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export type DocsContentHeaderProps = BreadcrumbOptions & ComponentProps<"div">;

/**
 * Content-area top bar: breadcrumb + locale + theme + GitHub.
 * Used as DocsPage `breadcrumb.component`.
 */
export function DocsContentHeader({ ...breadcrumbProps }: DocsContentHeaderProps) {
  const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

  return (
    <div className="not-prose mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-fd-border pb-3">
      <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden text-sm text-fd-muted-foreground">
        <Logo size={16} className="shrink-0" />
        <span className="shrink-0 font-medium text-fd-foreground">{appName}</span>
        <span className="shrink-0 text-fd-border">/</span>
        <PageBreadcrumb
          includeRoot
          includePage
          {...breadcrumbProps}
          className={cn("min-w-0 truncate", breadcrumbProps.className)}
        />
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <LanguageSelect variant="ghost" className="gap-1.5 px-2">
          <Languages className="size-3.5 text-fd-muted-foreground" />
          <LanguageSelectText className="text-sm" />
          <ChevronDown className="size-3.5 text-fd-muted-foreground" />
        </LanguageSelect>

        <ThemeSwitch mode="light-dark" className="ms-0.5" />

        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer noopener"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "ms-0.5 px-2 text-fd-muted-foreground hover:text-fd-foreground",
          )}
          aria-label="GitHub"
        >
          <GitHubIcon className="size-4" />
        </a>
      </div>
    </div>
  );
}
