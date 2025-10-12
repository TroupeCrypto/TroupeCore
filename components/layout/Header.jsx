"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Search, Plus, Command, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useDashboardStore } from "../../lib/state/dashboardStore";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const isDark = theme !== "light"; // default dark
  const { openAddWidget } = useDashboardStore();
  const pathname = usePathname();
  const crumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((s, i, arr) => ({
      label: s.replace(/\b\w/g, (m) => m.toUpperCase()),
      href: "/" + arr.slice(0, i + 1).join("/"),
    }));

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950/60 px-4 backdrop-blur">
      <nav className="flex items-center gap-2 text-sm text-zinc-400">
        {crumbs.map((c, i) => (
          <span key={c.href} className="flex items-center">
            <Link href={c.href} className="hover:text-zinc-200">{c.label}</Link>
            {i < crumbs.length - 1 && <ChevronRight className="mx-2 h-4 w-4 text-zinc-600" />}
          </span>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" className="gap-1" onClick={openAddWidget}>
          <Plus className="h-4 w-4" /> New
        </Button>
        <Button variant="outline" size="sm" className="gap-1">
          <Command className="h-4 w-4" /> Search
        </Button>
        <Button
          aria-label="Toggle theme"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          variant="outline"
          size="sm"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
      </div>
    </header>
  );
}
