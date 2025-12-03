import { useEffect, useMemo, useState, useRef } from "react";
import type { ChangeEvent } from "react";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useLanguage } from "../i18n/useLanguage";


type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

type InvoiceDraft = {
  from: string;
  to: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  notes: string;
  taxRate: number;
  items: LineItem[];
};

const DRAFT_KEY = "fi-invoice-draft-v1";
const INVOICES_KEY = "fi-invoices-v1";
const SELECTED_INVOICE_KEY = "fi-selected-invoice-id";

type SavedInvoiceMeta = {
  id: string;
  createdAt: string;
  clientName: string;
  invoiceNumber: string;
  total: number;
  currency: string;
};

type SavedInvoiceRecord = {
  meta: SavedInvoiceMeta;
  data: InvoiceDraft;
};

function createLine(partial?: Partial<LineItem>): LineItem {
  return {
    id: Math.random().toString(36).slice(2),
    description: partial?.description ?? "",
    quantity: partial?.quantity ?? 1,
    unitPrice: partial?.unitPrice ?? 0,
  };
}

const defaultDraft: InvoiceDraft = {
  from: "",
  to: "",
  invoiceNumber: "INV-0001",
  issueDate: "",
  dueDate: "",
  currency: "EUR",
  notes: "",
  taxRate: 20,
  items: [
    createLine({
      description: "Landing page design",
      quantity: 1,
      unitPrice: 900,
    }),
  ],
};

type SettingsData = {
  businessInfo?: string;
  defaultTaxRate?: number;
  defaultCurrency?: string;
  logoDataUrl?: string | null;
};

const SETTINGS_KEY = "fi-settings-v1";

function getSettingsDefaults(): Partial<InvoiceDraft> {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as SettingsData;
    const partial: Partial<InvoiceDraft> = {};

    if (parsed.businessInfo) {
      partial.from = parsed.businessInfo;
    }
    if (typeof parsed.defaultTaxRate === "number") {
      partial.taxRate = parsed.defaultTaxRate;
    }
    if (parsed.defaultCurrency) {
      partial.currency = parsed.defaultCurrency;
    }

    return partial;
  } catch {
    return {};
  }
}

function loadInitialDraft(): InvoiceDraft {
  if (typeof window === "undefined") return defaultDraft;

  try {
    const settingsDefaults = getSettingsDefaults();

    // 1) If coming from history "Open"
    const selectedId = window.localStorage.getItem(SELECTED_INVOICE_KEY);
    if (selectedId) {
      // one-shot behavior: clear selection
      window.localStorage.removeItem(SELECTED_INVOICE_KEY);

      const rawInvoices = window.localStorage.getItem(INVOICES_KEY);
      if (rawInvoices) {
        const records = JSON.parse(rawInvoices) as SavedInvoiceRecord[];
        const match = records.find((r) => r.meta.id === selectedId);

        if (match) {
          const parsed = match.data;

          return {
            ...defaultDraft,
            ...settingsDefaults,
            ...parsed,
            items: (parsed.items ?? defaultDraft.items).map((item) => ({
              ...createLine(),
              ...item,
            })),
            taxRate:
              typeof parsed.taxRate === "number"
                ? parsed.taxRate
                : typeof settingsDefaults.taxRate === "number"
                ? settingsDefaults.taxRate
                : defaultDraft.taxRate,
          };
        }
      }
    }

    // 2) Fallback: load last draft
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) {
      // no draft -> just defaults + settings
      return {
        ...defaultDraft,
        ...settingsDefaults,
      };
    }

    const parsed = JSON.parse(raw) as Partial<InvoiceDraft>;

    return {
      ...defaultDraft,
      ...settingsDefaults,
      ...parsed,
      items: (parsed.items ?? defaultDraft.items).map((item) => ({
        ...createLine(),
        ...item,
      })),
      taxRate:
        typeof parsed.taxRate === "number"
          ? parsed.taxRate
          : typeof settingsDefaults.taxRate === "number"
          ? settingsDefaults.taxRate
          : defaultDraft.taxRate,
    };
  } catch {
    return defaultDraft;
  }
}

