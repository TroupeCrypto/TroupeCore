"use client";

import { ThemeProvider } from "next-themes";

import SafeConsoleClient from "./SafeConsoleClient";

export default function ThemeProviderClient({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <SafeConsoleClient />
      {children}
    </ThemeProvider>
  );
}
