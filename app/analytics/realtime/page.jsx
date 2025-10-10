import DashboardLayout from '@/components/layout/DashboardLayout'
import RealTimeAnalytics from '@/components/analytics/RealTimeAnalytics'

export const metadata = {
  title: 'Real-time Analytics - Advanced Dashboard',
  description: 'Live analytics and real-time data monitoring',
}

export default function RealTimeAnalyticsPage() {
  return (
    <DashboardLayout>
      <RealTimeAnalytics />
    </DashboardLayout>
  )
}