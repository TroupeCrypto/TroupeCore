import VaultDashboard from "../../../components/dashboard/VaultDashboard";

export const metadata = { title: "Vault Dashboard" };

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Vault mission control</h1>
          <p className="text-sm text-zinc-500">
            Connect news, system telemetry, and finance intelligence into a single encrypted cockpit. Every panel is
            ready for live production data the moment integrations sync.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span className="rounded-full border border-[#00ff41]/40 px-3 py-1 text-[#00ff41]">Encrypted workspace</span>
          <span>PostgreSQL · Immutable backups · SOC 2 Type II</span>
        </div>
      </div>
      <VaultDashboard />
    </div>
  );
}
