/** Shared locale constants — safe for Server and Client Components. */

export const LOCALES = [
  { locale: "zh-CN", name: "简体中文" },
  { locale: "en", name: "English" },
] as const;

export const DEFAULT_LOCALE = "zh-CN";

export const LOCALE_COOKIE = "joyui-locale";
