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

coreRegistry.register(
  new DataSource("mock-analytics", "Mock Analytics API", async () => {
    const res = await fetch("/api/analytics");
    return res.json();
  })
);

coreRegistry.register(
  new DataSource("mock-agents", "Mock Agents API", async () => {
    const res = await fetch("/api/agents");
    return res.json();
  })
);
