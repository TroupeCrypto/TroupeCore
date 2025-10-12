"use client";

import { useEffect } from "react";
import { ensureSafeConsole } from "../../lib/utils/safe-console";

export default function SafeConsoleClient() {
  useEffect(() => {
    ensureSafeConsole();
  }, []);

  return null;
}
