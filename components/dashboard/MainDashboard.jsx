'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import OverviewCards from './OverviewCards'
import AnalyticsChart from './AnalyticsChart'
import PerformanceMetrics from './PerformanceMetrics'
import UserActivityTable from './UserActivityTable'
import RevenueChart from './RevenueChart'
import AIAgentStatus from './AIAgentStatus'
import DataSourceStatus from './DataSourceStatus'
import CustomizationPanel from './CustomizationPanel'
import { useDashboardStore } from '@/lib/stores/dashboardStore'

export default function MainDashboard() {
  const { widgets, realTimeEnabled } = useDashboardStore()
  const [showCustomization, setShowCustomization] = useState(false)

  // Simulate real-time data updates
  useEffect(() => {
    if (!realTimeEnabled) return

    const interval = setInterval(() => {
      // This would typically trigger data refetches
      console.log('Real-time data update triggered')
    }, 30000)

    return () => clearInterval(interval)
  }, [realTimeEnabled])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 mt-1">
            Real-time analytics and comprehensive insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCustomization(!showCustomization)}
            className="btn-secondary"
          >
            Customize Dashboard
          </button>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <div className={`w-2 h-2 rounded-full ${realTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
            <span>{realTimeEnabled ? 'Live' : 'Static'}</span>
          </div>
        </div>
      </div>

      {/* Customization Panel */}
      {showCustomization && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <CustomizationPanel onClose={() => setShowCustomization(false)} />
        </motion.div>
      )}

      {/* Main Dashboard Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Overview Cards */}
        <motion.div variants={itemVariants}>
          <OverviewCards />
        </motion.div>

        {/* Main Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <AnalyticsChart />
          </motion.div>
          <motion.div variants={itemVariants}>
            <PerformanceMetrics />
          </motion.div>
        </div>

        {/* Secondary Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <RevenueChart />
          </motion.div>
          <motion.div variants={itemVariants}>
            <UserActivityTable />
          </motion.div>
        </div>

        {/* System Status Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <AIAgentStatus />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DataSourceStatus />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}