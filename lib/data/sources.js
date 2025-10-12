export class DataSource {
  constructor(id, label, fetcher) {
    this.id = id;
    this.label = label;
    this.fetcher = fetcher; // () => Promise<any>
  }
  async fetch(params) {
    return this.fetcher(params);
  }
}

export class IntegrationRegistry {
  constructor() {
    this.registry = new Map();
  }
  register(source) {
    this.registry.set(source.id, source);
  }
  get(id) {
    return this.registry.get(id);
  }
  list() {
    return Array.from(this.registry.values());
  }
}

export const coreRegistry = new IntegrationRegistry();

// Integration endpoints - configure these with your actual data sources
// Example: Connect to your analytics platform, CRM, or data warehouse
coreRegistry.register(
  new DataSource("analytics-api", "Analytics API Integration", async () => {
    const res = await fetch("/api/analytics");
    return res.json();
  })
);

coreRegistry.register(
  new DataSource("agents-api", "Agents API Integration", async () => {
    const res = await fetch("/api/agents");
    return res.json();
  })
);
