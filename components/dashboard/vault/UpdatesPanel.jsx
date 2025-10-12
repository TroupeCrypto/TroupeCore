const severityStyles = {
  low: "text-[#00ff41] border-[#00ff41]/40",
  medium: "text-amber-300 border-amber-500/40",
  high: "text-rose-400 border-rose-500/40",
};

export default function UpdatesPanel({ items }) {
  return (
    <div className="space-y-4">
      {items.map((item) => {
        const severityClass = severityStyles[item.severity] ?? severityStyles.low;
        return (
          <article
            key={item.id}
            className="rounded-2xl border border-[#0f3f1b] bg-black/60 p-5 transition hover:border-[#00ff41]/40"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${severityClass}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
                    {item.severity.toUpperCase()}
                  </span>
                  <span className="text-zinc-500">{item.timestamp}</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">{item.detail}</p>
              </div>
              <div className="rounded-xl border border-[#0f3f1b] bg-zinc-900/40 px-3 py-2 text-xs text-zinc-400">
                <div className="font-semibold text-[#00ff41]">{item.status}</div>
                <div>{item.recommendedAction}</div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-500">
              {item.owners.map((owner) => (
                <span key={owner} className="rounded-full border border-zinc-800 px-2 py-0.5">
                  {owner}
                </span>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
