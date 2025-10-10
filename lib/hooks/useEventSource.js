"use client";

import { useEffect, useRef, useState } from "react";

export function useEventSource(url) {
  const [lastEvent, setLastEvent] = useState(null);
  const esRef = useRef(null);
  useEffect(() => {
    const es = new EventSource(url);
    esRef.current = es;
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setLastEvent(data);
      } catch {}
    };
    return () => {
      es.close();
    };
  }, [url]);
  return lastEvent;
}
