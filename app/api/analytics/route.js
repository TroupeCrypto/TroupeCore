export async function GET() {
  return Response.json({
    metrics: {},
    breakdowns: {
      channels: [],
      segments: [],
    },
  });
}
