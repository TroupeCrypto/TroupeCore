import DashboardGrid from "../../../components/dashboard/DashboardGrid";
import DataInspector from "../../../components/dashboard/DataInspector";

export const metadata = { title: "Admin Dashboard" };

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome to Troupe Core</h1>
          <p className="text-sm text-zinc-500">
            Connect your production systems to turn these tiles into live intelligence. We do not seed demo
            metrics—everything becomes actionable once integrations are installed.
          </p>
        </div>
      </div>
      <DashboardGrid />
      <DataInspector />
    </div>
  );
}
