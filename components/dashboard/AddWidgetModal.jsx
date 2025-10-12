"use client";

import dynamic from "next/dynamic";
import { useDashboardStore } from "../../lib/state/dashboardStore";
import { widgetRegistry } from "../widgets/registry";
import { Button } from "../ui/button";

export default function AddWidgetModal() {
  const { isAddWidgetOpen, closeAddWidget, widgets, setWidgets } = useDashboardStore();
  if (!isAddWidgetOpen) return null;
  const add = (id) => {
    if (!widgets.includes(id)) setWidgets([...widgets, id]);
    closeAddWidget();
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
      <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 p-4">
        <div className="mb-2 text-lg font-semibold">Add Widget</div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {Object.values(widgetRegistry).map((w) => (
            <button
              key={w.id}
              onClick={() => add(w.id)}
              className="rounded-md border border-zinc-800 p-3 text-left hover:bg-zinc-900"
            >
              <div className="font-medium">{w.label}</div>
              <div className="text-xs text-zinc-500">{w.id}</div>
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={closeAddWidget}>Close</Button>
        </div>
      </div>
    </div>
  );
}
