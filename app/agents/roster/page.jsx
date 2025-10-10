import DashboardLayout from '@/components/layout/DashboardLayout'
import AgentRoster from '@/components/agents/AgentRoster'

export const metadata = {
  title: 'AI Agent Roster - Advanced Dashboard',
  description: 'Manage and monitor AI agents and their performance',
}

export default function AgentRosterPage() {
  return (
    <DashboardLayout>
      <AgentRoster />
    </DashboardLayout>
  )
}