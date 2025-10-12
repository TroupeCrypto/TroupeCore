import Link from "next/link";
import { notFound } from "next/navigation";
import EmptyState from "../../../../components/widgets/EmptyState";
import { analyticsCatalog, getAnalyticsDefinition } from "../../../../lib/data/analytics";
import { coreRegistry, getIntegration } from "../../../../lib/data/integrations";

export function generateStaticParams() {
  return analyticsCatalog.map((item) => ({ slug: item.slug }));
}

export default function AnalyticsDetail({ params }) {
  const definition = getAnalyticsDefinition(params.slug);

  if (!definition) {
    notFound();
  }

  const integrations = definition.integrations
    .map((id) => getIntegration(id))
    .filter(Boolean);

  const ingestion = coreRegistry.get("ingestion-api");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{definition.title}</h1>
        <p className="text-sm leading-relaxed text-zinc-500">{definition.description}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <h2 className="text-sm font-semibold text-zinc-200">Signals we calculate</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-400">
            {definition.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
          <h2 className="text-sm font-semibold text-zinc-200">Connect the right systems</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500">
            Troupe only renders live production data. Install the integrations below to activate this view and backfill
            your history.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {integrations.map((integration) => (
              <Link
                key={integration.id}
                href={integration.installUrl}
                className="inline-flex items-center gap-2 rounded-full border border-indigo-500/60 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-200 transition hover:border-indigo-400 hover:bg-indigo-500/20"
              >
                Install {integration.label}
              </Link>
            ))}
          </div>
          {ingestion ? (
            <p className="mt-4 text-xs text-zinc-500">
              Prefer to use your warehouse or lake?{' '}
              <Link href={ingestion.installUrl} className="text-indigo-300 hover:text-indigo-200">
                Review the ingestion API.
              </Link>
            </p>
          ) : null}
        </section>
      </div>

      <section className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
        <EmptyState
          title="Data pending"
          description="As soon as the connectors above are authorized we will backfill twenty-four months of history and keep everything streaming in real time."
          action={{ label: "Open integration settings", href: "/settings" }}
          secondaryAction={{ label: "Return to library", href: "/analytics" }}
        />
      </section>
    </div>
  );
}
