import Link from "next/link";
import EmptyState from "../../../components/widgets/EmptyState";
import { getIntegration } from "../../../lib/data/integrations";

export const metadata = { title: "AI Agents" };

const playbooks = [
  {
    id: "lifecycle",
    title: "Lifecycle Assistant",
    summary: "Automate onboarding, QBR preparation, and renewal workflows across every customer segment.",
    integrations: ["salesforce", "slack"],
  },
  {
    id: "support",
    title: "Support Deflection",
    summary: "Blend help center content with product signals to resolve issues before they hit your queue.",
    integrations: ["zendesk", "snowflake"],
  },
  {
    id: "revenue",
    title: "Pipeline Co-Pilot",
    summary: "Guide reps through commit updates, follow-ups, and mutual action plans based on live CRM data.",
    integrations: ["salesforce", "hubspot"],
  },
];

function IntegrationPill({ id }) {
  const integration = getIntegration(id);
  if (!integration) return null;
  return (
    <Link
      href={integration.installUrl}
      className="inline-flex items-center rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300 transition hover:border-indigo-400 hover:text-indigo-200"
    >
      {integration.label}
    </Link>
  );
}

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI agents</h1>
        <p className="text-sm text-zinc-500">
          Launch production-ready agents only after your systems are connected. The tiles below outline the most
          popular playbooks.
        </p>
      </div>

      <section className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
        <EmptyState
          title="No agents are active yet"
          description="Agents require live CRM, support, and product context. Install the recommended integrations and coordinate with your Troupe solutions partner to go live."
          action={{ label: "Open integration settings", href: "/settings" }}
          secondaryAction={{ label: "Read the launch guide", href: "https://docs.troupe.ai/ai-agents" }}
        />
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {playbooks.map((playbook) => (
          <article key={playbook.id} className="flex h-full flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
            <div className="space-y-2">
              <div className="text-lg font-medium text-zinc-100">{playbook.title}</div>
              <p className="text-sm leading-relaxed text-zinc-500">{playbook.summary}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {playbook.integrations.map((integrationId) => (
                <IntegrationPill key={integrationId} id={integrationId} />
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
