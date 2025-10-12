import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useDashboardStore = create(
  persist(
    (set, get) => ({
      layouts: {},
      widgets: ["sys:load", "sys:memory"],
      widgetConfigs: {},
      isAddWidgetOpen: false,
      setLayouts: (layouts) => set({ layouts }),
      setWidgets: (widgets) => set({ widgets }),
      setWidgetConfig: (id, config) =>
        set({ widgetConfigs: { ...get().widgetConfigs, [id]: { ...(get().widgetConfigs[id] || {}), ...config } } }),
      openAddWidget: () => set({ isAddWidgetOpen: true }),
      closeAddWidget: () => set({ isAddWidgetOpen: false }),
    }),
    { name: "dashboard-state" }
  )
);
