'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts'
import { 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Filter,
  Download,
  Maximize2
} from 'lucide-react'

// Sample data - in a real app, this would come from your API
const generateData = (days = 30) => {
  const data = []
  const baseDate = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() - i)
    
    data.push({
      date: date.toISOString().split('T')[0],
      users: Math.floor(Math.random() * 1000) + 500,
      sessions: Math.floor(Math.random() * 1500) + 800,
      pageviews: Math.floor(Math.random() * 3000) + 1500,
      revenue: Math.floor(Math.random() * 5000) + 2000,
      bounceRate: Math.random() * 30 + 20
    })
  }
  
  return data
}

const chartTypes = [
  { id: 'line', label: 'Line Chart', icon: TrendingUp },
  { id: 'area', label: 'Area Chart', icon: Activity },
  { id: 'bar', label: 'Bar Chart', icon: BarChart3 }
]

const metrics = [
  { key: 'users', label: 'Users', color: '#3b82f6' },
  { key: 'sessions', label: 'Sessions', color: '#10b981' },
  { key: 'pageviews', label: 'Page Views', color: '#f59e0b' },
  { key: 'revenue', label: 'Revenue', color: '#ef4444' }
]

export default function AnalyticsChart() {
  const [data, setData] = useState([])
  const [chartType, setChartType] = useState('line')
  const [selectedMetrics, setSelectedMetrics] = useState(['users', 'sessions'])
  const [timeRange, setTimeRange] = useState('30d')
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    setData(generateData(days))
  }, [timeRange])

  const toggleMetric = (metricKey) => {
    setSelectedMetrics(prev => 
      prev.includes(metricKey) 
        ? prev.filter(m => m !== metricKey)
        : [...prev, metricKey]
    )
  }

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    }

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              {metrics.map(metric => (
                <linearGradient key={metric.key} id={`gradient-${metric.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metric.color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={metric.color} stopOpacity={0.1}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Legend />
            {selectedMetrics.map(metricKey => {
              const metric = metrics.find(m => m.key === metricKey)
              return (
                <Area
                  key={metricKey}
                  type="monotone"
                  dataKey={metricKey}
                  stroke={metric.color}
                  fill={`url(#gradient-${metricKey})`}
                  name={metric.label}
                />
              )
            })}
          </AreaChart>
        )
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Legend />
            {selectedMetrics.map(metricKey => {
              const metric = metrics.find(m => m.key === metricKey)
              return (
                <Bar
                  key={metricKey}
                  dataKey={metricKey}
                  fill={metric.color}
                  name={metric.label}
                />
              )
            })}
          </BarChart>
        )
      
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px'
              }}
            />
            <Legend />
            {selectedMetrics.map(metricKey => {
              const metric = metrics.find(m => m.key === metricKey)
              return (
                <Line
                  key={metricKey}
                  type="monotone"
                  dataKey={metricKey}
                  stroke={metric.color}
                  strokeWidth={2}
                  dot={{ fill: metric.color, strokeWidth: 2, r: 4 }}
                  name={metric.label}
                />
              )
            })}
          </LineChart>
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="widget-container h-96"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Analytics Overview</h3>
          <p className="text-sm text-gray-400">Interactive data visualization</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-700 text-white text-sm rounded-md px-3 py-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          {/* Chart Type Selector */}
          <div className="flex bg-gray-700 rounded-md p-1">
            {chartTypes.map(type => {
              const Icon = type.icon
              return (
                <button
                  key={type.id}
                  onClick={() => setChartType(type.id)}
                  className={`p-1 rounded text-xs ${
                    chartType === type.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title={type.label}
                >
                  <Icon className="h-4 w-4" />
                </button>
              )
            })}
          </div>

          {/* Action Buttons */}
          <button className="p-1 text-gray-400 hover:text-white">
            <Filter className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 hover:text-white">
            <Download className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 text-gray-400 hover:text-white"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Metric Toggles */}
      <div className="flex flex-wrap gap-2 mb-4">
        {metrics.map(metric => (
          <button
            key={metric.key}
            onClick={() => toggleMetric(metric.key)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedMetrics.includes(metric.key)
                ? 'text-white'
                : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
            style={{
              backgroundColor: selectedMetrics.includes(metric.key) ? metric.color : undefined
            }}
          >
            {metric.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}