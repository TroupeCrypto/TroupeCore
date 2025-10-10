"use client";

import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useRouter } from "next/navigation";
import { useDashboardStore } from "../../lib/state/dashboardStore";
import WidgetCard from "../widgets/WidgetCard";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

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

const COLORS = ["#8b5cf6", "#22d3ee", "#f472b6", "#f59e0b"];

function generateTimeseries() {
  const now = Date.now();
  return Array.from({ length: 24 }).map((_, i) => ({
    t: new Date(now - (23 - i) * 3600_000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    v: Math.round(100 + Math.random() * 200),
  }));
}

const ts = generateTimeseries();

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
          <div className="text-3xl font-semibold">$124,230</div>
        </WidgetCard>
      </div>
      <div key="kpi2">
        <WidgetCard title="Active Users" onClick={() => handleOpen("active-users")} footer={"Realtime"}>
          <div className="text-3xl font-semibold">2,341</div>
        </WidgetCard>
      </div>
      <div key="kpi3">
        <WidgetCard title="Conversion" onClick={() => handleOpen("conversion")} footer={"7-day avg"}>
          <div className="text-3xl font-semibold">3.9%</div>
        </WidgetCard>
      </div>
      <div key="kpi4">
        <WidgetCard title="Churn" onClick={() => handleOpen("churn")} footer={"Monthly"}>
          <div className="text-3xl font-semibold">1.2%</div>
        </WidgetCard>
      </div>
      <div key="line">
        <WidgetCard title="Traffic" onClick={() => handleOpen("traffic")}> 
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ts}>
                <XAxis dataKey="t" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid #27272a" }} />
                <Line type="monotone" dataKey="v" stroke="#22d3ee" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </WidgetCard>
      </div>
      <div key="bar">
        <WidgetCard title="Revenue by Channel" onClick={() => handleOpen("revenue-by-channel")}>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ k: "Ads", v: 400 }, { k: "Organic", v: 650 }, { k: "Referral", v: 300 }] }>
                <XAxis dataKey="k" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip contentStyle={{ background: "#111", border: "1px solid #27272a" }} />
                <Bar dataKey="v" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </WidgetCard>
      </div>
      <div key="pie">
        <WidgetCard title="User Segments" onClick={() => handleOpen("segments")}>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{ name: "Free", value: 400 }, { name: "Pro", value: 300 }, { name: "Team", value: 200 }, { name: "Enterprise", value: 80 }]} dataKey="value" nameKey="name" innerRadius={30} outerRadius={48} paddingAngle={2}>
                  {COLORS.map((c, i) => (
                    <Cell key={i} fill={c} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#111", border: "1px solid #27272a" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </WidgetCard>
      </div>
      <div key="table">
        <WidgetCard title="Top Accounts" onClick={() => handleOpen("accounts")}> 
          <div className="text-sm text-zinc-400">
            <div className="grid grid-cols-4 gap-2 border-b border-zinc-800 pb-2 text-zinc-500">
              <div>Account</div><div>MRR</div><div>Users</div><div>Status</div>
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-2 border-b border-zinc-900 py-2">
                <div>Company {i + 1}</div>
                <div>${(1000 + i * 123).toLocaleString()}</div>
                <div>{Math.round(10 + Math.random() * 40)}</div>
                <div className="text-emerald-400">Active</div>
              </div>
            ))}
          </div>
        </WidgetCard>
      </div>
    </ResponsiveGridLayout>
  );
}
