import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Language = "en" | "fr";

const translations = {
  en: {
    // Global / nav
    appTitle: "FlashInvoice App",
    dashboard: "Dashboard",
    newInvoice: "New invoice",
    history: "History",
    settings: "Settings",
    themeDark: "Dark mode",
    themeLight: "Light mode",

    // Invoice editor
    invoiceEditorTitle: "Invoice editor",
    invoiceDraftStatus: "Draft auto-saved",
    invoiceSaveHistory: "Save to history",
    invoiceNewBlank: "New blank",
    invoiceDownloadPdf: "Download PDF",

    invoiceFromLabel: "From (your business)",
    invoiceFromPlaceholder:
      "Your Name\nYour business name\nAddress\nEmail\nTax ID",
    invoiceToLabel: "Bill to (client)",
    invoiceToPlaceholder: "Client name\nCompany\nAddress\nEmail",

    invoiceNumberLabel: "Invoice #",
    invoiceIssueDateLabel: "Issue date",
    invoiceDueDateLabel: "Due date",
    invoiceCurrencyLabel: "Currency",

    invoiceLineItemsTitle: "Line items",
    invoiceDescriptionHeader: "Description",
    invoiceQtyHeader: "Qty",
    invoiceUnitPriceHeader: "Unit price",
    invoiceLineTotalHeader: "Total",

    invoiceNotesLabel: "Notes",
    invoiceNotesPlaceholder:
      "Payment terms, bank details, thank you message...",
    invoiceTaxRateLabel: "Tax rate (%)",
    invoiceSubtotalLabel: "Subtotal",
    invoiceTaxLabel: "Tax",
    invoiceTotalLabel: "Total",

    invoicePreviewTitle: "Preview",
    invoiceHeaderTitle: "Invoice",
    invoiceHeaderIssue: "Issue",
    invoiceHeaderDue: "Due",
    invoiceHeaderTotal: "Total",
    invoicePreviewSavedHint:
      "Your draft is saved automatically in your browser. You can close this tab and come back later without losing your invoice.",

    // History
    historyTitleFull: "Invoice history",
    historyStoredLocally: "Stored locally in your browser.",
    historyEmptyTitle: "No saved invoices yet.",
    historyEmptyBody:
      'Create an invoice in the editor and click "Save to history".',

    historyDateHeader: "Date",
    historyInvoiceHeader: "Invoice #",
    historyClientHeader: "Client",
    historyTotalHeader: "Total",
    historyActionsHeader: "Actions",

    historyOpen: "Open",
    historyDuplicate: "Duplicate",
    historyDelete: "Delete",

    // Settings
    settingsTitle: "Settings",
    settingsSubtitle:
      "Configure your business info, defaults, and logo for new invoices.",
    settingsBusinessInfoLabel: 'Business block (used in "From" field)',
    settingsBusinessInfoHelper:
      'This will auto-fill the "From" section in new invoices.',
    settingsDefaultTaxLabel: "Default tax rate (%)",
    settingsDefaultCurrencyLabel: "Default currency",
    settingsLogoTitle: "Logo (optional)",
    settingsLogoHelper: "Upload a logo to use in your invoice header later.",
    settingsLogoCurrent: "Current logo preview",
    settingsLogoRemove: "Remove",
    settingsStoredLocally: "Settings are stored locally in your browser.",

    // Landing page / marketing
    landingHeroTitle: "Create invoices & quotes in 10 seconds.",
    landingHeroSubtitle:
      "A minimal web app for freelancers who want clean, professional PDFs without complex accounting software.",
    landingHeroCtaPrimary: "Open the app",
    landingHeroCtaSecondary: "Watch 30s demo",
    landingHeroBadge:
      "No signup required for the demo. PDFs stay in your browser.",

    landingHeaderCtaPrimary: "Open App",
    landingHeaderCtaSecondary: "Buy Lifetime Access",

    landingFeatureSpeedTitle: "Super fast",
    landingFeatureSpeedBody:
      "Reuse your info and generate new invoices in seconds.",
    landingFeatureLocalTitle: "Simple",
    landingFeatureLocalBody:
      "No accounts, no complex dashboard. Just documents.",
    landingFeatureFreeTitle: "Professional PDFs",
    landingFeatureFreeBody:
      "Clean layout that makes you look premium to clients.",

    landingFooter: "FlashInvoice made for freelancers.",
  },
  fr: {
    // Global / nav
    appTitle: "Application FlashInvoice",
    dashboard: "Tableau de bord",
    newInvoice: "Nouvelle facture",
    history: "Historique",
    settings: "Paramètres",
    themeDark: "Mode sombre",
    themeLight: "Mode clair",

    // Invoice editor
    invoiceEditorTitle: "Éditeur de facture",
    invoiceDraftStatus: "Brouillon enregistré automatiquement",
    invoiceSaveHistory: "Enregistrer dans l’historique",
    invoiceNewBlank: "Nouvelle facture vierge",
    invoiceDownloadPdf: "Télécharger le PDF",

    invoiceFromLabel: "De (votre entreprise)",
    invoiceFromPlaceholder:
      "Votre nom\nNom de votre entreprise\nAdresse\nEmail\nN° TVA / SIRET",
    invoiceToLabel: "Facturer à (client)",
    invoiceToPlaceholder: "Nom du client\nEntreprise\nAdresse\nEmail",

    invoiceNumberLabel: "N° de facture",
    invoiceIssueDateLabel: "Date d’émission",
    invoiceDueDateLabel: "Date d’échéance",
    invoiceCurrencyLabel: "Devise",

    invoiceLineItemsTitle: "Lignes de facture",
    invoiceDescriptionHeader: "Description",
    invoiceQtyHeader: "Qté",
    invoiceUnitPriceHeader: "Prix unitaire",
    invoiceLineTotalHeader: "Total",

    invoiceNotesLabel: "Notes",
    invoiceNotesPlaceholder:
      "Conditions de paiement, coordonnées bancaires, message de remerciement...",
    invoiceTaxRateLabel: "Taux de TVA (%)",
    invoiceSubtotalLabel: "Sous-total",
    invoiceTaxLabel: "TVA",
    invoiceTotalLabel: "Total",

    invoicePreviewTitle: "Aperçu",
    invoiceHeaderTitle: "Facture",
    invoiceHeaderIssue: "Émise le",
    invoiceHeaderDue: "Échéance",
    invoiceHeaderTotal: "Total",
    invoicePreviewSavedHint:
      "Votre brouillon est enregistré automatiquement dans votre navigateur. Vous pouvez fermer cet onglet et revenir plus tard sans perdre votre facture.",

    // History
    historyTitleFull: "Historique des factures",
    historyStoredLocally: "Stocké localement dans votre navigateur.",
    historyEmptyTitle: "Aucune facture enregistrée pour le moment.",
    historyEmptyBody:
      "Créez une facture dans l’éditeur puis cliquez sur « Enregistrer dans l’historique ».",

    historyDateHeader: "Date",
    historyInvoiceHeader: "N° de facture",
    historyClientHeader: "Client",
    historyTotalHeader: "Total",
    historyActionsHeader: "Actions",

    historyOpen: "Ouvrir",
    historyDuplicate: "Dupliquer",
    historyDelete: "Supprimer",

    // Settings
    settingsTitle: "Paramètres",
    settingsSubtitle:
      "Configure tes informations d’entreprise, les valeurs par défaut et ton logo pour les nouvelles factures.",
    settingsBusinessInfoLabel:
      "Bloc entreprise (utilisé dans le champ « Émetteur »)",
    settingsBusinessInfoHelper:
      "Ce texte remplira automatiquement la section « Émetteur » des nouvelles factures.",
    settingsDefaultTaxLabel: "Taux de TVA par défaut (%)",
    settingsDefaultCurrencyLabel: "Devise par défaut",
    settingsLogoTitle: "Logo (optionnel)",
    settingsLogoHelper:
      "Ajoute un logo pour l’afficher dans l’en-tête de tes factures.",
    settingsLogoCurrent: "Aperçu du logo actuel",
    settingsLogoRemove: "Supprimer",
    settingsStoredLocally:
      "Les paramètres sont stockés localement dans ton navigateur.",

    // Landing page / marketing
    landingHeroTitle: "Crée des factures et devis en 10 secondes.",
    landingHeroSubtitle:
      "Une web app minimaliste pour les freelances qui veulent des PDF propres et pros, sans logiciel comptable compliqué.",
    landingHeroCtaPrimary: "Ouvrir l’application",
    landingHeroCtaSecondary: "Voir la démo de 30s",
    landingHeroBadge:
      "Aucune inscription nécessaire pour la démo. Les PDF restent dans ton navigateur.",

    landingHeaderCtaPrimary: "Ouvrir l’app",
    landingHeaderCtaSecondary: "Acheter l’accès à vie",

    landingFeatureSpeedTitle: "Ultra rapide",
    landingFeatureSpeedBody:
      "Réutilise tes infos et génère de nouvelles factures en quelques secondes.",
    landingFeatureLocalTitle: "Simple",
    landingFeatureLocalBody:
      "Pas de compte, pas de tableau de bord compliqué. Juste des documents.",
    landingFeatureFreeTitle: "PDF professionnels",
    landingFeatureFreeBody:
      "Une mise en page propre qui te fait paraître premium aux yeux des clients.",

    landingFooter: "FlashInvoice créé pour les freelances.",
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

// small hook so pages can just call useLanguage()
// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
