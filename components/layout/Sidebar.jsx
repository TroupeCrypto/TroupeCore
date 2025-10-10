'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, 
  Users, 
  Settings, 
  Database, 
  Bot, 
  TrendingUp, 
  PieChart, 
  Activity, 
  Zap, 
  Globe, 
  Shield, 
  Cpu,
  ChevronDown,
  ChevronRight,
  Home,
  Filter,
  Layers,
  Target,
  Brain,
  Network
} from 'lucide-react'
import { useDashboardStore } from '@/lib/stores/dashboardStore'

const navigation = [
  {
    name: 'Overview',
    href: '/',
    icon: Home,
    current: true,
  },
  {
    name: 'Analytics',
    icon: BarChart3,
    children: [
      { name: 'Real-time Analytics', href: '/analytics/realtime', icon: Activity },
      { name: 'Performance Metrics', href: '/analytics/performance', icon: TrendingUp },
      { name: 'User Behavior', href: '/analytics/behavior', icon: Users },
      { name: 'Revenue Analytics', href: '/analytics/revenue', icon: PieChart },
      { name: 'Custom Reports', href: '/analytics/reports', icon: Filter },
    ],
  },
  {
    name: 'AI Agents',
    icon: Bot,
    children: [
      { name: 'Agent Roster', href: '/agents/roster', icon: Users },
      { name: 'Performance', href: '/agents/performance', icon: Brain },
      { name: 'Training Data', href: '/agents/training', icon: Database },
      { name: 'Deployment', href: '/agents/deployment', icon: Zap },
    ],
  },
  {
    name: 'Data Sources',
    icon: Database,
    children: [
      { name: 'Database Connections', href: '/data/databases', icon: Database },
      { name: 'API Integrations', href: '/data/apis', icon: Network },
      { name: 'Real-time Streams', href: '/data/streams', icon: Activity },
      { name: 'Data Pipeline', href: '/data/pipeline', icon: Layers },
    ],
  },
  {
    name: 'Monitoring',
    icon: Activity,
    children: [
      { name: 'System Health', href: '/monitoring/health', icon: Cpu },
      { name: 'Security', href: '/monitoring/security', icon: Shield },
      { name: 'Performance', href: '/monitoring/performance', icon: TrendingUp },
      { name: 'Alerts', href: '/monitoring/alerts', icon: Target },
    ],
  },
  {
    name: 'Integrations',
    href: '/integrations',
    icon: Globe,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed } = useDashboardStore()
  const [expandedItems, setExpandedItems] = useState(['Analytics'])

  const toggleExpanded = (itemName) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    )
  }

  return (
    <div className="h-full bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-700">
        <motion.div
          animate={{ scale: sidebarCollapsed ? 0.8 : 1 }}
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-xl font-bold text-white whitespace-nowrap overflow-hidden"
              >
                Analytics Pro
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    expandedItems.includes(item.name)
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="flex-1 text-left whitespace-nowrap overflow-hidden"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {expandedItems.includes(item.name) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
                
                <AnimatePresence>
                  {expandedItems.includes(item.name) && !sidebarCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-4 mt-1 space-y-1"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                            pathname === child.href
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                          }`}
                        >
                          <child.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                          {child.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  pathname === item.href
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">A</span>
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="ml-3 overflow-hidden"
              >
                <p className="text-sm font-medium text-white whitespace-nowrap">Admin User</p>
                <p className="text-xs text-gray-400 whitespace-nowrap">admin@company.com</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}