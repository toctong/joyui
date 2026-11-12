import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { appName } from "./shared";

/** Docs chrome (locale / theme / GitHub) lives in DocsContentHeader — hide sidebar footer duplicates. */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: appName,
    },
    i18n: false,
    themeSwitch: {
      enabled: false,
    },
  };
}
