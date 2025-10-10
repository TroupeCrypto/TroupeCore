"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Search } from "lucide-react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const isDark = theme !== "light"; // default dark

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950/60 px-4 backdrop-blur">
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <Search className="h-4 w-4" />
        <input
          placeholder="Search analytics, dashboards, agents..."
          className="w-80 bg-transparent outline-none placeholder:text-zinc-600"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          aria-label="Toggle theme"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-800 hover:bg-zinc-900"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
      </div>
    </header>
  );
}
