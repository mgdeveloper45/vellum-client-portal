"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground transition hover:bg-muted"
    >
      <span className="flex items-center gap-2">
        {isLight ? <Moon size={16} /> : <Sun size={16} />}
        {isLight ? "Dark mode" : "Light mode"}
      </span>
    </button>
  );
}