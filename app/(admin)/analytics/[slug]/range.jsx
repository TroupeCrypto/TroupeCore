"use client";

import { useState } from "react";
import { addDays, format } from "date-fns";

export function DateRangePicker() {
  const [start, setStart] = useState(addDays(new Date(), -7));
  const [end, setEnd] = useState(new Date());
  return (
    <div className="flex items-center gap-2 text-sm">
      <input
        type="date"
        value={format(start, "yyyy-MM-dd")}
        onChange={(e) => setStart(new Date(e.target.value))}
        className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1"
      />
      <span>→</span>
      <input
        type="date"
        value={format(end, "yyyy-MM-dd")}
        onChange={(e) => setEnd(new Date(e.target.value))}
        className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1"
      />
    </div>
  );
}
