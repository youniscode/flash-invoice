import React from "react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* NAVBAR */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-sky-400" />
            <span className="text-sm font-semibold tracking-tight">
              FlashInvoice
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <a href="/app" className="text-slate-300 hover:text-white">
              Open App
            </a>

            <button className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-slate-950 hover:bg-sky-400">
              Buy Lifetime Access
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-5xl px-4 py-12">
        {/* HERO */}
        <section className="grid gap-10 md:grid-cols-2 md:items-center">
          {/* Left side */}
          <div className="space-y-6">
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              Create invoices & quotes
              <span className="text-sky-400"> in 10 seconds.</span>
            </h1>
            <p className="text-sm text-slate-300">
              A minimal web app for freelancers who want clean, professional
              PDFs without complex accounting software.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <button className="rounded-lg bg-sky-500 px-4 py-2 font-medium text-slate-950 hover:bg-sky-400">
                Try the app
              </button>
              <button className="rounded-lg border border-slate-700 px-4 py-2 font-medium text-slate-100 hover:border-slate-500">
                Watch 30s demo
              </button>
            </div>
            <p className="text-xs text-slate-400">
              No signup required for the demo. PDFs stay in your browser.
            </p>
          </div>

          {/* Right side: preview card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
              <span>Invoice preview</span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-400">
                Live total: €1,250
              </span>
            </div>
            <div className="space-y-3 rounded-xl bg-slate-950 p-4 text-xs">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">Your Studio</p>
                  <p className="text-slate-400">Freelance design & dev</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-400">Invoice #0042</p>
                  <p className="text-[11px] text-slate-400">Due: 21 Feb 2026</p>
                </div>
              </div>
              <div className="h-px bg-slate-800" />
              <div>
                <p className="text-[11px] text-slate-400">Bill to</p>
                <p>Acme Startup</p>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Landing page design</span>
                  <span>€900</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Implementation & QA</span>
                  <span>€350</span>
                </div>
              </div>
              <div className="h-px bg-slate-800" />
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Total</span>
                <span className="text-sky-400 font-semibold">€1,250</span>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Super fast",
              body: "Reuse your info and generate new invoices in seconds.",
            },
            {
              title: "Simple",
              body: "No accounts, no complex dashboard. Just docs.",
            },
            {
              title: "Professional PDFs",
              body: "Clean layout that makes you look premium to clients.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm"
            >
              <h3 className="mb-1 text-sm font-semibold">{card.title}</h3>
              <p className="text-slate-400 text-xs">{card.body}</p>
            </div>
          ))}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-slate-800 py-6 text-center text-[11px] text-slate-500">
        FlashInvoice — made for freelancers.
      </footer>
    </div>
  );
}
