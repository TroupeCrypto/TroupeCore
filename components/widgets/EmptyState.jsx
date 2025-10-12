import Link from "next/link";

function ActionLink({ href, label, variant = "primary" }) {
  if (!href || !label) {
    return null;
  }

  const baseClasses =
    variant === "secondary"
      ? "inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-900"
      : "inline-flex items-center gap-2 rounded-md border border-indigo-500/60 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-200 transition hover:border-indigo-400 hover:bg-indigo-500/20";

  const isExternal = /^(https?:)?\/\//.test(href) || href.startsWith("mailto:");

  if (isExternal) {
    return (
      <a className={baseClasses} href={href} target="_blank" rel="noreferrer">
        {label}
      </a>
    );
  }

  return (
    <Link className={baseClasses} href={href}>
      {label}
    </Link>
  );
}

export default function EmptyState({ title, description, action, secondaryAction }) {
  return (
    <div className="space-y-3 text-left">
      {title ? <h4 className="text-sm font-semibold text-zinc-100">{title}</h4> : null}
      {description ? <p className="text-sm leading-relaxed text-zinc-400">{description}</p> : null}
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center gap-2">
          {action ? <ActionLink {...action} /> : null}
          {secondaryAction ? <ActionLink {...secondaryAction} variant="secondary" /> : null}
        </div>
      )}
    </div>
  );
}

export { ActionLink };
