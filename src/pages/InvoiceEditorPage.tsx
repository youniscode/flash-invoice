import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";

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

function loadInitialDraft(): InvoiceDraft {
  if (typeof window === "undefined") return defaultDraft;

  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return defaultDraft;

    const parsed = JSON.parse(raw) as Partial<InvoiceDraft>;

    return {
      ...defaultDraft,
      ...parsed,
      items: (parsed.items ?? defaultDraft.items).map((item) => ({
        ...createLine(),
        ...item,
      })),
      taxRate:
        typeof parsed.taxRate === "number"
          ? parsed.taxRate
          : defaultDraft.taxRate,
    };
  } catch {
    return defaultDraft;
  }
}

export function InvoiceEditorPage() {
  // INIT from localStorage (no effect, no red)
  const [invoice, setInvoice] = useState<InvoiceDraft>(() =>
    loadInitialDraft()
  );

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
    setInvoice(defaultDraft);
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
          <h2 className="text-sm font-semibold">Invoice editor</h2>
          <div className="flex gap-2 text-[11px]">
            <button
              type="button"
              className="rounded-lg border border-slate-700 px-3 py-1 text-slate-300 hover:border-sky-500"
            >
              Draft auto-saved
            </button>
            <button
              type="button"
              className="rounded-lg border border-slate-700 px-3 py-1 text-slate-300 hover:border-sky-500"
              onClick={resetToBlank}
            >
              New blank
            </button>
            <button className="rounded-lg bg-sky-500 px-3 py-1 font-medium text-slate-950 hover:bg-sky-400">
              Download PDF
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
              From (your business)
            </label>
            <textarea
              id="from-block"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs"
              rows={3}
              placeholder={`Your Name\nYour business name\nAddress\nEmail\nTax ID`}
              value={invoice.from}
              onChange={onFieldChange("from")}
            />
          </div>
          <div>
            <label
              htmlFor="to-block"
              className="mb-1 block text-[11px] text-slate-300"
            >
              Bill to (client)
            </label>
            <textarea
              id="to-block"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs"
              rows={3}
              placeholder={`Client name\nCompany\nAddress\nEmail`}
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
              Invoice #
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
              Issue date
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
              Due date
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
              Currency
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
            <span>Line items</span>
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
            <span>Description</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Unit price</span>
            <span className="text-right">Total</span>
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
                      placeholder="Description"
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
              Notes
            </label>
            <textarea
              id="notes"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs"
              rows={3}
              placeholder="Payment terms, bank details, thank you message..."
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
                Tax rate (%)
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
                <span className="text-slate-400">Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tax</span>
                <span>{formatMoney(taxAmount)}</span>
              </div>
              <div className="mt-1 h-px bg-slate-800" />
              <div className="mt-1 flex justify-between text-xs">
                <span className="text-slate-300">Total</span>
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
        <p className="mb-2 text-[11px] text-slate-400">Preview</p>
        <div className="h-[calc(100vh-220px)] overflow-auto rounded-xl bg-white p-6 text-slate-900">
          <p className="text-sm font-semibold">Invoice preview</p>
          <p className="mt-2 text-[11px] text-slate-500">
            Subtotal: {formatMoney(subtotal)} • Tax: {formatMoney(taxAmount)} •
            Total: <span className="font-semibold">{formatMoney(total)}</span>
          </p>
          <p className="mt-4 text-[11px] text-slate-500">
            Your draft is saved automatically in your browser. You can close
            this tab and come back later without losing your invoice.
          </p>
        </div>
      </div>
    </div>
  );
}
