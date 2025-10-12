import Link from "next/link";
import { analyticsCatalog } from "../../../lib/data/analytics";
import { getIntegration } from "../../../lib/data/integrations";

export default function AnalyticsIndex() {
  const items = analyticsCatalog.map((item) => {
    const required = item.integrations
      .map((id) => getIntegration(id)?.label)
      .filter(Boolean)
      .join(", ");
    return { ...item, required };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics library</h1>
        <p className="text-sm text-zinc-500">
          Choose a template to activate once the required integrations are installed. Every view renders production
          data—there are no mock dashboards.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <Link key={i.slug} href={`/analytics/${i.slug}`} className="rounded-lg border border-zinc-800 p-4 hover:bg-zinc-900">
            <div className="text-lg font-medium">{i.title}</div>
            <p className="mt-1 text-sm leading-relaxed text-zinc-500">{i.summary}</p>
            {i.required ? (
              <div className="mt-3 text-xs text-zinc-500">Requires: {i.required}</div>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
