export const newsItems = [
  {
    id: "news-1",
    title: "Series B investors accelerate capital deployment in applied AI",
    summary:
      "Multiple firms signaled new allocations for autonomous operations platforms, indicating higher appetite for Vault's workflow intelligence stack.",
    source: "AI Venture Bulletin",
    publishedAt: "2h ago",
    relevance: 0.92,
    tags: ["Funding", "AI", "Market"],
  },
  {
    id: "news-2",
    title: "Enterprise CFOs increase cybersecurity budgets ahead of FY25 planning",
    summary:
      "Annual surveys show 37% budget growth for zero-trust and audit-ready automation, aligning with Vault's encrypted operations tooling.",
    source: "SecureOps Review",
    publishedAt: "5h ago",
    relevance: 0.88,
    tags: ["Security", "Budget", "Enterprise"],
  },
  {
    id: "news-3",
    title: "Global logistics consortium standardizes on verifiable supply telemetry",
    summary:
      "Consortium adoption of unified telemetry protocols creates opportunity for Vault's real-time compliance dashboards.",
    source: "LogiTech Wire",
    publishedAt: "Yesterday",
    relevance: 0.81,
    tags: ["Logistics", "Compliance"],
  },
];

export const updateItems = [
  {
    id: "update-1",
    title: "Telemetry ingestion stabilized",
    severity: "low",
    status: "Operational",
    detail:
      "Ingestion nodes auto-balanced after overnight spike. No customer impact recorded. Monitoring interval tightened to 5 minutes.",
    owners: ["Observability"],
    timestamp: "08:15 UTC",
    recommendedAction: "No action required",
  },
  {
    id: "update-2",
    title: "Admin SSO certificate rotation",
    severity: "medium",
    status: "In progress",
    detail:
      "Okta-issued signing cert expires in 6 days. Replacement staged in secrets manager and pending deploy to production edge.",
    owners: ["Identity", "Security"],
    timestamp: "07:40 UTC",
    recommendedAction: "Schedule off-peak release window",
  },
  {
    id: "update-3",
    title: "AI summarization latency regression",
    severity: "high",
    status: "Investigation",
    detail:
      "Latency increased to 1.8s p95 after upstream model upgrade. Rollback plan prepared; on-call coordinating with OpenAI partner team.",
    owners: ["Applied AI"],
    timestamp: "06:55 UTC",
    recommendedAction: "Monitor incident channel",
  },
];

export const profileData = {
  name: "Morgan Lane",
  title: "Founder & Systems Architect",
  email: "morgan@vault.systems",
  phone: "+1 (415) 555-4816",
  session: {
    status: "Verified",
    device: "Mac Studio · San Francisco",
    expiresIn: "45 min",
  },
  security: {
    encryption: "AES-256 at rest",
    database: "PostgreSQL · us-west-2",
    backups: "Immutable snapshots · 15 min cadence",
  },
  documents: [
    { id: "doc-1", label: "Zero Trust Rollout", updated: "12 Sep", sensitivity: "Confidential" },
    { id: "doc-2", label: "Investor Readiness Packet", updated: "10 Sep", sensitivity: "Restricted" },
    { id: "doc-3", label: "Vault Architecture", updated: "08 Sep", sensitivity: "Internal" },
  ],
  credentials: [
    { id: "cred-1", label: "Root Vault Password", rotation: "Rotated 18h ago", encrypted: true },
    { id: "cred-2", label: "Cloudflare API Token", rotation: "Rotated 3d ago", encrypted: true },
    { id: "cred-3", label: "Design Ops Shared Key", rotation: "Pending rotation", encrypted: false },
  ],
  quickLinks: [
    { id: "ql-1", label: "Data residency controls", href: "/settings#residency" },
    { id: "ql-2", label: "Security audit trail", href: "/settings#audit" },
    { id: "ql-3", label: "Workflow automations", href: "/agents" },
  ],
};

export const contactData = {
  featured: {
    name: "Avery Kim",
    role: "COO · Helix Systems",
    email: "avery.kim@helixsystems.com",
    relationship: "Strategic design partner",
    lastInteraction: "Design review · 1d ago",
    autographProgress: 78,
  },
  network: [
    {
      id: "contact-1",
      name: "Priya Desai",
      company: "Northwind Logistics",
      title: "VP Innovation",
      email: "priya.desai@northwind.io",
      status: "Pilot expansion",
      lastSeen: "3h ago",
    },
    {
      id: "contact-2",
      name: "Leo Martinez",
      company: "Summit Capital",
      title: "General Partner",
      email: "leo@summitcap.vc",
      status: "Due diligence",
      lastSeen: "Yesterday",
    },
    {
      id: "contact-3",
      name: "Amina Diallo",
      company: "Atlas Manufacturing",
      title: "Head of Digital",
      email: "amina.diallo@atlasmfgr.com",
      status: "Integration scoping",
      lastSeen: "2d ago",
    },
    {
      id: "contact-4",
      name: "Jonah Reyes",
      company: "Vector Commerce",
      title: "CTO",
      email: "jonah@vectorcommerce.com",
      status: "Contract sent",
      lastSeen: "4d ago",
    },
  ],
  autographQueue: [
    { id: "queue-1", name: "Sasha Patel", company: "Orbit Labs", stage: "Awaiting materials" },
    { id: "queue-2", name: "Mara Osei", company: "Cinder Retail", stage: "Pitch scheduled" },
    { id: "queue-3", name: "Dylan Park", company: "Vertex AI", stage: "Discovery in progress" },
  ],
};

