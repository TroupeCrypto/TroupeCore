export function Card({ className = "", children }) {
  return <div className={`rounded-xl border border-zinc-800 bg-zinc-950/60 ${className}`}>{children}</div>;
}

export function CardHeader({ className = "", children }) {
  return <div className={`flex items-center justify-between p-4 ${className}`}>{children}</div>;
}

export function CardContent({ className = "", children }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardFooter({ className = "", children }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