function loadInitialLogo(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as SettingsData;

    if (parsed.logoDataUrl && typeof parsed.logoDataUrl === "string") {
      return parsed.logoDataUrl;
    }
    return null;
  } catch {
    return null;
  }
}

export function InvoiceEditorPage() {
  const { t } = useLanguage();

  // INIT from localStorage (no effect, no red)
  const [invoice, setInvoice] = useState<InvoiceDraft>(() =>
    loadInitialDraft()
  );
  const [logoUrl] = useState<string | null>(() => loadInitialLogo());
  const previewRef = useRef<HTMLDivElement | null>(null);

  // SAVE draft whenever invoice changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(invoice));
  }, [invoice]);

  const subtotal = useMemo(
    () =>
      invoice.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      ),
    [invoice.items]
  );

  const taxAmount = useMemo(
    () => (subtotal * invoice.taxRate) / 100,
    [subtotal, invoice.taxRate]
  );

  const total = subtotal + taxAmount;

  const onFieldChange =
    (field: keyof Omit<InvoiceDraft, "items" | "taxRate">) =>
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const value = e.target.value;
      setInvoice((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleTaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setInvoice((prev) => ({
      ...prev,
      taxRate: Number.isFinite(value) ? value : prev.taxRate,
    }));
  };

  const updateItem =
    (id: string, field: keyof LineItem) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "description" ? e.target.value : Number(e.target.value) || 0;

      setInvoice((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      }));
    };

  const addLine = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [...prev.items, createLine()],
    }));
  };

  const removeLine = (id: string) => {
    setInvoice((prev) => {
      if (prev.items.length === 1) {
        return {
          ...prev,
          items: [createLine()],
        };
      }
      return {
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
      };
    });
  };

  const resetToBlank = () => {
    const settingsDefaults = getSettingsDefaults();
    setInvoice({
      ...defaultDraft,
      ...settingsDefaults,
    });
  };

  const saveToHistory = () => {
    if (typeof window === "undefined") return;

    let existing: SavedInvoiceRecord[] = [];
    try {
      const raw = window.localStorage.getItem(INVOICES_KEY);
      if (raw) {
        existing = JSON.parse(raw) as SavedInvoiceRecord[];
      }
    } catch {
      existing = [];
    }

    const clientName =
      invoice.to.split("\n").map((s) => s.trim())[0] || "Client";

    const record: SavedInvoiceRecord = {
      meta: {
        id: Math.random().toString(36).slice(2),
        createdAt: new Date().toISOString(),
        clientName,
        invoiceNumber: invoice.invoiceNumber || "INV-0001",
        total,
        currency: invoice.currency || "EUR",
      },
      data: invoice,
    };

    const updated = [...existing, record];
    window.localStorage.setItem(INVOICES_KEY, JSON.stringify(updated));
  };

  const handleDownloadPdf = async () => {
    const el = previewRef.current;
    if (!el) return;

    const canvas = await html2canvas(el, {
      scale: 2, // better quality
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`${invoice.invoiceNumber || "invoice"}.pdf`);
  };

  const formatMoney = (value: number) =>
    `€${value.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="grid w-full gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      {/* FORM SIDE */}
      <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">{t("invoiceEditorTitle")}</h2>
          <div className="flex gap-2 text-[11px]">
            <button
              type="button"
              className="rounded-lg border border-slate-700 px-3 py-1 text-slate-300 hover:border-sky-500"
            >
              {t("invoiceDraftStatus")}
            </button>
            <button
              type="button"
              onClick={saveToHistory}
              className="rounded-lg border border-slate-700 px-3 py-1 text-slate-300 hover:border-sky-500"
            >
              {t("invoiceSaveHistory")}
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-700 px-3 py-1 text-slate-300 hover:border-sky-500"
              onClick={resetToBlank}
            >
              {t("invoiceNewBlank")}
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="rounded-lg bg-sky-500 px-3 py-1 font-medium text-slate-950 hover:bg-sky-400"
            >
              {t("invoiceDownloadPdf")}
            </button>
          </div>
        </div>

        {/* FROM / TO */}
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label
              htmlFor="from-block"
              className="mb-1 block text-[11px] text-slate-300"
            >
              {t("invoiceFromLabel")}
            </label>
            <textarea
              id="from-block"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs"
              rows={3}
              placeholder={t("invoiceFromPlaceholder")}
              value={invoice.from}
              onChange={onFieldChange("from")}
            />
          </div>
          <div>
            <label
              htmlFor="to-block"
              className="mb-1 block text-[11px] text-slate-300"
            >
              {t("invoiceToLabel")}
            </label>
            <textarea
              id="to-block"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs"
              rows={3}
              placeholder={t("invoiceToPlaceholder")}
              value={invoice.to}
              onChange={onFieldChange("to")}
            />
          </div>
        </div>

        {/* META INFO */}
        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <label
              htmlFor="invoice-number"
              className="mb-1 block text-[11px] text-slate-300"
            >
              {t("invoiceNumberLabel")}
            </label>
            <input
              id="invoice-number"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs"
              placeholder="INV-0001"
              value={invoice.invoiceNumber}
              onChange={onFieldChange("invoiceNumber")}
            />
          </div>
          <div>
            <label
              htmlFor="issue-date"
              className="mb-1 block text-[11px] text-slate-300"
            >
              {t("invoiceIssueDateLabel")}
            </label>
            <input
              id="issue-date"
              type="date"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs"
              value={invoice.issueDate}
              onChange={onFieldChange("issueDate")}
            />
          </div>
          <div>
            <label
              htmlFor="due-date"
              className="mb-1 block text-[11px] text-slate-300"
            >
              {t("invoiceDueDateLabel")}
            </label>
            <input
              id="due-date"
              type="date"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs"
              value={invoice.dueDate}
              onChange={onFieldChange("dueDate")}
            />
          </div>
          <div>
            <label
              htmlFor="currency"
              className="mb-1 block text-[11px] text-slate-300"
            >
              {t("invoiceCurrencyLabel")}
            </label>
            <select
              id="currency"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs"
              value={invoice.currency}
              onChange={onFieldChange("currency")}
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        {/* LINE ITEMS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{t("invoiceLineItemsTitle")}</span>
            <button
              type="button"
              className="text-sky-300 hover:underline"
              onClick={addLine}
            >
              + Add line
            </button>
          </div>

          {/* Column labels */}
          <div className="grid grid-cols-[2fr_repeat(3,minmax(0,1fr))] gap-2 text-[11px] text-slate-400">
            <span>{t("invoiceDescriptionHeader")}</span>
            <span className="text-right">{t("invoiceQtyHeader")}</span>
            <span className="text-right">{t("invoiceUnitPriceHeader")}</span>
            <span className="text-right">{t("invoiceLineTotalHeader")}</span>
          </div>

          {/* ROWS */}
          <div className="space-y-2">
            {invoice.items.map((item, index) => {
              const lineTotal = item.quantity * item.unitPrice;
              const descId = `line-${item.id}-desc`;
              const qtyId = `line-${item.id}-qty`;
              const priceId = `line-${item.id}-price`;

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-[2fr_repeat(3,minmax(0,1fr))] gap-2"
                >
                  {/* Description */}
                  <div className="flex flex-col">
                    <label htmlFor={descId} className="sr-only">
                      Line {index + 1} description
                    </label>
                    <input
                      id={descId}
                      placeholder={t("invoiceDescriptionHeader")}
                      className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs"
                      value={item.description}
                      onChange={updateItem(item.id, "description")}
                    />
                  </div>

                  {/* Qty */}
                  <div className="flex flex-col">
                    <label htmlFor={qtyId} className="sr-only">
                      Line {index + 1} quantity
                    </label>
                    <input
                      id={qtyId}
                      type="number"
                      min={0}
                      placeholder="1"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-right text-xs"
                      value={item.quantity}
                      onChange={updateItem(item.id, "quantity")}
                    />
                  </div>

                  {/* Unit price */}
                  <div className="flex flex-col">
                    <label htmlFor={priceId} className="sr-only">
                      Line {index + 1} unit price
                    </label>
                    <input
                      id={priceId}
                      type="number"
                      min={0}
                      placeholder="0.00"
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-right text-xs"
                      value={item.unitPrice}
                      onChange={updateItem(item.id, "unitPrice")}
                    />
                  </div>

                  {/* Total + delete */}
                  <div className="flex items-center justify-end gap-2 text-xs text-slate-200">
                    <span>{formatMoney(lineTotal)}</span>
                    <button
                      type="button"
                      className="rounded-full border border-slate-700 px-2 py-1 text-[10px] text-slate-400 hover:border-red-500 hover:text-red-400"
                      onClick={() => removeLine(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* NOTES + TAX */}
        <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
          <div>
            <label
              htmlFor="notes"
              className="mb-1 block text-[11px] text-slate-300"
            >
              {t("invoiceNotesLabel")}
            </label>
            <textarea
              id="notes"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs"
              rows={3}
              placeholder={t("invoiceNotesPlaceholder")}
              value={invoice.notes}
              onChange={onFieldChange("notes")}
            />
          </div>
          <div className="space-y-3">
            <div>
              <label
                htmlFor="tax-rate"
                className="mb-1 block text-[11px] text-slate-300"
              >
                {t("invoiceTaxRateLabel")}
              </label>
              <input
                id="tax-rate"
                type="number"
                min={0}
                placeholder="0"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-right"
                value={invoice.taxRate}
                onChange={handleTaxChange}
              />
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">
                  {t("invoiceSubtotalLabel")}
                </span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t("invoiceTaxLabel")}</span>
                <span>{formatMoney(taxAmount)}</span>
              </div>
              <div className="mt-1 h-px bg-slate-800" />
              <div className="mt-1 flex justify-between text-xs">
                <span className="text-slate-300">{t("invoiceTotalLabel")}</span>
                <span className="font-semibold text-sky-400">
                  {formatMoney(total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PREVIEW SIDE */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs">
        <p className="mb-2 text-[11px] text-slate-400">
          {t("invoicePreviewTitle")}
        </p>
        <div
          ref={previewRef}
          className="h-[calc(100vh-220px)] overflow-auto rounded-xl bg-white p-6 text-slate-900"
        >
          {/* HEADER */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="Invoice logo"
                  className="h-10 w-auto rounded-md"
                />
              )}
              <div>
                <p className="text-xs font-semibold">
                  {t("invoiceHeaderTitle")}
                </p>
                <p className="text-[11px] text-slate-500">
                  #{invoice.invoiceNumber || "—"}
                </p>
              </div>
            </div>
            <div className="text-right text-[11px] text-slate-600">
              <p>
                {t("invoiceHeaderIssue")}: {invoice.issueDate || "—"}
              </p>
              <p>
                {t("invoiceHeaderDue")}: {invoice.dueDate || "—"}
              </p>
              <p className="mt-1 font-semibold">
                {t("invoiceHeaderTotal")}: {formatMoney(total)}
              </p>
            </div>
          </div>

          {/* BODY SUMMARY */}
          <p className="mt-4 text-[11px] text-slate-600">
            {t("invoiceSubtotalLabel")}: {formatMoney(subtotal)} •{" "}
            {t("invoiceTaxLabel")}: {formatMoney(taxAmount)} •{" "}
            {t("invoiceTotalLabel")}:{" "}
            <span className="font-semibold">{formatMoney(total)}</span>
          </p>

          <p className="mt-4 text-[11px] text-slate-500">
            {t("invoicePreviewSavedHint")}
          </p>
        </div>
      </div>
    </div>
  );
}
