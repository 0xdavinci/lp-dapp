"use client";

import { useTheme } from "../context/ThemeContext";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="ctaButton w-10 h-10 flex items-center justify-center p-2 rounded-full hover:bg-[var(--primary-disabled-color)] transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <span className="text-xl rotate-[28deg]">☽</span>
      ) : (
        <span className="text-xl">☼</span>
      )}
    </button>
  );
}
