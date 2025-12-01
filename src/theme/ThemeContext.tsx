import React, { createContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

export type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem("fi-theme");
    if (stored === "light" || stored === "dark") return stored;
    return "dark";
  });

  useEffect(() => {
    window.localStorage.setItem("fi-theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
