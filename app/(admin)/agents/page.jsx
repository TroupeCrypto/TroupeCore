export const metadata = { title: "AI Agents" };

const agents = [
  { id: "sales", name: "Sales Agent", status: "online", skills: ["Leads", "Outbound"], mrrImpact: 34 },
  { id: "support", name: "Support Agent", status: "online", skills: ["Tickets", "FAQ"], mrrImpact: 12 },
  { id: "revops", name: "RevOps Agent", status: "idle", skills: ["Forecast", "Churn"], mrrImpact: 18 },
];

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Agents</h1>
        <p className="text-sm text-zinc-500">Roster, capabilities, and live performance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((a) => (
          <div key={a.id} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-medium">{a.name}</div>
                <div className="text-xs text-zinc-500">{a.status}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-zinc-400">MRR impact</div>
                <div className="text-xl font-semibold">+{a.mrrImpact}%</div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {a.skills.map((s) => (
                <span key={s} className="rounded-md border border-zinc-800 px-2 py-1 text-xs text-zinc-400">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button className="rounded-md border border-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-900">Configure</button>
              <button className="rounded-md border border-zinc-800 px-3 py-1.5 text-sm hover:bg-zinc-900">Open Analytics</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
