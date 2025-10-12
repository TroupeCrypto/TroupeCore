export const widgetRegistry = {
  "sys:cpu": {
    id: "sys:cpu",
    label: "CPU Load",
    component: () => import("./SystemLoadWidget"),
    default: { w: 4, h: 4 },
  },
  "sys:memory": {
    id: "sys:memory",
    label: "Memory Usage",
    component: () => import("./SystemMemoryWidget"),
    default: { w: 4, h: 4 },
  },
  "stripe:revenue": {
    id: "stripe:revenue",
    label: "Stripe Revenue",
    component: () => import("./StripeRevenueWidget"),
    default: { w: 4, h: 4 },
  },
};
