export class IntegrationDefinition {
  constructor({ id, label, description, category, installUrl, documentationUrl }) {
    this.id = id;
    this.label = label;
    this.description = description;
    this.category = category;
    this.installUrl = installUrl;
    this.documentationUrl = documentationUrl;
  }
}

export class IntegrationRegistry {
  constructor() {
    this.registry = new Map();
  }

  register(definition) {
    this.registry.set(definition.id, definition);
    return this;
  }

  get(id) {
    return this.registry.get(id);
  }

  list() {
    return Array.from(this.registry.values());
  }
}

export const coreRegistry = new IntegrationRegistry();

const definitions = [
  {
    id: "github-auth",
    label: "GitHub OAuth",
    category: "Authentication",
    description: "Secure sign-in with GitHub using state validation and server-only sessions.",
    installUrl: "/api/auth/github/login",
    documentationUrl: "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps",
  },
  {
    id: "google-auth",
    label: "Google OAuth",
    category: "Authentication",
    description: "Secure sign-in with Google using state validation and server-only sessions.",
    installUrl: "/api/auth/google/login",
    documentationUrl: "https://developers.google.com/identity/protocols/oauth2",
  },
  {
    id: "stripe",
    label: "Stripe Billing",
    category: "Revenue",
    description: "Synchronize subscriptions, invoices, and payment events from Stripe.",
    installUrl: "/settings?install=stripe",
    documentationUrl: "https://docs.troupe.ai/integrations/stripe",
  },
  {
    id: "salesforce",
    label: "Salesforce",
    category: "CRM",
    description: "Mirror accounts, opportunities, and pipeline stages in real time.",
    installUrl: "/settings?install=salesforce",
    documentationUrl: "https://docs.troupe.ai/integrations/salesforce",
  },
  {
    id: "hubspot",
    label: "HubSpot Marketing Hub",
    category: "Marketing",
    description: "Bring campaign attribution and lifecycle stages into Troupe.",
    installUrl: "/settings?install=hubspot",
    documentationUrl: "https://docs.troupe.ai/integrations/hubspot",
  },
  {
    id: "zendesk",
    label: "Zendesk Support",
    category: "Support",
    description: "Expose ticket backlog, CSAT, and resolution metrics across dashboards.",
    installUrl: "/settings?install=zendesk",
    documentationUrl: "https://docs.troupe.ai/integrations/zendesk",
  },
  {
    id: "snowflake",
    label: "Snowflake",
    category: "Data Warehouse",
    description: "Query governed datasets directly from your warehouse without copies.",
    installUrl: "/settings?install=snowflake",
    documentationUrl: "https://docs.troupe.ai/integrations/snowflake",
  },
  {
    id: "google-ads",
    label: "Google Ads",
    category: "Acquisition",
    description: "Measure paid spend against pipeline, bookings, and retention.",
    installUrl: "/settings?install=google-ads",
    documentationUrl: "https://docs.troupe.ai/integrations/google-ads",
  },
  {
    id: "slack",
    label: "Slack",
    category: "Collaboration",
    description: "Push alerts and orchestrate workflows directly in team channels.",
    installUrl: "/settings?install=slack",
    documentationUrl: "https://docs.troupe.ai/integrations/slack",
  },
  {
    id: "ingestion-api",
    label: "Troupe Ingestion API",
    category: "Developer",
    description: "Stream any custom dataset using our ingestion API and schema tooling.",
    installUrl: "https://docs.troupe.ai/ingestion-api",
    documentationUrl: "https://docs.troupe.ai/ingestion-api",
  },
];

definitions.forEach((definition) => {
  coreRegistry.register(new IntegrationDefinition(definition));
});

export function getIntegration(id) {
  return coreRegistry.get(id);
}
