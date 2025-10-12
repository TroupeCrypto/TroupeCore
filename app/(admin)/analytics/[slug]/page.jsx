"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, BarChart, Bar, Tooltip, AreaChart, Area } from "recharts";
import useSWR from "swr";
const fetcher = (url) => fetch(url).then((r) => r.json());
import { DateRangePicker } from "./range";

const data = Array.from({ length: 30 }).map((_, i) => ({
  day: `Day ${i + 1}`,
  a: Math.round(100 + Math.random() * 200),
  b: Math.round(80 + Math.random() * 140),
}));

export default function AnalyticsDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const search = useSearchParams();
  const [stacked, setStacked] = useState(true);
  const { data: analytics } = useSWR("/api/analytics", fetcher);

  const title = useMemo(() => {
    return String(slug).replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  }, [slug]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-zinc-500">Fully customizable panels. Adjust queries, aggregations, grouping, and visualization.</p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangePicker />
          <button
            onClick={() => setStacked((s) => !s)}
            className="rounded-md border border-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-900"
          >
            {stacked ? "Unstack" : "Stack"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {stacked ? (
                <AreaChart data={data}>
                  <XAxis dataKey="day" stroke="#71717a" />
                  <YAxis stroke="#71717a" />
                  <Tooltip contentStyle={{ background: "#111", border: "1px solid #27272a" }} />
                  <Area type="monotone" dataKey="a" stackId="1" stroke="#22d3ee" fill="#22d3ee33" />
                  <Area type="monotone" dataKey="b" stackId="1" stroke="#8b5cf6" fill="#8b5cf633" />
                </AreaChart>
              ) : (
                <LineChart data={data}>
                  <XAxis dataKey="day" stroke="#71717a" />
                  <YAxis stroke="#71717a" />
                  <Tooltip contentStyle={{ background: "#111", border: "1px solid #27272a" }} />
                  <Line type="monotone" dataKey="a" stroke="#22d3ee" />
                  <Line type="monotone" dataKey="b" stroke="#8b5cf6" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="day" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid #27272a" }} />
                <Bar dataKey="a" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                <Bar dataKey="b" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
        <h3 className="mb-3 text-sm font-medium text-zinc-300">Query Builder (mock)</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <select className="rounded-md border border-zinc-800 bg-zinc-900 p-2 text-sm">
            <option>Sum</option>
            <option>Avg</option>
            <option>Max</option>
          </select>
          <select className="rounded-md border border-zinc-800 bg-zinc-900 p-2 text-sm">
            <option>Revenue</option>
            <option>Users</option>
            <option>Sessions</option>
          </select>
          <select className="rounded-md border border-zinc-800 bg-zinc-900 p-2 text-sm">
            <option>Group by Day</option>
            <option>Group by Week</option>
          </select>
          <button className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm hover:bg-zinc-800">
            Run
          </button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-zinc-500">
          <div>Live metrics:</div>
          <pre className="col-span-2 overflow-auto rounded-md border border-zinc-800 bg-zinc-900 p-3">{JSON.stringify(analytics?.metrics, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
