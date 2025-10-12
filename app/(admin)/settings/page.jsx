"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";

export default function SettingsPage() {
  const [clickhouseUrl, setClickhouseUrl] = useState("");
  const [pgUrl, setPgUrl] = useState("");
  const [stripeKey, setStripeKey] = useState("");

  const save = async () => {
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clickhouseUrl, pgUrl, stripeKey }),
    });
    alert("Saved (mock)");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-zinc-500">Connect data sources for live analytics.</p>
      </div>
      <Card>
        <CardHeader>
          <div className="text-sm font-medium text-zinc-300">Databases</div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-xs text-zinc-500">ClickHouse URL</div>
            <input value={clickhouseUrl} onChange={(e) => setClickhouseUrl(e.target.value)} className="w-full border border-zinc-800 bg-zinc-900 p-2" />
          </div>
          <div>
            <div className="text-xs text-zinc-500">Postgres URL</div>
            <input value={pgUrl} onChange={(e) => setPgUrl(e.target.value)} className="w-full border border-zinc-800 bg-zinc-900 p-2" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="text-sm font-medium text-zinc-300">Stripe</div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="text-xs text-zinc-500">Stripe Secret Key</div>
            <input value={stripeKey} onChange={(e) => setStripeKey(e.target.value)} className="w-full border border-zinc-800 bg-zinc-900 p-2" />
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={save}>Save</Button>
      </div>
    </div>
  );
}
