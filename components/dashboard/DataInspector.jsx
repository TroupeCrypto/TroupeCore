"use client";

import useSWR from "swr";
import { coreRegistry } from "../../lib/data/sources";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function DataInspector() {
  const { data: analytics } = useSWR("/api/analytics", fetcher);
  const { data: agents } = useSWR("/api/agents", fetcher);
  const integrations = coreRegistry.list();

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
      <div className="mb-4">
        <div className="mb-2 text-sm font-medium text-zinc-300">Integration Setup</div>
        <div className="text-xs text-zinc-500 mb-3">
          Connect your data sources to populate the dashboard. Available integration points:
        </div>
      </div>
      <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-2">
        {integrations.map((i) => (
          <div key={i.id} className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-zinc-600" />
              <div>{i.label}</div>
            </div>
            <div className="text-xs text-zinc-500">{i.id}</div>
          </div>
        ))}
      </div>
      <div className="text-xs text-zinc-500 mb-2">Current API Response Data (Empty until connected):</div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <pre className="overflow-auto rounded-md border border-zinc-800 bg-zinc-900 p-3 text-xs text-zinc-400">{JSON.stringify(analytics, null, 2)}</pre>
        <pre className="overflow-auto rounded-md border border-zinc-800 bg-zinc-900 p-3 text-xs text-zinc-400">{JSON.stringify(agents, null, 2)}</pre>
      </div>
    </div>
  );
}
