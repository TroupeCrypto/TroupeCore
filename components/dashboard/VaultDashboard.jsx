"use client";

import { useState } from "react";
import Link from "next/link";
import { newsItems, updateItems, profileData, contactData, codeData, onlineData, financeData } from "../../lib/data/vault";
import NewsPanel from "./vault/NewsPanel";
import UpdatesPanel from "./vault/UpdatesPanel";
import ProfilePanel from "./vault/ProfilePanel";
import ContactsPanel from "./vault/ContactsPanel";
import CodePanel from "./vault/CodePanel";
import OnlinePanel from "./vault/OnlinePanel";
import FinancesPanel from "./vault/FinancesPanel";

const tabs = [
  { id: "news", label: "News", description: "AI-curated market signals" },
  { id: "updates", label: "Updates", description: "Systems intelligence" },
  { id: "profile", label: "Admin Profile", description: "Operator dossier" },
  { id: "contacts", label: "Contacts", description: "TTM autograph network" },
  { id: "code", label: "Code", description: "Engineering inventory" },
  { id: "online", label: "Online", description: "Agents & footprint" },
  { id: "finances", label: "Finances", description: "Treasury overview" },
];

const panelMap = {
  news: () => <NewsPanel items={newsItems} />,
  updates: () => <UpdatesPanel items={updateItems} />,
  profile: () => <ProfilePanel profile={profileData} />,
  contacts: () => <ContactsPanel data={contactData} />,
  code: () => <CodePanel data={codeData} />,
  online: () => <OnlinePanel data={onlineData} />,
  finances: () => <FinancesPanel data={financeData} />,
};

export default function VaultDashboard() {
  const [activeTab, setActiveTab] = useState("news");
  const active = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-[#0b3117] bg-[#031407] text-sm shadow-[0_0_60px_rgba(0,255,65,0.08)]">
        <div className="grid gap-6 border-b border-[#0f3f1b] bg-gradient-to-r from-[#04280f] via-[#021808] to-black p-6 md:grid-cols-3">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#00ff41]/60">Vault Control</span>
            <h2 className="text-2xl font-semibold text-white">Autonomous operations cockpit</h2>
            <p className="max-w-md text-sm leading-relaxed text-zinc-400">
              Every tile reflects live encrypted data as soon as integrations connect. Tabs below surface business,
              engineering, and treasury systems curated by your AI copilots.
            </p>
          </div>
          <div className="rounded-2xl border border-[#0f3f1b] bg-black/60 p-4">
            <div className="text-xs uppercase tracking-[0.15em] text-[#00ff41]/70">Session</div>
            <div className="mt-2 flex items-center justify-between text-sm text-zinc-300">
              <span>Verified biometric</span>
              <span className="rounded-full border border-[#00ff41]/40 px-2 py-0.5 text-xs text-[#00ff41]">Secure</span>
            </div>
            <div className="mt-4 text-xs text-zinc-500">
              Mac Studio · San Francisco · Expires in 45 min
            </div>
          </div>
          <div className="grid gap-3 md:grid-rows-2">
            <div className="rounded-2xl border border-[#0f3f1b] bg-black/60 p-4">
              <div className="text-xs uppercase tracking-[0.15em] text-[#00ff41]/70">Encryption</div>
              <p className="mt-2 text-sm text-zinc-300">AES-256 at rest · TLS 1.3 in transit</p>
              <p className="mt-1 text-xs text-zinc-500">PostgreSQL primary · Immutable backups 15 min cadence</p>
            </div>
            <div className="rounded-2xl border border-[#0f3f1b] bg-black/60 p-4">
              <div className="text-xs uppercase tracking-[0.15em] text-[#00ff41]/70">Automation</div>
              <p className="mt-2 text-sm text-zinc-300">AI agents orchestrate news, updates, and workflows</p>
              <Link href="/agents" className="mt-3 inline-flex text-xs font-medium text-[#00ff41] hover:underline">
                Configure copilots →
              </Link>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <div className="flex min-w-max gap-1 border-b border-[#0f3f1b] bg-black/70 px-4">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex min-w-[160px] flex-col gap-1 px-4 py-3 text-left transition ${
                    isActive
                      ? "text-white"
                      : "text-zinc-500 hover:text-zinc-200"
                  }`}
                  aria-selected={isActive}
                  role="tab"
                  id={`tab-${tab.id}`}
                >
                  <span className="text-sm font-semibold">{tab.label}</span>
                  <span className="text-xs text-zinc-500">{tab.description}</span>
                  {isActive ? (
                    <span className="absolute inset-x-4 bottom-1 h-0.5 rounded-full bg-[#00ff41]" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
        <div className="bg-black/80 p-6" role="tabpanel" aria-labelledby={`tab-${active.id}`}>
          {panelMap[activeTab]?.()}
        </div>
      </section>
    </div>
  );
}
