import React, { createContext, useContext, useEffect, ReactNode } from "react";

type Theme = "light";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "vite-ui-theme",
}: ThemeProviderProps) {
  const theme: Theme = "light"; // Always use light theme

  useEffect(() => {
    const root = window.document.documentElement;

    // Always apply light theme
    root.classList.remove("dark");
    root.classList.add("light");
  }, []);

  const value = {
    theme,
    setTheme: () => {
      // Do nothing - theme is always light
    },
  };

  return React.createElement(ThemeProviderContext.Provider, { value }, children);
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};