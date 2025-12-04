import { Link } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

export function LandingPage() {
  const { t, lang, toggleLanguage } = useLanguage();

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
            <Link
              to="/app"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-sm shadow-sky-500/40 hover:bg-sky-400"
            >
              {t("landingHeaderCtaPrimary")}
            </Link>

            <button className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-slate-950 hover:bg-sky-400">
              {t("landingHeaderCtaSecondary")}
            </button>

            <button
              onClick={toggleLanguage}
              className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-300 hover:border-sky-500 hover:text-sky-300"
            >
              {lang === "en" ? "FR" : "EN"}
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
              {t("landingHeroTitle")}
            </h1>
            <p className="text-sm text-slate-300">{t("landingHeroSubtitle")}</p>
            <div className="flex flex-wrap gap-3 text-sm">
              <Link
                to="/app"
                className="rounded-lg bg-sky-500 px-4 py-2 font-medium text-slate-950 hover:bg-sky-400"
              >
                {t("landingHeroCtaPrimary")}
              </Link>
              <button className="rounded-lg border border-slate-700 px-4 py-2 font-medium text-slate-100 hover:border-slate-500">
                {t("landingHeroCtaSecondary")}
              </button>
            </div>
            <p className="text-xs text-slate-400">{t("landingHeroBadge")}</p>
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
              title: t("landingFeatureSpeedTitle"),
              body: t("landingFeatureSpeedBody"),
            },
            {
              title: t("landingFeatureLocalTitle"),
              body: t("landingFeatureLocalBody"),
            },
            {
              title: t("landingFeatureFreeTitle"),
              body: t("landingFeatureFreeBody"),
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm"
            >
              <h3 className="mb-1 text-sm font-semibold">{card.title}</h3>
              <p className="text-xs text-slate-400">{card.body}</p>
            </div>
          ))}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-slate-800 py-6 text-center text-[11px] text-slate-500">
        {t("landingFooter")}
      </footer>
    </div>
  );
}
