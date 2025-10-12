export async function GET() {
  return Response.json({
    metrics: {
      revenue: 124230,
      activeUsers: 2341,
      conversion: 0.039,
      churn: 0.012,
    },
    breakdowns: {
      channels: [
        { key: "Ads", value: 400 },
        { key: "Organic", value: 650 },
        { key: "Referral", value: 300 },
      ],
      segments: [
        { name: "Free", value: 400 },
        { name: "Pro", value: 300 },
        { name: "Team", value: 200 },
        { name: "Enterprise", value: 80 },
      ],
    },
  });
}
