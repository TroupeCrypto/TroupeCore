import { ShieldCheck } from "lucide-react";

export const metadata = { title: "Sign in" };

function ProviderButton({ href, label }) {
  return (
    <a
      href={href}
      className="inline-flex w-full items-center justify-center rounded-md border border-indigo-500/60 bg-indigo-500/10 px-3 py-2 text-sm font-medium text-indigo-200 transition hover:border-indigo-400 hover:bg-indigo-500/20"
    >
      {label}
    </a>
  );
}

export default function LoginPage({ searchParams }) {
  const error = searchParams?.error;
  const nextPath = searchParams?.next;

  const githubHref = nextPath
    ? `/api/auth/github/login?next=${encodeURIComponent(nextPath)}`
    : "/api/auth/github/login";
  const googleHref = nextPath
    ? `/api/auth/google/login?next=${encodeURIComponent(nextPath)}`
    : "/api/auth/google/login";

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950/60 p-6">
        <div className="mb-4 flex items-center gap-2 text-zinc-100">
          <ShieldCheck className="h-5 w-5 text-[#00ff41]" />
          <h1 className="text-lg font-semibold">Secure sign in</h1>
        </div>
        <p className="mb-6 text-sm text-zinc-400">
          Continue with GitHub or Google. OAuth uses anti-CSRF state validation and secure HttpOnly sessions.
        </p>
        {error ? (
          <p className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            Authentication failed. Please try again.
          </p>
        ) : null}
        <div className="space-y-3">
          <ProviderButton href={githubHref} label="Continue with GitHub" />
          <ProviderButton href={googleHref} label="Continue with Google" />
        </div>
      </div>
    </main>
  );
}
