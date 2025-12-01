import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useTheme } from "../../theme/useTheme";
import { useLanguage } from "../../i18n/useLanguage";

export function AppShell() {
  const { lang, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const navItems = [
    { to: "/app", label: t("dashboard") },
    { to: "/app/new-invoice", label: t("newInvoice") },
    { to: "/app/history", label: t("history") },
    { to: "/app/settings", label: t("settings") },
  ];

  return (
    <div
      className={
        "flex min-h-screen transition-colors " +
        (isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900")
      }
    >
      {/* SIDEBAR */}
      <aside className="hidden w-56 border-r border-slate-800 bg-slate-950/80 p-4 md:flex md:flex-col">
        <div className="mb-8 flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-sky-400" />
          <span className="text-xs font-semibold tracking-tight">
            FlashInvoice
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 text-xs">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/app"}
              className={({ isActive }) =>
                [
                  "rounded-lg px-3 py-2",
                  isActive
                    ? "bg-sky-500/10 text-sky-300"
                    : "text-slate-300 hover:bg-slate-900",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 text-[11px] text-slate-500">
          <p>v1 • Local only</p>
        </div>
      </aside>

      {/* MAIN COLUMN */}
      <div className="flex flex-1 flex-col">
        {/* TOPBAR */}
        <header className="border-b border-slate-800 bg-slate-950/60">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 text-xs">
            <p className="text-slate-400">{t("appTitle")}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-300 hover:border-sky-500 hover:text-sky-300"
              >
                {lang === "en" ? "FR" : "EN"}
              </button>
              <button
                onClick={toggleTheme}
                className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-300 hover:border-sky-500 hover:text-sky-300"
              >
                {isDark ? t("themeLight") : t("themeDark")}
              </button>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="mx-auto flex w-full max-w-5xl flex-1 px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
