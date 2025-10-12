"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../ui/cn";
import { BarChart2, Gauge, Bot, Cog } from "lucide-react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: Gauge },
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/agents", label: "AI Agents", icon: Bot },
  { href: "/settings", label: "Settings", icon: Cog },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-black/80 backdrop-blur">
      <div className="p-4">
        <div className="text-xs uppercase tracking-[0.3em] text-[#00ff41]/70">Vault</div>
        <div className="text-xl font-semibold text-white">Mission Admin</div>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                active
                  ? "border border-[#00ff41]/40 bg-[#062510] text-white shadow-[0_0_20px_rgba(0,255,65,0.12)]"
                  : "text-zinc-400 hover:border hover:border-[#00ff41]/20 hover:bg-[#031407] hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4 text-xs text-zinc-500">
        <div className="font-semibold text-[#00ff41]">Session secure</div>
        <div>Biometric lock · PostgreSQL encrypted</div>
      </div>
    </aside>
  );
}
