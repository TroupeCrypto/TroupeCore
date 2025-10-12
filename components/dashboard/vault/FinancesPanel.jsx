function AuditRow({ item }) {
  return (
    <li className="flex items-center justify-between rounded-xl border border-[#0f3f1b] bg-zinc-900/40 px-4 py-3 text-sm text-zinc-300">
      <div>
        <div className="font-medium text-white">{item.event}</div>
        <div className="text-xs text-zinc-500">{item.detail}</div>
      </div>
      <span className="rounded-full border border-[#00ff41]/40 px-2 py-0.5 text-xs text-[#00ff41]">{item.status}</span>
    </li>
  );
}

export default function FinancesPanel({ data }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
      <section className="space-y-5 rounded-2xl border border-[#0f3f1b] bg-black/60 p-5">
        <header className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#0f3f1b] bg-zinc-900/40 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-[#00ff41]/70">Total AUM</div>
            <div className="mt-2 text-2xl font-semibold text-white">{data.overview.totalAUM}</div>
            <div className="text-xs text-[#00ff41]">{data.overview.dailyChange} today</div>
          </div>
          <div className="rounded-2xl border border-[#0f3f1b] bg-zinc-900/40 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-[#00ff41]/70">Secure reserves</div>
            <div className="mt-2 text-2xl font-semibold text-white">{data.overview.secureReserves}</div>
            <div className="text-xs text-zinc-500">FDIC-backed</div>
          </div>
          <div className="rounded-2xl border border-[#0f3f1b] bg-zinc-900/40 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-[#00ff41]/70">Runway</div>
            <div className="mt-2 text-2xl font-semibold text-white">{data.overview.runRate}</div>
            <div className="text-xs text-zinc-500">Projected</div>
          </div>
          <div className="rounded-2xl border border-[#0f3f1b] bg-zinc-900/40 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-[#00ff41]/70">Encryption</div>
            <div className="mt-2 text-2xl font-semibold text-white">AES-256</div>
            <div className="text-xs text-zinc-500">Ledger secured</div>
          </div>
        </header>
        <div className="space-y-3">
          {data.categories.map((category) => (
            <article key={category.id} className="rounded-2xl border border-[#0f3f1b] bg-zinc-900/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white">
                <div className="text-lg font-medium">{category.label}</div>
                <div className="flex items-center gap-3 text-xs text-zinc-500">
                  <span>{category.allocation} allocation</span>
                  <span>{category.change}</span>
                </div>
              </div>
              <div className="mt-1 text-sm text-[#00ff41]">{category.balance}</div>
              <ul className="mt-3 grid gap-2 text-xs text-zinc-400 sm:grid-cols-2">
                {category.accounts.map((account) => (
                  <li key={account.label} className="rounded-lg border border-[#0f3f1b] bg-black/40 p-3">
                    <div className="text-sm text-white">{account.label}</div>
                    <div className="text-xs text-zinc-500">{account.balance}</div>
                    <div className="mt-1 text-xs text-[#00ff41]">{account.insured ? "Insured" : "Uninsured"}</div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <aside className="space-y-4 rounded-2xl border border-[#0f3f1b] bg-black/60 p-5">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00ff41]/70">Audit trail</h4>
          <ul className="mt-3 space-y-2">
            {data.auditTrail.map((item) => (
              <AuditRow key={item.id} item={item} />
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-[#0f3f1b] bg-zinc-900/40 p-4 text-sm text-zinc-300">
          <div className="text-xs uppercase tracking-[0.2em] text-[#00ff41]/70">Compliance</div>
          <p className="mt-2 text-sm text-zinc-400">
            SOC 2 Type II attestation complete. Multi-sig treasury actions require biometric signatures from Finance + Ops.
          </p>
        </div>
      </aside>
    </div>
  );
}
