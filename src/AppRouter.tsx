import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { AppShell } from "./components/layout/AppShell";
import { DashboardPage } from "./pages/DashboardPage";
import { InvoiceEditorPage } from "./pages/InvoiceEditorPage";
import { HistoryPage } from "./pages/HistoryPage";
import { SettingsPage } from "./pages/SettingsPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public marketing page */}
        <Route path="/" element={<LandingPage />} />

        {/* App area with shared layout */}
        <Route path="/app" element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="new-invoice" element={<InvoiceEditorPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="settings" element={<SettingsPage />} />
          {/* Placeholders for future pages */}
          <Route
            path="history"
            element={
              <div className="text-xs text-slate-300">
                History page placeholder
              </div>
            }
          />
          <Route
            path="settings"
            element={
              <div className="text-xs text-slate-300">
                Settings page placeholder
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
