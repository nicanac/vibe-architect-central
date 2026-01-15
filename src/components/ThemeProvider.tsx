"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Inner component that uses the context
function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "fixed bottom-6 right-6 z-[10000] p-4 transition-all hover:scale-105",
        "bg-[var(--terminal-green)] text-[var(--terminal-bg)] pixel-border-sm"
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      {isDark ? (
        <Sun className="w-6 h-6" />
      ) : (
        <Moon className="w-6 h-6" />
      )}
    </button>
  );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("vibe-theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("vibe-theme", theme);
      
      // Update html and body classes
      const html = document.documentElement;
      const body = document.body;
      
      if (theme === "dark") {
        html.classList.add("dark");
        html.classList.remove("light");
        body.classList.add("terminal-theme", "terminal-bg");
        body.classList.remove("terminal-theme-light", "terminal-bg-light");
      } else {
        html.classList.add("light");
        html.classList.remove("dark");
        body.classList.add("terminal-theme-light", "terminal-bg-light");
        body.classList.remove("terminal-theme", "terminal-bg");
      }
      
      // Hide CRT overlay in light mode
      const crtOverlay = document.querySelector('.crt-overlay') as HTMLElement;
      if (crtOverlay) {
        crtOverlay.style.display = theme === "dark" ? "block" : "none";
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
      {mounted && <ThemeToggleButton />}
    </ThemeContext.Provider>
  );
}
