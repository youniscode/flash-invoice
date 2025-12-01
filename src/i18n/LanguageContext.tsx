import React, { createContext, useEffect, useMemo, useState } from "react";

type Language = "en" | "fr";

const translations = {
  en: {
    appTitle: "FlashInvoice App",
    dashboard: "Dashboard",
    newInvoice: "New invoice",
    history: "History",
    settings: "Settings",
    themeDark: "Dark mode",
    themeLight: "Light mode",
  },
  fr: {
    appTitle: "Application FlashInvoice",
    dashboard: "Tableau de bord",
    newInvoice: "Nouvelle facture",
    history: "Historique",
    settings: "Paramètres",
    themeDark: "Mode sombre",
    themeLight: "Mode clair",
  },
};

export type TranslationKey = keyof (typeof translations)["en"];

export type LanguageContextValue = {
  lang: Language;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
};

// eslint-disable-next-line react-refresh/only-export-components
export const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    const stored = window.localStorage.getItem("fi-lang");
    if (stored === "en" || stored === "fr") return stored;
    return "en";
  });

  useEffect(() => {
    window.localStorage.setItem("fi-lang", lang);
  }, [lang]);

  const toggleLanguage = () => setLang((prev) => (prev === "en" ? "fr" : "en"));

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      toggleLanguage,
      t: (key) => translations[lang][key],
    }),
    [lang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
