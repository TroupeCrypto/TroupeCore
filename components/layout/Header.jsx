'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  User, 
  Moon, 
  Sun, 
  Maximize, 
  Minimize,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import { useDashboardStore } from '@/lib/stores/dashboardStore'

export default function Header() {
  const { sidebarCollapsed, setSidebarCollapsed, darkMode, setDarkMode } = useDashboardStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [notifications] = useState([
    { id: 1, message: 'New user registered', time: '2 min ago', type: 'info' },
    { id: 2, message: 'Server performance alert', time: '5 min ago', type: 'warning' },
    { id: 3, message: 'Backup completed successfully', time: '10 min ago', type: 'success' },
  ])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search analytics, users, reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-64 pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Center Section - Page Title */}
        <div className="flex-1 flex justify-center">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-semibold text-white"
          >
            Advanced Analytics Dashboard
          </motion.h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Quick Actions */}
          <div className="flex items-center space-x-1 mr-4">
            <button
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200"
              title="Refresh Data"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            
            <button
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200"
              title="Filters"
            >
              <Filter className="h-4 w-4" />
            </button>
            
            <button
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200"
              title="Export Data"
            >
              <Download className="h-4 w-4" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200 relative">
              <Bell className="h-4 w-4" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

          {/* Settings */}
          <button className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200">
            <Settings className="h-4 w-4" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button className="flex items-center space-x-2 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors duration-200">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium">Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Status Bar */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>System Online</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Real-time Data Active</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span>3 AI Agents Running</span>
          </div>
        </div>
        <div className="text-right">
          <span>Last Updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </header>
  )
}