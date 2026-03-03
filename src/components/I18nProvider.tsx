"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { Language } from "@/lib/i18n";
import { DICTIONARIES, normalizeLanguage, t as tImpl } from "@/lib/i18n";

type I18nContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: string | null | undefined;
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<Language>(
    normalizeLanguage(initialLanguage),
  );

  const value = useMemo<I18nContextValue>(() => {
    const dict = DICTIONARIES[language];
    return {
      language,
      setLanguage,
      t: (key: string) => tImpl(dict, key),
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

