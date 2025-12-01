import React from "react";

export function DashboardPage() {
  return (
    <div className="flex w-full flex-col gap-6 md:flex-row">
      {/* LEFT SIDE */}
      <div className="flex-1 space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-sm font-semibold">Welcome back 👋</h2>
          <p className="mt-1 text-xs text-slate-400">
            Create a new invoice or quote in a few seconds.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <a
              href="/app/new-invoice"
              className="rounded-lg bg-sky-500 px-4 py-2 font-medium text-slate-950 hover:bg-sky-400"
            >
              New invoice
            </a>

            <button className="rounded-lg border border-slate-700 px-4 py-2 font-medium text-slate-100 hover:border-slate-500">
              New quote
            </button>
          </div>
        </div>

        <div className="grid gap-3 text-xs sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-[11px] text-slate-400">This month</p>
            <p className="mt-1 text-lg font-semibold">€3,750</p>
            <p className="text-[11px] text-slate-500">In invoices</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-[11px] text-slate-400">Outstanding</p>
            <p className="mt-1 text-lg font-semibold">€1,200</p>
            <p className="text-[11px] text-slate-500">Awaiting payment</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-[11px] text-slate-400">Quotes</p>
            <p className="mt-1 text-lg font-semibold">4</p>
            <p className="text-[11px] text-slate-500">Sent this week</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-xs">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Recent documents</h3>
          <button className="text-[11px] text-sky-300 hover:underline">
            View all
          </button>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-slate-800/60 bg-slate-950/60 px-3 py-2"
            >
              <div>
                <p className="font-medium text-[12px]">Invoice #INV-00{i}</p>
                <p className="text-[11px] text-slate-400">Acme Studio</p>
              </div>
              <div className="text-right text-[11px]">
                <p className="text-slate-300">€1,250</p>
                <p className="text-slate-500">2 days ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
