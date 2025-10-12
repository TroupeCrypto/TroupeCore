import { coreRegistry } from "../../lib/data/integrations";
import EmptyState, { ActionLink } from "../widgets/EmptyState";

export default function DataInspector() {
  const integrations = coreRegistry.list();

  return (
    <div className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
      <div className="space-y-2">
        <div className="text-sm font-semibold text-zinc-200">Connect your stack</div>
        <p className="text-sm leading-relaxed text-zinc-500">
          Troupe does not ship with sample dashboards. Install the integrations below to stream production
          data into every workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {integrations.map((integration) => (
          <article
            key={integration.id}
            className="flex h-full flex-col justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-3"
          >
            <div className="space-y-1.5">
              <div className="text-sm font-medium text-zinc-100">{integration.label}</div>
              <p className="text-xs leading-relaxed text-zinc-500">{integration.description}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>{integration.category}</span>
              <ActionLink href={integration.installUrl} label="Install" />
            </div>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
          <EmptyState
            title="Analytics library"
            description="Once connectors are live, dashboards backfill two years of history and refresh continuously."
            action={{ label: "Browse templates", href: "/analytics" }}
            secondaryAction={{ label: "Integration settings", href: "/settings" }}
          />
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
          <EmptyState
            title="AI agents"
            description="Agents rely on live CRM, support, and product usage data. Connect those systems to unlock activation."
            action={{ label: "Set up agents", href: "/agents" }}
            secondaryAction={{ label: "View docs", href: "https://docs.troupe.ai/ai-agents" }}
          />
        </div>
      </div>
    </div>
  );
}
