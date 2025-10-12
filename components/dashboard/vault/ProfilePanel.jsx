import Link from "next/link";

export default function ProfilePanel({ profile }) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <section className="space-y-4 rounded-2xl border border-[#0f3f1b] bg-black/60 p-5 lg:col-span-2">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-white">{profile.name}</h3>
            <p className="text-sm text-zinc-400">{profile.title}</p>
          </div>
          <div className="rounded-xl border border-[#0f3f1b] bg-zinc-900/40 px-3 py-2 text-xs">
            <div className="flex items-center justify-between text-[#00ff41]">
              <span>Session</span>
              <span className="font-semibold">{profile.session.status}</span>
            </div>
            <div className="mt-1 text-zinc-500">{profile.session.device}</div>
            <div className="text-zinc-500">Expires in {profile.session.expiresIn}</div>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[#0f3f1b] bg-zinc-900/40 p-4 text-sm text-zinc-300">
            <div className="text-xs uppercase tracking-[0.15em] text-[#00ff41]/80">Identity</div>
            <div className="mt-2 space-y-1">
              <div>{profile.email}</div>
              <div>{profile.phone}</div>
            </div>
          </div>
          <div className="rounded-xl border border-[#0f3f1b] bg-zinc-900/40 p-4 text-sm text-zinc-300">
            <div className="text-xs uppercase tracking-[0.15em] text-[#00ff41]/80">Security posture</div>
            <div className="mt-2 space-y-1 text-zinc-400">
              <div>{profile.security.encryption}</div>
              <div>{profile.security.database}</div>
              <div>{profile.security.backups}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00ff41]/70">Key documents</h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {profile.documents.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between rounded-lg border border-[#0f3f1b] bg-zinc-900/40 p-3">
                  <div>
                    <div>{doc.label}</div>
                    <div className="text-xs text-zinc-500">Updated {doc.updated}</div>
                  </div>
                  <span className="text-xs text-zinc-500">{doc.sensitivity}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00ff41]/70">Credentials</h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {profile.credentials.map((cred) => (
                <li key={cred.id} className="flex items-center justify-between gap-3 rounded-lg border border-[#0f3f1b] bg-zinc-900/40 p-3">
                  <div>
                    <div>{cred.label}</div>
                    <div className="text-xs text-zinc-500">{cred.rotation}</div>
                  </div>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs ${
                      cred.encrypted ? "border-[#00ff41]/40 text-[#00ff41]" : "border-amber-500/40 text-amber-300"
                    }`}
                  >
                    {cred.encrypted ? "Encrypted" : "Needs rotation"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <aside className="space-y-4 rounded-2xl border border-[#0f3f1b] bg-black/60 p-5">
        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00ff41]/70">Quick links</h4>
        <ul className="space-y-2 text-sm text-zinc-300">
          {profile.quickLinks.map((link) => (
            <li key={link.id}>
              <Link href={link.href} className="flex items-center justify-between gap-2 rounded-lg border border-transparent px-3 py-2 transition hover:border-[#00ff41]/40 hover:text-white">
                <span>{link.label}</span>
                <span className="text-[#00ff41]">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
