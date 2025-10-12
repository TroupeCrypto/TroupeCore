export async function GET() {
  return Response.json({
    agents: [
      { id: "sales", name: "Sales Agent", status: "online", skills: ["Leads", "Outbound"], mrrImpact: 34 },
      { id: "support", name: "Support Agent", status: "online", skills: ["Tickets", "FAQ"], mrrImpact: 12 },
      { id: "revops", name: "RevOps Agent", status: "idle", skills: ["Forecast", "Churn"], mrrImpact: 18 },
    ],
  });
}