export const codeData = {
  snippets: [
    {
      id: "snippet-1",
      name: "Vault Session Guard",
      language: "TypeScript",
      description: "Middleware enforcing device fingerprint checks for privileged routes.",
      path: "apps/dashboard/middleware/session-guard.ts",
    },
    {
      id: "snippet-2",
      name: "Encrypted Secrets Client",
      language: "Python",
      description: "Client helper that decrypts KMS payloads for AI agent runbooks.",
      path: "python/agents/secrets.py",
    },
  ],
  integrations: [
    {
      id: "integration-1",
      name: "Helix ERP",
      type: "Webhook",
      status: "Ready",
      lastDeployed: "Sep 11",
    },
    {
      id: "integration-2",
      name: "Northwind Warehouse",
      type: "Snowflake external table",
      status: "Pending QA",
      lastDeployed: "Sep 8",
    },
  ],
  databases: [
    {
      id: "db-1",
      name: "vault_core",
      engine: "PostgreSQL 15",
      role: "Primary",
      status: "Healthy",
      encryption: true,
    },
    {
      id: "db-2",
      name: "vault_analytics",
      engine: "BigQuery",
      role: "Telemetry lake",
      status: "Syncing",
      encryption: true,
    },
  ],
  cloud: [
    {
      id: "cloud-1",
      provider: "AWS",
      account: "prod-vault",
      status: "Verified",
      regions: ["us-west-2", "us-east-1"],
    },
    {
      id: "cloud-2",
      provider: "Cloudflare",
      account: "edge-zero-trust",
      status: "Verified",
      regions: ["global"],
    },
  ],
};

export const onlineData = {
  aiAgents: [
    {
      id: "agent-1",
      name: "Signal Sentry",
      owner: "Applied AI",
      status: "Training",
      notes: "Awaiting warehouse sync for anomaly baseline.",
    },
    {
      id: "agent-2",
      name: "Flux Concierge",
      owner: "Growth Ops",
      status: "Live",
      notes: "Handling inbound partner requests with 96% satisfaction.",
    },
  ],
  social: [
    { id: "social-1", channel: "X", handle: "@vaultsystems", followers: "14.2k", delta: "+420" },
    { id: "social-2", channel: "LinkedIn", handle: "Vault Systems", followers: "8.9k", delta: "+310" },
    { id: "social-3", channel: "YouTube", handle: "Vault Lab", followers: "3.4k", delta: "+95" },
  ],
  github: [
    { id: "repo-1", name: "vault-dashboard", stars: 212, updated: "3h ago", status: "Active" },
    { id: "repo-2", name: "vault-ai-agents", stars: 154, updated: "1d ago", status: "Releasing" },
    { id: "repo-3", name: "vault-cloud-infra", stars: 98, updated: "2d ago", status: "Planning" },
  ],
};

export const financeData = {
  overview: {
    totalAUM: "$12.8M",
    dailyChange: "+$184k",
    secureReserves: "$4.1M",
    runRate: "18.4 months",
  },
  categories: [
    {
      id: "finance-1",
      label: "Cash & Equivalents",
      allocation: "32%",
      balance: "$4.1M",
      change: "+$52k",
      accounts: [
        { label: "Silicon Valley Bridge", balance: "$2.7M", insured: true },
        { label: "US Treasuries", balance: "$1.4M", insured: true },
      ],
    },
    {
      id: "finance-2",
      label: "Equity Portfolio",
      allocation: "28%",
      balance: "$3.6M",
      change: "+$88k",
      accounts: [
        { label: "AI Infrastructure ETF", balance: "$1.9M", insured: false },
        { label: "Global Supply Chain Fund", balance: "$1.7M", insured: false },
      ],
    },
    {
      id: "finance-3",
      label: "Crypto & Digital",
      allocation: "16%",
      balance: "$2.0M",
      change: "-$36k",
      accounts: [
        { label: "BTC Cold Storage", balance: "$1.5M", insured: false },
        { label: "ETH Staking Pool", balance: "$0.5M", insured: false },
      ],
    },
    {
      id: "finance-4",
      label: "Operations",
      allocation: "24%",
      balance: "$3.1M",
      change: "+$80k",
      accounts: [
        { label: "Payroll Reserve", balance: "$1.2M", insured: true },
        { label: "Vendor Escrow", balance: "$1.9M", insured: true },
      ],
    },
  ],
  auditTrail: [
    { id: "audit-1", event: "Multi-sig approval", detail: "Ops issued vendor payment · 07:45 UTC", status: "Verified" },
    { id: "audit-2", event: "Policy update", detail: "Treasury allocation rules refreshed · 05:18 UTC", status: "Signed" },
    { id: "audit-3", event: "Access review", detail: "Quarterly finance access audit complete · Yesterday", status: "Filed" },
  ],
};

export const vaultDataset = {
  news: newsItems,
  updates: updateItems,
  profile: profileData,
  contacts: contactData,
  code: codeData,
  online: onlineData,
  finances: financeData,
};
