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
