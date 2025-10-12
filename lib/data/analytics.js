export const analyticsCatalog = [
  {
    slug: "revenue",
    title: "Revenue Intelligence",
    summary: "Understand ARR, MRR, and forecast accuracy the moment billing data is connected.",
    description:
      "Centralize subscription, invoice, and opportunity data to unblock accurate forecasting and renewal planning.",
    integrations: ["stripe", "salesforce"],
    highlights: [
      "MRR and ARR cohort analysis with configurable segmentation",
      "Forecast pacing against committed and best-case opportunities",
      "Renewal and expansion alerts based on product usage and health",
    ],
  },
  {
    slug: "customer-360",
    title: "Customer 360",
    summary: "Blend CRM, product, and support context for every account in one place.",
    description:
      "Bring together account metadata, product usage, and open initiatives to build a true 360° view of every customer.",
    integrations: ["salesforce", "snowflake", "zendesk"],
    highlights: [
      "Executive health score that combines sentiment, adoption, and commercial risk",
      "Playbooks triggered from usage drops or unassigned tickets",
      "Automated QBR packages that pull the latest insights per account",
    ],
  },
  {
    slug: "support-health",
    title: "Support Health",
    summary: "Expose backlog, CSAT, and deflection signals across every queue.",
    description:
      "Unify support telemetry so you can spot staffing needs, knowledge gaps, and opportunities to automate.",
    integrations: ["zendesk", "slack"],
    highlights: [
      "Queue backlog against staffing plans with alerting thresholds",
      "CSAT and sentiment trends grouped by channel and product area",
      "Self-serve deflection metrics tied to AI agent responses",
    ],
  },
  {
    slug: "marketing-attribution",
    title: "Marketing Attribution",
    summary: "Connect campaign spend to pipeline and bookings without manual spreadsheets.",
    description:
      "Combine ad spend with CRM outcomes to show which channels generate durable revenue.",
    integrations: ["google-ads", "hubspot", "salesforce"],
    highlights: [
      "Multi-touch attribution by segment, channel, and campaign",
      "Pipeline velocity from first touch through closed-won",
      "Spend efficiency alerts based on CAC payback windows",
    ],
  },
  {
    slug: "product-signals",
    title: "Product Signals",
    summary: "Visualize activation, adoption, and retention events directly from your warehouse.",
    description:
      "Bring warehouse data into Troupe to monitor product usage trends that drive revenue growth.",
    integrations: ["snowflake", "ingestion-api"],
    highlights: [
      "Activation funnels with conversion alerts by cohort",
      "Usage-based expansion indicators tied to billing plans",
      "Feature adoption dashboards that correlate with retention",
    ],
  },
  {
    slug: "agent-telemetry",
    title: "AI Agent Telemetry",
    summary: "Measure the revenue and efficiency impact of every deployed agent.",
    description:
      "Audit agent coverage, response accuracy, and downstream revenue influence without exporting CSVs.",
    integrations: ["slack", "salesforce", "zendesk"],
    highlights: [
      "ROI tracking that ties agent actions to ARR and NRR",
      "Quality review workflows with human-in-the-loop approvals",
      "Adoption leaderboards across teams and markets",
    ],
  },
];

export function getAnalyticsDefinition(slug) {
  return analyticsCatalog.find((item) => item.slug === slug);
}
