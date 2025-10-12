function StatusBadge({ label, tone = "default" }) {
  const styles = {
    default: "border-zinc-700 text-zinc-400",
    ready: "border-[#00ff41]/40 text-[#00ff41]",
    pending: "border-amber-500/40 text-amber-300",
  };
  return <span className={`rounded-full border px-2 py-0.5 text-xs ${styles[tone] ?? styles.default}`}>{label}</span>;
}

export default function CodePanel({ data }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <section className="space-y-4 rounded-2xl border border-[#0f3f1b] bg-black/60 p-5">
        <h3 className="text-lg font-semibold text-white">Snippets & integrations</h3>
        <div className="grid gap-3 lg:grid-cols-2">
          {data.snippets.map((snippet) => (
            <article key={snippet.id} className="rounded-2xl border border-[#0f3f1b] bg-zinc-900/40 p-4">
              <div className="text-sm uppercase tracking-[0.2em] text-[#00ff41]/60">{snippet.language}</div>
              <div className="mt-2 text-lg font-medium text-white">{snippet.name}</div>
              <p className="mt-2 text-sm text-zinc-400">{snippet.description}</p>
              <div className="mt-3 text-xs text-zinc-500">{snippet.path}</div>
            </article>
          ))}
          {data.integrations.map((integration) => (
            <article key={integration.id} className="rounded-2xl border border-[#0f3f1b] bg-zinc-900/40 p-4">
              <div className="flex items-center justify-between text-sm text-white">
                <span>{integration.name}</span>
                <StatusBadge
                  label={integration.status}
                  tone={integration.status === "Ready" ? "ready" : "pending"}
                />
              </div>
              <div className="mt-1 text-xs text-zinc-500">{integration.type}</div>
              <div className="mt-2 text-xs text-zinc-400">Last deployed {integration.lastDeployed}</div>
            </article>
          ))}
        </div>
      </section>
      <aside className="space-y-4 rounded-2xl border border-[#0f3f1b] bg-black/60 p-5">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00ff41]/70">Data infrastructure</h4>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            {data.databases.map((db) => (
              <li key={db.id} className="rounded-xl border border-[#0f3f1b] bg-zinc-900/40 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{db.name}</span>
                  <StatusBadge label={db.status} tone={db.status === "Healthy" ? "ready" : "pending"} />
                </div>
                <div className="text-xs text-zinc-500">{db.engine}</div>
                <div className="text-xs text-zinc-500">{db.role}</div>
                <div className="mt-1 text-xs text-[#00ff41]">{db.encryption ? "Encrypted" : "Unencrypted"}</div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00ff41]/70">Cloud footprint</h4>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            {data.cloud.map((cloud) => (
              <li key={cloud.id} className="rounded-xl border border-[#0f3f1b] bg-zinc-900/40 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{cloud.provider}</span>
                  <StatusBadge label={cloud.status} tone="ready" />
                </div>
                <div className="text-xs text-zinc-500">{cloud.account}</div>
                <div className="mt-1 text-xs text-zinc-400">{cloud.regions.join(" · ")}</div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
