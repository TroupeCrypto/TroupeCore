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
    <aside className="flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur">
      <div className="p-4 text-xl font-bold tracking-tight">Troupe Admin</div>
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
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-300 hover:bg-zinc-900 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
