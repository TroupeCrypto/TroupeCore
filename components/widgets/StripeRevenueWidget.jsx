"use client";

import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function StripeRevenueWidget() {
  const { data } = useSWR("/api/analytics", fetcher);
  const value = data?.metrics?.revenue ?? 0;
  return (
    <div className="flex h-full flex-col">
      <div className="text-4xl font-semibold text-emerald-300">${value.toLocaleString()}</div>
      <div className="text-xs text-zinc-500">Revenue (24h)</div>
    </div>
  );
}
