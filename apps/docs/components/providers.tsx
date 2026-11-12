"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { RootProvider } from "fumadocs-ui/provider/next";

export const LOCALES = [
  { locale: "zh-CN", name: "简体中文" },
  { locale: "en", name: "English" },
] as const;

export const DEFAULT_LOCALE = "zh-CN";

const COOKIE_NAME = "joyui-locale";

// React 19 warns when next-themes re-renders its FOUC <script> on the client.
// Keep default script type during SSR; on the client use a non-JS MIME.
// See: https://github.com/pacocoursey/next-themes/issues/387
const themeScriptProps =
  typeof window === "undefined"
    ? undefined
    : ({ type: "application/json" } as const);

export function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const router = useRouter();

  return (
    <RootProvider
      i18n={{
        locale,
        defaultLanguage: DEFAULT_LOCALE,
        locales: [...LOCALES],
        onLocaleChange(next) {
          document.cookie = `${COOKIE_NAME}=${next};path=/;max-age=31536000;samesite=lax`;
          document.documentElement.lang = next;
          router.refresh();
        },
      }}
      theme={{
        defaultTheme: "system",
        enableSystem: true,
        scriptProps: themeScriptProps,
      }}
    >
      {children}
    </RootProvider>
  );
}
