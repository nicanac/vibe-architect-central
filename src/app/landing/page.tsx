"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";
import {
  TerminalNav,
  HeroSection,
  MediaPlayer,
  ServicesGrid,
  ProcessTimeline,
  SolutionBanner,
  TerminalFooter,
} from "@/components/landing";

export default function LandingPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "min-h-screen font-mono selection:bg-[var(--terminal-purple)] selection:text-white",
        isDark ? "terminal-theme terminal-bg" : "terminal-theme-light terminal-bg-light",
        isDark ? "text-[var(--terminal-green)]" : "text-black"
      )}
    >
      {/* CRT Overlay */}
      {isDark && <div className="crt-overlay" />}

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={cn(
          "fixed bottom-6 right-6 z-[10000] p-4 pixel-border-sm transition-all hover:scale-105",
          isDark
            ? "bg-[var(--terminal-green)] text-[#0D0D0D]"
            : "bg-black text-white"
        )}
        aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      >
        {isDark ? (
          <Sun className="w-6 h-6" />
        ) : (
          <Moon className="w-6 h-6" />
        )}
      </button>

      {/* Navigation */}
      <TerminalNav theme={theme} />

      {/* Main Content */}
      <main className="max-w-8xl mx-auto px-4 pt-16 pb-24 relative overflow-hidden">
        {/* Scanline Animation */}
        <div className="scanline animate-scan" />

        <HeroSection theme={theme} />
        <MediaPlayer
          theme={theme}
          imageSrc="https://lh3.googleusercontent.com/aida-public/AB6AXuBBYtiz7V89-n0g6dtwDPxOQkOTMa7faYqakG3k0EfZHQXLYdMTbv2tP14cAkO7NHBNEhKvX0Iak4eGgvT4QFhItlVgqH-OaO8Rpx2ZA81hQkCSJA73SDy0bd60z3JqeDER3pQjhGr308d9dOZ7JHKc65jK6y7ESvlPLgzeKO_DTSGFDAXWEW8gPenMGhYyJplFMB3bLAF1w-lQQJbpMW4mC44GACSn1gQQsRYBv1HAH0Y9eA1o9zMjn0n4D8QlJfPZ5NWUoXC_SeSl"
        />
        <ServicesGrid theme={theme} />
        <ProcessTimeline theme={theme} />
        <SolutionBanner theme={theme} />
      </main>

      {/* Footer */}
      <TerminalFooter theme={theme} />
    </div>
  );
}
