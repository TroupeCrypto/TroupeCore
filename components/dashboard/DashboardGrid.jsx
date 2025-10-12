"use client";

import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "../../lib/state/dashboardStore";
import WidgetCard from "../widgets/WidgetCard";

const ResponsiveGridLayout = WidthProvider(Responsive);

const defaultLayouts = {
  lg: [
    { i: "kpi1", x: 0, y: 0, w: 3, h: 3 },
    { i: "kpi2", x: 3, y: 0, w: 3, h: 3 },
    { i: "kpi3", x: 6, y: 0, w: 3, h: 3 },
    { i: "kpi4", x: 9, y: 0, w: 3, h: 3 },
    { i: "line", x: 0, y: 3, w: 6, h: 7 },
    { i: "bar", x: 6, y: 3, w: 6, h: 7 },
    { i: "pie", x: 0, y: 10, w: 4, h: 6 },
    { i: "table", x: 4, y: 10, w: 8, h: 6 },
  ],
};

export default function DashboardGrid() {
  const router = useRouter();
  const { layouts, setLayouts } = useDashboardStore();

  const handleOpen = (slug) => {
    router.push(`/analytics/${slug}`);
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={Object.keys(layouts).length ? layouts : defaultLayouts}
      onLayoutChange={(layout, allLayouts) => setLayouts(allLayouts)}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 }}
      rowHeight={28}
      draggableHandle=".text-sm"
      isBounded
      margin={[12, 12]}
    >
      <div key="kpi1">
        <WidgetCard title="Revenue" onClick={() => handleOpen("revenue")}
          footer={"Last 24h"}>
          <div className="text-sm text-zinc-500 italic">Connect data source to view metrics</div>
        </WidgetCard>
      </div>
      <div key="kpi2">
        <WidgetCard title="Active Users" onClick={() => handleOpen("active-users")} footer={"Realtime"}>
          <div className="text-sm text-zinc-500 italic">Connect data source to view metrics</div>
        </WidgetCard>
      </div>
      <div key="kpi3">
        <WidgetCard title="Conversion" onClick={() => handleOpen("conversion")} footer={"7-day avg"}>
          <div className="text-sm text-zinc-500 italic">Connect data source to view metrics</div>
        </WidgetCard>
      </div>
      <div key="kpi4">
        <WidgetCard title="Churn" onClick={() => handleOpen("churn")} footer={"Monthly"}>
          <div className="text-sm text-zinc-500 italic">Connect data source to view metrics</div>
        </WidgetCard>
      </div>
      <div key="line">
        <WidgetCard title="Traffic" onClick={() => handleOpen("traffic")}> 
          <div className="h-56 flex items-center justify-center">
            <div className="text-sm text-zinc-500 italic">Connect data source to view traffic data</div>
          </div>
        </WidgetCard>
      </div>
      <div key="bar">
        <WidgetCard title="Revenue by Channel" onClick={() => handleOpen("revenue-by-channel")}>
          <div className="h-56 flex items-center justify-center">
            <div className="text-sm text-zinc-500 italic">Connect data source to view channel data</div>
          </div>
        </WidgetCard>
      </div>
      <div key="pie">
        <WidgetCard title="User Segments" onClick={() => handleOpen("segments")}>
          <div className="h-48 flex items-center justify-center">
            <div className="text-sm text-zinc-500 italic">Connect data source to view segments</div>
          </div>
        </WidgetCard>
      </div>
      <div key="table">
        <WidgetCard title="Top Accounts" onClick={() => handleOpen("accounts")}> 
          <div className="text-sm text-zinc-400">
            <div className="grid grid-cols-4 gap-2 border-b border-zinc-800 pb-2 text-zinc-500">
              <div>Account</div><div>MRR</div><div>Users</div><div>Status</div>
            </div>
            <div className="py-8 text-center text-zinc-500 italic">
              Connect data source to view account data
            </div>
          </div>
        </WidgetCard>
      </div>
    </ResponsiveGridLayout>
  );
}
