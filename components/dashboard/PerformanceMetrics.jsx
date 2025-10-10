'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Gauge, 
  Zap, 
  Clock, 
  Server,
  ArrowUp,
  ArrowDown,
  AlertTriangle
} from 'lucide-react'

const performanceData = {
  cpuUsage: { value: 68, status: 'warning', trend: 'up' },
  memoryUsage: { value: 45, status: 'good', trend: 'down' },
  diskUsage: { value: 82, status: 'critical', trend: 'up' },
  networkLatency: { value: 23, status: 'good', trend: 'stable' },
  responseTime: { value: 145, status: 'good', trend: 'down' },
  uptime: { value: 99.8, status: 'excellent', trend: 'stable' }
}

const statusColors = {
  excellent: 'text-emerald-400',
  good: 'text-green-400',
  warning: 'text-yellow-400',
  critical: 'text-red-400'
}

const statusBgColors = {
  excellent: 'bg-emerald-500/20',
  good: 'bg-green-500/20',
  warning: 'bg-yellow-500/20',
  critical: 'bg-red-500/20'
}

function CircularProgress({ value, max = 100, size = 80, strokeWidth = 8, color = '#3b82f6' }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / max) * circumference

  return (
    <div className="relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#374151"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-white">{value}%</span>
      </div>
    </div>
  )
}

function TrendIcon({ trend }) {
  switch (trend) {
    case 'up':
      return <ArrowUp className="h-3 w-3 text-red-400" />
    case 'down':
      return <ArrowDown className="h-3 w-3 text-green-400" />
    default:
      return <div className="h-3 w-3 rounded-full bg-gray-400" />
  }
}

export default function PerformanceMetrics() {
  const [metrics, setMetrics] = useState(performanceData)
  const [alerts, setAlerts] = useState([
    { id: 1, message: 'High disk usage detected', severity: 'warning', time: '2 min ago' },
    { id: 2, message: 'CPU spike in web server', severity: 'info', time: '5 min ago' }
  ])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpuUsage: { 
          ...prev.cpuUsage, 
          value: Math.max(0, Math.min(100, prev.cpuUsage.value + (Math.random() - 0.5) * 10))
        },
        memoryUsage: { 
          ...prev.memoryUsage, 
          value: Math.max(0, Math.min(100, prev.memoryUsage.value + (Math.random() - 0.5) * 5))
        }
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="widget-container h-96 overflow-y-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
          <p className="text-sm text-gray-400">Real-time system monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-400">Live</span>
        </div>
      </div>

      {/* CPU and Memory Usage */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <CircularProgress 
            value={Math.round(metrics.cpuUsage.value)} 
            color="#f59e0b"
            size={70}
          />
          <div className="mt-2">
            <div className="flex items-center justify-center space-x-1">
              <span className="text-sm font-medium text-white">CPU</span>
              <TrendIcon trend={metrics.cpuUsage.trend} />
            </div>
            <span className={`text-xs ${statusColors[metrics.cpuUsage.status]}`}>
              {metrics.cpuUsage.status.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="text-center">
          <CircularProgress 
            value={Math.round(metrics.memoryUsage.value)} 
            color="#10b981"
            size={70}
          />
          <div className="mt-2">
            <div className="flex items-center justify-center space-x-1">
              <span className="text-sm font-medium text-white">Memory</span>
              <TrendIcon trend={metrics.memoryUsage.trend} />
            </div>
            <span className={`text-xs ${statusColors[metrics.memoryUsage.status]}`}>
              {metrics.memoryUsage.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Other Metrics */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Server className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-white">Disk Usage</p>
              <p className="text-xs text-gray-400">Storage utilization</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-white">{metrics.diskUsage.value}%</span>
            <TrendIcon trend={metrics.diskUsage.trend} />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Zap className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-sm font-medium text-white">Response Time</p>
              <p className="text-xs text-gray-400">Average response</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-white">{metrics.responseTime.value}ms</span>
            <TrendIcon trend={metrics.responseTime.trend} />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm font-medium text-white">Uptime</p>
              <p className="text-xs text-gray-400">System availability</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-white">{metrics.uptime.value}%</span>
            <TrendIcon trend={metrics.uptime.trend} />
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-white mb-2 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-yellow-400" />
            Recent Alerts
          </h4>
          <div className="space-y-2">
            {alerts.map(alert => (
              <div key={alert.id} className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-xs text-yellow-200">{alert.message}</p>
                <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}