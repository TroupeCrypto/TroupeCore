export default function ContactsPanel({ data }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <section className="space-y-4 rounded-2xl border border-[#0f3f1b] bg-black/60 p-5 lg:col-span-2">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">Featured relationship</h3>
            <p className="text-sm text-zinc-500">High-signal partner prioritized for TTM autograph.</p>
          </div>
          <div className="rounded-full border border-[#00ff41]/40 px-4 py-1 text-xs text-[#00ff41]">
            Progress {data.featured.autographProgress}%
          </div>
        </header>
        <div className="rounded-2xl border border-[#0f3f1b] bg-zinc-900/40 p-5">
          <div className="text-xl font-semibold text-white">{data.featured.name}</div>
          <div className="text-sm text-zinc-400">{data.featured.role}</div>
          <div className="mt-3 grid gap-2 text-sm text-zinc-300 sm:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-[0.15em] text-[#00ff41]/70">Relationship</div>
              <p className="mt-1 text-zinc-400">{data.featured.relationship}</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.15em] text-[#00ff41]/70">Last interaction</div>
              <p className="mt-1 text-zinc-400">{data.featured.lastInteraction}</p>
            </div>
          </div>
          <div className="mt-4 text-xs text-[#00ff41]">{data.featured.email}</div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00ff41]/70">Network radar</h4>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {data.network.map((contact) => (
              <article key={contact.id} className="rounded-2xl border border-[#0f3f1b] bg-zinc-900/40 p-4">
                <div className="text-lg font-medium text-white">{contact.name}</div>
                <div className="text-sm text-zinc-400">{contact.title}</div>
                <div className="mt-2 text-xs text-zinc-500">{contact.company}</div>
                <div className="mt-2 text-xs text-[#00ff41]">{contact.email}</div>
                <div className="mt-3 text-xs text-zinc-400">{contact.status}</div>
                <div className="text-xs text-zinc-500">Active {contact.lastSeen}</div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <aside className="space-y-4 rounded-2xl border border-[#0f3f1b] bg-black/60 p-5">
        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00ff41]/70">Autograph queue</h4>
        <ul className="space-y-3 text-sm text-zinc-300">
          {data.autographQueue.map((item) => (
            <li key={item.id} className="rounded-xl border border-[#0f3f1b] bg-zinc-900/40 p-3">
              <div className="font-medium text-white">{item.name}</div>
              <div className="text-xs text-zinc-500">{item.company}</div>
              <div className="mt-1 text-xs text-zinc-400">{item.stage}</div>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
