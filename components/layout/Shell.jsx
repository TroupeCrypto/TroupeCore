"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import CommandPalette from "./CommandPalette";

export default function AppShell({ children }) {
  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
        <CommandPalette />
      </div>
    </div>
  );
}
