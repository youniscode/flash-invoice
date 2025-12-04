import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useLanguage } from "../i18n/LanguageContext";

const SETTINGS_KEY = "fi-settings-v1";

type Settings = {
  businessInfo: string;
  defaultTaxRate: number;
  defaultCurrency: string;
  logoDataUrl: string | null;
};

const defaultSettings: Settings = {
  businessInfo: "",
  defaultTaxRate: 20,
  defaultCurrency: "EUR",
  logoDataUrl: null,
};

export function SettingsPage() {
  const { t } = useLanguage();

  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window === "undefined") return defaultSettings;
    try {
      const raw = window.localStorage.getItem(SETTINGS_KEY);
      if (!raw) return defaultSettings;
      const parsed = JSON.parse(raw) as Partial<Settings>;
      return {
        ...defaultSettings,
        ...parsed,
      };
    } catch {
      return defaultSettings;
    }
  });

  // autosave settings
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const handleBusinessChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSettings((prev) => ({ ...prev, businessInfo: e.target.value }));
  };

  const handleTaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setSettings((prev) => ({
      ...prev,
      defaultTaxRate: Number.isFinite(value) ? value : prev.defaultTaxRate,
    }));
  };

  const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSettings((prev) => ({
      ...prev,
      defaultCurrency: e.target.value,
    }));
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const dataUrl = reader.result as string;
        setSettings((prev) => ({
          ...prev,
          logoDataUrl: dataUrl,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const clearLogo = () => {
    setSettings((prev) => ({
      ...prev,
      logoDataUrl: null,
    }));
  };

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">
            {t("settingsTitle")}
          </h2>
          <p className="mt-1 text-[11px] text-slate-400">
            {t("settingsSubtitle")}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        {/* Business info */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="business-info"
              className="mb-1 block text-[11px] text-slate-300"
            >
              {t("settingsBusinessInfoLabel")}
            </label>
            <textarea
              id="business-info"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs"
              rows={5}
              placeholder={t("invoiceFromPlaceholder")}
              value={settings.businessInfo}
              onChange={handleBusinessChange}
            />
            <p className="mt-1 text-[11px] text-slate-500">
              {t("settingsBusinessInfoHelper")}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label
                htmlFor="default-tax"
                className="mb-1 block text-[11px] text-slate-300"
              >
                {t("settingsDefaultTaxLabel")}
              </label>
              <input
                id="default-tax"
                type="number"
                min={0}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs"
                value={settings.defaultTaxRate}
                onChange={handleTaxChange}
              />
            </div>
            <div>
              <label
                htmlFor="default-currency"
                className="mb-1 block text-[11px] text-slate-300"
              >
                {t("settingsDefaultCurrencyLabel")}
              </label>
              <select
                id="default-currency"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs"
                value={settings.defaultCurrency}
                onChange={handleCurrencyChange}
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3">
          <p className="text-[11px] font-semibold text-slate-200">
            {t("settingsLogoTitle")}
          </p>
          <p className="text-[11px] text-slate-500">
            {t("settingsLogoHelper")}
          </p>

          <div className="flex flex-col gap-2">
            <label htmlFor="logo-upload" className="sr-only">
              Upload logo
            </label>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="text-[11px] text-slate-300 file:mr-2 file:rounded-md file:border file:border-slate-700 file:bg-slate-900 file:px-2 file:py-1 file:text-[11px] file:text-slate-200 hover:file:border-sky-500 hover:file:text-sky-300"
            />
            {settings.logoDataUrl && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {t("settingsLogoCurrent")}
                  </span>
                  <button
                    type="button"
                    onClick={clearLogo}
                    className="text-[11px] text-red-400 hover:underline"
                  >
                    {t("settingsLogoRemove")}
                  </button>
                </div>
                <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900 p-2">
                  <img
                    src={settings.logoDataUrl}
                    alt="Logo preview"
                    className="max-h-20 w-auto"
                  />
                </div>
              </div>
            )}
          </div>

          <p className="mt-2 text-[11px] text-slate-500">
            {t("settingsStoredLocally")}
          </p>
        </div>
      </div>
    </div>
  );
}
