import "../styles/globals.css";

export const metadata = { title: "Troupe Inc", description: "Welcome" };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
