"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "lucide-react";
import { Button } from "../ui/button";

export default function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  const items = [
    { label: "Dashboard", href: "/admin" },
    { label: "Analytics", href: "/analytics" },
    { label: "Agents", href: "/agents" },
    { label: "Settings", href: "/settings" },
  ];
  const filtered = items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <div className="hidden">
        <Button onClick={() => setOpen(true)} />
      </div>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-start bg-black/50 p-8">
          <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
            <div className="flex items-center gap-2 border-b border-zinc-800 p-3">
              <Command className="h-4 w-4 text-zinc-500" />
              <input
                autoFocus
                placeholder="Type a command or search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
              />
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Close</Button>
            </div>
            <div className="max-h-80 overflow-auto p-2">
              {filtered.map((i) => (
                <button
                  key={i.href}
                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left hover:bg-zinc-900"
                  onClick={() => {
                    setOpen(false);
                    router.push(i.href);
                  }}
                >
                  <div className="text-sm">{i.label}</div>
                  <div className="text-xs text-zinc-500">{i.href}</div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="p-3 text-sm text-zinc-500">No results</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
