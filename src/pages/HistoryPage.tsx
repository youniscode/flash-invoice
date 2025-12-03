import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

const INVOICES_KEY = "fi-invoices-v1";
const SELECTED_INVOICE_KEY = "fi-selected-invoice-id";

type HistoryItem = {
  id: string;
  createdAt: string;
  clientName: string;
  invoiceNumber: string;
  total: number;
  currency: string;
};

type SavedInvoiceRecord = {
  meta: HistoryItem;
};

function mapRecordsToItems(records: SavedInvoiceRecord[]): HistoryItem[] {
  const mapped = records.map((r) => r.meta);

  // newest first
  mapped.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return mapped;
}

function loadHistoryItems(): HistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(INVOICES_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as SavedInvoiceRecord[];
    return mapRecordsToItems(parsed);
  } catch {
    return [];
  }
}

export function HistoryPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState<HistoryItem[]>(() => loadHistoryItems());
  const navigate = useNavigate();

  const openInvoice = (id: string) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SELECTED_INVOICE_KEY, id);
    }
    navigate("/app/new-invoice");
  };

  const duplicateInvoice = (id: string) => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(INVOICES_KEY);
      if (!raw) return;

      const records = JSON.parse(raw) as SavedInvoiceRecord[];
      const original = records.find((r) => r.meta.id === id);
      if (!original) return;

      const now = new Date().toISOString();
      const newId = Math.random().toString(36).slice(2);

      const duplicated: SavedInvoiceRecord = {
        ...original,
        meta: {
          ...original.meta,
          id: newId,
          createdAt: now,
          invoiceNumber: original.meta.invoiceNumber + " (copy)",
        },
      };

      const updatedRecords = [...records, duplicated];
      window.localStorage.setItem(INVOICES_KEY, JSON.stringify(updatedRecords));

      setItems(mapRecordsToItems(updatedRecords));
    } catch {
      // ignore errors for now
    }
  };

  const deleteInvoice = (id: string) => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(INVOICES_KEY);
      if (!raw) return;

      const records = JSON.parse(raw) as SavedInvoiceRecord[];
      const updatedRecords = records.filter((r) => r.meta.id !== id);

      window.localStorage.setItem(INVOICES_KEY, JSON.stringify(updatedRecords));

      setItems(mapRecordsToItems(updatedRecords));
    } catch {
      // ignore errors for now
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMoney = (value: number, currency: string) =>
    `${currency} ${value.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  if (!items.length) {
    return (
      <div className="flex w-full flex-col items-center justify-center text-xs text-slate-400">
        <p>{t("historyEmptyTitle")}</p>
        <p className="mt-1">{t("historyEmptyBody")}</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-100">
          {t("historyTitleFull")}
        </h2>
        <p className="text-[11px] text-slate-400">
          {t("historyStoredLocally")}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] text-slate-400">
              <th className="py-2 pr-4">{t("historyDateHeader")}</th>
              <th className="py-2 pr-4">{t("historyInvoiceHeader")}</th>
              <th className="py-2 pr-4">{t("historyClientHeader")}</th>
              <th className="py-2 pr-4 text-right">
                {t("historyTotalHeader")}
              </th>
              <th className="py-2 pr-0 text-right">
                {t("historyActionsHeader")}
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((inv) => (
              <tr
                key={inv.id}
                className="border-b border-slate-900/80 text-[11px] text-slate-200 hover:bg-slate-900"
              >
                <td className="whitespace-nowrap py-2 pr-4">
                  {formatDate(inv.createdAt)}
                </td>
                <td className="py-2 pr-4">{inv.invoiceNumber}</td>
                <td className="py-2 pr-4">{inv.clientName}</td>
                <td className="py-2 pr-4 text-right">
                  {formatMoney(inv.total, inv.currency)}
                </td>
                <td className="py-2 pr-0 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => openInvoice(inv.id)}
                    className="rounded-lg border border-slate-700 px-3 py-1 text-[11px] text-slate-200 hover:border-sky-500 hover:text-sky-300"
                  >
                    {t("historyOpen")}
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicateInvoice(inv.id)}
                    className="rounded-lg border border-slate-700 px-3 py-1 text-[11px] text-slate-300 hover:border-slate-500 hover:text-slate-100"
                  >
                    {t("historyDuplicate")}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteInvoice(inv.id)}
                    className="rounded-lg border border-red-700 px-3 py-1 text-[11px] text-red-300 hover:border-red-500 hover:text-red-200"
                  >
                    {t("historyDelete")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
