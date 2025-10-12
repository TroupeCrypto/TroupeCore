function ChannelCard({ channel }) {
  return (
    <article className="rounded-2xl border border-[#0f3f1b] bg-zinc-900/40 p-4">
      <div className="text-sm font-medium text-white">{channel.channel}</div>
      <div className="text-xs text-zinc-500">{channel.handle}</div>
      <div className="mt-3 flex items-end justify-between">
        <span className="text-2xl font-semibold text-white">{channel.followers}</span>
        <span className="text-xs text-[#00ff41]">{channel.delta}</span>
      </div>
    </article>
  );
}

export default function OnlinePanel({ data }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <section className="space-y-4 rounded-2xl border border-[#0f3f1b] bg-black/60 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">AI agent orchestration</h3>
          <span className="rounded-full border border-[#00ff41]/40 px-3 py-1 text-xs text-[#00ff41]">Encrypted</span>
        </div>
        <div className="space-y-3">
          {data.aiAgents.map((agent) => (
            <article key={agent.id} className="rounded-2xl border border-[#0f3f1b] bg-zinc-900/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-sm uppercase tracking-[0.2em] text-[#00ff41]/70">{agent.owner}</div>
                  <div className="text-lg font-medium text-white">{agent.name}</div>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs ${
                    agent.status === "Live"
                      ? "border-[#00ff41]/40 text-[#00ff41]"
                      : "border-amber-500/40 text-amber-300"
                  }`}
                >
                  {agent.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-400">{agent.notes}</p>
            </article>
          ))}
        </div>
      </section>
      <aside className="space-y-4 rounded-2xl border border-[#0f3f1b] bg-black/60 p-5">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00ff41]/70">Social telemetry</h4>
          <div className="mt-3 grid gap-3">
            {data.social.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00ff41]/70">GitHub velocity</h4>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            {data.github.map((repo) => (
              <li key={repo.id} className="rounded-xl border border-[#0f3f1b] bg-zinc-900/40 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">{repo.name}</span>
                  <span className="text-xs text-zinc-500">⭐ {repo.stars}</span>
                </div>
                <div className="text-xs text-zinc-500">Updated {repo.updated}</div>
                <div className="mt-1 text-xs text-[#00ff41]">{repo.status}</div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
