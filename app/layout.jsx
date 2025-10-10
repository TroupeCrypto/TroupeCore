import "../styles/globals.css";
import ThemeProviderClient from "../components/layout/ThemeProvider";

export const metadata = { title: "Troupe Inc", description: "Welcome" };
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProviderClient>{children}</ThemeProviderClient>
      </body>
    </html>
  );
}
