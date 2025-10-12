"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Search, ShieldCheck } from "lucide-react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const isDark = theme !== "light"; // default dark

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[#0f3f1b] bg-black/70 px-4 backdrop-blur">
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <Search className="h-4 w-4 text-[#00ff41]" />
        <input
          placeholder="Search dashboards, agents, vaults..."
          className="w-80 rounded-md border border-transparent bg-black/40 px-3 py-1 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-[#00ff41]/40 focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-3 text-xs text-zinc-500">
        <div className="flex items-center gap-1 rounded-full border border-[#00ff41]/30 px-3 py-1 text-[#00ff41]">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Encrypted</span>
        </div>
        <button
          aria-label="Toggle theme"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#0f3f1b] bg-black/60 text-zinc-300 hover:border-[#00ff41]/40 hover:text-white"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <div className="h-8 w-8 rounded-full border border-[#00ff41]/50 bg-gradient-to-br from-[#00ff41]/40 to-transparent" />
      </div>
    </header>
  );
}
