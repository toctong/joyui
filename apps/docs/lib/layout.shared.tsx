import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { NavBrand } from "@/components/foundations/brand/logo";

/** Docs chrome (locale / theme / GitHub) lives in DocsContentHeader — hide sidebar footer duplicates. */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <NavBrand />,
      url: "/",
    },
    i18n: false,
    themeSwitch: {
      enabled: false,
    },
  };
}
