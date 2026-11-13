"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { RootProvider } from "fumadocs-ui/provider/next";
import { TemplateCopyProvider } from "@/components/foundations/template-copy/template-copy";
import {
  createMessageTranslator,
  resolveMessages,
} from "@/components/foundations/i18n/messages";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES } from "@/components/locale";

export { DEFAULT_LOCALE, LOCALES } from "@/components/locale";

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
  const translate = React.useMemo(
    () => createMessageTranslator(resolveMessages(locale)),
    [locale],
  );

  return (
    <RootProvider
      i18n={{
        locale,
        defaultLanguage: DEFAULT_LOCALE,
        locales: [...LOCALES],
        onLocaleChange(next) {
          document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;samesite=lax`;
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
      {/* Layout already owns DirectionProvider; only wire UI copy here. */}
      <TemplateCopyProvider translate={translate}>{children}</TemplateCopyProvider>
    </RootProvider>
  );
}
