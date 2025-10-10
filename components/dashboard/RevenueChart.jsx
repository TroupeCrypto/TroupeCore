'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Target,
  CreditCard,
  Wallet,
  ArrowUpRight
} from 'lucide-react'

const revenueData = [
  { name: 'Subscriptions', value: 45000, color: '#3b82f6', percentage: 65 },
  { name: 'One-time Sales', value: 18000, color: '#10b981', percentage: 26 },
  { name: 'Consulting', value: 6000, color: '#f59e0b', percentage: 9 }
]

const monthlyData = [
  { month: 'Jan', revenue: 45000, target: 50000, growth: 12 },
  { month: 'Feb', revenue: 52000, target: 55000, growth: 15.5 },
  { month: 'Mar', revenue: 48000, target: 52000, growth: -7.7 },
  { month: 'Apr', revenue: 61000, target: 58000, growth: 27.1 },
  { month: 'May', revenue: 55000, target: 60000, growth: -9.8 },
  { month: 'Jun', revenue: 67000, target: 65000, growth: 21.8 }
]

const kpiData = [
  {
    title: 'Total Revenue',
    value: '$328,000',
    change: '+12.5%',
    changeType: 'positive',
    icon: DollarSign,
    color: 'green'
  },
  {
    title: 'Monthly Recurring',
    value: '$45,000',
    change: '+8.2%',
    changeType: 'positive',
    icon: CreditCard,
    color: 'blue'
  },
  {
    title: 'Average Order',
    value: '$127',
    change: '-2.1%',
    changeType: 'negative',
    icon: Wallet,
    color: 'purple'
  },
  {
    title: 'Conversion Rate',
    value: '4.8%',
    change: '+0.9%',
    changeType: 'positive',
    icon: Target,
    color: 'orange'
  }
]

export default function RevenueChart() {
  const [viewType, setViewType] = useState('breakdown') // 'breakdown' or 'trends'

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="widget-container"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Revenue Analytics</h3>
          <p className="text-sm text-gray-400">Financial performance overview</p>
        </div>
        <div className="flex bg-gray-700 rounded-md p-1">
          <button
            onClick={() => setViewType('breakdown')}
            className={`px-3 py-1 rounded text-sm ${
              viewType === 'breakdown' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Breakdown
          </button>
          <button
            onClick={() => setViewType('trends')}
            className={`px-3 py-1 rounded text-sm ${
              viewType === 'trends' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Trends
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-4 w-4 text-${kpi.color}-400`} />
                <span className={`text-xs font-medium ${
                  kpi.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <div>
                <p className="text-lg font-bold text-white">{kpi.value}</p>
                <p className="text-xs text-gray-400">{kpi.title}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Chart Area */}
      <div className="h-64">
        {viewType === 'breakdown' ? (
          <div className="flex items-center h-full">
            <div className="w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-1/2 pl-4">
              <div className="space-y-3">
                {revenueData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-300">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">
                        ${item.value.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">{item.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <ArrowUpRight className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-blue-200">
                    Revenue up 12.5% this month
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [
                  name === 'revenue' ? `$${value.toLocaleString()}` : `$${value.toLocaleString()}`,
                  name === 'revenue' ? 'Actual Revenue' : 'Target Revenue'
                ]}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Actual Revenue" />
              <Bar dataKey="target" fill="#6b7280" name="Target Revenue" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer Stats */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-gray-400">Growth Rate:</span>
              <span className="text-green-400 font-medium">+12.5%</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="text-gray-400">Target Achievement:</span>
              <span className="text-blue-400 font-medium">103.2%</span>
            </div>
          </div>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            View Detailed Report →
          </button>
        </div>
      </div>
    </motion.div>
  )
}