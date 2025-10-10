'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, 
  Users, 
  Eye, 
  MousePointer, 
  Globe, 
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts'

// Mock real-time data generator
function generateRealTimeData() {
  return {
    activeUsers: Math.floor(Math.random() * 500) + 100,
    pageViews: Math.floor(Math.random() * 1000) + 200,
    events: Math.floor(Math.random() * 200) + 50,
    conversions: Math.floor(Math.random() * 20) + 5,
    bounceRate: (Math.random() * 30 + 20).toFixed(1),
    avgSessionDuration: Math.floor(Math.random() * 300) + 120,
  }
}

function generateTimeSeriesPoint() {
  return {
    timestamp: new Date().toISOString(),
    users: Math.floor(Math.random() * 100) + 50,
    pageViews: Math.floor(Math.random() * 200) + 100,
    events: Math.floor(Math.random() * 50) + 20
  }
}

function generateTopPages() {
  const pages = [
    '/dashboard',
    '/analytics',
    '/users',
    '/settings',
    '/reports',
    '/profile',
    '/billing',
    '/integrations'
  ]
  
  return pages.map(page => ({
    path: page,
    views: Math.floor(Math.random() * 100) + 10,
    uniqueViews: Math.floor(Math.random() * 80) + 5,
    trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable'
  })).sort((a, b) => b.views - a.views).slice(0, 5)
}

function generateDeviceData() {
  return [
    { device: 'Desktop', count: Math.floor(Math.random() * 200) + 100, icon: Monitor },
    { device: 'Mobile', count: Math.floor(Math.random() * 150) + 80, icon: Smartphone },
    { device: 'Tablet', count: Math.floor(Math.random() * 50) + 20, icon: Tablet }
  ]
}

function generateLocationData() {
  const locations = [
    'United States', 'United Kingdom', 'Canada', 'Germany', 'France',
    'Australia', 'Japan', 'Brazil', 'India', 'Netherlands'
  ]
  
  return locations.map(location => ({
    country: location,
    users: Math.floor(Math.random() * 50) + 10,
    percentage: (Math.random() * 20 + 5).toFixed(1)
  })).sort((a, b) => b.users - a.users).slice(0, 6)
}

export default function RealTimeAnalytics() {
  const [realTimeData, setRealTimeData] = useState(generateRealTimeData())
  const [timeSeriesData, setTimeSeriesData] = useState([])
  const [topPages, setTopPages] = useState(generateTopPages())
  const [deviceData, setDeviceData] = useState(generateDeviceData())
  const [locationData, setLocationData] = useState(generateLocationData())
  const [isConnected, setIsConnected] = useState(true)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(generateRealTimeData())
      setTopPages(generateTopPages())
      setDeviceData(generateDeviceData())
      setLocationData(generateLocationData())
      
      // Add new point to time series (keep last 20 points)
      setTimeSeriesData(prev => {
        const newPoint = generateTimeSeriesPoint()
        const updated = [...prev, newPoint].slice(-20)
        return updated
      })
    }, 2000) // Update every 2 seconds

    // Initialize time series data
    const initialData = []
    for (let i = 19; i >= 0; i--) {
      const timestamp = new Date(Date.now() - i * 2000)
      initialData.push({
        timestamp: timestamp.toISOString(),
        users: Math.floor(Math.random() * 100) + 50,
        pageViews: Math.floor(Math.random() * 200) + 100,
        events: Math.floor(Math.random() * 50) + 20
      })
    }
    setTimeSeriesData(initialData)

    return () => clearInterval(interval)
  }, [])

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-400" />
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-400" />
      default:
        return <Minus className="h-3 w-3 text-gray-400" />
    }
  }

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Real-time Analytics</h1>
          <p className="text-gray-400 mt-1">
            Live data streaming and real-time insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-400">
              {isConnected ? 'Live Stream Active' : 'Connection Lost'}
            </span>
          </div>
          <div className="text-sm text-gray-400">
            Updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Real-time Metrics */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="widget-container">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Active Users</p>
                  <p className="text-2xl font-bold text-white">{realTimeData.activeUsers}</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="widget-container">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Page Views</p>
                  <p className="text-2xl font-bold text-white">{realTimeData.pageViews}</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Eye className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="widget-container">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Events</p>
                  <p className="text-2xl font-bold text-white">{realTimeData.events}</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Activity className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="widget-container">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Conversions</p>
                  <p className="text-2xl font-bold text-white">{realTimeData.conversions}</p>
                </div>
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <MousePointer className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Real-time Chart */}
        <motion.div variants={itemVariants}>
          <div className="widget-container">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Live Activity</h3>
                <p className="text-sm text-gray-400">Real-time user activity stream</p>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeSeriesData}>
                  <defs>
                    <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="pageViewsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="#9ca3af"
                    tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                  />
                  <YAxis stroke="#9ca3af" />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    fill="url(#usersGradient)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="pageViews"
                    stroke="#10b981"
                    fill="url(#pageViewsGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Secondary Metrics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Pages */}
          <motion.div variants={itemVariants}>
            <div className="widget-container">
              <h3 className="text-lg font-semibold text-white mb-4">Top Pages</h3>
              <div className="space-y-3">
                {topPages.map((page, index) => (
                  <div key={page.path} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-mono text-gray-400">#{index + 1}</span>
                      <span className="text-sm text-white">{page.path}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">{page.views}</span>
                      {getTrendIcon(page.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Device Breakdown */}
          <motion.div variants={itemVariants}>
            <div className="widget-container">
              <h3 className="text-lg font-semibold text-white mb-4">Devices</h3>
              <div className="space-y-3">
                {deviceData.map((device) => {
                  const Icon = device.icon
                  const total = deviceData.reduce((sum, d) => sum + d.count, 0)
                  const percentage = ((device.count / total) * 100).toFixed(1)
                  
                  return (
                    <div key={device.device} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-white">{device.device}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">{device.count}</span>
                        <span className="text-xs text-gray-500">({percentage}%)</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Top Locations */}
          <motion.div variants={itemVariants}>
            <div className="widget-container">
              <h3 className="text-lg font-semibold text-white mb-4">Top Locations</h3>
              <div className="space-y-3">
                {locationData.map((location, index) => (
                  <div key={location.country} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-white">{location.country}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">{location.users}</span>
                      <span className="text-xs text-gray-500">({location.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}