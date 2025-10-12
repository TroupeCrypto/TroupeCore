import Link from "next/link";
import { coreRegistry } from "../../../lib/data/integrations";

export const metadata = { title: "Settings" };

export default function SettingsPage({ searchParams }) {
  const selected = searchParams?.install;
  const integrations = coreRegistry.list();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Integration settings</h1>
        <p className="text-sm text-zinc-500">
          Authorize connectors from here. Every button opens the production installer—no mock flows are provided.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {integrations.map((integration) => {
          const isSelected = integration.id === selected;
          return (
            <article
              key={integration.id}
              className={`flex h-full flex-col justify-between rounded-xl border bg-zinc-950/60 p-4 transition ${
                isSelected ? "border-indigo-500" : "border-zinc-800"
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold text-zinc-100">{integration.label}</div>
                    <p className="text-sm leading-relaxed text-zinc-500">{integration.description}</p>
                  </div>
                  <span className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">
                    {integration.category}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <InstallLink integration={integration} />
                {integration.documentationUrl ? (
                  <a
                    href={integration.documentationUrl}
                    className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View documentation
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function InstallLink({ integration }) {
  if (!integration?.installUrl) {
    return null;
  }

  const isExternal = /^(https?:)?\/\//.test(integration.installUrl);

  const className =
    "inline-flex items-center gap-2 rounded-md border border-indigo-500/60 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-200 transition hover:border-indigo-400 hover:bg-indigo-500/20";

  if (isExternal) {
    return (
      <a href={integration.installUrl} className={className} target="_blank" rel="noreferrer">
        Install connector
      </a>
    );
  }

  return (
    <Link href={integration.installUrl} className={className}>
      Install connector
    </Link>
  );
}
