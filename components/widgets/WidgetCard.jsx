export default function WidgetCard({ title, onClick, children, footer }) {
  return (
    <div
      className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 shadow transition hover:border-zinc-700 hover:bg-zinc-900/60"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-300">{title}</h3>
        <span className="text-xs text-zinc-500 opacity-0 transition group-hover:opacity-100">Open</span>
      </div>
      <div className="flex-1">{children}</div>
      {footer ? <div className="pt-3 text-xs text-zinc-500">{footer}</div> : null}
    </div>
  );
}
