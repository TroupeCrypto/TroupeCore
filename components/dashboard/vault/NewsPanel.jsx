export default function NewsPanel({ items }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => {
        const relevance = Math.round(item.relevance * 100);
        return (
          <article
            key={item.id}
            className="flex h-full flex-col justify-between rounded-2xl border border-[#0f3f1b] bg-black/60 p-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>{item.source}</span>
                <span>{item.publishedAt}</span>
              </div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{item.summary}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#00ff41]/40 px-2 py-1 text-[#00ff41]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Relevance</span>
                <span className="font-semibold text-[#00ff41]">{relevance}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-zinc-900">
                <div className="h-full rounded-full bg-[#00ff41]" style={{ width: `${relevance}%` }} />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
