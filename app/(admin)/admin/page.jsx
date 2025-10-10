import dynamic from "next/dynamic";
const DashboardGrid = dynamic(() => import("../../../components/dashboard/DashboardGrid"), { ssr: false });
const DataInspector = dynamic(() => import("../../../components/dashboard/DataInspector"), { ssr: false });
const AddWidgetModal = dynamic(() => import("../../../components/dashboard/AddWidgetModal"), { ssr: false });

export const metadata = { title: "Admin Dashboard" };

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-zinc-500">Drag, resize, and click any widget for deep analytics.</p>
        </div>
      </div>
      <DashboardGrid />
      <AddWidgetModal />
      <DataInspector />
    </div>
  );
}
