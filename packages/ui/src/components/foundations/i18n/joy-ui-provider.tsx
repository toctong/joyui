"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { DirectionProvider } from "../direction/direction";
import {
  TemplateCopyProvider,
  type TemplateCopyTranslator,
} from "../template-copy/template-copy";
import {
  createMessageTranslator,
  resolveMessages,
  type JoyMessages,
} from "./messages";

export type JoyUIProviderProps = {
  /**
   * BCP 47 tag. Drives React Aria locale, document direction, and which
   * built-in message catalog to load (`en`, `zh-CN`, …).
   */
  locale?: string;
  /** Merge / override built-in strings (English keys → localized values). */
  messages?: JoyMessages | Partial<JoyMessages>;
  /**
   * Full control over string rewriting. When set, replaces the catalog
   * translator (still runs through TemplateCopyProvider).
   */
  translate?: TemplateCopyTranslator;
  children: ReactNode;
};

type JoyI18nContextValue = {
  locale: string;
  messages: JoyMessages;
  t: TemplateCopyTranslator;
};

const JoyI18nContext = createContext<JoyI18nContextValue | null>(null);

/**
 * App-root provider for locale, RTL, and built-in UI copy.
 *
 * ```tsx
 * <JoyUIProvider locale="zh-CN">
 *   <App />
 * </JoyUIProvider>
 * ```
 *
 * Components that already call `useTemplateCopy()` pick up translations
 * automatically. Use `useJoyI18n().t("Sign in")` for imperative copy.
 */
export function JoyUIProvider({
  locale = "en",
  messages: messageOverrides,
  translate: translateOverride,
  children,
}: JoyUIProviderProps) {
  const value = useMemo<JoyI18nContextValue>(() => {
    const messages = resolveMessages(locale, messageOverrides);
    const t = translateOverride ?? createMessageTranslator(messages);
    return { locale, messages, t };
  }, [locale, messageOverrides, translateOverride]);

  return (
    <JoyI18nContext.Provider value={value}>
      <DirectionProvider locale={locale}>
        <TemplateCopyProvider translate={value.t}>{children}</TemplateCopyProvider>
      </DirectionProvider>
    </JoyI18nContext.Provider>
  );
}

/** Locale + message catalog + `t()` helper. Safe outside a provider (en identity). */
export function useJoyI18n(): JoyI18nContextValue {
  const ctx = useContext(JoyI18nContext);
  return useMemo(() => {
    if (ctx) return ctx;
    const messages = resolveMessages("en");
    return { locale: "en", messages, t: createMessageTranslator(messages) };
  }, [ctx]);
}

/** Shorthand: `const t = useT(); t("Sign in")`. */
export function useT(): TemplateCopyTranslator {
  return useJoyI18n().t;
}
