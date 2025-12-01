import { useMemo, useState } from "react";

type LineItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export function InvoiceEditorPage() {
  const [line, setLine] = useState<LineItem>({
    description: "Landing page design",
    quantity: 1,
    unitPrice: 900,
  });

  const [taxRate, setTaxRate] = useState<number>(20);

  const subtotal = useMemo(
    () => line.quantity * line.unitPrice,
    [line.quantity, line.unitPrice]
  );

  const taxAmount = useMemo(
    () => (subtotal * taxRate) / 100,
    [subtotal, taxRate]
  );

  const total = subtotal + taxAmount;

  const handleLineChange =
    (field: keyof LineItem) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        field === "description" ? e.target.value : Number(e.target.value) || 0;

      setLine((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setTaxRate(Number.isFinite(value) ? value : 0);
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
            <button className="rounded-lg border border-slate-700 px-3 py-1 hover:border-sky-500">
              Save draft
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
            >
              <option>EUR</option>
              <option>USD</option>
              <option>GBP</option>
            </select>
          </div>
        </div>

        {/* LINE ITEMS HEADER */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Line items</span>
            <button className="text-sky-300 hover:underline">+ Add line</button>
          </div>

          {/* Column labels */}
          <div className="grid grid-cols-[2fr_repeat(3,minmax(0,1fr))] gap-2 text-[11px] text-slate-400">
            <span>Description</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Unit price</span>
            <span className="text-right">Total</span>
          </div>

          {/* SINGLE ROW (controlled) */}
          <div className="grid grid-cols-[2fr_repeat(3,minmax(0,1fr))] gap-2">
            {/* Description */}
            <div className="flex flex-col">
              <label htmlFor="line-1-desc" className="sr-only">
                Line 1 description
              </label>
              <input
                id="line-1-desc"
                placeholder="Description"
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs"
                value={line.description}
                onChange={handleLineChange("description")}
              />
            </div>

            {/* Qty */}
            <div className="flex flex-col">
              <label htmlFor="line-1-qty" className="sr-only">
                Line 1 quantity
              </label>
              <input
                id="line-1-qty"
                type="number"
                min={0}
                placeholder="1"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-right text-xs"
                value={line.quantity}
                onChange={handleLineChange("quantity")}
              />
            </div>

            {/* Unit price */}
            <div className="flex flex-col">
              <label htmlFor="line-1-price" className="sr-only">
                Line 1 unit price
              </label>
              <input
                id="line-1-price"
                type="number"
                min={0}
                placeholder="0.00"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2 py-1.5 text-right text-xs"
                value={line.unitPrice}
                onChange={handleLineChange("unitPrice")}
              />
            </div>

            {/* Total */}
            <div className="flex items-center justify-end text-xs text-slate-200">
              {formatMoney(subtotal)}
            </div>
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
                value={taxRate}
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
            Later we&apos;ll replace this with a real PDF layout connected to
            all fields.
          </p>
        </div>
      </div>
    </div>
  );
}
