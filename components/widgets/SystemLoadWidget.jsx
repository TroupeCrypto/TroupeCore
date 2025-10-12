"use client";

import { useEventSource } from "../../lib/hooks/useEventSource";

export default function SystemLoadWidget() {
  const evt = useEventSource("/api/stream");
  const load = evt?.load1m ?? 0;
  return (
    <div className="flex h-full flex-col">
      <div className="text-4xl font-semibold text-cyan-300">{load.toFixed(2)}</div>
      <div className="text-xs text-zinc-500">1m load average</div>
    </div>
  );
}
