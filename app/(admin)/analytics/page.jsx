import Link from "next/link";

const items = [
  { slug: "revenue", title: "Revenue" },
  { slug: "active-users", title: "Active Users" },
  { slug: "conversion", title: "Conversion" },
  { slug: "churn", title: "Churn" },
  { slug: "traffic", title: "Traffic" },
  { slug: "revenue-by-channel", title: "Revenue by Channel" },
  { slug: "segments", title: "User Segments" },
  { slug: "accounts", title: "Top Accounts" },
];

export default function AnalyticsIndex() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-zinc-500">Choose a domain to explore deeply with customizable panels.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <Link key={i.slug} href={`/analytics/${i.slug}`} className="rounded-lg border border-zinc-800 p-4 hover:bg-zinc-900">
            <div className="text-lg font-medium">{i.title}</div>
            <div className="text-sm text-zinc-500">Open detailed analytics</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
