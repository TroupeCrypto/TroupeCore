import { coreRegistry, getIntegration } from "../../lib/data/integrations";
import WidgetCard from "../widgets/WidgetCard";
import EmptyState from "../widgets/EmptyState";

const widgets = [
  {
    id: "revenue",
    title: "Revenue Intelligence",
    description: "Track ARR, MRR, and forecast health once billing data is connected.",
    primaryIntegration: "stripe",
    secondaryIntegration: "salesforce",
  },
  {
    id: "customer-360",
    title: "Customer 360",
    description: "Blend CRM accounts with product usage to uncover expansion moments.",
    primaryIntegration: "salesforce",
    secondaryIntegration: "snowflake",
  },
  {
    id: "support-health",
    title: "Support Health",
    description: "Surface backlog, CSAT, and deflection trends across every queue.",
    primaryIntegration: "zendesk",
    secondaryIntegration: "slack",
  },
  {
    id: "marketing-attribution",
    title: "Marketing Attribution",
    description: "Connect spend to pipeline, bookings, and retention outcomes.",
    primaryIntegration: "google-ads",
    secondaryIntegration: "hubspot",
  },
  {
    id: "product-signals",
    title: "Product Signals",
    description: "Pipe warehouse events to understand adoption and activation cohorts.",
    primaryIntegration: "snowflake",
    secondaryIntegration: "ingestion-api",
  },
  {
    id: "agent-telemetry",
    title: "AI Agent Telemetry",
    description: "Measure how every agent impacts ARR, NRR, and customer sentiment.",
    primaryIntegration: "slack",
    secondaryIntegration: "salesforce",
  },
];

function buildAction(id) {
  const integration = id ? getIntegration(id) : null;
  if (!integration) {
    return null;
  }
  return {
    label: `Install ${integration.label}`,
    href: integration.installUrl,
  };
}

export default function DashboardGrid() {
  const integrations = coreRegistry.list();
  const hasIntegrations = integrations.length > 0;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {widgets.map((widget) => {
        const primary = buildAction(widget.primaryIntegration);
        const secondary = buildAction(widget.secondaryIntegration);
        return (
          <WidgetCard key={widget.id} title={widget.title}>
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-zinc-400">{widget.description}</p>
              <EmptyState
                description={
                  hasIntegrations
                    ? "Data will begin streaming within minutes of installing the required connectors."
                    : "No integrations are currently connected. Choose an installer below to activate this view."
                }
                action={primary}
                secondaryAction={secondary}
              />
            </div>
          </WidgetCard>
        );
      })}
    </div>
  );
}
