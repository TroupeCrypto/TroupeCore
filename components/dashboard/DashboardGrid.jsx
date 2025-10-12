"use client";

import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "../../lib/state/dashboardStore";
import WidgetCard from "../widgets/WidgetCard";
import dynamic from "next/dynamic";
import { widgetRegistry } from "../widgets/registry";

const ResponsiveGridLayout = WidthProvider(Responsive);

const defaultLayouts = { lg: [] };

export default function DashboardGrid() {
  const router = useRouter();
  const { layouts, setLayouts, widgets } = useDashboardStore();

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
      {widgets.map((wid, idx) => (
        <div key={wid} data-grid={{ w: 4, h: 4, x: (idx * 4) % 12, y: 0 }}>
          <WidgetCard title={widgetRegistry[wid]?.label || wid} onClick={() => handleOpen(wid.replace(":", "/"))}>
            <DynamicWidget widgetId={wid} />
          </WidgetCard>
        </div>
      ))}
    </ResponsiveGridLayout>
  );
}
