"use client";

import { useEventSource } from "../../lib/hooks/useEventSource";

export default function SystemMemoryWidget() {
  const evt = useEventSource("/api/stream");
  const mem = evt?.memUsedPct ?? 0;
  return (
    <div className="flex h-full flex-col">
      <div className="text-4xl font-semibold text-fuchsia-300">{mem.toFixed(1)}%</div>
      <div className="text-xs text-zinc-500">Memory usage</div>
    </div>
  );
}
